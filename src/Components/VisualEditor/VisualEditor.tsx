import React, { useMemo } from 'react';
import type { VisualEditorConfig } from '../../Types';
import { VisualEditorProvider } from '../../Context/VisualEditorContext';
import { VisualEditorCanvas } from './VisualEditorCanvas';

interface VisualEditorProps {
  config: VisualEditorConfig;
}

/**
 * Root visual editor component.
 * Wraps everything in the VisualEditorProvider and renders the canvas.
 * @param props - VisualEditor props with config
 * @returns VisualEditor component
 */
export function VisualEditor({ config }: VisualEditorProps) {
  const stableConfig = useMemo(() => config, [config]);

  return (
    <VisualEditorProvider config={stableConfig}>
      <VisualEditorCanvas />
    </VisualEditorProvider>
  );
}
