# AI Agents Guide

Complete guide for AI assistants working on this repository.

## Documentation Index

| File | Purpose | Description |
|------|---------|-------------|
| [`AGENTS.md`](./AGENTS.md) | AI Guide | This file - conventions and rules for AI agents |
| [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) | Architecture | Directory and file organization |
| [`CONVENTIONS.md`](./CONVENTIONS.md) | Code style | Naming conventions, code style, git |
| [`TECHNICAL_GUIDE.md`](./TECHNICAL_GUIDE.md) | Implementation | API, CI/CD, performance, security, tests |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | UI/UX | Colors, typography, spacing, accessibility |
| [`COMPONENT_REFERENCE.md`](./COMPONENT_REFERENCE.md) | Components | Technical reference for UI components |
| [`FEATURES.md`](./FEATURES.md) | Features | Epics, user stories, feature status |
| [`SCREEN_FLOW.md`](./SCREEN_FLOW.md) | Navigation | Screen flows and user journeys |
| [`TASKS.md`](./TASKS.md) | Tasks | Task tracking and backlog |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Package Manager | Bun |
| Node Version | >= 22.11.0 |
| Git Hooks | Husky + lint-staged |
| Commit Convention | Gitmoji |
| Commit Validation | commitlint |
| Linting | markdownlint, yamllint |
| Dependency Updates | Renovate, Dependabot |
| CI/CD | GitHub Actions |

### Available Commands

```bash
bun install           # Install dependencies
bun run lint          # Lint markdown and yaml
bun run lint:md       # Lint markdown only
bun run lint:md:fix   # Auto-fix markdown
bun run lint:yaml     # Lint yaml files
bun run lint:commit   # Validate last commit message
bun run commit        # Interactive gitmoji commit
```

---

## File Summaries

### PROJECT_STRUCTURE.md

Project structure with source/tests/docs organization. Key points:

- Root files: package.json, CLAUDE.md, README.md
- `.github/`: workflows, issue templates, PR template
- `docs/`: all documentation files
- `node_modules/`: dependencies (managed by Bun)

### CONVENTIONS.md

Development conventions. Key points:

- **Naming**: files kebab-case, classes PascalCase, functions camelCase, constants UPPER_SNAKE_CASE
- **CSS**: BEM (block__element--modifier), CSS variables
- **Git branches**: feature/fix/refactor/docs
- **Commits**: Gitmoji convention (emoji + description)

### TECHNICAL_GUIDE.md

Technical implementation guide. Key points:

- **CI/CD**: GitHub Actions workflows (lint on push/PR)
- **Pre-commit**: Husky runs lint-staged automatically
- **Dependency management**: Renovate (weekly) + Dependabot (security)

### DESIGN_SYSTEM.md

UI/UX design system. Key points:

- **Colors**: primary, secondary, semantic (success/warning/error/info)
- **Typography**: system fonts, size scale
- **Spacing**: consistent scale
- **Accessibility**: WCAG 2.1 AA target

### COMPONENT_REFERENCE.md

Component documentation. Key points:

- **Structure**: components organized by type
- **Props**: types and defaults documented
- **Best practices**: composition, accessibility

### FEATURES.md

Feature management. Key points:

- Organization by epics with user stories
- Format: "As a user, I want to [action] so that [benefit]"
- Statuses: Done, In Progress, Planned

### SCREEN_FLOW.md

Navigation and user flows. Key points:

- Flow diagrams between screens
- Entry/Exit points for each screen

### TASKS.md

Project tracking. Key points:

- Current sprint, Backlog, Completed
- Markdown checklist format

---

## AI Agent Specific Rules

### Language Rule

**All written content must be in English**, regardless of the user's prompt language:

- Documentation (markdown files, comments)
- Commit messages
- Tasks and subtasks
- Epics and user stories
- Code comments and JSDoc
- Variable and function names
- Error messages and logs

### Commit Convention

This project accepts **Gitmoji** or **Conventional Commits**:

```bash
bun run commit  # Interactive gitmoji tool
```

**Gitmoji format:** `<emoji> <description>`

| Emoji | Description |
|-------|-------------|
| ✨ | New feature |
| 🐛 | Bug fix |
| 📝 | Documentation |
| ♻️ | Refactor |
| 🔧 | Configuration |

**Conventional format:** `<type>(scope): <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Full gitmoji list: [gitmoji.dev](https://gitmoji.dev)

### Fundamental Principles

1. **Read before modifying** - Always read a file before proposing changes
2. **Consult documentation** - Check relevant docs/ files before any task
3. **Respect existing patterns** - Follow the style and conventions already in place
4. **Minimize changes** - Only modify what is necessary
5. **Document changes** - Update docs if behavior changes

### Code Generation Preferences

| Language | Preferences |
|----------|-------------|
| **Markdown** | Follow markdownlint rules, no trailing spaces |
| **YAML** | Follow yamllint rules, consistent indentation |
| **JavaScript** | ES6+, no unnecessary dependencies |
| **TypeScript** | Strict types, explicit interfaces, avoid `any` |

### Pre-commit Checklist

- [ ] Code passes `bun run lint`
- [ ] Documentation updated if necessary
- [ ] Commit uses gitmoji convention
- [ ] No secrets or sensitive data

### Behaviors to Avoid

- Do not create unnecessary files
- Do not add dependencies without justification
- Do not modify project structure without discussion
- Do not ignore linting errors
- Do not comment out dead code, delete it

### Priorities

1. **Functionality** - Code must work correctly
2. **Readability** - Code must be understandable
3. **Consistency** - Follow existing patterns
4. **Simplicity** - Avoid over-engineering

---

*Last updated: 2026-02-03*
