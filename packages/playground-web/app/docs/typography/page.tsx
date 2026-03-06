/**
 * Typography Patterns Documentation
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Typography | framingui',
  description: 'Typography patterns and text styles using FramingUI design tokens.',
};

export default function TypographyPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="text-sm font-medium text-neutral-500">Patterns</div>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Typography</h1>
        <p className="text-xl text-neutral-600">
          Typography patterns, text styles, and font features using Tekton design tokens.
        </p>
      </header>

      {/* Design Tokens */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Design Tokens</h2>
        <p className="text-neutral-600">
          FramingUI uses CSS custom properties for typography. Available tokens:
        </p>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`/* Text Colors */
var(--text-foreground)
var(--text-muted-foreground)
var(--text-popover-foreground)
var(--text-card-foreground)

/* Background Colors */
var(--bg-background)
var(--bg-muted)
var(--bg-accent)
var(--bg-card)
var(--bg-popover)

/* Spacing */
var(--spacing-1) /* 0.25rem */
var(--spacing-2) /* 0.5rem */
var(--spacing-4) /* 1rem */
var(--spacing-6) /* 1.5rem */`}
        </pre>
      </section>

      {/* Heading Hierarchy */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Heading Hierarchy</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<h1 className="text-4xl font-bold tracking-tight text-neutral-900">
  Heading 1
</h1>

<h2 className="text-3xl font-bold text-neutral-900">
  Heading 2
</h2>

<h3 className="text-2xl font-bold text-neutral-900">
  Heading 3
</h3>

<h4 className="text-xl font-semibold text-neutral-900">
  Heading 4
</h4>

<h5 className="text-lg font-semibold text-neutral-900">
  Heading 5
</h5>

<h6 className="text-base font-semibold text-neutral-900">
  Heading 6
</h6>`}
        </pre>
      </section>

      {/* Body Text Styles */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Body Text Styles</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`{/* Large body text */}
<p className="text-lg text-neutral-700">
  Large body text for emphasis or introductory paragraphs.
</p>

{/* Default body text */}
<p className="text-base text-neutral-700">
  Default body text for standard content and descriptions.
</p>

{/* Small text */}
<p className="text-sm text-neutral-600">
  Small text for secondary information or captions.
</p>

{/* Extra small text */}
<p className="text-xs text-neutral-500">
  Extra small text for metadata or fine print.
</p>`}
        </pre>
      </section>

      {/* Text Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Text Colors</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`{/* Primary text */}
<p className="text-neutral-900">Primary text color</p>

{/* Secondary text */}
<p className="text-neutral-700">Secondary text color</p>

{/* Muted text */}
<p className="text-neutral-600">Muted text color</p>

{/* Subtle text */}
<p className="text-neutral-500">Subtle text color</p>

{/* Disabled text */}
<p className="text-neutral-400">Disabled text color</p>

{/* Using design tokens */}
<p className="text-[var(--text-muted-foreground)]">
  Text using design token
</p>`}
        </pre>
      </section>

      {/* Font Weights */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Font Weights</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<p className="font-light">Light (300)</p>
<p className="font-normal">Normal (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>`}
        </pre>
      </section>

      {/* Line Height */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Line Height</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`{/* Tight - for headings */}
<h2 className="text-3xl leading-tight">
  Tight line height for compact headings
</h2>

{/* Normal - for body text */}
<p className="leading-normal">
  Normal line height for comfortable reading of longer content.
</p>

{/* Relaxed - for better readability */}
<p className="leading-relaxed">
  Relaxed line height for improved readability in articles.
</p>

{/* Loose - for maximum readability */}
<p className="leading-loose">
  Loose line height for maximum spacing and readability.
</p>`}
        </pre>
      </section>

      {/* Text Alignment */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Text Alignment</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<p className="text-left">Left aligned text</p>
<p className="text-center">Center aligned text</p>
<p className="text-right">Right aligned text</p>
<p className="text-justify">Justified text for even alignment</p>`}
        </pre>
      </section>

      {/* Text Decoration */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Text Decoration</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<p className="underline">Underlined text</p>
<p className="line-through">Strikethrough text</p>
<p className="no-underline">No underline</p>

{/* Links */}
<a href="#" className="text-blue-600 hover:underline">
  Link with hover underline
</a>

<a href="#" className="underline hover:no-underline">
  Link with underline removed on hover
</a>`}
        </pre>
      </section>

      {/* Text Transform */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Text Transform</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<p className="uppercase">UPPERCASE TEXT</p>
<p className="lowercase">lowercase text</p>
<p className="capitalize">Capitalize Each Word</p>
<p className="normal-case">Normal case text</p>`}
        </pre>
      </section>

      {/* Truncation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Text Truncation</h2>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`{/* Single line truncate */}
<p className="truncate max-w-xs">
  This is a very long text that will be truncated with an ellipsis
</p>

{/* Multi-line truncate (2 lines) */}
<p className="line-clamp-2">
  This is a longer paragraph that will be truncated after two lines
  with an ellipsis at the end. The rest of the content will be hidden.
</p>

{/* Multi-line truncate (3 lines) */}
<p className="line-clamp-3">
  This is an even longer paragraph that will show up to three lines
  before being truncated with an ellipsis. This is useful for
  previews and card descriptions.
</p>`}
        </pre>
      </section>

      {/* Real World Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Real World Examples</h2>

        <h3 className="text-lg font-semibold text-neutral-700 mt-6">Article Header</h3>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<article className="max-w-3xl mx-auto">
  <header className="space-y-4 mb-8">
    <div className="flex items-center gap-2 text-sm text-neutral-500">
      <span>Technology</span>
      <span>•</span>
      <time>December 7, 2024</time>
    </div>
    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
      Getting Started with FramingUI: A Complete Guide
    </h1>
    <p className="text-xl text-neutral-600 leading-relaxed">
      Learn how to build beautiful, accessible interfaces with FramingUI's
      design system and component library.
    </p>
    <div className="flex items-center gap-3 pt-4">
      <div className="w-12 h-12 rounded-full bg-neutral-200" />
      <div>
        <p className="font-semibold text-neutral-900">Jane Smith</p>
        <p className="text-sm text-neutral-500">Senior Designer</p>
      </div>
    </div>
  </header>
</article>`}
        </pre>

        <h3 className="text-lg font-semibold text-neutral-700 mt-6">Card Content</h3>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@framingui/ui';

