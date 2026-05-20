# @_gmdev/visual-editor

A framework-agnostic React visual editor for page sections. Install it in any React project and let your users visually manage page content.

## Installation

```bash
npm install @_gmdev/visual-editor
```

## Quick Start

```tsx
import { VisualEditor } from '@_gmdev/visual-editor';
import type { VisualEditorConfig } from '@_gmdev/visual-editor';

function HeroSection({ data }) {
  return <h1>{data.title}</h1>;
}

const config: VisualEditorConfig = {
  slug: 'home',
  adapter: {
    fetchSections: (slug) => fetch(`/api/pages/${slug}/sections`).then(r => r.json()),
    saveSections: (slug, sections) => fetch(`/api/pages/${slug}/sections`, {
      method: 'PUT',
      body: JSON.stringify(sections),
    }),
  },
  sectionTypes: {
    hero: {
      component: HeroSection,
      label: 'Hero',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { name: 'bgColor', label: 'Background', type: 'color' },
      ],
    },
  },
};

function App() {
  return <VisualEditor config={config} />;
}
```

## Features

- **Section management**: Move up/down, delete, edit via toolbar
- **Side panel editing**: Click the wrench icon to open a data entry panel
- **10 field types**: text, textarea, number, select, checkbox, image, richtext, color, date, repeater
- **Adapter pattern**: Bring your own fetch/save logic
- **Framework-agnostic**: Works with Next.js, Vite, CRA, or any React setup
- **CSS Modules**: Zero-conflict styling, no external dependencies

## Field Types

| Type | Description |
|------|-------------|
| `text` | Single-line text input |
| `textarea` | Multi-line text input |
| `number` | Numeric input |
| `select` | Dropdown with options |
| `checkbox` | Boolean toggle |
| `image` | URL input with preview |
| `richtext` | ContentEditable with bold/italic/underline |
| `color` | Color picker |
| `date` | Date picker |
| `repeater` | Array of nested field groups |

## API

### `VisualEditorConfig`

| Property | Type | Description |
|----------|------|-------------|
| `slug` | `string` | Page identifier |
| `adapter` | `VisualEditorAdapter` | Fetch and save functions |
| `sectionTypes` | `SectionTypeMap` | Map of section type definitions |
| `renderSection?` | `(section, index) => ReactNode` | Optional custom renderer |

### `VisualEditorAdapter`

| Method | Signature |
|--------|-----------|
| `fetchSections` | `(slug: string) => Promise<Section[]>` |
| `saveSections` | `(slug: string, sections: Section[]) => Promise<void>` |

### Hooks

- `useVisualEditor()` — Access context (state, dispatch, config, save)
- `useSectionActions()` — Actions: moveUp, moveDown, remove, updateData, openPanel, closePanel

## Development

```bash
npm install
npm run dev          # Watch mode build
npm test             # Run tests
npm run storybook    # Open Storybook

# Demo app
cd demo && npm install && npm run dev
```

## License

MIT
