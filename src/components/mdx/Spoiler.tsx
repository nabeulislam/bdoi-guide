"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const Spoiler: React.FC<{ title: string; children: React.ReactNode }> = ({ 
  title = "Spoiler", 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 text-sm text-gray-800 dark:text-gray-200 prose-p:m-0 prose-p:leading-relaxed bg-gray-50/50 dark:bg-black/20">
          {children}
        </div>
      )}
    </div>
  );
};
