# Usage

This page covers the main workflows for using PoggioAI MSc effectively.

---

## Running Research

### Using presets

Presets are the simplest way to balance cost, time, and quality:

```bash
# Quick test (~$2-5, 30 min)
msc run "What are the key differences between transformer and state-space models?" --preset quick

# Standard research (~$10-25, 2 hrs)
msc run "Survey the landscape of mechanistic interpretability methods"

# Publication-quality with counsel (~$40-100, 6 hrs)
msc run "Analyze the theoretical foundations of in-context learning" --preset thorough

# Maximum rigor (~$80-200, 12+ hrs)
msc run "Comprehensive analysis of attention mechanisms" --preset maximum
```

### Using a task file

For complex research directives that exceed a single command:

```bash
msc run --task-file my_task.txt
```

The task file can include structured instructions, scope constraints, specific references, and output format preferences.

### Direct pipeline invocation

For fine-grained control over individual flags:

```bash
python launch_multiagent.py \
  --task "Investigate whether batch normalization reduces spectral norm growth" \
  --enable-counsel \
  --enable-math-agents \
  --enforce-paper-artifacts \
  --min-review-score 8
```

### Output directory

All output is written to `results/consortium_<timestamp>/`:

| File | Description |
|------|-------------|
| `final_paper.tex` / `final_paper.md` | Generated manuscript |
| `final_paper.pdf` | Compiled PDF (latex mode) |
| `run_summary.json` | Cost, tokens, stages completed |
| `budget_state.json` | Cumulative spend by model |
| `paper_workspace/` | Literature review, research plan, references, editorial artifacts |
| `math_workspace/` | Claim graphs, proofs, verifications (if math agents enabled) |
| `STATUS.txt` | `COMPLETE`, `INCOMPLETE`, or `ERROR` |

---

## Checking Status and Logs

```bash
msc status     # View running pipelines
msc logs -f    # Tail live output
msc runs       # List past runs
```

---

## Resuming Interrupted Runs

If a run is interrupted (network failure, budget pause, system restart):

```bash
msc resume
```

MSc persists all intermediate artifacts and pipeline state, so resumption avoids re-executing completed stages.

For more control, use `launch_multiagent.py` directly:

```bash
# Resume from last checkpoint
python launch_multiagent.py \
  --resume results/consortium_20260307_120000/ \
  --task "Continue the writing section"

# Resume from a specific stage
python launch_multiagent.py \
  --resume results/consortium_20260307_120000/ \
  --start-from-stage writeup
```

