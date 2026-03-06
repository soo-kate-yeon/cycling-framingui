'use client';

import Image from 'next/image';
import { ArrowRight, Menu, Search, Globe2 } from 'lucide-react';
import { Button, Badge, Separator } from '@framingui/ui';

export default function MagazinePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-[var(--border-default-subtle)]">
        <div className="flex items-center gap-8">
          <Menu className="h-5 w-5 cursor-pointer" />
          <h1 className="text-xl font-bold tracking-tighter uppercase italic">Square Mag.</h1>
        </div>
        <div className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
          <a href="#" className="hover:text-black transition-colors">
            Architecture
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Minimalism
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Interviews
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Catalog
          </a>
        </div>
        <div className="flex items-center gap-6">
          <Search className="h-5 w-5 cursor-pointer" />
          <Globe2 className="h-5 w-5 cursor-pointer" />
        </div>
      </nav>

      <main>
        {/* Hero Section - Full Image Section */}
        <section className="relative h-[90vh] w-full overflow-hidden bg-neutral-900 group">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Architecture"
            fill
            className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 bg-gradient-to-t from-black/60 to-transparent">
            <div className="max-w-4xl space-y-6">
              <Badge className="bg-white text-black border-none rounded-none px-4 py-1.5 text-[10px] font-black tracking-widest items-center">
                FEATURED ISSUE
              </Badge>
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9] uppercase">
                The Architect of <br /> Rational Silence
              </h2>
              <p className="text-lg md:text-2xl text-white/80 max-w-2xl font-light leading-relaxed">
                Exploring the concrete monoliths of Tadao Ando and the philosophy of "ma" in modern
                urban spaces.
              </p>
              <Button className="bg-white text-black rounded-none h-14 px-10 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-3">
                Read Abstract <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Brand Principle Section (Magazine B Style) */}
        <section className="py-24 px-6 md:px-20 border-b border-[var(--border-default-subtle)] grid md:grid-cols-2 gap-20 bg-neutral-50">
          <div className="space-y-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
              01 / PHILOSOPHY
            </span>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
              Beauty in <br /> Unapologetic <br /> Rigor.
            </h3>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xl text-neutral-500 leading-relaxed font-light italic">
              "Minimalism is not a lack of something. It's simply the perfect amount of something."
            </p>
            <Separator className="my-8 bg-[var(--border-default)]" />
            <div className="flex justify-between items-center group cursor-pointer">
              <span className="font-bold text-xs uppercase tracking-widest">Explore DNA</span>
              <div className="h-10 w-10 border border-neutral-900 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-all">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Article List View */}
        <section className="py-24 px-6 md:px-20">
          <div className="flex justify-between items-end mb-16">
            <h3 className="text-3xl font-bold tracking-tighter uppercase italic">
              Latest Dossiers
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              SCROLL TO DISCOVER —
            </span>
          </div>

          <div className="grid grid-cols-1 gap-px bg-neutral-100 border border-neutral-100">
            {[
              {
                id: '01',
                category: 'ARCHITECTURE',
                title: 'Concrete Rationalism in Berlin',
                description: 'The sharp interplay of shadow and structure in the new urban core.',
                image:
                  'https://images.unsplash.com/photo-1555636222-cae831e670b3?q=80&w=2077&auto=format&fit=crop',
              },
              {
                id: '02',
                category: 'LIFESTYLE',
                title: 'The Japanese Craft of Less',
                description: 'How Muji redefined the object-less society through invisible design.',
                image:
                  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop',
              },
              {
                id: '03',
                category: 'INTERVIEW',
                title: 'Peter Zumthor: Thinking Architecture',
                description:
                  'A rare conversation with the master of thermal baths and sensory space.',
                image:
                  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
              },
            ].map((article) => (
              <div
                key={article.id}
                className="group relative bg-white flex flex-col md:flex-row items-stretch overflow-hidden hover:z-10 transition-all cursor-pointer"
              >
                <div className="relative w-full md:w-[400px] h-[300px] md:h-auto overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-[8px] font-bold tracking-widest">
                    {article.id}
                  </div>
                </div>
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between hover:bg-neutral-50 transition-colors">
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
                      {article.category}
                    </span>
                    <h4 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight group-hover:translate-x-2 transition-transform duration-500">
                      {article.title}
                    </h4>
                    <p className="text-neutral-500 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                      {article.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-xs font-bold uppercase tracking-widest">Full Story</span>
                    <div className="h-px w-20 bg-neutral-900" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Secondary Full Image Section */}
        <section className="relative h-[80vh] w-full overflow-hidden bg-neutral-900">
          <Image
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop"
            alt="Minimal Interior"
            fill
            className="object-cover opacity-90"
          />
          <div className="absolute inset-x-8 bottom-8 md:inset-x-20 md:bottom-20 flex flex-col md:flex-row items-end justify-between border-t border-white/20 pt-8">
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase italic">
              Silence as Space.
            </h3>
            <p className="text-white/60 text-sm md:text-base max-w-sm text-right mt-4 md:mt-0">
              The 2026 Collection explores the intersection of brutalist geometry and delicate
              light.
            </p>
          </div>
        </section>

        {/* Footer/Contact CTA */}
        <section className="py-24 px-6 md:px-20 bg-neutral-950 text-white flex flex-col items-center text-center space-y-12">
          <Badge className="bg-neutral-800 text-white rounded-none border-none py-1 px-4 text-[10px] tracking-[0.2em]">
            SUBSCRIBE
          </Badge>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter italic uppercase">
            Join the Collective.
          </h2>
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl">
            <input
              type="email"
              placeholder="YOUR EMAIL ARCHITECTURE"
              className="flex-1 bg-transparent border-b border-[var(--border-default-emphasis)] py-4 text-xl tracking-wide placeholder:text-neutral-700 outline-none focus:border-white transition-colors uppercase font-bold"
            />
            <Button className="bg-white text-black rounded-none h-16 px-12 text-sm font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all border-none">
              SIGN UP
            </Button>
          </div>
          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 w-full text-left md:text-center">
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Archives
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Stockists
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Legal
            </a>
          </div>
          <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-widest pt-12">
            © 2026 FRAMING UI / SQUARE MINIMALISM THEME
          </p>
        </section>
      </main>
    </div>
  );
}
