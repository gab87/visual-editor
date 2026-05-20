import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Node } from '../src/Components/Node/Node';
import { MockProvider, MOCK_SECTIONS } from './helpers';

const meta: Meta<typeof Node> = {
  title: 'Components/Node',
  component: Node,
  decorators: [(Story) => <MockProvider><Story /></MockProvider>],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Node>;

export const Default: Story = {
  args: {
    section: MOCK_SECTIONS[0],
    index: 0,
    totalSections: 3,
  },
};

export const MiddleSection: Story = {
  args: {
    section: MOCK_SECTIONS[1],
    index: 1,
    totalSections: 3,
  },
};

export const LastSection: Story = {
  args: {
    section: MOCK_SECTIONS[2],
    index: 2,
    totalSections: 3,
  },
};

export const Selected: Story = {
  args: {
    section: MOCK_SECTIONS[0],
    index: 0,
    totalSections: 3,
  },
  decorators: [
    (Story) => (
      <MockProvider stateOverrides={{ selectedSectionId: 's1' }}>
        <Story />
      </MockProvider>
    ),
  ],
};
