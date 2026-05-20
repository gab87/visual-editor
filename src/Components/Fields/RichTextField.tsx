import React, { useRef, useCallback } from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Executes a document command for rich text editing.
 * @param command - The command to execute
 * @param value - Optional value for the command
 */
function execCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

/**
 * Rich text editor field component using contentEditable.
 * Provides basic formatting: bold, italic, underline.
 * @param props - Field props
 * @returns RichTextField component
 */
export function RichTextField({ config, value, onChange }: FieldProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback(() => {
    if (!editorRef.current) {
      return;
    }
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.richTextWrapper}>
        <div className={styles.richTextToolbar}>
          <button
            className={styles.richTextButton}
            onClick={() => execCommand('bold')}
            type="button"
            title="Bold"
          >
            B
          </button>
          <button
            className={styles.richTextButton}
            onClick={() => execCommand('italic')}
            type="button"
            title="Italic"
            style={{ fontStyle: 'italic' }}
          >
            I
          </button>
          <button
            className={styles.richTextButton}
            onClick={() => execCommand('underline')}
            type="button"
            title="Underline"
            style={{ textDecoration: 'underline' }}
          >
            U
          </button>
        </div>
        <div
          ref={editorRef}
          className={styles.richTextContent}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: (value as string) ?? '' }}
        />
      </div>
    </div>
  );
}
