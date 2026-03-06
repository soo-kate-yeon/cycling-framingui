'use client';

import {
  Plus,
  MoreHorizontal,
  Filter,
  Layout,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Inbox,
  User,
  FileText,
  Folder,
  Eye,
  UserPlus,
  RefreshCw,
  SearchIcon,
  PlusSquare,
} from 'lucide-react';
import { Badge, Separator } from '@framingui/ui';

interface Issue {
  id: string;
  title: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: string;
  label: string;
  createdAt: string;
}

interface KanbanBoardViewProps {
  themeName: string;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', count: 6, icon: Circle, color: 'text-neutral-400' },
  { id: 'in-progress', title: 'In Progress', count: 3, icon: Clock, color: 'text-yellow-500' },
  { id: 'in-review', title: 'In Review', count: 1, icon: AlertCircle, color: 'text-purple-500' },
  { id: 'done', title: 'Done', count: 65, icon: CheckCircle2, color: 'text-blue-500' },
];

const ISSUES: Issue[] = [
  {
    id: 'ENG-342',
    title: 'Fix race condition in auth middleware legacy flow',
    priority: 'high',
    status: 'in-progress',
    label: 'Backend',
    createdAt: '2h ago',
  },
  {
    id: 'ENG-321',
    title: 'Optimize Postgres query for project analytics dashboard',
    priority: 'medium',
    status: 'backlog',
    label: 'DB',
    createdAt: '5h ago',
  },
  {
    id: 'OPS-12',
    title: 'Update Kubernetes manifest for v1.28 cluster migration',
    priority: 'high',
    status: 'in-review',
    label: 'Infra',
    createdAt: '1d ago',
  },
  {
    id: 'FE-89',
    title: 'Refactor Redux store to TanStack Query for caching',
    priority: 'low',
    status: 'done',
    label: 'Frontend',
    createdAt: '3d ago',
  },
  {
    id: 'ENG-350',
    title: 'Implement GraphQL batching for batch issue fetching',
    priority: 'medium',
    status: 'in-progress',
    label: 'Performance',
    createdAt: '1h ago',
  },
  {
    id: 'SEC-04',
    title: 'Security audit: Rotate JWT signing keys and update secrets',
    priority: 'urgent',
    status: 'backlog',
    label: 'Security',
    createdAt: '30m ago',
  },
  {
    id: 'FE-95',
    title: 'Migrate CSS Modules to Tailwind utility classes (Core UI)',
    priority: 'low',
    status: 'in-review',
    label: 'DX',
    createdAt: '12h ago',
  },
];

