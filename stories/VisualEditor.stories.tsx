import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VisualEditor } from '../src/Components/VisualEditor/VisualEditor';
import { MOCK_CONFIG, MockHeroSection, HERO_FIELDS } from './helpers';
import type { Section, VisualEditorConfig } from '../src/Types';

const meta: Meta<typeof VisualEditor> = {
  title: 'Components/VisualEditor',
  component: VisualEditor,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof VisualEditor>;

export const Default: Story = {
  args: {
    config: MOCK_CONFIG,
  },
};

export const Empty: Story = {
  args: {
    config: {
      ...MOCK_CONFIG,
      adapter: {
        fetchSections: () => Promise.resolve([]),
        saveSections: () => Promise.resolve(),
      },
    },
  },
};

export const Loading: Story = {
  args: {
    config: {
      ...MOCK_CONFIG,
      adapter: {
        fetchSections: () => new Promise<Section[]>(() => {}),
        saveSections: () => Promise.resolve(),
      },
    },
  },
};

export const WithError: Story = {
  args: {
    config: {
      ...MOCK_CONFIG,
      adapter: {
        fetchSections: () => Promise.reject(new Error('Failed to connect to CMS')),
        saveSections: () => Promise.resolve(),
      },
    },
  },
};

const MANY_SECTIONS: Section[] = Array.from({ length: 6 }, (_, i) => ({
  id: `s${i}`,
  type: 'hero',
  order: i,
  data: { title: `Section ${i + 1}`, subtitle: `Subtitle for section ${i + 1}` },
}));

export const ManySections: Story = {
  args: {
    config: {
      ...MOCK_CONFIG,
      adapter: {
        fetchSections: () => Promise.resolve(MANY_SECTIONS),
        saveSections: () => new Promise((resolve) => setTimeout(resolve, 500)),
      },
    } satisfies VisualEditorConfig,
  },
};
