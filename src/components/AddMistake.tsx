import React, { useState, useEffect } from 'react';
import { Mistake } from '../types';
import { Plus, Check, ArrowLeft, Tag as TagIcon, Sparkles } from 'lucide-react';

interface AddMistakeProps {
  onAddMistake: (mistake: Omit<Mistake, 'id' | 'createdAt'>) => void;
  onNavigateToTab: (tabId: string) => void;
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

export const AddMistake: React.FC<AddMistakeProps> = ({ onAddMistake, onNavigateToTab }) => {
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
    if (!title || !description || !cause || !solution || !lesson) {
      alert('Please fill out all required fields.');
      return;
    }

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
        <div className="glass-card border-emerald-500/20 p-12 text-center rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.05)] flex flex-col items-center justify-center animate-scaleIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
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
                <label className="flex-1 flex items-center justify-center gap-2 border border-gray-800 rounded-xl py-3 px-4 text-sm text-gray-400 hover:text-white cursor-pointer transition-all bg-gray-950/20 has-[:checked]:bg-emerald-500/10 has-[:checked]:border-emerald-500/30 has-[:checked]:text-emerald-400">
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
