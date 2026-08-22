import React, { useState, useEffect } from 'react';
import { getGeminiApiKey, saveGeminiApiKey, resetDatabase } from '../utils/db';
import { Key, RotateCcw, Shield, Check, Eye, EyeOff, Sparkles } from 'lucide-react';

interface SettingsProps {
  onResetDb: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onResetDb }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setApiKey(getGeminiApiKey());
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveGeminiApiKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleResetData = () => {
    if (confirm('This will wipe your current database and restore the 6 original demo memories. Proceed?')) {
      setResetting(true);
      setTimeout(() => {
        resetDatabase();
        onResetDb();
        setResetting(false);
        alert('Database has been successfully restored to seed data!');
      }, 500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Settings</h2>
        <p className="text-gray-400 mt-1">Configure integrations and manage your database state.</p>
      </div>

      {/* Gemini Integration Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-violet-600/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        
        <div className="flex items-center gap-2 pb-4 border-b border-gray-800/80">
          <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
          <h3 className="font-bold text-white text-lg">AI Integration</h3>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Mistake-Memo AI is pre-configured with high-fidelity local keyword and tag matching. To experience true AI-powered explanations, semantic summaries, and custom coding lessons, configure a **Gemini API Key** from Google AI Studio.
          </p>

          <form onSubmit={handleSaveKey} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-gray-500" />
                Gemini API Key (stored in local storage)
              </label>
              
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-gray-950/70 border border-gray-800 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-100 placeholder-gray-700 focus:outline-none focus:border-violet-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                Get Gemini API Key from Google AI Studio &rarr;
              </a>

              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-glow"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  'Save API Key'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Database Maintenance Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-gray-800/80">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-800/80">
          <Shield className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-white text-lg">System Maintenance</h3>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <h4 className="text-sm font-bold text-white">Reset Database State</h4>
            <p className="text-xs text-gray-500 mt-1">
              Restore the original 6 default demo memories (Array Index Out of Bounds, React Infinite rendering, Git conflict, etc.) to your local database. Useful to reset state for clean demos.
            </p>
          </div>

          <div>
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="border border-violet-500/20 hover:border-violet-500/35 bg-violet-600/5 hover:bg-violet-600/10 text-violet-400 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              {resetting ? 'Resetting...' : 'Restore Seed Memories'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] text-gray-600 mt-8">
        <p>Mistake-Memo AI &copy; 2026. Built with React, TypeScript, and Google Gemini API.</p>
        <p className="mt-1">All data stays locally in your browser storage.</p>
      </div>
    </div>
  );
};
