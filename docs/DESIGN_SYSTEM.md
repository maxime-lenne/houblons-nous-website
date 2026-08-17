# Design System

UI/UX design system and conventions guide.

## 🎨 Design Principles

- **Consistency** - Unified look and feel
- **Accessibility** - WCAG 2.1 AA compliance
- **Responsive** - Mobile-first approach
- **Performance** - Optimized assets

---

## 🎨 Color System

### Primary Colors

```css
:root {
  --color-primary: #2563eb;
  --color-primary-light: #3b82f6;
  --color-primary-dark: #1d4ed8;
}
```

### Secondary Colors

```css
:root {
  --color-secondary: #64748b;
  --color-secondary-light: #94a3b8;
  --color-secondary-dark: #475569;
}
```

### Semantic Colors

```css
:root {
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Theme Colors

```css
:root {
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
  --color-border: #e2e8f0;
}

/* Dark mode */
:root[data-theme="dark"] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-border: #334155;
}
```

---

## 📝 Typography

### Font Families

```css
:root {
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: 'SF Mono', Monaco, monospace;
}
```

### Font Sizes

```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

---

## 📏 Spacing

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 3rem;      /* 48px */
  --space-2xl: 6rem;     /* 96px */
}
```

---

## 📐 Layout

### Container

```css
:root {
  --container-max-width: 1280px;
  --container-padding: clamp(1rem, 5vw, 3rem);
}
```

### Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

---

## 🧩 Components

### Naming Convention

Use BEM or consistent naming:

```css
.component { }
.component__element { }
.component--modifier { }
```

### Component List

| Component | Description |
|-----------|-------------|
| Button | Interactive button element |
| Card | Content container |
| Input | Form input field |
| Modal | Dialog overlay |

See [COMPONENT_REFERENCE.md](./COMPONENT_REFERENCE.md) for details.

---

## 🎭 Animations

### Transitions

```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}
```

### Motion

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

## ♿ Accessibility

### Focus States

All interactive elements must have visible focus states.

### Color Contrast

- Normal text: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio

### Skip Links

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

---

## 📁 File Structure

```
styles/
├── _variables.css      # Design tokens
├── _base.css           # Base styles
├── _components.css     # Component styles
├── _utilities.css      # Utility classes
└── main.css            # Entry point
```

---

*Last updated: [Date]*
