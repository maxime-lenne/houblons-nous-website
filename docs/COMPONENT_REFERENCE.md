# Component Reference

Complete technical reference for all components in the project.

## Table of Contents

- [Overview](#overview)
- [Components](#components)
- [Usage Guidelines](#usage-guidelines)
- [Configuration](#configuration)

---

## Overview

This project uses a component-based architecture.

### Naming Convention

- **Component Name** - PascalCase (e.g., `Button`, `UserCard`)
- **File Name** - Match component name or kebab-case
- **Props** - camelCase

### File Structure

```
components/
├── common/              # Shared components
│   ├── Button/
│   │   ├── index.ts
│   │   ├── Button.tsx
│   │   ├── Button.test.ts
│   │   └── Button.styles.ts
│   └── Card/
├── features/            # Feature-specific components
└── layouts/             # Layout components
```

---

## Components

### Button

Description of the button component.

| File | Path |
|------|------|
| Component | `components/common/Button/Button.tsx` |
| Styles | `components/common/Button/Button.styles.ts` |

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |

#### Usage

```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

---

### Card

Description of the card component.

| File | Path |
|------|------|
| Component | `components/common/Card/Card.tsx` |
| Styles | `components/common/Card/Card.styles.ts` |

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Card title |
| `children` | `ReactNode` | - | Card content |

#### Usage

```tsx
<Card title="Example">
  Card content here
</Card>
```

---

## Usage Guidelines

### Best Practices

1. **Import from index** - Use barrel exports
2. **Props validation** - Always define prop types
3. **Composition** - Prefer composition over inheritance
4. **Accessibility** - Include ARIA attributes when needed

### Testing

```tsx
describe('Button', () => {
  it('renders correctly', () => {
    // Test implementation
  });
});
```

---

## Configuration

### Theme Configuration

```typescript
// Example theme configuration
const theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  },
};
```

---

*Last updated: [Date]*
