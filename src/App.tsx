import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MyMemories } from './components/MyMemories';
import { AddMistake } from './components/AddMistake';
import { AskMemory } from './components/AskMemory';
import { Insights } from './components/Insights';
import { Settings } from './components/Settings';
import { AICoachModal } from './components/AICoachModal';
import { Mistake } from './types';
import { getMistakes, addMistake as dbAddMistake, updateMistake as dbUpdateMistake, deleteMistake as dbDeleteMistake } from './utils/db';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [askQuery, setAskQuery] = useState<string>('');
  const [selectedMistakeId, setSelectedMistakeId] = useState<string | null>(null);

  // Load mistakes from DB on mount
  useEffect(() => {
    setMistakes(getMistakes());
  }, []);

  const handleRefreshDb = () => {
    setMistakes(getMistakes());
  };

  const handleAddMistake = (newMistake: Omit<Mistake, 'id' | 'createdAt'>) => {
    dbAddMistake(newMistake);
    handleRefreshDb();
  };

  const handleUpdateStatus = (id: string, nextStatus: 'solved' | 'investigating') => {
    const matched = mistakes.find(m => m.id === id);
    if (matched) {
      const updated = { ...matched, status: nextStatus };
      dbUpdateMistake(updated);
      handleRefreshDb();
    }
  };

  const handleDeleteMistake = (id: string) => {
    dbDeleteMistake(id);
    handleRefreshDb();
  };

  // Navigates to memory search tab with a query pre-filled
  const handleNavigateWithQuery = (tabId: string, query?: string) => {
    if (query) {
      setAskQuery(query);
    }
    setCurrentTab(tabId);
  };

  // Views a mistake directly. Switches to My Memories tab and schedules it to open.
  const handleViewMistakeDirectly = (mistake: Mistake) => {
    setSelectedMistakeId(mistake.id);
    setCurrentTab('memories');
  };

  // Safe navigation trigger to clear query when moving away from Ask Memory
  const handleTabChange = (tabId: string) => {
    if (tabId !== 'ask-memory') {
      setAskQuery('');
    }
    setCurrentTab(tabId);
  };

  // Callback to handle pre-filled "Save as New Mistake" trigger from Similarity Results
  const handleSaveAsNewFromSimilarity = (queryText: string, matchedMistakeId: string) => {
    const matched = mistakes.find(m => m.id === matchedMistakeId);
    
    localStorage.setItem('temp_prefill_query', queryText);
    if (matched) {
      localStorage.setItem('temp_prefill_matched_title', matched.title);
      localStorage.setItem('temp_prefill_matched_category', matched.category);
      localStorage.setItem('temp_prefill_matched_tags', matched.tags.join(', '));
      localStorage.setItem('temp_prefill_matched_cause', matched.cause);
      localStorage.setItem('temp_prefill_matched_solution', matched.solution);
      localStorage.setItem('temp_prefill_matched_lesson', matched.lesson);
    }
    setCurrentTab('add-mistake');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row relative">
      {/* Side Navigation Bar */}
      <Sidebar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Main Panel Content */}
      <main className="flex-1 lg:pl-64 min-w-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-20 lg:pt-8 min-h-screen flex flex-col">
          {/* Active Tab Router */}
          {currentTab === 'dashboard' && (
            <Dashboard 
              mistakes={mistakes} 
              onNavigateToTab={handleNavigateWithQuery}
              onViewMistake={handleViewMistakeDirectly}
            />
          )}

          {currentTab === 'memories' && (
            <MyMemories 
              mistakes={mistakes}
              onUpdateStatus={handleUpdateStatus}
              onDeleteMistake={handleDeleteMistake}
              onNavigateToTab={handleTabChange}
              inspectMistakeId={selectedMistakeId}
              onClearInspectMistakeId={() => setSelectedMistakeId(null)}
              key={`memories-${selectedMistakeId}`}
            />
          )}

          {currentTab === 'add-mistake' && (
            <AddMistake 
              onAddMistake={handleAddMistake}
              onNavigateToTab={handleTabChange}
            />
          )}

          {currentTab === 'ask-memory' && (
            <AskMemory 
              mistakes={mistakes}
              initialQuery={askQuery}
              onViewFullMemory={(id) => {
                const matched = mistakes.find(m => m.id === id);
                if (matched) handleViewMistakeDirectly(matched);
              }}
              onSaveAsNewMistake={handleSaveAsNewFromSimilarity}
            />
          )}

          {currentTab === 'insights' && (
            <Insights mistakes={mistakes} />
          )}

          {currentTab === 'settings' && (
            <Settings onResetDb={handleRefreshDb} />
          )}
        </div>
      </main>

      {/* Floating AI Debug Coach */}
      <AICoachModal />
    </div>
  );
};

export default App;