<Card>
  <CardHeader>
    <CardTitle className="text-2xl font-semibold text-neutral-900">
      Product Name
    </CardTitle>
    <CardDescription className="text-neutral-600">
      A brief description of the product and its key features
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <h3 className="font-semibold text-neutral-900 mb-2">Features</h3>
      <ul className="space-y-2 text-sm text-neutral-600">
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Feature one with detailed description</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Feature two with detailed description</span>
        </li>
      </ul>
    </div>
    <div className="pt-4 border-t">
      <p className="text-xs text-neutral-500">
        Last updated: December 7, 2024
      </p>
    </div>
  </CardContent>
</Card>`}
        </pre>

        <h3 className="text-lg font-semibold text-neutral-700 mt-6">Pricing Table</h3>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Starter</CardTitle>
      <CardDescription>Perfect for individuals</CardDescription>
      <div className="mt-4">
        <span className="text-4xl font-bold text-neutral-900">$9</span>
        <span className="text-neutral-500">/month</span>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-600" />
          <span>5 projects</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-600" />
          <span>10 GB storage</span>
        </li>
        <li className="flex items-center gap-2 text-sm text-neutral-400">
          <X className="w-4 h-4" />
          <span>Priority support</span>
        </li>
      </ul>
      <Button className="w-full mt-6">Get Started</Button>
    </CardContent>
  </Card>

  <Card className="border-2 border-blue-600">
    <CardHeader>
      <div className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-2">
        POPULAR
      </div>
      <CardTitle className="text-2xl font-bold">Pro</CardTitle>
      <CardDescription>For growing teams</CardDescription>
      <div className="mt-4">
        <span className="text-4xl font-bold text-neutral-900">$29</span>
        <span className="text-neutral-500">/month</span>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-600" />
          <span>Unlimited projects</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-600" />
          <span>100 GB storage</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-600" />
          <span>Priority support</span>
        </li>
      </ul>
      <Button className="w-full mt-6">Get Started</Button>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
      <CardDescription>For large organizations</CardDescription>
      <div className="mt-4">
        <span className="text-4xl font-bold text-neutral-900">Custom</span>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-600" />
          <span>Unlimited everything</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-600" />
          <span>Custom storage</span>
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-green-600" />
          <span>Dedicated support</span>
        </li>
      </ul>
      <Button variant="outline" className="w-full mt-6">
        Contact Sales
      </Button>
    </CardContent>
  </Card>
</div>`}
        </pre>

        <h3 className="text-lg font-semibold text-neutral-700 mt-6">User Profile</h3>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`<Card>
  <CardContent className="pt-6">
    <div className="flex items-start gap-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-neutral-900">Sarah Johnson</h2>
        <p className="text-neutral-600">Product Designer</p>
        <p className="text-sm text-neutral-500 mt-2">
          San Francisco, CA • Joined March 2023
        </p>
        <div className="flex gap-4 mt-4">
          <div>
            <p className="text-2xl font-bold text-neutral-900">1,234</p>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Followers
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">567</p>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Following
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900">89</p>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              Projects
            </p>
          </div>
        </div>
      </div>
    </div>
    <Separator className="my-6" />
    <div>
      <h3 className="font-semibold text-neutral-900 mb-2">Bio</h3>
      <p className="text-neutral-600 leading-relaxed">
        Passionate about creating beautiful and accessible user interfaces.
        Love working with design systems and component libraries.
      </p>
    </div>
  </CardContent>
</Card>`}
        </pre>

        <h3 className="text-lg font-semibold text-neutral-700 mt-6">Status Messages</h3>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
          {`{/* Success */}
<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
  <p className="font-semibold text-green-900">Success!</p>
  <p className="text-sm text-green-700 mt-1">
    Your changes have been saved successfully.
  </p>
</div>

{/* Warning */}
<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
  <p className="font-semibold text-yellow-900">Warning</p>
  <p className="text-sm text-yellow-700 mt-1">
    This action cannot be undone. Please proceed with caution.
  </p>
</div>

{/* Error */}
<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
  <p className="font-semibold text-red-900">Error</p>
  <p className="text-sm text-red-700 mt-1">
    Something went wrong. Please try again later.
  </p>
</div>

{/* Info */}
<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <p className="font-semibold text-blue-900">Information</p>
  <p className="text-sm text-blue-700 mt-1">
    Your account will be upgraded on the next billing cycle.
  </p>
</div>`}
        </pre>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Best Practices</h2>
        <div className="space-y-4 text-neutral-600">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Hierarchy</h3>
            <p>
              Maintain a clear visual hierarchy with font sizes and weights. Use larger, bolder text
              for important headings and lighter, smaller text for supporting information.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Contrast</h3>
            <p>
              Ensure sufficient contrast between text and background colors for readability. Use
              darker colors (neutral-900, neutral-800) for primary text on light backgrounds.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Line Length</h3>
            <p>
              Keep line length between 50-75 characters for optimal readability. Use max-w-prose or
              max-w-3xl classes to constrain wide text blocks.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Consistency</h3>
            <p>
              Use consistent text styles throughout your application. Define and reuse common text
              styles for headings, body text, captions, and labels.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">Accessibility</h3>
            <p>
              Use semantic HTML elements (h1-h6, p, strong, em) for proper document structure. Avoid
              using color alone to convey meaning - combine with text or icons.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
