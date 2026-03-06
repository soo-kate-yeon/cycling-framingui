'use client';

import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

interface DataItem {
  id: string;
  project: string;
  status: 'Active' | 'Archived' | 'Pending';
  lastEdited: string;
  author: string;
}

const DEMO_DATA: DataItem[] = [
  {
    id: '1',
    project: 'Q3 Financial Report',
    status: 'Active',
    lastEdited: '2 hours ago',
    author: 'Sooyeon',
  },
  {
    id: '2',
    project: 'Marketing Campaign 2024',
    status: 'Pending',
    lastEdited: '5 hours ago',
    author: 'Jason',
  },
  {
    id: '3',
    project: 'Legacy Codebase Migration',
    status: 'Active',
    lastEdited: '1 day ago',
    author: 'Alex',
  },
  {
    id: '4',
    project: 'User Interview Scripts',
    status: 'Archived',
    lastEdited: '3 days ago',
    author: 'Sarah',
  },
  {
    id: '5',
    project: 'Q4 Roadmap Draft',
    status: 'Active',
    lastEdited: 'Just now',
    author: 'Sooyeon',
  },
];

export function DataTable() {
  return (
    <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border-default)] bg-[var(--bg-canvas)]/30 text-[var(--text-secondary)] font-medium">
            <th className="px-6 py-3 font-medium">Project Name</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium cursor-pointer hover:text-[var(--text-primary)] group flex items-center gap-1">
              Last Edited{' '}
              <ArrowUpDown
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </th>
            <th className="px-6 py-3 font-medium">Author</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-default)]">
          {DEMO_DATA.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-[var(--bg-canvas)] transition-colors group"
            >
              <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                {item.project}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border
                                    ${
                                      item.status === 'Active'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : item.status === 'Pending'
                                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                                    }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-[var(--text-secondary)]">{item.lastEdited}</td>
              <td className="px-6 py-4 text-[var(--text-primary)]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--bg-canvas)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)]">
                    {item.author.charAt(0)}
                  </div>
                  {item.author}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-3 border-t border-[var(--border-default)] bg-[var(--bg-canvas)]/30 text-xs text-[var(--text-secondary)] flex justify-between items-center">
        <span>Showing 5 of 24 projects</span>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 hover:bg-[var(--bg-surface)] hover:shadow-sm rounded transition-all disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-2 py-1 hover:bg-[var(--bg-surface)] hover:shadow-sm rounded transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
