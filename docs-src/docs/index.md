# PoggioAI MSc

Welcome to the documentation for **PoggioAI MSc** — a multi-agent AI research system that turns hypotheses into literature-grounded, experiment-backed papers with minimal human steering.

[Back to main site](https://poggioai.github.io){ .md-button }
[GitHub Repository](https://github.com/PoggioAI/PoggioAI_MSc){ .md-button .md-button--primary }

---

## What is PoggioAI MSc?

PoggioAI MSc orchestrates 22+ specialist agents through a 14-stage research pipeline built on LangGraph. Give it a research question and it will:

1. **Survey the literature** — search ArXiv, synthesize prior work
2. **Formalize hypotheses** — build a structured research plan
3. **Run experiments** — design, execute, and verify computational experiments
4. **Write a paper** — produce a full manuscript with citations and figures
5. **Peer-review the output** — an internal reviewer scores and iterates

A single run costs **$2–10** and takes **15–40 minutes**. Publication-quality runs with multi-model counsel cost **$40–100** over **4–8 hours**.

## Documentation

| Page | What you'll learn |
|------|-------------------|
| [Getting Started](getting-started.md) | Install, configure API keys, and run your first paper |
| [Configuration](configuration.md) | `.llm_config.yaml`, `.env`, `engaging_config.yaml`, and all CLI flags |
| [Usage](usage.md) | Single runs, campaigns, counsel mode, math agents, tree search, and resumption |
| [HPC / SLURM Setup](setup.md) | Deploying on SLURM clusters with two-tier CPU+GPU execution |

## Supported Models

| Provider | Models | Env Variable |
|----------|--------|--------------|
| Anthropic | `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-sonnet-4-5` | `ANTHROPIC_API_KEY` |
| OpenAI | `gpt-5`, `gpt-5.2`, `gpt-5.3-codex`, `gpt-5.4` | `OPENAI_API_KEY` |
| Google | `gemini-3-pro-preview` | `GOOGLE_API_KEY` |
| DeepSeek | `deepseek-chat` | `DEEPSEEK_API_KEY` |

Only **one** provider key is required. Multiple keys unlock counsel mode (multi-model debate).
