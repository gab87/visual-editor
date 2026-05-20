import React, { useCallback, useMemo } from 'react';
import { useVisualEditor } from '../../Hooks/useVisualEditor';
import { useSectionActions } from '../../Hooks/useSectionActions';
import { FieldRenderer } from '../Fields/FieldRenderer';
import styles from './SidePanel.module.css';

/**
 * Side panel component for editing section data.
 * Slides in from the right when a section's edit button is clicked.
 * @returns SidePanel component
 */
export function SidePanel() {
  const { state, config } = useVisualEditor();
  const { updateData, closePanel } = useSectionActions();

  const selectedSection = useMemo(
    () => state.sections.find((s) => s.id === state.selectedSectionId) ?? null,
    [state.sections, state.selectedSectionId]
  );

  const sectionDef = selectedSection ? config.sectionTypes[selectedSection.type] : null;

  const handleFieldChange = useCallback(
    (fieldName: string, value: unknown) => {
      if (!selectedSection) {
        return;
      }
      updateData(selectedSection.id, { [fieldName]: value });
    },
    [selectedSection, updateData]
  );

  const overlayClass = [styles.overlay, state.isPanelOpen ? styles.overlayOpen : '']
    .filter(Boolean)
    .join(' ');

  const label = sectionDef?.label ?? selectedSection?.type ?? '';

  return (
    <div className={overlayClass} role="dialog" aria-label="Edit section">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{label}</h2>
        <button
          className={styles.closeButton}
          onClick={closePanel}
          type="button"
          aria-label="Close panel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.panelBody}>
        {sectionDef && selectedSection && (
          <FieldRenderer
            fields={sectionDef.fields}
            values={selectedSection.data}
            onChange={handleFieldChange}
          />
        )}
      </div>
    </div>
  );
}
