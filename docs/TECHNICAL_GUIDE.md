# Technical Guide

Detailed guide for technical implementation aspects.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Package Manager | Bun | >= 1.1.45 |
| Node | Node.js | >= 22.11.0 |
| Git Hooks | Husky | ^9.1.7 |
| Staged Files | lint-staged | ^16.2.7 |
| Commit Tool | gitmoji-cli | ^9.7.0 |
| Commit Lint | commitlint | ^20.4.1 |
| Changelog | conventional-changelog | ^5.0.0 |
| Release | semantic-release | ^25.0.3 |
| Markdown Lint | markdownlint-cli | ^0.47.0 |

---

## CI/CD

### Lint Workflow

The project runs linting on every push and PR to `develop` and `main`:

```yaml
# .github/workflows/lint.yml
name: Lint

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  markdownlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run lint:md

  yamllint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: pip install yamllint
      - run: yamllint .
```

### Additional Workflows (Future)

- **PR Checks** - Tests, type checking
- **Security** - CodeQL analysis
- **Deploy** - Automated deployment

---

## Git Hooks

### Pre-commit Hook

Husky runs lint-staged automatically on commit:

```json
// package.json
{
  "lint-staged": {
    "*.md": "markdownlint --fix",
    "*.{yml,yaml}": "yamllint"
  }
}
```

### Commit-msg Hook

Commitlint validates commit messages:

```bash
# .husky/commit-msg
bun commitlint --edit "$1"
```

Configuration in `commitlint.config.js` accepts two formats:

- **Gitmoji**: `<emoji> <description>` (e.g., `✨ Add feature`)
- **Conventional**: `<type>(scope): <description>` (e.g., `feat: Add feature`)

Rules:

- Message must match one of the formats above
- Maximum header length of 100 characters

### Setup

Hooks are configured automatically via the `prepare` script:

```bash
bun install  # Runs "husky" automatically
```

---

## Dependency Management

### Renovate

Renovate is configured to:

- Group minor and patch updates
- Auto-merge patches for devDependencies
- Run updates on Monday morning (Europe/Paris timezone)

### Dependabot

Dependabot monitors:

- Bun dependencies (via package.json)
- GitHub Actions versions

---

## Changelog

Generate changelogs from commit history using gitmoji and conventional commits:

```bash
# Update changelog with new commits
bun run changelog

# Generate full changelog from scratch
bun run changelog:init
```

The changelog is generated in `CHANGELOG.md` and groups commits by type (features, fixes, etc.).

---

## Semantic Release

Automated versioning and releases based on commit messages:

```bash
# Run release (usually done by CI)
bun run release

# Dry run to preview release
bun run release:dry
```

### Version Bumping

Versions are determined by gitmoji:

| Emoji | Version Bump |
|-------|--------------|
| 💥 | Major (breaking change) |
| ✨ 🎉 | Minor (new feature) |
| 🐛 🚑️ 🩹 ⚡️ 🔒️ 🚀 ♻️ ⬆️ ⬇️ | Patch (fix/improvement) |

### CI/CD Integration

Releases are automated via GitHub Actions (`.github/workflows/release.yml`):

- Triggered on push to `main`
- Creates GitHub releases with changelog
- Updates `CHANGELOG.md` and `package.json`

---

## Available Scripts

```bash
# Install dependencies
bun install

# Lint all files
bun run lint

# Lint markdown only
bun run lint:md

# Auto-fix markdown issues
bun run lint:md:fix

# Lint YAML files
bun run lint:yaml

# Create a commit with gitmoji
bun run commit

# Generate/update changelog
bun run changelog

# Setup husky hooks (runs automatically on install)
bun run prepare
```

---

## Linting Rules

### Markdownlint

Configuration in `.markdownlint.json`:

- Line length limits
- Heading structure
- List formatting
- Code block rules

### Yamllint

Configuration in `.yamllint.yml`:

- Indentation rules
- Line length
- Key ordering

---

## Development Workflow

### Feature development

```bash
git checkout develop
git pull origin develop
git checkout -b feature/description

# ... make changes ...
bun run lint
bun run commit

# Before opening PR: rebase on latest develop
git fetch origin
git rebase origin/develop
git push origin feature/description
# → Open PR: feature/description → develop (rebase merge)
```

### Merge develop into main

```bash
# Once feature PRs are merged into develop:
git fetch origin
git checkout develop
git pull origin develop
# → Open PR: develop → main (rebase merge)
```

### Hotfix (urgent fix on main)

```bash
git checkout main
git pull origin main
git checkout -b hotfix/description

# ... fix ...
bun run commit
# → PR: hotfix/description → main (rebase merge)

# Re-sync develop after hotfix lands on main
git checkout develop
git fetch origin
git rebase origin/main          # ✅ never: git merge main
git push origin develop --force-with-lease
```

### Syncing develop when main advances

```bash
git checkout develop
git fetch origin
git rebase origin/main          # ✅ keeps linear history
git push origin develop --force-with-lease
# never: git merge main         # ❌ creates a merge commit → blocks rebase PR
```

### Pre-commit Checklist

- [ ] `bun run lint` passes
- [ ] Documentation updated if needed
- [ ] Commit uses gitmoji convention
- [ ] No sensitive data committed

---

## Issue Templates

### Bug Report

Uses `.github/ISSUE_TEMPLATE/bug_report.yml`:

- Description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### Feature Request

Uses `.github/ISSUE_TEMPLATE/feature_request.yml`:

- Problem description
- Proposed solution
- Alternatives considered

---

*Last updated: 2026-03-03*
