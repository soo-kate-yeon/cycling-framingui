'use client';

import { useState } from 'react';
import {
  Home,
  Hash,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  MessageCircle,
  Repeat2,
  Heart,
  Plus,
  Play,
  Send,
  Settings,
  Globe,
  Layers,
  MoreVertical,
} from 'lucide-react';

const t = (en: string) => en;

// Mock Social Data
const FEED_POSTS = [
  {
    id: 1,
    author: {
      name: 'Mobbin',
      handle: '@MobbinDesign',
      avatar: 'M',
      color: 'bg-blue-500',
    },
    time: 'a day ago',
    content: t(
      "This week, we're excited to release over 1,600 freshly-tagged web app screenshots from @Amplitude_HQ, @CausalHQ, and @veedstudio! Check them out now 👉 mobbin.com/browse/web/apps"
    ),
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=400&fit=crop',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
      },
    ],
    stats: { replies: 12, shares: 45, likes: 128 },
    type: 'tweet',
  },
  {
    id: 2,
    author: {
      name: 'Abinash Mohanty',
      handle: '@abinashmohanty',
      avatar: 'A',
      color: 'bg-purple-500',
    },
    time: '2 days ago',
    content: t(
      'Designers, this is why I prefer @MobbinDesign over Dribbble when looking for a specific design pattern for inspiration.'
    ),
    quoted: {
      author: 'Mobbin',
      handle: '@MobbinDesign',
      content: t(
        "We've used 'Notification' as a keyword in both cases and see the results each platform came up with."
      ),
    },
    stats: { replies: 8, shares: 24, likes: 96 },
    type: 'retweet',
  },
  {
    id: 3,
    author: {
      name: 'Design Spells',
      handle: '@designspells_',
      avatar: 'D',
      color: 'bg-orange-500',
    },
    time: '3 days ago',
    content: t(
      'Heart floats to the top when liking posts on @instagram. This micro-interaction is pure magic. ✨'
    ),
    media: [
      {
        type: 'video',
        url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=450&fit=crop',
      },
    ],
    stats: { replies: 5, shares: 12, likes: 210 },
    type: 'tweet',
  },
];

