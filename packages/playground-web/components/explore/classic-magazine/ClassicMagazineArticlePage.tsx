'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft, Share2, Bookmark, ChevronRight, Quote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTektonTheme } from '../../../hooks/useTektonTheme';

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

  if (!themeLoaded) {
    return <div className="min-h-screen bg-[#F9F9F9]" />;
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#E11D48] selection:text-white">
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

      {/* Navigation - Authoritative & Minimal */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,padding] duration-500 border-b-2 border-black ${scrolled ? 'bg-white/95 backdrop-blur-md py-3' : 'bg-white py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/explore/classic-magazine')}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b border-transparent hover:border-black transition-all"
          >
            <ArrowLeft size={14} />
            The Journal
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tighter">
              THE ARCHIVE
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] border-2 border-black px-4 py-1.5 hover:bg-black hover:text-white transition-all">
              Subscribe
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
              Architecture & Design
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-black leading-[0.85] tracking-tighter italic">
            The Geometry <br className="hidden md:block" /> of Silence.
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 pt-8">
            <div className="h-[1px] w-12 bg-black hidden md:block" />
            <p className="font-serif italic text-xl md:text-2xl text-neutral-500 max-w-xl">
              A visual monologue on the interplay between stark minimalism and the authoritative
              weight of traditional structures.
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
              Written By
            </p>
            <p className="font-display text-xl font-bold leading-none">Julian V. Sterling</p>
            <p className="text-xs text-neutral-400 font-serif italic">Chief Architectural Critic</p>
          </div>

          <div className="space-y-4 pt-8 border-t border-black/10">
            <p className="text-[10px] font-sans font-black uppercase tracking-widest text-neutral-400">
              Details
            </p>
            <div className="space-y-1">
              <p className="text-xs font-serif italic">March 2026 Issue</p>
              <p className="text-xs font-serif italic">12 Min Read</p>
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
            In the realm of modern editorial design, the concept of &ldquo;The Archive&rdquo; serves
            as both a repository of history and a manifesto for the future. We find ourselves at a
            crossroads where the transient nature of digital screens meets the immutable permanence
            of printed ink.
          </p>

          <div className="relative aspect-[3/2] bg-neutral-100 overflow-hidden border border-black/5">
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop&auto=format"
              alt="Modern architecture with clean geometric lines and glass facade"
              className="object-cover w-full h-full grayscale opacity-90 sepia-[0.1]"
            />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-white/70">
                FIG. 04 — MONOLITHIC STRUCTURE, ZURICH
              </p>
            </div>
          </div>

          <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden border border-black/5">
            <img
              src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&h=500&fit=crop&auto=format"
              alt="Minimal concrete structure with dramatic light and shadow"
              className="object-cover w-full h-full grayscale opacity-90 sepia-[0.1]"
            />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-white/70">
                FIG. 05 — CONCRETE VOLUMES, BERLIN
              </p>
            </div>
          </div>

          <p className="font-serif text-lg leading-[1.8] text-neutral-700">
            Traditional print media has always relied on the authoritative weight of serif
            typography to convey truth. When we look at a page of Classical Magazine, we aren&apos;t
            just reading words; we are experiencing a spatial arrangement designed to command
            attention and respect. The absence of rounded corners is not a limitation, but a
            declaration of structural purity.
          </p>

          <div className="py-12 border-y border-black/10">
            <Quote className="text-[#E11D48] mb-6" size={32} />
            <blockquote className="font-display text-3xl md:text-4xl font-black tracking-tight italic leading-tight">
              &ldquo;The grid is the silent language of the page, defining the boundaries within
              which our thoughts may wander.&rdquo;
            </blockquote>
            <p className="mt-6 text-xs font-sans font-black uppercase tracking-widest text-neutral-400">
              — STERLING, 2026
            </p>
          </div>

          <p className="font-serif text-lg leading-[1.8] text-neutral-700">
            The authoritative tone of the &ldquo;Authoritative&rdquo; brand is reflected in the
            strict 1px and 2px borders that carve the layout into logical segments. This is a design
            that respects the user&apos;s intelligence, inviting them into a focused, deep-reading
            experience that is often lost in the chaotic noise of contemporary mobile design.
          </p>
        </div>

        {/* Right: Sidebar Content */}
        <div className="md:col-span-3 space-y-16">
          <div className="space-y-6">
            <h4 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-[#E11D48]">
              Related Reading
            </h4>
            <div className="space-y-8">
              {[
                {
                  title: 'The Fall of the Pixel',
                  category: 'Technology',
                  image:
                    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&auto=format',
                  alt: 'Elegant typography specimen on textured paper',
                },
                {
                  title: 'Redefining the Editorial Grid',
                  category: 'Theory',
                  image:
                    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop&auto=format',
                  alt: 'Architectural detail showing repeating geometric patterns',
                },
                {
                  title: 'Shadows of Modernism',
                  category: 'Arts',
                  image:
                    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=300&fit=crop&auto=format',
                  alt: 'Minimalist interior design with natural light',
                },
              ].map((article) => (
                <div key={article.title} className="group cursor-pointer">
                  <div className="aspect-[4/3] bg-neutral-100 overflow-hidden border border-black/5 mb-3">
                    <img
                      src={article.image}
                      alt={article.alt}
                      className="object-cover w-full h-full grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <p className="text-[9px] font-sans font-black uppercase tracking-widest text-neutral-400 mb-2">
                    {article.category}
                  </p>
                  <h5 className="font-display text-lg font-bold group-hover:text-[#E11D48] transition-colors leading-tight">
                    {article.title}
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
            <h4 className="font-display text-2xl font-black italic">Join the Collective</h4>
            <p className="text-xs font-serif leading-relaxed text-neutral-500">
              Receive early access to print editions and exclusive interviews.
            </p>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white border border-black/10 p-3 text-xs font-serif italic outline-none focus:border-black transition-all"
            />
            <button className="w-full bg-black text-white py-3 text-[10px] font-sans font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors">
              Register Now
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
              A prestigious visual dialogue on the intersection of typography, architecture, and
              technology.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#E11D48]">
              Sections
            </p>
            <ul className="space-y-2 text-sm font-serif italic text-neutral-300">
              <li>Essays</li>
              <li>Interviews</li>
              <li>Visual Gallery</li>
              <li>Print Edition</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#E11D48]">
              Information
            </p>
            <ul className="space-y-2 text-sm font-serif italic text-neutral-300">
              <li>About Us</li>
              <li>Submissions</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
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
                      {item}
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
                Latest Edition
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
