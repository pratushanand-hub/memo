import React, { useState } from 'react';
import { Mistake } from '../types';
import { 
  Database, 
  CheckCircle, 
  Tag, 
  Clock, 
  ArrowRight, 
  Search, 
  TrendingUp, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { FloatingMemoryWidget } from './FloatingMemoryWidget';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DashboardProps {
  mistakes: Mistake[];
  onNavigateToTab: (tabId: string, initialQuery?: string) => void;
  onViewMistake: (mistake: Mistake) => void;
}

const polarPoint = (cx: number, cy: number, radius: number, angle: number) => ({
  x: cx + radius * Math.cos((angle - 90) * Math.PI / 180),
  y: cy + radius * Math.sin((angle - 90) * Math.PI / 180),
});

const piePath = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarPoint(cx, cy, radius, endAngle);
  const end = polarPoint(cx, cy, radius, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
};

const darkenHex = (hex: string) => {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.max(0, Math.floor(((value >> shift) & 255) * 0.6)).toString(16).padStart(2, '0');
  return `#${channel(16)}${channel(8)}${channel(0)}`;
};

export const Dashboard: React.FC<DashboardProps> = ({ mistakes, onNavigateToTab, onViewMistake }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const totalCount = mistakes.length;
  const solvedCount = mistakes.filter(m => m.status === 'solved').length;
  
  // Find most common category
  const categories: { [key: string]: number } = {};
  mistakes.forEach(m => {
    categories[m.category] = (categories[m.category] || 0) + 1;
  });
  
  let mostCommonCategory = 'None';
  let maxCount = 0;
  Object.entries(categories).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonCategory = name;
    }
  });

  const chartColors = ['#0A1128', '#CBD5E1', '#1F2937', '#0F766E', '#1E3A8A', '#164E63'];
  const categoryChartData = Object.entries(categories)
    .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value, percentage: totalCount ? Math.round((value / totalCount) * 100) : 0 }));

  const timelineBuckets = new Map<string, { timestamp: number; label: string; logged: number; solved: number }>();
  mistakes.forEach((mistake) => {
    const date = new Date(mistake.createdAt);
    const key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime().toString();
    const existing = timelineBuckets.get(key) ?? {
      timestamp: Number(key),
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      logged: 0,
      solved: 0,
    };
    existing.logged += 1;
    existing.solved += mistake.status === 'solved' ? 1 : 0;
    timelineBuckets.set(key, existing);
  });
  const timelineData = Array.from(timelineBuckets.values()).sort((first, second) => first.timestamp - second.timestamp);

  const recentMistakes = [...mistakes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateToTab('ask-memory', searchQuery);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header and Greeting */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h2>
        <p className="text-gray-400 mt-1">Don't repeat mistakes. Learn from your past self.</p>
      </div>

      {/* Top Hero / Stats & 3D Floating Widget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: 4 Stat Cards + AI Memory Search */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stat 1: Total Saved */}
            <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-all duration-300"></div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Saved</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{totalCount}</h3>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                  Developer memories
                </p>
              </div>
              <div className="bg-violet-600/10 p-3.5 rounded-xl border border-violet-500/20 text-violet-400 shadow-glow">
                <Database className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 2: Problems Solved */}
            <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all duration-300"></div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Problems Solved</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{solvedCount}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {totalCount > 0 ? `${Math.round((solvedCount / totalCount) * 100)}% solved rate` : '0% solved rate'}
                </p>
              </div>
              <div className="bg-emerald-600/10 p-3.5 rounded-xl border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 3: Categories */}
            <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-all duration-300"></div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1">{Object.keys(categories).length}</h3>
                <p className="text-xs text-gray-400 mt-1">Different contexts</p>
              </div>
              <div className="bg-blue-600/10 p-3.5 rounded-xl border border-blue-500/20 text-blue-400 shadow-glow-blue">
                <Tag className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 4: Common Category */}
            <div className="glass-card p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/5 rounded-full blur-2xl group-hover:bg-amber-600/10 transition-all duration-300"></div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Common Category</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1.5 truncate max-w-[150px]">{mostCommonCategory}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {maxCount} {maxCount === 1 ? 'mistake' : 'mistakes'} recorded
                </p>
              </div>
              <div className="bg-amber-600/10 p-3.5 rounded-xl border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Prominent AI Search Box */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-violet-500/20 shadow-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="max-w-2xl">
              <span className="text-xs text-violet-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Memory Search
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-2">What problem are you facing today?</h3>
              <p className="text-gray-400 mt-1.5 text-sm">
                Describe the bug or crash you are experiencing. Mistake Memo will parse your past developers memories to search if you have encountered it before.
              </p>

              <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. My Java program is crashing when I access elements in an array inside a loop."
                    className="w-full bg-gray-950/70 border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow whitespace-nowrap"
                >
                  Search Memory
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Floating Memory Widget (Large Screens) */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 h-full items-center justify-center">
          <FloatingMemoryWidget
            mistakes={mistakes}
            totalCount={totalCount}
            solvedCount={solvedCount}
            mostCommonCategory={mostCommonCategory}
            maxCategoryCount={maxCount}
          />
        </div>
      </div>

      {/* Memory analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <section className="xl:col-span-5 glass-card p-6 rounded-3xl border border-violet-500/15 relative overflow-hidden">
          <div className="absolute -top-20 -right-16 w-52 h-52 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.18em]">Distribution</p>
              <h3 className="mt-1 text-lg font-extrabold text-white">Mistakes by Category</h3>
              <p className="mt-1 text-xs text-gray-400">Where your debugging effort is concentrated.</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-violet-300">
              {totalCount} total
            </div>
          </div>

          {categoryChartData.length > 0 ? (
            <div className="relative mt-3 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_150px] items-center gap-2">
              <svg viewBox="0 0 360 250" className="h-[220px] w-full overflow-visible" role="img" aria-label="Mistakes by category chart">
                <defs><filter id="pieShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.2" /></filter></defs>
                {(() => {
                  let angle = 0;
                  return categoryChartData.map((category, index) => {
                    const sweep = (category.value / totalCount) * 360;
                    const start = angle + 1.5;
                    const end = angle + sweep - 1.5;
                    const middle = angle + sweep / 2;
                    const color = chartColors[index % chartColors.length];
                    const labelPoint = polarPoint(164, 108, 112, middle);
                    const edgePoint = polarPoint(164, 108, 83, middle);
                    const textAnchor = labelPoint.x > 164 ? 'start' : 'end';
                    angle += sweep;
                    return <g key={category.name} filter="url(#pieShadow)">
                      <path d={piePath(164, 120, 83, start, end)} fill={darkenHex(color)} />
                      <path d={piePath(164, 108, 83, start, end)} fill={color} stroke="#ffffff" strokeWidth="2" />
                      <path d={`M ${edgePoint.x} ${edgePoint.y} L ${labelPoint.x} ${labelPoint.y} L ${labelPoint.x + (textAnchor === 'start' ? 11 : -11)} ${labelPoint.y}`} fill="none" stroke={index === 1 ? '#64748b' : color} strokeWidth="1.5" />
                      <text x={labelPoint.x + (textAnchor === 'start' ? 14 : -14)} y={labelPoint.y - 2} textAnchor={textAnchor} className="fill-slate-700 text-[10px] font-bold">{category.name}</text>
                      <text x={labelPoint.x + (textAnchor === 'start' ? 14 : -14)} y={labelPoint.y + 11} textAnchor={textAnchor} className="fill-slate-500 text-[9px]">{category.percentage}%</text>
                    </g>;
                  });
                })()}
              </svg>
              <div className="space-y-2.5 pr-1">
                {categoryChartData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="flex min-w-0 items-center gap-1.5 text-gray-300"><i className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} /> <span className="truncate">{category.name}</span></span>
                    <span className="shrink-0 font-semibold text-violet-200">{category.value} · {category.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-violet-500/20 bg-gray-950/30 text-center text-sm text-gray-500">Save a memory to see your category breakdown.</div>
          )}
        </section>

        <section className="xl:col-span-7 glass-card p-6 rounded-3xl border border-violet-500/15 relative overflow-hidden">
          <div className="absolute -bottom-24 right-0 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.18em]">Activity timeline</p>
              <h3 className="mt-1 text-lg font-extrabold text-white">Mistakes Solved Over Time</h3>
              <p className="mt-1 text-xs text-gray-400">Memories recorded and resolved, grouped by day.</p>
            </div>
            <div className="mt-2 flex gap-3 text-[11px] font-medium text-gray-400 sm:mt-0">
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-violet-400" /> Logged</span>
              <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-indigo-400" /> Solved</span>
            </div>
          </div>

          {timelineData.length > 0 ? (
            <div className="relative mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="loggedGlow" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="solvedGlow" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(96, 165, 250, 0.16)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#122048', border: '1px solid rgba(96, 165, 250, 0.3)', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)' }}
                    labelStyle={{ color: '#bfdbfe', fontWeight: 700 }}
                    itemStyle={{ color: '#dbeafe' }}
                  />
                  <Area type="monotone" dataKey="logged" name="Logged" stroke="#3b82f6" strokeWidth={2.5} fill="url(#loggedGlow)" />
                  <Area type="monotone" dataKey="solved" name="Solved" stroke="#38bdf8" strokeWidth={2.5} fill="url(#solvedGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-6 flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-violet-500/20 bg-gray-950/30 text-center text-sm text-gray-500">Your solved-memory timeline will appear here.</div>
          )}
        </section>
      </div>

      {/* Recent Mistakes List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Recent Memories
          </h3>
          <button 
            onClick={() => onNavigateToTab('memories')}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-all"
          >
            View All Memories
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {totalCount === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-gray-800/50">
            <Database className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No memories saved yet. Start by saving your first mistake!</p>
            <button
              onClick={() => onNavigateToTab('add-mistake')}
              className="mt-4 inline-flex items-center gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-xl text-sm transition-all"
            >
              Add New Mistake
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentMistakes.map((mistake) => (
              <div 
                key={mistake.id} 
                onClick={() => onViewMistake(mistake)}
                className="glass-card glass-card-hover p-6 rounded-2xl cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Category and Date Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-violet-400 tracking-wider bg-violet-600/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                      {mistake.category}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {new Date(mistake.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-white text-base leading-snug group-hover:text-violet-400 transition-colors">
                    {mistake.title}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-400 text-xs mt-2.5 line-clamp-3 leading-relaxed">
                    {mistake.description}
                  </p>
                </div>

                {/* Status and Tags Footer */}
                <div className="mt-5 pt-4 border-t border-gray-800/80">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mistake.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[9px] text-gray-500 font-semibold bg-gray-950 px-1.5 py-0.5 rounded border border-gray-900">
                        #{tag}
                      </span>
                    ))}
                    {mistake.tags.length > 3 && (
                      <span className="text-[9px] text-gray-500 font-semibold bg-gray-950 px-1.5 py-0.5 rounded border border-gray-900">
                        +{mistake.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      mistake.status === 'solved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${mistake.status === 'solved' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      {mistake.status === 'solved' ? 'Solved' : 'Investigating'}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
