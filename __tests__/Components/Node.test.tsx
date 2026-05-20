import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Node } from '../../src/Components/Node/Node';
import { VisualEditorContext } from '../../src/Context/VisualEditorContext';
import type { VisualEditorConfig, VisualEditorState, Section } from '../../src/Types';

/**
 * Mock section component for testing.
 * @param props - Props with data
 * @returns Simple div with title
 */
function MockSection({ data }: { data: Record<string, unknown> }) {
  return <div data-testid="mock-section">{data.title as string}</div>;
}

const MOCK_SECTION: Section = {
  id: 's1',
  type: 'hero',
  order: 0,
  data: { title: 'Test Hero' },
};

const MOCK_STATE: VisualEditorState = {
  sections: [MOCK_SECTION],
  past: [],
  future: [],
  selectedSectionId: null,
  isPanelOpen: false,
  isDirty: false,
  isLoading: false,
  error: null,
};

const MOCK_CONFIG: VisualEditorConfig = {
  slug: 'test',
  adapter: { fetchSections: vi.fn(), saveSections: vi.fn() },
  sectionTypes: {
    hero: {
      component: MockSection,
      fields: [],
      label: 'Hero Section',
    },
  },
};

/**
 * Renders a component within the VisualEditorContext.
 * @param ui - React element to render
 * @returns Render result
 */
function renderWithContext(ui: React.ReactElement) {
  return render(
    <VisualEditorContext.Provider
      value={{ state: MOCK_STATE, dispatch: vi.fn(), config: MOCK_CONFIG, save: vi.fn(), undo: vi.fn(), redo: vi.fn(), canUndo: false, canRedo: false }}
    >
      {ui}
    </VisualEditorContext.Provider>
  );
}

describe('Node', () => {
  it('should render the section content', () => {
    renderWithContext(<Node section={MOCK_SECTION} index={0} totalSections={3} />);

    expect(screen.getByTestId('mock-section')).toBeInTheDocument();
    expect(screen.getByText('Test Hero')).toBeInTheDocument();
  });

  it('should render the NodeHeader with section type label', () => {
    renderWithContext(<Node section={MOCK_SECTION} index={0} totalSections={3} />);

    expect(screen.getByText('Hero Section')).toBeInTheDocument();
  });

  it('should return null for unknown section types', () => {
    const unknownSection: Section = { ...MOCK_SECTION, type: 'unknown' };
    const { container } = renderWithContext(
      <Node section={unknownSection} index={0} totalSections={1} />
    );

    expect(container.innerHTML).toBe('');
  });
});
