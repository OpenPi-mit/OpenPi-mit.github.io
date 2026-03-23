# Getting Started

Get PoggioAI MSc running in under 5 minutes. You'll need one API key and about $2–10 for a single research run.

---

## Prerequisites

- Python 3.11+
- Conda (Miniconda or Miniforge)
- An API key for at least one LLM provider (Anthropic, OpenAI, or Google)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/PoggioAI/PoggioAI_MSc.git
cd PoggioAI_MSc

# 2. Bootstrap the environment (one-time, ~5 min)
./scripts/bootstrap.sh researchlab minimal

# 3. Activate the environment
conda activate researchlab
```

## Set Up API Keys

```bash
# Copy the example environment file
cp .env.example .env

# Add your API key (only one provider is needed)
echo "ANTHROPIC_API_KEY=your_key_here" >> .env
```

!!! tip "Multiple providers"
    For counsel mode (multi-model debate), you can add keys for multiple providers:
    ```
    ANTHROPIC_API_KEY=...
    OPENAI_API_KEY=...
    GOOGLE_API_KEY=...
    ```

## Validate Setup

Run a dry-run to confirm everything is configured correctly without spending tokens:

```bash
python launch_multiagent.py --task "test" --dry-run
```

## Run Your First Paper

```bash
python launch_multiagent.py \
  --task "$(cat examples/quickstart/task.txt)" \
  --output-format markdown \
  --no-counsel \
  --no-log-to-files
```

!!! info "Cost & Time"
    - **Cost:** ~$2–10 depending on the model and task complexity
    - **Time:** 15–40 minutes for a typical run
    - **Output:** `results/MSc_Student_<timestamp>/` contains your generated paper and artifacts

## Next Steps

- See [Configuration](configuration.md) for all settings and CLI flags
- See [Usage](usage.md) for running campaigns and advanced workflows
- See [HPC / SLURM Setup](setup.md) for deploying on a cluster
