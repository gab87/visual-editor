import type { Section } from '../Types';

/**
 * Moves a section one position up in the list.
 * Returns a new array with updated order values.
 * @param sections - Current sections array
 * @param sectionId - ID of the section to move up
 * @returns New sections array with updated order
 */
export function moveUp(sections: Section[], sectionId: string): Section[] {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.id === sectionId);

  if (index <= 0) {
    return sections;
  }

  return sorted.map((section, i) => {
    if (i === index - 1) {
      return { ...section, order: index };
    }
    if (i === index) {
      return { ...section, order: index - 1 };
    }
    return { ...section, order: i };
  });
}

/**
 * Moves a section one position down in the list.
 * Returns a new array with updated order values.
 * @param sections - Current sections array
 * @param sectionId - ID of the section to move down
 * @returns New sections array with updated order
 */
export function moveDown(sections: Section[], sectionId: string): Section[] {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.id === sectionId);

  if (index < 0 || index >= sorted.length - 1) {
    return sections;
  }

  return sorted.map((section, i) => {
    if (i === index) {
      return { ...section, order: index + 1 };
    }
    if (i === index + 1) {
      return { ...section, order: index };
    }
    return { ...section, order: i };
  });
}

/**
 * Removes a section from the list and re-indexes order values.
 * @param sections - Current sections array
 * @param sectionId - ID of the section to remove
 * @returns New sections array without the removed section
 */
export function removeSection(sections: Section[], sectionId: string): Section[] {
  return sections
    .filter((s) => s.id !== sectionId)
    .sort((a, b) => a.order - b.order)
    .map((section, i) => ({ ...section, order: i }));
}

/**
 * Updates the data of a specific section.
 * @param sections - Current sections array
 * @param sectionId - ID of the section to update
 * @param data - New data to merge into the section
 * @returns New sections array with the updated section
 */
export function updateSectionData(
  sections: Section[],
  sectionId: string,
  data: Record<string, unknown>
): Section[] {
  return sections.map((section) => {
    if (section.id !== sectionId) {
      return section;
    }
    return { ...section, data: { ...section.data, ...data } };
  });
}
