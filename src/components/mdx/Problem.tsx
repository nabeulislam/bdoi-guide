import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface ProblemProps {
  name: string;
  url: string;
  difficulty: string;
}

export const Problem: React.FC<ProblemProps> = ({ name, url, difficulty }) => {
  let difficultyColor = 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
  
  if (difficulty.toLowerCase() === 'easy') {
    difficultyColor = 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
  } else if (difficulty.toLowerCase() === 'medium') {
    difficultyColor = 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
  } else if (difficulty.toLowerCase() === 'hard') {
    difficultyColor = 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  }

  return (
    <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-brand-500 transition-colors"
        >
          {name}
          <ExternalLink size={14} />
        </a>
      </td>
      <td className="py-4 px-4 text-right">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${difficultyColor}`}>
          {difficulty}
        </span>
      </td>
    </tr>
  );
};

export const Problems: React.FC<{ problems?: ProblemProps[] }> = ({ problems }) => {
  if (!problems || problems.length === 0) {
    return null;
  }

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">Problem</th>
            <th className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs text-right">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((prob, idx) => (
            <Problem key={idx} {...prob} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
