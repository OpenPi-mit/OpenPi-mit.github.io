# HPC / SLURM Setup

This guide covers deploying **pAI** MSc on SLURM-managed HPC clusters.

---

## Prerequisites

- Access to a SLURM cluster with outbound internet
- Conda installed (Miniconda or Miniforge)
- API keys for at least one LLM provider

## Quick Start

```bash
git clone https://github.com/PoggioAI/PoggioAI_MSc.git && cd PoggioAI_MSc
git checkout MSc_Prod
conda create -n msc python=3.12 -y
conda activate msc
pip install -e ".[all]"
msc setup
msc doctor
msc run --mode hpc "Analyze convergence properties of adaptive optimizers"
```

## Two-Tier Execution Model

### Tier 1: Orchestrator (CPU)

- Runs on a CPU partition
- Makes outbound HTTPS calls to LLM APIs
- Coordinates 22+ specialist agents via LangGraph

### Tier 2: Experiment Jobs (GPU)

- Submitted by the orchestrator via `sbatch`
- Runs experiment execution workloads
- Partition/resources configured in `engaging_config.yaml`

Set `CONSORTIUM_SLURM_ENABLED=1` to enable automatic GPU job submission.

## Cluster Configuration

```yaml
cluster:
  name: engaging
  orchestrator:
    partition: your_partition
    time: "7-00:00:00"
    cpus: 4
    mem: "32G"
  experiment_gpu:
    partition: your_gpu_partition
    time: "7-00:00:00"
    cpus: 8
    mem: "64G"
    gres: "gpu:a100:1"
```

## Running on SLURM

```bash
msc run --mode hpc "Your research question"
```

Campaigns:

```bash
msc campaign init --name "my_project" --task "Your research directive"
msc campaign start my_project_campaign.yaml
msc campaign status my_project_campaign.yaml
```

OpenClaw oversight:

```bash
msc openclaw setup
msc openclaw start
msc openclaw status
```

## Monitoring

```bash
squeue -u $USER
msc status
msc runs
msc budget
msc campaign status campaign.yaml
```

## Troubleshooting

### conda not found

```bash
export CONDA_INIT_SCRIPT=/path/to/miniforge3/etc/profile.d/conda.sh
source "$CONDA_INIT_SCRIPT"
```

### GPU experiment job fails

Check SLURM logs in your run output directory.

### API calls fail from compute node

Use a node/partition with outbound internet for the orchestrator.
