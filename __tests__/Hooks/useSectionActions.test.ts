import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useSectionActions } from '../../src/Hooks/useSectionActions';
import { VisualEditorContext } from '../../src/Context/VisualEditorContext';
import type { VisualEditorState, VisualEditorConfig } from '../../src/Types';

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
 * Creates a wrapper component for testing hooks within context.
 * @param dispatch - Mock dispatch function
 * @returns Wrapper component
 */
function createWrapper(dispatch = vi.fn()) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      VisualEditorContext.Provider,
      { value: { state: MOCK_STATE, dispatch, config: MOCK_CONFIG, save: vi.fn(), undo: vi.fn(), redo: vi.fn(), canUndo: false, canRedo: false } },
      children
    );
  };
}

describe('useSectionActions', () => {
  it('should dispatch MOVE_UP', () => {
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSectionActions(), { wrapper: createWrapper(dispatch) });

    act(() => result.current.moveUp('s1'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'MOVE_UP', payload: 's1' });
  });

  it('should dispatch MOVE_DOWN', () => {
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSectionActions(), { wrapper: createWrapper(dispatch) });

    act(() => result.current.moveDown('s1'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'MOVE_DOWN', payload: 's1' });
  });

  it('should dispatch REMOVE_SECTION', () => {
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSectionActions(), { wrapper: createWrapper(dispatch) });

    act(() => result.current.remove('s1'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'REMOVE_SECTION', payload: 's1' });
  });

  it('should dispatch UPDATE_SECTION_DATA', () => {
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSectionActions(), { wrapper: createWrapper(dispatch) });

    act(() => result.current.updateData('s1', { title: 'New' }));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SECTION_DATA',
      payload: { id: 's1', data: { title: 'New' } },
    });
  });

  it('should dispatch SELECT_SECTION and TOGGLE_PANEL on openPanel', () => {
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSectionActions(), { wrapper: createWrapper(dispatch) });

    act(() => result.current.openPanel('s1'));

    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_SECTION', payload: 's1' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_PANEL', payload: true });
  });

  it('should dispatch TOGGLE_PANEL false and SELECT_SECTION null on closePanel', () => {
    const dispatch = vi.fn();
    const { result } = renderHook(() => useSectionActions(), { wrapper: createWrapper(dispatch) });

    act(() => result.current.closePanel());

    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_PANEL', payload: false });
    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_SECTION', payload: null });
  });
});
