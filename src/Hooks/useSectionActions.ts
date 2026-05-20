import { useCallback } from 'react';
import { useVisualEditor } from './useVisualEditor';

/**
 * Hook providing section manipulation actions.
 * Wraps dispatch calls for move, remove, update, and select operations.
 * @returns Object with action functions for section management
 */
export function useSectionActions() {
  const { dispatch } = useVisualEditor();

  const moveUp = useCallback(
    (sectionId: string) => dispatch({ type: 'MOVE_UP', payload: sectionId }),
    [dispatch]
  );

  const moveDown = useCallback(
    (sectionId: string) => dispatch({ type: 'MOVE_DOWN', payload: sectionId }),
    [dispatch]
  );

  const remove = useCallback(
    (sectionId: string) => dispatch({ type: 'REMOVE_SECTION', payload: sectionId }),
    [dispatch]
  );

  const updateData = useCallback(
    (id: string, data: Record<string, unknown>) =>
      dispatch({ type: 'UPDATE_SECTION_DATA', payload: { id, data } }),
    [dispatch]
  );

  const select = useCallback(
    (sectionId: string | null) => dispatch({ type: 'SELECT_SECTION', payload: sectionId }),
    [dispatch]
  );

  const openPanel = useCallback(
    (sectionId: string) => {
      dispatch({ type: 'SELECT_SECTION', payload: sectionId });
      dispatch({ type: 'TOGGLE_PANEL', payload: true });
    },
    [dispatch]
  );

  const closePanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_PANEL', payload: false });
    dispatch({ type: 'SELECT_SECTION', payload: null });
  }, [dispatch]);

  return { moveUp, moveDown, remove, updateData, select, openPanel, closePanel };
}
