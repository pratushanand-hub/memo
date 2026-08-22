import React, { useState, useRef, useCallback } from 'react';
import { Mistake } from '../types';
import { 
  Cpu, 
  Sparkles, 
  CheckCircle, 
  Tag, 
  Zap, 
  Activity, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface FloatingMemoryWidgetProps {
  mistakes: Mistake[];
  totalCount: number;
  solvedCount: number;
  mostCommonCategory: string;
  maxCategoryCount: number;
}

export const FloatingMemoryWidget: React.FC<FloatingMemoryWidgetProps> = ({
  mistakes,
  totalCount,
  solvedCount,
  mostCommonCategory,
  maxCategoryCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive mouse tilt state (default resting angle: subtle modern 3D tilt)
  const defaultTilt = { x: 4, y: -7 };
  const [tilt, setTilt] = useState(defaultTilt);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates to -1 ... 1
    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;

    // Calculate subtle parallax tilt (max ~8-10 degrees)
    setTilt({
      x: defaultTilt.x - normalizedY * 8,
      y: defaultTilt.y + normalizedX * 10,
    });
  }, [defaultTilt.x, defaultTilt.y]);

  const handleMouseLeave = () => {
    setTilt(defaultTilt);
  };

  // Calculate solved percentage for circular progress ring
  const solvedPercentage = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (solvedPercentage / 100) * circumference;

  // Recent solved streak / activity calculation
  const solvedMistakes = mistakes.filter(m => m.status === 'solved');
  const hasStreak = solvedMistakes.length > 0;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[460px] flex items-center justify-center perspective-1200 preserve-3d select-none py-6"
    >
      {/* Background Soft Blurred Glow Orbs */}
      <div className="absolute -top-6 -left-6 w-60 h-60 bg-violet-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div 
        className="absolute -bottom-8 -right-6 w-64 h-64 bg-blue-600/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" 
        style={{ animationDelay: '2s' }}
      />
      <div className="absolute inset-x-8 inset-y-12 bg-gray-900/10 rounded-3xl blur-2xl pointer-events-none -z-10" />

      {/* 3D Transform Layer */}
      <div 
        className="relative preserve-3d transition-transform duration-300 ease-out will-change-transform flex w-full max-w-[350px] flex-col gap-3"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0px)`,
        }}
      >
        {/* ========================================================= */}
        {/* SATELLITE CARD 1: Top-Right Orbit (Most Common Category) */}
        {/* ========================================================= */}
        <div 
          className="relative z-30 animate-float-slow preserve-3d self-end"
        >
          <div className="glass-card bg-gray-900/90 backdrop-blur-2xl border border-violet-500/30 px-4 py-3 rounded-2xl shadow-xl shadow-black/40 flex items-center gap-3 group hover:border-violet-400/60 transition-all">
            <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-glow">
              <Tag className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Top Focus</span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
              </div>
              <p className="text-xs font-extrabold text-white truncate max-w-[100px]">
                {mostCommonCategory !== 'None' ? mostCommonCategory : 'General'}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                {maxCategoryCount} {maxCategoryCount === 1 ? 'record' : 'records'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SATELLITE CARD 2: Bottom-Left Orbit (Solved Rate Ring)   */}
        {/* ========================================================= */}
        <div 
          className="relative z-30 animate-float-reverse preserve-3d self-start"
        >
          <div className="glass-card bg-gray-900/90 backdrop-blur-2xl border border-gray-800 px-4 py-3 rounded-2xl shadow-xl shadow-black/40 flex items-center gap-3 group hover:border-violet-500/40 transition-all">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90">
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="stroke-gray-800"
                  strokeWidth="3.5"
                  fill="none"
                />
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="stroke-violet-500 transition-all duration-700 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[10px] font-black text-white">
                {solvedPercentage}%
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Solved Rate</span>
                <CheckCircle className="w-3 h-3 text-violet-400" />
              </div>
              <p className="text-xs font-extrabold text-white">
                {solvedCount} of {totalCount}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">Bugs mastered</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SATELLITE CARD 3: Bottom-Right Orbit (Recall Status Chip)*/}
        {/* ========================================================= */}
        <div 
          className="relative z-20 animate-float-slower preserve-3d self-end"
        >
          <div className="glass-card bg-gray-900/95 backdrop-blur-xl border border-gray-800 px-3.5 py-1.5 rounded-full shadow-lg shadow-black/40 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-[10px] font-bold text-gray-200 tracking-wide flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-violet-400" />
              {hasStreak ? 'Neural Shield Active' : 'Memory Synced'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN TILTED 3D CARD: Neural Memory Core                   */}
        {/* ========================================================= */}
        <div 
          className="order-first w-full glass-card bg-gray-900/85 backdrop-blur-2xl p-7 rounded-3xl border border-violet-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(59,130,246,0.12)] relative overflow-hidden group transition-all duration-300 preserve-3d"
          style={{
            transform: 'translateZ(20px)',
          }}
        >
          {/* Subtle diagonal glass glare sheen */}
          <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-12 pointer-events-none group-hover:translate-x-12 transition-transform duration-700" />

          {/* Top Header Row */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 bg-violet-600/15 border border-violet-500/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400">
                Second Brain
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-950/60 px-2 py-0.5 rounded-full border border-gray-800">
              <Activity className="w-3 h-3 text-violet-400 animate-pulse" />
              <span>v2.0</span>
            </div>
          </div>

          {/* Central Brain/Circuit Visual */}
          <div className="my-6 flex flex-col items-center justify-center relative z-10">
            {/* Glowing Rings & Core Icon */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer pulsing neon ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/30 animate-spin" style={{ animationDuration: '24s' }} />
              <div className="absolute inset-2 rounded-full border border-blue-500/35 animate-pulse" />
              
              {/* Soft glow center aura */}
              <div className="absolute inset-3 rounded-2xl bg-gradient-to-tr from-violet-600/20 via-blue-600/20 to-violet-600/20 blur-md" />
              
              {/* Core Icon Box */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-violet-500/40 shadow-glow flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform duration-300">
                <Cpu className="w-8 h-8 text-violet-400" />
                <Zap className="w-3.5 h-3.5 text-blue-400 absolute -top-1 -right-1 fill-blue-400" />
              </div>
            </div>

            {/* Main Stats Display */}
            <div className="text-center mt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Total Memories Indexed
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <span className="text-4xl font-black text-white tracking-tight">
                  {totalCount}
                </span>
                <span className="text-xs font-bold text-violet-300 bg-violet-600/15 border border-violet-500/30 px-2 py-0.5 rounded-md">
                  {totalCount === 1 ? '1 bug' : `${totalCount} bugs`}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5 max-w-[230px] mx-auto font-medium">
                Preventing regressions and accelerating debug recall
              </p>
            </div>
          </div>

          {/* Activity / Memory Bars Visualizer */}
          <div className="pt-4 border-t border-gray-800/80 relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-400">Recall Index:</span>
              <div className="flex items-end gap-1 h-3.5">
                <div className="w-1 bg-violet-600 rounded-full h-2 animate-pulse" />
                <div className="w-1 bg-blue-600 rounded-full h-3.5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 bg-violet-500 rounded-full h-2.5 animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="w-1 bg-blue-500 rounded-full h-3 animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>

            <div className="text-[11px] font-extrabold text-violet-300 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>100% Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
