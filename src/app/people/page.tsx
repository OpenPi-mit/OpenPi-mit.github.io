import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { peopleData } from "@/data/people";
import { themeTokens } from "@/lib/theme";

export default function PeoplePage() {
  const token = themeTokens;

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SiteHeader />

      <section className="relative z-10 h-full pt-24 md:pt-28">
        <div className="no-scrollbar mx-auto h-full w-full max-w-6xl overflow-y-scroll px-10 pb-20 md:px-16">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: token.textPrimary }}>
            People
          </h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg" style={{ color: token.textSecondary }}>
            The researchers behind pAI.
          </p>

          <div className="mt-10 grid gap-6 pb-10 sm:grid-cols-2 lg:grid-cols-3">
            {peopleData.map((member) => {
              const card = (
                <article className="rounded border border-white/10 bg-black/35 p-4">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded border border-white/10 bg-white/5">
                    {member.image ? (
                      <Image src={member.image} alt={member.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl font-semibold" style={{ color: token.textSecondary }}>
                        {member.name
                          .split(" ")
                          .map((chunk) => chunk.replace(/[().]/g, ""))
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((chunk) => chunk[0])
                          .join("")}
                      </div>
                    )}
                  </div>

                  <h2 className="mt-4 text-lg font-medium leading-snug" style={{ color: token.textPrimary }}>
                    {member.name}
                  </h2>
                  {member.role && (
                    <p className="mt-1 text-sm md:text-base" style={{ color: token.textSecondary }}>
                      {member.role}
                    </p>
                  )}
                  {member.affiliation && (
                    <p className="mt-1 text-sm italic md:text-base" style={{ color: token.textSecondary }}>
                      {member.affiliation}
                    </p>
                  )}
                </article>
              );

              return member.link ? (
                <Link
                  key={member.name}
                  href={member.link}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto block transition-opacity hover:opacity-85"
                >
                  {card}
                </Link>
              ) : (
                <div key={member.name}>{card}</div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
