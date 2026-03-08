/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { Label } from './label';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable switch interaction',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default switch
 * Accessibility: Always pair with a label for screen readers
 */
export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode" className="cursor-pointer">
        Airplane Mode
      </Label>
    </div>
  ),
};

/**
 * Checked state
 */
export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications" className="cursor-pointer">
        Enable Notifications
      </Label>
    </div>
  ),
};

/**
 * Disabled states
 * Accessibility: Disabled switches are not keyboard accessible
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off" className="cursor-not-allowed opacity-70">
          Disabled (Off)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on" className="cursor-not-allowed opacity-70">
          Disabled (On)
        </Label>
      </div>
    </div>
  ),
};

/**
 * Settings form example
 */
export const SettingsForm: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing-emails" className="cursor-pointer">
              Marketing emails
            </Label>
            <p className="text-sm text-[var(--bg-muted-foreground)]">
              Receive emails about new products and features.
            </p>
          </div>
          <Switch id="marketing-emails" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="security-emails" className="cursor-pointer">
              Security emails
            </Label>
            <p className="text-sm text-[var(--bg-muted-foreground)]">
              Receive emails about your account security.
            </p>
          </div>
          <Switch id="security-emails" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="newsletter" className="cursor-pointer">
              Newsletter
            </Label>
            <p className="text-sm text-[var(--bg-muted-foreground)]">
              Receive our weekly newsletter.
            </p>
          </div>
          <Switch id="newsletter" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Privacy settings
 */
export const PrivacySettings: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4 rounded-lg border p-4">
      <div>
        <h3 className="text-lg font-semibold">Privacy Settings</h3>
        <p className="text-sm text-[var(--bg-muted-foreground)]">Manage your privacy preferences</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="public-profile" className="cursor-pointer">
            Public profile
          </Label>
          <Switch id="public-profile" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-email" className="cursor-pointer">
            Show email address
          </Label>
          <Switch id="show-email" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="activity-status" className="cursor-pointer">
            Show activity status
          </Label>
          <Switch id="activity-status" defaultChecked />
        </div>
      </div>
    </div>
  ),
};

/**
 * Controlled switch with state
 */
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="controlled" checked={checked} onCheckedChange={setChecked} />
          <Label htmlFor="controlled" className="cursor-pointer">
            {checked ? 'Enabled' : 'Disabled'}
          </Label>
        </div>
        <p className="text-sm text-[var(--bg-muted-foreground)]">
          Current state: {checked ? 'ON' : 'OFF'}
        </p>
      </div>
    );
  },
};

/**
 * Multiple switches
 */
export const Multiple: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch id="wifi" defaultChecked />
        <Label htmlFor="wifi" className="cursor-pointer">
          Wi-Fi
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="bluetooth" />
        <Label htmlFor="bluetooth" className="cursor-pointer">
          Bluetooth
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="location" defaultChecked />
        <Label htmlFor="location" className="cursor-pointer">
          Location Services
        </Label>
      </div>
    </div>
  ),
};
