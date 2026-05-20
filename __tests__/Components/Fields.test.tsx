import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '../../src/Components/Fields/TextField';
import { TextareaField } from '../../src/Components/Fields/TextareaField';
import { NumberField } from '../../src/Components/Fields/NumberField';
import { SelectField } from '../../src/Components/Fields/SelectField';
import { CheckboxField } from '../../src/Components/Fields/CheckboxField';
import { DateField } from '../../src/Components/Fields/DateField';
import { ColorField } from '../../src/Components/Fields/ColorField';
import type { FieldConfig } from '../../src/Types';

describe('TextField', () => {
  it('should render with label and value', () => {
    const config: FieldConfig = { name: 'title', label: 'Title', type: 'text' };
    render(<TextField config={config} value="Hello" onChange={vi.fn()} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
  });

  it('should call onChange when typing', async () => {
    const onChange = vi.fn();
    const config: FieldConfig = { name: 'title', label: 'Title', type: 'text' };
    render(<TextField config={config} value="" onChange={onChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'A');

    expect(onChange).toHaveBeenCalledWith('A');
  });

  it('should show required indicator', () => {
    const config: FieldConfig = { name: 'title', label: 'Title', type: 'text', required: true };
    render(<TextField config={config} value="" onChange={vi.fn()} />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });
});

describe('TextareaField', () => {
  it('should render a textarea element', () => {
    const config: FieldConfig = { name: 'desc', label: 'Description', type: 'textarea' };
    render(<TextareaField config={config} value="Some text" onChange={vi.fn()} />);

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Some text')).toBeInTheDocument();
  });
});

describe('NumberField', () => {
  it('should render a number input', () => {
    const config: FieldConfig = { name: 'count', label: 'Count', type: 'number' };
    render(<NumberField config={config} value={42} onChange={vi.fn()} />);

    expect(screen.getByDisplayValue('42')).toBeInTheDocument();
  });

  it('should call onChange with a number', async () => {
    const onChange = vi.fn();
    const config: FieldConfig = { name: 'count', label: 'Count', type: 'number' };
    render(<NumberField config={config} value="" onChange={onChange} />);

    await userEvent.type(screen.getByRole('spinbutton'), '5');

    expect(onChange).toHaveBeenCalledWith(5);
  });
});

describe('SelectField', () => {
  it('should render options', () => {
    const config: FieldConfig = {
      name: 'size',
      label: 'Size',
      type: 'select',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Large', value: 'lg' },
      ],
    };
    render(<SelectField config={config} value="sm" onChange={vi.fn()} />);

    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });
});

describe('CheckboxField', () => {
  it('should render a checkbox', () => {
    const config: FieldConfig = { name: 'active', label: 'Active', type: 'checkbox' };
    render(<CheckboxField config={config} value={true} onChange={vi.fn()} />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should call onChange on click', async () => {
    const onChange = vi.fn();
    const config: FieldConfig = { name: 'active', label: 'Active', type: 'checkbox' };
    render(<CheckboxField config={config} value={false} onChange={onChange} />);

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('DateField', () => {
  it('should render a date input', () => {
    const config: FieldConfig = { name: 'date', label: 'Date', type: 'date' };
    render(<DateField config={config} value="2024-01-15" onChange={vi.fn()} />);

    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
  });
});

describe('ColorField', () => {
  it('should display the color value', () => {
    const config: FieldConfig = { name: 'bg', label: 'Background', type: 'color' };
    render(<ColorField config={config} value="#ff5500" onChange={vi.fn()} />);

    expect(screen.getByText('#ff5500')).toBeInTheDocument();
  });
});
