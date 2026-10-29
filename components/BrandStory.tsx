import Link from "next/link";

export function BrandStory() {
  return (
    <section className="house-section border-y border-border text-center">
      <div className="house-wrap max-w-4xl sm:px-6">
        <p className="kicker">THIRTY FOUR GLOBAL</p>
        <h2 className="mt-4 text-5xl sm:text-6xl md:text-7xl">34 Provinces. One Identity.</h2>
        <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
          THIRTY FOUR draws its name from the 34 provinces of Afghanistan — a contemporary house built around identity, craftsmanship and a global outlook.
        </p>
        <Link href="/about" className="text-link mt-8">
          Our story <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
