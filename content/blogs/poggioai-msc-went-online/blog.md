# PoggioAI/MSc Went Online
Date: Sat Mar 21, 2026
By Pierfrancesco Beneventano on behalf of the PoggioAI Team

PoggioAI/MSc is now online. You can read the [technical report](/papers/poggioai-msc-v0.pdf) or browse the [GitHub repository](https://github.com/PoggioAI/PoggioAI_MSc/tree/MSc_Prod). This first public release is an open-source, customizable, modular multi-agent system for academic research workflows, with a current emphasis on machine learning theory and nearby quantitative fields.

Our goal is not autonomous scientific ideation, and it is not fully automated research. The target is narrower and more practical: reduce by orders of magnitude the human steering needed to take a specified hypothesis to a literature-grounded, mathematically established, experimentally supported, submission-oriented manuscript draft.

## Why we built it

The project starts from a blunt question: how much of serious academic research can really be automated without lowering standards? Large language models and agentic systems are already changing how research is done, and that raises hard questions for mathematicians and computer scientists. Which parts of the workflow can be delegated? Which skills remain deeply human? And what does high-quality automation even mean in research?

Our view, reflected in the report, is that the right scientific question is not whether current systems can generate impressive text, but whether they can help automate **high-quality research**. The long-term engineering ambition is to understand the upper bound of automation that is still compatible with rigor.

## The practical objective

In practice, we think many researchers want something much simpler than "fully autonomous science." They want a junior collaborator that can take a strong human idea, follow guidance, and help push it toward a serious paper draft. Today, that still often takes on the order of 10^2 to 10^3 prompts with frontier models and agentic tools, if it works at all.

PoggioAI/MSc is our attempt to compress that process. The practical target is:

- start from a strong human-developed hypothesis
- keep the bar at serious academic quality
- get to a written article with at most 10 human steers

That is the core of the system. The human still provides the idea and remains responsible for novelty, correctness, and publication decisions. The system is there to carry more of the disciplined work needed to establish the idea well.

## Why the quality bar matters

For us, this is also an ethics question. If AI systems are going to become part of research practice, they should not optimize for fluent overclaiming. They should push toward careful establishment. That means making novelty claims explicit, matching theory with experiments, stress-testing causal language, and keeping the intermediate reasoning inspectable instead of hidden inside a chat log.

The point is not to produce more papers for the sake of volume. The point is to help produce papers that move the knowledge boundary without cutting corners.

## What we learned while building it

The early engineering lessons in the report shaped the public release.

- **Debate beats monologue for planning.** Early ideation worked better when planning became structured disagreement among multiple agents instead of one agent trying to do everything alone.
- **Agents need competing objectives.** Quality improved when different agents were pushed toward different goals, like practical relevance, rigorous theory, and stronger narrative structure.
- **Theory and experiments should stay coordinated without collapsing into one track.** Too much shared context too early made both tracks weaker. Better results came from keeping them on the same paper trajectory but synchronizing only at chosen points.
- **Long runs need explicit stopping criteria.** Otherwise the system keeps iterating after the useful conceptual work is already done.
- **Failures must be external and inspectable.** In a long multi-agent workflow, debugging is expensive. Checkpoints, named artifacts, budget traces, and resumable runs are part of the design, not just operational extras.

## What this release is

This release is an early public step, not a claim that the problem is solved. But it is a concrete system, a concrete workflow, and a concrete argument about where AI can already be useful in research: not by replacing the researcher, but by reducing the steering burden needed to turn a strong idea into a serious manuscript draft.

If you want the full scope, architecture, and limits, start with the [technical report](/papers/poggioai-msc-v0.pdf). If you want to try it, the fastest path is the [GitHub repository](https://github.com/PoggioAI/PoggioAI_MSc/tree/MSc_Prod).
