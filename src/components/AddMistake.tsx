import React, { useState, useEffect, useMemo } from 'react';
import { Mistake } from '../types';
import { matchSimilarityLocally } from '../utils/similarity';
import { Plus, Check, ArrowLeft, Tag as TagIcon, Sparkles, AlertTriangle, History, ArrowRight } from 'lucide-react';

interface AddMistakeProps {
  onAddMistake: (mistake: Omit<Mistake, 'id' | 'createdAt'>) => void;
  onNavigateToTab: (tabId: string) => void;
  mistakes?: Mistake[];
  onNotify?: (message: string, tone?: 'success' | 'error') => void;
}

const CATEGORIES = [
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Git',
  'Database',
  'Web Development',
  'Programming',
  'Docker',
  'Other'
];

const REQUIRED_FIELDS: { key: 'title' | 'description' | 'cause' | 'solution' | 'lesson'; label: string }[] = [
  { key: 'title', label: 'Problem / Mistake Title' },
  { key: 'description', label: 'Short Description' },
  { key: 'cause', label: 'Root Cause' },
  { key: 'solution', label: 'Solution' },
  { key: 'lesson', label: 'Lesson Learned' },
];

export const AddMistake: React.FC<AddMistakeProps> = ({ onAddMistake, onNavigateToTab, mistakes = [], onNotify }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');
  const [cause, setCause] = useState('');
  const [solution, setSolution] = useState('');
  const [lesson, setLesson] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'solved' | 'investigating'>('solved');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [dismissedSimilarity, setDismissedSimilarity] = useState(false);

  // Live local similarity check as the user describes the problem.
  // Uses the same heuristic matcher as Ask Memory, but synchronous/instant
  // (no simulated API delay) since it runs on every keystroke.
  const liveQuery = `${title} ${description}`.trim();
  const similarMatches = useMemo(() => {
    if (liveQuery.length < 8 || mistakes.length === 0) return [];
    return matchSimilarityLocally(liveQuery, mistakes).filter(m => m.score >= 40);
  }, [liveQuery, mistakes]);

  useEffect(() => {
    setDismissedSimilarity(false);
  }, [title]);

  // Auto-prefill details if redirected from similarity search results
  useEffect(() => {
    const tempQuery = localStorage.getItem('temp_prefill_query');
    if (tempQuery) {
      const matchTitle = localStorage.getItem('temp_prefill_matched_title') || '';
      const matchCategory = localStorage.getItem('temp_prefill_matched_category') || 'Programming';
      const matchTags = localStorage.getItem('temp_prefill_matched_tags') || '';
      const matchCause = localStorage.getItem('temp_prefill_matched_cause') || '';
      const matchSolution = localStorage.getItem('temp_prefill_matched_solution') || '';
      const matchLesson = localStorage.getItem('temp_prefill_matched_lesson') || '';

      setTitle(matchTitle ? `Repeat: ${matchTitle}` : '');
      setCategory(matchCategory);
      setTagsInput(matchTags);
      setDescription(tempQuery);
      setCause(matchCause);
      setSolution(matchSolution);
      setLesson(matchLesson);
      setStatus('investigating');

      // Clear temp storage
      localStorage.removeItem('temp_prefill_query');
      localStorage.removeItem('temp_prefill_matched_title');
      localStorage.removeItem('temp_prefill_matched_category');
      localStorage.removeItem('temp_prefill_matched_tags');
      localStorage.removeItem('temp_prefill_matched_cause');
      localStorage.removeItem('temp_prefill_matched_solution');
      localStorage.removeItem('temp_prefill_matched_lesson');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = REQUIRED_FIELDS.filter(f => {
      const value = { title, description, cause, solution, lesson }[f.key];
      return !value.trim();
    });

    if (missing.length > 0) {
      const message = `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.map(f => f.label).join(', ')}.`;
      setFormError(message);
      onNotify?.(message, 'error');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    
    // Parse tags (comma separated)
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newMistake: Omit<Mistake, 'id' | 'createdAt'> = {
      title,
      category,
      description,
      context,
      cause,
      solution,
      lesson,
      tags: tags.length > 0 ? tags : ['General'],
      status: status === 'solved' ? 'solved' : 'investigating'
    };

    // Simulate saving delay
    setTimeout(() => {
      onAddMistake(newMistake);
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setContext('');
      setCause('');
      setSolution('');
      setLesson('');
      setTagsInput('');
      
      setTimeout(() => {
        setSuccess(false);
        onNavigateToTab('memories');
      }, 1500);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateToTab('dashboard')}
            className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Record a Mistake</h2>
            <p className="text-gray-400 mt-1">Convert your debug struggles into permanent developer knowledge.</p>
          </div>
        </div>
      </div>

      {success ? (
        <div className="glass-card border-violet-500/25 p-12 text-center rounded-3xl shadow-glow flex flex-col items-center justify-center animate-scaleIn">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-4 shadow-glow">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">Memory Locked In!</h3>
          <p className="text-gray-400 mt-2">The mistake has been saved to your developers second brain.</p>
          <p className="text-xs text-violet-400 font-semibold mt-4">Redirecting to memories...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-6 shadow-sm border border-gray-800/80">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-800/80">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-white text-lg">Mistake Memo Specifications</h3>
          </div>

          {formError && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <p className="text-xs text-rose-300 leading-relaxed">{formError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Problem / Mistake Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ArrayIndexOutOfBoundsException"
                className="w-full bg-gray-950/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-950/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-violet-500 transition-all"
              >
                {CATEGORIES.map((cat, i) => (
                  <option key={i} value={cat} className="bg-gray-950">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Short Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. My program crashed while accessing an array in a java loop."
              className="w-full bg-gray-950/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
            />
          </div>

          {/* Live Similarity Detection */}
          {similarMatches.length > 0 && !dismissedSimilarity && (
            <div className="bg-gradient-to-r from-amber-500/10 to-violet-600/5 border border-amber-500/30 rounded-2xl p-5 animate-fadeIn relative">
              <button
                type="button"
                onClick={() => setDismissedSimilarity(true)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors text-xs"
              >
                Dismiss
              </button>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-amber-300">
                    {similarMatches.length === 1 ? 'This looks familiar' : `${similarMatches.length} similar memories found`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    You may have already solved something like this before saving a new one.
                  </p>

                  <div className="mt-3 space-y-2">
                    {similarMatches.map((match) => (
                      <div
                        key={match.matchedMistake.id}
                        className="flex items-center justify-between gap-3 bg-gray-950/60 border border-gray-800/80 rounded-xl px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-200 truncate">{match.matchedMistake.title}</p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{match.matchedMistake.solution}</p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                          {match.score}% match
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateToTab('ask-memory')}
                    className="mt-3 text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-all"
                  >
                    Ask Memory instead
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Context */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Context / What were you trying to do?
            </label>
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. I was looping through an array of size n to sum up all transaction records."
              className="w-full bg-gray-950/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
            />
          </div>

          {/* Cause */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Root Cause / What caused the mistake? <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              placeholder="e.g. I used i <= n in my for-loop condition, which is 1 index beyond the array's boundary."
              className="w-full bg-gray-950/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all font-mono"
            />
          </div>

          {/* Solution */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Solution / How did you solve it? <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="e.g. Changed the comparison operator in the loop from '<=' to '<'."
              className="w-full bg-gray-950/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all font-mono"
            />
          </div>

          {/* Lesson */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Lesson Learned / What did you learn? <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder="e.g. Array indices in Java start at 0, meaning the final index is length - 1. Loop guards must use strict less-than checks."
              className="w-full bg-gray-950/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5" /> Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Arrays, Loops, Debugging"
                className="w-full bg-gray-950/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Current Status
              </label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 border border-gray-800 rounded-xl py-3 px-4 text-sm text-gray-400 hover:text-white cursor-pointer transition-all bg-gray-950/20 has-[:checked]:bg-violet-500/10 has-[:checked]:border-violet-500/30 has-[:checked]:text-violet-300">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'solved'}
                    onChange={() => setStatus('solved')}
                    className="sr-only"
                  />
                  <Check className="w-4 h-4" />
                  Solved
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 border border-gray-800 rounded-xl py-3 px-4 text-sm text-gray-400 hover:text-white cursor-pointer transition-all bg-gray-950/20 has-[:checked]:bg-amber-500/10 has-[:checked]:border-amber-500/30 has-[:checked]:text-amber-400">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'investigating'}
                    onChange={() => setStatus('investigating')}
                    className="sr-only"
                  />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                  Investigating
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Recording...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save Memory
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
