'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft, Share2, Bookmark, ChevronRight, Quote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useExploreLanguage } from '../../../contexts/ExploreLanguageContext';
import { useTektonTheme } from '../../../hooks/useTektonTheme';
import { PreviewBanner } from '../PreviewBanner';

// Classic Magazine fallback tokens
const CLASSIC_MAGAZINE_FALLBACK: Record<string, string> = {
  '--bg-canvas': '#FFFFFF',
  '--text-primary': '#000000',
  '--border-default': '#E5E5E5',
  '--radius-none': '0px',
  '--radius-sm': '0px',
  '--radius-md': '0px',
  '--radius-lg': '0px',
  '--font-serif': 'Merriweather, Georgia, serif',
  '--font-display': 'Playfair Display, serif',
  '--color-accent': '#E11D48',
};

export function ClassicMagazineArticlePage() {
  const router = useRouter();
  const { locale, toggleLocale } = useExploreLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { loaded: themeLoaded } = useTektonTheme('classic-magazine', {
    fallback: CLASSIC_MAGAZINE_FALLBACK,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = (en: string, ko?: string) => (locale === 'ko' && ko ? ko : en);

  if (!themeLoaded) {
    return <div className="min-h-screen bg-[#F9F9F9]" />;
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#E11D48] selection:text-white pt-12">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Inter:wght@400;700;900&display=swap');

        .font-display {
          font-family: 'Playfair Display', serif;
        }
        .font-serif {
          font-family: 'Merriweather', serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }

        .drop-cap::first-letter {
          float: left;
          font-family: 'Playfair Display', serif;
          font-size: 5rem;
          line-height: 0.8;
          padding-top: 0.5rem;
          padding-right: 0.8rem;
          color: #e11d48;
          font-weight: 900;
        }
      `}</style>

      <PreviewBanner templateId="classic-magazine" templateName="Classic Magazine" />

      {/* Navigation - Authoritative & Minimal */}
      <nav
        className={`fixed top-12 left-0 right-0 z-40 transition-[background-color,padding] duration-500 border-b-2 border-black ${scrolled ? 'bg-white/95 backdrop-blur-md py-3' : 'bg-white py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/explore/classic-magazine')}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b border-transparent hover:border-black transition-all"
          >
            <ArrowLeft size={14} />
            {t('The Journal', '더 저널')}
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tighter">
              THE ARCHIVE
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleLocale}
              className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#E11D48] transition-colors"
            >
              {locale.toUpperCase()}
            </button>
            <button className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] border-2 border-black px-4 py-1.5 hover:bg-black hover:text-white transition-all">
              {t('Subscribe', '구독하기')}
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:text-[#E11D48] transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 border-b border-black/5">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block border-y border-black py-2 px-6">
            <span className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-neutral-500">
              {t('Architecture & Design', '건축과 공간의 미학')}
            </span>
          </div>

          <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.85] tracking-tighter italic">
            The Geometry <br className="hidden md:block" /> of Silence.
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 pt-8">
            <div className="h-[1px] w-12 bg-black hidden md:block" />
            <p className="font-serif italic text-xl md:text-2xl text-neutral-500 max-w-xl">
              {t(
                'A visual monologue on the interplay between stark minimalism and the authoritative weight of traditional structures.',
                '극단적인 미니멀리즘과 전통적 구조물이 가진 권위 있는 무게감 사이의 상호작용에 관한 시각적 독백'
              )}
            </p>
            <div className="h-[1px] w-12 bg-black hidden md:block" />
          </div>
        </div>
      </header>

      {/* Article Content - 3 Column Grid */}
      <article className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left: Metadata */}
        <div className="md:col-span-2 space-y-12">
          <div className="space-y-2">
            <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#E11D48]">
              {t('Written By', '필자')}
            </p>
            <p className="font-display text-xl font-bold leading-none">Julian V. Sterling</p>
            <p className="text-xs text-neutral-400 font-serif italic">Chief Architectural Critic</p>
          </div>

          <div className="space-y-4 pt-8 border-t border-black/10">
            <p className="text-[10px] font-sans font-black uppercase tracking-widest text-neutral-400">
              {t('Details', '상세 정보')}
            </p>
            <div className="space-y-1">
              <p className="text-xs font-serif italic">{t('March 2026 Issue', '2026년 3월호')}</p>
              <p className="text-xs font-serif italic">{t('12 Min Read', '12분 분량')}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-8">
            <button className="p-2 border border-black/10 hover:border-black transition-colors rounded-none">
              <Share2 size={16} />
            </button>
            <button className="p-2 border border-black/10 hover:border-black transition-colors rounded-none">
              <Bookmark size={16} />
            </button>
          </div>
        </div>

        {/* Center: Main Text */}
        <div className="md:col-span-7 space-y-12">
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-neutral-800 drop-cap">
            {t(
              'In the realm of modern editorial design, the concept of "The Archive" serves as both a repository of history and a manifesto for the future. We find ourselves at a crossroads where the transient nature of digital screens meets the immutable permanence of printed ink.',
              '현대 에디토리얼 디자인의 영역에서 "아카이브"라는 개념은 역사의 저장소인 동시에 미래를 향한 선언문 역할을 합니다. 우리는 디지털 화면의 일시적인 속성과 인쇄된 잉크의 불변하는 영원함이 교차하는 지점에 서 있습니다.'
            )}
          </p>

          <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden border border-black/5">
            <img
              src="https://images.unsplash.com/photo-1542646272-bcfe25916325?auto=format&fit=crop&q=80&w=2000"
              alt="Minimalist Architecture"
              className="object-cover w-full h-full grayscale opacity-90 sepia-[0.1]"
            />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-white/70">
                {t('FIG. 04 — MONOLITHIC STRUCTURE, ZURICH', '그림 04 — 단일 구조물, 취리히')}
              </p>
            </div>
          </div>

          <p className="font-serif text-lg leading-[1.8] text-neutral-700">
            {t(
              'Traditional print media has always relied on the authoritative weight of serif typography to convey truth. When we look at a page of Classical Magazine, we aren’t just reading words; we are experiencing a spatial arrangement designed to command attention and respect. The absence of rounded corners is not a limitation, but a declaration of structural purity.',
              '전통적인 인쇄 매체는 항상 진실을 전달하기 위해 세리프 타이포그래피의 권위 있는 무게감에 의존해 왔습니다. 클래식 매거진의 페이지를 볼 때 우리는 단지 단어를 읽는 것이 아니라, 주의와 존중을 명령하도록 설계된 공간적 배치를 경험하는 것입니다. 둥근 모서리가 없는 것은 한계가 아니라 구조적 순수함에 대한 선언입니다.'
            )}
          </p>

          <div className="py-12 border-y border-black/10">
            <Quote className="text-[#E11D48] mb-6" size={32} />
            <blockquote className="font-display text-3xl md:text-4xl font-black tracking-tight italic leading-tight">
              {t(
                '"The grid is the silent language of the page, defining the boundaries within which our thoughts may wander."',
                '"그리드는 페이지의 침묵하는 언어이며, 우리의 생각이 거닐 수 있는 경계를 정의합니다."'
              )}
            </blockquote>
            <p className="mt-6 text-xs font-sans font-black uppercase tracking-widest text-neutral-400">
              — STERLING, 2026
            </p>
          </div>

          <p className="font-serif text-lg leading-[1.8] text-neutral-700">
            {t(
              'The authoritative tone of the "Authoritative" brand is reflected in the strict 1px and 2px borders that carve the layout into logical segments. This is a design that respects the user’s intelligence, inviting them into a focused, deep-reading experience that is often lost in the chaotic noise ofcontemporary mobile design.',
              '브랜드의 권위 있는 비주얼 톤은 레이아웃을 논리적인 세그먼트로 나누는 엄격한 1px 및 2px 테두리에 반영됩니다. 이것은 사용자의 지성을 존중하는 디자인이며, 현대 모바일 디자인의 혼란스러운 소음 속에서 종종 잃어버리게 되는 집중력 있고 심도 있는 독서 경험으로 그들을 초대합니다.'
            )}
          </p>
        </div>

        {/* Right: Sidebar Content */}
        <div className="md:col-span-3 space-y-16">
          <div className="space-y-6">
            <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-[#E11D48]">
              {t('Related Reading', '관련 기사')}
            </h4>
            <div className="space-y-8">
              {[
                { title: 'The Fall of the Pixel', category: 'Technology' },
                { title: 'Redefining the Editorial Grid', category: 'Theory' },
                { title: 'Shadows of Modernism', category: 'Arts' },
              ].map((article) => (
                <div key={article.title} className="group cursor-pointer">
                  <p className="text-[9px] font-sans font-black uppercase tracking-widest text-neutral-400 mb-2">
                    {t(article.category, '카테고리')}
                  </p>
                  <h5 className="font-display text-lg font-bold group-hover:text-[#E11D48] transition-colors leading-tight">
                    {t(article.title, article.title)}
                  </h5>
                  <ChevronRight
                    size={14}
                    className="mt-2 text-neutral-300 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 border border-black bg-[#F9F9F9] space-y-6">
            <h4 className="font-display text-2xl font-black italic">
              {t('Join the Collective', '콜렉티브 가입')}
            </h4>
            <p className="text-xs font-serif leading-relaxed text-neutral-500">
              {t(
                'Receive early access to print editions and exclusive interviews.',
                '인쇄판 사전 접근 권한과 독점 인터뷰를 받아보세요.'
              )}
            </p>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white border border-black/10 p-3 text-xs font-serif italic outline-none focus:border-black transition-all"
            />
            <button className="w-full bg-black text-white py-3 text-[10px] font-sans font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors">
              {t('Register Now', '지금 가입')}
            </button>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-black text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-12">
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-4xl font-display font-black tracking-tighter italic">
              The Archive.
            </h2>
            <p className="font-serif italic text-neutral-400 max-w-sm">
              {t(
                'A prestigious visual dialogue on the intersection of typography, architecture, and technology.',
                '타이포그래피, 건축, 그리고 기술의 교차점에 관한 명망 있는 시각적 대화'
              )}
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#E11D48]">
              {t('Sections', '섹션')}
            </p>
            <ul className="space-y-2 text-sm font-serif italic text-neutral-300">
              <li>{t('Essays', '에세이')}</li>
              <li>{t('Interviews', '인터뷰')}</li>
              <li>{t('Visual Gallery', '시각 갤러리')}</li>
              <li>{t('Print Edition', '인쇄판')}</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#E11D48]">
              {t('Information', '정보')}
            </p>
            <ul className="space-y-2 text-sm font-serif italic text-neutral-300">
              <li>{t('About Us', '팀 소개')}</li>
              <li>{t('Submissions', '원고 투고')}</li>
              <li>{t('Privacy Policy', '개인정보 정책')}</li>
              <li>{t('Terms of Service', '서비스 약관')}</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-neutral-500">
            © 2026 THE ARCHIVE LTD.
          </p>
          <div className="flex gap-8">
            {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
              <span
                key={social}
                className="text-[9px] font-sans font-black uppercase tracking-widest hover:text-[#E11D48] cursor-pointer transition-colors"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* Menu Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full p-12 space-y-16 animate-in slide-in-from-right duration-500">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-8 right-8 p-1 hover:text-[#E11D48] transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-4xl font-display font-black tracking-tighter italic border-b-2 border-black pb-4">
              Menu.
            </h3>
            <nav className="space-y-8">
              {['Home', 'Architecture', 'Design Theory', 'The Archive Series', 'Contact'].map(
                (item) => (
                  <div
                    key={item}
                    className="group flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-3xl font-display font-black hover:text-[#E11D48] transition-colors">
                      {t(item, item)}
                    </span>
                    <ChevronRight
                      size={20}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )
              )}
            </nav>
            <div className="pt-12 border-t border-black/10">
              <p className="text-[10px] font-sans font-black uppercase tracking-widest text-neutral-400 mb-4">
                {t('Latest Edition', '최신호')}
              </p>
              <div className="flex gap-6 items-center">
                <div className="w-20 aspect-[3/4] bg-neutral-100 border border-black/5 shrink-0" />
                <div className="space-y-1">
                  <p className="font-display font-bold">Issue #42</p>
                  <p className="text-xs font-serif italic text-neutral-500">
                    The Silent Monochrome
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
