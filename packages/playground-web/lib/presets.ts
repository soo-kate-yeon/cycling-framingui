/**
 * 테마 프리셋 정의 (Platform Minimal 기반)
 * SPEC-UI-003: Theme Preset System
 * [TAG-UI003-055]
 *
 * Tekton MCP platform-minimal 테마를 기반으로 재구성
 */

export interface ThemePreset {
  id: string;
  name: string;
  category: 'color' | 'typography' | 'spacing';
  values: Record<string, string>;
}

/**
 * Color Presets (4개) - Pebble 추가
 * [TAG-UI003-007] 프리셋 선택 시 CSS Variables 즉시 업데이트
 */
export const colorPresets: ThemePreset[] = [
  {
    id: 'color-pebble',
    name: 'Pebble',
    category: 'color',
    values: {
      // Brand Color (보라색 계열)
      '--color-brand': 'oklch(0.65 0.18 260)',

      // Background (Neutral 50, 100 기반)
      '--bg-canvas': 'oklch(0.98 0.01 240)',
      '--bg-surface': 'oklch(1 0 0)',
      '--bg-surface-subtle': 'oklch(0.96 0.015 240)',
      '--bg-emphasis': 'oklch(0.9 0.02 240)',

      // Border (Neutral 100, 200, 300)
      '--border-subtle': 'oklch(0.96 0.015 240)',
      '--border-default': 'oklch(0.9 0.02 240)',
      '--border-emphasis': 'oklch(0.8 0.03 240)',

      // Text (Neutral 700, 500)
      '--text-primary': 'oklch(0.3 0.03 240)',
      '--text-secondary': 'oklch(0.5 0.03 240)',
      '--text-brand': 'oklch(0.65 0.18 260)',
      '--text-inverse': 'oklch(1 0 0)',

      // Icon
      '--icon-default': 'oklch(0.3 0.03 240)',
      '--icon-secondary': 'oklch(0.5 0.03 240)',
      '--icon-brand': 'oklch(0.65 0.18 260)',

      // Action (Button)
      '--action-primary': 'oklch(0.65 0.18 260)',
      '--action-primary-text': 'oklch(1 0 0)',
      '--action-disabled': 'oklch(0.8 0.03 240)',
      '--action-disabled-text': 'oklch(0.5 0.03 240)',
    },
  },
  {
    id: 'color-platform-minimal',
    name: 'Platform Minimal',
    category: 'color',
    values: {
      // Brand Color (보라색 계열)
      '--color-brand': 'oklch(0.6 0.16 260)',

      // Background
      '--bg-canvas': 'oklch(0.98 0.005 150)',
      '--bg-surface': 'oklch(1 0 0)',
      '--bg-surface-subtle': 'oklch(0.98 0.005 150)',
      '--bg-emphasis': 'oklch(0.2 0.005 150)',

      // Border
      '--border-subtle': 'oklch(0.95 0.005 150)',
      '--border-default': 'oklch(0.89 0.005 150)',
      '--border-emphasis': 'oklch(0.75 0.005 150)',

      // Text
      '--text-primary': 'oklch(0.2 0.005 150)',
      '--text-secondary': 'oklch(0.5 0.005 150)',
      '--text-brand': 'oklch(0.6 0.16 260)',
      '--text-inverse': 'oklch(1 0 0)',

      // Icon
      '--icon-default': 'oklch(0.2 0.005 150)',
      '--icon-secondary': 'oklch(0.5 0.005 150)',
      '--icon-brand': 'oklch(0.6 0.16 260)',

      // Action (Button)
      '--action-primary': 'oklch(0.2 0.005 150)',
      '--action-primary-text': 'oklch(1 0 0)',
      '--action-disabled': 'oklch(0.75 0.005 150)',
      '--action-disabled-text': 'oklch(0.5 0.005 150)',
    },
  },
  {
    id: 'color-platform-warm',
    name: 'Platform Warm',
    category: 'color',
    values: {
      // Brand Color (따뜻한 주황색 계열)
      '--color-brand': 'oklch(0.65 0.18 40)',

      // Background (따뜻한 톤)
      '--bg-canvas': 'oklch(0.98 0.01 50)',
      '--bg-surface': 'oklch(1 0 0)',
      '--bg-surface-subtle': 'oklch(0.98 0.01 50)',
      '--bg-emphasis': 'oklch(0.25 0.02 40)',

      // Border
      '--border-subtle': 'oklch(0.95 0.01 50)',
      '--border-default': 'oklch(0.89 0.01 50)',
      '--border-emphasis': 'oklch(0.75 0.02 50)',

      // Text
      '--text-primary': 'oklch(0.25 0.02 40)',
      '--text-secondary': 'oklch(0.5 0.02 40)',
      '--text-brand': 'oklch(0.65 0.18 40)',
      '--text-inverse': 'oklch(1 0 0)',

      // Icon
      '--icon-default': 'oklch(0.25 0.02 40)',
      '--icon-secondary': 'oklch(0.5 0.02 40)',
      '--icon-brand': 'oklch(0.65 0.18 40)',

      // Action
      '--action-primary': 'oklch(0.65 0.18 40)',
      '--action-primary-text': 'oklch(1 0 0)',
      '--action-disabled': 'oklch(0.75 0.02 50)',
      '--action-disabled-text': 'oklch(0.5 0.02 40)',
    },
  },
  {
    id: 'color-platform-cool',
    name: 'Platform Cool',
    category: 'color',
    values: {
      // Brand Color (차가운 파란색 계열)
      '--color-brand': 'oklch(0.6 0.16 220)',

      // Background (차가운 톤)
      '--bg-canvas': 'oklch(0.98 0.008 220)',
      '--bg-surface': 'oklch(1 0 0)',
      '--bg-surface-subtle': 'oklch(0.98 0.008 220)',
      '--bg-emphasis': 'oklch(0.2 0.01 220)',

      // Border
      '--border-subtle': 'oklch(0.95 0.008 220)',
      '--border-default': 'oklch(0.89 0.008 220)',
      '--border-emphasis': 'oklch(0.75 0.01 220)',

      // Text
      '--text-primary': 'oklch(0.2 0.01 220)',
      '--text-secondary': 'oklch(0.5 0.01 220)',
      '--text-brand': 'oklch(0.6 0.16 220)',
      '--text-inverse': 'oklch(1 0 0)',

      // Icon
      '--icon-default': 'oklch(0.2 0.01 220)',
      '--icon-secondary': 'oklch(0.5 0.01 220)',
      '--icon-brand': 'oklch(0.6 0.16 220)',

      // Action
      '--action-primary': 'oklch(0.6 0.16 220)',
      '--action-primary-text': 'oklch(1 0 0)',
      '--action-disabled': 'oklch(0.75 0.01 220)',
      '--action-disabled-text': 'oklch(0.5 0.01 220)',
    },
  },
];

