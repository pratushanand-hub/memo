import React from 'react';
import { ArrowRight, BrainCircuit, CheckCircle2, Database, Lightbulb, Search, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  { icon: Search, title: 'Memory Search', text: 'Find the solution you discovered before, right when you need it.' },
  { icon: Database, title: 'Add a Mistake', text: 'Turn a frustrating debug session into useful future knowledge.' },
  { icon: Sparkles, title: 'AI Insights', text: 'Spot patterns in the bugs, tools, and habits slowing you down.' },
  { icon: BrainCircuit, title: 'Ask Your Memory', text: 'Describe today’s problem and consult your past self in seconds.' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => (
  <div className="landing-page min-h-screen overflow-hidden bg-[#f8fafc] text-[#0f172a]">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_85%_22%,rgba(14,165,233,0.08),transparent_28%),linear-gradient(135deg,#ffffff_0%,#f1f5f9_55%,#ffffff_100%)]" />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <nav className="landing-dark-nav -mx-5 flex h-20 items-center justify-between border-b px-5 sm:-mx-8 sm:px-8">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 text-left">
          <span className="rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 p-2 shadow-glow"><BrainCircuit className="h-5 w-5" /></span>
          <span className="text-base font-extrabold tracking-tight">Mistake Memo</span>
        </button>
        <div className="hidden items-center gap-7 text-sm text-gray-400 md:flex">
          <a href="#features" className="transition hover:text-violet-200">Features</a>
          <a href="#how-it-works" className="transition hover:text-violet-200">How It Works</a>
          <a href="#about" className="transition hover:text-violet-200">About</a>
        </div>
        <button onClick={onGetStarted} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-sm font-bold shadow-glow transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-400">Get Started</button>
      </nav>

      <main>
        <section className="landing-hero -mx-5 grid min-h-[680px] items-center gap-12 px-5 py-16 sm:-mx-8 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div className="max-w-2xl">
            <div className="landing-eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide"><Sparkles className="h-3.5 w-3.5" /> AI-POWERED SECOND BRAIN</div>
            <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl xl:text-7xl">Don&apos;t Repeat Mistakes.<br /><span className="bg-gradient-to-r from-violet-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">Learn From Your Past Self.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">Mistake Memo captures your hard-won debugging lessons, understands the patterns, and brings the right answer back when you need it most.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onGetStarted} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3.5 text-sm font-bold shadow-glow transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-400">Get Started <ArrowRight className="h-4 w-4" /></button>
              <a href="#how-it-works" className="landing-secondary-cta rounded-xl border-2 border-blue-700 bg-white px-5 py-3.5 text-sm font-bold text-blue-900 transition hover:border-blue-500 hover:bg-blue-50">Learn More</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-gray-400"><span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-violet-400" /> Your data stays local</span><span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-violet-400" /> Built for real developers</span></div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[560px] items-center justify-center py-10 lg:py-0">
            <div className="absolute h-80 w-80 rounded-full bg-blue-700/35 blur-3xl" />
            <div className="absolute h-56 w-56 rounded-full bg-cyan-500/30 blur-2xl" />
            <div className="relative h-[390px] w-full max-w-[480px] [perspective:1000px]">
              <div className="absolute inset-x-10 top-11 h-[270px] rotate-[-7deg] rounded-[2rem] border border-violet-300/25 bg-gradient-to-br from-violet-500/25 via-[#122048]/80 to-blue-500/20 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_55px_rgba(59,130,246,0.28)] backdrop-blur-xl [transform:rotateX(12deg)_rotateY(-12deg)]">
                <div className="flex items-center justify-between"><span className="rounded-full border border-violet-300/25 bg-violet-400/10 px-3 py-1 text-[10px] font-bold tracking-widest text-violet-200">MEMORY CORE</span><span className="h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_14px_#c4b5fd]" /></div>
                <div className="mt-8 flex items-center justify-center"><div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-violet-300/35 bg-gradient-to-br from-violet-500/30 to-blue-500/15 shadow-[inset_0_0_30px_rgba(191,219,254,0.16),0_0_35px_rgba(59,130,246,0.35)]"><div className="absolute inset-3 rounded-2xl border border-dashed border-violet-300/50 animate-[spin_15s_linear_infinite]" /><BrainCircuit className="relative h-12 w-12 text-violet-100" /></div></div>
                <div className="mt-7 flex justify-center gap-1.5">{[28, 46, 70, 42, 58, 80, 35].map((height, index) => <i key={index} className="w-2 rounded-full bg-gradient-to-t from-indigo-500 to-violet-300" style={{ height }} />)}</div>
              </div>
              <div className="absolute left-0 top-40 rounded-2xl border border-violet-300/25 bg-[#122048]/85 px-4 py-3 shadow-2xl backdrop-blur-xl animate-float-slow"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Recall rate</p><p className="mt-1 text-lg font-black text-violet-200">Instant</p></div>
              <div className="absolute bottom-2 right-0 flex items-center gap-2 rounded-2xl border border-blue-300/25 bg-[#122048]/85 px-4 py-3 shadow-2xl backdrop-blur-xl animate-float-reverse"><Lightbulb className="h-5 w-5 text-violet-300" /><div><p className="text-[10px] font-bold text-violet-100">Lesson found</p><p className="text-[9px] text-gray-400">Never lose the fix</p></div></div>
              <div className="absolute right-6 top-0 h-12 w-12 rotate-45 rounded-xl border border-violet-300/30 bg-violet-500/20 shadow-glow" />
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 rounded-3xl bg-gradient-to-b from-white to-blue-50/70 py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">Built for better debugging</p><h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Make every mistake useful.</h2></div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text }) => <article key={title} className="glass-card rounded-2xl p-8"><div className="inline-flex rounded-xl border border-violet-400/25 bg-violet-500/10 p-3 text-violet-300"><Icon className="h-6 w-6" /></div><h3 className="mt-6 text-lg font-bold text-white">{title}</h3><p className="mt-3 text-base leading-relaxed text-gray-400">{text}</p></article>)}</div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 py-28 sm:py-32">
          <div className="glass-card rounded-3xl p-10 sm:p-16"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">How it works</p><h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">A smarter loop for learning.</h2></div><div className="mt-16 grid gap-10 md:grid-cols-3">{[['1', 'Log a mistake', 'Capture the context, root cause, solution, and lesson.'], ['2', 'AI indexes it', 'Your personal debugging history becomes searchable knowledge.'], ['3', 'Recall it instantly', 'Get the answer from your past self next time it matters.']].map(([step, title, text], index) => <div key={step} className="relative text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-violet-300/30 bg-gradient-to-br from-violet-600 to-indigo-500 text-base font-black shadow-glow">{step}</div>{index < 2 && <div className="absolute left-[58%] top-7 hidden h-px w-[85%] bg-gradient-to-r from-violet-400/60 to-transparent md:block" />}<h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-gray-400">{text}</p></div>)}</div></div>
        </section>

        <section id="about" className="py-20 text-center sm:py-24"><div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-100 via-white to-cyan-50 px-8 py-20 shadow-[0_16px_40px_rgba(30,58,138,0.14)] sm:px-12"><h2 className="text-4xl font-black tracking-tight sm:text-5xl">Your next fix deserves a memory.</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">Start building a second brain for every debugging lesson you earn.</p><button onClick={onGetStarted} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-900 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(30,58,138,0.3)] transition hover:-translate-y-0.5">Get Started <ArrowRight className="h-5 w-5" /></button></div></section>
      </main>

      <footer className="landing-footer -mx-5 flex flex-col gap-3 px-5 py-8 text-xs sm:-mx-8 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span className="font-semibold">Mistake Memo</span><span>© {new Date().getFullYear()} Mistake Memo. Learn from every bug.</span><div className="flex gap-4"><a href="#features">Features</a><a href="#about">About</a></div></footer>
    </div>
  </div>
);
