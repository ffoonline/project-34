"use server";

import { cookies, headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getProductById, getProductBySlug } from "@/lib/store";

async function getProduct(productId: string) {
  const id = productId.trim();
  if (!id) {
    throw new Error("A piece is required.");
  }
  const product = (await getProductById(id)) ?? (await getProductBySlug(id));
  if (!product) {
    throw new Error("A piece in the bag is no longer on the rail.");
  }
  if (product.stock < 1) {
    throw new Error("This piece is waiting on the next cut.");
  }
  const priceInCents = Math.round(product.price * 100);
  if (priceInCents < 50) {
    throw new Error("The bag total is too small for a card charge.");
  }
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceInCents,
  };
}

export async function startCheckoutSession(productId: string) {
  await headers();

  const product = await getProduct(productId);

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      productId: product.id,
      items: JSON.stringify([{ id: product.id, quantity: 1 }]),
    },
  });

  if (!session.client_secret) {
    throw new Error("Stripe did not return a client secret.");
  }

  const jar = await cookies();
  jar.set("tf_checkout_session", session.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });

  return session.client_secret;
}
