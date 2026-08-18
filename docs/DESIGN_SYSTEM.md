# Design System

UI/UX design system and conventions guide, derived from
[`docs/design-system.png`](./design-system.png) — a warm, artisanal palette evoking paper, brick,
wood, and hops, paired with a stencil display typeface.

## 🎨 Design Principles

- **Consistency** - Unified look and feel
- **Accessibility** - WCAG 2.1 AA compliance
- **Responsive** - Mobile-first approach
- **Performance** - Optimized assets
- **Craft/artisanal tone** - Paper textures, brick, stencil type — not a generic tech UI

---

## 📝 Typography

| Role | Font | Notes |
|------|------|-------|
| Display / headings | **Saira Stencil One** | Stencil display face, used for titles and branding |
| Accent / handwritten | **Caveat** | Script accent for callouts, quotes, small flourishes |
| Body | **Work Sans** | Primary readable sans-serif for body copy and UI text |
| Accent / typewriter | **Special Elite** | Typewriter face for labels, dates, small caps details |

### Font Families

```css
:root {
  --font-display: "Saira Stencil One", system-ui, sans-serif;
  --font-script: "Caveat", cursive;
  --font-sans: "Work Sans", system-ui, -apple-system, sans-serif;
  --font-mono: "Special Elite", "SF Mono", monospace;
}
```

All four are available on [Google Fonts](https://fonts.google.com); load only the weights used.

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

## 🎨 Color System

### Neutrals — paper & stone

Warm off-whites through ink, used for backgrounds, text, and borders.

```css
:root {
  --color-ink: #1a1a1a;
  --color-ink-soft: #3a3a3a;
  --color-bark: #6e5a3e;
  --color-river: #4a6e7a;
  --color-concrete: #bfb8a8;
  --color-mist: #d9d6cc;
  --color-paper-warm: #efe6d2;
  --color-paper: #f5f1e8;
  --color-cream: #faf7ee;
  --color-white: #ffffff;
}
```

| Token | Hex | Typical use |
|-------|-----|--------------|
| `ink` | `#1A1A1A` | Primary text, headings |
| `ink-soft` | `#3A3A3A` | Secondary text |
| `bark` | `#6E5A3E` | Muted brown accent, dividers |
| `river` | `#4A6E7A` | Cool accent, links, info states |
| `concrete` | `#BFB8A8` | Muted borders, disabled states |
| `mist` | `#D9D6CC` | Subtle borders, hairlines |
| `paper-warm` | `#EFE6D2` | Section backgrounds |
| `paper` | `#F5F1E8` | Card backgrounds |
| `cream` | `#FAF7EE` | Page background |
| `white` | `#FFFFFF` | Surfaces, cards on dark backgrounds |

### Accent colors

Three brand accents, each with a tonal scale (`soft` → `deep`) for backgrounds, hovers, and
emphasis states. `green` additionally has a lighter `spray` step between `soft` and `base`.

```css
:root {
  /* Green — hops */
  --color-green: #2f7a3a;
  --color-green-soft: #b4cc9a;
  --color-green-spray: #7fa464;
  --color-green-base: #3d6c38;
  --color-green-deep: #284425;

  /* Brick — terracotta */
  --color-brick: #b23a2c;
  --color-brick-soft: #ddb19e;
  --color-brick-base: #9a3d2c;
  --color-brick-deep: #65271b;

  /* Ochre — amber / beer */
  --color-ochre: #d9a227;
  --color-ochre-soft: #ecd798;
  --color-ochre-base: #cb9a37;
  --color-ochre-deep: #89631f;
}
```

| Accent | Base hex | Soft | (Spray) | Base tone | Deep |
|--------|----------|------|---------|-----------|------|
| Green | `#2F7A3A` | `#B4CC9A` | `#7FA464` | `#3D6C38` | `#284425` |
| Brick | `#B23A2C` | `#DDB19E` | — | `#9A3D2C` | `#65271B` |
| Ochre | `#D9A227` | `#ECD798` | — | `#CB9A37` | `#89631F` |

### Semantic mapping

Map semantic roles onto the palette above rather than introducing new hues:

```css
:root {
  --color-success: var(--color-green-base);
  --color-warning: var(--color-ochre-base);
  --color-error: var(--color-brick-base);
  --color-info: var(--color-river);
}
```

### Theme Colors

```css
:root {
  --color-background: var(--color-cream);
  --color-surface: var(--color-paper);
  --color-text-primary: var(--color-ink);
  --color-text-secondary: var(--color-ink-soft);
  --color-border: var(--color-mist);
}

/* Dark mode */
:root[data-theme="dark"] {
  --color-background: var(--color-ink);
  --color-surface: var(--color-ink-soft);
  --color-text-primary: var(--color-cream);
  --color-text-secondary: var(--color-mist);
  --color-border: var(--color-bark);
}
```

### Textures

The palette is paired with photographic/illustrated textures for section backgrounds — used
sparingly, at low opacity or as bounded panels, not as full-page tiling:

- **Paper grain** — subtle speckled noise overlay on `paper`/`cream` backgrounds
- **Whitewashed brick** — light brick wall texture
- **Red brick** — raw brick wall texture, pairs with the `brick` accent
- **Birch pattern** — illustrated birch trunks with leaves, pairs with the `green` accent

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
- The lighter accent tones (`*-soft`) are for backgrounds/fills only — pair text with `ink` or
  the corresponding `*-deep` tone to meet contrast targets, not with `*-soft` or `*-base` directly.

### Skip Links

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

---

## 📁 File Structure

```
_sass/
├── _base.scss           # Base styles
assets/css/
└── main.scss            # Entry point (imports _sass partials)
```

---

*Last updated: 2026-08-18*
