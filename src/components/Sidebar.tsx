import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  PlusCircle, 
  BrainCircuit, 
  Sparkles, 
  Settings, 
  Home,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser?: { name: string; email: string; avatarUrl: string } | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, currentUser }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'memories', name: 'My Memories', icon: Database },
    { id: 'add-mistake', name: 'Add Mistake', icon: PlusCircle },
    { id: 'ask-memory', name: 'Ask Your Memory', icon: BrainCircuit },
    { id: 'insights', name: 'AI Insights', icon: Sparkles },
  ];

  const displayName = currentUser?.name || 'Developer';
  const displayEmail = currentUser?.email || 'dev@mistakememo.local';

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-[#070c1a]/95 border-b border-slate-800/80 flex items-center justify-between px-4 py-3 fixed top-0 left-0 z-50 backdrop-blur-md">
        <div 
          onClick={() => {
            setCurrentTab('landing');
            setIsOpen(false);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white">
            Mistake Memo
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-white focus:outline-none p-1.5 rounded-lg hover:bg-slate-800"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#080e1e] backdrop-blur-xl border-r border-[#152238] p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0 pt-20' : '-translate-x-full lg:pt-5'}
      `}>
        {/* Top Logo */}
        <div>
          <div 
            onClick={() => {
              setCurrentTab('landing');
              setIsOpen(false);
            }}
            className="hidden lg:flex items-center gap-3 mb-6 px-2 py-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-all group"
            title="Go to Landing Page"
          >
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Mistake Memo
              </h1>
              <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase block">
                Second Brain
              </span>
            </div>
          </div>

          {/* Home Link */}
          <button
            onClick={() => {
              setCurrentTab('landing');
              setIsOpen(false);
            }}
            className="w-full mb-3 flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Landing Page</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    relative w-full flex items-center gap-3.5 pl-4 pr-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-blue-600/15 border border-blue-500/30 text-white shadow-sm shadow-blue-500/10' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-blue-500" />
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  {item.name}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="border-t border-[#152238] pt-4 space-y-1.5">
          <button
            onClick={() => {
              setCurrentTab('settings');
              setIsOpen(false);
            }}
            className={`
              relative w-full flex items-center gap-3.5 pl-4 pr-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
              ${currentTab === 'settings' 
                ? 'bg-blue-600/15 border border-blue-500/30 text-white' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }
            `}
          >
            {currentTab === 'settings' && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-blue-500" />
            )}
            <Settings className={`w-5 h-5 ${currentTab === 'settings' ? 'text-blue-400' : 'text-slate-400'}`} />
            Settings
          </button>
          
          <div className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl bg-[#0b1326] border border-[#152238]">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover shadow-sm" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {displayName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-500 truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;