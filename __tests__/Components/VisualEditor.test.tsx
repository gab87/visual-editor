import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VisualEditor } from '../../src/Components/VisualEditor/VisualEditor';
import type { VisualEditorConfig, Section } from '../../src/Types';

const MOCK_SECTIONS: Section[] = [
  { id: 's1', type: 'hero', order: 0, data: { title: 'Hero Title' } },
  { id: 's2', type: 'hero', order: 1, data: { title: 'Second Section' } },
];

/**
 * Mock section component.
 * @param props - Props with data
 * @returns Test div
 */
function MockHero({ data }: { data: Record<string, unknown> }) {
  return <div data-testid="hero">{data.title as string}</div>;
}

/**
 * Creates a test config with a mock adapter.
 * @param fetchResult - Sections to return from fetchSections
 * @returns VisualEditorConfig
 */
function createConfig(fetchResult: Section[] = MOCK_SECTIONS): VisualEditorConfig {
  return {
    slug: 'home',
    adapter: {
      fetchSections: vi.fn().mockResolvedValue(fetchResult),
      saveSections: vi.fn().mockResolvedValue(undefined),
    },
    sectionTypes: {
      hero: {
        component: MockHero,
        fields: [{ name: 'title', label: 'Title', type: 'text' as const }],
        label: 'Hero',
      },
    },
  };
}

describe('VisualEditor', () => {
  it('should show loading state initially', () => {
    const config = createConfig();
    render(<VisualEditor config={config} />);

    expect(screen.getByText('Loading sections...')).toBeInTheDocument();
  });

  it('should render sections after fetching', async () => {
    const config = createConfig();
    render(<VisualEditor config={config} />);

    await waitFor(() => {
      expect(screen.getByText('Hero Title')).toBeInTheDocument();
    });

    expect(screen.getByText('Second Section')).toBeInTheDocument();
    expect(config.adapter.fetchSections).toHaveBeenCalledWith('home');
  });

  it('should show error state when fetch fails', async () => {
    const config = createConfig();
    (config.adapter.fetchSections as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network error')
    );

    render(<VisualEditor config={config} />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should show empty state when no sections exist', async () => {
    const config = createConfig([]);
    render(<VisualEditor config={config} />);

    await waitFor(() => {
      expect(screen.getByText('No sections found')).toBeInTheDocument();
    });
  });

  it('should enable save button after editing', async () => {
    const config = createConfig();
    render(<VisualEditor config={config} />);

    await waitFor(() => {
      expect(screen.getByText('Hero Title')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();

    await userEvent.click(screen.getAllByLabelText('Delete section')[0]);

    expect(saveButton).not.toBeDisabled();
  });

  it('should undo a delete action', async () => {
    const config = createConfig();
    render(<VisualEditor config={config} />);

    await waitFor(() => {
      expect(screen.getByText('Hero Title')).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByLabelText('Delete section')[0]);
    expect(screen.queryByText('Hero Title')).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Undo'));
    expect(screen.getByText('Hero Title')).toBeInTheDocument();
  });

  it('should redo after undo', async () => {
    const config = createConfig();
    render(<VisualEditor config={config} />);

    await waitFor(() => {
      expect(screen.getByText('Hero Title')).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByLabelText('Delete section')[0]);
    await userEvent.click(screen.getByLabelText('Undo'));
    expect(screen.getByText('Hero Title')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Redo'));
    expect(screen.queryByText('Hero Title')).not.toBeInTheDocument();
  });

  it('should disable undo and redo buttons initially', async () => {
    const config = createConfig();
    render(<VisualEditor config={config} />);

    await waitFor(() => {
      expect(screen.getByText('Hero Title')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Undo')).toBeDisabled();
    expect(screen.getByLabelText('Redo')).toBeDisabled();
  });

  it('should enable undo after a mutation', async () => {
    const config = createConfig();
    render(<VisualEditor config={config} />);

    await waitFor(() => {
      expect(screen.getByText('Hero Title')).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByLabelText('Delete section')[0]);

    expect(screen.getByLabelText('Undo')).not.toBeDisabled();
  });
});
