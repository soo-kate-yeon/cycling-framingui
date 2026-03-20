/**
 * Sidebar Component
 * [SPEC-UI-003][TAG-UI003-045]
 *
 * Theme: Square Minimalism
 * - Radius: 0
 * - Typography: Uppercase, Tracking Widest
 * - Active State: Black/White High Contrast
 * - 접힌 상태: 아이콘만 표시
 * - 펼친 상태: 전체 메뉴 표시
 */

'use client';

import {
  Layout,
  User,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';

// ============================================================================
// Types
// ============================================================================

interface SidebarProps {
  /** 추가 className */
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof Layout;
  requireAuth: boolean;
}

// ============================================================================
// Navigation Items
// ============================================================================

const NAV_ITEMS: NavItem[] = [
  {
    id: 'explore',
    label: 'Explore',
    href: '/#theme-gallery',
    icon: Layout,
    requireAuth: false,
  },
  {
    id: 'feedback',
    label: 'Feedback',
    href: '/explore/feedback',
    icon: MessageSquare,
    requireAuth: false,
  },
  {
    id: 'account',
    label: 'Account',
    href: '/explore/account',
    icon: User,
    requireAuth: true,
  },
];

// ============================================================================
// Component
// ============================================================================

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileMenu, toggleMobileMenu } =
    useSidebar();

  // 로그인 상태에 따라 네비게이션 필터링
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.requireAuth && !user) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* ============================================================================
          MOBILE TOP NAVIGATION & OVERLAY 
          ============================================================================ */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50 flex items-center justify-between px-6 transition-colors">
        <Link href="/#theme-gallery" onClick={closeMobileMenu} className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-neutral-950">framingui</span>
          <span className="text-xs font-medium text-neutral-500">explore</span>
        </Link>
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="p-2 -mr-2 text-neutral-950"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div
        className={`md:hidden fixed inset-0 top-16 z-40 bg-white/70 backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col ${
          isMobileOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <nav className="flex-1 px-6 py-8 overflow-y-auto" aria-label="Mobile navigation">
          <ul className="space-y-4">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={`mobile-${item.id}`}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-4 px-6 py-4 rounded-full text-base font-medium transition-all
                      ${
                        isActive
                          ? 'bg-neutral-950 text-white shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                      }
                    `}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-neutral-100 pb-12">
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover grayscale"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral-950 text-white flex items-center justify-center text-lg font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <div className="text-base font-semibold text-neutral-950 truncate">
                    {user.name}
                  </div>
                  <div className="text-sm text-neutral-500 truncate">{user.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center justify-center gap-2 w-full py-4 mt-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 transition-colors text-sm font-medium"
              >
                <LogOut size={16} aria-hidden="true" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-neutral-950 text-white text-base font-medium hover:bg-neutral-800 transition-colors"
            >
              <LogIn size={18} aria-hidden="true" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* ============================================================================
          DESKTOP SIDEBAR 
          ============================================================================ */}
      <aside
        className={`hidden md:flex sidebar h-full bg-white border-r border-neutral-200 flex-col overflow-hidden transition-all duration-300 relative z-10
          ${isCollapsed ? 'w-[64px] min-w-[64px]' : 'w-[240px] min-w-[240px]'}
          ${className}`}
      >
        {/* Header */}
        <div className={`border-b border-neutral-200 ${isCollapsed ? 'p-4' : 'p-6'}`}>
          {isCollapsed ? (
            // 접힌 상태: 로고 + 토글 버튼 세로 배치
            <div className="flex flex-col items-center gap-4">
              <div className="text-xl font-bold tracking-tighter text-neutral-950">t</div>
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2.5 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-950 transition-colors border border-neutral-200 rounded-full"
                aria-label="Expand sidebar"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            // 펼친 상태: 로고 + 토글 버튼 가로 배치
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold tracking-tighter text-neutral-950">
                  framingui
                </div>
                <span className="text-xs font-medium text-neutral-500 mt-1 block">explore</span>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-950 transition-colors rounded-full"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'}`} aria-label="Main navigation">
          <ul className="space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center ${isCollapsed ? 'justify-center p-3 w-11 h-11 mx-auto rounded-full' : 'gap-3 px-6 py-3 rounded-full'} text-sm font-medium transition-all
                      ${
                        isActive
                          ? 'bg-neutral-950 text-white shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                      }
                    `}
                  >
                    <Icon size={isCollapsed ? 20 : 18} aria-hidden="true" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer (User Info / Login) */}
        <div className={`border-t border-neutral-100 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {user ? (
            <div className={`flex flex-col ${isCollapsed ? 'items-center gap-2' : 'gap-3'}`}>
              {/* User Avatar */}
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  title={isCollapsed ? user.name : undefined}
                  className="w-10 h-10 rounded-full object-cover grayscale"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center text-sm font-bold"
                  title={isCollapsed ? user.name : undefined}
                >
                  {user.name.charAt(0)}
                </div>
              )}

              {/* User Info - 펼친 상태에서만 */}
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden ml-2">
                  <div className="text-sm font-semibold text-neutral-950 truncate">{user.name}</div>
                  <div className="text-xs text-neutral-500 truncate">{user.email}</div>
                </div>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                title={isCollapsed ? 'Logout' : undefined}
                className={`flex items-center justify-center bg-transparent border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 transition-colors ${
                  isCollapsed
                    ? 'p-3 w-11 h-11 mx-auto rounded-full mt-2'
                    : 'gap-2 w-full py-2.5 mt-2 rounded-full text-xs font-medium'
                }`}
              >
                <LogOut size={isCollapsed ? 16 : 14} aria-hidden="true" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              title={isCollapsed ? 'Login' : undefined}
              className={`flex items-center justify-center bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors ${
                isCollapsed
                  ? 'p-3 w-11 h-11 mx-auto rounded-full'
                  : 'gap-2 w-full py-3 rounded-full'
              }`}
            >
              <LogIn size={isCollapsed ? 18 : 16} aria-hidden="true" />
              {!isCollapsed && <span>Login</span>}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
