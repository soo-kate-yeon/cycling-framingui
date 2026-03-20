const LEGACY_TIER_LABELS: Record<string, string> = {
  single: 'Legacy Single Access',
  double: 'Legacy Double Access',
  creator: 'Legacy All Access',
};

export function formatLegacyTierLabel(tier: string): string {
  return LEGACY_TIER_LABELS[tier] ?? tier;
}
