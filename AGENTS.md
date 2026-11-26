# AGENTS.md

## Prime Directive

**KISS** — Keep It Simple, Stupid. Minimal changes, no over-engineering.

## Testing Gate

All agents **must** run `npm test` and confirm all tests pass before considering any task complete. If tests fail, fix them before committing. Never commit code that breaks existing tests.

## Workflow

1. Make the minimal change required
2. Run `npm run build` if content data was modified
3. Run `npm test` — all tests must pass
4. Only then is the work ready to commit

## Hooks and checks

Install the hooks once: `pre-commit install --hook-type pre-commit --hook-type commit-msg`. They run the same checks as CI (see [CONTRIBUTING.md](CONTRIBUTING.md)): conventional commit messages, workflow linting (`actionlint`, `zizmor`), action SHA-pinning, TruffleHog, and the jest suite. Do not bypass them with `--no-verify`.
