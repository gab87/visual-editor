import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidePanel } from '../../src/Components/SidePanel/SidePanel';
import { VisualEditorContext } from '../../src/Context/VisualEditorContext';
import type { VisualEditorConfig, VisualEditorState, Section } from '../../src/Types';

const MOCK_SECTION: Section = {
  id: 's1',
  type: 'hero',
  order: 0,
  data: { title: 'Hello', color: '#ff0000' },
};

/**
 * Creates context value for testing the SidePanel.
 * @param overrides - State overrides
 * @param dispatch - Optional mock dispatch
 * @returns Context value and dispatch mock
 */
function createContextValue(overrides: Partial<VisualEditorState> = {}, dispatch = vi.fn()) {
  const state: VisualEditorState = {
    sections: [MOCK_SECTION],
    past: [],
    future: [],
    selectedSectionId: null,
    isPanelOpen: false,
    isDirty: false,
    isLoading: false,
    error: null,
    ...overrides,
  };

  const config: VisualEditorConfig = {
    slug: 'test',
    adapter: { fetchSections: vi.fn(), saveSections: vi.fn() },
    sectionTypes: {
      hero: {
        component: () => <div>Hero</div>,
        label: 'Hero Section',
        fields: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'color', label: 'Color', type: 'color' },
        ],
      },
    },
  };

  return { state, dispatch, config, save: vi.fn(), undo: vi.fn(), redo: vi.fn(), canUndo: false, canRedo: false };
}

describe('SidePanel', () => {
  it('should not show fields when no section is selected', () => {
    const value = createContextValue();
    render(
      <VisualEditorContext.Provider value={value}>
        <SidePanel />
      </VisualEditorContext.Provider>
    );

    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });

  it('should render fields when a section is selected and panel is open', () => {
    const value = createContextValue({
      selectedSectionId: 's1',
      isPanelOpen: true,
    });

    render(
      <VisualEditorContext.Provider value={value}>
        <SidePanel />
      </VisualEditorContext.Provider>
    );

    expect(screen.getByText('Hero Section')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('should dispatch close actions when close button is clicked', async () => {
    const dispatch = vi.fn();
    const value = createContextValue(
      { selectedSectionId: 's1', isPanelOpen: true },
      dispatch
    );

    render(
      <VisualEditorContext.Provider value={value}>
        <SidePanel />
      </VisualEditorContext.Provider>
    );

    await userEvent.click(screen.getByLabelText('Close panel'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_PANEL', payload: false });
    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_SECTION', payload: null });
  });
});
