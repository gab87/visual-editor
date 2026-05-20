import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../src/Components/Fields/TextField';
import { TextareaField } from '../src/Components/Fields/TextareaField';
import { NumberField } from '../src/Components/Fields/NumberField';
import { SelectField } from '../src/Components/Fields/SelectField';
import { CheckboxField } from '../src/Components/Fields/CheckboxField';
import { ImageField } from '../src/Components/Fields/ImageField';
import { ColorField } from '../src/Components/Fields/ColorField';
import { DateField } from '../src/Components/Fields/DateField';
import { RichTextField } from '../src/Components/Fields/RichTextField';
import { RepeaterField } from '../src/Components/Fields/RepeaterField';
import type { FieldConfig } from '../src/Types';

/**
 * Stateful wrapper to make fields interactive in stories.
 * @param props - Initial value and field config
 * @returns Interactive field
 */
function FieldWrapper({
  FieldComponent,
  config,
  initialValue,
}: {
  FieldComponent: React.ComponentType<{ config: FieldConfig; value: unknown; onChange: (v: unknown) => void }>;
  config: FieldConfig;
  initialValue: unknown;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ maxWidth: 360, padding: 20 }}>
      <FieldComponent config={config} value={value} onChange={setValue} />
      <pre style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>
        Value: {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

const meta: Meta = {
  title: 'Fields',
  parameters: { layout: 'padded' },
};

export default meta;

export const Text: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={TextField}
      config={{ name: 'title', label: 'Title', type: 'text', placeholder: 'Enter title...' }}
      initialValue="Hello World"
    />
  ),
};

export const Textarea: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={TextareaField}
      config={{ name: 'desc', label: 'Description', type: 'textarea', placeholder: 'Enter description...' }}
      initialValue="Some long text here..."
    />
  ),
};

export const Number: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={NumberField}
      config={{ name: 'count', label: 'Count', type: 'number' }}
      initialValue={42}
    />
  ),
};

export const Select: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={SelectField}
      config={{
        name: 'layout',
        label: 'Layout',
        type: 'select',
        options: [
          { label: 'Centered', value: 'center' },
          { label: 'Left aligned', value: 'left' },
          { label: 'Right aligned', value: 'right' },
        ],
      }}
      initialValue="center"
    />
  ),
};

export const Checkbox: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={CheckboxField}
      config={{ name: 'visible', label: 'Visible', type: 'checkbox' }}
      initialValue={true}
    />
  ),
};

export const Image: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={ImageField}
      config={{ name: 'hero', label: 'Hero Image', type: 'image', placeholder: 'https://example.com/image.jpg' }}
      initialValue="https://picsum.photos/400/200"
    />
  ),
};

export const Color: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={ColorField}
      config={{ name: 'bg', label: 'Background Color', type: 'color' }}
      initialValue="#3b82f6"
    />
  ),
};

export const Date: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={DateField}
      config={{ name: 'publishDate', label: 'Publish Date', type: 'date' }}
      initialValue="2024-06-15"
    />
  ),
};

export const RichText: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={RichTextField}
      config={{ name: 'content', label: 'Content', type: 'richtext' }}
      initialValue="<p>Hello <strong>World</strong></p>"
    />
  ),
};

export const Repeater: StoryObj = {
  render: () => (
    <FieldWrapper
      FieldComponent={RepeaterField}
      config={{
        name: 'items',
        label: 'Feature List',
        type: 'repeater',
        fields: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ],
      }}
      initialValue={[
        { title: 'Feature 1', description: 'First feature' },
        { title: 'Feature 2', description: 'Second feature' },
      ]}
    />
  ),
};
