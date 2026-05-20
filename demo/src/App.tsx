import React from 'react';
import { VisualEditor } from '@visual-editor/core';
import type { VisualEditorConfig, Section, SectionComponentProps } from '@visual-editor/core';

const MOCK_DB: Record<string, Section[]> = {
  home: [
    {
      id: 's1',
      type: 'hero',
      order: 0,
      data: {
        title: 'Welcome to Visual Editor',
        subtitle: 'A framework-agnostic page builder',
        bgColor: '#1e293b',
      },
    },
    {
      id: 's2',
      type: 'features',
      order: 1,
      data: {
        title: 'Features',
        items: [
          { title: 'Drag & Drop', description: 'Reorder sections easily' },
          { title: 'Live Preview', description: 'See changes in real-time' },
        ],
      },
    },
    {
      id: 's3',
      type: 'hero',
      order: 2,
      data: {
        title: 'Get Started Today',
        subtitle: 'Install via npm and start building',
        bgColor: '#0f172a',
      },
    },
  ],
};

/**
 * Mock hero section component.
 * @param props - Section component props
 * @returns Hero section UI
 */
function HeroSection({ data }: SectionComponentProps) {
  return (
    <div
      style={{
        padding: '60px 40px',
        background: String(data.bgColor ?? '#1e293b'),
        textAlign: 'center',
        color: '#e2e8f0',
      }}
    >
      <h1 style={{ fontSize: 32, margin: 0 }}>{String(data.title ?? '')}</h1>
      {data.subtitle && (
        <p style={{ fontSize: 18, color: '#94a3b8', marginTop: 12 }}>{String(data.subtitle)}</p>
      )}
    </div>
  );
}

/**
 * Mock features section component.
 * @param props - Section component props
 * @returns Features section UI
 */
function FeaturesSection({ data }: SectionComponentProps) {
  const items = (data.items as Array<{ title: string; description: string }>) ?? [];
  return (
    <div style={{ padding: '40px', background: '#1e293b', color: '#e2e8f0' }}>
      <h2 style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>
        {String(data.title ?? 'Features')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: 20, background: '#0f172a', borderRadius: 8 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>{item.title}</h3>
            <p style={{ fontSize: 14, color: '#94a3b8' }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const SLUG = 'home';

const config: VisualEditorConfig = {
  slug: SLUG,
  adapter: {
    fetchSections: (slug) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DB[slug] ?? []), 300);
      });
    },
    saveSections: (slug, sections) => {
      return new Promise((resolve) => {
        MOCK_DB[slug] = sections;
        console.log('Saved sections:', sections);
        setTimeout(resolve, 300);
      });
    },
  },
  sectionTypes: {
    hero: {
      component: HeroSection,
      label: 'Hero',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { name: 'bgColor', label: 'Background Color', type: 'color' },
      ],
    },
    features: {
      component: FeaturesSection,
      label: 'Features',
      fields: [
        { name: 'title', label: 'Section Title', type: 'text' },
        {
          name: 'items',
          label: 'Feature Items',
          type: 'repeater',
          fields: [
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
          ],
        },
      ],
    },
  },
};

/**
 * Demo application root component.
 * @returns App component
 */
export function App() {
  return <VisualEditor config={config} />;
}
