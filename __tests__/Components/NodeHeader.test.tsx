import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NodeHeader } from '../../src/Components/NodeHeader/NodeHeader';
import { VisualEditorContext } from '../../src/Context/VisualEditorContext';
import type { VisualEditorConfig, VisualEditorState } from '../../src/Types';

const MOCK_STATE: VisualEditorState = {
  sections: [],
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
  sectionTypes: {},
};

/**
 * Renders a component within the VisualEditorContext.
 * @param ui - React element to render
 * @param dispatch - Optional mock dispatch function
 * @returns Render result
 */
function renderWithContext(ui: React.ReactElement, dispatch = vi.fn()) {
  return render(
    <VisualEditorContext.Provider
      value={{ state: MOCK_STATE, dispatch, config: MOCK_CONFIG, save: vi.fn(), undo: vi.fn(), redo: vi.fn(), canUndo: false, canRedo: false }}
    >
      {ui}
    </VisualEditorContext.Provider>
  );
}

describe('NodeHeader', () => {
  it('should render section type label', () => {
    renderWithContext(
      <NodeHeader sectionId="s1" sectionType="Hero" isFirst={false} isLast={false} />
    );

    expect(screen.getByText('Hero')).toBeInTheDocument();
  });

  it('should have four action buttons', () => {
    renderWithContext(
      <NodeHeader sectionId="s1" sectionType="Hero" isFirst={false} isLast={false} />
    );

    expect(screen.getByLabelText('Move section up')).toBeInTheDocument();
    expect(screen.getByLabelText('Move section down')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete section')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit section')).toBeInTheDocument();
  });

  it('should disable move up when isFirst is true', () => {
    renderWithContext(
      <NodeHeader sectionId="s1" sectionType="Hero" isFirst={true} isLast={false} />
    );

    expect(screen.getByLabelText('Move section up')).toBeDisabled();
    expect(screen.getByLabelText('Move section down')).not.toBeDisabled();
  });

  it('should disable move down when isLast is true', () => {
    renderWithContext(
      <NodeHeader sectionId="s1" sectionType="Hero" isFirst={false} isLast={true} />
    );

    expect(screen.getByLabelText('Move section up')).not.toBeDisabled();
    expect(screen.getByLabelText('Move section down')).toBeDisabled();
  });

  it('should dispatch MOVE_UP when move up is clicked', async () => {
    const dispatch = vi.fn();
    renderWithContext(
      <NodeHeader sectionId="s1" sectionType="Hero" isFirst={false} isLast={false} />,
      dispatch
    );

    await userEvent.click(screen.getByLabelText('Move section up'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'MOVE_UP', payload: 's1' });
  });

  it('should dispatch MOVE_DOWN when move down is clicked', async () => {
    const dispatch = vi.fn();
    renderWithContext(
      <NodeHeader sectionId="s1" sectionType="Hero" isFirst={false} isLast={false} />,
      dispatch
    );

    await userEvent.click(screen.getByLabelText('Move section down'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'MOVE_DOWN', payload: 's1' });
  });

  it('should dispatch REMOVE_SECTION when delete is clicked', async () => {
    const dispatch = vi.fn();
    renderWithContext(
      <NodeHeader sectionId="s1" sectionType="Hero" isFirst={false} isLast={false} />,
      dispatch
    );

    await userEvent.click(screen.getByLabelText('Delete section'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'REMOVE_SECTION', payload: 's1' });
  });

  it('should dispatch SELECT_SECTION and TOGGLE_PANEL when edit is clicked', async () => {
    const dispatch = vi.fn();
    renderWithContext(
      <NodeHeader sectionId="s1" sectionType="Hero" isFirst={false} isLast={false} />,
      dispatch
    );

    await userEvent.click(screen.getByLabelText('Edit section'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_SECTION', payload: 's1' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_PANEL', payload: true });
  });
});
