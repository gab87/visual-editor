import { useContext } from 'react';
import { VisualEditorContext } from '../Context/VisualEditorContext';

/**
 * Hook to access the visual editor context.
 * Must be used within a VisualEditorProvider.
 * @returns The visual editor context value
 */
export function useVisualEditor() {
  const context = useContext(VisualEditorContext);

  if (!context) {
    throw new Error('useVisualEditor must be used within a VisualEditorProvider');
  }

  return context;
}
