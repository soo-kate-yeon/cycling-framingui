'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  Activity,
  PieChart,
  Users,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Layers,
  BarChart3,
  LineChart,
  Globe,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const t = (en: string) => en;

// Mock Trading Data
const CHART_DATA = [
  { time: '09:00', price: 70243, volume: 1.2, status: 'up' },
  { time: '10:00', price: 70500, volume: 2.1, status: 'up' },
  { time: '11:00', price: 70150, volume: 1.8, status: 'down' },
  { time: '12:00', price: 70320, volume: 0.9, status: 'up' },
  { time: '13:00', price: 70680, volume: 3.2, status: 'up' },
  { time: '14:00', price: 70400, volume: 1.5, status: 'down' },
  { time: '15:00', price: 70210, volume: 2.4, status: 'down' },
  { time: '16:00', price: 70850, volume: 4.1, status: 'up' },
  { time: '17:00', price: 70920, volume: 1.2, status: 'up' },
  { time: '18:00', price: 70700, volume: 0.8, status: 'down' },
  { time: '19:00', price: 70980, volume: 2.2, status: 'up' },
  { time: '20:00', price: 71200, volume: 3.5, status: 'up' },
];

const ORDER_BOOK = {
  asks: [
    { price: 71249.88, amount: 0.655, total: 46682 },
    { price: 71249.87, amount: 0.3145, total: 22408 },
    { price: 71249.4, amount: 0.2135, total: 15212 },
    { price: 71249.38, amount: 0.01, total: 712 },
    { price: 71247.66, amount: 0.1, total: 7124 },
    { price: 71245.72, amount: 0.0086, total: 612 },
    { price: 71243.23, amount: 15.0295, total: 1070808 },
  ],
  bids: [
    { price: 71243.22, amount: 0.0308, total: 2194 },
    { price: 71242.53, amount: 0.0355, total: 2529 },
    { price: 71241.79, amount: 0.1802, total: 12837 },
    { price: 71240.8, amount: 0.0213, total: 1517 },
    { price: 71239.32, amount: 0.3559, total: 25354 },
    { price: 71238.91, amount: 0.1423, total: 10137 },
    { price: 71238.86, amount: 0.006, total: 427 },
  ],
};

const TRADES = [
  { id: 1, time: '20:45:12', price: 71243.23, size: 0.015, side: 'buy' },
  { id: 2, time: '20:45:08', price: 71242.1, size: 1.24, side: 'sell' },
  { id: 3, time: '20:45:01', price: 71242.1, size: 0.005, side: 'sell' },
  { id: 4, time: '20:44:55', price: 71243.45, size: 0.45, side: 'buy' },
  { id: 5, time: '20:44:50', price: 71243.23, size: 0.01, side: 'buy' },
];

