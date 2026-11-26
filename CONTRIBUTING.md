# Contributing

## Setup

```bash
npm ci
pre-commit install --hook-type pre-commit --hook-type commit-msg
```

`pre-commit` is a [standalone tool](https://pre-commit.com/#install) (`pipx install pre-commit`, `brew install pre-commit`, or `uvx pre-commit`). The hooks it installs are the same checks CI runs.

## Before you push

```bash
npm run build   # regenerate docs/data/content.json from docs/js/content-data.js
npm test        # jest unit tests
npm run test:e2e   # playwright, when a page's behaviour changed
```

Content lives in `docs/js/content-data.js`; see the `portfolio-add-content` skill for the add-an-entry flow. Commit the regenerated `docs/data/content.json` alongside the data change.

## Checks that run on every change

- **pre-commit** (`.pre-commit-config.yaml`): conventional commit messages, whitespace and file hygiene, `actionlint` and `zizmor` on the workflows, a full-SHA-pin check on actions, TruffleHog on the diff, and the jest suite.
- **CI**: `test.yml` (unit, e2e, JS syntax) and `secret-scan.yml` (TruffleHog, server-side and on fork pull requests).

## Commits and pull requests

Commit subjects and pull request titles follow [Conventional Commits](https://www.conventionalcommits.org/): `type: summary` or `type(scope): summary`, imperative, no trailing period. Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `revert`. The `commit-msg` hook checks this locally.

## AI review

[PR-Agent](https://github.com/The-PR-Agent/pr-agent) describes and reviews pull requests opened from branches of this repository: it adds a summary to the description and posts comments, and it cannot push or merge. A pull request from a fork is reviewed when the maintainer comments `/review`. The security model is at the top of [`.github/workflows/pr-agent.yml`](.github/workflows/pr-agent.yml).
