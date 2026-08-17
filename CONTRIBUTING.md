# Contributing

Thank you for your interest in contributing to this project!

## Getting Started

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/maxime-lenne/github-repository-template.git
   cd github-repository-template
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

## Development Workflow

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### Making Changes

1. Make your changes following the project conventions
2. Run linting to ensure code quality:

   ```bash
   bun run lint
   ```

3. Commit your changes using gitmoji:

   ```bash
   bun run commit
   ```

### Commit Convention

This project uses **Gitmoji** for commit messages. Use the interactive tool:

```bash
bun run commit
```

Or write commits manually with the format: `<emoji> <description>`

Examples:

- `✨ Add new feature`
- `🐛 Fix bug in authentication`
- `📝 Update documentation`

Conventional commits are also accepted: `<type>(scope): <description>`

### Submitting a Pull Request

1. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request against the `main` branch
3. Fill out the PR template
4. Wait for review

## Code Style

- Follow the existing code style
- Use EditorConfig settings (`.editorconfig`)
- Ensure all linting passes before committing

## Reporting Issues

- Use the issue templates when available
- Provide clear reproduction steps for bugs
- Include environment details when relevant

## Questions?

Feel free to open an issue for any questions or concerns.
