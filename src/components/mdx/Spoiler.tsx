"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const Spoiler: React.FC<{ title: string; children: React.ReactNode }> = ({ 
  title = "Spoiler", 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[#334155] bg-[#1e293b] shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-gray-200 hover:bg-[#334155] transition-colors cursor-pointer"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {isOpen && (
        <div className="border-t border-[#334155] px-4 py-4 text-sm text-gray-300 prose-p:m-0 prose-p:leading-relaxed bg-[#0f172a]/50">
          {children}
        </div>
      )}
    </div>
  );
};
