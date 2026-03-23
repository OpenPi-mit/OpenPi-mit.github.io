# Getting Started

Get PoggioAI MSc running in under 10 minutes.

---

## Prerequisites

- **Python 3.10+** (3.11 recommended)
- **Git**
- An API key for at least one LLM provider (Anthropic, OpenAI, Google, or DeepSeek)
- (Optional) **LaTeX** for PDF output
- (Optional) **SLURM** for HPC cluster execution

## Step 1: Install

```bash
git clone https://github.com/PoggioAI/PoggioAI_MSc.git
cd PoggioAI_MSc
git checkout MSc_Prod
```

Check your Python version:

```bash
python3 --version   # Must be 3.10 or higher
```

=== "venv (Python 3.10+)"

    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -e .
    ```

=== "Older Python (use Homebrew)"

    ```bash
    brew install python@3.12
    python3.12 -m venv .venv
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -e .
    ```

=== "Conda"

    ```bash
    conda create -n msc python=3.12 -y
    conda activate msc
    pip install -e .
    ```

!!! tip "Optional extras"
    ```bash
    pip install -e ".[all]"          # All optional dependencies
    pip install -e ".[web]"          # Web search and retrieval
    pip install -e ".[experiment]"   # PyTorch, transformers, datasets
    pip install -e ".[docs]"         # Document conversion tools
    ```

## Step 2: Setup Wizard

```bash
msc setup
```

The setup wizard will:

1. **Detect your platform** — OS, GPUs, SLURM availability, installed tools
2. **Configure API keys** — prompts for your LLM provider keys, stores them in `~/.msc/.env`
3. **Select models** — choose your primary model and optional counsel models
4. **Set budget limits** — configure a default spending cap per run
5. **Configure notifications** (optional) — Telegram or Slack alerts

## Step 3: Verify Installation

```bash
msc doctor
```

This runs a comprehensive environment check: Python version, installed packages, API key validity, model connectivity, disk space, and optional tool availability. Fix any reported issues before proceeding.

## Step 4: Run Your First Paper

```bash
# Quick test (~$2-5, 30 min)
msc run "What are the key differences between transformer and state-space models?" --preset quick
```

Each run creates a timestamped output directory in `results/` containing all intermediate artifacts, the final manuscript, and a detailed execution log.

!!! info "Presets control cost and quality"
    | Preset | Cost | Time | Features |
    |--------|------|------|----------|
    | `quick` | $2–$5 | ~30 min | Single model, no counsel, minimal search |
    | `standard` | $10–$25 | ~2 hrs | Single model, standard search, full pipeline |
    | `thorough` | $40–$100 | ~6 hrs | Multi-model counsel debate, expanded search |
    | `maximum` | $80–$200 | 12+ hrs | Full counsel, deep tree search, multiple revisions |

## Step 5: Check Results

```bash
msc status     # View running pipelines
msc logs -f    # Tail live output
msc runs       # List past runs
```

Output manuscripts are saved to `results/` by default.

## What gets produced

After a successful run, your output directory contains:

| File | Description |
|------|-------------|
| `final_paper.tex` or `final_paper.md` | The generated manuscript |
| `final_paper.pdf` | Compiled PDF (if LaTeX mode) |
| `paper_workspace/` | Literature review, research plan, references |
| `run_summary.json` | Cost, tokens used, stages completed |
| `budget_state.json` | Cumulative spend broken down by model |
| `STATUS.txt` | `COMPLETE`, `INCOMPLETE`, or `ERROR` |

## Next Steps

- [Configuration](configuration.md) — all settings, config files, and CLI flags
- [Usage](usage.md) — campaigns, counsel mode, math agents, tree search
- [HPC / SLURM Setup](setup.md) — deploying on a cluster
