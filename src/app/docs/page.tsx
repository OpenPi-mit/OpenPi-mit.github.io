import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { themeTokens } from "@/lib/theme";

const guides = [
  {
    title: "Getting Started",
    description: "Install MSc, run setup, and generate a first paper.",
    href: "https://github.com/PoggioAI/PoggioAI.github.io/blob/main/docs-src/docs/getting-started.md",
  },
  {
    title: "Configuration",
    description: "Environment variables, budgets, and model selection.",
    href: "https://github.com/PoggioAI/PoggioAI.github.io/blob/main/docs-src/docs/configuration.md",
  },
  {
    title: "Usage",
    description: "Single runs, campaigns, counsel mode, and output flow.",
    href: "https://github.com/PoggioAI/PoggioAI.github.io/blob/main/docs-src/docs/usage.md",
  },
  {
    title: "HPC / SLURM Setup",
    description: "Cluster deployment guidance for larger runs.",
    href: "https://github.com/PoggioAI/PoggioAI.github.io/blob/main/docs-src/docs/setup.md",
  },
];

export default function DocsPage() {
  const token = themeTokens;

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SiteHeader />

      <section className="relative z-10 h-full pt-24 md:pt-28">
        <div className="no-scrollbar mx-auto h-full w-full max-w-6xl overflow-y-scroll px-10 pb-20 md:px-16">
          <p className="text-xs uppercase tracking-[0.16em]" style={{ color: token.textEyebrow }}>
            Documentation
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: token.textPrimary }}>
            pAI MSc Docs
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-relaxed md:text-lg" style={{ color: token.textSecondary }}>
            The full MSc documentation lives alongside the project repo. This page is a lightweight hub to the setup,
            configuration, usage, and cluster guides that ship with the site source.
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
            <Link
              href="https://github.com/PoggioAI/PoggioAI.github.io/tree/main/docs-src/docs"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto inline-flex items-center rounded border border-white/20 px-4 py-2 text-sm transition-opacity hover:opacity-80"
              style={{ color: token.textPrimary }}
            >
              Docs Source
            </Link>
          </div>

          <div className="mt-10 grid max-w-5xl gap-4 pb-8 md:grid-cols-2">
            {guides.map((guide) => (
              <article key={guide.title} className="rounded border border-white/10 bg-black/30 p-5">
                <h2 className="text-xl font-medium tracking-tight" style={{ color: token.textPrimary }}>
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed md:text-base" style={{ color: token.textSecondary }}>
                  {guide.description}
                </p>
                <Link
                  href={guide.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto mt-4 inline-block text-sm underline underline-offset-4 transition-opacity hover:opacity-80"
                  style={{ color: token.textPrimary }}
                >
                  Open guide
                </Link>
              </article>
            ))}
          </div>

          <p className="max-w-4xl pb-10 text-sm md:text-base" style={{ color: token.textSecondary }}>
            Looking for the main site overview instead?{" "}
            <Link href="/" className="pointer-events-auto underline underline-offset-4" style={{ color: token.textPrimary }}>
              Return to the homepage
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
