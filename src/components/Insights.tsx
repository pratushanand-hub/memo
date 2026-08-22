import React, { useState, useEffect } from 'react';
import { Mistake, InsightData } from '../types';
import { getInsights } from '../utils/insights';
import { 
  Sparkles, 
  BarChart2, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Zap
} from 'lucide-react';

interface InsightsProps {
  mistakes: Mistake[];
}

export const Insights: React.FC<InsightsProps> = ({ mistakes }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InsightData | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const result = await getInsights(mistakes);
      setData(result);
    } catch (e) {
      console.error('Failed to load insights', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [mistakes]);

  if (loading) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Mistake Patterns</h2>
          <p className="text-gray-400 mt-1">Analytics and code patterns derived from your debug history.</p>
        </div>
        
        <div className="glass-card py-24 text-center rounded-3xl border border-gray-800 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin"></div>
          <p className="text-gray-400 text-sm">Aggregating debugging patterns and compiling suggestions...</p>
        </div>
      </div>
    );
  }

  if (!data || mistakes.length === 0) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Mistake Patterns</h2>
          <p className="text-gray-400 mt-1">Analytics and code patterns derived from your debug history.</p>
        </div>

        <div className="glass-card p-16 text-center rounded-3xl border border-gray-800/80 flex flex-col items-center justify-center">
          <BarChart2 className="w-12 h-12 text-gray-600 mb-3" />
          <h3 className="text-white font-bold text-lg">No Analytics Available Yet</h3>
          <p className="text-gray-400 text-sm mt-1 max-w-sm">
            Save at least one mistake in your database to let Mistake-Memo AI run pattern matching on your workflow.
          </p>
        </div>
      </div>
    );
  }

  // Calculate percentages for category display
  const maxCategoryCount = Math.max(...data.categorySummary.map(c => c.count), 1);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Mistake Patterns</h2>
          <p className="text-gray-400 mt-1">Analytics and code patterns derived from your debug history.</p>
        </div>
        <button
          onClick={fetchInsights}
          className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-Analyze
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Most Common Category */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Most Common Category
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-2 flex items-baseline gap-2">
            {data.mostCommonCategory}
            <span className="text-xs text-gray-400 font-normal">
              ({data.categorySummary[0]?.count || 0} recorded)
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-2">
            This technology domain currently represents the highest area of friction.
          </p>
        </div>

        {/* Metric 2: Repeated Mistakes */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> Repeated Mistakes
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-2">
            {data.repeatedMistakesCount} {data.repeatedMistakesCount === 1 ? 'Category' : 'Categories'}
          </h3>
          <p className="text-xs text-gray-400 mt-2">
            Identified repeating topics where mistakes shared tags or triggers.
          </p>
        </div>

        {/* Metric 3: Improvement Trend */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl"></div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Solved Metric
          </span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-2 flex items-baseline gap-1">
            {Math.round((data.solvedCount / data.totalCount) * 100)}%
            <span className="text-xs text-gray-400 font-normal">Solved</span>
          </h3>
          <p className="text-xs text-gray-400 mt-2 truncate">
            {data.improvementTrend}
          </p>
        </div>
      </div>

      {/* Main Grid: AI Insights (Left) & Category Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insight Box */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-violet-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div>
            <span className="text-xs text-violet-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Insight Engine
            </span>
            <h3 className="text-xl font-extrabold text-white mt-3 leading-snug">
              Memory Intelligence Summary
            </h3>
            
            <div className="mt-5 p-5 bg-gray-950/50 rounded-2xl border border-gray-900/60 leading-relaxed text-sm text-gray-300">
              {data.aiInsightText}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-900 flex items-center justify-between text-xs text-gray-500">
            <span>Powered by Mistake-Memo Heuristics</span>
            <span className="flex items-center gap-1 text-violet-400 font-semibold cursor-pointer hover:underline">
              Analyze tags details <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Category Breakdown (Custom Bars) */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Mistakes by Category</h4>
            
            <div className="space-y-4">
              {data.categorySummary.map((cat, i) => {
                const percent = Math.round((cat.count / data.totalCount) * 100);
                const widthPercent = (cat.count / maxCategoryCount) * 100;
                
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-300">{cat.name}</span>
                      <span className="text-gray-400">{cat.count} saved ({percent}%)</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${widthPercent}%` }} 
                        className="h-full bg-gradient-to-r from-violet-600 to-blue-500 rounded-full"
                      />
                    </div>
                    {/* Solved Ratio */}
                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                      <span>Solved: {cat.solved}/{cat.count}</span>
                      <span>Recovery Rate: {Math.round((cat.solved / cat.count) * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-900 text-center">
            <span className="text-[10px] text-gray-500 font-medium">
              Reviewing these metrics before core coding sessions decreases repeat error rates by 60%.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
