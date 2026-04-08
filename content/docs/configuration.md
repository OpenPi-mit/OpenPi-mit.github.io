# Configuration

**pAI** MSc stores configuration in `~/.msc/config.yaml`. You can manage it via the `msc config` CLI or by editing the file directly.

---

## Quick Config via CLI

```bash
msc config get model
msc config set model claude-opus-4-6
msc config set budget_usd 50
msc config set output_format latex
msc config set counsel_enabled true
```

## Environment Variables

API keys and service credentials are stored in `~/.msc/.env` (created by `msc setup`). You can also set them as environment variables or in a project-level `.env`.

### API Keys

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | At least one | Claude models |
| `OPENAI_API_KEY` | At least one | GPT models |
| `GOOGLE_API_KEY` | At least one | Gemini models |
| `DEEPSEEK_API_KEY` | No | DeepSeek models |

### Optional

| Variable | Description |
|----------|-------------|
| `CONSORTIUM_SLURM_ENABLED` | Set to `1` to enable SLURM GPU job submission |
| `CONSORTIUM_TEXLIVE_BIN` | Path to TeX Live binaries |
| `LANGCHAIN_TRACING_V2` | Set to `true` to enable LangSmith tracing |
| `LANGCHAIN_API_KEY` | LangSmith API key |
| `SLACK_WEBHOOK_URL` | Slack notifications |
| `TELEGRAM_BOT_TOKEN` | Telegram notifications (with `TELEGRAM_CHAT_ID`) |
| `TINKER_API_KEY` | Tinker GPU API access |

Never commit `.env` files.

## LLM Config (`.llm_config.yaml`)

For advanced control, edit `.llm_config.yaml` in the project root. This overrides `~/.msc/config.yaml` defaults.

```yaml
main_agents:
  model: claude-sonnet-4-6
  reasoning_effort: high
  budget_tokens: 128000

budget:
  usd_limit: 25
  hard_stop: true
  fail_closed: true
```

Budget alerts trigger at **85%**, **95%**, and **100%** of the limit.

### Counsel Mode

```yaml
counsel:
  enabled: false
  max_debate_rounds: 3
  synthesis_model: claude-sonnet-4-6
```

### Per-Agent Model Tiers

```yaml
per_agent_models:
  enabled: false
  tiers:
    opus: { model: claude-opus-4-6, reasoning_effort: high }
    sonnet: { model: claude-sonnet-4-6, reasoning_effort: high }
    economy: { model: claude-sonnet-4-6, reasoning_effort: low }
```

### Experiment Tools

```yaml
run_experiment_tool:
  code_model: claude-sonnet-4-6
  feedback_model: claude-sonnet-4-6
  vlm_model: claude-sonnet-4-6
  report_model: claude-sonnet-4-6
```

## Cluster Config (`engaging_config.yaml`)

For SLURM/HPC deployments. See [HPC Setup](setup.md) for full details.

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

## CLI Reference

### Core Commands

```text
msc setup
msc run
msc doctor
msc status
msc logs
msc runs
msc resume
msc campaign
msc config
msc budget
msc notify
msc openclaw
msc install
```

Use `msc <command> --help` for details.

### Run Options

| Flag | Default | Description |
|------|---------|-------------|
| `--preset` | `standard` | `quick`, `standard`, `thorough`, `maximum` |
| `--task-file` | — | Path to a task file |
| `--output-format` | `latex` | `latex` or `markdown` |
| `--mode` | auto-detect | `local`, `tinker`, `hpc` |

### Stage Name Aliases

| Alias | Full Stage Name |
|-------|-----------------|
| `literature` | `literature_review_agent` |
| `experiment` | `experimentation_agent` |
| `analysis` | `results_analysis_agent` |
| `writeup` | `writeup_agent` |
| `proofread` | `proofreading_agent` |

## Research Presets

| Preset | Cost | Time | Best For |
|--------|------|------|----------|
| `quick` | $2-$5 | ~30 min | Testing, quick summaries, sanity checks |
| `standard` | $10-$25 | ~2 hrs | Most research questions, drafts |
| `thorough` | $40-$100 | ~6 hrs | Publication-quality drafts |
| `maximum` | $80-$200 | 12+ hrs | Rigorous manuscripts, comprehensive surveys |

## Supported Models

| Provider | Models | Env Variable |
|----------|--------|--------------|
| Anthropic | `claude-opus-4-6`, `claude-sonnet-4-6` | `ANTHROPIC_API_KEY` |
| OpenAI | `gpt-5`, `gpt-5-mini`, `gpt-5.4` | `OPENAI_API_KEY` |
| Google | `gemini-3-pro-preview` | `GOOGLE_API_KEY` |
| DeepSeek | `deepseek-chat` | `DEEPSEEK_API_KEY` |

Only **one** provider key is required. Multiple keys unlock counsel mode (multi-model debate).
