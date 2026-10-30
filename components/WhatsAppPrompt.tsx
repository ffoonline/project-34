"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/HouseIcons";

export function WhatsAppPrompt() {
  const [open, setOpen] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (!site.publicContactDetailsConfirmed) return;
    const target = document.getElementById("social-media");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || shown.current) return;
        shown.current = true;
        setOpen(true);
        window.setTimeout(() => setOpen(false), 10000);
      },
      { threshold: 0.25 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!site.publicContactDetailsConfirmed || !open) return null;

  return (
    <aside className="whatsapp-prompt" role="status" aria-label="Contact THIRTY FOUR GLOBAL on WhatsApp">
      <button type="button" className="whatsapp-prompt__close" onClick={() => setOpen(false)} aria-label="Close WhatsApp prompt">
        <X aria-hidden size={15} />
      </button>
      <Link href={whatsappLink("Hello THIRTY FOUR GLOBAL, I would like to speak with the house.")} target="_blank" rel="noreferrer" className="whatsapp-prompt__link">
        <span className="whatsapp-prompt__icon"><WhatsAppIcon className="size-5" /></span>
        <span>
          <span className="whatsapp-prompt__eyebrow">Speak with the house</span>
          <span className="whatsapp-prompt__number">WhatsApp {site.whatsappDisplay}</span>
        </span>
      </Link>
    </aside>
  );
}
