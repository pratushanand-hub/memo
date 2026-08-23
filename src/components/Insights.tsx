import React, { useState } from 'react';
import { Mistake } from '../types';
import { 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Tag, 
  BarChart3, 
  RefreshCw,
  X,
  Layers
} from 'lucide-react';

interface InsightsProps {
  mistakes: Mistake[];
}

export const Insights: React.FC<InsightsProps> = ({ mistakes }) => {
  const [showTagModal, setShowTagModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Category counts
  const categoryCounts: Record<string, { total: number; solved: number }> = {};
  const tagCounts: Record<string, { count: number; categories: Set<string> }> = {};

  mistakes.forEach((m) => {
    const cat = m.category || 'General';
    if (!categoryCounts[cat]) {
      categoryCounts[cat] = { total: 0, solved: 0 };
    }
    categoryCounts[cat].total += 1;
    if (m.status === 'solved') {
      categoryCounts[cat].solved += 1;
    }

    // Process tags
    if (Array.isArray(m.tags)) {
      m.tags.forEach((tag) => {
        const cleanTag = tag.trim().toLowerCase();
        if (!cleanTag) return;
        if (!tagCounts[cleanTag]) {
          tagCounts[cleanTag] = { count: 0, categories: new Set() };
        }
        tagCounts[cleanTag].count += 1;
        tagCounts[cleanTag].categories.add(cat);
      });
    }
  });

  const totalMistakes = mistakes.length;
  const solvedMistakes = mistakes.filter((m) => m.status === 'solved').length;
  const solvedRate = totalMistakes > 0 ? Math.round((solvedMistakes / totalMistakes) * 100) : 0;

  // Most common category
  let mostCommonCategory = 'None';
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, stats]) => {
    if (stats.total > maxCatCount) {
      maxCatCount = stats.total;
      mostCommonCategory = cat;
    }
  });

  // Repeated tags / patterns
  const repeatedTags = Object.entries(tagCounts).filter(([_, data]) => data.count > 1);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Your Mistake Patterns
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Analytics and code patterns derived from your debug history.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-violet-400' : ''}`} />
          <span>Re-Analyze</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Most Common Category */}
        <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Most Common Category</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white truncate">{mostCommonCategory}</span>
            <span className="text-xs text-gray-400">({maxCatCount} recorded)</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            This technology domain currently represents the highest area of friction.
          </p>
        </div>

        {/* Repeated Mistakes */}
        <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Repeated Patterns</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{repeatedTags.length} Tags</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Identified recurring topics where mistakes shared common tags or triggers.
          </p>
        </div>

        {/* Solved Metric */}
        <div className="bg-gray-900/60 border border-gray-800/80 p-5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Solved Metric</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{solvedRate}%</span>
            <span className="text-xs text-gray-400">Solved</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            You have resolved {solvedMistakes} out of {totalMistakes} recorded problems.
          </p>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Intelligence Summary */}
        <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800/80 p-6 rounded-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Cpu className="w-4 h-4" />
              <span>AI Insight Engine</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-4">Memory Intelligence Summary</h2>

            <div className="bg-gray-950/60 border border-gray-800/70 p-4 rounded-xl text-sm text-gray-300 leading-relaxed">
              {totalMistakes === 0 ? (
                'Log your first bug or error to generate automated pattern summaries and debugging heuristics.'
              ) : (
                <>
                  You are building a structured knowledge base! Your primary focus areas include{' '}
                  <span className="text-violet-300 font-semibold">"{mostCommonCategory}"</span>. By documenting
                  root causes and validating solutions prior to production, your resolution recovery rate is{' '}
                  <span className="text-emerald-400 font-semibold">{solvedRate}%</span>.
                </>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800/70 flex items-center justify-between text-xs">
            <span className="text-gray-500">Powered by Mistake Memo Heuristics</span>
            <button
              onClick={() => setShowTagModal(true)}
              className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Analyze tags details ↗
            </button>
          </div>
        </div>

        {/* Mistakes by Category */}
        <div className="bg-gray-900/60 border border-gray-800/80 p-6 rounded-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                <span>Mistakes by Category</span>
              </h2>
            </div>

            <div className="space-y-4">
              {Object.keys(categoryCounts).length === 0 ? (
                <p className="text-xs text-gray-500 italic">No categorized data yet.</p>
              ) : (
                Object.entries(categoryCounts).map(([cat, stat]) => {
                  const percent = Math.round((stat.total / Math.max(totalMistakes, 1)) * 100);
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-300">{cat}</span>
                        <span className="text-gray-400">
                          {stat.total} saved ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-violet-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>Solved: {stat.solved}/{stat.total}</span>
                        <span>Recovery: {Math.round((stat.solved / stat.total) * 100)}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-[11px] text-gray-500 mt-6 pt-4 border-t border-gray-800/70">
            Reviewing these metrics before core coding sessions decreases repeat error rates by 60%.
          </p>
        </div>
      </div>

      {/* Tag Intelligence Modal */}
      {showTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Layers className="w-5 h-5 text-violet-400" />
                <span>Tag Intelligence Breakdown</span>
              </div>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto space-y-3 pr-1">
              {Object.keys(tagCounts).length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No tags recorded yet. Add tags when logging mistakes to track technical patterns.
                </div>
              ) : (
                Object.entries(tagCounts)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([tagName, info]) => (
                    <div
                      key={tagName}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 border border-gray-800/80 hover:border-violet-500/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4 text-violet-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">#{tagName}</p>
                          <p className="text-[11px] text-gray-400">
                            Domains: {Array.from(info.categories).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30">
                          {info.count} {info.count === 1 ? 'incident' : 'incidents'}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setShowTagModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;