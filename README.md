# Houblons Nous

<!-- markdownlint-disable -->
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jekyll/jekyll-plain.svg" alt="Jekyll" width="80" height="80" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original-wordmark.svg" alt="Github Action" width="80" height="80" />
</p>

<p align="center">
  <strong>Blog autour de la bière et du houblon, construit avec Jekyll</strong>
</p>

<p align="center">
<a href="https://github.com/maxime-lenne/houblons-nous-website/actions?query=workflow%3ALint">
		<img src="https://img.shields.io/github/actions/workflow/status/maxime-lenne/houblons-nous-website/lint.yml?branch=develop"
			 alt="Build Status">
	</a>
  <a href="https://github.com/maxime-lenne/houblons-nous-website/actions?query=workflow%3A%22Deploy+Jekyll+site+to+Pages%22">
		<img src="https://img.shields.io/github/actions/workflow/status/maxime-lenne/houblons-nous-website/jekyll.yml?branch=main&label=deploy"
			 alt="Deploy Status">
	</a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
  <a href="https://jekyllrb.com">
    <img src="https://img.shields.io/badge/Jekyll-4.3-red" alt="Jekyll" />
  </a>
  <a href="https://gitmoji.dev">
    <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg" alt="Gitmoji" />
  </a>
</p>
<!-- markdownlint-restore -->

---

Static site for **Houblons Nous**, built with [Jekyll](https://jekyllrb.com) and deployed to
GitHub Pages. Content can be authored as local Markdown (`_posts/`) or synced from Baserow via
[jekyll-baserow-headless-cms](https://github.com/maxime-lenne/jekyll-baserow-headless-cms)
once configured — see [`docs/AGENTS.md`](docs/AGENTS.md#baserow-cms).

layouts, includes, and styles live directly in this repo (`_layouts/`, `_includes/`, `_sass/`).

## Stack

- **Jekyll 4.3** (Ruby 3.3.5) — static site generator
- **jekyll-baserow-headless-cms** — optional Baserow-backed content (disabled by default)
- **Bun** — JS tooling (linting, git hooks, releases)
- **Husky + lint-staged** — pre-commit checks
- **Gitmoji + commitlint** — commit convention
- **GitHub Actions** — lint on PR, deploy to GitHub Pages on push to `main`

## Getting started

```bash
make install   # Ruby + Node.js dependencies (asdf, bundler, bun)
make serve     # Dev server at http://localhost:4001
```

Other useful targets: `make build`, `make production`, `make clean` — see `make help` for the
full list.

## Usage

### Commits

```bash
bun run commit  # Interactive gitmoji commit
```

Accepted formats:

- **Gitmoji**: `✨ Add new feature`
- **Conventional**: `feat(scope): Add new feature`

### Linting

```bash
bun run lint          # Lint all files (markdown, yaml, last commit)
bun run lint:md       # Lint Markdown only
bun run lint:md:fix   # Auto-fix Markdown
bun run lint:yaml     # Lint YAML files
```

### Release

Releases are automated via GitHub Actions on push to `main`. Manual release:

```bash
bun run release:dry   # Preview release
bun run release       # Execute release
```

### Git Hooks

Hooks are automatically configured via Husky:

- **pre-commit**: Runs lint-staged on modified files
- **commit-msg**: Validates commit message format

## Documentation

| File | Description |
|------|-------------|
| [`docs/AGENTS.md`](docs/AGENTS.md) | AI assistant guide, tech stack, and Baserow CMS setup |
| [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) | Code style and git conventions |
| [`docs/TECHNICAL_GUIDE.md`](docs/TECHNICAL_GUIDE.md) | Technical implementation details |
| [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) | Directory and file organization |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution guidelines |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history |

## Configuration Files

| File | Purpose |
|------|---------|
| `_config.yml` | Jekyll site settings, plugins, Baserow CMS collections |
| `_config.dev.yml` / `_config_prod.yml` | Environment overrides (`--config _config.yml,_config.dev.yml`) |
| `Gemfile` | Ruby dependencies (Jekyll + plugins) |
| `Makefile` | Build/serve/deploy commands |
| `env.sample` | Template for `.env` (Baserow CMS credentials) |
| `.gitmoji.json` | Gitmoji-cli settings |
| `.releaserc.json` | Semantic-release config |
| `.markdownlint.json` | Markdown linting rules |
| `.yamllint.yml` | YAML linting rules |
| `.editorconfig` | Editor settings |
| `commitlint.config.js` | Commit message validation |

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Maxime Lenne** - [maxime-lenne.fr](https://maxime-lenne.fr)

- GitHub: [@maxime-lenne](https://github.com/maxime-lenne)
- LinkedIn: [maximelenne](https://linkedin.com/in/maximelenne)
