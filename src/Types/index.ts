import { ComponentType, ReactNode } from 'react';

/** Supported field types for section data entry */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'image'
  | 'richtext'
  | 'color'
  | 'date'
  | 'repeater';

/** Configuration for a single form field */
export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: SelectOption[];
  fields?: FieldConfig[];
  required?: boolean;
  defaultValue?: unknown;
  placeholder?: string;
}

/** Option for select fields */
export interface SelectOption {
  label: string;
  value: string;
}

/** A page section with its data */
export interface Section {
  id: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
}

/** Definition of a section type with its component and field schema */
export interface SectionTypeDefinition {
  component: ComponentType<SectionComponentProps>;
  fields: FieldConfig[];
  label?: string;
}

/** Props passed to section components */
export interface SectionComponentProps {
  data: Record<string, unknown>;
}

/** Map of section type names to their definitions */
export type SectionTypeMap = Record<string, SectionTypeDefinition>;

/** Adapter for fetching and saving sections */
export interface VisualEditorAdapter {
  fetchSections: (slug: string) => Promise<Section[]>;
  saveSections: (slug: string, sections: Section[]) => Promise<void>;
}

/** Main configuration passed to the VisualEditor component */
export interface VisualEditorConfig {
  slug: string;
  adapter: VisualEditorAdapter;
  sectionTypes: SectionTypeMap;
  renderSection?: (section: Section, index: number) => ReactNode;
}

/** Maximum number of undo steps stored in history */
export const MAX_HISTORY_SIZE = 50;

/** State managed by the visual editor context */
export interface VisualEditorState {
  sections: Section[];
  past: Section[][];
  future: Section[][];
  selectedSectionId: string | null;
  isPanelOpen: boolean;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Actions dispatched to the visual editor reducer */
export type VisualEditorAction =
  | { type: 'SET_SECTIONS'; payload: Section[] }
  | { type: 'MOVE_UP'; payload: string }
  | { type: 'MOVE_DOWN'; payload: string }
  | { type: 'REMOVE_SECTION'; payload: string }
  | { type: 'UPDATE_SECTION_DATA'; payload: { id: string; data: Record<string, unknown> } }
  | { type: 'SELECT_SECTION'; payload: string | null }
  | { type: 'TOGGLE_PANEL'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'MARK_CLEAN' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

/** Props for individual field components */
export interface FieldProps {
  config: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}
