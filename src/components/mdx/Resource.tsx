import React from 'react';
import { ExternalLink, BookOpen, Video, FileText } from 'lucide-react';
import type { Resource as ResourceType } from '@/lib/content';

export const Resources: React.FC<{ resources?: ResourceType[] }> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 py-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white m-0">Recommended Resources</h3>
      </div>
      <table className="w-full text-left text-sm m-0">
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {resources.map((resource, idx) => {
            let Icon = FileText;
            if (resource.type.toLowerCase() === 'video') Icon = Video;
            if (resource.type.toLowerCase() === 'book' || resource.type.toLowerCase() === 'article') Icon = BookOpen;

            return (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="py-4 px-5">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors no-underline"
                  >
                    <Icon size={16} className="text-gray-400 shrink-0" />
                    <span>{resource.name}</span>
                    <ExternalLink size={14} className="opacity-50" />
                  </a>
                </td>
                <td className="py-4 px-5 text-right text-gray-500 dark:text-gray-400 w-32">
                  {resource.type}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
