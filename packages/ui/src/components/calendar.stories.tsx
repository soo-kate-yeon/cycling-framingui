/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './calendar';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default calendar with single date selection
 * Accessibility: Fully keyboard navigable with arrow keys
 */
export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-[var(--radius-md)]"
        />
        {date && (
          <div className="border-t border-[var(--border-border)] p-3 text-center text-sm text-[var(--text-muted-foreground)]">
            Selected: {date.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Range selection calendar
 * Accessibility: Supports keyboard range selection
 */
export const RangeSelection: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-[var(--radius-md)]"
          numberOfMonths={2}
        />
        {dateRange && (dateRange.from || dateRange.to) && (
          <div className="border-t border-[var(--border-border)] p-3 text-center text-sm text-[var(--text-muted-foreground)]">
            {dateRange.from && `From: ${dateRange.from.toLocaleDateString()}`}
            {dateRange.from && dateRange.to && ' - '}
            {dateRange.to && `To: ${dateRange.to.toLocaleDateString()}`}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Multiple date selection
 */
export const MultipleSelection: Story = {
  render: () => {
    const [dates, setDates] = useState<Date[] | undefined>([]);

    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-[var(--radius-md)]"
        />
        {dates && dates.length > 0 && (
          <div className="border-t border-[var(--border-border)] p-3 text-sm text-[var(--text-muted-foreground)]">
            <div className="mb-1 font-medium">Selected dates ({dates.length}):</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {dates.map((date, i) => (
                <div key={i}>• {date.toLocaleDateString()}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Calendar with disabled dates
 */
export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    const disabledDays = [
      { from: new Date(2024, 0, 1), to: new Date(2024, 0, 5) },
      new Date(2024, 0, 15),
      { dayOfWeek: [0, 6] }, // Disable weekends
    ];

    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDays}
          className="rounded-[var(--radius-md)]"
        />
        <div className="border-t border-[var(--border-border)] p-3 text-sm text-[var(--text-muted-foreground)]">
          Weekends and specific dates are disabled
        </div>
      </div>
    );
  },
};

/**
 * Calendar with min and max dates
 */
export const WithMinMaxDates: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    const today = new Date();
    const oneMonthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: today, after: oneMonthFromNow }}
          className="rounded-[var(--radius-md)]"
        />
        <div className="border-t border-[var(--border-border)] p-3 text-sm text-[var(--text-muted-foreground)]">
          Only dates within the next month can be selected
        </div>
      </div>
    );
  },
};

/**
 * Compact calendar without outside days
 */
export const Compact: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          showOutsideDays={false}
          className="rounded-[var(--radius-md)]"
        />
      </div>
    );
  },
};

/**
 * Two month calendar
 */
export const TwoMonths: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="rounded-[var(--radius-md)]"
        />
      </div>
    );
  },
};

/**
 * Calendar with footer
 */
export const WithFooter: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-[var(--radius-md)]"
          footer={
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={() => setDate(new Date())}
                className="rounded-[var(--radius-md)] bg-[var(--bg-primary)] px-3 py-1 text-sm text-[var(--bg-primary-foreground)] hover:bg-[var(--bg-primary)]/90"
              >
                Today
              </button>
              <button
                onClick={() => setDate(undefined)}
                className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-background)] px-3 py-1 text-sm hover:bg-[var(--bg-accent)]"
              >
                Clear
              </button>
            </div>
          }
        />
        {date && (
          <div className="border-t border-[var(--border-border)] p-3 text-center text-sm text-[var(--text-muted-foreground)]">
            {date.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Controlled calendar example
 */
export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const handlePrevMonth = () => {
      if (date) {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - 1);
        setDate(newDate);
      }
    };

    const handleNextMonth = () => {
      if (date) {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);
        setDate(newDate);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2 justify-center">
          <button
            onClick={handlePrevMonth}
            className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-background)] px-3 py-1 text-sm hover:bg-[var(--bg-accent)]"
          >
            Previous Month
          </button>
          <button
            onClick={handleNextMonth}
            className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-background)] px-3 py-1 text-sm hover:bg-[var(--bg-accent)]"
          >
            Next Month
          </button>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-border)] bg-[var(--bg-card)]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={date}
            onMonthChange={setDate}
            className="rounded-[var(--radius-md)]"
          />
        </div>
      </div>
    );
  },
};
