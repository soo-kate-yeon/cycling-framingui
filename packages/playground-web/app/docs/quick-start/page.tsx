/**
 * Quick Start Guide
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Start | framingui',
  description: 'Get started with framingui in 5 minutes.',
};

export default function QuickStartPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Quick Start</h1>
        <p className="text-xl text-neutral-600">
          Get framingui running in your project in under 5 minutes.
        </p>
      </header>

      {/* Step 1 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
          <span className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-sm font-mono">
            1
          </span>
          Install the MCP Server
        </h2>
        <p className="text-neutral-600">
          The fastest way to get started is with our MCP init command:
        </p>
        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
          <code>npx @framingui/mcp-server init</code>
        </pre>
        <p className="text-sm text-neutral-500">
          This automatically detects your project (Next.js/Vite), installs dependencies, configures
          Tailwind, and sets up MCP integration.
        </p>
      </section>

      {/* Step 2 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
          <span className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-sm font-mono">
            2
          </span>
          Restart Your AI Tool
        </h2>
        <p className="text-neutral-600">
          After running init, restart Claude Code, Cursor, or your MCP-compatible tool to load the
          FramingUI server.
        </p>
      </section>

      {/* Step 3 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
          <span className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center text-sm font-mono">
            3
          </span>
          Start Building
        </h2>
        <p className="text-neutral-600">
          Now you can ask your AI to build UI with natural language:
        </p>
        <div className="bg-neutral-100 border border-neutral-200 p-4 rounded-lg space-y-3">
          <p className="text-neutral-700 italic">
            "Create a login page using the square-minimalism theme"
          </p>
          <p className="text-neutral-700 italic">
            "Build a dashboard with sidebar navigation, editorial-tech style"
          </p>
          <p className="text-neutral-700 italic">
            "Add a pricing table with 3 tiers using pebble theme tokens"
          </p>
        </div>
      </section>

      {/* What's Next */}
      <section className="space-y-4 pt-6 border-t border-neutral-200">
        <h2 className="text-xl font-bold text-neutral-900">What&apos;s Next?</h2>
        <ul className="space-y-2 text-neutral-600">
          <li>
            →{' '}
            <a href="/docs/installation" className="text-neutral-900 underline hover:no-underline">
              Manual Installation
            </a>{' '}
            — Step-by-step guide for custom setups
          </li>
          <li>
            →{' '}
            <a href="/docs/mcp" className="text-neutral-900 underline hover:no-underline">
              MCP Integration
            </a>{' '}
            — Deep dive into Claude Code, Cursor integration
          </li>
          <li>
            →{' '}
            <a href="/#theme-gallery" className="text-neutral-900 underline hover:no-underline">
              Theme Gallery
            </a>{' '}
            — Browse all 7 available themes
          </li>
        </ul>
      </section>
    </div>
  );
}
