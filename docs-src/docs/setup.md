# HPC / SLURM Setup

This guide covers deploying PoggioAI MSc on SLURM-managed HPC clusters.

---

## Prerequisites

- Access to a SLURM cluster with outbound internet (for LLM API calls)
- Conda installed (Miniconda or Miniforge)
- API keys for at least one LLM provider

## Quick Start

```bash
# 1. Clone and enter the repo
git clone https://github.com/PoggioAI/PoggioAI_MSc.git && cd PoggioAI_MSc
git checkout MSc_Prod

# 2. Create environment and install
conda create -n msc python=3.12 -y
conda activate msc
pip install -e ".[all]"

# 3. Run setup wizard
msc setup

# 4. Configure cluster paths
# Either edit engaging_config.yaml directly, or set env vars:
export CONDA_INIT_SCRIPT=/path/to/miniforge3/etc/profile.d/conda.sh
export CONDA_ENV_PREFIX=/path/to/conda/envs/msc
export REPO_ROOT=/path/to/PoggioAI_MSc
export SLURM_OUTPUT_DIR=/path/to/slurm_outputs

# 5. Validate
msc doctor

# 6. Run in HPC mode
msc run --mode hpc "Analyze convergence properties of adaptive optimizers"
```

---

## Two-Tier Execution Model

PoggioAI MSc uses two tiers of SLURM jobs:

### Tier 1: Orchestrator (CPU)

- Runs on a **CPU partition** (e.g., 7-day wall time)
- Makes outbound HTTPS calls to LLM APIs (Claude, GPT, Gemini)
- Coordinates 22+ specialist agents via LangGraph
- Does **not** need a GPU

### Tier 2: Experiment Jobs (GPU)

- Submitted by the orchestrator via `sbatch` when experiments need GPU compute
- Runs AI-Scientist-v2 experiment execution (PyTorch training, etc.)
- Partition and resources configured in `engaging_config.yaml`

Set `CONSORTIUM_SLURM_ENABLED=1` in your `.env` to enable automatic GPU job submission.

---

## Cluster Configuration

### engaging_config.yaml

All cluster-specific settings are centralized in this file:

```yaml
cluster:
  name: engaging
  conda_init_script: ${CONDA_INIT_SCRIPT:-}
  conda_env_prefix: ${CONDA_ENV_PREFIX:-}
  modules:
    conda: miniforge/25.11.0-0
    cuda: cuda/12.4.0
    cudnn: cudnn/9.8.0.87-cuda12

  orchestrator:                    # CPU partition for LLM orchestrator
    partition: your_partition
    time: "7-00:00:00"
    cpus: 4
    mem: "32G"

  experiment_gpu:                  # GPU partition for experiments
    partition: your_gpu_partition
    time: "7-00:00:00"
    cpus: 8
    mem: "64G"
    gres: "gpu:a100:1"

  repair:                          # Repair agent
    partition: your_partition
    time: "01:00:00"
    cpus: 2
    mem: "8G"

  repo_root: ${REPO_ROOT:-}
  scratch_root: ${SCRATCH_ROOT:-}
  slurm_output_dir: ${SLURM_OUTPUT_DIR:-}
```

!!! tip
    Set paths via environment variables so the same config file works across users:
    ```bash
    export CONDA_INIT_SCRIPT=/path/to/conda.sh
    export CONDA_ENV_PREFIX=/path/to/envs/msc
    export REPO_ROOT=/path/to/PoggioAI_MSc
    export SLURM_OUTPUT_DIR=/path/to/slurm_outputs
    ```

---

## Running on SLURM

### Single run

```bash
msc run --mode hpc "Your research question"
```

This submits pipeline stages as SLURM jobs with appropriate resource requests, handles job dependencies, and manages cross-node state.

### Campaigns on SLURM

Campaigns work well with SLURM — the heartbeat launches each stage as a SLURM job:

```bash
# Initialize
msc campaign init --name "my_project" --task "Your research directive"

# Launch
msc campaign start my_project_campaign.yaml

# Monitor
msc campaign status my_project_campaign.yaml
```

For automated scheduling, use the OpenClaw overseer or a cron job to call the heartbeat periodically:

```bash
# Example crontab entry (every 15 minutes)
*/15 * * * * cd /path/to/PoggioAI_MSc && conda activate msc && python scripts/campaign_heartbeat.py --campaign campaign.yaml
```

### OpenClaw oversight

For long-running campaigns on HPC, OpenClaw provides autonomous monitoring:

```bash
msc openclaw setup
msc openclaw start
msc openclaw status
```

---

## Monitoring

```bash
# Check SLURM jobs
squeue -u $USER

# Check orchestrator output
cat slurm_outputs/orch_<job_id>.out

# MSc commands
msc status                         # Running pipelines
msc runs                           # Past runs
msc budget                         # Spending summary

# Experiment GPU job logs
cat results/consortium_*/experiment_runs/*/slurm_logs/exp_*.out

# Campaign dashboard
msc campaign status campaign.yaml
```

---

## Troubleshooting

### "conda not found"

Set `CONDA_INIT_SCRIPT` and source it:

```bash
export CONDA_INIT_SCRIPT=/path/to/miniforge3/etc/profile.d/conda.sh
source "$CONDA_INIT_SCRIPT"
```

### "module not found"

Load the appropriate modules for your cluster:

```bash
module load miniforge         # or your cluster's conda module
module load cuda              # for GPU experiments
```

### GPU experiment job fails

Check the SLURM logs in the experiment run directory:

```bash
cat results/consortium_*/experiment_runs/*/slurm_logs/exp_*.out
cat results/consortium_*/experiment_runs/*/slurm_logs/exp_*.err
```

### API calls fail from compute node

The orchestrator needs **outbound internet access**. If compute nodes don't have it, run the orchestrator on a login node or a partition with internet:

```bash
conda activate msc
nohup python launch_multiagent.py --task "..." --no-counsel &
```

### LaTeX/PDF compilation fails

```bash
# Install TeX toolchain
pip install -e ".[docs]"

# Or point to your system TeX installation
export CONSORTIUM_TEXLIVE_BIN=/path/to/texlive/bin
```

### Campaign stage stuck in "in_progress"

```bash
# Check what's happening
msc campaign status campaign.yaml

# Or use the CLI for detailed analysis
python scripts/campaign_cli.py --campaign campaign.yaml analyze-logs <stage_id>

# Force status reset if the underlying job died
python scripts/campaign_cli.py --campaign campaign.yaml set-stage-status <stage_id> failed

# Trigger repair
python scripts/campaign_cli.py --campaign campaign.yaml repair <stage_id>
```
