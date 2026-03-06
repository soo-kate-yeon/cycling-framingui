# Templates API Reference

Complete API documentation for the `@framingui` Screen Template System.

## Table of Contents

1. [Core Types](#core-types)
2. [TemplateRegistry](#templateregistry)
3. [Built-in Templates](#built-in-templates)
4. [Creating Custom Templates](#creating-custom-templates)
5. [Best Practices](#best-practices)

---

## Core Types

### ScreenTemplate

The main template definition interface.

```typescript
interface ScreenTemplate {
  /** Template metadata */
  meta: ScreenTemplateMeta;
  /** Layout configuration */
  layout: TemplateLayout;
  /** Slot definitions */
  slots: TemplateSlot[];
  /** Token bindings (optional) */
  tokenBindings?: Record<string, TokenReference>;
  /** React component */
  Component: React.ComponentType<ScreenTemplateProps>;
}
```

**Properties:**

| Property        | Type                                       | Required | Description                                |
| --------------- | ------------------------------------------ | -------- | ------------------------------------------ |
| `meta`          | `ScreenTemplateMeta`                       | ✅       | Template identification and classification |
| `layout`        | `TemplateLayout`                           | ✅       | Layout type and spacing configuration      |
| `slots`         | `TemplateSlot[]`                           | ✅       | Customizable content slots                 |
| `tokenBindings` | `Record<string, TokenReference>`           | ❌       | Custom CSS Variable mappings               |
| `Component`     | `React.ComponentType<ScreenTemplateProps>` | ✅       | React component implementation             |

---

### ScreenTemplateMeta

Template metadata for discovery and organization.

```typescript
interface ScreenTemplateMeta {
  /** Unique template ID */
  id: string;
  /** Display name */
  name: string;
  /** Template category */
  category: ScreenCategory;
  /** Description */
  description: string;
  /** Preview thumbnail URL (optional) */
  thumbnail?: string;
  /** Search tags */
  tags: string[];
  /** Supported theme IDs (use ['*'] for all themes) */
  supportedThemes: string[];
}
```

**Properties:**

| Property          | Type             | Required | Description                       |
| ----------------- | ---------------- | -------- | --------------------------------- |
| `id`              | `string`         | ✅       | Unique identifier (kebab-case)    |
| `name`            | `string`         | ✅       | Human-readable name               |
| `category`        | `ScreenCategory` | ✅       | Template category for filtering   |
| `description`     | `string`         | ✅       | Brief description (1-2 sentences) |
| `thumbnail`       | `string`         | ❌       | Preview image URL                 |
| `tags`            | `string[]`       | ✅       | Search keywords                   |
| `supportedThemes` | `string[]`       | ✅       | Theme compatibility list          |

**Example:**

```typescript
const meta: ScreenTemplateMeta = {
  id: 'login-minimal',
  name: 'Minimal Login',
  category: 'auth',
  description: 'Centered login card with optional branding and footer',
  tags: ['auth', 'login', 'minimal', 'centered'],
  supportedThemes: ['*'], // All themes
};
```

---

### ScreenCategory

Template category enumeration.

```typescript
type ScreenCategory =
  | 'auth' // Authentication screens (Login, Signup, Forgot Password)
  | 'dashboard' // Dashboard screens (Overview, Analytics, Reports)
  | 'content' // Content screens (List, Detail, Gallery)
  | 'form' // Form screens (Create, Edit, Settings)
  | 'navigation' // Navigation components (Sidebar, Navbar, Breadcrumb)
  | 'feedback' // Feedback screens (Error, Empty, Loading)
  | 'marketing'; // Marketing pages (Landing, Pricing, Features)
```

**Categories:**

| Category     | Use Cases             | Examples                            |
| ------------ | --------------------- | ----------------------------------- |
| `auth`       | Authentication flows  | Login, Signup, Password Reset       |
| `dashboard`  | Data overview screens | Analytics, Reports, Metrics         |
| `content`    | Content display       | Article List, Detail View, Gallery  |
| `form`       | Data entry            | Create Post, Edit Profile, Settings |
| `navigation` | Site navigation       | Sidebar, Top Nav, Breadcrumbs       |
| `feedback`   | User feedback         | 404 Error, Empty State, Loading     |
| `marketing`  | Public pages          | Landing, Pricing, Features          |

---

### TemplateLayout

Layout configuration using CSS Variables.

```typescript
interface TemplateLayout {
  /** Layout type */
  type: 'full' | 'centered' | 'split' | 'sidebar';
  /** Maximum width constraint */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Padding (CSS Variable) */
  padding?: TokenReference;
  /** Gap between sections (CSS Variable) */
  gap?: TokenReference;
}
```

**Properties:**

| Property   | Type                                           | Required | Description                                          |
| ---------- | ---------------------------------------------- | -------- | ---------------------------------------------------- |
| `type`     | `'full' \| 'centered' \| 'split' \| 'sidebar'` | ✅       | Layout structure type                                |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`       | ❌       | Content max width (default: `'full'`)                |
| `padding`  | `TokenReference`                               | ❌       | Outer padding (default: `'var(--spacing-4)'`) |
| `gap`      | `TokenReference`                               | ❌       | Section gap (default: `'var(--spacing-4)'`)   |

**Layout Types:**

| Type       | Description            | Best For                     |
| ---------- | ---------------------- | ---------------------------- |
| `full`     | Full-width layout      | Landing pages, marketing     |
| `centered` | Centered container     | Login, signup, forms         |
| `split`    | Split-screen layout    | Login with image, onboarding |
| `sidebar`  | Sidebar + main content | Dashboards, admin panels     |

**Example:**

```typescript
const layout: TemplateLayout = {
  type: 'centered',
  maxWidth: 'sm',
  padding: 'var(--spacing-4)',
  gap: 'var(--spacing-6)',
};
```

---

### TemplateSlot

Customizable content slot definition.

```typescript
interface TemplateSlot {
  /** Slot ID (used in slots prop) */
  id: string;
  /** Display name */
  name: string;
  /** Required slot? */
  required: boolean;
  /** Allowed component types (optional) */
  allowedComponents?: string[];
  /** Default component (optional) */
  defaultComponent?: React.ComponentType;
}
```

**Properties:**

| Property            | Type                  | Required | Description                       |
| ------------------- | --------------------- | -------- | --------------------------------- |
| `id`                | `string`              | ✅       | Slot identifier (camelCase)       |
| `name`              | `string`              | ✅       | Human-readable name               |
| `required`          | `boolean`             | ✅       | Is slot required?                 |
| `allowedComponents` | `string[]`            | ❌       | Type constraints (future feature) |
| `defaultComponent`  | `React.ComponentType` | ❌       | Default component if not provided |

**Example:**

```typescript
const slots: TemplateSlot[] = [
  {
    id: 'branding',
    name: 'Brand Logo',
    required: false,
  },
  {
    id: 'content',
    name: 'Main Content',
    required: true,
  },
];
```

---

### ScreenTemplateProps

Props passed to template components.

```typescript
interface ScreenTemplateProps {
  /** Slot content mapping */
  slots?: Record<string, React.ReactNode>;
  /** Additional CSS class */
  className?: string;
  /** Theme override */
  theme?: string;
}
```

**Properties:**

| Property    | Type                              | Required | Description                     |
| ----------- | --------------------------------- | -------- | ------------------------------- |
| `slots`     | `Record<string, React.ReactNode>` | ❌       | Custom slot content             |
| `className` | `string`                          | ❌       | Additional Tailwind/CSS classes |
| `theme`     | `string`                          | ❌       | Override active theme           |

**Example:**

```typescript
<LoginTemplate
  slots={{
    branding: <MyLogo />,
    footer: <MyFooter />,
  }}
  className="custom-login"
  theme="linear-minimal-v1"
/>
```

---

## TemplateRegistry

Centralized template management API.

### Methods

#### `register(template: ScreenTemplate): void`

Register a new template in the registry.

```typescript
import { TemplateRegistry } from '@framingui/templates/registry';
import { MyCustomTemplate } from './my-template';

TemplateRegistry.register(MyCustomTemplate);
```

**Parameters:**

| Parameter  | Type             | Description         |
| ---------- | ---------------- | ------------------- |
| `template` | `ScreenTemplate` | Template definition |

**Throws:** Error if template ID already exists.

---

#### `get(id: string): ScreenTemplate | undefined`

Retrieve a template by ID.

```typescript
const loginTemplate = TemplateRegistry.get('login-minimal');

if (loginTemplate) {
  const { Component } = loginTemplate;
  return <Component slots={{ ... }} />;
}
```

**Parameters:**

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `id`      | `string` | Template ID |

**Returns:** `ScreenTemplate | undefined`

---

#### `getByCategory(category: ScreenCategory): ScreenTemplate[]`

Get all templates in a category.

```typescript
const authTemplates = TemplateRegistry.getByCategory('auth');

authTemplates.forEach(template => {
  console.log(template.meta.name);
});
```

**Parameters:**

| Parameter  | Type             | Description       |
| ---------- | ---------------- | ----------------- |
| `category` | `ScreenCategory` | Template category |

**Returns:** `ScreenTemplate[]`

---

#### `getAll(): ScreenTemplate[]`

Get all registered templates.

```typescript
const allTemplates = TemplateRegistry.getAll();

console.log(`Total templates: ${allTemplates.length}`);
```

**Returns:** `ScreenTemplate[]`

---

### Helper Function: `getTemplate(id: string)`

Convenience function to get and render a template.

```typescript
import { getTemplate } from '@framingui/templates';

// Get template component
const LoginTemplate = getTemplate('login-minimal');

// Render
<LoginTemplate slots={{ branding: <Logo /> }} />
```

**Parameters:**

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `id`      | `string` | Template ID |

**Returns:** `React.ComponentType<ScreenTemplateProps>`

**Throws:** Error if template not found.

---

## Built-in Templates

### LoginTemplate

**ID:** `login-minimal`

**Category:** `auth`

**Description:** Centered login card with optional branding and footer.

**Layout:**

- Type: `centered`
- Max Width: `sm`
- Padding: `var(--spacing-4)`

**Slots:**

| Slot ID    | Name           | Required | Description              |
| ---------- | -------------- | -------- | ------------------------ |
| `branding` | Brand Logo     | ❌       | Logo or branding element |
| `footer`   | Footer Content | ❌       | Footer text or links     |

**Usage:**

```typescript
import { LoginTemplate } from '@framingui/templates/auth/login';

<LoginTemplate
  slots={{
    branding: <img src="/logo.svg" alt="Brand" />,
    footer: <p>© 2026 Your Company</p>,
  }}
/>
```

**File Location:** `packages/ui/src/templates/auth/login.tsx`

---

### DashboardTemplate

**ID:** `dashboard-minimal`

**Category:** `dashboard`

**Description:** Full dashboard with sidebar navigation and content area.

**Layout:**

- Type: `sidebar`
- Max Width: `full`
- Gap: `var(--spacing-0)` (no gap)

**Slots:**

| Slot ID   | Name               | Required | Description            |
| --------- | ------------------ | -------- | ---------------------- |
| `sidebar` | Sidebar Navigation | ✅       | Sidebar content        |
| `header`  | Top Header         | ❌       | Optional top header    |
| `content` | Main Content       | ✅       | Main dashboard content |

**Usage:**

```typescript
import { DashboardTemplate } from '@framingui/templates/dashboard/overview';

<DashboardTemplate
  slots={{
    sidebar: <MySidebar />,
    header: <MyHeader />,
    content: <MyDashboardContent />,
  }}
/>
```

**File Location:** `packages/ui/src/templates/dashboard/overview.tsx`

---

## Creating Custom Templates

### Step 1: Define Template Structure

Create a new file following the naming convention: `packages/ui/src/templates/{category}/{name}.tsx`

```typescript
import type { ScreenTemplate, ScreenTemplateProps } from '../types';

// Define component
const MyTemplateComponent: React.FC<ScreenTemplateProps> = ({ slots, className }) => {
  return (
    <div className={`my-template ${className || ''}`}>
      <header>{slots?.header}</header>
      <main>{slots?.content}</main>
      <footer>{slots?.footer}</footer>
    </div>
  );
};

// Define template
export const MyTemplate: ScreenTemplate = {
  meta: {
    id: 'my-custom-template',
    name: 'My Custom Template',
    category: 'content',
    description: 'Custom template for content pages',
    tags: ['custom', 'content'],
    supportedThemes: ['*'],
  },
  layout: {
    type: 'full',
    maxWidth: 'lg',
    padding: 'var(--spacing-4)',
    gap: 'var(--spacing-6)',
  },
  slots: [
    {
      id: 'header',
      name: 'Header',
      required: true,
    },
    {
      id: 'content',
      name: 'Content',
      required: true,
    },
    {
      id: 'footer',
      name: 'Footer',
      required: false,
    },
  ],
  Component: MyTemplateComponent,
};
```

### Step 2: Register Template

Register in `packages/ui/src/templates/registry.ts`:

```typescript
import { MyTemplate } from './content/my-template';

// In registry initialization
TemplateRegistry.register(MyTemplate);
```

### Step 3: Export Template

Add to `packages/ui/src/index.ts`:

```typescript
// Templates
export { MyTemplate } from './templates/content/my-template';
export { getTemplate, TemplateRegistry } from './templates/registry';
```

### Step 4: Add Tests

Create test file: `packages/ui/src/components/__tests__/my-template.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyTemplate } from '../my-template';

describe('MyTemplate', () => {
  it('renders all slots', () => {
    const { Component } = MyTemplate;

    render(
      <Component
        slots={{
          header: <div>Header Content</div>,
          content: <div>Main Content</div>,
          footer: <div>Footer Content</div>,
        }}
      />
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('handles missing optional slots', () => {
    const { Component } = MyTemplate;

    render(
      <Component
        slots={{
          header: <div>Header</div>,
          content: <div>Content</div>,
          // footer is optional
        }}
      />
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('Footer')).not.toBeInTheDocument();
  });
});
```

---

## Best Practices

### 1. Template Naming

**ID Conventions:**

- Use kebab-case: `login-minimal`, `dashboard-sidebar`
- Include variant: `login-split-screen`, `dashboard-minimal`
- Be descriptive: `settings-two-column`, `pricing-three-tier`

**File Naming:**

- Match template purpose: `login.tsx`, `overview.tsx`
- One template per file
- Group by category: `templates/auth/`, `templates/dashboard/`

### 2. Slot Design

**Required Slots:**

- Only mark truly essential slots as required
- Provide sensible defaults when possible
- Document what happens when optional slots are omitted

**Slot IDs:**

- Use camelCase: `branding`, `mainContent`, `sidebarNav`
- Be specific: `loginForm` instead of `form`
- Avoid generic names: `slot1`, `section`, `area`

### 3. CSS Variables

**Always Use Tokens:**

- ✅ `padding: 'var(--spacing-4)'`
- ❌ `padding: '1rem'`

**Layer Appropriately:**

- Use semantic tokens for colors: `var(--bg-background)`
- Use atomic tokens for spacing: `var(--spacing-4)`
- Use component tokens for variants: `var(--button-primary-background)`

### 4. Theme Compatibility

**Universal Themes:**

- Use `supportedThemes: ['*']` for most templates
- Rely on CSS Variables for automatic theme adaptation

**Theme-Specific:**

- Only restrict themes if truly incompatible
- Document why themes are restricted
- Provide alternatives for unsupported themes

### 5. Accessibility

**WCAG 2.1 AA Compliance:**

- Ensure proper heading hierarchy
- Use semantic HTML (header, main, nav, footer)
- Provide ARIA labels where needed
- Test with keyboard navigation
- Verify color contrast

**Example:**

```typescript
const Component: React.FC<ScreenTemplateProps> = ({ slots }) => (
  <div role="main" aria-label="Dashboard">
    <nav aria-label="Sidebar navigation">{slots?.sidebar}</nav>
    <header>{slots?.header}</header>
    <main>{slots?.content}</main>
  </div>
);
```

### 6. Testing

**Test Coverage:**

- Slot rendering (required and optional)
- Theme application
- Layout types
- Accessibility (vitest-axe)
- TypeScript types

**Example Test Suite:**

```typescript
describe('MyTemplate', () => {
  it('renders required slots', () => { /* ... */ });
  it('handles missing optional slots gracefully', () => { /* ... */ });
  it('applies custom className', () => { /* ... */ });
  it('meets WCAG 2.1 AA standards', async () => {
    const { container } = render(<Component slots={{ ... }} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

### 7. Documentation

**Template Documentation:**

- Describe purpose and use cases
- List all slots with requirements
- Provide usage examples
- Show slot content examples
- Document theme compatibility

**Inline Comments:**

- Explain non-obvious slot logic
- Document token choices
- Note accessibility considerations

---

## Migration Guide

### From Component to Template

If you have an existing screen component, convert it to a template:

**Before (Component):**

```typescript
export const LoginScreen = ({ logo, footer }: LoginScreenProps) => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="w-96">
      <CardHeader>{logo}</CardHeader>
      <CardContent>{/* login form */}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  </div>
);
```

**After (Template):**

```typescript
export const LoginTemplate: ScreenTemplate = {
  meta: {
    id: 'login-minimal',
    name: 'Minimal Login',
    category: 'auth',
    description: 'Centered login card',
    tags: ['auth', 'login'],
    supportedThemes: ['*'],
  },
  layout: {
    type: 'centered',
    maxWidth: 'sm',
  },
  slots: [
    { id: 'branding', name: 'Logo', required: false },
    { id: 'footer', name: 'Footer', required: false },
  ],
  Component: ({ slots }) => (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardHeader>{slots?.branding}</CardHeader>
        <CardContent>{/* login form */}</CardContent>
        <CardFooter>{slots?.footer}</CardFooter>
      </Card>
    </div>
  ),
};
```

**Benefits:**

- ✅ Discoverable via `TemplateRegistry`
- ✅ Searchable by category and tags
- ✅ Standardized metadata
- ✅ Theme compatibility tracking
- ✅ Type-safe slots

---

## Troubleshooting

### Template Not Found

**Error:** `Template 'my-template' not found in registry`

**Solution:**

1. Verify template is registered: `TemplateRegistry.register(MyTemplate)`
2. Check template ID matches: `id: 'my-template'`
3. Ensure registry imports template file

### Required Slot Missing

**Error:** Component renders but slot content is missing

**Solution:**

1. Check slot is marked `required: true`
2. Verify slot ID matches usage: `slots={{ correctId: <Content /> }}`
3. Add runtime validation:

```typescript
const Component: React.FC<ScreenTemplateProps> = ({ slots }) => {
  if (!slots?.requiredSlot) {
    console.error('Required slot "requiredSlot" is missing');
  }
  return <div>{slots?.requiredSlot}</div>;
};
```

### Theme Not Applied

**Error:** Template renders but doesn't respect theme

**Solution:**

1. Verify CSS Variables are used: `var(--*)`
2. Check theme loader is initialized
3. Ensure template supports active theme
4. Inspect CSS Variable values in DevTools

---

## Version History

| Version | Date       | Changes                                                  |
| ------- | ---------- | -------------------------------------------------------- |
| 1.0.0   | 2026-01-31 | Initial release with LoginTemplate and DashboardTemplate |

---

## Related Documentation

- [SPEC-UI-001](../../../.moai/specs/SPEC-UI-001/spec.md) - Full specification
- [Template Architecture](../../../.moai/docs/frontend/template-architecture.md) - Design patterns
- [Template Testing Guide](../../../.moai/docs/testing/template-testing.md) - Testing strategies
- [README.md](../README.md) - Package overview

---

**Last Updated**: 2026-01-31
**Maintained by**: Tekton Team
