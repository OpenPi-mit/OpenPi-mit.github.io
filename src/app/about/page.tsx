"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { themeTokens } from "@/lib/theme";

export default function AboutPage() {
  const token = themeTokens;

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SiteHeader />

      <section className="relative z-10 h-full pt-24 md:pt-28">
        <div className="no-scrollbar page-gutter-x h-full w-full overflow-y-scroll pb-20">
          <h1
            className="text-[2.5rem] font-semibold leading-[1.12] tracking-tight md:text-[3rem]"
            style={{ color: token.textPrimary }}
          >
            Research, accelerated by agentic superintelligence.
          </h1>

          <div
            className="mt-10 space-y-8 pb-10 text-[1.125rem] leading-[1.6] md:mt-12 md:text-[1.25rem]"
            style={{ color: token.textSecondary }}
          >
            <p>
              <strong>pAI</strong> builds persistent AI systems for scientific and technical work.
            </p>
            <p>
              We believe the missing layer in AI is not just more intelligence, but organized technical work. Today&apos;s
              AI tools can produce useful local outputs, but they are still poorly suited for long-running, reviewable,
              evidence-based workflows inside serious R&amp;D organizations.
            </p>
            <p>
              We are building the infrastructure that makes those workflows possible: systems with memory, provenance,
              steerability, and human review built in from the start.
            </p>
            <p>
              We begin with technical diligence and research synthesis, and over time aim to become the operating system
              for technical R&amp;D.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
