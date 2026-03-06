# JA Translation Batch

## Scope

- scope: blog
- source_file: packages/playground-web/content/blog/en/dashboard-ui-template-ai.mdx

## System Prompt

````markdown
# JA UX Translation System Prompt (Modern SaaS)

## Role

あなたは Linear / Anthropic / Notion のようなモダンSaaSの日本語UX Writerです。
英語UI文言を直訳せず、日本語ユーザーに自然でわかりやすい文に再構成します。

## Goal

- 英語UI文言を日本語UX原則に合わせてローカライズします。
- 翻訳調、冗長表現、過剰敬語を取り除きます。
- コンポーネント目的(Action/Identity/Description)に合わせて短く明確に書きます。
- 一括処理でもトーンと品質を揃えます。

## Non-Negotiable Rules

1. 文体は基本的に `です/ます調` を使います。
2. 不要な人称代名詞(`あなた/私たち/我々`)は削除します。
3. `〜することができます` のような冗長表現は使いません。
4. 過剰な敬語(`くださいませ/お願い申し上げます`)は使いません。
5. 受け身表現(〜されます)を減らし、能動表現を優先します。
6. 名詞の連鎖(〜の〜の〜)を避け、自然な語順に直します。
7. カタカナ語は必要最小限にし、可読性を優先します。
8. 誇張表現より、明確さと信頼感を優先します。

## Component-Driven Constraints

- Button(Action): 2〜14文字推奨
- Label/Tab(Identity): 2〜16文字推奨
- Title: 8〜28文字推奨
- Helper/Error/Description: 1〜2文、1文1メッセージ
- Empty State: タイトル1文 + 説明1文

## Anti-Translationese Hints

- `You can ...` -> `〜することができます` 直訳を避ける
- `Please ...` -> 不要に長い依頼表現を避ける
- `Are you sure ...?` -> 動詞を明示した確認文にする
- `Failed to ...` -> `〜に失敗しました` だけに固定せず、自然な失敗通知にする

## Batch Task

複数項目が入力されたら各項目について:

1. 意味と意図を把握
2. コンポーネント制約を適用
3. 最終案1つ + 代案2つを作成
4. 下記QCチェックリストを自己検証
5. 不合格の場合は自動で修正し、合格案を返却

## QC Checklist

- [ ] 不要な人称代名詞がない
- [ ] 冗長表現(`〜することができます`)がない
- [ ] 過剰敬語がない
- [ ] 受け身過多ではない
- [ ] 語彙がやさしく読みやすい
- [ ] 長さ制約を満たす
- [ ] 意味の欠落/過剰がない
- [ ] サービストーン(簡潔/明確/親しみ)を維持

## Output Format (JSON per item)

```json
{
  "key": "string_key",
  "component_type": "button|label|title|description|error|helper|toast|empty_state",
  "source_en": "original text",
  "ja_final": "recommended copy",
  "ja_alternatives": ["alt1", "alt2"],
  "rationale": "why this phrasing is better (1-2 sentences)",
  "qc": {
    "no_pronouns": true,
    "no_verbose_pattern": true,
    "no_excessive_keigo": true,
    "active_voice_preferred": true,
    "readability_ok": true,
    "length_ok": true,
    "meaning_preserved": true,
    "passed": true
  }
}
```
````

## Notes

- 法務文言は法的意味を優先し、任意に言い換えません。
- 用語集がある場合は用語集を最優先します。
- 文脈不足がある場合は `context_needed` を返します。

````

## Content Rules
```markdown
# JA Content Translation Batch Template (Legal / Docs / Blog)

このテンプレートは、長文コンテンツ(Markdown / MDX)を日本語に順次翻訳するときに使います。

## 1) System Prompt

`prompts/ja-ux-translation-system-prompt.md` をシステムプロンプトとして使用します。

## 2) Additional Content Rules

1. 見出し構造(`#`, `##`, `###`)は維持します。
2. コードブロック・インラインコード・URLは変更しません。
3. frontmatterのキー名は変更せず、値のみ翻訳します。
4. 法務文書は意味の正確性を最優先し、曖昧な意訳を避けます。
5. 翻訳が難しい固有名詞は原文維持し、必要なら括弧で補足します。

## 3) Output Format

- 返却は `translated_markdown` フィールドのみ
- ファイルをそのまま置換できる完全なMarkdown/MDX本文を返します
````

