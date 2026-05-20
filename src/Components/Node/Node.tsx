import React from 'react';
import type { Section } from '../../Types';
import { useVisualEditor } from '../../Hooks/useVisualEditor';
import { NodeHeader } from '../NodeHeader/NodeHeader';
import styles from './Node.module.css';

interface NodeProps {
  section: Section;
  index: number;
  totalSections: number;
}

/**
 * Wrapper component for a page section.
 * Renders the NodeHeader toolbar and the section content.
 * @param props - Node props
 * @returns Node component
 */
export function Node({ section, index, totalSections }: NodeProps) {
  const { state, config } = useVisualEditor();
  const isSelected = state.selectedSectionId === section.id;
  const sectionDef = config.sectionTypes[section.type];

  if (!sectionDef) {
    return null;
  }

  const SectionComponent = sectionDef.component;
  const label = sectionDef.label ?? section.type;

  const className = [styles.node, isSelected ? styles.nodeSelected : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} data-section-id={section.id}>
      <NodeHeader
        sectionId={section.id}
        sectionType={label}
        isFirst={index === 0}
        isLast={index === totalSections - 1}
      />
      <div className={styles.content}>
        {config.renderSection
          ? config.renderSection(section, index)
          : <SectionComponent data={section.data} />}
      </div>
    </div>
  );
}
