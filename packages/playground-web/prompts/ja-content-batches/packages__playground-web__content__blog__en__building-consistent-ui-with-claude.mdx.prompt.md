# JA Translation Batch

## Scope

- scope: blog
- source_file: packages/playground-web/content/blog/en/building-consistent-ui-with-claude.mdx

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

````markdown
次の blog 文書を日本語に翻訳してください。
source_file: packages/playground-web/content/blog/en/building-consistent-ui-with-claude.mdx

## --- SOURCE START ---

title: "Building Consistent UI with Claude"
description: "How to use FramingUI with Claude Code to generate pixel-perfect, consistent UI components every time."
date: "2026-02-27"
author:
name: "FramingUI Team"
tags:

- claude-code
- ui-consistency
- design-system
  category: "Tutorial"
  coverImage: ""
  published: true

---

## The Claude Code Challenge

Claude Code is exceptional at understanding context and generating production-ready code. However, without explicit design constraints, it will:

1. **Invent color schemes** — "I'll make this button blue" → `bg-blue-600`
2. **Guess spacing patterns** — Mix `p-4`, `px-5`, `gap-3` inconsistently
3. **Create one-off styles** — Each component gets unique styling

The result? A codebase where every AI-generated component looks different.

## FramingUI: Claude's Design Guardrails

FramingUI provides Claude with a **structured design vocabulary** through:

- **Type-safe components** from `@framingui/ui`
- **Semantic design tokens** like `var(--bg-primary)`
- **Consistent patterns** enforced through component APIs

## Setup: Teaching Claude About FramingUI

### Step 1: Create a Project Knowledge File

Create `.claude/project-knowledge.md`:

```markdown
# Project Design System

## FramingUI Component Library

This project uses **FramingUI**, a shadcn-ui fork with integrated design tokens.

### Available Components

Import from `@framingui/ui`:

- Layout: Card, Sheet, Dialog, Tabs, Separator
- Forms: Button, Input, Label, Checkbox, RadioGroup, Select, Switch, Textarea
- Data: Table, Avatar, Badge
- Feedback: Toast, Tooltip, Progress
- Navigation: Breadcrumb, NavigationMenu

### Design Tokens

All styling uses CSS custom properties:

**Colors:**

- `var(--bg-primary)` - Primary brand color
- `var(--bg-secondary)` - Secondary accent
- `var(--bg-destructive)` - Error/danger state
- `var(--bg-muted)` - Muted backgrounds
- `var(--bg-accent)` - Accent highlights
- `var(--bg-card)` - Card backgrounds

**Spacing:**

- `var(--spacing-1)` through `var(--spacing-8)`

**Border Radius:**

- `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`, `var(--radius-xl)`

### Code Generation Rules

1. **Never hardcode colors** - Always use `var(--*)` tokens
2. **Import from @framingui/ui** - Not from local component files
3. **Use semantic names** - `primary`, not `blue`
4. **Prefer components over HTML** - Use `<Button>` instead of `<button>`
```
````

### Step 2: Install FramingUI

```bash
pnpm add @framingui/ui @framingui/core
```

### Step 3: Import Tokens

```tsx
// app/layout.tsx
import '@framingui/ui/styles/tokens.css';
```

## Example: Prompting Claude for Consistent UI

### ❌ Without FramingUI

**Prompt:**

```
Create a user profile card with name, email, and edit button
```

**Claude generates:**

```tsx
export function ProfileCard({ name, email }: ProfileCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <p className="text-gray-600 text-sm mt-1">{email}</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Edit Profile
      </button>
    </div>
  );
}
```

**Issues:**

- Hardcoded colors: `bg-white`, `text-gray-900`, `bg-blue-600`
- Arbitrary spacing: `p-6`, `px-4 py-2`
- Won't adapt to theme changes

### ✅ With FramingUI

**Prompt:**

```
Create a user profile card using FramingUI components with name, email, and edit button
```

**Claude generates:**

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from '@framingui/ui';

