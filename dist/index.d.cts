import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ComponentType, ReactNode } from 'react';

/** Supported field types for section data entry */
type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'image' | 'richtext' | 'color' | 'date' | 'repeater';
/** Configuration for a single form field */
interface FieldConfig {
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
interface SelectOption {
    label: string;
    value: string;
}
/** A page section with its data */
interface Section {
    id: string;
    type: string;
    order: number;
    data: Record<string, unknown>;
}
/** Definition of a section type with its component and field schema */
interface SectionTypeDefinition {
    component: ComponentType<SectionComponentProps>;
    fields: FieldConfig[];
    label?: string;
}
/** Props passed to section components */
interface SectionComponentProps {
    data: Record<string, unknown>;
}
/** Map of section type names to their definitions */
type SectionTypeMap = Record<string, SectionTypeDefinition>;
/** Adapter for fetching and saving sections */
interface VisualEditorAdapter {
    fetchSections: (slug: string) => Promise<Section[]>;
    saveSections: (slug: string, sections: Section[]) => Promise<void>;
}
/** Main configuration passed to the VisualEditor component */
interface VisualEditorConfig {
    slug: string;
    adapter: VisualEditorAdapter;
    sectionTypes: SectionTypeMap;
    renderSection?: (section: Section, index: number) => ReactNode;
}
/** Maximum number of undo steps stored in history */
declare const MAX_HISTORY_SIZE = 50;
/** State managed by the visual editor context */
interface VisualEditorState {
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
type VisualEditorAction = {
    type: 'SET_SECTIONS';
    payload: Section[];
} | {
    type: 'MOVE_UP';
    payload: string;
} | {
    type: 'MOVE_DOWN';
    payload: string;
} | {
    type: 'REMOVE_SECTION';
    payload: string;
} | {
    type: 'UPDATE_SECTION_DATA';
    payload: {
        id: string;
        data: Record<string, unknown>;
    };
} | {
    type: 'SELECT_SECTION';
    payload: string | null;
} | {
    type: 'TOGGLE_PANEL';
    payload: boolean;
} | {
    type: 'SET_LOADING';
    payload: boolean;
} | {
    type: 'SET_ERROR';
    payload: string | null;
} | {
    type: 'MARK_CLEAN';
} | {
    type: 'UNDO';
} | {
    type: 'REDO';
};
/** Props for individual field components */
interface FieldProps {
    config: FieldConfig;
    value: unknown;
    onChange: (value: unknown) => void;
}

interface VisualEditorProps {
    config: VisualEditorConfig;
}
/**
 * Root visual editor component.
 * Wraps everything in the VisualEditorProvider and renders the canvas.
 * @param props - VisualEditor props with config
 * @returns VisualEditor component
 */
declare function VisualEditor({ config }: VisualEditorProps): react_jsx_runtime.JSX.Element;

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
declare function Node({ section, index, totalSections }: NodeProps): react_jsx_runtime.JSX.Element | null;

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
declare function NodeHeader({ sectionId, sectionType, isFirst, isLast }: NodeHeaderProps): react_jsx_runtime.JSX.Element;

/**
 * Side panel component for editing section data.
 * Slides in from the right when a section's edit button is clicked.
 * @returns SidePanel component
 */
declare function SidePanel(): react_jsx_runtime.JSX.Element;

/**
 * Fixed full-width header for the visual editor.
 * Contains undo, redo and save actions.
 * @returns EditorHeader component
 */
declare function EditorHeader(): react_jsx_runtime.JSX.Element;

interface FieldRendererProps {
    fields: FieldConfig[];
    values: Record<string, unknown>;
    onChange: (fieldName: string, value: unknown) => void;
}
/**
 * Renders a list of form fields based on their configuration.
 * Dispatches each field to the appropriate component by type.
 * @param props - FieldRenderer props
 * @returns FieldRenderer component
 */
declare function FieldRenderer({ fields, values, onChange }: FieldRendererProps): react_jsx_runtime.JSX.Element;

/**
 * Text input field component.
 * @param props - Field props
 * @returns TextField component
 */
declare function TextField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Textarea field component for multi-line text input.
 * @param props - Field props
 * @returns TextareaField component
 */
declare function TextareaField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Number input field component.
 * @param props - Field props
 * @returns NumberField component
 */
declare function NumberField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Select dropdown field component.
 * @param props - Field props
 * @returns SelectField component
 */
declare function SelectField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Checkbox field component.
 * @param props - Field props
 * @returns CheckboxField component
 */
declare function CheckboxField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Image URL field component with preview.
 * @param props - Field props
 * @returns ImageField component
 */
declare function ImageField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Rich text editor field component using contentEditable.
 * Provides basic formatting: bold, italic, underline.
 * @param props - Field props
 * @returns RichTextField component
 */
declare function RichTextField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Color picker field component.
 * @param props - Field props
 * @returns ColorField component
 */
declare function ColorField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Date picker field component.
 * @param props - Field props
 * @returns DateField component
 */
declare function DateField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

/**
 * Repeater field component for arrays of nested objects.
 * @param props - Field props
 * @returns RepeaterField component
 */
declare function RepeaterField({ config, value, onChange }: FieldProps): react_jsx_runtime.JSX.Element;

interface VisualEditorContextValue {
    state: VisualEditorState;
    dispatch: React.Dispatch<VisualEditorAction>;
    config: VisualEditorConfig;
    save: () => Promise<void>;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}
declare const VisualEditorContext: React.Context<VisualEditorContextValue | null>;
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
declare function VisualEditorProvider({ config, children }: VisualEditorProviderProps): react_jsx_runtime.JSX.Element;

/**
 * Hook to access the visual editor context.
 * Must be used within a VisualEditorProvider.
 * @returns The visual editor context value
 */
declare function useVisualEditor(): VisualEditorContextValue;

/**
 * Hook providing section manipulation actions.
 * Wraps dispatch calls for move, remove, update, and select operations.
 * @returns Object with action functions for section management
 */
declare function useSectionActions(): {
    moveUp: (sectionId: string) => void;
    moveDown: (sectionId: string) => void;
    remove: (sectionId: string) => void;
    updateData: (id: string, data: Record<string, unknown>) => void;
    select: (sectionId: string | null) => void;
    openPanel: (sectionId: string) => void;
    closePanel: () => void;
};

/**
 * Moves a section one position up in the list.
 * Returns a new array with updated order values.
 * @param sections - Current sections array
 * @param sectionId - ID of the section to move up
 * @returns New sections array with updated order
 */
declare function moveUp(sections: Section[], sectionId: string): Section[];
/**
 * Moves a section one position down in the list.
 * Returns a new array with updated order values.
 * @param sections - Current sections array
 * @param sectionId - ID of the section to move down
 * @returns New sections array with updated order
 */
declare function moveDown(sections: Section[], sectionId: string): Section[];
/**
 * Removes a section from the list and re-indexes order values.
 * @param sections - Current sections array
 * @param sectionId - ID of the section to remove
 * @returns New sections array without the removed section
 */
declare function removeSection(sections: Section[], sectionId: string): Section[];
/**
 * Updates the data of a specific section.
 * @param sections - Current sections array
 * @param sectionId - ID of the section to update
 * @param data - New data to merge into the section
 * @returns New sections array with the updated section
 */
declare function updateSectionData(sections: Section[], sectionId: string, data: Record<string, unknown>): Section[];

export { CheckboxField, ColorField, DateField, EditorHeader, type FieldConfig, type FieldProps, FieldRenderer, type FieldType, ImageField, MAX_HISTORY_SIZE, Node, NodeHeader, NumberField, RepeaterField, RichTextField, type Section, type SectionComponentProps, type SectionTypeDefinition, type SectionTypeMap, SelectField, type SelectOption, SidePanel, TextField, TextareaField, VisualEditor, type VisualEditorAction, type VisualEditorAdapter, type VisualEditorConfig, VisualEditorContext, type VisualEditorContextValue, VisualEditorProvider, type VisualEditorState, moveDown, moveUp, removeSection, updateSectionData, useSectionActions, useVisualEditor };
