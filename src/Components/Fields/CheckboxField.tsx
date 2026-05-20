import React from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Checkbox field component.
 * @param props - Field props
 * @returns CheckboxField component
 */
export function CheckboxField({ config, value, onChange }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.checkboxWrapper}>
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={styles.label} style={{ marginBottom: 0 }}>
          {config.label}
          {config.required && <span className={styles.required}>*</span>}
        </span>
      </label>
    </div>
  );
}
