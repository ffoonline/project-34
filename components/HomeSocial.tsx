import Link from "next/link";
import { ArrowUpRight, Camera, Music2, UsersRound } from "lucide-react";
import { site } from "@/lib/site";
import { WhatsAppPrompt } from "@/components/WhatsAppPrompt";

const channels = [
  { label: "Instagram", href: site.instagram, icon: Camera, note: "The visual journal" },
  { label: "TikTok", href: site.tiktok, icon: Music2, note: "The house in motion" },
  { label: "Facebook", href: site.facebook, icon: UsersRound, note: "News from the house" },
];

export function HomeSocial() {
  if (!site.publicContactDetailsConfirmed) return null;

  return (
    <section id="social-media" className="house-section social-house-section border-t border-border bg-[#f5f2ed] dark:bg-[#111]">
      <div className="house-wrap grid gap-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="kicker">Follow the house</p>
          <h2 className="mt-3 max-w-[10ch] text-4xl sm:text-5xl">The next cut is social.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            Campaigns, new pieces, and the quiet details behind THIRTY FOUR GLOBAL.
          </p>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-3">
          {channels.map(({ label, href, icon: Icon, note }, index) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="social-house-card group flex min-h-44 flex-col justify-between bg-background p-5 transition-all hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-2xl dark:bg-[#0a0a0a] dark:hover:bg-white dark:hover:text-black"
              aria-label={`Open THIRTY FOUR GLOBAL on ${label}`}
            >
              <div className="flex items-center justify-between">
                <span className="social-house-card__index">0{index + 1}</span>
                <Icon aria-hidden size={22} strokeWidth={1.4} />
                <ArrowUpRight aria-hidden size={17} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground group-hover:text-current/65">{note}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <WhatsAppPrompt />
    </section>
  );
}