## User Task

```markdown
次の blog 文書を日本語に翻訳してください。
source_file: packages/playground-web/content/blog/en/dashboard-ui-template-ai.mdx

## --- SOURCE START ---

title: "Dashboard Layout Recipe with AI"
description: "Create professional admin dashboard layouts using FramingUI templates with AI assistance for rapid development."
date: "2026-02-27"
author:
name: "FramingUI Team"
tags:

- dashboard
- admin-panel
- layout-templates
  category: "Tutorial"
  coverImage: ""
  published: true

---

## Why Dashboards Are Hard

Building a dashboard from scratch involves:

1. **Layout structure** — Sidebar, header, main content area
2. **Responsive design** — Mobile, tablet, desktop breakpoints
3. **Component composition** — Stats cards, tables, charts
4. **Navigation state** — Active links, collapsible menus
5. **Consistent styling** — Colors, spacing, typography

With FramingUI + AI, you can generate a complete dashboard in minutes, not hours.

## Dashboard Anatomy

A typical admin dashboard has:
```

┌─────────────────────────────────────────┐
│ Header (navigation, user menu) │
├──────────┬──────────────────────────────┤
│ │ │
│ Sidebar │ Main Content Area │
│ │ - Stats Cards │
│ (nav) │ - Charts │
│ │ - Data Tables │
│ │ │
└──────────┴──────────────────────────────┘

````

Let's build this step-by-step with FramingUI.

## Step 1: Basic Layout Structure

```tsx
import { Card, Separator } from '@framingui/ui';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border-default)] bg-[var(--bg-card)]">
        <div className="p-[var(--spacing-6)]">
          <h2 className="text-lg font-bold">MyApp</h2>
        </div>
        <Separator />
        {/* Navigation will go here */}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border-default)] bg-[var(--bg-card)] flex items-center px-[var(--spacing-6)]">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-[var(--spacing-6)] bg-[var(--bg-background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
````

### Key Features

✅ **Fixed sidebar**: `w-64` (256px width)
✅ **Scrollable content**: `overflow-auto` on main
✅ **Design tokens**: All borders and spacing use tokens

## Step 2: Sidebar Navigation

```tsx
'use client';

import { useState } from 'react';
import { Home, Users, BarChart3, Settings, ChevronDown } from 'lucide-react';
import { Button, Separator } from '@framingui/ui';
import { cn } from '@framingui/ui/lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function DashboardSidebar() {
  const [activeItem, setActiveItem] = useState('/dashboard');

  return (
    <aside className="w-64 border-r border-[var(--border-default)] bg-[var(--bg-card)] flex flex-col h-screen">
      {/* Logo */}
      <div className="p-[var(--spacing-6)]">
        <h2 className="text-lg font-bold">MyApp Admin</h2>
      </div>
      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-[var(--spacing-4)] space-y-[var(--spacing-2)]">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={activeItem === item.href ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start',
              activeItem === item.href &&
                'bg-[var(--bg-primary)] text-[var(--bg-primary-foreground)]'
            )}
            onClick={() => setActiveItem(item.href)}
          >
            <item.icon className="mr-[var(--spacing-2)] h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-[var(--spacing-4)]">
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-sm font-bold text-[var(--bg-primary-foreground)] mr-[var(--spacing-3)]">
              JD
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-[var(--bg-muted-foreground)]">Admin</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
```

### Navigation Features

✅ **Active state highlighting**: Uses `variant="default"` for active item
✅ **Icon support**: Lucide React icons
✅ **User profile section**: At bottom with avatar

## Step 3: Stats Cards Grid

```tsx
import { Card, CardContent } from '@framingui/ui';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231',
    change: '+20.1%',
    icon: DollarSign,
    trend: 'up' as const,
  },
  {
    title: 'Total Users',
    value: '2,350',
    change: '+12.5%',
    icon: Users,
    trend: 'up' as const,
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '-4.3%',
    icon: ShoppingCart,
    trend: 'down' as const,
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '+0.5%',
    icon: TrendingUp,
    trend: 'up' as const,
  },
];

