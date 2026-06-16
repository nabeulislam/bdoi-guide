"use client";

import React, { useState } from 'react';
import { ExternalLink, ChevronRight, ChevronDown, Star, FileText } from 'lucide-react';

export interface ProblemProps {
  name: string;
  url: string;
  difficulty: string;
  source?: string;
  tags?: string[];
  solution?: string;
  internalSolution?: string;
  isStarred?: boolean;
}

export const FocusProblem: React.FC<{ prob: ProblemProps }> = ({ prob }) => {
  const [showTags, setShowTags] = useState(false);

  return (
    <div className="my-8 rounded-xl border border-[#1e293b] border-t-4 border-t-[#3b82f6] bg-[#0f172a] shadow-sm overflow-hidden">
      <div className="p-5 flex items-start justify-between">
        <div>
          <a 
            href={prob.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xl font-bold text-gray-100 hover:text-brand-400 transition-colors mb-1"
          >
            {prob.name} <ExternalLink size={18} className="opacity-70" />
          </a>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-2">
            {prob.source && <span>{prob.source}</span>}
            {prob.source && <span className="opacity-50">-</span>}
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
              prob.difficulty.toLowerCase() === 'easy' ? 'bg-[#14532d] text-[#4ade80]' :
              prob.difficulty.toLowerCase() === 'medium' || prob.difficulty.toLowerCase() === 'normal' ? 'bg-[#713f12] text-[#facc15]' :
              prob.difficulty.toLowerCase() === 'hard' ? 'bg-[#7f1d1d] text-[#f87171]' :
              'bg-[#1e293b] text-gray-300'
            }`}>
              {prob.difficulty}
            </span>
          </div>
        </div>
        
        {/* Solution Button */}
        {(prob.internalSolution || prob.solution) && (
          <a 
            href={prob.internalSolution || prob.solution} 
            target={prob.internalSolution ? undefined : "_blank"}
            rel={prob.internalSolution ? undefined : "noopener noreferrer"}
            className="flex items-center gap-2 px-4 py-2 bg-[#334155] hover:bg-[#475569] text-gray-200 text-sm font-bold rounded-lg transition-colors shadow-sm"
          >
            <FileText size={16} /> Solution
          </a>
        )}
      </div>

      {/* Tags Section */}
      {prob.tags && prob.tags.length > 0 && (
        <div className="px-5 py-3 border-t border-[#1e293b] bg-[#0f172a]/50">
          <button 
            onClick={() => setShowTags(!showTags)}
            className="flex items-center gap-1 text-gray-400 text-sm font-semibold hover:text-gray-200 transition-colors bg-transparent border-none p-0 mb-2"
          >
            {showTags ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            {showTags ? 'Hide Tags' : 'Show Tags'}
          </button>
          
          {showTags && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {prob.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 rounded-md bg-[#1e293b] border border-[#334155] text-xs font-medium text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-5 py-3 border-t border-[#1e293b] bg-[#1e293b]/30 text-xs italic text-gray-500">
        Focus Problem – try your best to solve this problem before continuing!
      </div>
    </div>
  );
};

const ProblemRow: React.FC<{ prob: ProblemProps }> = ({ prob }) => {
  const [showTags, setShowTags] = useState(false);

  return (
    <React.Fragment>
      <tr className={`border-[#0f172a] hover:bg-[#334155] transition-colors group ${prob.isStarred ? 'border-t-[3px] border-t-[#3b82f6]' : 'border-b last:border-0'}`}>
        <td className="py-3 px-4 whitespace-nowrap w-24">
          {prob.source ? <span className="text-[12px] font-medium text-gray-400 border-b border-dashed border-[#475569] pb-0.5">{prob.source}</span> : <span className="text-gray-600">-</span>}
        </td>
        <td className="py-3 px-4 font-medium text-[#60a5fa] hover:text-[#93c5fd]">
          <a 
            href={prob.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors"
          >
            {prob.isStarred && <Star size={14} className="fill-[#60a5fa]" />}
            {prob.name}
          </a>
        </td>
        <td className="py-3 px-4 text-center w-28">
          <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
            prob.difficulty.toLowerCase() === 'easy' ? 'bg-[#14532d] text-[#4ade80]' :
            prob.difficulty.toLowerCase() === 'medium' || prob.difficulty.toLowerCase() === 'normal' ? 'bg-[#713f12] text-[#facc15]' :
            prob.difficulty.toLowerCase() === 'hard' ? 'bg-[#7f1d1d] text-[#f87171]' :
            'bg-[#334155] text-gray-300'
          }`}>
            {prob.difficulty}
          </span>
        </td>
        <td className="py-3 px-4 w-32">
          {prob.tags && prob.tags.length > 0 ? (
            <button 
              onClick={() => setShowTags(!showTags)}
              className="flex items-center gap-1 text-gray-400 text-[12px] cursor-pointer hover:text-gray-200 transition-colors bg-transparent border-none p-0"
            >
              {showTags ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>{showTags ? 'Hide Tags' : 'Show Tags'}</span>
            </button>
          ) : <span className="text-gray-600">-</span>}
        </td>
        <td className="py-3 px-4 w-28">
          {(prob.internalSolution || prob.solution) ? (
            <a 
              href={prob.internalSolution || prob.solution} 
              target={prob.internalSolution ? undefined : "_blank"}
              rel={prob.internalSolution ? undefined : "noopener noreferrer"}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-gray-300 bg-[#334155] hover:bg-[#475569] rounded-md transition-colors no-underline"
            >
              Solution <ExternalLink size={12} />
            </a>
          ) : <span className="text-gray-600">-</span>}
        </td>
      </tr>
      
      {/* Expanded Tags Row */}
      {showTags && prob.tags && prob.tags.length > 0 && (
        <tr className="bg-[#0f172a]/50 border-b border-[#0f172a]">
          <td colSpan={5} className="py-3 px-4 pl-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Tags:</span>
              {prob.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-[#1e293b] border border-[#334155] text-xs text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export const Problems: React.FC<{ problems?: ProblemProps[] }> = ({ problems }) => {
  if (!problems || problems.length === 0) {
    return null;
  }

  const focusProblems = problems.filter(p => p.isStarred);
  const regularProblems = problems.filter(p => !p.isStarred);

  const hasSource = regularProblems.some(p => !!p.source);
  const hasTags = regularProblems.some(p => !!p.tags && p.tags.length > 0);

  return (
    <div className="my-8">
      {/* Render Focus Problems as massive blocks above the table */}
      {focusProblems.map((prob, idx) => (
        <FocusProblem key={`focus-${idx}`} prob={prob} />
      ))}

      {/* Render the standard table for remaining practice problems */}
      {regularProblems.length > 0 && (
        <div className="overflow-hidden rounded-xl bg-[#0f172a] border border-[#1e293b] shadow-sm mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px] border-collapse m-0">
              <thead className="bg-[#0f172a] border-b border-[#1e293b]">
                <tr>
                  <th className="py-3 px-4 font-semibold text-gray-300 uppercase tracking-wider text-[11px] w-24">Source</th>
                  <th className="py-3 px-4 font-semibold text-gray-300 uppercase tracking-wider text-[11px]">Problem Name</th>
                  <th className="py-3 px-4 font-semibold text-gray-300 uppercase tracking-wider text-[11px] text-center w-28">Difficulty</th>
                  <th className="py-3 px-4 font-semibold text-gray-300 uppercase tracking-wider text-[11px] w-32">Tags</th>
                  <th className="py-3 px-4 font-semibold text-gray-300 uppercase tracking-wider text-[11px] w-28">Solution</th>
                </tr>
              </thead>
              <tbody className="bg-[#1e293b]">
                {regularProblems.map((prob, idx) => (
                  <ProblemRow key={idx} prob={prob} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
