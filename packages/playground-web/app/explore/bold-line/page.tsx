'use client';

import {
  DollarSign,
  Users,
  Activity,
  CreditCard,
  Menu,
  X,
  TrendingUp,
  ArrowUpRight,
  LayoutDashboard,
  BarChart2,
  Settings,
  Bell,
  Search,
  BookOpen,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTektonTheme } from '@/hooks/useTektonTheme';
import { PreviewBanner } from '@/components/explore/PreviewBanner';
import { useExploreLanguage } from '@/contexts/ExploreLanguageContext';
import { ComponentGallery } from '@/components/explore/ComponentGallery';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// Bold-line 테마: 흰색 배경, 검정 텍스트, 2px 굵은 테두리, 0px 라디우스, 그린 액센트
const BOLD_LINE_FALLBACK: Record<string, string> = {
  '--bg-canvas': '#FFFFFF',
  '--bg-surface': '#FAFAFA',
  '--text-primary': '#000000',
  '--text-secondary': '#525252',
  '--text-tertiary': '#A3A3A3',
  '--border-default': '#000000',
  '--border-emphasis': '#000000',
  '--action-primary': '#000000',
  '--action-primary-text': '#FFFFFF',

  '--bg-background': '#FFFFFF',
  '--bg-foreground': '#000000',
  '--bg-card': '#FFFFFF',
  '--bg-card-foreground': '#000000',
  '--bg-popover': '#FFFFFF',
  '--bg-popover-foreground': '#000000',
  '--bg-primary': '#000000',
  '--bg-primary-foreground': '#FFFFFF',
  '--bg-secondary': '#F5F5F5',
  '--bg-secondary-foreground': '#000000',
  '--bg-muted': '#F5F5F5',
  '--bg-muted-foreground': '#525252',
  '--bg-accent': '#F0FDF4',
  '--bg-accent-foreground': '#000000',
  '--bg-destructive': '#DC2626',
  '--bg-destructive-foreground': '#FFFFFF',
  '--border-input': '#000000',
  '--border-ring': '#000000',

  // 브랜드 액센트 (그린)
  '--color-brand': '#22C55E',
  '--color-brand-text': '#16A34A',

  '--radius-sm': '0px',
  '--radius-md': '0px',
  '--radius-lg': '0px',
  '--radius-xl': '0px',
  '--radius-none': '0px',
  '--radius-full': '0px',
};

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', labelKo: '대시보드', tab: 'page' as const },
  {
    icon: BarChart2,
    label: 'Component Gallery',
    labelKo: '컴포넌트 갤러리',
    tab: 'component' as const,
  },
  {
    icon: BookOpen,
    label: 'API Documentation',
    labelKo: 'API 문서',
    tab: 'docs' as const,
  },
];

