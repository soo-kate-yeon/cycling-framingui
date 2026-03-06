/**
 * @framingui/ui - Theme Loader Tests
 * SPEC-UI-001: Verify linear-minimal-v1.json → CSS Variables conversion
 */

import { describe, it, expect } from 'vitest';
import {
  oklchToCSS,
  resolveSemanticToken,
  themeToCSS,
  type ThemeDefinition,
  type OKLCHColor,
} from '../theme-loader';

describe('theme-loader', () => {
  describe('oklchToCSS', () => {
    it('should convert OKLCH color to CSS string', () => {
      const color: OKLCHColor = { l: 0.55, c: 0.12, h: 265 };
      expect(oklchToCSS(color)).toBe('oklch(0.55 0.12 265)');
    });

    it('should handle white color', () => {
      const white: OKLCHColor = { l: 1, c: 0, h: 0 };
      expect(oklchToCSS(white)).toBe('oklch(1 0 0)');
    });
  });

  describe('resolveSemanticToken', () => {
    const mockTheme: ThemeDefinition = {
      id: 'test-theme',
      name: 'Test Theme',
      schemaVersion: '2.1',
      tokens: {
        atomic: {
          color: {
            brand: {
              '500': { l: 0.55, c: 0.12, h: 265 },
            },
            neutral: {
              '50': { l: 0.99, c: 0.005, h: 265 },
              '900': { l: 0.2, c: 0.04, h: 265 },
            },
            white: { l: 1, c: 0, h: 0 },
          },
          spacing: {
            '1': '4px',
            '2': '8px',
          },
          radius: {
            sm: '4px',
            md: '6px',
          },
        },
        semantic: {
          background: {
            canvas: 'atomic.color.neutral.50',
            surface: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.white',
              emphasis: 'atomic.color.neutral.50',
            },
            brand: {
              subtle: 'atomic.color.brand.500',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.500',
            },
          },
          border: {
            default: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.neutral.50',
              emphasis: 'atomic.color.neutral.50',
            },
          },
        },
      },
    };

    it('should resolve semantic token to atomic color', () => {
      const result = resolveSemanticToken('atomic.color.brand.500', mockTheme);
      expect(result).toEqual({ l: 0.55, c: 0.12, h: 265 });
    });

    it('should resolve nested semantic token', () => {
      const result = resolveSemanticToken('atomic.color.neutral.50', mockTheme);
      expect(result).toEqual({ l: 0.99, c: 0.005, h: 265 });
    });

    it('should return original string if not a token reference', () => {
      const result = resolveSemanticToken('not-a-token', mockTheme);
      expect(result).toBe('not-a-token');
    });

    it('should resolve spacing tokens', () => {
      const result = resolveSemanticToken('atomic.spacing.1', mockTheme);
      expect(result).toBe('4px');
    });
  });

  describe('themeToCSS', () => {
    const linearMinimalV1: ThemeDefinition = {
      id: 'linear-minimal-v1',
      name: 'Linear Minimal',
      schemaVersion: '2.1',
      tokens: {
        atomic: {
          color: {
            brand: {
              '100': { l: 0.95, c: 0.02, h: 265 },
              '500': { l: 0.55, c: 0.12, h: 265 },
              '600': { l: 0.45, c: 0.14, h: 265 },
            },
            neutral: {
              '50': { l: 0.99, c: 0.005, h: 265 },
              '100': { l: 0.96, c: 0.01, h: 265 },
              '200': { l: 0.92, c: 0.015, h: 265 },
              '300': { l: 0.85, c: 0.02, h: 265 },
              '500': { l: 0.6, c: 0.03, h: 265 },
              '900': { l: 0.2, c: 0.04, h: 265 },
            },
            white: { l: 1, c: 0, h: 0 },
          },
          spacing: {
            '0': '0',
            '1': '4px',
            '2': '8px',
            '4': '16px',
          },
          radius: {
            sm: '4px',
            md: '6px',
            lg: '8px',
            full: '9999px',
          },
        },
        semantic: {
          background: {
            canvas: 'atomic.color.neutral.50',
            surface: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.white',
              emphasis: 'atomic.color.neutral.100',
            },
            brand: {
              subtle: 'atomic.color.brand.100',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.600',
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
            secondary: 'atomic.color.neutral.500',
            muted: 'atomic.color.neutral.500',
          },
        },
      },
    };

    it('should generate CSS Variables from theme JSON', () => {
      const css = themeToCSS(linearMinimalV1);

      expect(css).toContain(':root');
      expect(css).toContain('[data-theme="linear-minimal-v1"]');
      expect(css).toContain('--bg-background:');
      expect(css).toContain('--bg-primary:');
      expect(css).toContain('--border-default:');
      expect(css).toContain('--radius-sm: 4px');
      expect(css).toContain('--spacing-1: 4px');
    });

    it('should resolve semantic tokens to OKLCH colors', () => {
      const css = themeToCSS(linearMinimalV1);

      // Check background tokens resolve to OKLCH
      expect(css).toContain('oklch(0.99 0.005 265)'); // neutral.50
      expect(css).toContain('oklch(0.55 0.12 265)'); // brand.500
      expect(css).toContain('oklch(1 0 0)'); // white
    });

    it('should include all spacing tokens', () => {
      const css = themeToCSS(linearMinimalV1);

      expect(css).toContain('--spacing-0: 0');
      expect(css).toContain('--spacing-1: 4px');
      expect(css).toContain('--spacing-2: 8px');
      expect(css).toContain('--spacing-4: 16px');
    });

    it('should include all radius tokens', () => {
      const css = themeToCSS(linearMinimalV1);

      expect(css).toContain('--radius-sm: 4px');
      expect(css).toContain('--radius-md: 6px');
      expect(css).toContain('--radius-lg: 8px');
      expect(css).toContain('--radius-full: 9999px');
    });
  });

  /**
   * v0.5.0: getWhiteColor() 폴백 체인 테스트
   * getWhiteColor()는 내부 함수이므로 themeToCSS()를 통해 간접 검증
   */
  describe('getWhiteColor fallback chain', () => {
    const makeTheme = (
      colorOverrides: Partial<ThemeDefinition['tokens']['atomic']['color']>
    ): ThemeDefinition => ({
      id: 'white-test',
      name: 'White Test',
      schemaVersion: '2.1',
      tokens: {
        atomic: {
          color: {
            brand: { '500': { l: 0.55, c: 0.12, h: 265 } },
            ...colorOverrides,
          },
          spacing: { '1': '4px' },
          radius: { md: '6px' },
        },
        semantic: {
          background: {
            canvas: 'atomic.color.brand.500',
            surface: {
              subtle: 'atomic.color.brand.500',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.500',
            },
            brand: {
              subtle: 'atomic.color.brand.500',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.500',
            },
          },
          border: {
            default: {
              subtle: 'atomic.color.brand.500',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.500',
            },
          },
        },
      },
    });

    it('should prefer neutral.white (v2.1 schema) over color.white', () => {
      const theme = makeTheme({
        neutral: {
          white: { l: 0.98, c: 0.01, h: 100 },
          '900': { l: 0.2, c: 0.04, h: 265 },
        },
        white: { l: 1, c: 0, h: 0 },
      });
      const css = themeToCSS(theme);

      // --bg-primary-foreground 과 --action-primary-text 에
      // neutral.white 값이 사용되어야 함
      expect(css).toContain('--bg-primary-foreground: oklch(0.98 0.01 100)');
      expect(css).toContain('--action-primary-text: oklch(0.98 0.01 100)');
    });

    it('should fall back to color.white (v1 schema) when neutral.white is absent', () => {
      const theme = makeTheme({
        neutral: {
          '900': { l: 0.2, c: 0.04, h: 265 },
        },
        white: { l: 0.99, c: 0.005, h: 50 },
      });
      const css = themeToCSS(theme);

      expect(css).toContain('--bg-primary-foreground: oklch(0.99 0.005 50)');
      expect(css).toContain('--action-primary-text: oklch(0.99 0.005 50)');
    });

    it('should fall back to pure white { l:1, c:0, h:0 } when both are absent', () => {
      const theme = makeTheme({
        neutral: {
          '900': { l: 0.2, c: 0.04, h: 265 },
        },
        // white 필드 없음
      });
      const css = themeToCSS(theme);

      expect(css).toContain('--bg-primary-foreground: oklch(1 0 0)');
      expect(css).toContain('--action-primary-text: oklch(1 0 0)');
    });

    it('should fall back to pure white when neutral is undefined', () => {
      const theme = makeTheme({
        // neutral 필드 없음, white 필드 없음
      });
      const css = themeToCSS(theme);

      expect(css).toContain('--bg-primary-foreground: oklch(1 0 0)');
    });
  });

  /**
   * v0.5.0: 페이지 시맨틱 CSS 변수 테스트
   */
  describe('themeToCSS page semantic variables', () => {
    const fullTheme: ThemeDefinition = {
      id: 'page-semantic-test',
      name: 'Page Semantic Test',
      schemaVersion: '2.1',
      tokens: {
        atomic: {
          color: {
            brand: {
              '500': { l: 0.55, c: 0.12, h: 265 },
            },
            neutral: {
              '50': { l: 0.99, c: 0.005, h: 265 },
              '100': { l: 0.96, c: 0.01, h: 265 },
              '300': { l: 0.85, c: 0.02, h: 265 },
              '500': { l: 0.6, c: 0.03, h: 265 },
              '900': { l: 0.2, c: 0.04, h: 265 },
            },
            white: { l: 1, c: 0, h: 0 },
          },
          spacing: { '1': '4px' },
          radius: { md: '6px' },
        },
        semantic: {
          background: {
            canvas: 'atomic.color.neutral.50',
            surface: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.white',
              emphasis: 'atomic.color.neutral.100',
            },
            brand: {
              subtle: 'atomic.color.brand.500',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.500',
            },
          },
          border: {
            default: {
              subtle: 'atomic.color.neutral.100',
              default: 'atomic.color.neutral.100',
              emphasis: 'atomic.color.neutral.300',
            },
          },
          text: {
            primary: 'atomic.color.neutral.900',
            secondary: 'atomic.color.neutral.500',
            muted: 'atomic.color.neutral.500',
          },
        },
      },
    };

    it('should generate --bg-canvas variable', () => {
      const css = themeToCSS(fullTheme);
      expect(css).toContain('--bg-canvas: oklch(0.99 0.005 265)');
    });

    it('should generate --bg-surface variable', () => {
      const css = themeToCSS(fullTheme);
      expect(css).toContain('--bg-surface: oklch(1 0 0)');
    });

    it('should generate --text-primary variable', () => {
      const css = themeToCSS(fullTheme);
      expect(css).toContain('--text-primary: oklch(0.2 0.04 265)');
    });

    it('should generate --text-secondary variable', () => {
      const css = themeToCSS(fullTheme);
      expect(css).toContain('--text-secondary: oklch(0.6 0.03 265)');
    });

    it('should generate --text-tertiary variable', () => {
      const css = themeToCSS(fullTheme);
      expect(css).toContain('--text-tertiary: oklch(0.6 0.03 265)');
    });

    it('should generate --action-primary variable', () => {
      const css = themeToCSS(fullTheme);
      // action-primary 는 textPrimary 와 동일
      expect(css).toContain('--action-primary: oklch(0.2 0.04 265)');
    });

    it('should generate --action-primary-text as white', () => {
      const css = themeToCSS(fullTheme);
      expect(css).toContain('--action-primary-text: oklch(1 0 0)');
    });

    it('should generate --border-emphasis variable', () => {
      const css = themeToCSS(fullTheme);
      expect(css).toContain('--border-emphasis: oklch(0.85 0.02 265)');
    });

    it('should generate all 8 page semantic variables', () => {
      const css = themeToCSS(fullTheme);
      const pageSemanticVars = [
        '--bg-canvas',
        '--bg-surface',
        '--text-primary',
        '--text-secondary',
        '--text-tertiary',
        '--action-primary:',
        '--action-primary-text',
        '--border-emphasis',
      ];
      for (const varName of pageSemanticVars) {
        expect(css).toContain(varName);
      }
    });
  });

  /**
   * v0.5.0: 텍스트 색상 폴백 체인 테스트
   */
  describe('text color resolution fallbacks', () => {
    const makeThemeWithText = (
      textConfig?: ThemeDefinition['tokens']['semantic']['text'],
      neutralOverrides?: Record<string, OKLCHColor>
    ): ThemeDefinition => ({
      id: 'text-fallback-test',
      name: 'Text Fallback Test',
      schemaVersion: '2.1',
      tokens: {
        atomic: {
          color: {
            brand: { '500': { l: 0.55, c: 0.12, h: 265 } },
            neutral: neutralOverrides ?? {
              '50': { l: 0.99, c: 0.005, h: 265 },
              '900': { l: 0.2, c: 0.04, h: 265 },
            },
            white: { l: 1, c: 0, h: 0 },
          },
          spacing: { '1': '4px' },
          radius: { md: '6px' },
        },
        semantic: {
          background: {
            canvas: 'atomic.color.neutral.50',
            surface: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.white',
              emphasis: 'atomic.color.neutral.50',
            },
            brand: {
              subtle: 'atomic.color.brand.500',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.500',
            },
          },
          border: {
            default: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.neutral.50',
              emphasis: 'atomic.color.neutral.50',
            },
          },
          text: textConfig,
        },
      },
    });

    it('should use semantic.text when available', () => {
      const theme = makeThemeWithText(
        {
          primary: 'atomic.color.neutral.900',
          secondary: 'atomic.color.brand.500',
          muted: 'atomic.color.brand.500',
        },
        {
          '50': { l: 0.99, c: 0.005, h: 265 },
          '900': { l: 0.2, c: 0.04, h: 265 },
        }
      );
      const css = themeToCSS(theme);

      expect(css).toContain('--text-primary: oklch(0.2 0.04 265)');
      expect(css).toContain('--text-secondary: oklch(0.55 0.12 265)');
    });

    it('should fall back to atomic.color.neutral when semantic.text is absent', () => {
      const theme = makeThemeWithText(
        undefined, // text 없음
        {
          '50': { l: 0.99, c: 0.005, h: 265 },
          '400': { l: 0.7, c: 0.025, h: 265 },
          '500': { l: 0.6, c: 0.03, h: 265 },
          '900': { l: 0.2, c: 0.04, h: 265 },
        }
      );
      const css = themeToCSS(theme);

      // textPrimary → neutral[900]
      expect(css).toContain('--text-primary: oklch(0.2 0.04 265)');
      // textSecondary → neutral[500]
      expect(css).toContain('--text-secondary: oklch(0.6 0.03 265)');
      // textTertiary → neutral[400]
      expect(css).toContain('--text-tertiary: oklch(0.7 0.025 265)');
    });

    it('should fall back to hardcoded OKLCH when semantic.text and neutral keys are absent', () => {
      const theme = makeThemeWithText(
        undefined, // text 없음
        {
          '50': { l: 0.99, c: 0.005, h: 265 },
          // neutral[400], [500], [900] 없음
        }
      );
      const css = themeToCSS(theme);

      // textPrimary → 하드코딩 폴백: { l: 0.12, c: 0.01, h: 0 }
      expect(css).toContain('--text-primary: oklch(0.12 0.01 0)');
      // textSecondary → 하드코딩 폴백: { l: 0.58, c: 0.02, h: 0 }
      expect(css).toContain('--text-secondary: oklch(0.58 0.02 0)');
      // textTertiary → 하드코딩 폴백: { l: 0.72, c: 0.02, h: 0 }
      expect(css).toContain('--text-tertiary: oklch(0.72 0.02 0)');
    });

    it('should fall back tertiary to hardcoded even when primary/secondary resolve via neutral', () => {
      const theme = makeThemeWithText(undefined, {
        '50': { l: 0.99, c: 0.005, h: 265 },
        '500': { l: 0.6, c: 0.03, h: 265 },
        '900': { l: 0.2, c: 0.04, h: 265 },
        // neutral[400] 없음 → tertiary만 하드코딩 폴백
      });
      const css = themeToCSS(theme);

      expect(css).toContain('--text-primary: oklch(0.2 0.04 265)');
      expect(css).toContain('--text-secondary: oklch(0.6 0.03 265)');
      expect(css).toContain('--text-tertiary: oklch(0.72 0.02 0)');
    });
  });

  /**
   * v0.5.0: ThemeDefinition에서 brand/neutral/accent 옵셔널 필드 테스트
   */
  describe('ThemeDefinition optional color fields', () => {
    it('should generate CSS without brand field', () => {
      const theme: ThemeDefinition = {
        id: 'no-brand',
        name: 'No Brand',
        schemaVersion: '2.1',
        tokens: {
          atomic: {
            color: {
              neutral: {
                '50': { l: 0.99, c: 0.005, h: 0 },
                '900': { l: 0.2, c: 0.04, h: 0 },
              },
              white: { l: 1, c: 0, h: 0 },
            },
            spacing: { '1': '4px' },
            radius: { md: '6px' },
          },
          semantic: {
            background: {
              canvas: 'atomic.color.neutral.50',
              surface: {
                subtle: 'atomic.color.neutral.50',
                default: 'atomic.color.white',
                emphasis: 'atomic.color.neutral.50',
              },
              brand: {
                subtle: 'atomic.color.neutral.50',
                default: 'atomic.color.neutral.900',
                emphasis: 'atomic.color.neutral.900',
              },
            },
            border: {
              default: {
                subtle: 'atomic.color.neutral.50',
                default: 'atomic.color.neutral.50',
                emphasis: 'atomic.color.neutral.50',
              },
            },
          },
        },
      };

      const css = themeToCSS(theme);
      expect(css).toContain(':root');
      expect(css).toContain('--bg-primary: oklch(0.2 0.04 0)');
      expect(css).toContain('--bg-canvas: oklch(0.99 0.005 0)');
    });

    it('should generate CSS without neutral field', () => {
      const theme: ThemeDefinition = {
        id: 'no-neutral',
        name: 'No Neutral',
        schemaVersion: '2.1',
        tokens: {
          atomic: {
            color: {
              brand: { '500': { l: 0.55, c: 0.12, h: 265 } },
              white: { l: 1, c: 0, h: 0 },
            },
            spacing: { '1': '4px' },
            radius: { md: '6px' },
          },
          semantic: {
            background: {
              canvas: 'atomic.color.brand.500',
              surface: {
                subtle: 'atomic.color.brand.500',
                default: 'atomic.color.white',
                emphasis: 'atomic.color.brand.500',
              },
              brand: {
                subtle: 'atomic.color.brand.500',
                default: 'atomic.color.brand.500',
                emphasis: 'atomic.color.brand.500',
              },
            },
            border: {
              default: {
                subtle: 'atomic.color.brand.500',
                default: 'atomic.color.brand.500',
                emphasis: 'atomic.color.brand.500',
              },
            },
          },
        },
      };

      const css = themeToCSS(theme);
      expect(css).toContain(':root');
      // neutral 없으므로 텍스트는 하드코딩 폴백 사용
      expect(css).toContain('--text-primary: oklch(0.12 0.01 0)');
      expect(css).toContain('--text-secondary: oklch(0.58 0.02 0)');
    });

    it('should generate CSS with only minimal color fields (no brand, no neutral, no white)', () => {
      const theme: ThemeDefinition = {
        id: 'minimal-color',
        name: 'Minimal Color',
        schemaVersion: '2.1',
        tokens: {
          atomic: {
            color: {
              accent: { '500': { l: 0.6, c: 0.15, h: 180 } },
            },
            spacing: { '1': '4px' },
            radius: { md: '6px' },
          },
          semantic: {
            background: {
              canvas: 'atomic.color.accent.500',
              surface: {
                subtle: 'atomic.color.accent.500',
                default: 'atomic.color.accent.500',
                emphasis: 'atomic.color.accent.500',
              },
              brand: {
                subtle: 'atomic.color.accent.500',
                default: 'atomic.color.accent.500',
                emphasis: 'atomic.color.accent.500',
              },
            },
            border: {
              default: {
                subtle: 'atomic.color.accent.500',
                default: 'atomic.color.accent.500',
                emphasis: 'atomic.color.accent.500',
              },
            },
          },
        },
      };

      const css = themeToCSS(theme);
      expect(css).toContain(':root');
      // white 폴백: pure white
      expect(css).toContain('--bg-primary-foreground: oklch(1 0 0)');
      expect(css).toContain('--action-primary-text: oklch(1 0 0)');
      // 텍스트 하드코딩 폴백
      expect(css).toContain('--text-primary: oklch(0.12 0.01 0)');
    });
  });

  describe('linear-minimal-v1 integration', () => {
    it('should match SPEC requirements for token naming', () => {
      const linearMinimal = {
        id: 'linear-minimal-v1',
        name: 'Linear Minimal',
        schemaVersion: '2.1',
        tokens: {
          atomic: {
            color: {
              brand: { '500': { l: 0.55, c: 0.12, h: 265 } },
              neutral: {
                '50': { l: 0.99, c: 0.005, h: 265 },
                '500': { l: 0.6, c: 0.03, h: 265 },
                '900': { l: 0.2, c: 0.04, h: 265 },
              },
              white: { l: 1, c: 0, h: 0 },
            },
            spacing: { '1': '4px' },
            radius: { md: '6px' },
          },
          semantic: {
            background: {
              canvas: 'atomic.color.neutral.50',
              surface: {
                default: 'atomic.color.white',
                subtle: 'atomic.color.neutral.50',
                emphasis: 'atomic.color.neutral.50',
              },
              brand: {
                default: 'atomic.color.brand.500',
                subtle: 'atomic.color.brand.500',
                emphasis: 'atomic.color.brand.500',
              },
            },
            border: {
              default: {
                default: 'atomic.color.neutral.50',
                subtle: 'atomic.color.neutral.50',
                emphasis: 'atomic.color.neutral.50',
              },
            },
          },
        },
      } as ThemeDefinition;

      const css = themeToCSS(linearMinimal);

      // SPEC-UI-001 requirements: All tokens must follow --* pattern
      const tektonTokenPattern = /--[a-z-]+:/g;
      const matches = css.match(tektonTokenPattern);

      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThan(0);

      // No hardcoded colors should exist (except in fallbacks)
      expect(css).not.toContain('#');
      expect(css).not.toMatch(/rgb\(/);
      expect(css).not.toMatch(/hsl\(/);
    });
  });
});
