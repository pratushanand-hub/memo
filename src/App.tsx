import React, { useState, useEffect } from 'react';

import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MyMemories } from './components/MyMemories';
import { AddMistake } from './components/AddMistake';
import { AskMemory } from './components/AskMemory';
import { Insights } from './components/Insights';
import { Settings } from './components/Settings';

import { Mistake } from './types';

import {
  getMistakes,
  addMistake as dbAddMistake,
  updateMistake as dbUpdateMistake,
  deleteMistake as dbDeleteMistake
} from './utils/db';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  const [askQuery, setAskQuery] = useState<string>('');

  const [selectedMistakeId, setSelectedMistakeId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  /* =========================
     LOAD MISTAKES FROM MONGODB
  ========================= */

  const handleRefreshDb = async () => {
    try {
      setLoading(true);

      const data = await getMistakes();

      console.log('Mistakes loaded:', data);

      setMistakes(data);
    } catch (error) {
      console.error('Failed to load mistakes:', error);
      setMistakes([]);
    } finally {
      setLoading(false);
    }
  };

  /* Load when app starts */

  useEffect(() => {
    handleRefreshDb();
  }, []);

  /* =========================
     ADD MISTAKE
  ========================= */

  const handleAddMistake = async (
    newMistake: Omit<Mistake, 'id' | 'createdAt'>
  ) => {
    try {
      console.log('Adding mistake:', newMistake);

      await dbAddMistake(newMistake);

      await handleRefreshDb();

      setCurrentTab('memories');
    } catch (error) {
      console.error('Failed to add mistake:', error);

      alert('Failed to save mistake. Check console.');
    }
  };

  /* =========================
     UPDATE STATUS
  ========================= */

  const handleUpdateStatus = async (
    id: string,
    nextStatus: 'solved' | 'investigating'
  ) => {
    try {
      const matched = mistakes.find(
        (mistake) => mistake.id === id
      );

      if (!matched) return;

      const updated: Mistake = {
        ...matched,
        status: nextStatus
      };

      await dbUpdateMistake(updated);

      await handleRefreshDb();
    } catch (error) {
      console.error('Failed to update mistake:', error);

      alert('Failed to update mistake.');
    }
  };

  /* =========================
     DELETE MISTAKE
  ========================= */

  const handleDeleteMistake = async (id: string) => {
    try {
      await dbDeleteMistake(id);

      await handleRefreshDb();
    } catch (error) {
      console.error('Failed to delete mistake:', error);

      alert('Failed to delete mistake.');
    }
  };

  /* =========================
     NAVIGATION
  ========================= */

  const handleNavigateWithQuery = (
    tabId: string,
    query?: string
  ) => {
    if (query) {
      setAskQuery(query);
    }

    setCurrentTab(tabId);
  };

  /* =========================
     VIEW MISTAKE
  ========================= */

  const handleViewMistakeDirectly = (
    mistake: Mistake
  ) => {
    setSelectedMistakeId(mistake.id);

    setCurrentTab('memories');
  };

  /* =========================
     TAB CHANGE
  ========================= */

  const handleTabChange = (tabId: string) => {
    if (tabId !== 'ask-memory') {
      setAskQuery('');
    }

    setCurrentTab(tabId);
  };

  /* =========================
     SAVE FROM SIMILARITY
  ========================= */

  const handleSaveAsNewFromSimilarity = (
    queryText: string,
    matchedMistakeId: string
  ) => {
    const matched = mistakes.find(
      (mistake) => mistake.id === matchedMistakeId
    );

    localStorage.setItem(
      'temp_prefill_query',
      queryText
    );

    if (matched) {
      localStorage.setItem(
        'temp_prefill_matched_title',
        matched.title
      );

      localStorage.setItem(
        'temp_prefill_matched_category',
        matched.category
      );

      localStorage.setItem(
        'temp_prefill_matched_tags',
        matched.tags.join(', ')
      );

      localStorage.setItem(
        'temp_prefill_matched_cause',
        matched.cause
      );

      localStorage.setItem(
        'temp_prefill_matched_solution',
        matched.solution
      );

      localStorage.setItem(
        'temp_prefill_matched_lesson',
        matched.lesson
      );
    }

    setCurrentTab('add-mistake');
  };

  /* =========================
     UI
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading mistakes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col lg:flex-row">

      {/* Sidebar */}

      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
      />

      {/* Main Content */}

      <main className="flex-1 lg:pl-64 min-w-0">

        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-20 lg:pt-8 min-h-screen flex flex-col">

          {/* Dashboard */}

          {currentTab === 'dashboard' && (
            <Dashboard
              mistakes={mistakes}
              onNavigateToTab={handleNavigateWithQuery}
              onViewMistake={handleViewMistakeDirectly}
            />
          )}

          {/* My Memories */}

          {currentTab === 'memories' && (
            <MyMemories
              mistakes={mistakes}
              onUpdateStatus={handleUpdateStatus}
              onDeleteMistake={handleDeleteMistake}
              onNavigateToTab={handleTabChange}
              inspectMistakeId={selectedMistakeId}
              onClearInspectMistakeId={() =>
                setSelectedMistakeId(null)
              }
              key={`memories-${selectedMistakeId}`}
            />
          )}

          {/* Add Mistake */}

          {currentTab === 'add-mistake' && (
            <AddMistake
              onAddMistake={handleAddMistake}
              onNavigateToTab={handleTabChange}
            />
          )}

          {/* Ask Memory */}

          {currentTab === 'ask-memory' && (
            <AskMemory
              mistakes={mistakes}
              initialQuery={askQuery}
              onViewFullMemory={(id) => {
                const matched = mistakes.find(
                  (mistake) => mistake.id === id
                );

                if (matched) {
                  handleViewMistakeDirectly(matched);
                }
              }}
              onSaveAsNewMistake={
                handleSaveAsNewFromSimilarity
              }
            />
          )}

          {/* Insights */}

          {currentTab === 'insights' && (
            <Insights
              mistakes={mistakes}
            />
          )}

          {/* Settings */}

          {currentTab === 'settings' && (
            <Settings
              onResetDb={handleRefreshDb}
            />
          )}

        </div>

      </main>

    </div>
  );
};

export default App;