/**
 * Typography Presets (4개) - Pebble 추가
 */
export const typographyPresets: ThemePreset[] = [
  {
    id: 'typo-pebble',
    name: 'Pebble',
    category: 'typography',
    values: {
      '--font-family': 'Inter, sans-serif',
      '--font-family-display': 'Inter Display, sans-serif',
      '--font-size-base': '16px',
      '--font-weight-regular': '400',
      '--font-weight-medium': '500',
      '--font-weight-semibold': '600',
      '--font-weight-bold': '700',
      '--line-height': '1.5',
    },
  },
  {
    id: 'typo-platform-sans',
    name: 'Platform Sans',
    category: 'typography',
    values: {
      '--font-family': 'Inter, sans-serif',
      '--font-family-display': 'Inter Display, sans-serif',
      '--font-size-base': '16px',
      '--font-weight-regular': '400',
      '--font-weight-medium': '500',
      '--font-weight-bold': '700',
      '--line-height': '1.5',
    },
  },
  {
    id: 'typo-platform-serif',
    name: 'Platform Serif',
    category: 'typography',
    values: {
      '--font-family': 'Georgia, Times, serif',
      '--font-family-display': 'Georgia, serif',
      '--font-size-base': '16px',
      '--font-weight-regular': '400',
      '--font-weight-medium': '500',
      '--font-weight-bold': '700',
      '--line-height': '1.6',
    },
  },
  {
    id: 'typo-platform-mono',
    name: 'Platform Mono',
    category: 'typography',
    values: {
      '--font-family': 'JetBrains Mono, monospace',
      '--font-family-display': 'JetBrains Mono, monospace',
      '--font-size-base': '14px',
      '--font-weight-regular': '400',
      '--font-weight-medium': '500',
      '--font-weight-bold': '700',
      '--line-height': '1.5',
    },
  },
];

/**
 * Spacing Presets (4개) - Pebble 추가
 */
