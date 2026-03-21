'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Users,
  Command,
  Layers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTektonTheme } from '../../../hooks/useTektonTheme';

// Editorial Tech fallback tokens - Pure Grayscale, Airy Canvas
const EDITORIAL_TECH_FALLBACK: Record<string, string> = {
  '--bg-canvas': '#FFFFFF',
  '--text-primary': '#171717',
  '--text-secondary': '#737373',
  '--border-default': '#F5F5F5',
  '--radius-none': '0px',
  '--radius-full': '9999px',
  '--font-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

export function EditorialTechSolutionsPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { loaded: themeLoaded } = useTektonTheme('editorial-tech', {
    fallback: EDITORIAL_TECH_FALLBACK,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!themeLoaded) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }

        .hero-title {
          font-weight: 500;
          letter-spacing: -0.03em;
        }

        .airy-blur {
          backdrop-filter: blur(20px) saturate(180%);
          background-color: rgba(255, 255, 255, 1);
        }
      `}</style>

      {/* Lucid Navigation - Mandatory BG for Fixed Element */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding] duration-700 bg-white shadow-sm py-4 border-b border-neutral-100 ${scrolled ? 'py-4' : 'py-6'}`}
      >
        <div className="max-w-[1240px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <button
              onClick={() => router.push('/explore/editorial-tech')}
              className="font-mono text-[11px] font-medium tracking-[0.2em] uppercase flex items-center gap-3 group text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Directory
            </button>
            <div className="hidden md:flex items-center gap-10 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-300">
              <span className="text-neutral-900 border-b border-neutral-900 pb-0.5">Solutions</span>
              <span className="hover:text-neutral-900 cursor-pointer transition-colors">
                Research
              </span>
              <span className="hover:text-neutral-900 cursor-pointer transition-colors">
                Infrastructure
              </span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <button className="hidden sm:block rounded-full border border-neutral-200 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all">
              Contact Sales
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-1 hover:opacity-40 transition-opacity text-neutral-400 hover:text-neutral-900"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Balanced Typography */}
      <header className="pt-72 pb-48 px-8 max-w-[1240px] mx-auto text-center space-y-16">
        <div className="space-y-10">
          <h1 className="text-5xl md:text-7xl lg:text-[88px] hero-title leading-[1.05] tracking-tight">
            <span className="text-neutral-900">Design for</span>
            <br />
            <span className="italic font-normal text-neutral-400">Academic Excellence.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 font-normal leading-relaxed tracking-tight">
            Empowering institutions with reasoning models that bridge the gap between complex
            research and personalized learning environments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <button className="w-full sm:w-auto rounded-full bg-neutral-900 text-white px-14 py-6 text-sm font-medium uppercase tracking-[0.15em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md">
            Start for Education
            <ArrowRight size={18} />
          </button>
          <button className="w-full sm:w-auto rounded-full border border-neutral-200 bg-white text-neutral-900 px-14 py-6 text-sm font-medium uppercase tracking-[0.15em] hover:bg-neutral-50 transition-colors">
            Read the Guide
          </button>
        </div>
      </header>

      {/* Logo Strip - Legible Mono */}
      <section className="border-y border-neutral-100 py-20 mb-32 overflow-hidden bg-neutral-50/30">
        <div className="max-w-[1240px] mx-auto px-8">
          <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-300 mb-16">
            TRUSTED BY WORLD-CLASS INSTITUTIONS
          </p>
          <div className="flex flex-wrap justify-between items-center gap-12 md:gap-4 px-10 opacity-30 grayscale saturate-0">
            <span className="text-xl md:text-2xl font-medium tracking-tighter uppercase italic">
              Stanford
            </span>
            <span className="text-xl md:text-2xl font-light tracking-[0.3em]">MIT</span>
            <span className="text-xl md:text-2xl font-serif font-light">Harvard</span>
            <span className="text-xl md:text-2xl font-sans font-medium uppercase tracking-widest">
              Oxford
            </span>
            <span className="text-xl md:text-2xl font-mono font-normal tracking-tighter">
              ETH ZURICH
            </span>
          </div>
        </div>
      </section>

      {/* Features - text-sm minimum */}
      <section className="max-w-[1240px] mx-auto px-8 py-32 space-y-32">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-neutral-900 mb-10 leading-[1.1]">
            Built for scale.
            <br />
            <span className="text-neutral-400">Secured for privacy.</span>
          </h2>
          <p className="text-lg text-neutral-500 font-normal leading-relaxed">
            Our platform maintains architectural precision while meeting the highest administrative
            standards of global research organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20">
          {[
            {
              icon: <ShieldCheck size={28} strokeWidth={1} />,
              title: 'Security',
              desc: 'SOC2 Type II compliance and end-to-end data encryption by default.',
            },
            {
              icon: <Command size={28} strokeWidth={1} />,
              title: 'Admin',
              desc: 'Centralized tools for user management and usage tracking.',
            },
            {
              icon: <Layers size={28} strokeWidth={1} />,
              title: 'Custom',
              desc: 'Deploy department-specific AI assistants trained on internal data.',
            },
            {
              icon: <Users size={28} strokeWidth={1} />,
              title: 'Unlimited',
              desc: 'Flat-rate pricing with no seat limits for researchers.',
            },
          ].map((feature, i) => (
            <div key={i} className="space-y-10 group">
              <div className="text-neutral-300 group-hover:text-neutral-900 transition-colors duration-500">
                {feature.icon}
              </div>
              <div className="space-y-5">
                <h3 className="text-xl font-medium uppercase tracking-[0.1em] text-neutral-900">
                  {feature.title}
                </h3>
                <div className="h-[1px] w-8 bg-neutral-100 group-hover:w-full transition-all duration-700" />
                <p className="text-base text-neutral-400 leading-relaxed font-normal">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Narratives */}
      <section className="space-y-64 py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 max-w-[1400px] mx-auto px-8 gap-24 items-center">
          <div className="lg:col-span-12 xl:col-span-7 aspect-[21/10] bg-neutral-50 overflow-hidden rounded-[40px] border border-neutral-100 p-4">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000"
              alt="Research interface"
              className="w-full h-full object-cover grayscale opacity-80 rounded-[28px] hover:opacity-100 transition-opacity duration-1000"
            />
          </div>
          <div className="lg:col-span-12 xl:col-span-4 xl:col-start-9 space-y-10">
            <p className="font-mono text-[11px] font-medium text-neutral-300 uppercase tracking-[0.3em]">
              Infrastructure
            </p>
            <h3 className="text-3xl md:text-5xl font-light tracking-tight text-neutral-900 leading-[1.15]">
              A new standard for research.
              <br />
              <span className="italic">New Standards.</span>
            </h3>
            <p className="text-lg text-neutral-400 font-normal leading-relaxed">
              Consolidate institutional knowledge into a secure intelligence layer that evolves with
              your department.
            </p>
            <button className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-900 border-b border-neutral-900/10 hover:border-neutral-900 transition-all pb-2">
              Learn about security
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-w-[1400px] mx-auto px-8 gap-24 items-center">
          <div className="lg:col-span-12 xl:col-span-4 xl:col-start-1 space-y-10 order-2 xl:order-1">
            <p className="font-mono text-[11px] font-medium text-neutral-300 uppercase tracking-[0.3em]">
              Deployment
            </p>
            <h3 className="text-3xl md:text-5xl font-light tracking-tight text-neutral-900 leading-[1.15]">
              Intelligence for
              <br />
              everyone.
            </h3>
            <p className="text-lg text-neutral-400 font-normal leading-relaxed">
              Simple enough for daily tasks, powerful enough for groundbreaking discovery. Scalable
              to every student and faculty member.
            </p>
            <button className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-900 border-b border-neutral-900/10 hover:border-neutral-900 transition-all pb-2">
              See user stories
            </button>
          </div>
          <div className="lg:col-span-12 xl:col-span-7 xl:col-start-6 aspect-[21/10] bg-neutral-50 overflow-hidden rounded-[40px] border border-neutral-100 p-4 order-1 xl:order-2">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000"
              alt="Team collaboration"
              className="w-full h-full object-cover grayscale opacity-70 rounded-[28px] hover:opacity-90 transition-opacity duration-1000"
            />
          </div>
        </div>
      </section>

      {/* Finishing CTA */}
      <section className="bg-neutral-950 text-white pt-64 pb-32 px-8 overflow-hidden relative border-t border-neutral-900">
        <div className="max-w-[1000px] mx-auto text-center space-y-24 relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-[96px] font-light tracking-tighter leading-[1] text-balance">
            Ready to
            <br />
            <span className="text-neutral-500">accelerate discovery?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="w-full sm:w-auto rounded-full bg-white text-neutral-950 px-16 py-7 text-base font-medium uppercase tracking-[0.1em] hover:bg-neutral-100 transition-all">
              Get Started Now
            </button>
            <button className="w-full sm:w-auto rounded-full border border-neutral-800 bg-transparent text-neutral-400 px-16 py-7 text-base font-medium uppercase tracking-[0.1em] hover:bg-neutral-900 hover:text-white transition-colors">
              Talk to an Expert
            </button>
          </div>

          <div className="pt-32 flex flex-col items-center gap-8">
            <div className="h-20 w-[1px] bg-gradient-to-b from-neutral-800 to-transparent" />
            <p className="font-mono text-[11px] text-neutral-500 uppercase tracking-[0.4em]">
              ESTABLISHED 2026
            </p>
          </div>
        </div>

        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-neutral-800/20 to-transparent blur-[120px] opacity-20 pointer-events-none" />
      </section>

      {/* Standardized Footer Sizes */}
      <footer className="py-32 px-8 max-w-[1240px] mx-auto border-t border-neutral-50">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-20 mb-32">
          <div className="col-span-2 space-y-10">
            <h3 className="text-2xl font-medium tracking-tight uppercase text-neutral-900">
              Tekton.
            </h3>
            <p className="text-base font-normal text-neutral-400 max-w-xs leading-relaxed">
              Forging the future of human-AI collaboration through architectural precision.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-widest text-neutral-900">
              Platform
            </h4>
            <ul className="space-y-5 text-sm font-medium uppercase tracking-widest text-neutral-400">
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">Overview</li>
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">
                Enterprise
              </li>
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">Research</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-widest text-neutral-900">
              Resources
            </h4>
            <ul className="space-y-5 text-sm font-medium uppercase tracking-widest text-neutral-400">
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">Docs</li>
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">Security</li>
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">Status</li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-widest text-neutral-900">
              Company
            </h4>
            <ul className="space-y-5 text-sm font-medium uppercase tracking-widest text-neutral-400">
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">Privacy</li>
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">Terms</li>
              <li className="hover:text-neutral-900 cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-16 border-t border-neutral-50">
          <p className="font-mono text-[11px] text-neutral-300 uppercase tracking-widest">
            © 2026 VOID SYSTEMS LTD. // CLARITY FIRST.
          </p>
          <div className="flex gap-12">
            {['Twitter', 'GitHub'].map((social) => (
              <span
                key={social}
                className="font-mono text-[11px] font-medium uppercase cursor-pointer text-neutral-300 hover:text-neutral-900 transition-colors tracking-widest"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* Index Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-neutral-100/40 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full p-20 flex flex-col animate-in slide-in-from-right duration-700 shadow-[0_0_80px_rgba(0,0,0,0.02)]">
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end p-2 hover:opacity-40 transition-opacity"
            >
              <X size={28} strokeWidth={1} />
            </button>

            <div className="mt-32 flex-1 space-y-24">
              <div className="space-y-5">
                <p className="font-mono text-[11px] text-neutral-300 uppercase tracking-[0.4em]">
                  Index
                </p>
                <h3 className="text-4xl font-light tracking-tighter uppercase italic text-neutral-900">
                  Explorer.
                </h3>
              </div>

              <nav className="space-y-12">
                {['Overview', 'Education', 'Security', 'Research', 'Docs'].map((item, i) => (
                  <div
                    key={item}
                    className="group flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-10">
                      <span className="font-mono text-[12px] text-neutral-100 font-medium">
                        0{i + 1}
                      </span>
                      <span className="text-3xl font-light uppercase tracking-tight group-hover:pl-4 transition-all duration-500 text-neutral-900 group-hover:text-neutral-400">
                        {item}
                      </span>
                    </div>
                    <ChevronRight
                      size={24}
                      strokeWidth={1}
                      className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 text-neutral-300"
                    />
                  </div>
                ))}
              </nav>
            </div>

            <div className="pt-20 border-t border-neutral-50">
              <button className="w-full rounded-full bg-neutral-900 text-white py-6 text-sm font-medium uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all">
                Contact Sales Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
