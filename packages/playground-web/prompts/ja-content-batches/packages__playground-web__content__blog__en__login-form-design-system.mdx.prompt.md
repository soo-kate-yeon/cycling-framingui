# JA Translation Batch

## Scope

- scope: blog
- source_file: packages/playground-web/content/blog/en/login-form-design-system.mdx

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
source_file: packages/playground-web/content/blog/en/login-form-design-system.mdx

## --- SOURCE START ---

title: "How to Create a Login Form with FramingUI"
description: "Build a production-ready login form with validation, accessibility, and consistent styling using FramingUI design system."
date: "2026-02-27"
author:
name: "FramingUI Team"
tags:

- login-form
- authentication
- form-design
  category: "Tutorial"
  coverImage: ""
  published: true

---

## Why Login Forms Matter

The login form is often the first UI interaction users have with your app. A poorly designed form creates friction, while a well-crafted one builds trust. With FramingUI, you get:

- **Consistent styling** through design tokens
- **Built-in accessibility** from Radix UI primitives
- **Type-safe validation** with react-hook-form + zod
- **Zero hardcoded values** for easy theming

## Basic Login Form

Let's start with a simple email/password login form.

### Step 1: Install Dependencies

```bash
pnpm add @framingui/ui react-hook-form zod @hookform/resolvers
```
````

### Step 2: Create the Component

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@framingui/ui';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      // TODO: Call your authentication API
      console.log('Login data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-[var(--spacing-4)]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-[var(--spacing-4)]">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-sm text-center">
              <a
                href="/forgot-password"
                className="text-[var(--bg-primary)] hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
```

### Key Features

✅ **Design Tokens**: All spacing uses `var(--spacing-*)`, colors use `var(--bg-*)`
✅ **Type Safety**: Zod schema provides runtime validation + TypeScript types
✅ **Accessibility**: FramingUI Form components connect labels, inputs, and error messages
✅ **Loading States**: Button disables during submission

## Enhanced Login Form with Social Auth

Let's add social authentication buttons and a "Remember me" checkbox.

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
  Checkbox,
  Separator,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@framingui/ui';
import { Github, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function EnhancedLoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      console.log('Login data:', data);
      // TODO: Implement authentication
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider: 'github' | 'google') {
    console.log(`Logging in with ${provider}`);
    // TODO: Implement OAuth flow
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Choose your preferred sign in method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-[var(--spacing-4)]">
        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-[var(--spacing-4)]">
          <Button variant="outline" onClick={() => handleSocialLogin('github')} type="button">
            <Github className="mr-[var(--spacing-2)] h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" onClick={() => handleSocialLogin('google')} type="button">
            <Mail className="mr-[var(--spacing-2)] h-4 w-4" />
            Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--bg-background)] px-[var(--spacing-2)] text-[var(--bg-muted-foreground)]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-[var(--spacing-4)]"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-[var(--spacing-3)] space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-[var(--spacing-1)] leading-none">
                    <FormLabel>Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-[var(--bg-muted-foreground)]">
          Don't have an account?{' '}
          <a href="/signup" className="text-[var(--bg-primary)] hover:underline">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
```

### What's New

✅ **Social Auth Buttons**: GitHub and Google login options
✅ **Visual Separator**: "Or continue with" divider using Separator component
✅ **Remember Me**: Checkbox with proper form integration
✅ **Sign Up Link**: Clear call-to-action for new users

## Accessibility Features

FramingUI's Form components automatically provide:

### 1. Label Association

```tsx
<FormLabel>Email</FormLabel>
<FormControl>
  <Input type="email" {...field} />
</FormControl>
```

Generates:

```html
<label for="email-form-item">Email</label>
<input id="email-form-item" aria-describedby="email-form-item-message" />
```

### 2. Error Announcements

```tsx
<FormMessage />
```

Creates an `aria-describedby` connection:

```html
<input aria-invalid="true" aria-describedby="email-form-item-message" />
<p id="email-form-item-message" role="alert">Please enter a valid email</p>
```

### 3. Keyboard Navigation

All FramingUI components support:

- `Tab` to navigate between fields
- `Enter` to submit form
- `Space` to toggle checkbox

## Styling Customization

### Change Card Width

```tsx
<Card className="w-full max-w-sm"> {/* Smaller: 384px */}
<Card className="w-full max-w-md"> {/* Default: 448px */}
<Card className="w-full max-w-lg"> {/* Larger: 512px */}
```

### Add Shadow

```tsx
<Card className="shadow-lg"> {/* Larger shadow */}
```

### Center on Page

```tsx
<div className="flex min-h-screen items-center justify-center p-[var(--spacing-4)]">
  <EnhancedLoginForm />
</div>
```

## Error Handling Patterns

### Display API Errors

```tsx
const [apiError, setApiError] = useState('');

async function onSubmit(data: LoginFormData) {
  setIsLoading(true);
  setApiError('');
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    setApiError(error.message);
  } finally {
    setIsLoading(false);
  }
}

// In JSX:
{
  apiError && (
    <p className="text-sm text-[var(--bg-destructive)]" role="alert">
      {apiError}
    </p>
  );
}
```

## Next Steps

1. **Integrate with auth provider**: NextAuth.js, Supabase, Firebase
2. **Add 2FA support**: TOTP input field
3. **Implement password strength indicator**: Real-time validation
4. **Add loading skeleton**: Optimize perceived performance

## Complete Example

Check out the [FramingUI GitHub repository](https://github.com/soo-kate-yeon/tekton) for a complete authentication flow example with:

- Login form (this tutorial)
- Sign up form
- Password reset flow
- Email verification

With FramingUI, building production-ready forms is fast, accessible, and maintainable — all while staying 100% consistent with your design system.

--- SOURCE END ---

```

```
