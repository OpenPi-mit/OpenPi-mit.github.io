"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { themeTokens } from "@/lib/theme";

export function Hero() {
  const token = themeTokens;
  const particleBaseColor = `rgb(${token.particleBase.map((v) => Math.round(v * 255)).join(", ")})`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const footerRevealThresholdPx = 130;
    const updateFooter = () => {
      const atTop = el.scrollTop <= 2;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - footerRevealThresholdPx;
      setShowFooter(atTop || nearBottom);
    };

    updateFooter();
    el.addEventListener("scroll", updateFooter, { passive: true });
    return () => el.removeEventListener("scroll", updateFooter);
  }, []);

  return (
    <main
      className="relative h-screen w-screen"
      suppressHydrationWarning
      style={{ color: token.textPrimary }}
    >
      <SiteHeader />

      <div
        ref={scrollRef}
        className="no-scrollbar relative z-10 h-full overflow-y-scroll"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, transparent 62px, black 96px, black 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0px, transparent 62px, black 96px, black 100%)",
        }}
      >
        <section className="pointer-events-none mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-6xl font-semibold tracking-tight md:text-7xl">pAI</h1>
          <p className="mt-4 text-base italic md:text-2xl" style={{ color: token.textSecondary }}>
            Principal (Agentic) Investigator
          </p>
          <p
            className="mt-3 text-sm md:text-base"
            style={{ color: token.textSecondary }}
          >
            Developed by the{" "}
            <a
              href="https://poggio-lab.mit.edu"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto underline underline-offset-4"
            >
              Poggio Lab team at MIT
            </a>
          </p>
          <p className="mt-5 max-w-xl text-xl leading-relaxed md:text-xl" style={{ color: token.textPrimary }}>
            We&apos;re building <strong>pAI</strong>, a multi-agent AI system that turns research hypotheses into high-quality,
            literature-grounded, experiment-backed papers with minimal human steering.
          </p>
        </section>

        <section
          className={`pointer-events-none page-gutter-x -mt-12 pt-0.5 pb-12 transition-opacity duration-200 md:-mt-16 md:pt-1 md:pb-8 ${
            showFooter ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Why pAI</h2>
            <div className="mt-8 space-y-7 text-[1.125rem] leading-[1.62] md:text-[1.25rem]" style={{ color: token.textSecondary }}>
              <p>
                Current AI systems require on the order of 10
                <sup>2</sup> to 10
                <sup>3</sup> prompts to go from a research idea to a written paper. <strong>pAI</strong> aims to reduce this
                to up to 10 human interactions.
              </p>
              <p>
                This is not about fully automating research or replacing human creativity. <strong>pAI</strong> focuses on the rigorous
                establishment of ideas: matching theory with experiments, distinguishing correlation from causation, proposing
                parallel explanations and testing them. The human provides the idea. The system does the structured work of
                turning it into a solid manuscript.
              </p>
            </div>
          </div>
        </section>

        <section className="pointer-events-none page-gutter-x mt-20 pb-50 md:mt-25 md:pb-54">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">5-Minute Quickstart to MSc</h2>
            <div className="mt-6 grid max-w-3xl grid-cols-1 gap-2 text-center text-base md:mx-auto md:grid-cols-3 md:gap-6 md:text-lg" style={{ color: token.textSecondary }}>
              <p className="mx-auto w-full max-w-xs rounded-2xl border border-white/20 bg-black/45 px-4 py-2 backdrop-blur-xl md:max-w-none">
                Cost: ~$2-10
              </p>
              <p className="mx-auto w-full max-w-xs rounded-2xl border border-white/20 bg-black/45 px-4 py-2 backdrop-blur-xl md:max-w-none">
                Time: 15-40 min
              </p>
              <p className="mx-auto w-full max-w-xs rounded-2xl border border-white/20 bg-black/45 px-4 py-2 backdrop-blur-xl md:max-w-none">
                Requires: one API key
              </p>
            </div>

            <div
              className="pointer-events-auto mt-8 overflow-hidden rounded-3xl border border-white/25 bg-black/60 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-7"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.5)" }}
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/75" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-300/75" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/75" />
                <span className="ml-3 text-xs tracking-wide" style={{ color: token.textSecondary }}>
                  quickstart.sh
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-[13px] leading-relaxed md:text-sm">
                <code>
                  <span className="text-emerald-300"># 1. Bootstrap environment (one-time, ~5 min)</span>{"\n"}
                  <span className="text-sky-300">./scripts/bootstrap.sh</span>{" "}
                  <span className="text-violet-300">researchlab minimal</span>{"\n\n"}
                  <span className="text-sky-300">conda activate</span>{" "}
                  <span className="text-violet-300">researchlab</span>{"\n\n"}
                  <span className="text-emerald-300"># 2. Set your API key (only one provider needed)</span>{"\n"}
                  <span className="text-sky-300">cp</span>{" "}
                  <span className="text-violet-300">.env.example .env</span>{"\n"}
                  <span className="text-sky-300">echo</span>{" "}
                  <span className="text-amber-300">&quot;ANTHROPIC_API_KEY=your_key_here&quot;</span>{" "}
                  <span className="text-sky-300">&gt;&gt;</span>{" "}
                  <span className="text-violet-300">.env</span>{"\n\n"}
                  <span className="text-emerald-300"># 3. Validate setup without spending tokens</span>{"\n"}
                  <span className="text-sky-300">python</span>{" "}
                  <span className="text-violet-300">launch_multiagent.py</span>{" "}
                  <span className="text-orange-300">--task</span>{" "}
                  <span className="text-amber-300">&quot;test&quot;</span>{" "}
                  <span className="text-orange-300">--dry-run</span>{"\n\n"}
                  <span className="text-emerald-300"># 4. Run the included quickstart example (~$3)</span>{"\n"}
                  <span className="text-sky-300">python</span>{" "}
                  <span className="text-violet-300">launch_multiagent.py</span>{" "}
                  <span className="text-slate-300">\</span>{"\n"}
                  {"  "}<span className="text-orange-300">--task</span>{" "}
                  <span className="text-amber-300">&quot;$(cat examples/quickstart/task.txt)&quot;</span>{" "}
                  <span className="text-slate-300">\</span>{"\n"}
                  {"  "}<span className="text-orange-300">--output-format</span>{" "}
                  <span className="text-violet-300">markdown</span>{" "}
                  <span className="text-slate-300">\</span>{"\n"}
                  {"  "}<span className="text-orange-300">--no-counsel</span>{" "}
                  <span className="text-slate-300">\</span>{"\n"}
                  {"  "}<span className="text-orange-300">--no-log-to-files</span>
                </code>
              </pre>
            </div>
          </div>
        </section>
      </div>

      <footer
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-20 border-t border-white/10 px-6 py-4 transition-opacity duration-250 ${
          showFooter ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <p className="-translate-y-px text-base leading-relaxed md:text-base">
            <span style={{ color: particleBaseColor }}>Ready to pioneer the future of research?</span>{" "}
            <a
              href="mailto:pierb@mit.edu"
              className="pointer-events-auto underline underline-offset-4 transition-opacity hover:opacity-80"
              style={{ color: token.textPrimary }}
            >
              Partner with us
            </a>
          </p>
          <p className="mt-2 text-xs leading-snug md:text-3xs" style={{ color: particleBaseColor }}>
            © 2026 pAI, MIT. Mahmoud Abdelmoneum, Pierfrancesco Beneventano, Tomaso Poggio.
          </p>
        </div>
      </footer>
    </main>
  );
}
