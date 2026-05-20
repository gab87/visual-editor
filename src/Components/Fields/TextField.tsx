import React from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Text input field component.
 * @param props - Field props
 * @returns TextField component
 */
export function TextField({ config, value, onChange }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={styles.input}
        type="text"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder}
        required={config.required}
      />
    </div>
  );
}
