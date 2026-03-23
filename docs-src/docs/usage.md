# Usage

This page covers the main workflows for using PoggioAI MSc effectively.

---

## Single Research Runs

### Quick run (markdown, no counsel)

```bash
python launch_multiagent.py \
  --task "Investigate whether batch normalization reduces spectral norm growth during training" \
  --output-format markdown \
  --no-counsel \
  --no-log-to-files
```

Cost: ~$2–10. Time: 15–40 minutes.

### Publication-quality run

```bash
python launch_multiagent.py \
  --task "Analyze attention mechanisms in vision transformers" \
  --enable-counsel \
  --enable-math-agents \
  --enforce-paper-artifacts \
  --enforce-editorial-artifacts \
  --min-review-score 8
```

Cost: ~$40–100. Time: 4–8 hours. Requires API keys for multiple providers.

### Output directory

All output is written to `results/consortium_<timestamp>/`:

| File | Description |
|------|-------------|
| `final_paper.tex` / `final_paper.md` | Generated manuscript |
| `final_paper.pdf` | Compiled PDF (latex mode) |
| `run_summary.json` | Cost, tokens, stages completed |
| `budget_state.json` | Cumulative spend by model |
| `experiment_metadata.json` | Platform info, git commit, CLI args |
| `STATUS.txt` | `COMPLETE`, `INCOMPLETE`, or `ERROR` |
| `paper_workspace/` | Editorial artifacts, style guide, review verdicts |
| `math_workspace/` | Claim graphs, proofs, verifications (if math agents enabled) |
| `.checkpoints.db` | LangGraph checkpoints for resumption |

---

## Resuming Runs

### Resume from last checkpoint

```bash
python launch_multiagent.py \
  --resume results/consortium_20260307_120000/ \
  --task "Continue the writing section"
```

### Resume from a specific stage

```bash
python launch_multiagent.py \
  --resume results/consortium_20260307_120000/ \
  --start-from-stage writeup
```

See [Configuration — Stage Name Aliases](configuration.md#stage-name-aliases) for the full list of short names.

### List past runs

```bash
python launch_multiagent.py --list-runs
```

Shows all runs in `results/` with cost and status.

---

## Counsel Mode

Counsel mode runs each pipeline stage as a multi-model debate. Four independent models produce answers, debate for multiple rounds, then synthesize a consensus.

```bash
python launch_multiagent.py \
  --task "Your research question" \
  --enable-counsel \
  --counsel-max-debate-rounds 3
```

!!! note "Requirements"
    Counsel mode requires API keys for **multiple providers** (Anthropic + OpenAI + Google). It costs roughly **4x** a single-model run.

The debate models and synthesis model are configured in `.llm_config.yaml` under the `counsel` section.

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

Counsel-in-tree modes:

| Mode | Behavior |
|------|----------|
| `all_nodes` | Run counsel at every tree node (default, most expensive) |
| `final_only` | Only counsel on the final selected branch |
| `by_depth` | Counsel only at certain depth levels |
| `by_node_type` | Counsel only on specific node types |

---

## Campaigns (Multi-Stage Research)

Campaigns chain multiple pipeline runs together, passing artifacts forward through memory distillation. Use campaigns when your research requires distinct phases (e.g., theory first, then experiments, then paper).

### Create a campaign

```bash
python scripts/campaign_cli.py \
  init-campaign \
  --name "Normalization Study" \
  --task automation_tasks/my_task.txt \
  --budget 500 \
  --auto-approve
```

Or write a `campaign.yaml` manually:

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

For manual control, define stages explicitly:

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

### Run the campaign

```bash
# Initialize
python scripts/campaign_heartbeat.py --campaign campaign.yaml --init

# Check status
python scripts/campaign_heartbeat.py --campaign campaign.yaml --status

# Run one heartbeat tick (launches ready stages, advances state)
python scripts/campaign_heartbeat.py --campaign campaign.yaml

# Or validate without launching
python scripts/campaign_heartbeat.py --campaign campaign.yaml --validate
```

The heartbeat is designed to be called on a schedule (e.g., every 15 minutes via cron). Each tick checks dependencies, launches ready stages, and advances the campaign state.

### Heartbeat exit codes

| Code | Meaning |
|------|---------|
| `0` | Campaign complete (all stages done) |
| `1` | Campaign in progress (normal tick) |
| `2` | Failed stage (human attention needed) |
| `3` | Just advanced (new stage launched) |
| `4` | Campaign stuck (max idle ticks or unsatisfiable deps) |

### Campaign CLI commands

The campaign CLI (`scripts/campaign_cli.py`) provides JSON-based management:

```bash
python scripts/campaign_cli.py --campaign campaign.yaml <command>
```

| Command | Description |
|---------|-------------|
| `status` | Full campaign status with budget snapshot |
| `dashboard` | Compact one-screen overview |
| `launch <stage_id>` | Manually launch a stage |
| `repair <stage_id>` | Trigger autonomous repair of a failed stage |
| `budget` | Budget summary |
| `stage-logs <stage_id>` | View stage logs (`--tail N` for last N lines) |
| `stage-artifacts <stage_id>` | Check artifact presence |
| `analyze-logs <stage_id>` | Structured log analysis |
| `set-stage-status <id> <status>` | Override status: `pending`, `in_progress`, `completed`, `failed` |
| `launchable` | List stages ready to launch |
| `distill <stage_id>` | Run memory distillation for a stage |
| `show-plan` | Show proposed dynamic plan |
| `approve-plan` / `reject-plan` | Approve or reject dynamic plan |
| `archive` | Archive finished campaign to `archive/` |
| `archive-all` | Archive all finished campaigns |
| `check-credits` | Verify API access and credit balance |
| `validate-pipeline` | Validate all stages use v2 pipeline |

---

## Budget Control

### Per-run budget

Budget is configured in `.llm_config.yaml` under `budget.usd_limit`. The pipeline halts cleanly when the limit is reached, preserving all artifacts produced so far.

Alerts trigger at **85%**, **95%**, and **100%** of the budget.

### Per-campaign budget

Set in `campaign.yaml` at the top level or per-stage.

### Token usage report

```bash
python scripts/export_private_token_report.py --output report.csv
```

The private token ledger is stored at `.local/private_token_usage/api_token_calls.jsonl`.

---

## Live Steering

While a run is active, you can inject mid-run instructions via the HTTP steering API (port 5002). This is useful for course-correcting experiments or skipping phases.

Disable with `--no-steering` in containerized or restricted environments.

---

## Adversarial Verification

For higher confidence in results, enable a hostile red-team verifier that runs after the cooperative verifiers:

```bash
python launch_multiagent.py \
  --task "Your question" \
  --adversarial-verification
```

---

## Monitoring

```bash
# Check run status
cat results/consortium_<timestamp>/STATUS.txt

# View cumulative cost
cat results/consortium_<timestamp>/budget_state.json

# View run summary
cat results/consortium_<timestamp>/run_summary.json

# Campaign monitoring
python scripts/campaign_monitor.py --campaign campaign.yaml
```

---

## Utility Scripts

| Script | Purpose |
|--------|---------|
| `scripts/preflight_check.py` | Validate environment (`--with-latex`, `--with-docs`, `--with-experiment`) |
| `scripts/export_private_token_report.py` | Export token usage to CSV |
| `scripts/campaign_monitor.py` | Monitor long-running campaigns |
| `scripts/run_campaign_planner.py` | Generate campaign spec from a task file |
| `scripts/setup_mode.py` | Interactive configuration wizard |
| `scripts/lemma_library_cli.py` | Manage the math lemma library |
