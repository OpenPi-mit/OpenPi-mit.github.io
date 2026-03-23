# Configuration

PoggioAI MSc is configured through three files and CLI flags. CLI flags override config file values.

---

## Environment Variables (`.env`)

Create a `.env` file in the project root (`cp .env.example .env`):

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
    Never commit your `.env` file. It is already in `.gitignore`.

---

## LLM Config (`.llm_config.yaml`)

Controls model selection, budget enforcement, and multi-model counsel.

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
  enabled: false                  # Toggle via CLI with --enable-counsel
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

### Persona Council

```yaml
persona_council:
  max_debate_rounds: 3
  synthesis_model: claude-sonnet-4-6
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
    partition: pi_tpoggio
    time: "7-00:00:00"
    cpus: 4
    mem: "32G"

  experiment_gpu:                  # GPU partition for experiments
    partition: pi_tpoggio
    time: "7-00:00:00"
    cpus: 8
    mem: "64G"
    gres: "gpu:a100:1"

  repair:                          # Repair agent partition
    partition: pi_tpoggio
    time: "01:00:00"
    cpus: 2
    mem: "8G"
```

Set cluster paths via environment variables or by editing the file directly:

- `CONDA_INIT_SCRIPT` — path to `conda.sh` init script
- `CONDA_ENV_PREFIX` — conda environment path
- `REPO_ROOT` — path to your PoggioAI MSc clone
- `SCRATCH_ROOT` — scratch storage path
- `SLURM_OUTPUT_DIR` — where to write SLURM logs

---

## CLI Flags Reference

### Core

| Flag | Default | Description |
|------|---------|-------------|
| `--task "..."` | — | Research question or hypothesis |
| `--resume <dir>` | — | Resume from an existing workspace directory |
| `--start-from-stage <name>` | — | Restart from a specific stage (requires `--resume`) |
| `--dry-run` | off | Validate config and API keys, then exit |
| `--list-runs` | — | List past runs with cost and status, then exit |
| `--output-format` | `latex` | `latex` (produces `.tex` + `.pdf`) or `markdown` |
| `--debug` | off | Enable debug-level logging |

### Model and Inference

| Flag | Default | Description |
|------|---------|-------------|
| `--model` | from config | Override model: `claude-opus-4-6`, `claude-sonnet-4-6`, `gpt-5`, `gpt-5.4`, `gemini-3-pro-preview`, etc. |
| `--reasoning-effort` | from config | GPT-5 reasoning: `none`, `minimal`, `low`, `medium`, `high`, `xhigh` |
| `--verbosity` | from config | GPT-5 verbosity: `low`, `medium`, `high` |
| `--interpreter` | `python` | Python interpreter path for experiments |

### Feature Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--enable-counsel` | off | Multi-model debate (4 models per stage, ~4x cost) |
| `--no-counsel` | — | Explicitly disable counsel even if enabled in config |
| `--counsel-max-debate-rounds` | 3 | Debate rounds per stage in counsel mode |
| `--enable-math-agents` | off | Enable theorem proving pipeline (proposer, prover, verifier) |
| `--enable-tree-search` | off | DAG-layered best-first search over claim graph |
| `--tree-max-breadth` | 3 | Parallel branches per decision point |
| `--tree-max-depth` | 4 | Max debug/refinement recursion depth |
| `--tree-max-parallel` | 6 | Max concurrent tree branches |
| `--tree-pruning-threshold` | 0.2 | Score threshold below which branches are pruned |
| `--tree-counsel-mode` | `all_nodes` | When to run counsel in trees: `all_nodes`, `final_only`, `by_depth`, `by_node_type` |
| `--adversarial-verification` | off | Enable hostile red-team verifier after cooperative verifiers |
| `--enable-planning` | off | Create step-by-step research plans |
| `--planning-interval` | 3 | Replan every N steps |
| `--enable-milestone-gates` | off | Pause at strategic milestones for human approval via HTTP |
| `--milestone-timeout` | 3600 | Seconds to wait at a gate before auto-proceeding |

### Pipeline Control

| Flag | Default | Description |
|------|---------|-------------|
| `--autonomous-mode` | on | Run without human checkpoints |
| `--no-autonomous-mode` | — | Enable human approval checkpoints |
| `--max-run-seconds` | — | Hard timeout for entire pipeline |
| `--manager-max-steps` | — | Override manager agent max steps |
| `--followup-max-iterations` | 3 | Max follow-up loops |
| `--max-rebuttal-iterations` | 2 | Max reviewer rebuttal loops |
| `--persona-debate-rounds` | 3 | Debate rounds in persona council |
| `--no-duality-check` | — | Skip theory-experiment consistency check |

### Paper Artifact Enforcement

| Flag | Default | Description |
|------|---------|-------------|
| `--require-pdf` | off | Require `final_paper.pdf` |
| `--enforce-paper-artifacts` | off | Require `final_paper.tex` and related files |
| `--require-experiment-plan` | off | Also require `experiments_to_run_later.md` |
| `--enforce-editorial-artifacts` | off | Require style guide, intro skeleton, review verdict |
| `--min-review-score` | 8 | Minimum reviewer score to accept the paper |

### Logging and Steering

| Flag | Default | Description |
|------|---------|-------------|
| `--log-to-files` | on | Write stdout/stderr to `logs/` |
| `--no-log-to-files` | — | Print to terminal only |
| `--no-steering` | off | Disable live TCP/HTTP steering sockets |
| `--callback-host` | `127.0.0.1` | Host for steering server |
| `--callback-port` | `5001` | Port for steering server |
| `--mode` | auto-detect | Deployment mode: `local`, `tinker`, or `hpc` |

Run `python launch_multiagent.py --help` for the full list.

### Stage Name Aliases

When using `--start-from-stage`, these short names are accepted:

| Alias | Full Stage Name |
|-------|-----------------|
| `literature` | `literature_review_agent` |
| `experiment` | `experimentation_agent` |
| `analysis` | `results_analysis_agent` |
| `math_literature` | `math_literature_agent` |
| `math_proposer` | `math_proposer_agent` |
| `math_prover` | `math_prover_agent` |
| `resources` | `resource_preparation_agent` |
| `writeup` | `writeup_agent` |
| `proofread` | `proofreading_agent` |
| `review` | `reviewer_agent` |
| `brainstorm` | `brainstorm_agent` |
| `goals` | `formalize_goals_agent` |
| `council` | `persona_council` |
