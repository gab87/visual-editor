import React from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Date picker field component.
 * @param props - Field props
 * @returns DateField component
 */
export function DateField({ config, value, onChange }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={styles.input}
        type="date"
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        required={config.required}
      />
    </div>
  );
}
