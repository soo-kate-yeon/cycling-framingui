/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */
import * as React from 'react';
import { Textarea } from './textarea';
import { Label } from './label';
const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable textarea interaction',
    },
  },
};
export default meta;
/**
 * Default textarea
 */
export const Default = {
  args: {
    placeholder: 'Type your message here.',
  },
};
/**
 * With label
 * Accessibility: Always associate textareas with labels
 */
export const WithLabel = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
};
/**
 * With helper text
 */
export const WithHelperText = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-2">Your message</Label>
      <Textarea placeholder="Type your message here." id="message-2" />
      <p className="text-sm text-[var(--bg-muted-foreground)]">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
};
/**
 * Disabled state
 * Accessibility: Disabled textareas are not keyboard accessible
 */
export const Disabled = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="disabled" className="opacity-70">
        Message (Disabled)
      </Label>
      <Textarea
        placeholder="Type your message here."
        id="disabled"
        disabled
        value="This textarea is disabled."
      />
    </div>
  ),
};
/**
 * With error state
 */
export const WithError = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-error">Your message</Label>
      <Textarea
        placeholder="Type your message here."
        id="message-error"
        className="border-[var(--bg-destructive)]"
        aria-invalid="true"
        aria-describedby="message-error-text"
      />
      <p id="message-error-text" className="text-sm text-[var(--bg-destructive)]">
        Your message must be at least 10 characters.
      </p>
    </div>
  ),
};
/**
 * Custom height
 */
export const CustomHeight = {
  render: () => (
    <div className="space-y-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message-small">Small (min-h-20)</Label>
        <Textarea placeholder="Small textarea" id="message-small" className="min-h-[60px]" />
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="message-large">Large (min-h-40)</Label>
        <Textarea placeholder="Large textarea" id="message-large" className="min-h-[160px]" />
      </div>
    </div>
  ),
};
/**
 * With character count
 */
export const WithCharacterCount = {
  render: () => {
    const [value, setValue] = React.useState('');
    const maxLength = 200;
    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          placeholder="Tell us about yourself"
          id="bio"
          value={value}
          onChange={e => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <p className="text-sm text-[var(--bg-muted-foreground)] text-right">
          {value.length}/{maxLength}
        </p>
      </div>
    );
  },
};
/**
 * Form example
 */
export const FormExample = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <input
          type="text"
          id="subject"
          placeholder="Enter subject"
          className="flex h-10 w-full rounded-md border border-[var(--border-input)] bg-transparent px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="message-form">Message</Label>
        <Textarea placeholder="Enter your message" id="message-form" rows={5} />
      </div>
      <button className="inline-flex items-center justify-center rounded-md bg-[var(--bg-primary)] px-4 py-2 text-sm font-medium text-[var(--bg-primary-foreground)]">
        Send Message
      </button>
    </div>
  ),
};
/**
 * Resizable
 */
export const Resizable = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="resizable">Resizable Textarea</Label>
      <Textarea placeholder="This textarea can be resized" id="resizable" className="resize" />
    </div>
  ),
};
/**
 * Fixed size (non-resizable)
 */
export const FixedSize = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="fixed">Fixed Size Textarea</Label>
      <Textarea placeholder="This textarea cannot be resized" id="fixed" className="resize-none" />
    </div>
  ),
};
//# sourceMappingURL=textarea.stories.js.map
