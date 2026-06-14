"use client";

import React from 'react';
import Link from 'next/link';
import { CategoryData } from '@/lib/content';
import { ArrowRight } from 'lucide-react';

const TRACK_META: Record<string, { bg: string; description: string }> = {
  intro: {
    bg: 'bg-indigo-600 dark:bg-indigo-800',
    description: 'Start your competitive programming journey with C++ fundamentals.',
  },
  bronze: {
    bg: 'bg-orange-600 dark:bg-orange-800',
    description: 'Build core problem-solving skills with simulation, sorting, and data structures.',
  },
  silver: {
    bg: 'bg-slate-600 dark:bg-slate-800',
    description: 'Level up with key algorithmic techniques that appear in most contests.',
  },
  gold: {
    bg: 'bg-yellow-600 dark:bg-yellow-800',
    description: 'Master dynamic programming and graph algorithms for advanced competition.',
  },
  platinum: {
    bg: 'bg-blue-700 dark:bg-blue-900',
    description: 'Advanced data structures and techniques for the hardest problems.',
  },
  contests: {
    bg: 'bg-purple-600 dark:bg-purple-800',
    description: 'Track upcoming contests and find unofficial practice contests.',
  },
};

interface TrackLandingClientProps {
  track: string;
  categories: CategoryData[];
  totalModules: number;
}

export const TrackLandingClient: React.FC<TrackLandingClientProps> = ({ track, categories, totalModules }) => {
  const meta = TRACK_META[track] || TRACK_META.intro;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className={`${meta.bg} py-10 sm:py-14 px-4 sm:px-6 md:px-10`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3 capitalize">
            {track}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-4">
            {meta.description}
          </p>
          <span className="inline-block text-sm font-medium text-white/60 bg-white/10 px-4 py-1.5 rounded-full">
            {totalModules} modules
          </span>
        </div>
      </div>

      {/* Category-based module listing */}
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10">
        {categories.map((category) => (
          <div key={category.name}>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
              {category.name}
            </h2>
            <div className="space-y-2">
              {category.pages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${track}/${page.slug}`}
                  className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {page.frontmatter.title}
                    </p>
                    {page.frontmatter.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {page.frontmatter.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
