import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Sparkles } from 'lucide-react';
import { getAllPages } from '@/lib/content';

const TRACK_META: Record<string, { title: string; color: string; bg: string; description: string; icon: string }> = {
  intro: {
    title: 'Intro',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-[#1e293b] hover:bg-[#334155] border-[#334155]',
    description: 'Start your competitive programming journey with C++ fundamentals, I/O, and basic control flow.',
    icon: '🌱',
  },
  bronze: {
    title: 'Bronze',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-[#1e293b] hover:bg-[#334155] border-[#334155]',
    description: 'Build core problem-solving skills with simulation, sorting, and introductory data structures.',
    icon: '🥉',
  },
  silver: {
    title: 'Silver',
    color: 'from-gray-400 to-slate-500',
    bg: 'bg-[#1e293b] hover:bg-[#334155] border-[#334155]',
    description: 'Level up with fundamental algorithmic techniques: prefix sums, binary search, and two pointers.',
    icon: '🥈',
  },
  gold: {
    title: 'Gold',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-[#1e293b] hover:bg-[#334155] border-[#334155]',
    description: 'Master dynamic programming and graph algorithms — the core of advanced competitive programming.',
    icon: '🥇',
  },
  platinum: {
    title: 'Platinum',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-[#1e293b] hover:bg-[#334155] border-[#334155]',
    description: 'Tackle the hardest problems with advanced data structures, complex DP, and heavy math.',
    icon: '💎',
  },
  contests: {
    title: 'Contests',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-[#1e293b] hover:bg-[#334155] border-[#334155]',
    description: 'Track upcoming contests and find links to past official and unofficial practice rounds.',
    icon: '🏆',
  },
};

export default function Home() {
  const tracks = getAllPages();
  const totalModules = tracks.reduce((sum, t) => sum + t.pages.length, 0);

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-16 px-4">
      {/* Hero */}
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-900/30 text-brand-400 rounded-full text-sm font-medium mb-8 border border-brand-900/50">
          <Sparkles size={14} />
          {totalModules} modules across {tracks.length} tracks
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
          Learn BdOI. <br className="hidden md:block" /> 
          <span className="bg-gradient-to-r from-brand-400 to-blue-400 bg-clip-text text-transparent">Efficiently.</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop wasting time searching for problems and tutorials. The BdOI Guide provides a comprehensive, organized roadmap carefully designed for contestants — available to everyone, for free.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/intro" 
            className="group relative flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-bold rounded-xl transition-all shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 w-full sm:w-auto justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              Start Learning
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link 
            href="/roadmap" 
            className="flex items-center gap-2 px-8 py-4 bg-[#1e293b] hover:bg-[#334155] text-white font-bold rounded-xl transition-all w-full sm:w-auto justify-center border border-[#334155] shadow-sm hover:shadow"
          >
            View Roadmap
          </Link>
        </div>
      </div>

      {/* Curriculum Tracks - USACO Style */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Curriculum Tracks</h2>
        <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
          Follow a carefully designed curriculum tailored for the Bangladesh Olympiad in Informatics. Select your division below.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => {
            const meta = TRACK_META[track.track] || TRACK_META.intro;
            return (
              <Link 
                key={track.track}
                href={`/${track.track}`}
                className={`group block p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${meta.bg}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${meta.color} shadow-inner`}>
                    {meta.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-black/20 px-3 py-1 rounded-full">
                    {track.pages.length} Modules
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-brand-400 transition-colors">
                  {meta.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {meta.description}
                </p>
                <div className="flex items-center text-sm font-bold text-brand-500 group-hover:translate-x-1 transition-transform">
                  View Track <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-[#1e293b] border border-[#334155] shadow-sm">
          <div className="w-11 h-11 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={22} />
          </div>
          <h3 className="text-lg font-bold mb-2 text-white">Curated Resources</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Learn new topics from a vetted list of high-quality resources. Written by top BdOI alumni.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[#1e293b] border border-[#334155] shadow-sm">
          <div className="w-11 h-11 bg-purple-900/30 text-purple-400 rounded-xl flex items-center justify-center mb-4">
            <Code size={22} />
          </div>
          <h3 className="text-lg font-bold mb-2 text-white">Extensive Problemsets</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Practice each topic with extensive problemsets from Codeforces, USACO, and CSES covering a wide range of difficulties.
          </p>
        </div>
      </div>
    </div>
  );
}
