/**
 * [TAG-005] Calendar Component - Date selection component
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: Provides accessible date selection with keyboard navigation
 * IMPACT: Improves date input UX and accessibility compliance
 *
 * @framingui/ui - Calendar Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 *
 * Pattern: react-day-picker v9 + Tekton tokens
 */

import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { cn } from '../lib/utils';

export type CalendarProps = DayPickerProps;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
        month: 'space-y-4 w-full',
        caption: 'relative flex justify-center items-center h-9 w-full',
        month_caption: 'flex items-center',
        caption_label: 'text-sm font-black text-[var(--bg-foreground)]',
        nav: 'absolute inset-0 flex items-center justify-between pointer-events-none z-10 px-2',
        button_previous: cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-[var(--bg-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)]',
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 pointer-events-auto'
        ),
        button_next: cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-[var(--bg-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)]',
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 pointer-events-auto'
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex w-full',
        weekday:
          'text-[var(--bg-muted-foreground)] rounded-[var(--radius-md)] flex-1 font-normal text-[0.8rem] text-center',
        week: 'flex w-full mt-2',
        day: 'flex-1 aspect-square text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-[var(--radius-md)] [&:has([aria-selected].day-outside)]:bg-[var(--bg-accent)]/50 [&:has([aria-selected])]:bg-[var(--bg-accent)] first:[&:has([aria-selected])]:rounded-l-[var(--radius-md)] last:[&:has([aria-selected])]:rounded-r-[var(--radius-md)] focus-within:relative focus-within:z-20',
        day_button: cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-[var(--bg-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          'hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)]',
          'h-full w-full p-0 font-normal aria-selected:opacity-100'
        ),
        range_end: 'day-range-end',
        selected:
          'rounded-[var(--radius-md)] bg-[var(--bg-primary)] text-[var(--bg-primary-foreground)] hover:bg-[var(--bg-primary)] hover:text-[var(--bg-primary-foreground)] focus:bg-[var(--bg-primary)] focus:text-[var(--bg-primary-foreground)]',
        today:
          'rounded-[var(--radius-md)] bg-[var(--bg-accent)] text-[var(--bg-accent-foreground)]',
        outside:
          'day-outside text-[var(--bg-muted-foreground)] opacity-50 aria-selected:bg-[var(--bg-accent)]/50 aria-selected:text-[var(--bg-muted-foreground)] aria-selected:opacity-30',
        disabled: 'text-[var(--bg-muted-foreground)] opacity-50',
        range_middle:
          'aria-selected:bg-[var(--bg-accent)] aria-selected:text-[var(--bg-accent-foreground)]',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') {
            return (
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            );
          }
          return (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