export default function BoldLineDemo() {
  const [activeTab, setActiveTab] = useState<'page' | 'component' | 'docs'>('page');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { loaded: themeLoaded } = useTektonTheme('bold-line', {
    fallback: BOLD_LINE_FALLBACK,
  });
  const { locale } = useExploreLanguage();

  return (
    <div
      className={`h-screen overflow-hidden flex flex-col md:flex-row bg-white transition-opacity duration-500 pt-12 ${themeLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <PreviewBanner templateId="bold-line" templateName="Bold Line" />

      {/* 데스크탑 사이드바 — MCP 레시피: 레이아웃 경계도 border 없이 너비/배경으로만 구분 */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white h-full overflow-y-auto shrink-0 relative z-20">
        {/* 로고 & 브랜드 — MCP 레시피: 내부 섹션 구분은 spacing만, border 없음 */}
        <div className="px-8 py-8 pb-6">
          <Link
            href="/#theme-gallery"
            className="inline-flex items-center gap-2 mb-8 hover:opacity-60 transition-opacity"
          >
            <span className="text-2xl font-black tracking-tighter text-black">framingui</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center text-white text-sm font-black">
              BL
            </div>
            <div>
              <p className="font-black text-base tracking-tight leading-none mb-0.5">Bold Corp.</p>
              <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em]">
                Master Plan
              </p>
            </div>
          </div>
        </div>

        {/* 내비게이션 */}
        <nav className="flex-1 px-8 py-8 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  if (item.tab === 'docs') {
                    router.push('/explore/bold-line/docs');
                  } else {
                    setActiveTab(item.tab);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-black transition-all text-left border-2 ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-neutral-500 border-transparent hover:border-black hover:text-black'
                }`}
              >
                <item.icon size={16} strokeWidth={3} />
                <span>{locale === 'ko' ? item.labelKo : item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-[var(--color-brand)]" />}
              </button>
            );
          })}
        </nav>

        {/* 설정 — border 없이 mt-auto로 하단 배치 */}
        <div className="px-8 py-6 mt-auto">
          <button className="flex items-center gap-3 text-sm font-black text-neutral-400 hover:text-black transition-all">
            <Settings size={16} strokeWidth={3} />
            <span>{locale === 'ko' ? '설정' : 'Settings'}</span>
          </button>
        </div>
      </aside>

      {/* 모바일 헤더 — MCP 레시피: border 없이 배경색으로만 구분 */}
      <header className="md:hidden shrink-0 bg-white flex items-center justify-between px-5 h-14 z-40 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-black flex items-center justify-center text-white text-[10px] font-black">
            BL
          </div>
          <span className="font-black tracking-tight text-sm">Bold Corp.</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-black hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* 모바일 메뉴 드로어 */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-[104px] bottom-0 bg-white z-50 overflow-y-auto">
          <nav className="flex flex-col gap-2 p-5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    if (item.tab === 'docs') {
                      router.push('/explore/bold-line/docs');
                    } else {
                      setActiveTab(item.tab);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full text-base font-black px-5 py-4 transition-all text-left flex items-center gap-4 border-2 ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black'
                  }`}
                >
                  <item.icon size={20} strokeWidth={3} />
                  <span>{locale === 'ko' ? item.labelKo : item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto bg-white relative min-w-0">
        {/* 상단 툴바 — MCP 레시피: border 없이 sticky bg-white만으로 구분 */}
        <div className="sticky top-0 z-10 bg-white px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          <div className="relative hidden sm:flex items-center flex-1 max-w-sm">
            <Search size={18} strokeWidth={3} className="absolute left-0 text-neutral-400" />
            <input
              type="text"
              placeholder={locale === 'ko' ? '검색...' : 'Search...'}
              className="w-full pl-8 pr-4 py-2 text-sm font-semibold bg-transparent border-b-2 border-black focus:outline-none placeholder:text-neutral-300"
            />
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative group">
              <Bell size={20} strokeWidth={3} className="text-black" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--color-brand)] border-2 border-white" />
            </button>
            <div className="w-9 h-9 bg-black flex items-center justify-center text-white text-xs font-black">
              BC
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8 lg:p-10 pb-20">
          <div className="max-w-[1400px] mx-auto">
            {activeTab === 'page' && <OverviewDashboard locale={locale} />}
            {activeTab === 'component' && <ComponentGallery />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// Dashboard 콘텐츠
// ============================================================================

function OverviewDashboard({ locale }: { locale: string }) {
  return (
    <div className="space-y-10">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b-2 border-black">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-3">
            {locale === 'ko' ? '개요' : 'Overview'}
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
            {locale === 'ko' ? '대시보드' : 'Dashboard'}
          </h2>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="h-11 px-6 bg-transparent border-2 border-black text-sm font-black hover:bg-neutral-100 transition-all">
            {locale === 'ko' ? '내보내기' : 'Export'}
          </button>
          <button className="h-11 px-6 bg-black text-white border-2 border-black text-sm font-black hover:bg-neutral-800 transition-all">
            {locale === 'ko' ? '새 프로젝트' : 'New Project'}
          </button>
        </div>
      </div>

      {/* 스탯 카드 — MCP 레시피: bg-white border-2 border-black */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: locale === 'ko' ? '총 수익' : 'Total Revenue',
            value: '$45,231',
            sub: '+20.1%',
            icon: DollarSign,
            accent: true,
          },
          {
            title: locale === 'ko' ? '구독자' : 'Subscriptions',
            value: '2,350',
            sub: '+180.1%',
            icon: Users,
            accent: false,
          },
          {
            title: locale === 'ko' ? '판매' : 'Sales',
            value: '12,234',
            sub: '+19.2%',
            icon: CreditCard,
            accent: false,
          },
          {
            title: locale === 'ko' ? '현재 접속' : 'Active Now',
            value: '573',
            sub: '+201',
            icon: Activity,
            accent: false,
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className={`border-2 border-black group hover:-translate-y-0.5 transition-all ${stat.accent ? 'bg-[#F0FDF4]' : 'bg-white'}`}
          >
            <div className="p-6 flex flex-col justify-between min-h-[150px]">
              <div className="flex items-start justify-between">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 leading-none">
                  {stat.title}
                </p>
                <div
                  className={`p-1.5 border-2 border-black ${stat.accent ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                  <stat.icon size={16} strokeWidth={3} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black tabular-nums tracking-tighter leading-none mb-2">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={13} strokeWidth={4} className="text-black" />
                  <p className="text-xs font-black text-black">{stat.sub}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 차트 + 최근 활동 */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* 차트 — MCP 레시피: bg-white border-2 border-black */}
        <div className="lg:col-span-4 border-2 border-black bg-white">
          <div className="flex items-center justify-between px-6 py-5 border-b-2 border-black">
            <div>
              <h3 className="font-black text-xl tracking-tight">
                {locale === 'ko' ? '수익 개요' : 'Revenue Overview'}
              </h3>
              <p className="text-[9px] font-black text-neutral-400 mt-1 uppercase tracking-widest">
                {locale === 'ko' ? '최근 12개월 성장 지표' : 'Last 12 months growth'}
              </p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] border-2 border-black px-2.5 py-1 bg-white">
              {locale === 'ko' ? '연간' : 'Annual'}
            </span>
          </div>
          <div className="p-6">
            <BoldLineChart />
          </div>
        </div>

        {/* 최근 활동 — MCP 레시피: bg-white border-2 border-black */}
        <div className="lg:col-span-3 border-2 border-black bg-white">
          <div className="px-6 py-5 border-b-2 border-black flex items-center justify-between">
            <h3 className="font-black text-xl tracking-tight">
              {locale === 'ko' ? '최근 활동' : 'Recent Activity'}
            </h3>
            <ArrowUpRight size={20} strokeWidth={3} className="text-black" />
          </div>
          {/* MCP 레시피: 리스트 행 구분 — divider 없이 padding gap만 사용 */}
          <div>
            {[
              { name: 'Olivia Martin', email: 'olivia@email.com', amount: '+$1,999', tag: 'NEW' },
              { name: 'Jackson Lee', email: 'jackson@email.com', amount: '+$39', tag: null },
              { name: 'Isabella Nguyen', email: 'isabella@email.com', amount: '+$299', tag: null },
              { name: 'William Kim', email: 'will@email.com', amount: '+$99', tag: null },
              { name: 'Sofia Davis', email: 'sofia@email.com', amount: '+$39', tag: null },
            ].map((user) => (
              <div
                key={user.email}
                className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#F0FDF4] transition-colors"
              >
                <div className="w-9 h-9 bg-black text-white flex items-center justify-center text-sm font-black shrink-0">
                  {user.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black truncate">{user.name}</p>
                    {user.tag && (
                      <span className="text-[8px] font-black uppercase tracking-widest border border-black bg-[#22C55E] px-1.5 py-0 shrink-0">
                        {user.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 font-medium truncate">{user.email}</p>
                </div>
                <div className="shrink-0 font-black text-sm tabular-nums">{user.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 거래 내역 테이블 — MCP 레시피: bg-white border-2 border-black */}
      <div className="border-2 border-black bg-white">
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-black">
          <h3 className="font-black text-xl tracking-tight">
            {locale === 'ko' ? '최근 거래' : 'Recent Transactions'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 py-4 px-6">
                  {locale === 'ko' ? '청구서' : 'Invoice'}
                </th>
                <th className="text-left text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 py-4 px-4">
                  {locale === 'ko' ? '상태' : 'Status'}
                </th>
                <th className="text-left text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 py-4 px-4 hidden sm:table-cell">
                  {locale === 'ko' ? '결제수단' : 'Method'}
                </th>
                <th className="text-right text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 py-4 px-6">
                  {locale === 'ko' ? '금액' : 'Amount'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[
                { invoice: 'INV-001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
                { invoice: 'INV-002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
                { invoice: 'INV-003', status: 'Paid', method: 'Bank Transfer', amount: '$350.00' },
                { invoice: 'INV-004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
                { invoice: 'INV-005', status: 'Refunded', method: 'PayPal', amount: '$550.00' },
              ].map((tx) => (
                <tr key={tx.invoice} className="hover:bg-[#F0FDF4] transition-colors">
                  <td className="py-4 px-6 font-black text-sm">{tx.invoice}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-4 px-4 text-neutral-400 font-medium text-xs hidden sm:table-cell">
                    {tx.method}
                  </td>
                  <td className="py-4 px-6 text-right font-black tabular-nums text-sm">
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Paid') {
    return (
      <span className="inline-flex items-center bg-[#22C55E] text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
        {status}
      </span>
    );
  }
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center bg-neutral-100 text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
      {status}
    </span>
  );
}

// ============================================================================
// 차트 컴포넌트 (Bold-line 스타일)
// ============================================================================

function BoldLineChart() {
  const chartData = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 150 },
    { month: 'Mar', value: 180 },
    { month: 'Apr', value: 160 },
    { month: 'May', value: 210 },
    { month: 'Jun', value: 250 },
    { month: 'Jul', value: 230 },
    { month: 'Aug', value: 280 },
    { month: 'Sep', value: 320 },
    { month: 'Oct', value: 300 },
    { month: 'Nov', value: 340 },
    { month: 'Dec', value: 380 },
  ];

  return (
    <div className="w-full mt-2">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="boldLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" stroke="#F5F5F5" vertical={false} strokeWidth={1} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#A3A3A3', fontSize: 10, fontWeight: 700 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#A3A3A3', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid black',
              borderRadius: '0px',
              padding: '6px 10px',
            }}
            labelStyle={{
              color: 'black',
              fontWeight: 900,
              textTransform: 'uppercase',
              fontSize: 9,
              letterSpacing: '0.1em',
              marginBottom: '2px',
            }}
            itemStyle={{ color: 'black', fontWeight: 900, fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="black"
            strokeWidth={2}
            fill="url(#boldLineGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#22C55E', stroke: 'black', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
