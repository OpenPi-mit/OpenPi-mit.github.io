# Configuration

PoggioAI MSc stores configuration in `~/.msc/config.yaml`. You can manage it via the `msc config` CLI or by editing the file directly.

---

## Quick Config via CLI

```bash
msc config get model                      # View current model
msc config set model claude-opus-4-6      # Set primary model
msc config set budget_usd 50              # Set default budget cap
msc config set output_format latex         # latex or markdown
msc config set counsel_enabled true        # Enable multi-model debate
```

---

## Environment Variables

API keys and service credentials are stored in `~/.msc/.env` (created by `msc setup`). You can also set them as environment variables or in a project-level `.env`:

### API Keys

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | At least one | Claude models (Opus, Sonnet) |
| `OPENAI_API_KEY` | At least one | GPT models |
| `GOOGLE_API_KEY` | At least one | Gemini models |
| `DEEPSEEK_API_KEY` | No | DeepSeek models |

### Optional

| Variable | Description |
|----------|-------------|
| `CONSORTIUM_SLURM_ENABLED` | Set to `1` to enable SLURM GPU job submission |
| `CONSORTIUM_TEXLIVE_BIN` | Path to TeX Live binaries (if not on `$PATH`) |
| `LANGCHAIN_TRACING_V2` | Set to `true` to enable LangSmith tracing |
| `LANGCHAIN_API_KEY` | LangSmith API key |
| `SLACK_WEBHOOK_URL` | Slack notifications for campaign events |
| `TELEGRAM_BOT_TOKEN` | Telegram notifications (with `TELEGRAM_CHAT_ID`) |
| `TINKER_API_KEY` | Tinker GPU API access |

!!! warning
    Never commit `.env` files. They are in `.gitignore` by default.

---

## LLM Config (`.llm_config.yaml`)

For advanced control, edit `.llm_config.yaml` in the project root. This overrides `~/.msc/config.yaml` defaults.

### Model and Budget

```yaml
main_agents:
  model: claude-sonnet-4-6        # Primary model for all agents
  reasoning_effort: high
  budget_tokens: 128000

budget:
  usd_limit: 25                   # Hard budget cap (pipeline halts at limit)
  hard_stop: true
  fail_closed: true
  pricing:                        # Per-model cost (per 1k tokens)
    claude-opus-4-6:
      input_per_1k: 0.005
      output_per_1k: 0.025
    claude-sonnet-4-6:
      input_per_1k: 0.003
      output_per_1k: 0.015
    gpt-5.4:
      input_per_1k: 0.0025
      output_per_1k: 0.015
    gemini-3-pro-preview:
      input_per_1k: 0.00125
      output_per_1k: 0.01
```

Budget alerts trigger at **85%**, **95%**, and **100%** of the limit.

### Counsel Mode

```yaml
counsel:
  enabled: false                  # Toggle via msc config or --preset thorough
  max_debate_rounds: 3
  synthesis_model: claude-sonnet-4-6
  models:
    - model: claude-sonnet-4-6
      reasoning_effort: high
    - model: gpt-5.4
      reasoning_effort: high
    - model: gemini-3-pro-preview
      thinking_budget: 131072
```

### Per-Agent Model Tiers

Assign different models to different agents to optimize cost:

```yaml
per_agent_models:
  enabled: false
  tiers:
    opus: { model: claude-opus-4-6, reasoning_effort: high }
    sonnet: { model: claude-sonnet-4-6, reasoning_effort: high }
    economy: { model: claude-sonnet-4-6, reasoning_effort: low }
  agent_tiers:
    literature_review_agent: sonnet
    experimentation_agent: sonnet
    writeup_agent: sonnet
    proofreading_agent: economy
```

### Experiment Tools

```yaml
run_experiment_tool:
  code_model: claude-sonnet-4-6
  feedback_model: claude-sonnet-4-6
  vlm_model: claude-sonnet-4-6
  report_model: claude-sonnet-4-6
```

---

## Cluster Config (`engaging_config.yaml`)