export const spacingPresets: ThemePreset[] = [
  {
    id: 'spacing-pebble',
    name: 'Pebble',
    category: 'spacing',
    values: {
      '--spacing-unit': '4px',
      '--spacing-0': '0',
      '--spacing-1': '4px',
      '--spacing-2': '8px',
      '--spacing-3': '12px',
      '--spacing-4': '16px',
      '--spacing-5': '20px',
      '--spacing-6': '24px',
      '--spacing-8': '32px',
      '--spacing-10': '40px',
      '--spacing-12': '48px',
      '--spacing-16': '64px',
      '--spacing-20': '80px',
      '--spacing-24': '96px',
      '--radius-xs': '2px',
      '--radius-sm': '4px',
      '--radius-md': '8px',
      '--radius-lg': '12px',
      '--radius-xl': '12px',
      '--radius-2xl': '16px',
      '--radius-3xl': '24px',
      '--radius-full': '9999px',
    },
  },
  {
    id: 'spacing-platform-compact',
    name: 'Platform Compact',
    category: 'spacing',
    values: {
      '--spacing-unit': '4px',
      '--spacing-0': '0',
      '--spacing-1': '4px',
      '--spacing-2': '8px',
      '--spacing-3': '12px',
      '--spacing-4': '16px',
      '--spacing-5': '20px',
      '--spacing-6': '24px',
      '--spacing-8': '32px',
      '--spacing-10': '40px',
      '--spacing-12': '48px',
      '--radius-xs': '2px',
      '--radius-sm': '4px',
      '--radius-md': '8px',
      '--radius-lg': '8px',
      '--radius-xl': '12px',
    },
  },
  {
    id: 'spacing-platform-standard',
    name: 'Platform Standard',
    category: 'spacing',
    values: {
      '--spacing-unit': '4px',
      '--spacing-0': '0',
      '--spacing-1': '5px',
      '--spacing-2': '10px',
      '--spacing-3': '15px',
      '--spacing-4': '20px',
      '--spacing-5': '25px',
      '--spacing-6': '30px',
      '--spacing-8': '40px',
      '--spacing-10': '50px',
      '--spacing-12': '60px',
      '--radius-xs': '2px',
      '--radius-sm': '4px',
      '--radius-md': '8px',
      '--radius-lg': '12px',
      '--radius-xl': '16px',
    },
  },
  {
    id: 'spacing-platform-spacious',
    name: 'Platform Spacious',
    category: 'spacing',
    values: {
      '--spacing-unit': '4px',
      '--spacing-0': '0',
      '--spacing-1': '6px',
      '--spacing-2': '12px',
      '--spacing-3': '18px',
      '--spacing-4': '24px',
      '--spacing-5': '30px',
      '--spacing-6': '36px',
      '--spacing-8': '48px',
      '--spacing-10': '60px',
      '--spacing-12': '72px',
      '--radius-xs': '4px',
      '--radius-sm': '8px',
      '--radius-md': '12px',
      '--radius-lg': '16px',
      '--radius-xl': '24px',
    },
  },
];

/**
 * Motion Presets (Platform Minimal 모션 시스템)
 */
export const motionValues = {
  // Duration
  '--duration-instant': '0ms',
  '--duration-micro': '50ms',
  '--duration-quick': '100ms',
  '--duration-short': '150ms',
  '--duration-standard': '150ms',
  '--duration-moderate': '200ms',
  '--duration-medium': '300ms',
  '--duration-deliberate': '300ms',
  '--duration-slow': '400ms',
  '--duration-long': '450ms',
  '--duration-complex': '500ms',

  // Easing
  '--easing-linear': 'linear',
  '--easing-standard': 'cubic-bezier(0.2, 0, 0, 1)',
  '--easing-emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
  '--easing-decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
  '--easing-accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
  '--easing-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

/**
 * Elevation Presets (Platform Minimal 그림자 시스템)
 */
export const elevationValues = {
  '--elevation-0': 'none',
  '--elevation-1': '0 2px 8px rgba(0,0,0,0.04)',
  '--elevation-2': '0 4px 16px rgba(0,0,0,0.08)',
  '--elevation-3': '0 8px 32px rgba(0,0,0,0.12)',
};

/**
 * State Layer (Platform Minimal 상태 레이어)
 */
export const stateLayerValues = {
  '--state-hover-opacity': '0.08',
  '--state-disabled-opacity': '0.38',
  '--state-disabled-content-opacity': '0.38',
};

/**
 * 프리셋 ID로 검색
 */
export function getPresetById(id: string): ThemePreset | undefined {
  const allPresets = [...colorPresets, ...typographyPresets, ...spacingPresets];
  return allPresets.find((preset) => preset.id === id);
}

/**
 * 카테고리별 프리셋 검색
 */
export function getPresetsByCategory(category: 'color' | 'typography' | 'spacing'): ThemePreset[] {
  switch (category) {
    case 'color':
      return colorPresets;
    case 'typography':
      return typographyPresets;
    case 'spacing':
      return spacingPresets;
  }
}
