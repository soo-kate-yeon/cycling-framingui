/**
 * [TAG-001] Sidebar Component - Dashboard navigation sidebar
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: Dashboard navigation with collapsible sections
 * IMPACT: Improves navigation UX for complex applications
 *
 * @framingui/ui - Sidebar Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 *
 * Pattern: Radix UI + CVA + Tekton tokens
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const sidebarVariants = cva(
  'flex flex-col border-r border-[var(--border-default)] bg-[var(--bg-background)] transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        compact: 'shadow-none',
      },
      size: {
        default: 'w-64',
        compact: 'w-16',
        expanded: 'w-80',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const sidebarHeaderVariants = cva(
  'flex items-center gap-[var(--spacing-2)] border-b border-[var(--border-default)] bg-[var(--bg-card)] p-[var(--spacing-4)]',
  {
    variants: {
      size: {
        default: 'h-16',
        compact: 'h-16 justify-center',
        expanded: 'h-20',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const sidebarContentVariants = cva('flex-1 overflow-y-auto p-[var(--spacing-4)]', {
  variants: {
    spacing: {
      default: 'space-y-[var(--spacing-2)]',
      compact: 'space-y-[var(--spacing-1)]',
      relaxed: 'space-y-[var(--spacing-4)]',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

const sidebarItemVariants = cva(
  'flex w-full items-center gap-[var(--spacing-3)] rounded-[var(--radius-md)] px-[var(--spacing-3)] py-[var(--spacing-2)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'text-[var(--bg-foreground)] hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)]',
        active:
          'bg-[var(--bg-primary)] text-[var(--bg-primary-foreground)] hover:bg-[var(--bg-primary)]/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const sidebarSectionVariants = cva('space-y-[var(--spacing-1)]', {
  variants: {},
});

const sidebarSectionTitleVariants = cva(
  'px-[var(--spacing-3)] py-[var(--spacing-2)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted-foreground)]',
  {
    variants: {},
  }
);

const sidebarFooterVariants = cva('border-t border-[var(--border-default)] p-[var(--spacing-4)]', {
  variants: {},
});

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  /**
   * 컴포넌트가 접혀있는지 여부
   * @default false
   */
  collapsed?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, size, collapsed, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(sidebarVariants({ variant, size: collapsed ? 'compact' : size, className }))}
        role="navigation"
        aria-label="Main sidebar navigation"
        {...props}
      />
    );
  }
);
Sidebar.displayName = 'Sidebar';

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarHeaderVariants> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, size, ...props }, ref) => {
    return <div ref={ref} className={cn(sidebarHeaderVariants({ size, className }))} {...props} />;
  }
);
SidebarHeader.displayName = 'SidebarHeader';

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarContentVariants> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, spacing, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(sidebarContentVariants({ spacing, className }))} {...props} />
    );
  }
);
SidebarContent.displayName = 'SidebarContent';

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof sidebarItemVariants> {
  /**
   * 아이템 앞에 표시될 아이콘
   */
  icon?: React.ReactNode;
  /**
   * 아이템 뒤에 표시될 배지
   */
  badge?: React.ReactNode;
  /**
   * 현재 활성화된 아이템인지 여부
   * @default false
   */
  active?: boolean;
}

const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ className, variant, icon, badge, children, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(sidebarItemVariants({ variant: active ? 'active' : variant, className }))}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-1 truncate text-left">{children}</span>
        {badge && <span className="flex-shrink-0">{badge}</span>}
      </button>
    );
  }
);
SidebarItem.displayName = 'SidebarItem';

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 섹션 제목
   */
  title?: string;
  /**
   * 섹션이 접혀있는지 여부
   * @default false
   */
  collapsed?: boolean;
}

const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ className, title, collapsed, children, ...props }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(collapsed ?? false);

    React.useEffect(() => {
      if (collapsed !== undefined) {
        setIsCollapsed(collapsed);
      }
    }, [collapsed]);

    return (
      <div ref={ref} className={cn(sidebarSectionVariants({ className }))} {...props}>
        {title && (
          <button
            className={cn(
              sidebarSectionTitleVariants(),
              'w-full text-left hover:text-[var(--bg-foreground)] transition-colors'
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
          >
            <span className="flex items-center justify-between">
              {title}
              <span
                className={cn('transition-transform', isCollapsed ? 'rotate-0' : 'rotate-90')}
                aria-hidden="true"
              >
                ›
              </span>
            </span>
          </button>
        )}
        {!isCollapsed && <div className="space-y-[var(--spacing-1)]">{children}</div>}
      </div>
    );
  }
);
SidebarSection.displayName = 'SidebarSection';

const SidebarSectionTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(sidebarSectionTitleVariants({ className }))} {...props} />;
  }
);
SidebarSectionTitle.displayName = 'SidebarSectionTitle';

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn(sidebarFooterVariants({ className }))} {...props} />;
  }
);
SidebarFooter.displayName = 'SidebarFooter';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
  SidebarSection,
  SidebarSectionTitle,
  SidebarFooter,
  sidebarVariants,
};
