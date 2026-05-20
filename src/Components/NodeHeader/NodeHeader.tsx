import React from 'react';
import { useSectionActions } from '../../Hooks/useSectionActions';
import styles from './NodeHeader.module.css';

interface NodeHeaderProps {
  sectionId: string;
  sectionType: string;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Header toolbar for a section node.
 * Provides move up, move down, delete, and edit actions.
 * @param props - NodeHeader props
 * @returns NodeHeader component
 */
export function NodeHeader({ sectionId, sectionType, isFirst, isLast }: NodeHeaderProps) {
  const { moveUp, moveDown, remove, openPanel } = useSectionActions();

  return (
    <div className={styles.header}>
      <span className={styles.sectionLabel}>{sectionType}</span>

      <button
        className={styles.actionButton}
        onClick={() => moveUp(sectionId)}
        disabled={isFirst}
        title="Move up"
        aria-label="Move section up"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      <button
        className={styles.actionButton}
        onClick={() => moveDown(sectionId)}
        disabled={isLast}
        title="Move down"
        aria-label="Move section down"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <button
        className={`${styles.actionButton} ${styles.deleteButton}`}
        onClick={() => remove(sectionId)}
        title="Delete section"
        aria-label="Delete section"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      <button
        className={styles.actionButton}
        onClick={() => openPanel(sectionId)}
        title="Edit section"
        aria-label="Edit section"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </button>
    </div>
  );
}
