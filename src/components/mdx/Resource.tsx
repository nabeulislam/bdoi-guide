import React from 'react';
import { ExternalLink, BookOpen, Video, FileText } from 'lucide-react';
import type { Resource as ResourceType } from '@/lib/content';

export const Resources: React.FC<{ resources?: ResourceType[] }> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-[#334155] shadow-sm bg-[#1e293b]">
      <div className="bg-[#0f172a]/50 border-b border-[#334155] px-5 py-3">
        <h3 className="text-base font-bold text-white m-0">Recommended Resources</h3>
      </div>
      <table className="w-full text-left text-sm m-0">
        <tbody className="divide-y divide-[#334155]">
          {resources.map((resource, idx) => {
            let Icon = FileText;
            if (resource.type.toLowerCase() === 'video') Icon = Video;
            if (resource.type.toLowerCase() === 'book' || resource.type.toLowerCase() === 'article') Icon = BookOpen;

            return (
              <tr key={idx} className="hover:bg-[#334155] transition-colors">
                <td className="py-4 px-5">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-medium text-brand-400 hover:text-brand-300 transition-colors no-underline"
                  >
                    <Icon size={16} className="text-gray-400 shrink-0" />
                    <span>{resource.name}</span>
                    <ExternalLink size={14} className="opacity-50" />
                  </a>
                </td>
                <td className="py-4 px-5 text-right text-gray-400 w-32">
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