export function ProfileCard({ name, email }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--bg-muted-foreground)]">{email}</p>
      </CardContent>
      <CardFooter>
        <Button variant="default">Edit Profile</Button>
      </CardFooter>
    </Card>
  );
}
```

**Benefits:**

- Uses FramingUI Card components
- Semantic tokens: `var(--bg-muted-foreground)`
- Automatically adapts to theme
- Consistent with other components

## Real-World Example: Building a Dashboard

Let's build a complete dashboard with Claude using FramingUI.

### Prompt 1: Stats Cards

```
Create 4 stat cards showing Total Users, Revenue, Active Sessions, and Conversion Rate.
Use FramingUI Card component and design tokens.
```

**Claude generates:**

```tsx
import { Card, CardContent } from '@framingui/ui';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

const stats = [
  { title: 'Total Users', value: '12,345', icon: Users, change: '+12%' },
  { title: 'Revenue', value: '$54,321', icon: DollarSign, change: '+8%' },
  { title: 'Active Sessions', value: '1,234', icon: Activity, change: '+23%' },
  { title: 'Conversion Rate', value: '3.2%', icon: TrendingUp, change: '+0.5%' },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-4)]">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-[var(--spacing-6)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--bg-muted-foreground)]">{stat.title}</p>
                <p className="text-2xl font-bold mt-[var(--spacing-2)]">{stat.value}</p>
                <p className="text-sm text-[var(--bg-primary)] mt-[var(--spacing-1)]">
                  {stat.change}
                </p>
              </div>
              <div className="p-[var(--spacing-3)] bg-[var(--bg-primary)]/10 rounded-[var(--radius-lg)]">
                <stat.icon className="w-6 h-6 text-[var(--bg-primary)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

✅ **Notice:** All spacing uses tokens, colors are semantic

### Prompt 2: Data Table

```
Add a users table below the stats with columns: Name, Email, Role, Status.
Use FramingUI Table component.
```

**Claude generates:**

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
} from '@framingui/ui';

const users = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'active' },
  { name: 'Carol White', email: 'carol@example.com', role: 'User', status: 'inactive' },
];

export function UsersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-[var(--bg-muted-foreground)]">
                  {user.email}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
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

✅ **Notice:** Badge variants, semantic color tokens, consistent spacing

## Advanced: Custom Token Extensions

You can guide Claude to use custom tokens for app-specific patterns:

```css
/* globals.css */
@import '@framingui/ui/styles/tokens.css';

:root {
  --app-sidebar-width: 280px;
  --app-header-height: 64px;
}
```

Update project knowledge:

```markdown
### Custom Tokens

- `--app-sidebar-width` - Sidebar width (280px)
- `--app-header-height` - Header height (64px)
```

**Prompt:**

```
Create a dashboard layout with sidebar and header using our custom tokens
```

**Claude generates:**

```tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-[var(--app-sidebar-width)] border-r border-[var(--border-default)]">
        {/* Sidebar content */}
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-[var(--app-header-height)] border-b border-[var(--border-default)]">
          {/* Header content */}
        </header>
        <main className="flex-1 overflow-auto p-[var(--spacing-6)]">{children}</main>
      </div>
    </div>
  );
}
```

## Tips for Better Claude + FramingUI Results

### 1. Be Specific About Components

❌ "Create a modal"
✅ "Create a modal using FramingUI Dialog component"

### 2. Reference Design Tokens in Prompts

❌ "Make the text gray"
✅ "Use var(--bg-muted-foreground) for the text color"

### 3. Ask for Semantic Variants

❌ "Make the button red"
✅ "Use Button variant='destructive'"

### 4. Iterate with Consistency Checks

```
Review the code and ensure all colors use var(--*) tokens
```

## Measuring Success

After setting up FramingUI with Claude, audit your components:

```bash
# Check for hardcoded colors (should be 0)
grep -r "bg-blue\|text-red\|#[0-9A-F]\{6\}" src/

# Check for token usage (should be everywhere)
grep -r "var(--" src/
```

## Next Steps

1. **Add project knowledge** - Create `.claude/project-knowledge.md`
2. **Install FramingUI** - `pnpm add @framingui/ui`
3. **Test with prompts** - Ask Claude to generate components
4. **Verify consistency** - Check that all components use tokens

With FramingUI, Claude Code becomes a **design-system-aware** code generator, producing consistent, production-ready UI every single time.

--- SOURCE END ---

```

```
