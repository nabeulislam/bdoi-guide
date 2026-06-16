"use client";

import React, { useState } from 'react';
import { ChevronDown, Code2, User, CheckCircle2 } from 'lucide-react';

export const Solution: React.FC<{ children: React.ReactNode; author?: string; title?: string }> = ({ children, author, title = "Solution" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6 border border-[#1e293b] border-t-4 border-t-[#22c55e] rounded-xl overflow-hidden bg-[#0f172a] shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#0f172a] hover:bg-[#1e293b]/50 transition-colors cursor-pointer text-left border-none"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#14532d] flex items-center justify-center text-[#4ade80]">
            <Code2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-200">{title}</span>
              {author ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1e293b] border border-[#334155] text-xs font-bold text-gray-300">
                  <User size={14} /> {author}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14532d] border border-[#166534] text-xs font-bold text-[#4ade80]">
                  <CheckCircle2 size={14} /> Official
                </span>
              )}
            </div>
            {!isOpen && <span className="text-xs text-gray-500 font-medium block mt-1">Click to reveal the solution...</span>}
          </div>
        </div>
        <ChevronDown
          size={24}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="p-6 border-t border-[#1e293b] bg-[#0a0f1a] prose prose-invert max-w-none prose-p:leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};
