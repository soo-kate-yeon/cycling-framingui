# JA Translation Batch

## Scope

- scope: docs
- source_file: packages/playground-web/content/docs/en/guides/theming.mdx

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
次の docs 文書を日本語に翻訳してください。
source_file: packages/playground-web/content/docs/en/guides/theming.mdx

## --- SOURCE START ---

title: "Theming"
description: "Customize FramingUI themes with token overrides and dark mode configuration"

---

# Theming

FramingUI is a token-first design system. You can start from a built-in theme, then override only the tokens your product needs.

## Built-in Themes (7)

| Theme ID            | Use Case                             |
| ------------------- | ------------------------------------ |
| `classic-magazine`  | Editorial and content-heavy products |
| `editorial-tech`    | Documentation and knowledge products |
| `dark-boldness`     | High-contrast dark dashboards        |
| `minimal-workspace` | Focused productivity interfaces      |
| `neutral-workspace` | Balanced business applications       |
| `pebble`            | Soft, friendly consumer UI           |
| `square-minimalism` | Geometric, compact enterprise UI     |

## Apply A Theme

Import a theme CSS file in your app root.

```tsx
// app/layout.tsx (Next.js)
import '@framingui/tokens/themes/square-minimalism.css';
import '@framingui/ui/styles';
```
````

## Override Tokens

Create overrides in your global CSS. Keep variable names in the `--*` namespace.

```css
/* app/globals.css */
:root {
  --bg-primary: oklch(0.56 0.18 257);
  --bg-primary-foreground: oklch(0.98 0 0);
  --radius-lg: 14px;
  --spacing-4: 1rem;
}
```

Use scoped overrides when only one area needs a custom look.

```css
.pricing-surface {
  --bg-card: oklch(0.99 0.01 250);
  --border-default: oklch(0.88 0.02 250);
}
```

## Dark Mode Setup

Use class-based switching and override only tokens that should change.

```css
:root {
  --bg-background: oklch(1 0 0);
  --bg-foreground: oklch(0.2 0 0);
}

.dark {
  --bg-background: oklch(0.16 0.01 260);
  --bg-foreground: oklch(0.96 0.01 260);
  --bg-card: oklch(0.2 0.01 260);
  --border-default: oklch(0.32 0.01 260);
}
```

```tsx
// app/providers.tsx
import { useEffect, useState } from 'react';

export function ThemeModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button onClick={() => setDark((v) => !v)}>
      {dark ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
}
```

## Recommended Workflow

1. Pick the closest base theme.
2. Override brand color and typography tokens first.
3. Validate contrast in both light and dark mode.
4. Keep component code unchanged and let tokens drive visual changes.

--- SOURCE END ---

```

```
