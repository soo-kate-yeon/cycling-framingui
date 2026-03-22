'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@framingui/ui';
import { getThemeThumbnailVars, type ThumbnailVars } from '../../lib/theme-thumbnail-resolver';
import { trackTemplatePromptCopied } from '../../lib/analytics';

// ============================================================================
// Types
// ============================================================================

interface ThemeRecipeCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    descriptionKo?: string;
  };
  copyPromptLabel: string;
}

// ============================================================================
// CSS Variable Injection
// themeToCSS() already provides all component + page tokens correctly.
// We inject them as inline styles so @framingui/ui components render themed.
// ============================================================================

function buildThemeStyle(vars: ThumbnailVars): React.CSSProperties {
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    style[key] = value;
  }
  // Ensure spacing defaults for components that need them
  if (!style['--spacing-1']) {
    style['--spacing-1'] = '0.25rem';
  }
  if (!style['--spacing-3']) {
    style['--spacing-3'] = '0.75rem';
  }
  return style as unknown as React.CSSProperties;
}

// ============================================================================
// Row 1: Color Palette & Typography
// ============================================================================

/**
 * Estimate perceived lightness from an oklch/hex/rgb color string.
 * Returns 0-1 range. Used to pick contrasting text color.
 */
function isLightColor(color: string | undefined): boolean {
  if (!color) {
    return true;
  }
  // oklch(L C H) — L is 0-1 lightness
  const oklch = color.match(/oklch\(([\d.]+)/);
  if (oklch) {
    return parseFloat(oklch[1]!) > 0.65;
  }
  // hex
  const hex = color.match(/^#([0-9a-f]{6})/i);
  if (hex) {
    const r = parseInt(hex[1]!.slice(0, 2), 16);
    const g = parseInt(hex[1]!.slice(2, 4), 16);
    const b = parseInt(hex[1]!.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160;
  }
  return true;
}

function ColorPaletteCell({ vars }: { vars: ThumbnailVars }) {
  const swatches = [
    { label: 'Primary', color: vars['--bg-primary'] },
    { label: 'Background', color: vars['--bg-background'] },
    { label: 'Card', color: vars['--bg-card'] },
    { label: 'Foreground', color: vars['--bg-foreground'] },
    { label: 'Secondary', color: vars['--bg-secondary'] },
    { label: 'Muted', color: vars['--bg-muted'] },
  ];

  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: vars['--text-tertiary'] ?? vars['--bg-muted-foreground'] }}
      >
        Color Palette
      </span>
      <div className="grid grid-cols-3 grid-rows-2 gap-[2px] rounded-lg overflow-hidden">
        {swatches.map((s, i) => {
          const light = isLightColor(s.color);
          const fg = light ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)';
          const fgSub = light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)';
          return (
            <div
              key={s.label}
              className="flex flex-col justify-between p-2.5 h-[72px]"
              style={{ background: s.color }}
            >
              <span className="text-[10px] font-medium leading-tight" style={{ color: fg }}>
                {s.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                  style={{
                    background: fg,
                    color: s.color,
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-[9px] font-mono truncate" style={{ color: fgSub }}>
                  {s.color?.substring(0, 20)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TypographyCell({ vars }: { vars: ThumbnailVars }) {
  const fg = vars['--bg-foreground'] ?? vars['--text-primary'];
  const muted = vars['--bg-muted-foreground'] ?? vars['--text-secondary'];
  const tertiary = vars['--text-tertiary'] ?? muted;

  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: tertiary }}
      >
        Typography
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-4xl font-bold leading-none" style={{ color: fg }}>
          Aa
        </span>
        <span className="text-base font-semibold" style={{ color: fg }}>
          Headline
        </span>
        <span className="text-sm" style={{ color: muted }}>
          Body text sample
        </span>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: tertiary }}>
          LABEL TEXT
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Row 2: Real ComponentGallery components
// ============================================================================

function CardFormCell({ prefix }: { prefix: string }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`${prefix}-name`}>Name</Label>
              <Input id={`${prefix}-name`} placeholder="Name of your project" readOnly />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`${prefix}-framework`}>Framework</Label>
              <Select defaultValue="next">
                <SelectTrigger id={`${prefix}-framework`}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}

function SwitchCell({ prefix }: { prefix: string }) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-4 sm:p-6 grid gap-4 sm:gap-6">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={`${prefix}-airplane`} className="flex flex-col space-y-1">
            <span>Airplane Mode</span>
            <span className="font-normal leading-snug text-[var(--bg-muted-foreground)] text-xs sm:text-sm">
              Turn off all incoming connections.
            </span>
          </Label>
          <Switch id={`${prefix}-airplane`} defaultChecked className="shrink-0" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={`${prefix}-marketing`} className="flex flex-col space-y-1">
            <span>Marketing Emails</span>
            <span className="font-normal leading-snug text-[var(--bg-muted-foreground)] text-xs sm:text-sm">
              Receive emails about new products.
            </span>
          </Label>
          <Switch id={`${prefix}-marketing`} className="shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

function ButtonsCell() {
  return (
    <Card className="shadow-none p-4 sm:p-6 space-y-3">
      <Label className="uppercase tracking-wide text-xs text-[var(--bg-muted-foreground)]">
        Action Buttons
      </Label>
      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </Card>
  );
}

// ============================================================================
// ThemeRecipeCard
// ============================================================================

export function ThemeRecipeCard({ template, copyPromptLabel }: ThemeRecipeCardProps) {
  const [copied, setCopied] = useState(false);
  const vars = getThemeThumbnailVars(template.id);

  if (!vars) {
    return null;
  }

  const themeStyle = buildThemeStyle(vars);

  const handleCopy = async () => {
    const prompt = `Create a screen using the ${template.name} theme with framingui MCP server`;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);

    trackTemplatePromptCopied({
      template_id: template.id,
      template_name: template.name,
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full md:w-[75vw] lg:w-[820px] flex-shrink-0 snap-center rounded-2xl border border-neutral-200 shadow-sm transition-shadow hover:shadow-md overflow-hidden">
      {/* Themed zone — all CSS vars from themeToCSS() injected directly */}
      <div
        className="p-5 sm:p-6"
        style={{
          ...themeStyle,
          background: vars['--bg-background'] ?? vars['--bg-canvas'],
          color: vars['--text-primary'] ?? vars['--bg-foreground'],
        }}
      >
        {/* Row 1: Color Palette + Typography */}
        <div className="grid grid-cols-2 gap-4 md:mb-4">
          <div
            className="p-4 rounded-xl"
            style={{ background: vars['--bg-card'] ?? vars['--bg-surface'] }}
          >
            <ColorPaletteCell vars={vars} />
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ background: vars['--bg-card'] ?? vars['--bg-surface'] }}
          >
            <TypographyCell vars={vars} />
          </div>
        </div>

        {/* Row 2: Card + Switch + Buttons — hidden on mobile, visible on md+ */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardFormCell prefix={template.id} />
          <SwitchCell prefix={template.id} />
          <ButtonsCell />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-white border-t border-neutral-100">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-neutral-900">{template.name}</h3>
          <p className="mt-0.5 text-xs text-neutral-500 truncate">{template.description}</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              {copyPromptLabel}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
