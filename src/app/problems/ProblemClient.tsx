"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, Shuffle } from 'lucide-react';
import { GlobalProblem } from '@/lib/content';

// Simple seeded PRNG for consistent shuffling
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function ProblemClient({ initialProblems }: { initialProblems: GlobalProblem[] }) {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [trackFilter, setTrackFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [hideTags, setHideTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Very Hard'];
  const tracks = ['All', ...Array.from(new Set(initialProblems.map(p => p.track)))];
  const categoriesSet = new Set(initialProblems.map(p => p.categoryName || 'Uncategorized'));
  categoriesSet.add('Uncategorized');
  const categories = ['All', ...Array.from(categoriesSet).sort()];
  const allTags = Array.from(new Set(initialProblems.flatMap(p => p.tags || []))).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const handleShuffle = () => {
    setShuffleSeed(Math.random() * 1000000);
  };

  const filteredProblems = useMemo(() => {
    let result = initialProblems.filter(p => {
      // Name search
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      
      // Tag matching: if any tags are selected, the problem must have AT LEAST ONE of the selected tags (OR condition)
      const matchesTags = selectedTags.size === 0 || 
        Array.from(selectedTags).some(t => p.tags?.includes(t));

      const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      const matchesTrack = trackFilter === 'All' || p.track === trackFilter;
      const pCat = p.categoryName || 'Uncategorized';
      const matchesCat = categoryFilter === 'All' || pCat === categoryFilter;
      
      return matchesSearch && matchesTags && matchesDiff && matchesTrack && matchesCat;
    });

    if (shuffleSeed > 0) {
      const prng = mulberry32(shuffleSeed);
      result = [...result].sort(() => prng() - 0.5);
    }

    return result;
  }, [initialProblems, search, difficultyFilter, trackFilter, categoryFilter, selectedTags, shuffleSeed]);

  const getProblemInitials = (name: string) => {
    const words = name.split(/[\s-]+/).filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const getTrackColor = (track: string) => {
    switch (track) {
      case 'intro': return 'bg-green-600';
      case 'bronze': return 'bg-orange-700';
      case 'silver': return 'bg-slate-500';
      case 'gold': return 'bg-yellow-600';
      case 'platinum': return 'bg-blue-600';
      default: return 'bg-brand-600';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a]">
      {/* Massive Blue USACO-style Header */}
      <div className="w-full bg-[#1e40af] py-16 flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">
          Problems
        </h1>
        <div className="w-full max-w-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-600" size={20} />
          <input
            type="text"
            placeholder="Search problem name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-gray-900 pl-12 pr-4 py-3.5 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-shadow text-lg font-medium shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar for Filters/Tags (USACO style) */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <button 
            onClick={() => setHideTags(!hideTags)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-300 rounded-md font-semibold text-sm transition-colors mb-6"
          >
            {hideTags ? "Show tags" : "Hide tags"}
          </button>
          
          {!hideTags && (
            <div className="space-y-1.5 hidden lg:block">
              {allTags.map(tag => {
                const isActive = selectedTags.has(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`block text-left w-full px-3 py-1.5 text-sm rounded-md transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white font-medium' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
              {selectedTags.size > 0 && (
                <button
                  onClick={() => setSelectedTags(new Set())}
                  className="block text-center w-full px-3 py-2 mt-4 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider rounded-md border border-[#334155] hover:border-slate-400 transition-colors"
                >
                  Clear Tags
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-[#1e293b] pb-6">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-[#1e293b] text-slate-300 px-4 py-2 rounded-md border border-[#334155] focus:outline-none focus:border-blue-500 text-sm font-medium w-full sm:w-auto"
            >
              {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'Difficulty' : d}</option>)}
            </select>
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="bg-[#1e293b] text-slate-300 px-4 py-2 rounded-md border border-[#334155] focus:outline-none focus:border-blue-500 text-sm font-medium capitalize w-full sm:w-auto"
            >
              {tracks.map(t => <option key={t} value={t}>{t === 'All' ? 'Track' : t}</option>)}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#1e293b] text-slate-300 px-4 py-2 rounded-md border border-[#334155] focus:outline-none focus:border-blue-500 text-sm font-medium w-full sm:w-auto"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'Category' : c}</option>)}
            </select>
            
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={handleShuffle}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] text-slate-300 rounded-md text-sm font-semibold transition-colors active:scale-95"
              >
                <Shuffle size={14} /> Shuffle
              </button>
            </div>
          </div>

          {/* Problem Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProblems.map(prob => (
              <div key={prob.id} className="bg-[#172033] border border-[#1e293b] rounded-xl p-5 flex flex-col relative group hover:border-[#334155] transition-colors">
                {/* Header: Problem Initial */}
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded text-white font-bold flex items-center justify-center text-sm ${getTrackColor(prob.track)}`}>
                    {getProblemInitials(prob.name)}
                  </div>
                  {/* Removed dummy status circle as per user feedback */}
                </div>

                {/* Title */}
                <a 
                  href={prob.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[17px] font-semibold text-slate-200 hover:text-blue-400 transition-colors mb-2 leading-snug pr-2"
                >
                  {prob.name}
                </a>

                {/* View Solution Link */}
                <div className="mb-4 h-6">
                  {prob.hasSolution && (
                    <Link
                      href={`/problems/${prob.id}/solution`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      View Solution <ExternalLink size={14} />
                    </Link>
                  )}
                </div>

                {/* Appears In */}
                <div className="mt-auto mb-6">
                  <div className="text-[13px] text-slate-400 mb-1">Appears In:</div>
                  <ul className="list-disc list-inside text-[13px]">
                    <li>
                      <Link href={`/${prob.track}/${prob.moduleSlug}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                        {prob.moduleName}
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Tags preview inside card if not hidden globally, optional, but let's keep it simple */}
                
                {/* Difficulty Badge */}
                <div className="absolute bottom-5 right-5">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${
                    prob.difficulty === 'Easy' ? 'bg-[#14532d] text-[#4ade80] border border-green-500/20' :
                    prob.difficulty === 'Medium' ? 'bg-[#1e3a8a] text-[#60a5fa] border border-blue-500/20' :
                    'bg-[#7f1d1d] text-[#f87171] border border-red-500/20'
                  }`}>
                    {prob.difficulty}
                  </span>
                </div>
              </div>
            ))}

            {filteredProblems.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 text-lg">No problems found matching your filters.</p>
                {selectedTags.size > 0 && (
                  <button 
                    onClick={() => setSelectedTags(new Set())}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium transition-colors"
                  >
                    Clear Tag Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
