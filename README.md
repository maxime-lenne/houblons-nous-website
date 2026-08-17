# GitHub Repository Template

<!-- markdownlint-disable -->
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width="80" height="80" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original-wordmark.svg" alt="Github Action" width="80" height="80" />
</p>

<p align="center">
  <strong>GitHub repository template with preconfigured code quality and release automation</strong>
</p>

<p align="center">
<a href="https://github.com/maxime-lenne/github-repository-template/actions?query=workflow%3ALint+branch%3Amaster">
		<img src="https://img.shields.io/github/actions/workflow/status/maxime-lenne/github-repository-template/lint.yml?branch=master"
			 alt="Build Status">
	</a>
  <a href="https://github.com/maxime-lenne/github-repository-template/actions?query=workflow%3ARelease+branch%3Amaster">
		<img src="https://img.shields.io/github/actions/workflow/status/maxime-lenne/github-repository-template/release.yml?branch=master"
			 alt="Build Status">
	</a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
  <a href="https://bun.sh">
    <img src="https://img.shields.io/badge/Package%20Manager-Bun-black" alt="Bun" />
  </a>
  <a href="https://gitmoji.dev">
    <img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg" alt="Gitmoji" />
  </a>
  <a href="https://semantic-release.gitbook.io/">
    <img src="https://img.shields.io/badge/semantic--release-gitmoji-e10079?logo=semantic-release" alt="semantic-release: gitmoji" />
</a>
</p>
<!-- markdownlint-restore -->

---

A ready-to-use GitHub repository template with linting, git hooks, automated changelog, and semantic versioning.

## Features

### Code Quality

- **Bun** - Fast and modern package manager
- **Husky** - Automated Git hooks
- **lint-staged** - Incremental linting on staged files
- **Markdownlint** - Markdown file validation
- **Yamllint** - YAML file validation
- **EditorConfig** - Consistent coding styles across editors

### Commit & Release

- **Gitmoji** - Commits with emojis (`✨ Add feature`)
- **Commitlint** - Validates commit messages (gitmoji or conventional)
- **Changelog** - Auto-generated from commits
- **Semantic Release** - Automated versioning and GitHub releases

### Dependency Management

- **Renovate** - Automatic dependency updates
- **Dependabot** - Security alerts and updates

## Installation

```bash
# Clone the template
git clone https://github.com/maxime-lenne/github-repository-template.git my-project
cd my-project

# Install dependencies
bun install
```

## Usage

### Commits

```bash
# Interactive gitmoji commit
bun run commit
```

Accepted formats:

- **Gitmoji**: `✨ Add new feature`
- **Conventional**: `feat(scope): Add new feature`

### Linting

```bash
bun run lint          # Lint all files
bun run lint:md       # Lint Markdown only
bun run lint:md:fix   # Auto-fix Markdown
bun run lint:yaml     # Lint YAML files
```

### Changelog

```bash
bun run changelog       # Update changelog with new commits
bun run changelog:init  # Generate full changelog from scratch
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

## Version Bumping

Versions are determined automatically by commit emojis:

| Emoji | Version Bump | Example |
|-------|--------------|---------|
| 💥 | Major | Breaking changes |
| ✨ 🎉 | Minor | New features |
| 🐛 🚑️ ⚡️ 🔒️ | Patch | Fixes, performance, security |

## Documentation

| File | Description |
|------|-------------|
| [`docs/AGENTS.md`](docs/AGENTS.md) | AI assistant guide and conventions |
| [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) | Code style and git conventions |
| [`docs/TECHNICAL_GUIDE.md`](docs/TECHNICAL_GUIDE.md) | Technical implementation details |
| [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) | Directory and file organization |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution guidelines |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history |

## Configuration Files

| File | Purpose |
|------|---------|
| `.gitmoji.json` | Gitmoji-cli settings |
| `.releaserc.json` | Semantic-release config |
| `.markdownlint.json` | Markdown linting rules |
| `.yamllint.yml` | YAML linting rules |
| `.editorconfig` | Editor settings |
| `commitlint.config.js` | Commit message validation |

## Customization

1. Update `package.json` with your project name
2. Modify linting rules according to your needs
3. Adjust Renovate/Dependabot configuration
4. Update or replace this README

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Maxime Lenne** - [maxime-lenne.fr](https://maxime-lenne.fr)

- GitHub: [@maxime-lenne](https://github.com/maxime-lenne)
- LinkedIn: [maximelenne](https://linkedin.com/in/maximelenne)
