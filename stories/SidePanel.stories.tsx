import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SidePanel } from '../src/Components/SidePanel/SidePanel';
import { MockProvider } from './helpers';

const meta: Meta<typeof SidePanel> = {
  title: 'Components/SidePanel',
  component: SidePanel,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof SidePanel>;

export const Closed: Story = {
  decorators: [
    (Story) => (
      <MockProvider stateOverrides={{ isPanelOpen: false }}>
        <div style={{ minHeight: 400, position: 'relative' }}>
          <Story />
        </div>
      </MockProvider>
    ),
  ],
};

export const Open: Story = {
  decorators: [
    (Story) => (
      <MockProvider stateOverrides={{ isPanelOpen: true, selectedSectionId: 's1' }}>
        <div style={{ minHeight: 400, position: 'relative' }}>
          <Story />
        </div>
      </MockProvider>
    ),
  ],
};