export default function DarkBoldnessTradingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        body {
          background-color: #000000;
        }

        .font-sans {
          font-family: 'Inter', sans-serif;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .kinetic-orange {
          color: #dd8855;
        }
        .electric-blue {
          color: #5599dd;
        }
        .bg-kinetic-orange {
          background-color: #dd8855;
        }
        .bg-electric-blue {
          background-color: #5599dd;
        }
        .border-kinetic-orange {
          border-color: #dd8855;
        }
        .border-electric-blue {
          border-color: #5599dd;
        }

        .trading-grid {
          display: grid;
          grid-template-columns: 64px 1fr 340px;
          grid-template-rows: 64px 1fr 280px;
          height: 100vh;
        }

        @media (max-width: 1200px) {
          .trading-grid {
            grid-template-columns: 64px 1fr;
            grid-template-rows: 64px 1fr 1fr;
          }
          .right-panel {
            grid-column: 2;
            grid-row: 3;
            border-left: none;
            border-top: 1px solid #1f2937;
          }
        }
      `}</style>

      <div className="trading-grid overflow-hidden">
        {/* Top Header - Trade Pair Info */}
        <header className="col-span-3 border-b border-neutral-800 bg-black flex items-center px-6 gap-8 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-none flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-tighter">BTC-USD</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {t('Bitcoin / US Dollar')}
              </span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-neutral-800" />

          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-lg font-black electric-blue">$71,243.23</span>
              <span className="text-[10px] font-bold electric-blue uppercase tracking-widest">
                +2.45%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {t('24H VOLUME')}
              </span>
              <span className="text-sm font-bold text-neutral-300">1,243.52 BTC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {t('24H HIGH')}
              </span>
              <span className="text-sm font-bold text-neutral-300">$71,850.00</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {t('24H LOW')}
              </span>
              <span className="text-sm font-bold text-neutral-300">$69,420.00</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button className="h-10 px-6 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition-colors text-[10px] font-black uppercase tracking-widest">
              {t('Deposit')}
            </button>
            <button className="h-10 px-6 bg-white text-black hover:bg-neutral-200 transition-colors text-[10px] font-black uppercase tracking-widest">
              {t('Withdraw')}
            </button>
            <div className="w-10 h-10 flex items-center justify-center border border-neutral-800 hover:bg-neutral-900 transition-colors">
              <Settings className="w-4 h-4 text-neutral-500" />
            </div>
          </div>
        </header>

        {/* Left Global Nav */}
        <aside className="row-span-2 border-r border-neutral-800 bg-black flex flex-col items-center py-6 gap-8 z-10">
          <div className="w-10 h-10 flex items-center justify-center rounded-none bg-white">
            <Layers className="w-6 h-6 text-black" />
          </div>

          <nav className="flex flex-col gap-6">
            {[
              { icon: Activity, label: t('Trade'), active: true },
              { icon: PieChart, label: t('Portfolio'), active: false },
              { icon: Clock, label: t('Orders'), active: false },
              { icon: Users, label: t('Referral'), active: false },
              { icon: Globe, label: t('Explore'), active: false },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-12 h-12 flex items-center justify-center transition-all ${item.active ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-6">
            <button className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-white">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-neutral-800 rounded-none overflow-hidden border border-neutral-700">
              <div className="w-full h-full bg-gradient-to-br from-neutral-600 to-black" />
            </div>
          </div>
        </aside>

        {/* Main Chart Section */}
        <main className="bg-black flex flex-col overflow-hidden">
          {/* Chart Controls */}
          <div className="h-12 border-b border-neutral-800 flex items-center px-6 gap-6">
            <div className="flex items-center gap-1">
              {['5m', '15m', '1h', '4h', '1D', '1W'].map((t) => (
                <button
                  key={t}
                  className={`h-8 px-3 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-900 transition-colors ${t === '1h' ? 'text-white bg-neutral-900' : 'text-neutral-500'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="h-6 w-[1px] bg-neutral-800" />
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors">
                <BarChart3 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors">
                <LineChart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-1 p-6 relative">
            <div className="absolute top-8 left-10 z-10">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-black tracking-widest uppercase">
                  BTC/USD {t('INDEX')}
                </span>
                <span className="text-sm font-bold electric-blue">71,243.23</span>
                <span className="text-sm font-bold text-neutral-500">-0.01%</span>
              </div>
              <div className="flex gap-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                <span>O 71,180.50</span>
                <span>H 71,320.00</span>
                <span>L 71,050.20</span>
                <span>C 71,243.23</span>
              </div>
            </div>

            <div className="w-full h-full mt-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#171717" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#404040', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#404040', fontSize: 10, fontWeight: 700 }}
                    domain={['dataMin - 500', 'dataMax + 500']}
                  />
                  <Tooltip
                    cursor={{ fill: '#171717' }}
                    contentStyle={{
                      backgroundColor: '#000',
                      border: '1px solid #262626',
                      borderRadius: 0,
                    }}
                    itemStyle={{ fontSize: 12, fontWeight: 700 }}
                  />
                  <Bar dataKey="price" radius={0}>
                    {CHART_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.status === 'up' ? '#5599DD' : '#DD8855'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>

        {/* Right Panel - Order Book & Trade Entry */}
        <aside className="right-panel col-start-3 row-start-2 row-span-2 border-l border-neutral-800 bg-black flex flex-col overflow-hidden">
          {/* Panel Tabs */}
          <div className="h-12 border-b border-neutral-800 flex items-center px-2">
            <button className="flex-1 h-full text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-white">
              {t('ORDER BOOK')}
            </button>
            <button className="flex-1 h-full text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-neutral-400">
              {t('RECENT TRADES')}
            </button>
          </div>

          {/* Order Book Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[11px] p-2">
            {/* Header */}
            <div className="grid grid-cols-3 text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-2 py-3">
              <span>{t('PRICE (USD)')}</span>
              <span className="text-right">{t('AMT (BTC)')}</span>
              <span className="text-right">{t('TOTAL')}</span>
            </div>

            {/* Asks (Sells) */}
            <div className="flex flex-col-reverse">
              {ORDER_BOOK.asks.map((ask, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 px-2 py-1.5 hover:bg-neutral-900/50 relative group cursor-pointer transition-colors"
                >
                  <div
                    className="absolute inset-y-0 right-0 bg-kinetic-orange/10 pointer-events-none"
                    style={{ width: `${(ask.amount / 16) * 100}%` }}
                  />
                  <span className="kinetic-orange font-bold relative z-10">
                    {ask.price.toLocaleString()}
                  </span>
                  <span className="text-right text-neutral-300 relative z-10">
                    {ask.amount.toFixed(4)}
                  </span>
                  <span className="text-right text-neutral-500 relative z-10">
                    {ask.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Current Price Divider */}
            <div className="my-4 py-4 border-y border-neutral-900 flex items-center justify-between px-2 bg-neutral-950/50">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black electric-blue">71,243.23</span>
                <TrendingUp className="w-4 h-4 electric-blue" />
              </div>
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                $71,242.10 INDEX
              </span>
            </div>

            {/* Bids (Buys) */}
            <div className="flex flex-col">
              {ORDER_BOOK.bids.map((bid, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 px-2 py-1.5 hover:bg-neutral-900/50 relative group cursor-pointer transition-colors"
                >
                  <div
                    className="absolute inset-y-0 right-0 bg-electric-blue/10 pointer-events-none"
                    style={{ width: `${(bid.amount / 0.5) * 100}%` }}
                  />
                  <span className="electric-blue font-bold relative z-10">
                    {bid.price.toLocaleString()}
                  </span>
                  <span className="text-right text-neutral-300 relative z-10">
                    {bid.amount.toFixed(4)}
                  </span>
                  <span className="text-right text-neutral-500 relative z-10">
                    {bid.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Entry Form */}
          <div className="border-t border-neutral-800 p-6 bg-black">
            <div className="flex gap-2 mb-6 p-1 bg-neutral-900 rounded-none h-12">
              <button className="flex-1 bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                {t('Buy')}
              </button>
              <button className="flex-1 text-neutral-500 hover:text-white text-[10px] font-bold uppercase tracking-widest">
                {t('Sell')}
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    {t('ORDER TYPE')}
                  </label>
                </div>
                <div className="h-11 w-full border border-neutral-800 bg-neutral-950 flex items-center justify-between px-4">
                  <span className="text-sm font-bold uppercase tracking-widest">{t('Limit')}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-600 rotate-90" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <label className="text-neutral-500">{t('PRICE')}</label>
                  <span className="text-neutral-500">USD</span>
                </div>
                <div className="h-11 w-full border border-neutral-800 bg-neutral-950 flex items-center justify-between px-4 focus-within:border-white transition-colors">
                  <input
                    type="text"
                    defaultValue="71,243.23"
                    className="bg-transparent border-none outline-none text-sm font-bold w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <label className="text-neutral-500">{t('AMOUNT')}</label>
                  <span className="text-neutral-500">BTC</span>
                </div>
                <div className="h-11 w-full border border-neutral-800 bg-neutral-950 flex items-center justify-between px-4 focus-within:border-white transition-colors">
                  <input
                    type="text"
                    placeholder="0.00"
                    className="bg-transparent border-none outline-none text-sm font-bold w-full"
                  />
                </div>
              </div>
            </div>

            <button className="w-full h-14 bg-white text-black text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3">
              {t('Execute Order')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Bottom Panel - List Views */}
        <section className="col-start-2 col-span-1 border-t border-neutral-800 bg-black flex flex-col overflow-hidden">
          <div className="h-12 border-b border-neutral-800 flex items-center px-6 gap-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`h-full text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'orders' ? 'text-white' : 'text-neutral-600'}`}
            >
              {t('ACTIVE ORDERS')}
              {activeTab === 'orders' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`h-full text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'history' ? 'text-white' : 'text-neutral-600'}`}
            >
              {t('TRADE HISTORY')}
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
            <div className="ml-auto flex items-center gap-4 text-neutral-600">
              <button className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                {t('CANCEL ALL')}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-neutral-900 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  <th className="px-6 py-4">{t('TIME')}</th>
                  <th className="px-6 py-4">{t('MARKET')}</th>
                  <th className="px-6 py-4">{t('TYPE')}</th>
                  <th className="px-6 py-4">{t('SIDE')}</th>
                  <th className="px-6 py-4 text-right">{t('PRICE')}</th>
                  <th className="px-6 py-4 text-right">{t('AMOUNT')}</th>
                  <th className="px-6 py-4 text-right">{t('FILLED')}</th>
                  <th className="px-6 py-4 text-right">{t('STATUS')}</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-bold uppercase tracking-tighter">
                {activeTab === 'orders' ? (
                  <tr className="border-b border-neutral-950 text-neutral-400">
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-neutral-600 font-bold uppercase tracking-widest"
                    >
                      {t('NO ACTIVE ORDERS FOUND')}
                    </td>
                  </tr>
                ) : (
                  TRADES.map((trade) => (
                    <tr
                      key={trade.id}
                      className="border-b border-neutral-950 hover:bg-neutral-900/40 transition-colors group"
                    >
                      <td className="px-6 py-3.5 text-neutral-500">{trade.time}</td>
                      <td className="px-6 py-3.5 text-white">BTC-USD</td>
                      <td className="px-6 py-3.5 text-neutral-400">LIMIT</td>
                      <td
                        className={`px-6 py-3.5 font-black ${trade.side === 'buy' ? 'electric-blue' : 'kinetic-orange'}`}
                      >
                        {trade.side}
                      </td>
                      <td className="px-6 py-3.5 text-right text-white">
                        ${trade.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-neutral-300">
                        {trade.size.toFixed(3)} BTC
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <span className="text-neutral-500">100.00%</span>
                          <div className="w-8 h-1 bg-neutral-800">
                            <div className="h-full bg-white w-full" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="px-2 py-0.5 border border-neutral-800 text-neutral-500 text-[9px] font-black">
                          {t('COMPLETED')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Floating Status Bar - Elite Aesthetic */}
      <footer className="fixed bottom-0 left-0 right-0 h-6 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-electric-blue rounded-none animate-pulse" />
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
              {t('NETWORK: STABLE')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-neutral-600" />
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
              {t('LATENCY: 12ms')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
            © 2026 FRAMINGUI ELITE TRADER V4.0
          </span>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-white" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">
              SECURE SESSION AC-592
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
