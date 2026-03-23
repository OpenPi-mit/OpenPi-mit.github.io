# Usage

This page covers common workflows for running PoggioAI MSc.

---

## Running a Research Task

The simplest way to run PoggioAI MSc is with a task string:

```bash
python launch_multiagent.py \
  --task "Investigate whether batch normalization reduces spectral norm growth during training" \
  --output-format latex
```

Output is written to `results/MSc_Student_<timestamp>/`, which contains:

- The generated paper (`final_paper.pdf` or `final_paper.md`)
- `run_summary.json` — run metadata, cost, and stage list
- `budget_state.json` — cumulative spend by model
- `STATUS.txt` — `COMPLETE`, `INCOMPLETE`, or `ERROR`
- Agent artifacts organized by stage

## Using Counsel Mode

Counsel mode runs each pipeline stage as a multi-model debate for higher quality output:

```bash
python launch_multiagent.py \
  --task "Your research question" \
  --enable-counsel
```

!!! note
    Counsel mode requires API keys for multiple providers and costs ~4x more tokens per stage.

## Using Math Agents

For research involving mathematical proofs and theorems:

```bash
python launch_multiagent.py \
  --task "Prove convergence bounds for gradient descent on L-smooth functions" \
  --enable-math-agents
```

Math artifacts are written to `math_workspace/` within the run directory.

## Running Campaigns

Campaigns chain multiple pipeline runs together, passing artifacts forward via memory distillation.

### Define a Campaign

Create a `campaign.yaml`:

```yaml
name: my_research
budget_usd: 200
stages:
  theory:
    task: "Develop theoretical framework for ..."
    flags: ["--enable-math-agents", "--no-counsel"]
  experiments:
    task: "Design and run experiments to validate ..."
    depends_on: [theory]
  paper:
    task: "Write the final paper combining theory and experiments"
    depends_on: [theory, experiments]
```

### Initialize and Run

```bash
# Initialize the campaign
python scripts/campaign_heartbeat.py --campaign campaign.yaml --init

# Run one heartbeat tick (advances any ready stages)
python scripts/campaign_heartbeat.py --campaign campaign.yaml
```

The heartbeat checks `campaign_status.json`, launches stages whose dependencies are met, and advances the campaign state.

## Setting a Budget

Hard-cap your spend with `--usd-limit`:

```bash
python launch_multiagent.py \
  --task "Your question" \
  --usd-limit 50
```

The pipeline stops with a `BudgetExceededError` if the limit is reached. Budget alerts are triggered at 85%, 95%, and 100%.

## Resuming a Run

PoggioAI MSc checkpoints after every pipeline stage. To resume a failed or interrupted run, re-run the same command — LangGraph will pick up from the last completed checkpoint.

## Listing Past Runs

```bash
python launch_multiagent.py --list-runs
```

## Monitoring

```bash
# Check if a run is still active
cat results/MSc_Student_<timestamp>/STATUS.txt

# View cumulative cost
cat results/MSc_Student_<timestamp>/budget_state.json

# View run summary
cat results/MSc_Student_<timestamp>/run_summary.json
```
