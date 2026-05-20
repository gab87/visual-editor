import React from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Number input field component.
 * @param props - Field props
 * @returns NumberField component
 */
export function NumberField({ config, value, onChange }: FieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={styles.input}
        type="number"
        value={(value as number) ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        placeholder={config.placeholder}
        required={config.required}
      />
    </div>
  );
}
