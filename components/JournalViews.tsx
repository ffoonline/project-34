"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { localizeArticle, localizeJournal } from "@/lib/copy-journal";
import { T } from "@/components/T";

export function HomeJournalList() {
  const { language } = useLanguage();
  const notes = localizeJournal(language);

  return (
    <div className="divide-y divide-border border-y border-border">
      {notes.map((entry) => (
        <Link
          key={entry.slug}
          href={`/journal/${entry.slug}`}
          className="block py-7 transition-colors hover:text-muted-foreground"
        >
          <p className="text-[11px] tracking-[0.18em] uppercase">{entry.kicker}</p>
          <h3 className="mt-2 text-3xl sm:text-4xl">{entry.title}</h3>
        </Link>
      ))}
    </div>
  );
}

export function JournalIndex() {
  const { language } = useLanguage();
  const notes = localizeJournal(language);
  const [lead, ...rest] = notes;

  return (
    <div className="house-wrap house-section sm:px-6">
      <p className="kicker">
        <T k="journal" />
      </p>
      <h1 className="mt-3 max-w-[12ch] text-5xl md:text-7xl">
        <T k="notesFromTheTable" />
      </h1>

      {lead ? (
        <Link href={`/journal/${lead.slug}`} className="group mt-14 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted lg:aspect-[4/3]">
            <Image
              src={lead.image}
              alt={lead.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              {lead.kicker} · {lead.date}
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl">{lead.title}</h2>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-muted-foreground">{lead.excerpt}</p>
          </div>
        </Link>
      ) : null}

      <div className="mt-20 grid gap-12 md:grid-cols-2">
        {rest.map((entry) => (
          <article key={entry.slug}>
            <Link href={`/journal/${entry.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={entry.image}
                  alt={entry.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <p className="mt-5 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                {entry.kicker} · {entry.date}
              </p>
              <h2 className="mt-3 text-3xl">{entry.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{entry.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export function JournalArticleView({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const article = localizeArticle(slug, language);
  if (!article) return null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/journal" className="text-link">
        <T k="journal" />
      </Link>
      <p className="kicker mt-10">
        {article.kicker} · {article.date} · {article.readTime}
      </p>
      <h1 className="mt-5 text-5xl sm:text-6xl">{article.title}</h1>
      <div className="relative mt-12 aspect-[16/9] overflow-hidden bg-muted">
        <Image src={article.image} alt={article.title} fill className="object-cover" sizes="800px" />
      </div>
      <div className="mt-12 space-y-6 text-[17px] leading-8 text-muted-foreground">
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
