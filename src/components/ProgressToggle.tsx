"use client";

import React from 'react';
import { useProgress } from '@/lib/ProgressContext';
import { CheckCircle, Circle } from 'lucide-react';

export const ProgressToggle: React.FC<{ slug: string }> = ({ slug }) => {
  const { isCompleted, markCompleted, markIncomplete } = useProgress();
  const completed = isCompleted(slug);

  return (
    <button
      onClick={() => completed ? markIncomplete(slug) : markCompleted(slug)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${completed ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-900/30 dark:border-brand-800 dark:text-brand-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900'}`}
    >
      {completed ? <CheckCircle size={18} /> : <Circle size={18} />}
      {completed ? 'Mark as Unread' : 'Mark as Read'}
    </button>
  );
};
