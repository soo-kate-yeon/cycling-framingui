# JA Translation Batch

## Scope

- scope: docs
- source_file: packages/playground-web/content/docs/en/components/input.mdx

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
source_file: packages/playground-web/content/docs/en/components/input.mdx

## --- SOURCE START ---

title: "Input"
description: "Input component API, form usage, and validation patterns"

---

# Input

`Input` is the base text field in the FramingUI design system. It supports all native HTML input attributes.

## Import

```tsx
import { Input } from '@framingui/ui';
```
````

## Props

| Prop               | Type                                          | Default                  | Description                                      |
| ------------------ | --------------------------------------------- | ------------------------ | ------------------------------------------------ |
| `type`             | `string`                                      | browser default (`text`) | Input type (`email`, `password`, `number`, etc.) |
| `className`        | `string`                                      | `undefined`              | Extra utility classes                            |
| `disabled`         | `boolean`                                     | `false`                  | Disabled state                                   |
| `required`         | `boolean`                                     | `false`                  | Required field                                   |
| `aria-invalid`     | `boolean \| 'true' \| 'false'`                | `false`                  | Validation state for assistive tech              |
| `aria-describedby` | `string`                                      | `undefined`              | Link helper/error text                           |
| `...props`         | `React.InputHTMLAttributes<HTMLInputElement>` | -                        | Native input attributes                          |

## Usage Examples

```tsx
import { Input, Label } from '@framingui/ui';

export function InputExamples() {
  return (
    <div className="grid gap-4 max-w-sm">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@company.com" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>

      <Input type="search" placeholder="Search" />
    </div>
  );
}
```

## Validation Example

```tsx
import { useState } from 'react';
import { Input, Label } from '@framingui/ui';

export function EmailField() {
  const [email, setEmail] = useState('');
  const isInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="grid gap-2 max-w-sm">
      <Label htmlFor="signup-email">Work email</Label>
      <Input
        id="signup-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? 'signup-email-error' : undefined}
        className={isInvalid ? 'border-[var(--bg-destructive)]' : undefined}
      />
      {isInvalid && (
        <p id="signup-email-error" className="text-sm text-[var(--bg-destructive)]">
          Enter a valid email address.
        </p>
      )}
    </div>
  );
}
```

## Notes

- Always pair input fields with labels.
- Prefer semantic types (`email`, `tel`, `url`) for better browser and mobile behavior.
- Use `aria-invalid` and `aria-describedby` for accessible validation states.

--- SOURCE END ---

```

```
