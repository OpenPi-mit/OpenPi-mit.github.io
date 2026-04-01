# pAI/MSc Now Available as a Claude Code Skill and an OpenClaw Plugin
Date: Tue Mar 31, 2026
By Pierfrancesco Beneventano on behalf of the pAI Team

Two new ways to run the pAI/MSc research pipeline are now available: a [Claude Code skill](https://github.com/PoggioAI/PoggioAI_MSc-claude) and an [OpenClaw plugin](https://github.com/PoggioAI/PoggioAI_MSc). Both wrap the same core pipeline — 22 agents, 29 backtested prompts, multi-round persona debate, parallel theory and experiment tracks, and editorial quality gates — but they target different workflows.

## Claude Code skill

The Claude Code skill is the version we have been developing and testing most actively. It runs entirely inside Claude Code (CLI, desktop app, or IDE extension) as a native skill. You invoke it with `/poggioai-msc-claude`, answer two questions (where to work, what your hypothesis is), and the orchestrator takes over.

What it does:

- **Persona debate** with three competing agents (Practical Compass, Rigor & Novelty, Narrative Architect) running 3-5 escalating rounds before any idea can proceed
- **Adversarial literature review** that assumes your claims are already known and tries to falsify novelty
- **Parallel theory and experiment tracks** that stay coordinated without collapsing into one stream
- **Four quality gates** (feasibility, duality, verify-completion, review quality) with automatic loopbacks on failure
- **12-pass writeup** with AI-voice detection, a 647-line author style guide, and a Narrative Architect veto over the final paper
- **Explore mode** (`--explore`) for open-ended investigation: 2-5 exploration cycles before crystallizing into a paper

The skill supports resumable runs, human review cycles, and initial context injection (drop your papers, notes, or drafts into `initial_context/` and every agent reads them). The practical target remains the same as the original system: start from a strong human hypothesis, keep the bar at serious academic quality, get to a written article with at most 10 human steers.

The Claude Code skill is available now at [github.com/PoggioAI/PoggioAI_MSc-claude](https://github.com/PoggioAI/PoggioAI_MSc-claude).

## OpenClaw plugin

The OpenClaw plugin (`pai-msc-openclaw`) packages the same pipeline as a native OpenClaw plugin. It auto-installs the Python backend on first use, passes your existing OpenClaw API keys, creates isolated run workspaces, and streams progress updates as stages complete. The plugin adds slash commands (`/pai-msc`, `/pai-msc-status`, `/pai-msc-stop`, `/pai-msc-list`) and agent-callable tools for programmatic access and live steering via HTTP.

**Important caveat:** the OpenClaw plugin has not been tested in production yet. The code is written, the architecture mirrors the tested Claude Code skill, and the 29 prompts are the same backtested set — but we have not run it end-to-end on a real research task through OpenClaw. If you try it, expect rough edges and please report issues.

## What changed since the first release

Since the [initial public release](/blogsupdates/poggioai-msc-went-online/) on March 21, 2026, we made several improvements to the pipeline:

- **Persona rebalancing.** We diagnosed a narrative regression problem where the pipeline's adversarial process was systematically retreating from the core story. The three personas have been rebalanced: Practical now has explicit paper-shaping authority over structure and timeliness, Narrative now has advocacy rights (not absolute veto) to fight for the story, and Synthesis follows an explicit authority resolution priority when personas disagree.
- **SKILL.md split.** The orchestrator instructions were 1074 lines, which caused Claude to ignore the imperative flow (welcome banner, state machine, phase routing). We split it to 410 lines with 7 supporting files loaded on demand, using progressive disclosure.
- **State tracking fixes.** Added `ideation_cycle` and `narrative_veto_count` to the state machine — both were used downstream but never initialized, which would have caused failures on review cycles and Narrative Architect vetoes.

## How to get started

For the Claude Code skill, the fastest path is:

1. Clone the [repository](https://github.com/PoggioAI/PoggioAI_MSc-claude)
2. Copy the skill to `~/.claude/skills/poggioai-msc-claude/`
3. Open Claude Code and type `/poggioai-msc-claude`

For the OpenClaw plugin, follow the instructions in the [plugin repository](https://github.com/PoggioAI/PoggioAI_MSc). Again — expect it to need debugging.

As always, the [technical report](/papers/poggioai-msc-v0/) has the full architecture, design rationale, and limits. If you use either tool in your research, please acknowledge pAI and cite the report.
