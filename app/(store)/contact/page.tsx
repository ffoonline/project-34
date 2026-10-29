import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { WhatsAppIcon } from "@/components/HouseIcons";
import { T } from "@/components/T";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "WhatsApp, email, and the Kabul atelier of THIRTY FOUR.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="kicker">
          <T k="contact" />
        </p>
        <h1 className="font-heading mt-3 text-6xl">
          <T k="writeTheHouse" />
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          <T k="contactLede" />
        </p>
        <dl className="mt-10 space-y-4 text-sm">
          <div>
            <dt className="text-[11px] tracking-[0.22em] uppercase">
              <T k="atelier" />
            </dt>
            <dd className="mt-1">
              <T k="atelierAddress" />
            </dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.22em] uppercase">WhatsApp</dt>
            <dd className="mt-1">
              <a
                href={`https://wa.me/${site.whatsapp}`}
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <WhatsAppIcon className="size-4" />
                {site.whatsappDisplay}
              </a>
            </dd>
          </div>
          {site.email ? (
            <div>
              <dt className="text-[11px] tracking-[0.22em] uppercase">
                <T k="email" />
              </dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-[11px] tracking-[0.22em] uppercase">
              <T k="phone" />
            </dt>
            <dd className="mt-1">{site.phoneDisplay}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.22em] uppercase">
              <T k="hours" />
            </dt>
            <dd className="mt-1">
              <T k="hoursValue" />
            </dd>
          </div>
        </dl>
      </div>
      <ContactForm />
    </div>
  );
}
