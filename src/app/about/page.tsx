"use client";

import Link from "next/link";
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
              <strong>pAI</strong> is building the first vertically integrated lab for autonomous scientific discovery. Our mission is
              to turn strong hypotheses into validated insights faster, safer, and with clearer evidence for broad
              public benefit.
            </p>
            <p>
              The last century of science gave us the computational and experimental stack we rely on today. We believe
              agentic systems can unlock the next era by coordinating literature review, experimental design, execution,
              and synthesis with rigorous human oversight.
            </p>
            <p>We have one product: reliable research velocity, at scale.</p>
            <p>
              With roots across top universities, frontier labs, and engineering teams, we are assembling physicists,
              ML researchers, and builders who want to industrialize scientific progress while preserving scientific
              integrity.
            </p>
            <p>
              Success means moving research from fragmented incremental steps to a continuous, compounding engine of
              breakthroughs.
            </p>
            <p>
              If this resonates with you, we would love to collaborate.{" "}
              <Link href="mailto:pierb@mit.edu" className="pointer-events-auto underline underline-offset-4" style={{ color: token.textPrimary }}>
                Partner with us.
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