For SLURM/HPC deployments. See [HPC Setup](setup.md) for full details.

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
```

Set cluster paths via environment variables:

- `CONDA_INIT_SCRIPT` — path to `conda.sh` init script
- `CONDA_ENV_PREFIX` — conda environment path
- `REPO_ROOT` — path to your PoggioAI MSc clone
- `SCRATCH_ROOT` — scratch storage path
- `SLURM_OUTPUT_DIR` — where to write SLURM logs

---

## CLI Reference

### Core Commands

```
msc setup          First-time configuration wizard
msc run            Start a research pipeline
msc doctor         Environment and dependency check
msc status         Check running pipelines
msc logs           Tail pipeline output
msc runs           List past runs
msc resume         Resume an interrupted run
msc campaign       Multi-stage campaign management
msc config         View and edit configuration
msc budget         View spending summary
msc notify         Configure notifications
msc openclaw       OpenClaw autonomous oversight
msc install        Install optional extras
msc --help         Show help for any command
msc --version      Show version
```

Use `msc <command> --help` for detailed usage of any subcommand.

### Run Options

| Flag | Default | Description |
|------|---------|-------------|
| `--preset` | `standard` | Research preset: `quick`, `standard`, `thorough`, `maximum` |
| `--task-file` | — | Path to a task file (alternative to inline task string) |
| `--output-format` | `latex` | `latex` (produces `.tex` + `.pdf`) or `markdown` |
| `--mode` | auto-detect | Deployment mode: `local`, `tinker`, or `hpc` |

### Advanced `launch_multiagent.py` Flags

For fine-grained control, you can use `launch_multiagent.py` directly:

| Flag | Default | Description |
|------|---------|-------------|
| `--task "..."` | — | Research question or hypothesis |
| `--resume <dir>` | — | Resume from an existing workspace directory |
| `--start-from-stage <name>` | — | Restart from a specific stage (requires `--resume`) |
| `--dry-run` | off | Validate config and API keys, then exit |
| `--list-runs` | — | List past runs with cost and status |
| `--model` | from config | Override model selection |
| `--enable-counsel` | off | Multi-model debate (~4x cost) |
| `--no-counsel` | — | Disable counsel even if enabled in config |
| `--counsel-max-debate-rounds` | 3 | Debate rounds per stage |
| `--enable-math-agents` | off | Theorem proving pipeline |
| `--enable-tree-search` | off | DAG-layered best-first search |
| `--tree-max-breadth` | 3 | Parallel branches per decision point |
| `--tree-max-depth` | 4 | Max recursion depth |
| `--tree-max-parallel` | 6 | Max concurrent branches |
| `--tree-pruning-threshold` | 0.2 | Score threshold for branch pruning |
| `--adversarial-verification` | off | Red-team verifier after cooperative verifiers |
| `--enable-milestone-gates` | off | Pause for human approval at milestones |
| `--autonomous-mode` | on | Run without human checkpoints |
| `--max-run-seconds` | — | Hard timeout for entire pipeline |
| `--require-pdf` | off | Require `final_paper.pdf` |
| `--enforce-paper-artifacts` | off | Require all paper artifacts |
| `--min-review-score` | 8 | Minimum reviewer score to accept |
| `--no-log-to-files` | — | Print to terminal only |
| `--no-steering` | off | Disable live HTTP steering |
| `--debug` | off | Enable debug-level logging |

### Stage Name Aliases

When using `--start-from-stage`, these short names are accepted:

| Alias | Full Stage Name |
|-------|-----------------|
| `literature` | `literature_review_agent` |
| `experiment` | `experimentation_agent` |
| `analysis` | `results_analysis_agent` |
| `writeup` | `writeup_agent` |
| `proofread` | `proofreading_agent` |
| `review` | `reviewer_agent` |
| `brainstorm` | `brainstorm_agent` |
| `goals` | `formalize_goals_agent` |
| `council` | `persona_council` |
| `math_proposer` | `math_proposer_agent` |
| `math_prover` | `math_prover_agent` |
| `resources` | `resource_preparation_agent` |
