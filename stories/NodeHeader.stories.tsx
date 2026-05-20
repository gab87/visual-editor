import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NodeHeader } from '../src/Components/NodeHeader/NodeHeader';
import { MockProvider } from './helpers';

const meta: Meta<typeof NodeHeader> = {
  title: 'Components/NodeHeader',
  component: NodeHeader,
  decorators: [(Story) => <MockProvider><Story /></MockProvider>],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof NodeHeader>;

export const Default: Story = {
  args: {
    sectionId: 's1',
    sectionType: 'Hero Section',
    isFirst: false,
    isLast: false,
  },
};

export const FirstSection: Story = {
  args: {
    sectionId: 's1',
    sectionType: 'Hero Section',
    isFirst: true,
    isLast: false,
  },
};

export const LastSection: Story = {
  args: {
    sectionId: 's1',
    sectionType: 'Hero Section',
    isFirst: false,
    isLast: true,
  },
};

export const OnlySection: Story = {
  args: {
    sectionId: 's1',
    sectionType: 'Hero Section',
    isFirst: true,
    isLast: true,
  },
};
