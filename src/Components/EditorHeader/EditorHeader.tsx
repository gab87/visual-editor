import React from 'react';
import { useVisualEditor } from '../../Hooks/useVisualEditor';
import styles from './EditorHeader.module.css';

/**
 * Fixed full-width header for the visual editor.
 * Contains undo, redo and save actions.
 * @returns EditorHeader component
 */
export function EditorHeader() {
  const { state, save, undo, redo, canUndo, canRedo } = useVisualEditor();

  return (
    <header className={styles.header}>
      <div className={styles.actions}>
        <button
          className={styles.iconButton}
          onClick={undo}
          disabled={!canUndo}
          type="button"
          aria-label="Undo"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className={styles.iconButton}
          onClick={redo}
          disabled={!canRedo}
          type="button"
          aria-label="Redo"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      <button
        className={styles.saveButton}
        onClick={save}
        disabled={!state.isDirty}
        type="button"
      >
        {state.isDirty && <span className={styles.dirtyIndicator} />}
        Save
      </button>
    </header>
  );
}
