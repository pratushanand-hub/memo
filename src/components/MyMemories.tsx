import React, { useState, useMemo } from 'react';
import { Mistake } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { 
  Search, 
  Filter, 
  Trash2, 
  Check, 
  Calendar, 
  ChevronRight, 
  X, 
  CheckSquare, 
  AlertTriangle
} from 'lucide-react';

interface MyMemoriesProps {
  mistakes: Mistake[];
  onUpdateStatus: (id: string, newStatus: 'solved' | 'investigating') => void;
  onDeleteMistake: (id: string) => void;
  onNavigateToTab: (tabId: string) => void;
  inspectMistakeId?: string | null;
  onClearInspectMistakeId?: () => void;
  onNotify?: (message: string, tone?: 'success' | 'error') => void;
}

export const MyMemories: React.FC<MyMemoriesProps> = ({ 
  mistakes, 
  onUpdateStatus, 
  onDeleteMistake,
  onNavigateToTab,
  inspectMistakeId = null,
  onClearInspectMistakeId,
  onNotify
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [activeDetailId, setActiveDetailId] = useState<string | null>(inspectMistakeId);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Auto-open modal if navigated from another page
  React.useEffect(() => {
    if (inspectMistakeId) {
      setActiveDetailId(inspectMistakeId);
    }
  }, [inspectMistakeId]);

  // Derive all unique categories and tags
  const categories = useMemo(() => {
    const list = new Set(mistakes.map(m => m.category));
    return ['All', ...Array.from(list)];
  }, [mistakes]);

  const tags = useMemo(() => {
    const list = new Set<string>();
    mistakes.forEach(m => m.tags.forEach(t => list.add(t)));
    return ['All', ...Array.from(list)];
  }, [mistakes]);

  // Filter and sort mistakes
  const filteredMistakes = useMemo(() => {
    let result = [...mistakes];

    // Search term matching
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.description.toLowerCase().includes(q) ||
        m.cause.toLowerCase().includes(q) ||
        m.lesson.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(m => m.category === selectedCategory);
    }

    // Tag filter
    if (selectedTag !== 'All') {
      result = result.filter(m => m.tags.includes(selectedTag));
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [mistakes, searchTerm, selectedCategory, selectedTag, sortBy]);

  const activeMistake = useMemo(() => {
    return mistakes.find(m => m.id === activeDetailId) || null;
  }, [mistakes, activeDetailId]);

  const handleToggleStatus = (id: string, current: 'solved' | 'investigating' | 'open') => {
    const next = current === 'solved' ? 'investigating' : 'solved';
    onUpdateStatus(id, next);
    onNotify?.(next === 'solved' ? 'Marked as solved.' : 'Marked as investigating.', 'success');
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      const target = mistakes.find(m => m.id === pendingDeleteId);
      onDeleteMistake(pendingDeleteId);
      setActiveDetailId(null);
      setPendingDeleteId(null);
      onNotify?.(`"${target?.title ?? 'Memory'}" was deleted.`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">My Memories</h2>
          <p className="text-gray-400 mt-1">Explore and filter your recorded bug journals and solutions.</p>
        </div>
        <button
          onClick={() => onNavigateToTab('add-mistake')}
          className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm flex items-center justify-center gap-2 self-start transition-all shadow-glow"
        >
          Add New Memory
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-5 rounded-2xl border border-gray-800/80 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search details or tags..."
            className="w-full bg-gray-950/70 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 bg-gray-950/70 border border-gray-800 rounded-xl py-2.5 px-3 text-xs text-gray-200 focus:outline-none focus:border-violet-500 transition-all"
          >
            {categories.map((c, i) => (
              <option key={i} value={c} className="bg-gray-950">{c}</option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tag</span>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="flex-1 bg-gray-950/70 border border-gray-800 rounded-xl py-2.5 px-3 text-xs text-gray-200 focus:outline-none focus:border-violet-500 transition-all"
          >
            {tags.map((t, i) => (
              <option key={i} value={t} className="bg-gray-950">{t === 'All' ? 'All Tags' : `#${t}`}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sort</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 bg-gray-950/70 border border-gray-800 rounded-xl py-2.5 px-3 text-xs text-gray-200 focus:outline-none focus:border-violet-500 transition-all"
          >
            <option value="newest" className="bg-gray-950">Newest Saved</option>
            <option value="oldest" className="bg-gray-950">Oldest Saved</option>
            <option value="alphabetical" className="bg-gray-950">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredMistakes.length === 0 ? (
        <div className="glass-card p-16 text-center rounded-2xl border border-gray-800/50">
          <Filter className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg">No matches found</h3>
          <p className="text-gray-400 text-sm mt-1">Try refining your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMistakes.map(mistake => (
            <div
              key={mistake.id}
              onClick={() => setActiveDetailId(mistake.id)}
              className="glass-card glass-card-hover p-7 rounded-3xl flex flex-col justify-between cursor-pointer group relative min-h-[255px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-violet-400 tracking-wider bg-violet-600/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                    {mistake.category}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(mistake.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-lg leading-snug group-hover:text-violet-300 transition-colors">
                  {mistake.title}
                </h3>
                
                <p className="text-gray-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                  {mistake.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-800/80">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {mistake.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-medium text-gray-400 bg-gray-950 px-1.5 py-0.5 rounded border border-gray-900">
                      #{tag}
                    </span>
                  ))}
                  {mistake.tags.length > 3 && (
                    <span className="text-[9px] font-medium text-gray-500 bg-gray-950 px-1.5 py-0.5 rounded">
                      +{mistake.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    mistake.status === 'solved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${mistake.status === 'solved' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    {mistake.status === 'solved' ? 'Solved' : 'Investigating'}
                  </span>

                  <span className="text-xs text-gray-400 group-hover:text-white flex items-center gap-0.5 transition-colors">
                    Inspect
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspection Modal */}
      {activeMistake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden border border-gray-800/80 shadow-glow flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800/80 flex items-start justify-between bg-gray-900/30">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-violet-400 tracking-wider bg-violet-600/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                    {activeMistake.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Saved {new Date(activeMistake.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white leading-tight">
                  {activeMistake.title}
                </h3>
              </div>
              <button 
                onClick={() => { setActiveDetailId(null); onClearInspectMistakeId?.(); }}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-950/20">
              {/* Problem */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">The Problem</h4>
                <p className="text-sm text-gray-200 leading-relaxed font-semibold bg-gray-900/40 border border-gray-800/40 p-3 rounded-xl">
                  {activeMistake.description}
                </p>
              </div>

              {/* Context */}
              {activeMistake.context && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Context / Intended Action</h4>
                  <p className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-violet-500/40">
                    {activeMistake.context}
                  </p>
                </div>
              )}

              {/* Root Cause */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 text-amber-500">
                  <AlertTriangle className="w-3.5 h-3.5" /> Root Cause
                </h4>
                <div className="bg-gray-950/80 border border-rose-500/15 rounded-xl p-4 font-mono text-xs text-rose-300 overflow-hidden border-l-4 border-l-rose-500">
                  <pre className="max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{activeMistake.cause}</pre>
                </div>
              </div>

              {/* Solution */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 text-violet-400">
                  <CheckSquare className="w-3.5 h-3.5" /> Solution
                </h4>
                <div className="bg-gray-950/80 border border-violet-500/20 rounded-xl p-4 font-mono text-xs text-violet-200 overflow-hidden border-l-4 border-l-violet-500">
                  <pre className="max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{activeMistake.solution}</pre>
                </div>
              </div>

              {/* Lesson Learned */}
              <div className="space-y-1.5 bg-gradient-to-r from-violet-600/10 to-blue-600/5 border border-violet-500/20 p-4 rounded-xl">
                <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Lesson From Your Past Self</h4>
                <p className="text-sm text-gray-200 mt-1 italic leading-relaxed">
                  " {activeMistake.lesson} "
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeMistake.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs font-semibold text-gray-400 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-900/30">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status:</span>
                <button
                  onClick={() => handleToggleStatus(activeMistake.id, activeMistake.status)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                    activeMistake.status === 'solved'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  }`}
                >
                  {activeMistake.status === 'solved' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Mark Solved
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                      Mark Investigating
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => handleDelete(activeMistake.id)}
                  className="px-4 py-2 text-xs font-semibold text-rose-500 hover:text-white border border-rose-500/20 hover:bg-rose-500/10 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Memory
                </button>
                <button
                  onClick={() => { setActiveDetailId(null); onClearInspectMistakeId?.(); }}
                  className="px-5 py-2 text-xs font-bold text-gray-300 hover:text-white bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this memory?"
        description="This will permanently remove the mistake, its solution, and lesson from your second brain. This can't be undone."
        confirmLabel="Delete Memory"
        cancelLabel="Keep it"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
};
