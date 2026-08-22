import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  PlusCircle, 
  BrainCircuit, 
  Sparkles, 
  Settings, 
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'memories', name: 'My Memories', icon: Database },
    { id: 'add-mistake', name: 'Add Mistake', icon: PlusCircle },
    { id: 'ask-memory', name: 'Ask Your Memory', icon: BrainCircuit },
    { id: 'insights', name: 'AI Insights', icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-gray-900/90 border-b border-gray-800 flex items-center justify-between px-4 py-3 fixed top-0 left-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-violet-600 to-blue-600 p-1.5 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Mistake-Memo AI
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-950/80 backdrop-blur-xl border-r border-gray-800/80 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0 pt-20' : '-translate-x-full lg:pt-5'}
      `}>
        {/* Top Logo */}
        <div className="hidden lg:flex items-center gap-3 mb-8 px-2">
          <div className="bg-gradient-to-r from-violet-600 to-blue-500 p-2 rounded-xl shadow-glow">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Mistake-Memo AI
            </h1>
            <span className="text-[10px] text-violet-400 font-semibold tracking-widest uppercase">
              Second Brain
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
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
                  w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-violet-600/20 to-blue-600/10 border border-violet-500/30 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50 border border-transparent'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'text-gray-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile / Settings */}
        <div className="border-t border-gray-800/80 pt-5 mt-5 space-y-1">
          <button
            onClick={() => {
              setCurrentTab('settings');
              setIsOpen(false);
            }}
            className={`
              w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${currentTab === 'settings' 
                ? 'bg-gradient-to-r from-violet-600/20 to-blue-600/10 border border-violet-500/30 text-white' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50 border border-transparent'
              }
            `}
          >
            <Settings className="w-5 h-5 text-gray-400" />
            Settings
          </button>
          
          <div className="flex items-center gap-3.5 px-4 py-3 mt-2 rounded-xl bg-gray-900/30 border border-gray-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate">Tisha</p>
              <p className="text-[10px] text-gray-500 truncate">tisha@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
