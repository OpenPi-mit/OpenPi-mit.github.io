# Configuration

PoggioAI MSc is configured through environment variables, YAML config files, and CLI flags.

---

## Environment Variables (`.env`)

Create a `.env` file in the project root (or `cp .env.example .env`):

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | At least one | API key for Claude models |
| `OPENAI_API_KEY` | At least one | API key for GPT models |
| `GOOGLE_API_KEY` | At least one | API key for Gemini models |
| `CONSORTIUM_SLURM_ENABLED` | No | Set to `1` to enable SLURM GPU job submission |
| `CONSORTIUM_PDFLATEX_PATH` | No | Path to `pdflatex` if not on `$PATH` |

!!! warning
    Never commit your `.env` file. It is already in `.gitignore`.

## LLM Config (`.llm_config.yaml`)

Controls model selection, budget limits, and counsel mode settings:

```yaml
model: claude-opus-4-6          # Primary model
output_format: latex             # latex or markdown
usd_limit: 600                   # Hard budget cap in USD

counsel:
  enabled: false
  models:
    - claude-opus-4-6
    - claude-sonnet-4-6
    - gpt-5.4
    - gemini-3-pro-preview
```

## Cluster Config (`engaging_config.yaml`)

For SLURM/HPC deployments. See [HPC Setup](setup.md) for details.

| Setting | Description |
|---------|-------------|
| `conda_init_script` | Path to your conda `conda.sh` init script |
| `conda_env_prefix` | Path to your conda environment |
| `repo_root` | Path to the PoggioAI MSc clone |
| `slurm_output_dir` | Where to write SLURM logs |
| GPU/CPU partition names | Cluster-specific partition configuration |
| Resource limits | CPUs, memory, wall time |

These can also be set via environment variables: `CONDA_INIT_SCRIPT`, `CONDA_ENV_PREFIX`, `REPO_ROOT`, `SLURM_OUTPUT_DIR`.

## CLI Flags

### Core Options

| Flag | Default | Description |
|------|---------|-------------|
| `--task "..."` | — | Research question or hypothesis (required) |
| `--output-format` | `latex` | Output format: `latex` or `markdown` |
| `--usd-limit` | 600 | Budget cap in USD |
| `--dry-run` | off | Validate config without running |

### Pipeline Options

| Flag | Default | Description |
|------|---------|-------------|
| `--enable-counsel` | off | Enable multi-model debate mode |
| `--no-counsel` | — | Explicitly disable counsel mode |
| `--enable-math-agents` | off | Enable theorem proving stages |
| `--enable-tree-search` | off | Enable tree search exploration |
| `--min-review-score` | 8 | Minimum review score to accept the paper |

### Output Options

| Flag | Default | Description |
|------|---------|-------------|
| `--no-log-to-files` | — | Disable file-based logging |
| `--enforce-paper-artifacts` | off | Require all paper artifacts to be present |
| `--list-runs` | — | List past runs and exit |

Run `python launch_multiagent.py --help` for the full list of flags.
