import React, { createContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import type {
  VisualEditorState,
  VisualEditorAction,
  VisualEditorConfig,
} from '../Types';
import { MAX_HISTORY_SIZE } from '../Types';
import { moveUp, moveDown, removeSection, updateSectionData } from '../Utils/SectionHelpers';

const INITIAL_STATE: VisualEditorState = {
  sections: [],
  past: [],
  future: [],
  selectedSectionId: null,
  isPanelOpen: false,
  isDirty: false,
  isLoading: false,
  error: null,
};

/**
 * Pushes current sections into the past stack, trimming to MAX_HISTORY_SIZE.
 * @param state - Current editor state
 * @returns Updated past and cleared future stacks
 */
function pushHistory(state: VisualEditorState) {
  const past = [...state.past, state.sections].slice(-MAX_HISTORY_SIZE);
  return { past, future: [] as VisualEditorState['future'] };
}

/**
 * Reducer for visual editor state management
 * @param state - Current state
 * @param action - Action to dispatch
 * @returns Updated state
 */
function visualEditorReducer(
  state: VisualEditorState,
  action: VisualEditorAction
): VisualEditorState {
  switch (action.type) {
    case 'SET_SECTIONS':
      return { ...state, sections: action.payload, past: [], future: [], isLoading: false, error: null };
    case 'MOVE_UP':
      return { ...state, ...pushHistory(state), sections: moveUp(state.sections, action.payload), isDirty: true };
    case 'MOVE_DOWN':
      return { ...state, ...pushHistory(state), sections: moveDown(state.sections, action.payload), isDirty: true };
    case 'REMOVE_SECTION':
      return {
        ...state,
        ...pushHistory(state),
        sections: removeSection(state.sections, action.payload),
        isDirty: true,
        selectedSectionId:
          state.selectedSectionId === action.payload ? null : state.selectedSectionId,
        isPanelOpen: state.selectedSectionId === action.payload ? false : state.isPanelOpen,
      };
    case 'UPDATE_SECTION_DATA':
      return {
        ...state,
        ...pushHistory(state),
        sections: updateSectionData(state.sections, action.payload.id, action.payload.data),
        isDirty: true,
      };
    case 'UNDO': {
      if (state.past.length === 0) {
        return state;
      }
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        ...state,
        sections: previous,
        past: newPast,
        future: [state.sections, ...state.future],
        isDirty: newPast.length > 0,
      };
    }
    case 'REDO': {
      if (state.future.length === 0) {
        return state;
      }
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        sections: next,
        past: [...state.past, state.sections],
        future: newFuture,
        isDirty: true,
      };
    }
    case 'SELECT_SECTION':
      return { ...state, selectedSectionId: action.payload };
    case 'TOGGLE_PANEL':
      return { ...state, isPanelOpen: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'MARK_CLEAN':
      return { ...state, isDirty: false, past: [], future: [] };
    default:
      return state;
  }
}

export interface VisualEditorContextValue {
  state: VisualEditorState;
  dispatch: React.Dispatch<VisualEditorAction>;
  config: VisualEditorConfig;
  save: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const VisualEditorContext = createContext<VisualEditorContextValue | null>(null);

interface VisualEditorProviderProps {
  config: VisualEditorConfig;
  children: React.ReactNode;
}

/**
 * Provider component for the visual editor context.
 * Handles fetching sections on mount and exposes save functionality.
 * @param props - Provider props with config and children
 * @returns Provider wrapper component
 */
export function VisualEditorProvider({ config, children }: VisualEditorProviderProps) {
  const [state, dispatch] = useReducer(visualEditorReducer, INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    /**
     * Fetches sections from the adapter
     */
    async function loadSections() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const sections = await config.adapter.fetchSections(config.slug);
        if (!cancelled) {
          dispatch({ type: 'SET_SECTIONS', payload: sections });
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load sections';
          dispatch({ type: 'SET_ERROR', payload: message });
        }
      }
    }

    loadSections();
    return () => {
      cancelled = true;
    };
  }, [config.slug, config.adapter]);

  const save = useCallback(async () => {
    try {
      await config.adapter.saveSections(config.slug, state.sections);
      dispatch({ type: 'MARK_CLEAN' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save sections';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  }, [config.adapter, config.slug, state.sections]);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [dispatch]);
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const value = useMemo<VisualEditorContextValue>(
    () => ({ state, dispatch, config, save, undo, redo, canUndo, canRedo }),
    [state, config, save, undo, redo, canUndo, canRedo]
  );

  return (
    <VisualEditorContext.Provider value={value}>
      {children}
    </VisualEditorContext.Provider>
  );
}
