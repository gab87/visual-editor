import React from 'react';
import type { FieldConfig } from '../../Types';
import { TextField } from './TextField';
import { TextareaField } from './TextareaField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { CheckboxField } from './CheckboxField';
import { ImageField } from './ImageField';
import { RichTextField } from './RichTextField';
import { ColorField } from './ColorField';
import { DateField } from './DateField';
import { RepeaterField } from './RepeaterField';

const FIELD_COMPONENTS = {
  text: TextField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  checkbox: CheckboxField,
  image: ImageField,
  richtext: RichTextField,
  color: ColorField,
  date: DateField,
  repeater: RepeaterField,
} as const;

interface FieldRendererProps {
  fields: FieldConfig[];
  values: Record<string, unknown>;
  onChange: (fieldName: string, value: unknown) => void;
}

/**
 * Renders a list of form fields based on their configuration.
 * Dispatches each field to the appropriate component by type.
 * @param props - FieldRenderer props
 * @returns FieldRenderer component
 */
export function FieldRenderer({ fields, values, onChange }: FieldRendererProps) {
  return (
    <>
      {fields.map((fieldConfig) => {
        const FieldComponent = FIELD_COMPONENTS[fieldConfig.type];

        if (!FieldComponent) {
          return null;
        }

        return (
          <FieldComponent
            key={fieldConfig.name}
            config={fieldConfig}
            value={values[fieldConfig.name]}
            onChange={(val: unknown) => onChange(fieldConfig.name, val)}
          />
        );
      })}
    </>
  );
}
