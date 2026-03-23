# Getting Started

Get PoggioAI MSc running in under 5 minutes. You need one API key and about $2–10 for a first run.

---

## Prerequisites

- **Python 3.10+** (3.11 recommended)
- **Conda** (Miniconda or Miniforge)
- An API key for at least one LLM provider (Anthropic, OpenAI, or Google)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/PoggioAI/PoggioAI_MSc.git
cd PoggioAI_MSc

# 2. Bootstrap the environment
#    "minimal" installs core deps only (~2 min)
#    "full" adds experiment, docs, web, and observability extras (~5 min)
./scripts/bootstrap.sh consortium minimal

# 3. Activate the environment
conda activate consortium
```

!!! tip "Optional extras"
    You can install specific extras after the initial setup:
    ```bash
    pip install -e ".[experiment]"     # PyTorch, transformers, datasets
    pip install -e ".[docs]"           # Document conversion tools
    pip install -e ".[web]"            # Web search, Playwright
    pip install -e ".[observability]"  # LangSmith, Weights & Biases
    ```

## Set Up API Keys

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add at least one API key:

```bash
# Required: at least one
ANTHROPIC_API_KEY=sk-ant-...

# Optional: unlock counsel mode (multi-model debate)
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
```

!!! warning
    Never commit your `.env` file. It is already in `.gitignore`.

## Validate Setup

Run a dry-run to confirm everything is configured correctly without spending any tokens:

```bash
python launch_multiagent.py --task "test" --dry-run
```

This checks API key validity, configuration files, and workspace setup, then exits.

## Run Your First Paper

```bash
python launch_multiagent.py \
  --task "Investigate whether batch normalization reduces spectral norm growth during training" \
  --output-format markdown \
  --no-counsel \
  --no-log-to-files
```

!!! info "Cost and time"
    - **Cost:** ~$2–10 depending on the model and task complexity
    - **Time:** 15–40 minutes for a typical run
    - **Output:** `results/consortium_<timestamp>/` contains your paper and all artifacts

## What gets produced

After a successful run, your output directory contains:

| File | Description |
|------|-------------|
| `final_paper.tex` or `final_paper.md` | The generated manuscript |
| `final_paper.pdf` | Compiled PDF (if `--output-format latex`) |
| `run_summary.json` | Cost, tokens used, stages completed |
| `budget_state.json` | Cumulative spend broken down by model |
| `experiment_metadata.json` | Platform, Python version, git commit, CLI args |
| `STATUS.txt` | `COMPLETE`, `INCOMPLETE`, or `ERROR` |
| `.checkpoints.db` | LangGraph checkpoints for resuming |

## Preflight Check

For a more thorough environment validation:

```bash
python scripts/preflight_check.py --with-latex --with-docs --with-experiment
```

This verifies LaTeX toolchain, document conversion tools, and experiment dependencies.

## Next Steps

- [Configuration](configuration.md) — all settings, config files, and CLI flags
- [Usage](usage.md) — campaigns, counsel mode, math agents, tree search
- [HPC / SLURM Setup](setup.md) — deploying on a cluster
