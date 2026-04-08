import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { themeTokens } from "@/lib/theme";

const guides = [
  {
    title: "Getting Started",
    description: "Install MSc, run setup, and generate a first paper.",
    href: "/docs/getting-started",
  },
  {
    title: "Configuration",
    description: "Environment variables, budgets, and model selection.",
    href: "/docs/configuration",
  },
  {
    title: "Usage",
    description: "Single runs, campaigns, counsel mode, and output flow.",
    href: "/docs/usage",
  },
  {
    title: "HPC / SLURM Setup",
    description: "Cluster deployment guidance for larger runs.",
    href: "/docs/setup",
  },
];

export default function DocsPage() {
  const token = themeTokens;

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SiteHeader />

      <section className="relative z-10 h-full pt-24 md:pt-28">
        <div className="no-scrollbar mx-auto h-full w-full max-w-6xl overflow-y-scroll px-10 pb-20 md:px-16">
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: token.textPrimary }}>
            pAI MSc Docs
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-relaxed md:text-lg" style={{ color: token.textSecondary }}>
            The MSc documentation now lives directly inside this website. Use the guides below to navigate setup,
            configuration, usage, and cluster deployment.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="https://github.com/PoggioAI/PoggioAI_MSc/tree/MSc_Prod"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto inline-flex items-center rounded border border-white/20 px-4 py-2 text-sm transition-opacity hover:opacity-80"
              style={{ color: token.textPrimary }}
            >
              Project Repository
            </Link>
          </div>

          <div className="mt-10 grid max-w-5xl gap-4 pb-8 md:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group pointer-events-auto rounded border border-white/10 bg-black/30 p-5 transition-all hover:border-white/25 hover:bg-black/45"
              >
                <article>
                  <h2 className="text-xl font-medium tracking-tight transition-opacity group-hover:opacity-90" style={{ color: token.textPrimary }}>
                    {guide.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed md:text-base" style={{ color: token.textSecondary }}>
                    {guide.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
