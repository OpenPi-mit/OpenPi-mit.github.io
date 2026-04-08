"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { publications } from "@/data/publications";
import { themeTokens } from "@/lib/theme";

export default function PublicationsPage() {
  const token = themeTokens;

  const publicationsByYear = publications.reduce<Record<string, typeof publications>>((acc, publication) => {
    const year = publication.year || "Unknown";
    if (!acc[year]) acc[year] = [];
    acc[year].push(publication);
    return acc;
  }, {});

  const sortedYears = Object.keys(publicationsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SiteHeader />

      <section className="relative z-10 h-full pt-24 md:pt-28">
        <div className="no-scrollbar mx-auto h-full w-full max-w-6xl overflow-y-scroll px-10 pb-20 md:px-16">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: token.textPrimary }}>
            Publications
          </h1>

          <div className="mt-10 space-y-10 pb-10">
            {sortedYears.map((year) => (
              <section key={year} className="space-y-6">
                <h2 className="text-lg font-medium md:text-xl" style={{ color: token.textPrimary }}>
                  {year}
                </h2>
                <div className="space-y-16">
                  {publicationsByYear[year].map((publication) => (
                    <article key={`${publication.title}-${publication.year}`} className="max-w-4xl border-l border-white/10 pl-5">
                      <h3 className="text-xl font-medium leading-snug md:text-2xl" style={{ color: token.textPrimary }}>
                        {publication.pdfLink ? (
                          <Link href={publication.pdfLink} className="pointer-events-auto transition-opacity hover:opacity-80">
                            {publication.title}
                          </Link>
                        ) : (
                          publication.title
                        )}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: token.textSecondary }}>
                        {publication.authors}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed italic md:text-base" style={{ color: token.textSecondary }}>
                        {publication.venue}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
