import React, { useCallback } from 'react';
import type { FieldProps, FieldConfig } from '../../Types';
import { FieldRenderer } from './FieldRenderer';
import styles from './Fields.module.css';

/**
 * Builds default values for a new repeater item based on field configs.
 * @param fields - Field configurations
 * @returns Default values object
 */
function buildDefaults(fields: FieldConfig[]): Record<string, unknown> {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.name] = field.defaultValue ?? '';
    return acc;
  }, {});
}

/**
 * Repeater field component for arrays of nested objects.
 * @param props - Field props
 * @returns RepeaterField component
 */
export function RepeaterField({ config, value, onChange }: FieldProps) {
  const items = (value as Record<string, unknown>[]) ?? [];
  const subFields = config.fields ?? [];

  const handleAdd = useCallback(() => {
    onChange([...items, buildDefaults(subFields)]);
  }, [items, subFields, onChange]);

  const handleRemove = useCallback(
    (index: number) => {
      onChange(items.filter((_, i) => i !== index));
    },
    [items, onChange]
  );

  const handleItemChange = useCallback(
    (index: number, fieldName: string, fieldValue: unknown) => {
      const updated = items.map((item, i) => {
        if (i !== index) {
          return item;
        }
        return { ...item, [fieldName]: fieldValue };
      });
      onChange(updated);
    },
    [items, onChange]
  );

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {config.label}
        {config.required && <span className={styles.required}>*</span>}
      </label>

      {items.map((item, index) => (
        <div key={index} className={styles.repeaterItem}>
          <div className={styles.repeaterHeader}>
            <span className={styles.repeaterIndex}>Item {index + 1}</span>
            <button
              className={styles.repeaterRemove}
              onClick={() => handleRemove(index)}
              type="button"
              aria-label={`Remove item ${index + 1}`}
            >
              &times;
            </button>
          </div>
          <FieldRenderer
            fields={subFields}
            values={item}
            onChange={(fieldName, fieldValue) => handleItemChange(index, fieldName, fieldValue)}
          />
        </div>
      ))}

      <button className={styles.addButton} onClick={handleAdd} type="button">
        + Add item
      </button>
    </div>
  );
}
