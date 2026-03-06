/**
 * Preset Panel Component
 * [SPEC-UI-003][TAG-UI003-050]
 *
 * 컬러/타이포그래피/spacing 프리셋 선택 패널
 */

'use client';

import { useTheme } from '../../contexts/ThemeContext';
import { colorPresets, typographyPresets, spacingPresets } from '../../lib/presets';
import type { ThemePreset } from '../../lib/types/theme';

// ============================================================================
// Types
// ============================================================================

interface PresetPanelProps {
  /** 추가 className */
  className?: string;
}

interface PresetSectionProps {
  title: string;
  presets: ThemePreset[];
  selectedId: string;
  onSelect: (id: string) => void;
}

// ============================================================================
// Preset Section Component
// ============================================================================

function PresetSection({ title, presets, selectedId, onSelect }: PresetSectionProps) {
  return (
    <div className="preset-section" style={{ marginBottom: 'var(--spacing-lg, 16px)' }}>
      <h3
        style={{
          fontSize: 'var(--font-size-sm, 14px)',
          fontWeight: '600',
          color: 'var(--text-foreground, #111827)',
          marginBottom: 'var(--spacing-sm, 8px)',
        }}
      >
        {title}
      </h3>
      <div
        className="preset-options"
        role="radiogroup"
        aria-label={`${title} presets`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xs, 4px)',
        }}
      >
        {presets.map((preset) => {
          const isSelected = preset.id === selectedId;

          return (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(preset.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-sm, 8px) var(--spacing-md, 12px)',
                backgroundColor: isSelected ? 'var(--bg-accent, #f3f4f6)' : 'transparent',
                border: '1px solid',
                borderColor: isSelected
                  ? 'var(--bg-primary, #3b82f6)'
                  : 'var(--border-default, #e5e7eb)',
                borderRadius: 'var(--radius-md, 6px)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm, 14px)',
                fontWeight: isSelected ? '500' : '400',
                color: 'var(--text-foreground, #111827)',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-muted, #f9fafb)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{preset.name}</span>
              {isSelected && (
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-primary, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: 'var(--bg-primary-foreground, #ffffff)',
                  }}
                  aria-label="Selected"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PresetPanel({ className = '' }: PresetPanelProps) {
  const { theme, setColorPreset, setTypographyPreset, setSpacingPreset } = useTheme();

  return (
    <div
      className={`preset-panel ${className}`}
      style={{
        padding: 'var(--spacing-lg, 16px)',
        backgroundColor: 'var(--bg-background, #ffffff)',
        border: '1px solid var(--border-default, #e5e7eb)',
        borderRadius: 'var(--radius-lg, 8px)',
        maxWidth: '320px',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--font-size-base, 16px)',
          fontWeight: '600',
          color: 'var(--text-foreground, #111827)',
          marginBottom: 'var(--spacing-lg, 16px)',
        }}
      >
        Theme Presets
      </h2>

      <PresetSection
        title="Color"
        presets={colorPresets}
        selectedId={theme.colorPreset}
        onSelect={setColorPreset}
      />

      <PresetSection
        title="Typography"
        presets={typographyPresets}
        selectedId={theme.typographyPreset}
        onSelect={setTypographyPreset}
      />

      <PresetSection
        title="Spacing"
        presets={spacingPresets}
        selectedId={theme.spacingPreset}
        onSelect={setSpacingPreset}
      />
    </div>
  );
}
