# Technical Guide

Detailed guide for technical implementation aspects.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Package Manager | Bun | 1.4.2 |
| Node | Node.js | ^22.14.0 \|\| >= 24.10.0 |
| Git Hooks | Husky | ^9.1.7 |
| Staged Files | lint-staged | ^17.5.1 |
| Commit Tool | gitmoji-cli | ^9.7.0 |
| Commit Lint | commitlint | ^21.2.2 |
| Release | semantic-release | ^25.0.9 |
| Markdown Lint | markdownlint-cli | ^0.49.1 |

---

## CI/CD

### Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `lint.yml` | Push / PR to `develop` and `main` | Markdown, YAML and commit message linting |
| `release.yml` | Push to `main` (merged PR), manual | semantic-release (see [Semantic Release](#semantic-release)) |
| `jekyll.yml` | Push to `main`, manual (Baserow webhooks) | Build with `make production` and deploy to GitHub Pages |
| `setup.yml` | Manual | Apply `.github/settings.yml` with an `ADMIN_TOKEN` secret |

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
      - uses: actions/checkout@v7
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version-file: package.json
      - run: bun install --frozen-lockfile
      - run: bun run lint:md

  yamllint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - run: pip install yamllint
      - run: yamllint .
```

### Deploy Workflow

`.github/workflows/jekyll.yml` builds with `make production` and deploys to GitHub Pages on every
push to `main` (houblons-nous.org). It also accepts a `workflow_dispatch` so Baserow webhooks can
trigger a content rebuild.

### Branch Previews

Cloudflare Workers Builds builds every other branch with `bundle install && make preview` and
serves `_site` as a static-only Worker (`wrangler.jsonc`). Previews carry a `noindex` meta tag and
an `X-Robots-Tag` header so they never compete with production in search results — the full
rationale and the Cloudflare project settings are in
[AGENTS.md](AGENTS.md#preview-deployments-cloudflare-workers).

The Cloudflare build image reads `.tool-versions`, so Ruby, Node and Bun versions come from the
same file asdf uses locally. It sets no UTF-8 locale though, which is why the Makefile exports
`RUBYOPT := -EUTF-8` — without it Ruby reads files as US-ASCII and the accented content under
`_people/` crashes the Baserow plugin.

### Additional Workflows (Future)

- **PR Checks** - Tests, type checking
- **Security** - CodeQL analysis

---

## Repository Setup

### Settings as Code

`.github/settings.yml` is the single source of truth for the GitHub
configuration (Settings app format):

| Section | Content |
|---------|---------|
| `repository` | Default branch `develop`, rebase-only merges, auto-merge, delete merged branches, vulnerability alerts on, Dependabot security updates off |
| `labels` | Type, priority, status and effort labels |
| `branches` | Protection of `develop` (PR + CI, no review, force push allowed for the post-release sync) and `main` (PR + CI + 1 approval, no force push), resolved conversations, linear history |

It is applied by `scripts/setup-github.js`, idempotent:

```bash
bun run setup:github                              # apply everything
bun run setup:github --dry-run                    # preview
bun run setup:github --only=labels,protection     # some sections only
```

Sections: `branches` (create missing `main` / `develop`), `repository`,
`security`, `labels`, `protection`, `secrets` (stores `RELEASE_TOKEN` when it
is set in the environment, see [Release Token](#release-token)). Authentication comes from `GH_TOKEN` /
`GITHUB_TOKEN` or the local `gh` session; `repository`, `security` and
`protection` need admin rights. Without local access, run the **Repository
Setup** workflow (`setup.yml`) after adding an `ADMIN_TOKEN` secret (PAT with
repository Administration read & write).

Settings GitHub cannot apply are reported as warnings, not errors: on GitHub
Free, private repositories have no branch protection and no auto-merge.

---

## Git Hooks

### Pre-commit Hook

Husky runs lint-staged automatically on commit:

```json
// package.json
{
  "lint-staged": {
    "*.md": "markdownlint --fix",
    "!(baserow_locations|quartier_assos).{yml,yaml}": "yamllint"
  }
}
```

The two Baserow files are generated on every build and excluded from yamllint
(see `.yamllint.yml`).

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

### Post-checkout Hook: Local Branch Cleanup

On every branch switch (at most once per hour), `scripts/clean-branches.js`
deletes local branches whose PR was merged:

- the remote branch is gone (GitHub deletes it on merge)
- and all its commits are in `origin/develop` or `origin/main`, compared by
  content with `git cherry` (rebase merges rewrite SHAs, so
  `git branch --merged` cannot detect them)

Branches with commits missing from `develop` / `main` are kept and listed.
It is silent when offline or in detached HEAD (rebase in progress).

```bash
bun run clean:branches            # run now
bun run clean:branches --dry-run  # only list what would be deleted
```

### Setup

Hooks are configured automatically via the `prepare` script:

```bash
bun install  # Runs "husky" automatically
```

---

## Dependency Management

Dependencies (Bun packages, `packageManager`, GitHub Actions, Node version in
workflows) are updated by [Renovate](https://docs.renovatebot.com/). The
[Renovate GitHub App](https://github.com/apps/renovate) must be installed on
the repository.

`renovate.json` extends the shared preset
[`maxime-lenne/renovate-config`](https://github.com/maxime-lenne/renovate-config)
and only holds project-specific rules:

| Behavior | Value |
|----------|-------|
| Schedule | Monday before 10am (Europe/Paris) |
| Commit / PR title | `⬆️ Update dependency <name> to <version>` |
| Minimum release age | 3 days before a PR is opened |
| Grouping | Non-major dev dependencies, non-major GitHub Actions |
| Automerge | Minor, patch, pin, digest, lock file maintenance (rebase) |
| Manual review | Major updates, minor updates of `0.x` runtime dependencies |
| Security | Fix PRs opened immediately from GitHub vulnerability alerts |

Automerge needs no human action: Renovate enables GitHub auto-merge
(`allow_auto_merge` in `.github/settings.yml`), or merges the PR itself once
all CI checks are green when auto-merge is not available. `main` is never
targeted: Renovate PRs go to `develop` (default branch) and reach `main`
through the regular release PR.

Project-specific rules in `renovate.json`:

- `conventional-changelog-conventionalcommits` is held below v10 (see
  [Semantic Release](#semantic-release))

Dependabot security updates are disabled (`enable_automated_security_fixes:
false`) to avoid duplicate PRs; GitHub vulnerability alerts stay enabled.

---

## Semantic Release

Automated versioning, release notes and `CHANGELOG.md` based on commit
messages. Configuration lives in `release.config.js`:

```bash
# Run release (usually done by CI)
bun run release

# Dry run to preview release
bun run release:dry
```

### Version Bumping and Release Notes

The commit header is parsed so that the leading gitmoji (unicode or
`:shortcode:`) or, without emoji, the conventional type becomes the commit
type. The same table drives the version bump and the release notes section:

| Gitmoji | Conventional | Version Bump | Release notes section |
|---------|--------------|--------------|-----------------------|
| 💥 | `type!:` | Major | 💥 Breaking Changes |
| ✨ 🎉 | `feat` | Minor | ✨ Features |
| 🐛 🚑️ 🩹 | `fix` | Patch | 🐛 Bug Fixes |
| 🔒️ | | Patch | 🔒 Security |
| ⚡️ | `perf` | Patch | ⚡ Performance |
| ♻️ | `refactor` | Patch | ♻️ Refactoring |
| 🚀 | | Patch | 🚀 Deployment |
| ⬆️ ⬇️ | | Patch | ⬆️ Dependencies |
| Others (📝 🔧 ✅ ...) | `docs`, `chore`, `ci`... | None | Not listed |

A `BREAKING CHANGE:` footer always triggers a major release. Hybrid commits
(`✨ feat(api): add endpoint`) are classified by their gitmoji.

### Release Process

Releases are automated via GitHub Actions (`.github/workflows/release.yml`):

```mermaid
flowchart TD
  trigger_pr[PR develop to main merged: push to main] --> guard{Head commit is 🔖 Release?}
  guard -->|Yes| skip([Skipped: release commit itself])
  guard -->|No| workflow
  trigger_manual[Manual run: workflow_dispatch] --> workflow

  subgraph workflow [release.yml on ubuntu-latest]
    direction TB
    checkout[Checkout full history, fetch-depth 0] --> setup[Setup Node 24 and Bun from packageManager]
    setup --> install[bun install --frozen-lockfile]
    install --> run[bun run release]
  end

  run --> last_tag[Find last release tag vX.Y.Z on main]
  last_tag --> commits[Collect commits since last tag]

  subgraph analyze [commit-analyzer]
    commits --> parse[Parse header: gitmoji or conventional type]
    parse --> rules{Match releaseRules}
    rules -->|💥, type! or BREAKING CHANGE| major[major]
    rules -->|✨ 🎉 or feat| minor[minor]
    rules -->|🐛 🚑 🩹 ⚡ 🔒 🚀 ♻ ⬆ ⬇ or fix, perf, refactor| patch[patch]
    rules -->|anything else: 📝 🔧 docs chore...| none[no bump]
  end

  none --> any_bump{At least one bump?}
  major --> any_bump
  minor --> any_bump
  patch --> any_bump
  any_bump -->|No| stop([No release])
  any_bump -->|Yes: highest bump wins| version[Compute next version]

  version --> notes[release-notes-generator: group commits into sections]
  notes --> npm[npm: set version in package.json, no publish]
  npm --> changelog[changelog: prepend notes to CHANGELOG.md]
  changelog --> git_commit[git: commit 🔖 Release vX.Y.Z with CHANGELOG.md and package.json, push to main with RELEASE_TOKEN]
  git_commit --> tag[Create and push git tag vX.Y.Z]
  tag --> gh_release[github: create GitHub Release with notes and CHANGELOG.md asset]
  gh_release --> sync[sync-develop: rebase develop onto main, push with lease]
  stop --> sync
```

What each release produces:

| Output | Produced by | Content |
|--------|-------------|---------|
| Version number | `@semantic-release/commit-analyzer` | Highest bump among commits since last tag |
| Release notes | `@semantic-release/release-notes-generator` | Commits grouped by section, see table above |
| `package.json` version | `@semantic-release/npm` (`npmPublish: false`) | `vX.Y.Z` without the `v`, nothing published to npm |
| `CHANGELOG.md` | `@semantic-release/changelog` | Release notes inserted below the `# Changelog` title |
| Release commit | `@semantic-release/git` | `🔖 Release vX.Y.Z` with `CHANGELOG.md` + `package.json`, pushed to `main` |
| Git tag | semantic-release core | `vX.Y.Z` on the release commit |
| GitHub Release | `@semantic-release/github` | Release notes + `CHANGELOG.md` attached |

### Trigger

`release.yml` runs on every push to `main`, i.e. when the `develop → main` PR
is merged. It cannot run on the `pull_request` event: semantic-release never
publishes from a pull request context. The push of the `🔖 Release` commit
itself is skipped by the job condition. Git hooks are disabled in the job
(`HUSKY: 0`) so lint-staged and commitlint do not run on the release commit.

### Release Token

The release commit is pushed to `main`, which is protected (PR, checks,
review). `GITHUB_TOKEN` cannot bypass it, and on a personal account GitHub
Actions cannot be added as a bypass actor. Repository admins can
(`enforce_admins: false`), so the workflow uses a `RELEASE_TOKEN` secret: a
personal access token of a repository admin.

Create it once and reuse it for all repositories:

- Fine-grained PAT, resource owner = your account, **All repositories**,
  permissions: Contents, Issues, Pull requests (read and write)
- Or a classic PAT with the `repo` scope

Store it in each repository:

```bash
RELEASE_TOKEN=<pat> bun run setup:github --only=secrets
# or: gh secret set RELEASE_TOKEN
```

Without it, the workflow warns and falls back to `GITHUB_TOKEN`, which only
works when `main` is not protected (e.g. private repository on GitHub Free).

### After a Release: develop Sync

Rebase merges into `main` rewrite SHAs and the release adds a `🔖 Release`
commit, so `develop` no longer contains `main`'s tip and the next
`develop → main` PR would be out of date. The last step of `release.yml`
(also run when there is no release) calls `scripts/sync-develop.js`:

1. fetch `main` and `develop`; stop if `develop` already contains `main`
2. rebase `develop` onto `main`: commits already on `main` (same content) are
   dropped, the others are replayed on top of the `🔖 Release` commit
3. push `develop` with `--force-with-lease` (lease on the fetched SHA)

`develop` allows force pushes for that reason (GitHub applies the no-force-push
rule to admins too). On conflict the step fails: run `bun run sync:develop`
locally and resolve the rebase. See the README for the local commands
(`git reset --hard origin/develop`, `git rebase origin/develop`).

`conventional-changelog-conventionalcommits` must stay on `^9`: v10 requires
`conventional-changelog-writer@9`, not yet used by
`@semantic-release/release-notes-generator@14`.

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

# Preview the next release
bun run release:dry

# Apply .github/settings.yml to GitHub
bun run setup:github

# Rebase develop onto main and push it (automatic after a release)
bun run sync:develop

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

# Re-sync develop after hotfix lands on main: done by release.yml,
# or manually (never: git merge main)
bun run sync:develop
```

### Syncing develop when main advances

```bash
# Automatic after every push to main (release.yml), manual fallback:
bun run sync:develop            # rebase develop onto main, push with lease
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

*Last updated: 2026-09-23*
