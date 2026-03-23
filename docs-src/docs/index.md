# PoggioAI MSc

Welcome to the documentation for **PoggioAI MSc** (Multi-agent Scientific Collaboration) — an open-source research automation system that transforms a research question into a complete, submission-ready manuscript.

[Back to main site](https://poggioai.github.io){ .md-button }
[GitHub Repository](https://github.com/PoggioAI/PoggioAI_MSc/tree/MSc_Prod){ .md-button .md-button--primary }

---

## What is MSc?

MSc orchestrates 22+ specialist AI agents across a structured pipeline covering literature review, theory development, experimental design, synthesis, and writing — all coordinated through a LangGraph backbone with stage-level validation gates.

The system goes beyond simple prompt chaining. MSc supports **multi-model counsel debate** (where multiple frontier models argue and converge on key decisions), **tree search exploration** (inspired by AI Scientist-v2), and **campaign orchestration** for multi-stage research projects. You provide a research question; MSc delivers a literature-grounded, experimentally supported manuscript draft in markdown or LaTeX.

## Research Presets

| Preset | Cost | Time | Best For |
|--------|------|------|----------|
| `quick` | $2–$5 | ~30 min | Testing, quick summaries, sanity checks |
| `standard` | $10–$25 | ~2 hrs | Most research questions, drafts |
| `thorough` | $40–$100 | ~6 hrs | Publication-quality drafts |
| `maximum` | $80–$200 | 12+ hrs | Rigorous manuscripts, comprehensive surveys |

## Documentation

| Page | What you'll learn |
|------|-------------------|
| [Getting Started](getting-started.md) | Install, run the setup wizard, and generate your first paper |
| [Configuration](configuration.md) | Config files, environment variables, CLI flags, and model selection |
| [Usage](usage.md) | Single runs, campaigns, counsel mode, math agents, tree search |
| [HPC / SLURM Setup](setup.md) | Deploying on SLURM clusters with two-tier CPU+GPU execution |

## Supported Models

| Provider | Models | Env Variable |
|----------|--------|--------------|
| Anthropic | `claude-opus-4-6`, `claude-sonnet-4-6` | `ANTHROPIC_API_KEY` |
| OpenAI | `gpt-5`, `gpt-5-mini`, `gpt-5.4` | `OPENAI_API_KEY` |
| Google | `gemini-3-pro-preview` | `GOOGLE_API_KEY` |
| DeepSeek | `deepseek-chat` | `DEEPSEEK_API_KEY` |

Only **one** provider key is required. Multiple keys unlock counsel mode (multi-model debate).
