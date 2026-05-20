import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EditorHeader } from '../src/Components/EditorHeader/EditorHeader';
import { MockProvider, MOCK_SECTIONS } from './helpers';
import type { Section } from '../src/Types';

const meta: Meta<typeof EditorHeader> = {
  title: 'Components/EditorHeader',
  component: EditorHeader,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof EditorHeader>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <MockProvider>
        <Story />
      </MockProvider>
    ),
  ],
};

export const WithDirtyState: Story = {
  decorators: [
    (Story) => (
      <MockProvider stateOverrides={{ isDirty: true }}>
        <Story />
      </MockProvider>
    ),
  ],
};

export const WithUndoHistory: Story = {
  decorators: [
    (Story) => (
      <MockProvider stateOverrides={{ isDirty: true, past: [MOCK_SECTIONS] }}>
        <Story />
      </MockProvider>
    ),
  ],
};

const REDO_SECTIONS: Section[] = [
  { id: 'r1', type: 'hero', order: 0, data: { title: 'Redo state' } },
];

export const WithRedoHistory: Story = {
  decorators: [
    (Story) => (
      <MockProvider stateOverrides={{ isDirty: true, past: [MOCK_SECTIONS], future: [REDO_SECTIONS] }}>
        <Story />
      </MockProvider>
    ),
  ],
};
