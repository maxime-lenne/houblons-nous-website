# Project Structure

## Directory Organization

```text
github-repository-template/
├── .claude/                    # Claude Code configuration
├── .github/                    # GitHub configuration
│   ├── workflows/              # CI/CD workflows
│   │   └── lint.yml            # Markdown and YAML linting
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── config.yml
│   └── pull_request_template.md
├── docs/                       # Documentation
│   ├── AGENTS.md               # AI assistant guide
│   ├── PROJECT_STRUCTURE.md    # This file
│   ├── CONVENTIONS.md          # Code conventions
│   ├── TECHNICAL_GUIDE.md      # Technical guide
│   ├── DESIGN_SYSTEM.md        # Design system
│   ├── COMPONENT_REFERENCE.md  # Component docs
│   ├── FEATURES.md             # Features list
│   ├── SCREEN_FLOW.md          # Screen flows
│   └── TASKS.md                # Task tracking
├── node_modules/               # Dependencies (Bun)
├── .gitignore                  # Git ignore rules
├── .gitmoji.json               # Gitmoji configuration
├── .markdownlint.json          # Markdownlint rules
├── .yamllint.yml               # Yamllint configuration
├── bun.lock                    # Bun lock file
├── package.json                # Project configuration
├── renovate.json               # Renovate configuration
├── CLAUDE.md                   # AI assistant entry point
├── LICENSE                     # MIT License
└── README.md                   # Main documentation
```

---

## Configuration Files

### Project Configuration

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, project metadata |
| `bun.lock` | Locked dependency versions |
| `.gitmoji.json` | Gitmoji-cli configuration |

### Code Quality

| File | Purpose |
|------|---------|
| `.markdownlint.json` | Markdown linting rules |
| `.yamllint.yml` | YAML linting rules |
| `.editorconfig` | Editor settings (if present) |

### CI/CD

| File | Purpose |
|------|---------|
| `.github/workflows/lint.yml` | Lint on push/PR |
| `renovate.json` | Automatic dependency updates |
| `.github/dependabot.yml` | Security updates |

### Git Hooks

| Directory | Purpose |
|-----------|---------|
| `.husky/` | Git hooks managed by Husky |

---

## Documentation (`docs/`)

| File | Purpose |
|------|---------|
| `AGENTS.md` | Main guide for AI assistants |
| `PROJECT_STRUCTURE.md` | This file - directory layout |
| `CONVENTIONS.md` | Code style and git conventions |
| `TECHNICAL_GUIDE.md` | Technical implementation details |
| `DESIGN_SYSTEM.md` | UI/UX design tokens |
| `COMPONENT_REFERENCE.md` | Component documentation |
| `FEATURES.md` | Epics and user stories |
| `SCREEN_FLOW.md` | Navigation flows |
| `TASKS.md` | Project task tracking |

---

## GitHub Configuration (`.github/`)

### Workflows

- **`lint.yml`** - Runs all linters on push/PR

### Issue Templates

- **`bug_report.yml`** - Bug report template
- **`feature_request.yml`** - Feature request template
- **`config.yml`** - Issue template configuration

### Pull Request

- **`pull_request_template.md`** - PR template

---

*Last updated: 2026-02-03*
