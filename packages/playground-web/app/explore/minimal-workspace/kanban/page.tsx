'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { KanbanBoardView } from '@/components/explore/workspace/KanbanBoardView';
import { useTektonTheme } from '@/hooks/useTektonTheme';
import { PreviewBanner } from '@/components/explore/PreviewBanner';

const MINIMAL_WORKSPACE_FALLBACK: Record<string, string> = {
  '--bg-canvas': '#FFFFFF',
  '--bg-surface': '#FFFFFF',
  '--text-primary': '#09090B',
  '--text-secondary': '#71717A',
  '--text-tertiary': '#A1A1AA',
  '--border-default': '#E4E4E7',
  '--border-emphasis': '#D4D4D8',
  '--action-primary': '#18181B',
  '--action-primary-text': '#FAFAFA',
  '--radius-sm': '6px',
  '--radius-md': '6px',
  '--radius-lg': '8px',
  '--radius-xl': '12px',
};

function KanbanPageInner() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const { loaded } = useTektonTheme('minimal-workspace', {
    fallback: MINIMAL_WORKSPACE_FALLBACK,
  });

  return (
    <div
      className={`h-screen flex flex-col bg-[var(--bg-canvas)] transition-opacity duration-500 ${isEmbed ? 'pt-0' : 'pt-12'} ${loaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {!isEmbed && (
        <PreviewBanner templateId="minimal-workspace" templateName="Minimal Workspace" />
      )}
      <main className="flex-1 overflow-hidden p-4 md:p-6 lg:p-10">
        <KanbanBoardView themeName="minimal-workspace" />
      </main>
    </div>
  );
}

export default function MinimalWorkspaceKanbanPage() {
  return (
    <Suspense>
      <KanbanPageInner />
    </Suspense>
  );
}
