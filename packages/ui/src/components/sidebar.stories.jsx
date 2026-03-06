/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
  SidebarSection,
  SidebarFooter,
} from './sidebar';
import { Badge } from './badge';
const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Sidebar visual style variant',
    },
    size: {
      control: 'select',
      options: ['default', 'compact', 'expanded'],
      description: 'Sidebar width size',
    },
    collapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed',
    },
  },
};
export default meta;
/**
 * Default sidebar with navigation items
 */
export const Default = {
  render: () => (
    <div className="h-screen">
      <Sidebar>
        <SidebarHeader>
          <span className="text-xl font-bold">Logo</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarItem icon="🏠" active>
            Dashboard
          </SidebarItem>
          <SidebarItem icon="📊">Analytics</SidebarItem>
          <SidebarItem icon="👥">Users</SidebarItem>
          <SidebarItem icon="⚙️">Settings</SidebarItem>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};
/**
 * Dashboard example with collapsible sections
 * Accessibility: Sections have aria-expanded attribute
 */
export const DashboardExample = {
  render: () => (
    <div className="h-screen">
      <Sidebar>
        <SidebarHeader>
          <span className="text-xl font-bold text-[var(--bg-primary)]">Tekton</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarItem icon="🏠" active>
            Overview
          </SidebarItem>

          <SidebarSection title="Analytics">
            <SidebarItem icon="📊">Dashboard</SidebarItem>
            <SidebarItem icon="📈" badge={<Badge variant="secondary">New</Badge>}>
              Reports
            </SidebarItem>
            <SidebarItem icon="🎯">Goals</SidebarItem>
          </SidebarSection>

          <SidebarSection title="Management">
            <SidebarItem icon="👥" badge={<Badge>12</Badge>}>
              Users
            </SidebarItem>
            <SidebarItem icon="🏢">Teams</SidebarItem>
            <SidebarItem icon="📋">Projects</SidebarItem>
          </SidebarSection>

          <SidebarSection title="Settings">
            <SidebarItem icon="⚙️">General</SidebarItem>
            <SidebarItem icon="🔒">Security</SidebarItem>
            <SidebarItem icon="💳">Billing</SidebarItem>
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem icon="👤">Profile</SidebarItem>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
};
/**
 * Collapsed sidebar for mobile responsive design
 * Accessibility: Maintains keyboard navigation when collapsed
 */
export const Collapsed = {
  render: () => (
    <div className="h-screen">
      <Sidebar collapsed>
        <SidebarHeader>
          <span className="text-xl">T</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarItem icon="🏠" aria-label="Dashboard" />
          <SidebarItem icon="📊" aria-label="Analytics" />
          <SidebarItem icon="👥" aria-label="Users" />
          <SidebarItem icon="⚙️" aria-label="Settings" />
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};
/**
 * Compact variant with minimal styling
 */
export const Compact = {
  render: () => (
    <div className="h-screen">
      <Sidebar variant="compact">
        <SidebarHeader>
          <span className="font-semibold">App</span>
        </SidebarHeader>
        <SidebarContent spacing="compact">
          <SidebarItem icon="🏠">Home</SidebarItem>
          <SidebarItem icon="📁">Files</SidebarItem>
          <SidebarItem icon="⭐">Favorites</SidebarItem>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};
/**
 * Expanded sidebar for desktop
 */
export const Expanded = {
  render: () => (
    <div className="h-screen">
      <Sidebar size="expanded">
        <SidebarHeader>
          <span className="text-2xl font-bold">Application</span>
        </SidebarHeader>
        <SidebarContent spacing="relaxed">
          <SidebarItem icon="🏠" active>
            Dashboard Overview
          </SidebarItem>
          <SidebarItem icon="📊">Analytics & Reports</SidebarItem>
          <SidebarItem icon="👥" badge={<Badge>5 online</Badge>}>
            Team Members
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
};
/**
 * Interactive toggle example
 */
export const WithToggle = {
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <div className="h-screen flex">
        <Sidebar collapsed={collapsed}>
          <SidebarHeader>
            <span className={collapsed ? 'text-sm' : 'text-xl font-bold'}>
              {collapsed ? 'T' : 'Tekton'}
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarItem
              icon="☰"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {!collapsed && 'Toggle'}
            </SidebarItem>
            <SidebarItem icon="🏠" aria-label="Dashboard">
              {!collapsed && 'Dashboard'}
            </SidebarItem>
            <SidebarItem icon="📊" aria-label="Analytics">
              {!collapsed && 'Analytics'}
            </SidebarItem>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8 bg-[var(--bg-muted)]">
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p className="mt-4 text-[var(--text-muted-foreground)]">
            Toggle the sidebar using the button
          </p>
        </main>
      </div>
    );
  },
};
/**
 * Import React for useState
 */
import * as React from 'react';
//# sourceMappingURL=sidebar.stories.js.map
