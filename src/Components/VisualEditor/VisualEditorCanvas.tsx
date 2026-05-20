import React, { useMemo } from 'react';
import { useVisualEditor } from '../../Hooks/useVisualEditor';
import { Node } from '../Node/Node';
import { SidePanel } from '../SidePanel/SidePanel';
import { EditorHeader } from '../EditorHeader/EditorHeader';
import styles from './VisualEditor.module.css';

/**
 * Internal canvas component that renders sections and the side panel.
 * Must be used within a VisualEditorProvider.
 * @returns VisualEditorCanvas component
 */
export function VisualEditorCanvas() {
  const { state } = useVisualEditor();

  const sortedSections = useMemo(
    () => [...state.sections].sort((a, b) => a.order - b.order),
    [state.sections]
  );

  if (state.isLoading) {
    return <div className={styles.loading}>Loading sections...</div>;
  }

  if (state.error) {
    return <div className={styles.error}>{state.error}</div>;
  }

  const canvasClass = [styles.canvas, state.isPanelOpen ? styles.canvasWithPanel : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      <EditorHeader />

      <div className={canvasClass}>
        {sortedSections.length === 0 ? (
          <div className={styles.empty}>No sections found</div>
        ) : (
          sortedSections.map((section, index) => (
            <Node
              key={section.id}
              section={section}
              index={index}
              totalSections={sortedSections.length}
            />
          ))
        )}
      </div>

      <SidePanel />
    </div>
  );
}