export function KanbanBoardView(_props: KanbanBoardViewProps) {
  return (
    <div className="flex h-full bg-[var(--bg-canvas)] rounded-[var(--radius-xl)] border border-[var(--border-default)] overflow-hidden shadow-sm">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border-default)] bg-[var(--bg-surface)] flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--action-primary)] flex items-center justify-center text-[10px] text-white font-bold">
              T
            </div>
            <span className="text-sm font-bold tracking-tight">Tekton</span>
            <ChevronDown size={14} className="text-neutral-400" />
          </div>
          <div className="flex items-center gap-2">
            <SearchIcon size={14} className="text-neutral-400 cursor-pointer" />
            <PlusSquare size={14} className="text-neutral-400 cursor-pointer" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-6 pt-2">
          <div className="space-y-1">
            <SidebarItem icon={Inbox} label="Inbox" />
            <SidebarItem icon={User} label="My issues" />
            <SidebarItem icon={FileText} label="Drafts" count="1" />
          </div>

          <div className="space-y-1">
            <SidebarSectionLabel label="Workspace" />
            <SidebarItem icon={Folder} label="Projects" />
            <SidebarItem icon={Eye} label="Views" />
            <SidebarItem icon={MoreHorizontal} label="More" />
          </div>

          <div className="space-y-1">
            <SidebarSectionLabel label="Your teams" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-neutral-900">
                <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center text-[8px] text-white">
                  S
                </div>
                <span>Sooyeon</span>
                <ChevronDown size={12} className="ml-auto text-neutral-400" />
              </div>
              <div className="ml-4 space-y-0.5">
                <SidebarItem label="Issues" active />
                <SidebarItem label="Projects" />
                <SidebarItem label="Views" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <SidebarSectionLabel label="Try" />
            <SidebarItem icon={UserPlus} label="Invite people" />
            <SidebarItem icon={RefreshCw} label="Cycles" />
          </div>
        </nav>

        <div className="p-4 border-t border-[var(--border-default)]">
          <div className="bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded-[var(--radius-sm)] p-3 space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              What's new
            </p>
            <p className="text-[11px] font-medium leading-tight">Deeplink to AI coding tools</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-default)] bg-[var(--bg-canvas)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-[10px] text-white">
                S
              </div>
              <span>Sooyeon</span>
              <ChevronDown size={14} className="text-neutral-400" />
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Badge
                variant="secondary"
                className="bg-[var(--bg-surface)] border-none font-semibold h-7 px-3 rounded-[var(--radius-sm)] text-xs"
              >
                All issues
              </Badge>
              <Badge
                variant="outline"
                className="border-none font-medium text-neutral-400 hover:text-neutral-900 h-7 px-3 text-xs"
              >
                Active
              </Badge>
              <Badge
                variant="outline"
                className="border-none font-medium text-neutral-400 hover:text-neutral-900 h-7 px-3 text-xs"
              >
                Backlog
              </Badge>
              <Plus size={16} className="text-neutral-400 cursor-pointer ml-1" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-xs font-semibold">
              <Filter size={14} />
              <span>Filter</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-xs font-semibold">
              <Layout size={14} />
              <span>Display</span>
            </div>
          </div>
        </header>

        {/* Board Layout */}
        <div className="flex-1 overflow-x-auto p-6 flex gap-6 min-h-0 bg-neutral-50/20">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col w-[300px] shrink-0 gap-4">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <column.icon size={16} className={column.color} />
                  <span className="text-sm font-bold tracking-tight">{column.title}</span>
                  <span className="text-xs font-medium text-neutral-400 ml-1">{column.count}</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-400">
                  <MoreHorizontal size={16} className="cursor-pointer hover:text-neutral-600" />
                  <Plus size={16} className="cursor-pointer hover:text-neutral-600" />
                </div>
              </div>

              {/* Column Content */}
              <div className="flex flex-col gap-2.5 pb-4">
                {ISSUES.filter((i) => i.status === column.id).map((issue) => (
                  <KanbanCard key={issue.id} issue={issue} columnId={column.id} />
                ))}
                {column.id === 'backlog' && (
                  <button className="flex items-center gap-2 w-full py-2 px-4 text-xs font-bold text-neutral-400 hover:text-neutral-600 transition-colors">
                    <Plus size={14} />
                    New Issue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KanbanCard({ issue, columnId }: { issue: Issue; columnId: string }) {
  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-neutral-400';
    }
  };

  return (
    <div
      className="group p-3 border border-[var(--border-default)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-surface-subtle,var(--bg-canvas-subtle,var(--bg-canvas)))] hover:border-[var(--border-emphasis)] hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-bold text-neutral-400 tracking-wider">{issue.id}</span>
          <div className="w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <MoreHorizontal size={14} className="text-neutral-400" />
          </div>
        </div>
        <div className="flex items-start gap-2">
          {columnId === 'done' ? (
            <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
          ) : columnId === 'in-progress' ? (
            <div className="relative w-4 h-4 shrink-0 mt-0.5">
              <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <Circle size={16} className="text-neutral-300 shrink-0 mt-0.5" />
          )}
          <h4 className="text-sm font-semibold leading-relaxed tracking-tight text-[var(--text-primary)] line-clamp-2">
            {issue.title}
          </h4>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3">
            <div
              className={`px-1 py-0.5 rounded-sm border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center gap-1`}
            >
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(issue.priority)}`} />
              <span className="text-[10px] font-bold text-neutral-400">{issue.label}</span>
            </div>
            <span className="text-[10px] font-bold text-neutral-400">
              Created {issue.createdAt}
            </span>
          </div>
          <div className="flex items-center -space-x-1.5">
            <div className="w-5 h-5 rounded-full border-2 border-[var(--bg-canvas)] bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  count,
  active,
}: {
  icon?: any;
  label: string;
  count?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] cursor-pointer transition-colors ${
        active
          ? 'bg-[var(--border-default)] text-[var(--text-primary)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-canvas-subtle,var(--border-default))] hover:text-[var(--text-primary)]'
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            size={14}
            className={
              active ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
            }
          />
        )}
        <span>{label}</span>
      </div>
      {count && (
        <span className="text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-canvas)] px-1.5 py-0.5 rounded-sm border border-[var(--border-default)]">
          {count}
        </span>
      )}
    </div>
  );
}

function SidebarSectionLabel({ label }: { label: string }) {
  return (
    <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
      {label}
    </div>
  );
}
