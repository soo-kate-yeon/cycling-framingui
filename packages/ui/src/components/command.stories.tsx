/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

const meta = {
  title: 'Components/Command',
  component: Command,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default command palette
 * Accessibility: Fully keyboard navigable with arrow keys
 */
export const Default: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border border-[var(--border-border)] shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>📅 Calendar</CommandItem>
          <CommandItem>😀 Search Emoji</CommandItem>
          <CommandItem>🧮 Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>👤 Profile</CommandItem>
          <CommandItem>💳 Billing</CommandItem>
          <CommandItem>⚙️ Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Command palette with keyboard shortcuts
 * Accessibility: Shows visual keyboard shortcuts for better UX
 */
export const WithShortcuts: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border border-[var(--border-border)] shadow-md">
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>
            <span>New File</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Open File</span>
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Save</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem>
            <span>Copy</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Paste</span>
            <CommandShortcut>⌘V</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Cut</span>
            <CommandShortcut>⌘X</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Command palette with icons and groups
 */
export const WithGroupsAndIcons: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border border-[var(--border-border)] shadow-md">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Files">
          <CommandItem>
            <span className="mr-2">📄</span>
            <span>New Document</span>
          </CommandItem>
          <CommandItem>
            <span className="mr-2">📁</span>
            <span>New Folder</span>
          </CommandItem>
          <CommandItem>
            <span className="mr-2">📋</span>
            <span>New Template</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem>
            <span className="mr-2">🏠</span>
            <span>Go to Dashboard</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span className="mr-2">📊</span>
            <span>Go to Analytics</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span className="mr-2">⚙️</span>
            <span>Go to Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Dialog variant for modal command palette
 * Accessibility: Traps focus and closes on Escape
 */
export const Dialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen(open => !open);
        }
      };

      document.addEventListener('keydown', down);
      return () => document.removeEventListener('keydown', down);
    }, []);

    return (
      <>
        <div className="text-center">
          <p className="text-sm text-[var(--text-muted-foreground)]">
            Press{' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[var(--border-border)] bg-[var(--bg-muted)] px-1.5 font-mono text-[10px] font-medium text-[var(--text-muted-foreground)] opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>{' '}
            to open the command palette
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-4 rounded-[var(--radius-md)] bg-[var(--bg-primary)] px-4 py-2 text-sm text-[var(--bg-primary-foreground)] hover:bg-[var(--bg-primary)]/90"
          >
            Open Command Palette
          </button>
        </div>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => setOpen(false)}>📅 Calendar</CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>😀 Search Emoji</CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>🧮 Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem onSelect={() => setOpen(false)}>👤 Profile</CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>💳 Billing</CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>⚙️ Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};

/**
 * Compact command palette
 */
export const Compact: Story = {
  render: () => (
    <Command className="w-[350px] rounded-lg border border-[var(--border-border)]">
      <CommandInput placeholder="Quick search..." />
      <CommandList className="max-h-[200px]">
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup>
          <CommandItem>Dashboard</CommandItem>
          <CommandItem>Analytics</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Search with multiple result groups
 */
export const MultipleGroups: Story = {
  render: () => (
    <Command className="w-[500px] rounded-lg border border-[var(--border-border)] shadow-md">
      <CommandInput placeholder="Search everything..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>🏠 Home</CommandItem>
          <CommandItem>📊 Dashboard</CommandItem>
          <CommandItem>👥 Users</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>➕ Create New</CommandItem>
          <CommandItem>📥 Import</CommandItem>
          <CommandItem>📤 Export</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>⚙️ General</CommandItem>
          <CommandItem>🔒 Privacy</CommandItem>
          <CommandItem>🎨 Appearance</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Import React for useState and useEffect
 */
import * as React from 'react';
