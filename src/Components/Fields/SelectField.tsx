import React from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Select dropdown field component.
 * @param props - Field props
 * @returns SelectField component
 */
export function SelectField({ config, value, onChange }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>
      <select
        className={styles.select}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        required={config.required}
      >
        <option value="">Select...</option>
        {(config.options ?? []).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
