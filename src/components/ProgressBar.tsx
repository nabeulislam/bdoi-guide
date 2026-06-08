"use client";

import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  size?: 'sm' | 'md';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  completed, 
  total, 
  label,
  size = 'md' 
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const barHeight = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {completed}/{total} ({percentage}%)
          </span>
        </div>
      )}
      <div className={`w-full ${barHeight} bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden`}>
        <div
          className={`${barHeight} rounded-full transition-all duration-700 ease-out animate-progress`}
          style={{ 
            width: `${percentage}%`,
            background: percentage === 100 
              ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
              : 'linear-gradient(90deg, #22c55e, #4ade80)'
          }}
        />
      </div>
    </div>
  );
};
