import { describe, it, expect } from 'vitest';
import { moveUp, moveDown, removeSection, updateSectionData } from '../../src/Utils/SectionHelpers';
import type { Section } from '../../src/Types';

/**
 * Creates mock sections for testing.
 * @param count - Number of sections to create
 * @returns Array of mock sections
 */
function createMockSections(count: number): Section[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `section-${i}`,
    type: 'hero',
    order: i,
    data: { title: `Section ${i}` },
  }));
}

describe('moveUp', () => {
  it('should swap the section with the one above it', () => {
    const sections = createMockSections(3);
    const result = moveUp(sections, 'section-1');
    const sorted = [...result].sort((a, b) => a.order - b.order);

    expect(sorted[0].id).toBe('section-1');
    expect(sorted[1].id).toBe('section-0');
    expect(sorted[2].id).toBe('section-2');
  });

  it('should return the same array when the section is already first', () => {
    const sections = createMockSections(3);
    const result = moveUp(sections, 'section-0');

    expect(result).toBe(sections);
  });

  it('should return the same array when section id does not exist', () => {
    const sections = createMockSections(3);
    const result = moveUp(sections, 'nonexistent');

    expect(result).toBe(sections);
  });
});

describe('moveDown', () => {
  it('should swap the section with the one below it', () => {
    const sections = createMockSections(3);
    const result = moveDown(sections, 'section-1');
    const sorted = [...result].sort((a, b) => a.order - b.order);

    expect(sorted[0].id).toBe('section-0');
    expect(sorted[1].id).toBe('section-2');
    expect(sorted[2].id).toBe('section-1');
  });

  it('should return the same array when the section is already last', () => {
    const sections = createMockSections(3);
    const result = moveDown(sections, 'section-2');

    expect(result).toBe(sections);
  });

  it('should return the same array when section id does not exist', () => {
    const sections = createMockSections(3);
    const result = moveDown(sections, 'nonexistent');

    expect(result).toBe(sections);
  });
});

describe('removeSection', () => {
  it('should remove the section and re-index order', () => {
    const sections = createMockSections(3);
    const result = removeSection(sections, 'section-1');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('section-0');
    expect(result[0].order).toBe(0);
    expect(result[1].id).toBe('section-2');
    expect(result[1].order).toBe(1);
  });

  it('should return all sections if id does not exist', () => {
    const sections = createMockSections(3);
    const result = removeSection(sections, 'nonexistent');

    expect(result).toHaveLength(3);
  });
});

describe('updateSectionData', () => {
  it('should merge new data into the target section', () => {
    const sections = createMockSections(2);
    const result = updateSectionData(sections, 'section-0', { title: 'Updated', subtitle: 'New' });

    expect(result[0].data).toEqual({ title: 'Updated', subtitle: 'New' });
    expect(result[1].data).toEqual({ title: 'Section 1' });
  });

  it('should not mutate the original sections', () => {
    const sections = createMockSections(2);
    updateSectionData(sections, 'section-0', { title: 'Updated' });

    expect(sections[0].data.title).toBe('Section 0');
  });
});
