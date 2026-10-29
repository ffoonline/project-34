-- THIRTY FOUR — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db query`) on a fresh project.
-- Grants are explicit: tables are not assumed to be auto-exposed to the Data API.

create extension if not exists pgcrypto;

create schema if not exists shop;
revoke all on schema shop from public;
grant usage on schema shop to postgres, service_role, authenticated;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  subcategory text not null default 'tops',
  collection text not null default 'atelier',
  price numeric(12, 2) not null check (price > 0),
  compare_at numeric(12, 2),
  description text not null default '',
  story text not null default '',
  fabric text not null default '',
  care text not null default '',
  sizes text[] not null default array['M']::text[],
  colors jsonb not null default '[{"name":"Ink","hex":"#1a1714"}]'::jsonb,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  new_arrival boolean not null default true,
  best_seller boolean not null default false,
  demand text not null default 'steady' check (demand in ('high', 'steady', 'limited')),
  images text[] not null default array['/catalog/women-atelier.jpg']::text[],
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'received'
    check (status in ('received', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  channel text not null default 'checkout' check (channel in ('checkout', 'whatsapp', 'email')),
  currency text not null default 'USD' check (currency in ('USD', 'EUR', 'GBP')),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  shipping numeric(12, 2) not null check (shipping >= 0),
  total numeric(12, 2) not null check (total >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  customer_city text not null,
  customer_country text not null,
  customer_address text not null,
  customer_notes text,
  payment_method text not null default 'cod'
    check (payment_method in ('cod', 'transfer', 'whatsapp', 'stripe')),
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders (id) on delete cascade,
  product_id text not null references public.products (id),
  slug text not null,
  name text not null,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  qty integer not null check (qty > 0),
  size text not null default '',
  color text not null default '',
  image text
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint subscribers_email_unique unique (email)
);

create table if not exists public.contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists subscribers_email_lower_idx on public.subscribers (lower(email));
create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_price_idx on public.products (price);
create index if not exists products_featured_idx on public.products (featured) where featured;
create index if not exists products_new_idx on public.products (new_arrival) where new_arrival;
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_email_idx on public.orders (lower(customer_email));
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create unique index if not exists orders_stripe_pi_idx
  on public.orders (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);
create index if not exists profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- Helpers (private schema — not a public API)
-- ---------------------------------------------------------------------------

create or replace function shop.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function shop.is_admin() from public;
grant execute on function shop.is_admin() to authenticated;

create or replace function shop.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

revoke all on function shop.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function shop.handle_new_user();

-- Server-only order placement. Prices and stock come from products, never the client.
-- EXECUTE is granted only to service_role.
create or replace function shop.place_order(
  p_items jsonb,
  p_customer jsonb,
  p_currency text default 'USD',
  p_city text default 'Kabul',
  p_payment_method text default 'cod',
  p_channel text default 'checkout',
  p_stripe_payment_intent_id text default null,
  p_user_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := coalesce(p_user_id, auth.uid());
  v_subtotal numeric(12, 2) := 0;
  v_shipping numeric(12, 2);
  v_order_id text := 'ord-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  v_line jsonb;
  v_lines jsonb := '[]'::jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_lookup text;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Bag is empty' using errcode = 'P0001';
  end if;
  if coalesce(p_customer->>'name', '') = '' or coalesce(p_customer->>'email', '') = '' then
    raise exception 'Customer name and email are required' using errcode = 'P0001';
  end if;
  if p_currency not in ('USD', 'EUR', 'GBP') then
    p_currency := 'USD';
  end if;
  if p_payment_method not in ('cod', 'transfer', 'whatsapp', 'stripe') then
    p_payment_method := 'cod';
  end if;
  if p_channel not in ('checkout', 'whatsapp', 'email') then
    p_channel := 'checkout';
  end if;

  v_shipping := case
    when p_city = 'Kabul' then 0
    when p_city = 'International' then 38
    else 8
  end;

  if p_stripe_payment_intent_id is not null then
    if exists (
      select 1 from public.orders where stripe_payment_intent_id = p_stripe_payment_intent_id
    ) then
      return (
        select jsonb_build_object('id', id, 'duplicate', true)
        from public.orders
        where stripe_payment_intent_id = p_stripe_payment_intent_id
        limit 1
      );
    end if;
  end if;

  for v_line in select value from jsonb_array_elements(p_items)
  loop
    v_qty := floor(coalesce((v_line->>'qty')::numeric, 0));
    if v_qty < 1 then
      raise exception 'Invalid quantity' using errcode = 'P0001';
    end if;
    v_lookup := coalesce(nullif(v_line->>'productId', ''), v_line->>'slug');
    select * into v_product
    from public.products
    where id = v_lookup or slug = v_lookup
    for update;
    if not found then
      raise exception 'A piece in the bag is no longer on the rail' using errcode = 'P0001';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Insufficient stock for %', v_product.name using errcode = 'P0001';
    end if;
    update public.products set stock = stock - v_qty where id = v_product.id;
    v_subtotal := v_subtotal + (v_product.price * v_qty);
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'slug', v_product.slug,
      'name', v_product.name,
      'unit_price', v_product.price,
      'qty', v_qty,
      'size', coalesce(v_line->>'size', ''),
      'color', coalesce(v_line->>'color', ''),
      'image', coalesce(v_product.images[1], '')
    ));
  end loop;

  insert into public.orders (
    id, user_id, status, channel, currency, subtotal, shipping, total,
    customer_name, customer_email, customer_phone, customer_city,
    customer_country, customer_address, customer_notes, payment_method,
    stripe_payment_intent_id
  ) values (
    v_order_id,
    v_uid,
    case when p_payment_method = 'stripe' then 'confirmed' else 'received' end,
    p_channel,
    p_currency,
    v_subtotal,
    v_shipping,
    v_subtotal + v_shipping,
    p_customer->>'name',
    lower(p_customer->>'email'),
    coalesce(p_customer->>'phone', ''),
    coalesce(nullif(p_customer->>'city', ''), p_city),
    coalesce(p_customer->>'country', case when p_city = 'International' then 'International' else 'Afghanistan' end),
    coalesce(p_customer->>'address', ''),
    p_customer->>'notes',
    p_payment_method,
    p_stripe_payment_intent_id
  );

  insert into public.order_items (
    order_id, product_id, slug, name, unit_price, qty, size, color, image
  )
  select
    v_order_id,
    line->>'product_id',
    line->>'slug',
    line->>'name',
    (line->>'unit_price')::numeric,
    (line->>'qty')::integer,
    coalesce(line->>'size', ''),
    coalesce(line->>'color', ''),
    line->>'image'
  from jsonb_array_elements(v_lines) as line;

  return jsonb_build_object(
    'id', v_order_id,
    'subtotal', v_subtotal,
    'shipping', v_shipping,
    'total', v_subtotal + v_shipping
  );
end;
$$;

revoke all on function shop.place_order(jsonb, jsonb, text, text, text, text, text, uuid) from public;
grant execute on function shop.place_order(jsonb, jsonb, text, text, text, text, text, uuid) to service_role;

-- Public wrapper so the Data API can reach the transaction without exposing `shop`.
-- EXECUTE stays on service_role only.
create or replace function public.place_order(
  p_items jsonb,
  p_customer jsonb,
  p_currency text default 'USD',
  p_city text default 'Kabul',
  p_payment_method text default 'cod',
  p_channel text default 'checkout',
  p_stripe_payment_intent_id text default null,
  p_user_id uuid default null
)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select shop.place_order(
    p_items,
    p_customer,
    p_currency,
    p_city,
    p_payment_method,
    p_channel,
    p_stripe_payment_intent_id,
    p_user_id
  );
$$;

revoke all on function public.place_order(jsonb, jsonb, text, text, text, text, text, uuid) from public;
grant execute on function public.place_order(jsonb, jsonb, text, text, text, text, text, uuid) to service_role;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.subscribers enable row level security;
alter table public.contact_messages enable row level security;

alter table public.profiles force row level security;
alter table public.products force row level security;
alter table public.orders force row level security;
alter table public.order_items force row level security;
alter table public.subscribers force row level security;
alter table public.contact_messages force row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select shop.is_admin()));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and role = 'customer');

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select to anon, authenticated
  using (true);

drop policy if exists products_admin_write on public.products;
create policy products_admin_insert on public.products
  for insert to authenticated
  with check ((select shop.is_admin()));

drop policy if exists products_admin_update on public.products;
create policy products_admin_update on public.products
  for update to authenticated
  using ((select shop.is_admin()))
  with check ((select shop.is_admin()));

drop policy if exists products_admin_delete on public.products;
create policy products_admin_delete on public.products
  for delete to authenticated
  using ((select shop.is_admin()));

drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select to authenticated
  using (
    (select shop.is_admin())
    or user_id = (select auth.uid())
    or lower(customer_email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
  );

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update to authenticated
  using ((select shop.is_admin()))
  with check ((select shop.is_admin()));

drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          (select shop.is_admin())
          or o.user_id = (select auth.uid())
          or lower(o.customer_email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
        )
    )
  );

drop policy if exists subscribers_insert on public.subscribers;
create policy subscribers_insert on public.subscribers
  for insert to anon, authenticated
  with check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$');

drop policy if exists subscribers_select_admin on public.subscribers;
create policy subscribers_select_admin on public.subscribers
  for select to authenticated
  using ((select shop.is_admin()));

drop policy if exists contact_insert on public.contact_messages;
create policy contact_insert on public.contact_messages
  for insert to anon, authenticated
  with check (length(message) > 0 and length(name) > 0);

drop policy if exists contact_select_admin on public.contact_messages;
create policy contact_select_admin on public.contact_messages
  for select to authenticated
  using ((select shop.is_admin()));

-- ---------------------------------------------------------------------------
-- Grants (Data API opt-in)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;

grant select on table public.products to anon, authenticated, service_role;
grant insert, update, delete on table public.products to authenticated, service_role;

grant select on table public.profiles to authenticated, service_role;
grant update on table public.profiles to authenticated, service_role;
grant insert on table public.profiles to service_role;

grant select on table public.orders to authenticated, service_role;
grant insert, update on table public.orders to service_role;
grant update on table public.orders to authenticated;

grant select on table public.order_items to authenticated, service_role;
grant insert on table public.order_items to service_role;

grant insert on table public.subscribers to anon, authenticated, service_role;
grant select on table public.subscribers to authenticated, service_role;

grant insert on table public.contact_messages to anon, authenticated, service_role;
grant select on table public.contact_messages to authenticated, service_role;
