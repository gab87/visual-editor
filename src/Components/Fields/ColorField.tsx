import React from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Color picker field component.
 * @param props - Field props
 * @returns ColorField component
 */
export function ColorField({ config, value, onChange }: FieldProps) {
  const colorValue = (value as string) ?? '#000000';

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.colorWrapper}>
        <input
          className={styles.colorInput}
          type="color"
          value={colorValue}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className={styles.colorValue}>{colorValue}</span>
      </div>
    </div>
  );
}
