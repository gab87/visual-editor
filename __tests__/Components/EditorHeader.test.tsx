import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorHeader } from '../../src/Components/EditorHeader/EditorHeader';
import { VisualEditorContext } from '../../src/Context/VisualEditorContext';
import type { VisualEditorContextValue } from '../../src/Context/VisualEditorContext';
import type { VisualEditorConfig, VisualEditorState } from '../../src/Types';

const BASE_STATE: VisualEditorState = {
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
 * Creates a context value for EditorHeader tests.
 * @param overrides - Partial overrides for the context value
 * @returns Complete context value
 */
function createValue(overrides: Partial<VisualEditorContextValue> = {}): VisualEditorContextValue {
  return {
    state: BASE_STATE,
    dispatch: vi.fn(),
    config: MOCK_CONFIG,
    save: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    canUndo: false,
    canRedo: false,
    ...overrides,
  };
}

/**
 * Renders EditorHeader within the context.
 * @param value - Context value to provide
 * @returns Render result
 */
function renderHeader(value: VisualEditorContextValue) {
  return render(
    <VisualEditorContext.Provider value={value}>
      <EditorHeader />
    </VisualEditorContext.Provider>
  );
}

describe('EditorHeader', () => {
  it('should render undo, redo and save buttons', () => {
    renderHeader(createValue());

    expect(screen.getByLabelText('Undo')).toBeInTheDocument();
    expect(screen.getByLabelText('Redo')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should disable undo when canUndo is false', () => {
    renderHeader(createValue({ canUndo: false }));

    expect(screen.getByLabelText('Undo')).toBeDisabled();
  });

  it('should enable undo when canUndo is true', () => {
    renderHeader(createValue({ canUndo: true }));

    expect(screen.getByLabelText('Undo')).not.toBeDisabled();
  });

  it('should disable redo when canRedo is false', () => {
    renderHeader(createValue({ canRedo: false }));

    expect(screen.getByLabelText('Redo')).toBeDisabled();
  });

  it('should enable redo when canRedo is true', () => {
    renderHeader(createValue({ canRedo: true }));

    expect(screen.getByLabelText('Redo')).not.toBeDisabled();
  });

  it('should disable save when isDirty is false', () => {
    renderHeader(createValue());

    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('should enable save when isDirty is true', () => {
    const dirtyState = { ...BASE_STATE, isDirty: true };
    renderHeader(createValue({ state: dirtyState }));

    expect(screen.getByText('Save')).not.toBeDisabled();
  });

  it('should call undo when undo button is clicked', async () => {
    const undo = vi.fn();
    renderHeader(createValue({ undo, canUndo: true }));

    await userEvent.click(screen.getByLabelText('Undo'));

    expect(undo).toHaveBeenCalledOnce();
  });

  it('should call redo when redo button is clicked', async () => {
    const redo = vi.fn();
    renderHeader(createValue({ redo, canRedo: true }));

    await userEvent.click(screen.getByLabelText('Redo'));

    expect(redo).toHaveBeenCalledOnce();
  });

  it('should call save when save button is clicked', async () => {
    const save = vi.fn();
    const dirtyState = { ...BASE_STATE, isDirty: true };
    renderHeader(createValue({ save, state: dirtyState }));

    await userEvent.click(screen.getByText('Save'));

    expect(save).toHaveBeenCalledOnce();
  });
});
