import React from 'react';
import type { Section, VisualEditorConfig, VisualEditorState } from '../src/Types';
import { VisualEditorContext } from '../src/Context/VisualEditorContext';

/**
 * Mock section component for stories.
 * @param props - Props with data
 * @returns Styled mock section
 */
export function MockHeroSection({ data }: { data: Record<string, unknown> }) {
  return (
    <div style={{ padding: 40, background: '#1e293b', color: '#e2e8f0', textAlign: 'center' }}>
      <h2 style={{ margin: 0, fontSize: 28 }}>{String(data.title ?? 'Untitled')}</h2>
      {data.subtitle && (
        <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>{String(data.subtitle)}</p>
      )}
    </div>
  );
}

export const MOCK_SECTIONS: Section[] = [
  { id: 's1', type: 'hero', order: 0, data: { title: 'Welcome to Visual Editor', subtitle: 'Edit your page sections visually' } },
  { id: 's2', type: 'hero', order: 1, data: { title: 'Second Section', subtitle: 'Another section' } },
  { id: 's3', type: 'hero', order: 2, data: { title: 'Third Section', subtitle: 'Last one' } },
];

export const HERO_FIELDS = [
  { name: 'title', label: 'Title', type: 'text' as const, required: true },
  { name: 'subtitle', label: 'Subtitle', type: 'textarea' as const },
  { name: 'bgColor', label: 'Background Color', type: 'color' as const },
  { name: 'visible', label: 'Visible', type: 'checkbox' as const },
  { name: 'layout', label: 'Layout', type: 'select' as const, options: [{ label: 'Centered', value: 'center' }, { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }] },
];

export const MOCK_CONFIG: VisualEditorConfig = {
  slug: 'home',
  adapter: {
    fetchSections: () => Promise.resolve(MOCK_SECTIONS),
    saveSections: () => new Promise((resolve) => setTimeout(resolve, 500)),
  },
  sectionTypes: {
    hero: {
      component: MockHeroSection,
      fields: HERO_FIELDS,
      label: 'Hero Section',
    },
  },
};

export const MOCK_STATE: VisualEditorState = {
  sections: MOCK_SECTIONS,
  past: [],
  future: [],
  selectedSectionId: null,
  isPanelOpen: false,
  isDirty: false,
  isLoading: false,
  error: null,
};

interface MockProviderProps {
  children: React.ReactNode;
  stateOverrides?: Partial<VisualEditorState>;
}

/**
 * Mock provider for stories that need context.
 * @param props - Provider props
 * @returns Provider wrapper
 */
export function MockProvider({ children, stateOverrides = {} }: MockProviderProps) {
  const state = { ...MOCK_STATE, ...stateOverrides };
  const noop = () => {};

  return (
    <VisualEditorContext.Provider
      value={{ state, dispatch: noop as never, config: MOCK_CONFIG, save: () => Promise.resolve(), undo: noop, redo: noop, canUndo: false, canRedo: false }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
}
