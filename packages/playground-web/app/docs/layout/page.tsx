/**
 * Layout Patterns Documentation
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layout Patterns | framingui',
  description: 'Common layout patterns and recipes using FramingUI components.',
};

export default function LayoutPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="text-sm font-medium text-neutral-500">Patterns</div>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Layout Patterns</h1>
        <p className="text-xl text-neutral-600">
          Common layout patterns and compositions using Card, Separator, ScrollArea, and other
          components.
        </p>
      </header>

      {/* Import */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Import</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
          {`import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
  ScrollArea,
} from '@framingui/ui';`}
        </pre>
      </section>

      {/* Basic Card Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Basic Card Layout</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`}
        </pre>
      </section>

      {/* Grid Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Grid Layout</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>Analytics</CardTitle>
      <CardDescription>View your analytics</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">12,345</p>
      <p className="text-sm text-neutral-500">Total Views</p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Users</CardTitle>
      <CardDescription>Active users</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">1,234</p>
      <p className="text-sm text-neutral-500">Online Now</p>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Revenue</CardTitle>
      <CardDescription>Monthly revenue</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">$45,678</p>
      <p className="text-sm text-neutral-500">This Month</p>
    </CardContent>
  </Card>
</div>`}
        </pre>
      </section>

      {/* Sidebar Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Sidebar Layout</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<div className="flex min-h-screen">
  {/* Sidebar */}
  <aside className="w-64 border-r border-[var(--border-default)] bg-[var(--bg-background)]">
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      <nav className="space-y-2">
        <a href="#" className="block px-3 py-2 rounded-lg hover:bg-[var(--bg-muted)]">
          Dashboard
        </a>
        <a href="#" className="block px-3 py-2 rounded-lg hover:bg-[var(--bg-muted)]">
          Projects
        </a>
        <a href="#" className="block px-3 py-2 rounded-lg hover:bg-[var(--bg-muted)]">
          Settings
        </a>
      </nav>
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-8">
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Main content area</p>
        </CardContent>
      </Card>
    </div>
  </main>
</div>`}
        </pre>
      </section>

      {/* Split Panel */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Split Panel Layout</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Left Panel */}
  <Card>
    <CardHeader>
      <CardTitle>Settings</CardTitle>
      <CardDescription>Manage your account settings</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
    </CardContent>
    <CardFooter>
      <Button>Save Changes</Button>
    </CardFooter>
  </Card>

  {/* Right Panel */}
  <Card>
    <CardHeader>
      <CardTitle>Preview</CardTitle>
      <CardDescription>See how your profile looks</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-200" />
          <div>
            <p className="font-semibold">Your Name</p>
            <p className="text-sm text-neutral-500">your@email.com</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>`}
        </pre>
      </section>

      {/* Header-Content-Footer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Header-Content-Footer Layout</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<div className="min-h-screen flex flex-col">
  {/* Header */}
  <header className="border-b border-[var(--border-default)] bg-white">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <h1 className="text-xl font-bold">FramingUI</h1>
      <nav className="flex gap-4">
        <a href="#" className="hover:text-neutral-600">Home</a>
        <a href="#" className="hover:text-neutral-600">About</a>
        <a href="#" className="hover:text-neutral-600">Contact</a>
      </nav>
    </div>
  </header>

  {/* Main Content */}
  <main className="flex-1 container mx-auto px-4 py-8">
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your main content goes here</p>
      </CardContent>
    </Card>
  </main>

  {/* Footer */}
  <footer className="border-t border-[var(--border-default)] bg-neutral-50">
    <div className="container mx-auto px-4 py-6">
      <p className="text-center text-sm text-neutral-500">
        © 2024 FramingUI. All rights reserved.
      </p>
    </div>
  </footer>
</div>`}
        </pre>
      </section>

      {/* Scrollable Area */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Scrollable Content</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<Card>
  <CardHeader>
    <CardTitle>Activity Feed</CardTitle>
    <CardDescription>Recent activity in your workspace</CardDescription>
  </CardHeader>
  <CardContent>
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
            <div>
              <p className="font-medium">Activity {i + 1}</p>
              <p className="text-sm text-neutral-500">
                Description of the activity
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  </CardContent>
</Card>`}
        </pre>
      </section>

      {/* With Separator */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Section with Separators</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<Card>
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    <div>
      <h3 className="font-semibold mb-2">Profile</h3>
      <p className="text-sm text-neutral-600">
        Update your personal information
      </p>
    </div>

    <Separator />

    <div>
      <h3 className="font-semibold mb-2">Security</h3>
      <p className="text-sm text-neutral-600">
        Manage your security preferences
      </p>
    </div>

    <Separator />

    <div>
      <h3 className="font-semibold mb-2">Notifications</h3>
      <p className="text-sm text-neutral-600">
        Control how you receive notifications
      </p>
    </div>
  </CardContent>
</Card>`}
        </pre>
      </section>

      {/* Responsive Columns */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Responsive Column Layout</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main Content - 2/3 on large screens */}
  <div className="lg:col-span-2 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Main Content</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your primary content area takes up 2/3 of the width on large screens</p>
      </CardContent>
    </Card>
  </div>

  {/* Sidebar - 1/3 on large screens */}
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Sidebar</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Secondary content or widgets</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Another Widget</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Additional sidebar content</p>
      </CardContent>
    </Card>
  </div>
</div>`}
        </pre>
      </section>

      {/* Real World Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Real World Examples</h2>

        <h3 className="text-lg font-semibold text-neutral-700 mt-6">Dashboard Layout</h3>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`import { Card, CardHeader, CardTitle, CardContent, Separator } from '@framingui/ui';
import { BarChart, Users, DollarSign, TrendingUp } from 'lucide-react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-neutral-500">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                Active Users
              </CardTitle>
              <Users className="w-4 h-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-neutral-500">+180.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                Sales
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-neutral-500">+19% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                Conversion
              </CardTitle>
              <BarChart className="w-4 h-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-neutral-500">+0.5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-neutral-400">
                Chart placeholder
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {/* Sales items */}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}`}
        </pre>

        <h3 className="text-lg font-semibold text-neutral-700 mt-6">Settings Page Layout</h3>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-neutral-500">
                  Receive email updates
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-neutral-500">
                  Receive marketing communications
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`}
        </pre>

        <h3 className="text-lg font-semibold text-neutral-700 mt-6">Application Shell</h3>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-xl font-bold">FramingUI</h1>
        </div>

        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-800"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800"
            >
              <Users className="w-4 h-4" />
              Users
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800"
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-700" />
            <div className="text-sm">
              <p className="font-medium">John Doe</p>
              <p className="text-neutral-400">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">Page Title</h2>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}`}
        </pre>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Best Practices</h2>
        <div className="space-y-4 text-neutral-600">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Responsive Design</h3>
            <p>
              Use Tailwind's responsive modifiers (sm:, md:, lg:) to adapt layouts across screen
              sizes. Start with mobile-first approach and enhance for larger screens.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Spacing</h3>
            <p>
              Use consistent spacing with Tekton spacing tokens (--spacing-*) or Tailwind's
              gap and padding utilities for predictable layouts.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Semantic Structure</h3>
            <p>
              Use semantic HTML elements (header, main, aside, footer) to improve accessibility and
              SEO while organizing your layout.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Overflow Handling</h3>
            <p>
              Use ScrollArea for fixed-height containers with overflow content to maintain
              consistent layouts and provide accessible scrolling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
