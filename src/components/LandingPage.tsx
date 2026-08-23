import React, { useState, useRef } from 'react';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Terminal, 
  Cpu, 
  ChevronRight, 
  Database,
  TrendingUp,
  Clock,
  Zap,
  LogIn,
  LogOut
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface LandingPageProps {
  onGetStarted: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onLoginSuccess?: (user: UserProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  currentUser, 
  onLogout,
  onLoginSuccess 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] text-slate-900 flex flex-col font-sans overflow-y-auto selection:bg-blue-600 selection:text-white">
      {/* Top Fixed Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080e1e] border-b border-[#152238]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 select-none cursor-default">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/25 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block">Mistake Memo</span>
              <span className="text-[10px] tracking-widest uppercase text-blue-400 font-semibold block">Second Brain</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-400 transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-400 transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => scrollToSection('why-it-works')} className="hover:text-blue-400 transition-colors cursor-pointer">Why It Works</button>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#0d162d] border border-slate-700/80 px-3 py-1.5 rounded-xl">
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-semibold text-slate-200">{currentUser.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Login</span>
              </button>
            )}

            <button 
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/15 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/15 border border-blue-600/30 text-blue-800 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>AI-POWERED SECOND BRAIN</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
              <span className="text-[#091124] block">Don't Repeat</span>
              <span className="text-[#091124] block">Mistakes.</span>
              <span className="text-[#1d4ed8] block">Learn From Your Past Self.</span>
            </h1>

            <p className="text-lg text-[#334155] max-w-xl font-medium leading-relaxed">
              Mistake Memo captures your hard-won debugging lessons, understands the patterns, and brings the right answer back when you need it most.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="px-8 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-base shadow-sm transition-all cursor-pointer"
              >
                Learn More
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Your data stays local & private</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Built for real developers</span>
              </div>
            </div>
          </div>

          <div 
            className="lg:col-span-5 flex justify-center perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              ref={cardRef}
              className="relative w-full max-w-md cursor-default transition-transform ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.015 : 1}, ${isHovered ? 1.015 : 1}, 1)`,
                transitionDuration: isHovered ? '120ms' : '600ms',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-indigo-500/20 rounded-[32px] blur-xl opacity-60 pointer-events-none" />
              
              <div className="relative bg-white/95 border border-slate-300/80 rounded-3xl p-8 shadow-[0_20px_50px_rgba(15,23,42,0.12)] space-y-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/90 px-3 py-1 rounded-full border border-blue-200">
                    Memory Core
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Neural Shield Active</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="relative flex items-center justify-center w-28 h-28">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/60 rotate-slow pointer-events-none" />
                    <div className="absolute -inset-2 rounded-full border border-dotted border-indigo-400/40 rotate-reverse pointer-events-none" />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_8px_25px_rgba(37,99,235,0.35)] relative z-10">
                      <Cpu className="w-10 h-10 text-white animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#091124] tracking-tight">Semantic Incident Engine</h3>
                    <p className="text-xs text-slate-600 max-w-xs mt-1.5 leading-relaxed font-medium">
                      Indexing code snippets, syntax failures, and architectural fixes in real time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-100/90 border border-slate-200 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Recall Rate</span>
                    <span className="text-lg font-black text-blue-700">Instant</span>
                  </div>
                  <div className="bg-slate-100/90 border border-slate-200 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Match Confidence</span>
                    <span className="text-lg font-black text-emerald-600">98.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-[#d9e2ec] border-t border-slate-300 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700">Capabilities</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-[#091124] tracking-tight">
              Engineered for Developers Who Ship
            </h3>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Eliminate recurring bug searches and build permanent architectural memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-300 rounded-2xl p-8 space-y-4 shadow-sm hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#091124]">Semantic AI Search</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Describe the error naturally in plain English. The similarity engine locates matching past resolutions instantly.
              </p>
            </div>

            <div className="bg-white border border-slate-300 rounded-2xl p-8 space-y-4 shadow-sm hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#091124]">Full-Stack Memory</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Log errors across frontend, backend APIs, Docker, and MongoDB with structured root causes and lessons.
              </p>
            </div>

            <div className="bg-white border border-slate-300 rounded-2xl p-8 space-y-4 shadow-sm hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[#091124]">AI Debug Coach</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Consult the built-in AI Debug Coach to dissect logic breakdowns and establish preventive patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-[#e2e8f0] border-t border-slate-300">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700">Workflow</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-[#091124] tracking-tight">
              3 Steps to Developer Mastery
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
              <span className="text-4xl font-black text-blue-600 block">01</span>
              <h4 className="text-lg font-bold text-[#091124]">Document the Fix</h4>
              <p className="text-sm text-slate-600 font-medium">
                Log the bug context, root cause, working solution, and lesson learned when resolving difficult issues.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
              <span className="text-4xl font-black text-blue-600 block">02</span>
              <h4 className="text-lg font-bold text-[#091124]">Ask Natural Questions</h4>
              <p className="text-sm text-slate-600 font-medium">
                Next time you face an error, ask your memory with casual phrasing or raw console traces.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
              <span className="text-4xl font-black text-blue-600 block">03</span>
              <h4 className="text-lg font-bold text-[#091124]">Never Repeat a Bug</h4>
              <p className="text-sm text-slate-600 font-medium">
                Review heuristic patterns and track your solved metrics to eliminate recurring development friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section id="why-it-works" className="py-24 px-6 bg-[#d9e2ec] border-t border-slate-300">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700">Proven Results</h2>
            <h3 className="text-3xl sm:text-5xl font-black text-[#091124] tracking-tight">
              Why Second Brain Debugging Works
            </h3>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Real metrics from developers tracking their recurring friction and lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <TrendingUp className="w-7 h-7" />
                <span className="text-3xl font-black text-[#091124]">60% Less</span>
              </div>
              <h4 className="text-lg font-bold text-[#091124]">Repeat Mistake Rate</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Writing down structured root causes and reviewing heuristics prevents making the exact same configuration mistakes twice.
              </p>
            </div>

            <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <Clock className="w-7 h-7" />
                <span className="text-3xl font-black text-[#091124]">&lt; 5 Seconds</span>
              </div>
              <h4 className="text-lg font-bold text-[#091124]">Instant Recall</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Skip digging through stale tabs or git history. Retrieve past fixes the exact moment the error appears in terminal.
              </p>
            </div>

            <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-indigo-600">
                <Zap className="w-7 h-7" />
                <span className="text-3xl font-black text-[#091124]">100% Private</span>
              </div>
              <h4 className="text-lg font-bold text-[#091124]">On-Device & Local First</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your proprietary codebase, API secrets, and architecture logs stay strictly on your local machine and private cluster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6 bg-[#080e1e] border-t border-[#152238]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Ready to Build Your Engineering Second Brain?
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium">
            Turn everyday coding mistakes into permanent architectural knowledge.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={onGetStarted}
              className="px-9 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Dashboard</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#040813] border-t border-[#101b2e] text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-slate-200">Mistake Memo © 2026</span>
          </div>
          <p className="font-medium">Created for engineers building the future.</p>
        </div>
      </footer>

      {/* Google Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={(user) => {
          if (onLoginSuccess) onLoginSuccess(user);
        }} 
      />
    </div>
  );
};

export default LandingPage;