export function StatsGrid() {
  return (
    <div className="grid gap-[var(--spacing-4)] md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-[var(--spacing-6)]">
            <div className="flex items-center justify-between space-x-[var(--spacing-4)]">
              <div className="space-y-[var(--spacing-2)]">
                <p className="text-sm font-medium text-[var(--bg-muted-foreground)]">
                  {stat.title}
                </p>
                <div className="flex items-baseline space-x-[var(--spacing-2)]">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      stat.trend === 'up'
                        ? 'text-[var(--bg-primary)]'
                        : 'text-[var(--bg-destructive)]'
                    )}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="p-[var(--spacing-3)] bg-[var(--bg-primary)]/10 rounded-[var(--radius-lg)]">
                <stat.icon className="h-5 w-5 text-[var(--bg-primary)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Stats Card Features

✅ **Responsive grid**: 1 column mobile → 2 tablet → 4 desktop
✅ **Trend indicators**: Green for up, red for down
✅ **Icon badges**: Colored background with opacity

## Step 4: Data Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
} from '@framingui/ui';
import { MoreHorizontal } from 'lucide-react';

const recentOrders = [
  {
    id: '#3210',
    customer: 'Alice Johnson',
    amount: '$250.00',
    status: 'completed',
    date: '2026-02-27',
  },
  { id: '#3211', customer: 'Bob Smith', amount: '$120.50', status: 'pending', date: '2026-02-27' },
  {
    id: '#3212',
    customer: 'Carol White',
    amount: '$89.99',
    status: 'completed',
    date: '2026-02-26',
  },
  {
    id: '#3213',
    customer: 'David Brown',
    amount: '$340.00',
    status: 'processing',
    date: '2026-02-26',
  },
];

export function RecentOrdersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === 'completed'
                        ? 'default'
                        : order.status === 'pending'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-[var(--bg-muted-foreground)]">
                  {order.date}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

### Table Features

✅ **Status badges**: Color-coded order statuses
✅ **Action buttons**: Icon button for row actions
✅ **Card wrapper**: Table inside Card for consistent styling

## Step 5: Complete Dashboard Page

```tsx
import { DashboardLayout } from './dashboard-layout';
import { DashboardSidebar } from './dashboard-sidebar';
import { StatsGrid } from './stats-grid';
import { RecentOrdersTable } from './recent-orders-table';

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border-default)] bg-[var(--bg-card)] flex items-center justify-between px-[var(--spacing-6)]">
          <h1 className="text-xl font-semibold">Dashboard Overview</h1>
          <Button variant="default">Download Report</Button>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-[var(--spacing-6)] bg-[var(--bg-background)]">
          <div className="space-y-[var(--spacing-6)]">
            <StatsGrid />
            <RecentOrdersTable />
          </div>
        </main>
      </div>
    </div>
  );
}
```

## Responsive Enhancements

### Mobile-First Sidebar

```tsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button, Sheet, SheetContent, SheetTrigger } from '@framingui/ui';

export function MobileSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            {children}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{children}</div>
    </>
  );
}
```

## AI Prompting Tips

### Generate Stats Cards

**Prompt for Claude/Cursor:**

```
Create a stats grid component using FramingUI Card showing:
- Total Users (12,345)
- Active Sessions (1,234)
- Revenue ($54,321)
- Conversion Rate (3.2%)

Use var(--*) tokens for all styling.
```

### Generate Data Table

**Prompt:**

```
Create a users table using FramingUI Table component with columns:
- Name, Email, Role, Status (badge), Actions (button)

Use design tokens for spacing and colors.
```

### Generate Complete Dashboard

**Prompt:**

```
Create a complete admin dashboard using FramingUI with:
- Sidebar navigation (Dashboard, Users, Analytics, Settings)
- Header with title and action button
- 4 stats cards in responsive grid
- Recent orders table
- All styling using var(--*) tokens
```

## Advanced: Chart Integration

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@framingui/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--bg-primary)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

✅ **Uses design token**: `stroke="var(--bg-primary)"`

## Next Steps

1. **Add dark mode toggle**: Use FramingUI theme switching
2. **Implement data fetching**: React Query or SWR
3. **Add filtering/search**: Table with search input
4. **Build detail pages**: User profile, order details

## Resources

- [FramingUI Documentation](https://framingui.com)
- [GitHub Repository](https://github.com/soo-kate-yeon/tekton)
- [Recharts Documentation](https://recharts.org)

With FramingUI + AI, you can build production-ready dashboards in minutes while maintaining perfect design consistency across every component.

--- SOURCE END ---

```

```
