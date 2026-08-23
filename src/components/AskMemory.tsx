import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, BookmarkPlus } from 'lucide-react';
import { Mistake, SimilarityResult } from '../types';
import { searchMemory } from '../utils/similarity';

interface AskMemoryProps {
  mistakes: Mistake[];
  initialQuery?: string;
  onViewFullMemory?: (id: string) => void;
  onSaveAsNewMistake?: (query: string, matchedMistakeId: string) => void;
}

export const AskMemory: React.FC<AskMemoryProps> = ({
  mistakes,
  initialQuery = '',
  onViewFullMemory,
  onSaveAsNewMistake
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<SimilarityResult | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (textToSearch?: string) => {
    const searchText = (typeof textToSearch === 'string' ? textToSearch : query).trim();
    if (!searchText) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const matchResult = await searchMemory(searchText, mistakes);
      setResult(matchResult);
    } catch (err) {
      console.error('Search memory error:', err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-violet-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Ask Your Memory</h2>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Have you made this mistake before? Consult your past self.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
        <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase">
          Describe the problem or error message
        </label>
        <textarea
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Mongoose connection timed out connecting to cluster"
          className="w-full bg-gray-950/80 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-violet-500 transition-colors font-mono resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSearch();
            }
          }}
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Supports semantic search & natural language descriptions
          </span>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-glow cursor-pointer"
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <span>Search My Memory</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Output */}
      {hasSearched && !loading && (
        <div>
          {result && result.matchedMistake ? (
            <div className="bg-gradient-to-b from-gray-900/90 to-gray-950/90 border border-violet-500/40 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between flex-wrap gap-4 border-b border-gray-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      You Have Made a Similar Mistake Before!
                    </h3>
                    <p className="text-xs text-gray-400">Identified via AI Semantic Matching</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{result.score || 85}% Match</span>
                </div>
              </div>

              {/* Memory Match Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-950/60 border border-gray-800/60 p-4 rounded-xl">
                <div className="md:col-span-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base">
                      {result.matchedMistake.title}
                    </h4>
                    {result.matchedMistake.category && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-950/80 border border-violet-700/50 text-violet-300">
                        {result.matchedMistake.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {result.matchExplanation || 'Semantic match across past documented technical concepts.'}
                  </p>
                </div>
                <div className="text-xs text-gray-500 space-y-1 md:border-l md:border-gray-800 md:pl-4">
                  <p>Language/Env: <span className="text-gray-300">{result.matchedMistake.category || 'Backend'}</span></p>
                  {result.matchedMistake.tags && result.matchedMistake.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.matchedMistake.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded text-gray-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cause & Solution Comparison */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    What Caused It Last Time?
                  </span>
                  <div className="p-3.5 rounded-xl bg-gray-950 border border-rose-950/40 text-rose-300 font-mono text-xs whitespace-pre-wrap">
                    {result.matchedMistake.cause || result.matchedMistake.description || 'Underlying configuration mismatch'}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    How Did You Solve It?
                  </span>
                  <div className="p-3.5 rounded-xl bg-gray-950 border border-emerald-950/40 text-emerald-300 font-mono text-xs whitespace-pre-wrap">
                    {result.matchedMistake.solution || result.matchedMistake.lesson || 'Followed verified solution pattern'}
                  </div>
                </div>
              </div>

              {/* Lesson Callout */}
              {(result.matchedMistake.lesson || result.lessonLearned) && (
                <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-800/30 text-violet-300 text-xs italic">
                  <span className="font-semibold not-italic text-violet-400 block mb-0.5">Lesson from your past self:</span>
                  "{result.matchedMistake.lesson || result.lessonLearned}"
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {onSaveAsNewMistake && (
                  <button
                    onClick={() => onSaveAsNewMistake(query, result.matchedMistake.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 border border-gray-800 px-3.5 py-2 rounded-xl hover:bg-gray-900 transition-colors"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    Save as Variation
                  </button>
                )}
                {onViewFullMemory && (
                  <button
                    onClick={() => onViewFullMemory(result.matchedMistake.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl transition-all shadow-glow"
                  >
                    <span>Inspect Full Memory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-gray-900/40 border border-gray-800/60 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No Similar Memories Found</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                This might be a brand new error context! Save it now to lock it in your second brain.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};