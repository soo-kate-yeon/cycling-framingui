# JA Translation Batch

## Scope

- scope: blog
- source_file: packages/playground-web/content/blog/en/cursor-design-tokens-setup.mdx

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
source_file: packages/playground-web/content/blog/en/cursor-design-tokens-setup.mdx

## --- SOURCE START ---

title: "Cursor + Design Tokens Setup Guide"
description: "Step-by-step guide to integrate FramingUI design tokens with Cursor IDE for AI-powered UI generation."
date: "2026-02-27"
author:
name: "FramingUI Team"
tags:

- cursor-ide
- design-tokens
- ai-setup
  category: "Tutorial"
  coverImage: ""
  published: true

---

## Why Cursor Needs Design Tokens

Cursor's AI is powerful at generating code, but without design tokens, it will:

- Guess color values (`bg-blue-500`, `#3B82F6`, `rgb(59, 130, 246)`)
- Use inconsistent spacing (`p-4`, `px-5`, `py-3`)
- Create arbitrary border radius values (`rounded-md`, `rounded-lg`)

FramingUI solves this by giving Cursor a **single source of truth** for all design decisions.

## Installation

### Step 1: Install FramingUI

```bash
# Using pnpm (recommended)
pnpm add @framingui/ui @framingui/core

# Using npm
npm install @framingui/ui @framingui/core

# Using yarn
yarn add @framingui/ui @framingui/core
```
````

### Step 2: Generate Design Tokens

```bash
# Interactive mode
npx framingui generate

# Or specify your brand color directly
npx framingui generate --color "#FF6B35"
```

This creates a `.framingui/` directory with your design tokens:

```
.framingui/
├── tokens.css          # CSS custom properties
├── tokens.json         # JSON format for tooling
└── tailwind.config.js  # Tailwind integration
```

### Step 3: Import Tokens in Your App

```tsx
// app/layout.tsx (Next.js App Router)
import '@framingui/ui/styles/tokens.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Cursor Configuration

### Create `.cursorrules` File

Create a `.cursorrules` file in your project root:

````
# FramingUI Design System Rules

## Component Library
Always import UI components from @framingui/ui:
- Button, Input, Card, Form, Dialog, Sheet, Tabs
- Label, Checkbox, RadioGroup, Select, Switch
- Table, Avatar, Badge, Tooltip, Popover

## Design Tokens
Use CSS custom properties for all styling:

### Colors
- Primary: var(--bg-primary)
- Secondary: var(--bg-secondary)
- Destructive: var(--bg-destructive)
- Muted: var(--bg-muted)
- Accent: var(--bg-accent)
- Card: var(--bg-card)
- Popover: var(--bg-popover)

### Spacing
- var(--spacing-1) through var(--spacing-8)
- Use these instead of Tailwind's p-1, p-2, etc.

### Border Radius
- var(--radius-sm)
- var(--radius-md)
- var(--radius-lg)
- var(--radius-xl)

### Borders
- var(--border-default)
- var(--border-input)
- var(--border-ring)

## Code Generation Rules
1. Never hardcode colors - always use var(--*)
2. Import components from @framingui/ui, not local files
3. Use semantic token names (primary, secondary) not color names (blue, red)
4. Prefer FramingUI components over raw HTML elements
5. Use Tailwind classes that reference tokens: bg-[var(--bg-primary)]

## Example Component
```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@framingui/ui';

export function ExampleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-[var(--spacing-4)]">
        <p className="text-[var(--bg-muted-foreground)]">
          Card content here
        </p>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
````

````

### VSCode Settings (for Cursor)

Add to `.vscode/settings.json`:

```json
{
  "editor.quickSuggestions": {
    "strings": true
  },
  "css.customData": [".vscode/css-custom-data.json"]
}
````

Create `.vscode/css-custom-data.json` for token autocomplete:

```json
{
  "version": 1.1,
  "properties": [
    {
      "name": "--bg-primary",
      "description": "Primary background color"
    },
    {
      "name": "--bg-secondary",
      "description": "Secondary background color"
    },
    {
      "name": "--spacing-4",
      "description": "1rem spacing (16px)"
    },
    {
      "name": "--radius-md",
      "description": "Medium border radius"
    }
  ]
}
```

## Testing Cursor Integration

### Test 1: Generate a Login Form

Ask Cursor:

```
Create a login form using FramingUI components with email and password fields
```

Expected output:

```tsx
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from '@framingui/ui';

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-[var(--spacing-4)]">
        <div className="space-y-[var(--spacing-2)]">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-[var(--spacing-2)]">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Button className="w-full" variant="default">
          Sign In
        </Button>
      </CardContent>
    </Card>
  );
}
```

✅ **Verify**: No hardcoded colors, uses `var(--*)` tokens

### Test 2: Generate a Dashboard Card

Ask Cursor:

```
Create a stats card showing total users with an icon and value
```

Expected output:

```tsx
import { Card, CardContent } from '@framingui/ui';
import { Users } from 'lucide-react';

export function StatsCard() {
  return (
    <Card>
      <CardContent className="p-[var(--spacing-6)]">
        <div className="flex items-center space-x-[var(--spacing-4)]">
          <div className="p-[var(--spacing-3)] bg-[var(--bg-primary)]/10 rounded-[var(--radius-lg)]">
            <Users className="w-6 h-6 text-[var(--bg-primary)]" />
          </div>
          <div>
            <p className="text-sm text-[var(--bg-muted-foreground)]">Total Users</p>
            <p className="text-2xl font-bold">12,345</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

✅ **Verify**: Uses FramingUI Card, references design tokens

## Troubleshooting

### Issue: Cursor generates Tailwind classes without tokens

**Solution**: Update `.cursorrules` and explicitly ask:

```
Generate a button using FramingUI and var(--*) tokens
```

### Issue: Token autocomplete not working

**Solution**: Restart Cursor after adding `.vscode/css-custom-data.json`

### Issue: Components not found

**Solution**: Verify package installation:

```bash
pnpm list @framingui/ui
```

## Advanced: Custom Token Extensions

You can extend FramingUI tokens for project-specific needs:

```css
/* globals.css */
@import '@framingui/ui/styles/tokens.css';

:root {
  /* Extend with custom tokens */
  --my-app-header-height: 64px;
  --my-app-sidebar-width: 280px;

  /* Override FramingUI tokens (optional) */
  --radius-xl: 16px;
}
```

## Next Steps

1. **Configure Cursor**: Add `.cursorrules` to your project
2. **Test generation**: Ask Cursor to create components
3. **Verify consistency**: Check that all generated code uses tokens
4. **Iterate**: Refine your rules based on Cursor's output

With FramingUI + Cursor, you get AI-powered UI generation with **0% hallucination** on design decisions.

--- SOURCE END ---

```

```
