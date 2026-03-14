import type {
  BgTokens,
  FgTokens,
  RadiusTokens,
  ShadowTokens,
  SpacingTokens,
  TypographyTokens,
} from '@framingui/tokens';

export interface ReactNativeTokenContract {
  bg: {
    canvas: BgTokens['surface']['default'];
    muted: BgTokens['surface']['sunken'];
    accent: BgTokens['primary']['default'];
    danger: BgTokens['destructive']['default'];
  };
  fg: {
    primary: FgTokens['primary'];
    secondary: FgTokens['secondary'];
    muted: FgTokens['muted'];
    inverse: FgTokens['inverse'];
    accent: FgTokens['link'];
    danger: FgTokens['error'];
  };
  spacing: {
    0: SpacingTokens[0];
    1: SpacingTokens[1];
    2: SpacingTokens[2];
    3: SpacingTokens[3];
    4: SpacingTokens[4];
    5: SpacingTokens[5];
    6: SpacingTokens[6];
    8: SpacingTokens[8];
    10: SpacingTokens[10];
    12: SpacingTokens[12];
  };
  radius: {
    sm: RadiusTokens['sm'];
    md: RadiusTokens['md'];
    lg: RadiusTokens['lg'];
    full: RadiusTokens['full'];
  };
  typography: {
    body: {
      fontSize: TypographyTokens['fontSize']['base'];
      fontWeight: TypographyTokens['fontWeight']['normal'];
      lineHeight: TypographyTokens['lineHeight']['normal'];
    };
    label: {
      fontSize: TypographyTokens['fontSize']['sm'];
      fontWeight: TypographyTokens['fontWeight']['medium'];
      lineHeight: TypographyTokens['lineHeight']['normal'];
    };
    button: {
      fontSize: TypographyTokens['fontSize']['base'];
      fontWeight: TypographyTokens['fontWeight']['semibold'];
      lineHeight: TypographyTokens['lineHeight']['tight'];
    };
    title: {
      fontSize: TypographyTokens['fontSize']['3xl'];
      fontWeight: TypographyTokens['fontWeight']['bold'];
      lineHeight: TypographyTokens['lineHeight']['tight'];
    };
  };
  shadow: {
    card: ShadowTokens['md'];
    focus: ShadowTokens['lg'];
  };
}

export const tokenContract: ReactNativeTokenContract = {
  bg: {
    canvas: 'var(--bg-surface-default)',
    muted: 'var(--bg-surface-sunken)',
    accent: 'var(--bg-primary-default)',
    danger: 'var(--bg-destructive-default)',
  },
  fg: {
    primary: 'var(--fg-primary)',
    secondary: 'var(--fg-secondary)',
    muted: 'var(--fg-muted)',
    inverse: 'var(--fg-inverse)',
    accent: 'var(--fg-link)',
    danger: 'var(--fg-error)',
  },
  spacing: {
    0: 'var(--spacing-0)',
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    full: 'var(--radius-full)',
  },
  typography: {
    body: {
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-normal)',
      lineHeight: 'var(--line-height-normal)',
    },
    label: {
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 'var(--line-height-normal)',
    },
    button: {
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-semibold)',
      lineHeight: 'var(--line-height-tight)',
    },
    title: {
      fontSize: 'var(--font-size-3xl)',
      fontWeight: 'var(--font-weight-bold)',
      lineHeight: 'var(--line-height-tight)',
    },
  },
  shadow: {
    card: 'var(--shadow-md)',
    focus: 'var(--shadow-lg)',
  },
};
