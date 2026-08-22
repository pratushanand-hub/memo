import React, { useState, useEffect } from 'react';
import { Mistake, SimilarityResult } from '../types';
import { searchMemory } from '../utils/similarity';
import { SimilarityResultCard } from './SimilarityResultCard';
import { BrainCircuit, ArrowRight, Sparkles, Database, Plus } from 'lucide-react';

interface AskMemoryProps {
  mistakes: Mistake[];
  initialQuery?: string;
  onViewFullMemory: (id: string) => void;
  onSaveAsNewMistake: (query: string, matchedMistakeId: string) => void;
}

export const AskMemory: React.FC<AskMemoryProps> = ({
  mistakes,
  initialQuery = '',
  onViewFullMemory,
  onSaveAsNewMistake
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimilarityResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [activeResultIdx, setActiveResultIdx] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Run search if an initial query is provided from the dashboard
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    setActiveResultIdx(0);
    setFeedbackMessage(null);

    try {
      const response = await searchMemory(searchQuery, mistakes);
      setResults(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleFeedback = (feedback: 'helpful' | 'not-relevant') => {
    if (feedback === 'helpful') {
      setFeedbackMessage('Thank you! This verification helps reinforce your developers memory.');
    } else {
      setFeedbackMessage('Feedback logged. We will adjust similarity weights for this context.');
    }
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3000);
  };

  const activeResult = results[activeResultIdx] || null;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-violet-400" />
          Ask Your Memory
        </h2>
        <p className="text-gray-400 mt-1">Have you made this mistake before? Consult your past self.</p>
      </div>

      {/* Query Entry Box */}
      <form onSubmit={onFormSubmit} className="glass-card p-6 rounded-3xl border border-gray-800/80 space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Describe the problem or error message
          </label>
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your current struggle (e.g. My Java code crashes when I loop through an array.)"
            className="w-full bg-gray-950/70 border border-gray-800 rounded-2xl p-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Supports semantic search & natural language descriptions
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
          >
            {loading ? 'Searching...' : 'Search My Memory'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="bg-violet-600 border border-violet-500/30 text-white rounded-2xl py-3 px-5 text-center text-xs font-semibold shadow-glow animate-scaleIn">
          {feedbackMessage}
        </div>
      )}

      {/* Output Screen */}
      {loading && (
        <div className="glass-card py-16 text-center rounded-3xl border border-violet-500/10 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center pulse-brain">
              <BrainCircuit className="w-10 h-10 text-violet-400" />
            </div>
            <div className="absolute inset-0 border border-violet-500/30 rounded-full animate-ping opacity-25"></div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">🧠 Searching your past experiences...</h4>
            <p className="text-gray-500 text-xs mt-1">Comparing syntax, categories, and tags inside local cache...</p>
          </div>
          <div className="w-48 h-1 bg-gray-950 rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-violet-600 to-blue-500 w-1/2 search-loader-bar rounded-full"></div>
          </div>
        </div>
      )}

      {!loading && searched && (
        <div className="space-y-6">
          {results.length === 0 ? (
            /* No Matches Screen */
            <div className="glass-card p-12 text-center rounded-3xl border border-gray-800/80 flex flex-col items-center justify-center animate-scaleIn">
              <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mb-4">
                <Database className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">No Similar Memories Found</h3>
              <p className="text-gray-400 mt-2 max-w-md text-sm">
                This might be a brand new error context! Congratulations, you are exploring uncharted territories. Save it now to lock it in your memory database.
              </p>
              <button
                onClick={() => onSaveAsNewMistake(query, '')}
                className="mt-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 transition-all shadow-glow"
              >
                <Plus className="w-4.5 h-4.5" />
                Record as New Mistake
              </button>
            </div>
          ) : (
            /* Matches Found */
            <div className="space-y-6">
              {/* Primary Similarity Card */}
              {activeResult && (
                <SimilarityResultCard
                  result={activeResult}
                  onViewFullMemory={onViewFullMemory}
                  onSaveAsNewMistake={onSaveAsNewMistake}
                  onFeedback={handleFeedback}
                />
              )}

              {/* Other Matches Toggle */}
              {results.length > 1 && (
                <div className="glass-card p-6 rounded-3xl border border-gray-800/80 space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Other Potential Memory Matches ({results.length - 1})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((res, idx) => {
                      if (idx === activeResultIdx) return null;
                      return (
                        <div
                          key={res.matchedMistake.id}
                          onClick={() => setActiveResultIdx(idx)}
                          className="bg-gray-950/50 hover:bg-gray-900/60 border border-gray-900 hover:border-violet-500/20 p-4 rounded-2xl cursor-pointer flex justify-between items-center transition-all group"
                        >
                          <div className="flex-1 min-w-0 pr-3">
                            <span className="text-[9px] font-bold text-violet-400 bg-violet-600/10 border border-violet-500/10 px-1.5 py-0.5 rounded">
                              {res.matchedMistake.category}
                            </span>
                            <h5 className="font-bold text-white text-sm mt-1 truncate group-hover:text-violet-400 transition-colors">
                              {res.matchedMistake.title}
                            </h5>
                            <p className="text-gray-500 text-[10px] truncate mt-0.5">{res.matchedMistake.description}</p>
                          </div>
                          <div className="text-xs font-bold text-gray-400 bg-gray-900/80 border border-gray-800/80 py-1.5 px-3 rounded-xl flex items-center gap-1">
                            {res.score}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
