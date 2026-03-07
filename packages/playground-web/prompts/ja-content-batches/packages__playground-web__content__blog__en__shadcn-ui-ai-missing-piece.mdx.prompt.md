# JA Translation Batch

## Scope

- scope: blog
- source_file: packages/playground-web/content/blog/en/shadcn-ui-ai-missing-piece.mdx

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
source_file: packages/playground-web/content/blog/en/shadcn-ui-ai-missing-piece.mdx

## --- SOURCE START ---

title: "Shadcn UI + AI: The Missing Piece"
description: "How FramingUI fills the gap between shadcn UI and AI code generation with design tokens and consistent styling."
date: "2026-02-27"
author:
name: "FramingUI Team"
tags:

- shadcn-ui
- ai-code-generation
- design-tokens
  category: "Tutorial"
  coverImage: ""
  published: true

---

## The Problem with AI + Shadcn UI

Shadcn UI is fantastic for human developers — you copy components, paste them into your project, and customize as needed. But when AI tools like Claude Code or Cursor generate UI code, they face a critical challenge: **how do you ensure consistency across hundreds of generated components?**

AI can hallucinate color values, spacing, and styling patterns that don't match your design system. One component might use `bg-blue-500`, another `bg-indigo-600`, and a third `#4F46E5` — all intended to be your "primary" color.

## FramingUI: The Missing Bridge

FramingUI solves this by forking shadcn UI and integrating **design tokens** directly into every component. Instead of arbitrary Tailwind classes, every style references a semantic token:

```tsx
// ❌ Shadcn UI (original)
<button className="bg-blue-500 hover:bg-blue-600 text-white">
  Click me
</button>

// ✅ FramingUI (token-powered)
<Button variant="default">
  Click me
</Button>

// Under the hood:
// bg-[var(--bg-primary)]
// hover:bg-[var(--bg-primary)]/90
```
````

## Real-World Example: Button Component

Here's how FramingUI's Button component uses tokens:

```tsx
import { Button } from '@framingui/ui';

function LoginForm() {
  return (
    <div className="space-y-[var(--spacing-4)]">
      <Button variant="default">Sign In</Button>
      <Button variant="outline">Create Account</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}
```

Every button automatically inherits your theme's colors, spacing, and border radius — **zero hardcoded values**.

## How Design Tokens Prevent AI Hallucination

When AI generates code using FramingUI, it can't hallucinate colors because:

1. **Single source of truth**: All colors come from `var(--*)` tokens
2. **Semantic naming**: `--bg-primary` is unambiguous
3. **OKLCH foundation**: Colors are perceptually uniform, ensuring consistent brightness

### Example: AI-Generated Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@framingui/ui';

// AI-generated component using FramingUI
function ProductCard({ title, description, price }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-[var(--bg-primary)]">${price}</p>
      </CardContent>
    </Card>
  );
}
```

Notice how the AI uses tokens (`var(--bg-primary)`) instead of guessing `text-blue-600` or `#3B82F6`.

## OKLCH: The Secret Sauce

FramingUI uses **OKLCH color space** for design tokens, which provides:

- **Perceptual uniformity**: L=0.5 looks equally bright across all hues
- **Wider gamut**: Access to more vibrant colors than sRGB
- **WCAG compliance**: Easier to hit AA/AAA contrast ratios

Traditional color spaces like HSL fail here — `hsl(220, 100%, 50%)` (blue) looks darker than `hsl(60, 100%, 50%)` (yellow) despite both having 50% lightness.

## Integration with AI Tools

### Cursor IDE Setup

```bash
# Install FramingUI
pnpm add @framingui/ui @framingui/core

# Generate design tokens from your brand color
npx framingui generate --color "#FF6B35"
```

Then add this to your Cursor rules (`.cursorrules`):

```
When generating UI components:
- Always import from @framingui/ui
- Use var(--*) tokens for colors, spacing, and radius
- Never hardcode color values or spacing
```

### Claude Code Setup

Create a `.claude/skills/framingui.md` file:

```markdown
## FramingUI Component Library

Import components from @framingui/ui:

- Button, Input, Card, Form, Dialog, etc.

Design tokens (use these instead of Tailwind colors):

- Colors: var(--bg-primary), var(--bg-secondary)
- Spacing: var(--spacing-2), var(--spacing-4)
- Radius: var(--radius-md), var(--radius-lg)
```

## Migration from Shadcn UI

Already using shadcn UI? FramingUI is a drop-in replacement:

```tsx
// Before (shadcn)
import { Button } from '@/components/ui/button';

// After (FramingUI)
import { Button } from '@framingui/ui';
// Same API, token-powered internals
```

## Next Steps

1. **Try the playground**: Visit [framingui.com](https://framingui.com) to generate your design tokens
2. **Install FramingUI**: `pnpm add @framingui/ui`
3. **Configure your AI**: Add FramingUI rules to Cursor or Claude Code
4. **Generate UI**: Let AI create components with 0% hallucination

FramingUI gives AI the constraints it needs to generate consistent, production-ready UI — bridging the gap between shadcn UI's flexibility and AI's need for structure.

--- SOURCE END ---

```

```
