'use client';

import { useState } from 'react';
import {
  Menu,
  X,
  ArrowLeft,
  Globe,
  Terminal,
  Shield,
  Database,
  Cpu,
  Zap,
  Code2,
  BookOpen,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useExploreLanguage } from '../../../contexts/ExploreLanguageContext';
import { useTektonTheme } from '../../../hooks/useTektonTheme';
import { PreviewBanner } from '../PreviewBanner';

// Bold-line fallback tokens
const BOLD_LINE_FALLBACK: Record<string, string> = {
  '--bg-canvas': '#FFFFFF',
  '--text-primary': '#000000',
  '--border-default': '#000000',
  '--radius-none': '0px',
  '--radius-sm': '0px',
  '--radius-md': '0px',
  '--radius-lg': '0px',
};

export function BoldLineDocsPage() {
  const router = useRouter();
  const { locale, toggleLocale } = useExploreLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { loaded: themeLoaded } = useTektonTheme('bold-line', {
    fallback: BOLD_LINE_FALLBACK,
  });

  const t = (en: string, ko?: string) => (locale === 'ko' && ko ? ko : en);

  const copyCode = () => {
    navigator.clipboard.writeText('curl -X POST https://api.bold.ai/v1/analyze');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!themeLoaded) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans pt-12">
      <PreviewBanner templateId="bold-line" templateName="Bold Line" />

      {/* Top Navigation */}
      <header className="sticky top-12 z-40 bg-white border-b-4 border-black">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/explore/bold-line')}
              className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              <ArrowLeft size={18} strokeWidth={3} />
              <span className="hidden sm:inline">{t('Back', '뒤로가기')}</span>
            </button>
            <div className="h-8 w-[2px] bg-black hidden sm:block" />
            <div className="flex items-center gap-2">
              <Terminal size={22} strokeWidth={3} />
              <span className="text-xl font-black tracking-tighter">BOLD.API</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLocale}
              className="flex items-center gap-2 px-3 py-1.5 border-2 border-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              <Globe size={14} strokeWidth={3} />
              {locale.toUpperCase()}
            </button>
            <button className="hidden lg:flex items-center gap-2 px-6 py-2 bg-black text-white text-sm font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all">
              {t('Get API Key', 'API 키 발급')}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 border-2 border-black"
            >
              {sidebarOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:sticky lg:top-28 h-[calc(100vh-112px)] w-full lg:w-72 bg-white z-30
          border-b-4 lg:border-b-0 lg:border-r-4 border-black overflow-y-auto
          transition-transform duration-300 lg:translate-y-0
          ${sidebarOpen ? 'translate-y-0' : '-translate-y-full lg:translate-y-0'}
        `}
        >
          <nav className="p-8 space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6">
                {t('Fundamentals', '기본 개념')}
              </p>
              <ul className="space-y-4">
                {['Introduction', 'Authentication', 'Errors', 'Rate Limits'].map((item) => (
                  <li key={item}>
                    <button
                      className={`
                      w-full text-left text-sm font-black uppercase tracking-widest px-4 py-2 border-2 transition-all
                      ${item === 'Authentication' ? 'bg-black text-white border-black' : 'border-transparent hover:border-black'}
                    `}
                    >
                      {t(
                        item,
                        item === 'Introduction'
                          ? '소개'
                          : item === 'Authentication'
                            ? '인증'
                            : item === 'Errors'
                              ? '에러 처리'
                              : '제한 사항'
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6">
                {t('Endpoints', '엔드포인트')}
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Cpu, label: 'Analyze', labelKo: '분석' },
                  { icon: Database, label: 'Storage', labelKo: '저장소' },
                  { icon: Shield, label: 'Security', labelKo: '보안' },
                  { icon: Zap, label: 'Realtime', labelKo: '실시간' },
                ].map((item) => (
                  <li key={item.label}>
                    <button className="w-full text-left text-sm font-black uppercase tracking-widest px-4 py-2 border-2 border-transparent hover:border-black flex items-center gap-3 transition-all">
                      <item.icon size={16} strokeWidth={3} />
                      {t(item.label, item.labelKo)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto space-y-20">
            {/* Hero Section */}
            <section className="space-y-10">
              <div className="inline-flex items-center gap-2 bg-[#F0FDF4] border-2 border-black px-4 py-1.5">
                <span className="w-2 h-2 bg-[#22C55E]" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  v1.4.0 STABLE
                </span>
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                  {t('API Authentication', 'API 인증 가이드')}
                </h1>
                <p className="text-lg md:text-xl font-bold text-neutral-600 leading-relaxed max-w-3xl">
                  {t(
                    'To ensure the security and integrity of our high-performance technical ecosystem, all API requests must be properly authenticated using a valid API key. This key acts as your secure gateway to our processing engine, allowing for precise monitoring and rate control of your developer account. Follow the rigid structural requirements below to establish a successful handshake with our servers.',
                    '고성능 기술 생태계의 보안과 무결성을 유지하기 위해, 모든 API 요청은 유효한 API 키를 통해 인증되어야 합니다. 이 키는 프로세싱 엔진에 접근하기 위한 보안 게이트웨이 역할을 하며, 개발자 계정의 정밀한 모니터링과 속도 제어를 가능하게 합니다. 서버와의 성공적인 핸드셰이크를 위해 아래의 엄격한 구조적 요구사항을 준수해 주시기 바랍니다.'
                  )}
                </p>
              </div>
            </section>

            {/* API Key Table */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-4">
                <span className="w-12 h-[3px] bg-black" />
                {t('Header Parameters', '헤더 파라미터')}
              </h2>
              <div className="border-4 border-black overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-4 border-black bg-neutral-50">
                      <th className="p-6 text-sm font-black uppercase tracking-widest border-r-4 border-black w-1/3">
                        Key
                      </th>
                      <th className="p-6 text-sm font-black uppercase tracking-widest">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b-2 border-black hover:bg-neutral-50 transition-colors">
                      <td className="p-6 font-black border-r-4 border-black">Authorization</td>
                      <td className="p-6 font-bold text-neutral-600">Bearer YOUR_API_KEY</td>
                    </tr>
                    <tr className="hover:bg-neutral-50 transition-colors">
                      <td className="p-6 font-black border-r-4 border-black">Content-Type</td>
                      <td className="p-6 font-bold text-neutral-600">application/json</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Code Example */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-4">
                  <span className="w-12 h-[3px] bg-black" />
                  {t('Example Request', '요청 예시')}
                </h2>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  {copied ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <Copy size={14} strokeWidth={3} />
                  )}
                  {copied ? t('Copied!', '복사됨!') : t('Copy', '복사')}
                </button>
              </div>
              <div className="bg-black text-white p-8 md:p-12 font-mono text-lg border-x-[16px] border-black relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Code2 size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex gap-4">
                    <span className="text-[#22C55E]">$</span>
                    <span className="text-neutral-400">curl -X POST \</span>
                  </div>
                  <div className="pl-8 text-neutral-400">https://api.bold.ai/v1/analyze \</div>
                  <div className="pl-8 flex gap-4">
                    <span className="text-[#FBBF24]">-H</span>
                    <span>&quot;Authorization: Bearer KEY&quot; \</span>
                  </div>
                  <div className="pl-8 flex gap-4">
                    <span className="text-[#FBBF24]">-d</span>
                    <span>&apos;&#123; &quot;text&quot;: &quot;Bold Line&quot; &#125;&apos;</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Next Steps Card */}
            <section className="grid md:grid-cols-2 gap-8">
              <div className="group border-4 border-black p-10 hover:bg-black hover:text-white transition-all cursor-pointer">
                <BookOpen size={40} strokeWidth={3} className="mb-6" />
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                  {t('Read Guides', '가이드 읽기')}
                </h3>
                <p className="font-bold opacity-60 mb-8">
                  {t(
                    'Learn how to integrate our SDK in 5 minutes.',
                    '5분 만에 SDK를 연동하는 방법을 알아보세요.'
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  <span>{t('Go to guides', '가이드로 이동')}</span>
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>
              <div className="group border-4 border-black p-10 hover:bg-[#F0FDF4] transition-all cursor-pointer">
                <Cpu size={40} strokeWidth={3} className="mb-6 text-[#22C55E]" />
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                  {t('Core Models', '핵심 모델')}
                </h3>
                <p className="font-bold text-neutral-600 mb-8">
                  {t(
                    'Explore our high-performance AI models.',
                    '고성능 AI 모델의 상세 정보를 확인하세요.'
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  <span>{t('Explore models', '모델 탐색')}</span>
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
