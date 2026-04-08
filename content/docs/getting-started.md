# Getting Started

Get **pAI** MSc running in under 10 minutes.

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

```bash
# venv
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e .
```

```bash
# conda
conda create -n msc python=3.12 -y
conda activate msc
pip install -e .
```

Optional extras:

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

1. Detect your platform (OS, GPUs, SLURM availability, installed tools)
2. Configure API keys, saved in `~/.msc/.env`
3. Select models and optional counsel models
4. Set budget limits
5. Configure notifications (optional)

## Step 3: Verify Installation

```bash
msc doctor
```

## Step 4: Run Your First Paper

```bash
msc run "What are the key differences between transformer and state-space models?" --preset quick
```

## Step 5: Check Results

```bash
msc status
msc logs -f
msc runs
```

Output manuscripts are saved to `results/` by default.

## What gets produced

| File | Description |
|------|-------------|
| `final_paper.tex` or `final_paper.md` | The generated manuscript |
| `final_paper.pdf` | Compiled PDF (if LaTeX mode) |
| `paper_workspace/` | Literature review, research plan, references |
| `run_summary.json` | Cost, tokens used, stages completed |
| `budget_state.json` | Cumulative spend broken down by model |
| `STATUS.txt` | `COMPLETE`, `INCOMPLETE`, or `ERROR` |

## Next Steps

- [Configuration](configuration.md)
- [Usage](usage.md)
- [HPC / SLURM Setup](setup.md)
