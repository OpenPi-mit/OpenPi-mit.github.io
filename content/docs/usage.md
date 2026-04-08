# Usage

This page covers the main workflows for using **pAI** MSc effectively.

---

## Running Research

### Using presets

```bash
# Quick
msc run "What are the key differences between transformer and state-space models?" --preset quick

# Standard
msc run "Survey the landscape of mechanistic interpretability methods"

# Thorough
msc run "Analyze the theoretical foundations of in-context learning" --preset thorough

# Maximum
msc run "Comprehensive analysis of attention mechanisms" --preset maximum
```

### Using a task file

```bash
msc run --task-file my_task.txt
```

### Direct pipeline invocation

```bash
python launch_multiagent.py \
  --task "Investigate whether batch normalization reduces spectral norm growth" \
  --enable-counsel \
  --enable-math-agents \
  --enforce-paper-artifacts \
  --min-review-score 8
```

### Output directory

All output is written to `results/consortium_<timestamp>/`.

| File | Description |
|------|-------------|
| `final_paper.tex` / `final_paper.md` | Generated manuscript |
| `final_paper.pdf` | Compiled PDF |
| `run_summary.json` | Cost, tokens, stages completed |
| `budget_state.json` | Cumulative spend by model |
| `paper_workspace/` | Research workspace artifacts |
| `math_workspace/` | Proof/verification artifacts (if enabled) |
| `STATUS.txt` | `COMPLETE`, `INCOMPLETE`, or `ERROR` |

## Checking Status and Logs

```bash
msc status
msc logs -f
msc runs
```

## Resuming Interrupted Runs

```bash
msc resume
```

Or:

```bash
python launch_multiagent.py \
  --resume results/consortium_20260307_120000/ \
  --start-from-stage writeup
```

See [Configuration](configuration.md) for stage aliases and flags.

## Counsel Mode

```bash
msc run "Your research question" --preset thorough
```

or

```bash
python launch_multiagent.py \
  --task "Your research question" \
  --enable-counsel \
  --counsel-max-debate-rounds 3
```

Counsel mode requires API keys for multiple providers and costs about 4x a single-model run.

## Math Agents

```bash
python launch_multiagent.py \
  --task "Prove convergence bounds for gradient descent on L-smooth functions" \
  --enable-math-agents
```

## Tree Search

```bash
python launch_multiagent.py \
  --task "Your research question" \
  --enable-tree-search \
  --tree-max-breadth 3 \
  --tree-max-depth 4 \
  --tree-max-parallel 6 \
  --tree-pruning-threshold 0.2
```

## Campaigns

```bash
msc campaign init --name "my_project" --task "Investigate normalization layers in transformer training dynamics"
msc campaign start my_project_campaign.yaml
msc campaign status my_project_campaign.yaml
msc campaign list
```

## Budget Management

```bash
msc budget
msc config set budget_usd 50
```

Alerts trigger at 85%, 95%, and 100%.

## Notifications

```bash
msc notify setup
msc notify test --channel telegram
```

## OpenClaw Integration

```bash
msc openclaw setup
msc openclaw start
msc openclaw status
```

## Adversarial Verification

```bash
python launch_multiagent.py \
  --task "Your question" \
  --adversarial-verification
```