See [Configuration — Stage Name Aliases](configuration.md#stage-name-aliases) for the full list of short names.

---

## Counsel Mode

Counsel mode runs each pipeline stage as a multi-model debate. Multiple frontier models (Claude, GPT, Gemini) independently evaluate the current state, then a structured aggregation protocol synthesizes their judgments. This reduces single-model blind spots.

```bash
# Via preset
msc run "Your research question" --preset thorough

# Via direct flag
python launch_multiagent.py \
  --task "Your research question" \
  --enable-counsel \
  --counsel-max-debate-rounds 3
```

!!! note "Requirements"
    Counsel mode requires API keys for **multiple providers** (Anthropic + OpenAI + Google). It costs roughly **4x** a single-model run.

---

## Math Agents

For research involving formal mathematics — theorems, proofs, and verification:

```bash
python launch_multiagent.py \
  --task "Prove convergence bounds for gradient descent on L-smooth functions" \
  --enable-math-agents
```

This inserts six additional stages into the pipeline:

1. **Math Literature Agent** — survey relevant mathematical prior work
2. **Math Proposer Agent** — build a claim DAG (directed acyclic graph of lemmas/theorems)
3. **Math Prover Agent** — write formal proofs
4. **Math Rigorous Verifier Agent** — symbolic verification
5. **Math Empirical Verifier Agent** — numerical cross-checks
6. **Proof Transcription Agent** — format proofs for the paper

Math artifacts are written to `math_workspace/` within the run directory, including `claim_graph.json`.

---

## Tree Search

Tree search enables parallel exploration of proof strategies using DAG-layered best-first search. Inspired by AI Scientist-v2 (arXiv:2504.08066v1).

```bash
python launch_multiagent.py \
  --task "Your research question" \
  --enable-tree-search \
  --tree-max-breadth 3 \
  --tree-max-depth 4 \
  --tree-max-parallel 6 \
  --tree-pruning-threshold 0.2
```

Tree search integrates at four points in the pipeline: ideation, theory track, experiment track, and follow-up loops. It can be combined with counsel mode:

```bash
--enable-tree-search --enable-counsel --tree-counsel-mode all_nodes
```

| Counsel-in-tree Mode | Behavior |
|----------------------|----------|
| `all_nodes` | Run counsel at every tree node (default, most expensive) |
| `final_only` | Only counsel on the final selected branch |
| `by_depth` | Counsel only at certain depth levels |
| `by_node_type` | Counsel only on specific node types |

---

## Campaigns (Multi-Stage Research)

Campaigns orchestrate multi-stage research projects where each stage builds on prior results. Use them for projects that span multiple related questions or require iterative deepening.

### Create and launch a campaign

```bash
# Initialize from a research directive
msc campaign init --name "my_project" --task "Investigate the role of normalization layers in transformer training dynamics"

# Review and customize the generated campaign spec
# (edit my_project_campaign.yaml as needed)

# Launch the campaign
msc campaign start my_project_campaign.yaml

# Monitor progress
msc campaign status my_project_campaign.yaml

# List all campaigns
msc campaign list
```

### Campaign YAML structure

For manual control, write a `campaign.yaml`:

```yaml
name: my_research
workspace_root: results/my_research_v1

heartbeat_interval_minutes: 15
max_idle_ticks: 6
max_campaign_hours: 96

planning:
  enabled: true                    # Dynamically generate stages from task
  base_task_file: automation_tasks/task.txt
  max_stages: 6
  human_review: true
  planning_budget_usd: 5.0

repair:
  enabled: true                    # Auto-repair failed stages
  max_attempts: 2
  model: claude-sonnet-4-6
  two_phase: true                  # Plan → review → execute

stages: []                         # Leave empty for dynamic planning
```

### Static stages

Define stages explicitly with dependencies and artifact contracts:

```yaml
stages:
  - id: theory
    task_file: automation_tasks/theory.txt
    args: ["--enable-math-agents"]
    depends_on: []
    success_artifacts:
      required: [math_workspace/claim_graph.json]

  - id: experiments
    task_file: automation_tasks/experiments.txt
    depends_on: [theory]
    context_from: [theory]
    success_artifacts:
      required: [experiment_results.json]

  - id: paper
    task_file: automation_tasks/paper.txt
    depends_on: [theory, experiments]
    context_from: [experiments, theory]
    args: ["--require-pdf"]
    success_artifacts:
      required: [final_paper.pdf]
```

### Campaign heartbeat

The heartbeat advances campaign state — call it on a schedule:

```bash
# Initialize
python scripts/campaign_heartbeat.py --campaign campaign.yaml --init

# Run one tick
python scripts/campaign_heartbeat.py --campaign campaign.yaml
```

| Exit Code | Meaning |
|-----------|---------|
| `0` | Campaign complete (all stages done) |
| `1` | Campaign in progress (normal tick) |
| `2` | Failed stage (human attention needed) |
| `3` | Just advanced (new stage launched) |
| `4` | Campaign stuck (max idle ticks or unsatisfiable deps) |

Campaigns support automatic archival, budget enforcement with threshold alerts, artifact validation gates, and resume-on-failure.

---

## Budget Management

```bash
msc budget                              # Spending summary across all runs
msc budget --results-dir results/myrun  # Spending for a specific run
msc config set budget_usd 50            # Set default cap
```

Budget enforcement is hard-capped: the pipeline halts cleanly when the limit is reached, preserving all artifacts. Alerts trigger at **85%**, **95%**, and **100%**.

---

## Notifications

Stay informed about long-running pipelines without watching the terminal:

```bash
msc notify setup                 # Interactive notification setup
msc notify test --channel telegram   # Test a configured channel
```

Notifications fire on run completion, budget threshold warnings, and pipeline errors. Supported channels: **Telegram** and **Slack**.

---

## OpenClaw Integration

OpenClaw provides optional autonomous oversight for long-running campaigns. It monitors pipeline health, detects stalls, and can trigger repairs without human intervention.

```bash
msc openclaw setup     # One-time setup
msc openclaw start     # Start the oversight agent
msc openclaw status    # Check oversight status
```

OpenClaw is particularly useful for HPC deployments where runs span multiple SLURM jobs.

---

## Adversarial Verification

For higher confidence in results, enable a hostile red-team verifier:

```bash
python launch_multiagent.py \
  --task "Your question" \
  --adversarial-verification
```
