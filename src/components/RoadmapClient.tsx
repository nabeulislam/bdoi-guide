"use client";

import React from 'react';
import Link from 'next/link';
import { TrackData } from '@/lib/content';
import { ArrowRight } from 'lucide-react';

const TRACK_ICONS: Record<string, string> = {
  intro: '🌱',
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

const TRACK_DESCRIPTIONS: Record<string, string> = {
  intro: 'Get started with C++ basics, I/O, and control flow.',
  bronze: 'Build your problem-solving foundation with simulation, sorting, and data structures.',
  silver: 'Master key algorithmic techniques: prefix sums, binary search, and two pointers.',
  gold: 'Tackle dynamic programming, graph algorithms, and shortest paths.',
  platinum: 'Advanced data structures and DP techniques for the hardest problems.',
};

interface RoadmapClientProps {
  tracks: TrackData[];
}

export const RoadmapClient: React.FC<RoadmapClientProps> = ({ tracks }) => {
  const totalModules = tracks.reduce((sum, t) => sum + t.pages.length, 0);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Learning Roadmap
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Your journey through the BdOI syllabus. {totalModules} modules across {tracks.length} tracks.
        </p>
      </div>

      <div className="space-y-10 relative">
        {/* Vertical line connecting tracks */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-400 via-brand-500 to-brand-600 hidden md:block opacity-30" />

        {tracks.map((track) => (
          <div key={track.track} className="relative md:pl-16">
            {/* Track dot */}
            <div className="absolute left-[17px] top-2 w-4 h-4 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(255,255,255,1)] dark:shadow-[0_0_0_4px_rgba(10,10,10,1)] hidden md:block z-10 ring-2 ring-brand-500/30" />
            
            <div className="mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span>{TRACK_ICONS[track.track] || '📘'}</span>
                  <Link 
                    href={`/${track.track}`}
                    className="uppercase tracking-wider text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    {track.track}
                  </Link>
                  <span className="text-xs font-medium px-2.5 py-1 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 rounded-full">
                    {track.pages.length} Modules
                  </span>
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {TRACK_DESCRIPTIONS[track.track] || ''}
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {track.pages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${track.track}/${page.slug}`}
                  className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-600 transition-all cursor-pointer"
                >
                  <h3 className="font-bold text-base mb-1 flex items-center justify-between">
                    <span className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {page.frontmatter.title}
                    </span>
                    <ArrowRight size={14} className="text-gray-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </h3>
                  {page.frontmatter.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {page.frontmatter.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
