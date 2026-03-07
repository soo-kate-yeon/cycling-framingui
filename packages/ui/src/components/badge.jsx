/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 * @framingui - Badge Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
const badgeVariants = cva(
  'inline-flex items-center rounded-[var(--radius-full)] border px-[var(--spacing-3)] py-[var(--spacing-1)] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border-ring)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--bg-primary)] text-[var(--bg-primary-foreground)] hover:bg-[var(--bg-primary)]/80',
        secondary:
          'border-transparent bg-[var(--bg-secondary)] text-[var(--bg-secondary-foreground)] hover:bg-[var(--bg-secondary)]/80',
        destructive:
          'border-transparent bg-[var(--bg-destructive)] text-[var(--bg-destructive-foreground)] hover:bg-[var(--bg-destructive)]/80',
        outline: 'text-[var(--bg-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { Badge, badgeVariants };
//# sourceMappingURL=badge.js.map
