/**
 * [TAG-005] Calendar Component - Date selection component
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: Provides accessible date selection with keyboard navigation
 * IMPACT: Improves date input UX and accessibility compliance
 *
 * @framingui - Calendar Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 *
 * Pattern: react-day-picker + CVA + Tekton tokens
 */
// eslint-disable-next-line no-unused-vars
import { DayPicker } from 'react-day-picker';
import { cn } from '../lib/utils';
function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium text-[var(--bg-foreground)]',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-[var(--bg-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)] h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-[var(--text-muted-foreground)] rounded-[var(--radius-md)] w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-[var(--radius-md)] [&:has([aria-selected].day-outside)]:bg-[var(--bg-accent)]/50 [&:has([aria-selected])]:bg-[var(--bg-accent)] first:[&:has([aria-selected])]:rounded-l-[var(--radius-md)] last:[&:has([aria-selected])]:rounded-r-[var(--radius-md)] focus-within:relative focus-within:z-20',
        day: cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-[var(--bg-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[var(--bg-accent)] hover:text-[var(--bg-accent-foreground)] h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-[var(--bg-primary)] text-[var(--bg-primary-foreground)] hover:bg-[var(--bg-primary)] hover:text-[var(--bg-primary-foreground)] focus:bg-[var(--bg-primary)] focus:text-[var(--bg-primary-foreground)]',
        day_today: 'bg-[var(--bg-accent)] text-[var(--bg-accent-foreground)]',
        day_outside:
          'day-outside text-[var(--text-muted-foreground)] opacity-50 aria-selected:bg-[var(--bg-accent)]/50 aria-selected:text-[var(--text-muted-foreground)] aria-selected:opacity-30',
        day_disabled: 'text-[var(--text-muted-foreground)] opacity-50',
        day_range_middle:
          'aria-selected:bg-[var(--bg-accent)] aria-selected:text-[var(--bg-accent-foreground)]',
        day_hidden: 'invisible',
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
//# sourceMappingURL=calendar.js.map
