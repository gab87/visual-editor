import React from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Textarea field component for multi-line text input.
 * @param props - Field props
 * @returns TextareaField component
 */
export function TextareaField({ config, value, onChange }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>
      <textarea
        className={styles.textarea}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder}
        required={config.required}
        rows={4}
      />
    </div>
  );
}
