import React from 'react';
import { SimilarityResult } from '../types';
import { 
  AlertTriangle, 
  Check, 
  X, 
  BookOpen, 
  Sparkles,
  Copy
} from 'lucide-react';

interface SimilarityResultCardProps {
  result: SimilarityResult;
  onViewFullMemory: (id: string) => void;
  onSaveAsNewMistake: (query: string, matchedMistakeId: string) => void;
  onFeedback: (feedback: 'helpful' | 'not-relevant') => void;
}

export const SimilarityResultCard: React.FC<SimilarityResultCardProps> = ({
  result,
  onViewFullMemory,
  onSaveAsNewMistake,
  onFeedback
}) => {
  const { score, matchedMistake, matchExplanation, contextComparison, causeComparison, solutionComparison, lessonLearned } = result;

  // Render score color based on match strength
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-violet-400 border-violet-500/30 bg-violet-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
    if (s >= 60) return 'text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  const isCodeLike = (text: string) => {
    return text.includes('for(') || text.includes('for (') || text.includes(';') || text.includes('{') || text.includes('=>') || text.includes('==') || text.includes('!=');
  };

  return (
    <div className="glass-card rounded-3xl border border-violet-500/30 overflow-hidden shadow-glow relative animate-scaleIn">
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      {/* Glow highlight bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500"></div>

      {/* Main Container */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Banner Alert Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                You Have Made a Similar Mistake Before!
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Identified via AI Semantic Matching</p>
            </div>
          </div>

          {/* Score Badge */}
          <div className={`px-4 py-2 rounded-2xl border font-extrabold text-base flex items-center gap-1.5 self-start sm:self-center ${getScoreColor(score)}`}>
            <Sparkles className="w-4 h-4 animate-spin-slow text-violet-400" />
            <span>{score}% Match</span>
          </div>
        </div>

        {/* Previous Mistake Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Previous Memory Title</span>
              <h4 className="text-lg font-bold text-white mt-0.5 group hover:text-violet-400 transition-colors flex items-center gap-2">
                {matchedMistake.title}
                <span className="text-xs font-semibold text-violet-400 tracking-wider bg-violet-600/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                  {matchedMistake.category}
                </span>
              </h4>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Similarity Explanation</span>
              <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                {matchExplanation}
              </p>
            </div>
          </div>
          
          {/* Metadata Card */}
          <div className="bg-gray-950/40 border border-gray-900 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Memory Context</span>
            <div className="text-xs text-gray-400 space-y-2 mt-2">
              <p className="flex justify-between"><span className="text-gray-600">Language/Env:</span> <strong className="text-gray-300">{matchedMistake.category}</strong></p>
              <p className="flex justify-between"><span className="text-gray-600">Saved:</span> <strong className="text-gray-300">{new Date(matchedMistake.createdAt).toLocaleDateString()}</strong></p>
              <p className="flex flex-wrap gap-1 mt-1"><span className="text-gray-600 w-full mb-1">Tags:</span>
                {matchedMistake.tags.map((t, idx) => (
                  <span key={idx} className="text-[8px] bg-gray-900 border border-gray-800 px-1 py-0.5 rounded text-gray-400">#{t}</span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Code Cause Last Time */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              What caused it last time?
            </span>
            <div className="bg-gray-950 border border-rose-500/10 rounded-2xl p-4 font-mono text-xs text-rose-400/90 overflow-hidden min-h-[90px] border-l-4 border-l-rose-500/70 shadow-inner">
              {isCodeLike(causeComparison) ? (
                <pre className="max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{causeComparison}</pre>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{causeComparison}</p>
              )}
            </div>
          </div>

          {/* Code Solution Last Time */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
              How did you solve it?
            </span>
            <div className="bg-gray-950 border border-violet-500/15 rounded-2xl p-4 font-mono text-xs text-violet-200 overflow-hidden min-h-[90px] border-l-4 border-l-violet-500/70 shadow-inner">
              {isCodeLike(solutionComparison) ? (
                <pre className="max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{solutionComparison}</pre>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{solutionComparison}</p>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Quote Bubble */}
        <div className="bg-gradient-to-r from-violet-600/10 via-blue-600/5 to-transparent border border-violet-500/20 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-3 -bottom-5 text-gray-800/10 text-7xl font-serif select-none">"</div>
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
            Lesson From Your Past Self
          </span>
          <p className="text-sm text-gray-100 font-medium italic mt-1.5 leading-relaxed pl-3 border-l-2 border-violet-500/40">
            "{lessonLearned}"
          </p>
        </div>

        {/* Actions Row */}
        <div className="pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onViewFullMemory(matchedMistake.id)}
              className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-4 h-4 text-gray-400" />
              View Full Memory
            </button>
            <button
              onClick={() => onSaveAsNewMistake(contextComparison, matchedMistake.id)}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            >
              <Copy className="w-4 h-4" />
              Save as New Mistake
            </button>
          </div>

          {/* Feedback Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1">Feedback:</span>
            <button
              onClick={() => onFeedback('helpful')}
              className="bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 hover:border-violet-500/40 text-violet-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Helpful
            </button>
            <button
              onClick={() => onFeedback('not-relevant')}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Not Relevant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
