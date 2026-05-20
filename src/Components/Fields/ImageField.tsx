import React from 'react';
import type { FieldProps } from '../../Types';
import styles from './Fields.module.css';

/**
 * Image URL field component with preview.
 * @param props - Field props
 * @returns ImageField component
 */
export function ImageField({ config, value, onChange }: FieldProps) {
  const url = (value as string) ?? '';

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>
      <input
        className={styles.input}
        type="url"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder ?? 'https://...'}
        required={config.required}
      />
      {url && (
        <img
          className={styles.imagePreview}
          src={url}
          alt={config.label}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
    </div>
  );
}
