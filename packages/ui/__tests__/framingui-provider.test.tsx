import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FramingUIProvider } from '../src/framingui-provider';
import type { ThemeDefinition } from '../src/lib/theme-loader';

const mockTheme: ThemeDefinition = {
  id: 'neutral-workspace',
  name: 'Neutral Workspace',
  schemaVersion: '2.1',
  tokens: {
    atomic: {
      color: {
        brand: {
          '100': { l: 0.88, c: 0.06, h: 32 },
          '500': { l: 0.55, c: 0.18, h: 32 },
          '700': { l: 0.42, c: 0.2, h: 32 },
        },
        neutral: {
          white: { l: 0.99, c: 0.01, h: 55 },
          '50': { l: 0.97, c: 0.02, h: 55 },
          '100': { l: 0.95, c: 0.03, h: 55 },
          '200': { l: 0.91, c: 0.03, h: 55 },
          '300': { l: 0.86, c: 0.03, h: 55 },
          '400': { l: 0.72, c: 0.02, h: 55 },
          '600': { l: 0.42, c: 0.02, h: 55 },
          '900': { l: 0.12, c: 0.01, h: 55 },
        },
      },
      spacing: {
        '2': '8px',
        '4': '16px',
      },
      radius: {
        md: '8px',
        lg: '12px',
      },
    },
    semantic: {
      background: {
        canvas: 'atomic.color.neutral.50',
        surface: {
          subtle: 'atomic.color.neutral.100',
          default: 'atomic.color.neutral.white',
          emphasis: 'atomic.color.neutral.200',
        },
        brand: {
          subtle: 'atomic.color.brand.100',
          default: 'atomic.color.brand.500',
          emphasis: 'atomic.color.brand.700',
        },
      },
      border: {
        default: {
          subtle: 'atomic.color.neutral.100',
          default: 'atomic.color.neutral.200',
          emphasis: 'atomic.color.neutral.300',
        },
      },
      text: {
        primary: 'atomic.color.neutral.900',
        secondary: 'atomic.color.neutral.600',
        muted: 'atomic.color.neutral.400',
      },
    },
  },
};

describe('FramingUIProvider', () => {
  afterEach(() => {
    document.getElementById('tekton-theme')?.remove();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  it('renders children', () => {
    render(
      <FramingUIProvider>
        <div>Child content</div>
      </FramingUIProvider>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('injects theme CSS and syncs data-theme when theme is provided', () => {
    render(
      <FramingUIProvider theme={mockTheme}>
        <div>Child content</div>
      </FramingUIProvider>
    );

    const injectedStyle = document.getElementById('tekton-theme');

    expect(injectedStyle).toBeInTheDocument();
    expect(injectedStyle?.textContent).toContain('[data-theme="neutral-workspace"]');
    expect(document.documentElement.getAttribute('data-theme')).toBe('neutral-workspace');
  });

  it('syncs data-theme without injecting CSS when only themeId is provided', () => {
    render(
      <FramingUIProvider themeId="neutral-workspace">
        <div>Child content</div>
      </FramingUIProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('neutral-workspace');
    expect(document.getElementById('tekton-theme')).not.toBeInTheDocument();
  });

  it('warns in development when theme.id and themeId disagree', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <FramingUIProvider theme={mockTheme} themeId="pebble">
        <div>Child content</div>
      </FramingUIProvider>
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('theme.id "neutral-workspace" does not match themeId "pebble"')
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe('neutral-workspace');
  });
});
