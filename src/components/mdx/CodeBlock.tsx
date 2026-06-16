"use client";

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const CodeBlock: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({ children, className, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Extract text content from the children (which usually is a <code> tag)
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node)) return extractText(node.props.children);
    return '';
  };

  const handleCopy = async () => {
    const text = extractText(children);
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  let language = '';
  if (React.isValidElement(children) && children.props.className) {
    const match = children.props.className.match(/language-(\w+)/);
    if (match) {
      language = match[1].toUpperCase();
      if (language === 'CPP' || language === 'C++') language = 'CPP';
    }
  }

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden bg-[#0d1117] border border-[#334155]">
      <div className="absolute right-2 top-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 text-xs font-bold bg-[#1e293b] text-gray-300 hover:bg-[#334155] hover:text-white rounded-[4px] transition-colors cursor-pointer"
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
        {language && (
          <div className="px-2.5 py-1 text-xs font-bold bg-[#facc15] text-yellow-900 rounded-[4px]">
            {language}
          </div>
        )}
      </div>
      <div className="overflow-x-auto p-4 pt-10 text-sm leading-relaxed">
        <pre 
          className={`!m-0 !bg-transparent !p-0 !border-none ${className || ''}`}
          {...props}
        >
          {children}
        </pre>
      </div>
    </div>
  );
};