export default function PebbleSocialFeedPage() {
  const [activeNav, setActiveNav] = useState('twitter');

  return (
    <div className="min-h-screen bg-[#F5F8FA] text-[#1D2129] font-sans selection:bg-[#5599CC]/20">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        .font-pebble {
          font-family: 'Quicksand', sans-serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }

        .pebble-shadow {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        }

        .pebble-shadow-lg {
          box-shadow: 0 20px 40px rgba(85, 153, 204, 0.1);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .pebble-grid {
          display: grid;
          grid-template-columns: 80px 280px 1fr 320px;
          height: 100vh;
        }

        @media (max-width: 1280px) {
          .pebble-grid {
            grid-template-columns: 80px 240px 1fr;
          }
          .right-panel {
            display: none;
          }
        }

        @media (max-width: 1024px) {
          .pebble-grid {
            grid-template-columns: 80px 1fr;
          }
          .nav-panel {
            display: none;
          }
        }
      `}</style>

      <div className="pebble-grid overflow-hidden">
        {/* Leftmost Global Icon Nav */}
        <aside className="bg-white border-r border-[#EAF0F5] flex flex-col items-center py-8 gap-10 z-30">
          <div className="w-12 h-12 bg-[#22C55E] rounded-[16px] flex items-center justify-center shadow-lg shadow-green-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>

          <nav className="flex flex-col gap-6">
            {[Home, Hash, Bell, Mail, Bookmark, User, Globe].map((Icon, idx) => (
              <button
                key={idx}
                className={`w-12 h-12 flex items-center justify-center rounded-[18px] transition-all hover:bg-[#F5F8FA] ${idx === 0 ? 'bg-[#F5F8FA] text-[#5599CC]' : 'text-[#64748B]'}`}
              >
                <Icon className="w-6 h-6" />
              </button>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-6">
            <button className="w-12 h-12 flex items-center justify-center rounded-[18px] text-[#64748B] hover:bg-[#F5F8FA]">
              <Settings className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#E2E8F0] p-0.5 border-2 border-white shadow-sm overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[#5599CC] to-[#A5B4FC]" />
            </div>
          </div>
        </aside>

        {/* Navigation Panel (Secondary Nav) */}
        <aside className="nav-panel bg-[#F8FAFC] border-r border-[#EAF0F5] flex flex-col p-6 overflow-y-auto no-scrollbar">
          <div className="mb-10">
            <h1 className="text-xl font-bold font-pebble tracking-tight text-[#1D2129] mb-1">
              {t('JD Mobbin')}
            </h1>
            <p className="text-sm font-semibold text-[#64748B]">{t('Feeds')}</p>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'twitter', label: t('Twitter Feeds'), icon: '🐦' },
              {
                id: 'instagram',
                label: t('Instagram Hashtags'),
                icon: '📸',
              },
              { id: 'rss', label: t('RSS Reader'), icon: '📰' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-sm font-bold transition-all ${activeNav === item.id ? 'bg-white pebble-shadow text-[#1D2129]' : 'text-[#64748B] hover:bg-black/5'}`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <div className="bg-[#5599CC]/5 rounded-[24px] p-6 border border-[#5599CC]/10">
              <p className="text-[13px] font-bold text-[#5599CC] mb-3 leading-relaxed">
                {t('You have 30 days remaining in your free trial of Sprout Social.')}
              </p>
              <button className="w-full h-11 bg-[#5599CC] text-white text-[13px] font-bold rounded-[16px] shadow-lg shadow-[#5599CC]/20 hover:bg-[#4488BB] transition-colors">
                {t('Start my subscription')}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Feed Section */}
        <main className="flex-1 overflow-y-auto bg-white p-8 no-scrollbar">
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold font-pebble tracking-tight">
                {t('Twitter Feeds')}
              </h2>
              <button className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors">
                <Plus className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-5 bg-[#F1F5F9] text-[#1D2129] text-sm font-bold rounded-full hover:bg-[#E2E8F0] transition-colors">
                <Send className="w-4 h-4" />
                {t('Filters')}
              </button>
              <button className="w-10 h-10 bg-[#5599CC] text-white rounded-[14px] flex items-center justify-center shadow-lg shadow-[#5599CC]/20 hover:scale-105 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="max-w-2xl mx-auto flex flex-col gap-8">
            {FEED_POSTS.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-[#EAF0F5] rounded-[32px] p-8 transition-all hover:pebble-shadow group"
              >
                <div className="flex gap-5">
                  <div
                    className={`w-14 h-14 rounded-[20px] ${post.author.color} flex items-center justify-center text-white text-xl font-bold shadow-inner`}
                  >
                    {post.author.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1D2129]">{post.author.name}</span>
                        <span className="text-sm font-semibold text-[#64748B]">
                          {post.author.handle}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#94A3B8]">{post.time}</span>
                    </div>
                    <div className="text-[15px] font-semibold text-[#334155] leading-relaxed mb-6">
                      {post.content}
                    </div>

                    {post.media && (
                      <div
                        className={`grid gap-3 mb-6 rounded-[24px] overflow-hidden ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}
                      >
                        {post.media.map((item, idx) => (
                          <div
                            key={idx}
                            className={`relative group/media overflow-hidden bg-[#F1F5F9] ${post.media.length === 3 && idx === 0 ? 'row-span-2' : ''}`}
                          >
                            <img
                              src={item.url}
                              alt="Feed media"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105"
                            />
                            {item.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl">
                                  <Play className="w-6 h-6 text-[#1D2129] fill-current ml-1" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {post.quoted && (
                      <div className="border border-[#EAF0F5] rounded-[24px] p-6 mb-6 bg-[#F8FAFC]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#5599CC] text-white text-[10px] flex items-center justify-center font-bold">
                            M
                          </div>
                          <span className="text-xs font-bold">{post.quoted.author}</span>
                          <span className="text-xs font-semibold text-[#64748B]">
                            {post.quoted.handle}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#475569] leading-relaxed">
                          {post.quoted.content}
                        </p>
                      </div>
                    )}

                    <footer className="flex items-center gap-10">
                      <button className="flex items-center gap-2 text-[#64748B] hover:text-[#5599CC] transition-colors group/btn">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover/btn:bg-[#5599CC]/10 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">{post.stats.replies}</span>
                      </button>
                      <button className="flex items-center gap-2 text-[#64748B] hover:text-[#22C55E] transition-colors group/btn">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover/btn:bg-[#22C55E]/10 transition-colors">
                          <Repeat2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">{post.stats.shares}</span>
                      </button>
                      <button className="flex items-center gap-2 text-[#64748B] hover:text-rose-500 transition-colors group/btn">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center group-hover/btn:bg-rose-500/10 transition-colors">
                          <Heart className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">{post.stats.likes}</span>
                      </button>
                      <button className="ml-auto w-9 h-9 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </footer>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Right Utility/Context Panel */}
        <aside className="right-panel bg-[#F8FAFC] border-l border-[#EAF0F5] p-8 flex flex-col gap-10 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                <User className="w-5 h-5 text-[#64748B]" />
              </div>
              <span className="font-bold text-sm">Jane Doe</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-black text-[#94A3B8] uppercase tracking-widest mb-6">
                {t('Trending Hashtags')}
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { tag: '#WebDesign', count: '12.4k' },
                  { tag: '#FramingUI', count: '8.2k' },
                  { tag: '#NextJS', count: '15.1k' },
                  { tag: '#PebbleDesign', count: '5.5k' },
                ].map((item) => (
                  <div
                    key={item.tag}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-sm font-bold text-[#475569] group-hover:text-[#5599CC] transition-colors">
                      {item.tag}
                    </span>
                    <span className="text-xs font-semibold text-[#94A3B8] bg-white px-2 py-1 rounded-full pebble-shadow">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-[#EAF0F5]">
              <h3 className="text-xs font-black text-[#94A3B8] uppercase tracking-widest mb-6">
                {t('Suggested for you')}
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  { name: 'Alice Kim', handle: '@alice_k', avatar: 'AK', color: 'bg-emerald-400' },
                  {
                    name: 'Steve Works',
                    handle: '@steve_ui',
                    avatar: 'SW',
                    color: 'bg-indigo-400',
                  },
                ].map((u) => (
                  <div key={u.handle} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-[14px] ${u.color} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{u.name}</p>
                      <p className="text-xs font-semibold text-[#64748B] truncate">{u.handle}</p>
                    </div>
                    <button className="h-8 px-4 bg-[#F1F5F9] text-[#1D2129] text-[11px] font-bold rounded-full hover:bg-[#E2E8F0] transition-colors">
                      {t('Follow')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Floating Utility Bar */}
        <div className="fixed right-6 bottom-32 flex flex-col gap-3 z-40">
          <button className="w-14 h-14 bg-white pebble-shadow-lg rounded-full flex items-center justify-center text-[#5599CC] hover:scale-110 active:scale-90 transition-all">
            <Send className="w-6 h-6 rotate-[-45deg]" />
          </button>
          <button className="w-14 h-14 bg-white pebble-shadow-lg rounded-full flex items-center justify-center text-[#64748B] hover:scale-110 active:scale-90 transition-all">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
