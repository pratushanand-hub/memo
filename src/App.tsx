import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MyMemories } from './components/MyMemories';
import { AddMistake } from './components/AddMistake';
import { AskMemory } from './components/AskMemory';
import { Insights } from './components/Insights';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';
import { AICoachModal } from './components/AICoachModal';
import { AuthModal } from './components/AuthModal';
import { Mistake } from './types';
import { 
  getMistakes, 
  fetchMistakesFromBackend, 
  addMistake as dbAddMistake, 
  updateMistake as dbUpdateMistake, 
  deleteMistake as dbDeleteMistake 
} from './utils/db';

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [askQuery, setAskQuery] = useState<string>('');
  const [selectedMistakeId, setSelectedMistakeId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Refresh memories filtered by the logged-in user's email
  const handleRefreshDb = async (email?: string) => {
    const targetEmail = email || user?.email;
    if (targetEmail) {
      const freshData = await fetchMistakesFromBackend(targetEmail);
      setMistakes(freshData);
    } else {
      setMistakes([]);
    }
  };

  useEffect(() => {
    // Check stored user session from localStorage
    const savedUser = localStorage.getItem('mistake_memo_user');
    if (savedUser) {
      try {
        const parsed: UserProfile = JSON.parse(savedUser);
        setUser(parsed);
        setMistakes(getMistakes(parsed.email));
        handleRefreshDb(parsed.email);
      } catch (err) {
        console.error('Failed to parse user profile', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mistake_memo_user');
    setUser(null);
    setMistakes([]);
    setCurrentTab('landing');
  };

  // Auth Guard: If the user is not logged in, trigger the login modal instead of navigating
  const handleProtectedAction = (targetTab: string = 'dashboard') => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentTab(targetTab);
  };

  const handleLoginSuccess = async (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    await handleRefreshDb(loggedUser.email);
    setCurrentTab('dashboard');
  };

  const handleAddMistake = async (newMistake: Omit<Mistake, 'id' | 'createdAt'>) => {
    if (!user) return;
    await dbAddMistake(newMistake, user.email);
    await handleRefreshDb(user.email);
  };

  const handleUpdateStatus = async (id: string, nextStatus: 'solved' | 'investigating') => {
    if (!user) return;
    const matched = mistakes.find(m => m.id === id);
    if (matched) {
      const updated = { ...matched, status: nextStatus };
      await dbUpdateMistake(updated, user.email);
      await handleRefreshDb(user.email);
    }
  };

  const handleDeleteMistake = async (id: string) => {
    if (!user) return;
    await dbDeleteMistake(id, user.email);
    await handleRefreshDb(user.email);
  };

  const handleNavigateWithQuery = (tabId: string, query?: string) => {
    if (query) {
      setAskQuery(query);
    }
    handleProtectedAction(tabId);
  };

  const handleViewMistakeDirectly = (mistake: Mistake) => {
    setSelectedMistakeId(mistake.id);
    handleProtectedAction('memories');
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'landing') {
      setCurrentTab('landing');
      return;
    }
    if (tabId !== 'ask-memory') {
      setAskQuery('');
    }
    handleProtectedAction(tabId);
  };

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
    handleProtectedAction('add-mistake');
  };

  return (
    <div className="min-h-screen bg-[#060a14] flex flex-col lg:flex-row relative">
      {/* Show Sidebar only when logged in and inside workspace views */}
      {user && currentTab !== 'landing' && (
        <Sidebar 
          currentTab={currentTab} 
          setCurrentTab={handleTabChange} 
          currentUser={user}
        />
      )}

      {/* Render Landing Page if on landing tab OR if user is not authenticated */}
      {(!user || currentTab === 'landing') ? (
        <div className="landing-wrapper w-full min-h-screen">
          <LandingPage 
            onGetStarted={() => handleProtectedAction('dashboard')} 
            currentUser={user}
            onLogout={handleLogout}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      ) : (
        /* Workspace Pages */
        <main className="app-main flex-1 lg:pl-64 min-w-0">
          <div className="max-w-7xl mx-auto p-4 md:p-8 pt-20 lg:pt-8 min-h-screen flex flex-col">
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
              <Settings onResetDb={() => user && handleRefreshDb(user.email)} />
            )}
          </div>
        </main>
      )}

      {/* AI Assistant Modal available across all views */}
      <AICoachModal />

      {/* Global Auth Modal Popup */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
};

export default App;