"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

export const Search: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [pagefindAvailable, setPagefindAvailable] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openSearch, closeSearch]);

  // Initialize pagefind when search opens
  useEffect(() => {
    if (isOpen) {
      const initPagefind = async () => {
        try {
          if (!(window as any).pagefind) {
            if (process.env.NODE_ENV === 'development') {
              throw new Error("Pagefind not available in development");
            }
            // @ts-expect-error dynamic import
            (window as any).pagefind = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js');
          }
          (window as any).pagefind.init();
          setPagefindAvailable(true);
        } catch {
          setPagefindAvailable(false);
        }
      };
      initPagefind();

      // Focus input after a tick
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on backdrop click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, closeSearch]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length > 0 && (window as any).pagefind) {
      const searchResult = await (window as any).pagefind.search(val);
      const fiveResults = await Promise.all(searchResult.results.slice(0, 6).map((r: any) => r.data()));
      setResults(fiveResults);
    } else {
      setResults([]);
    }
  };

  return (
    <>
      <button 
        onClick={openSearch}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
        id="search-trigger"
      >
        <SearchIcon size={15} />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-block border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 text-[10px] font-mono ml-2">⌘K</kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            ref={searchRef}
            className="w-full max-w-2xl bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-fade-in-up"
          >
            <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-3.5">
              <SearchIcon size={20} className="text-gray-400 flex-shrink-0" />
              <input 
                ref={inputRef}
                type="text" 
                autoFocus
                placeholder="Search documentation..."
                className="w-full bg-transparent border-none focus:outline-none px-3 py-1 text-gray-900 dark:text-gray-100 placeholder-gray-500 text-base"
                value={query}
                onChange={handleSearch}
              />
              <button 
                onClick={closeSearch}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto p-2">
              {!pagefindAvailable ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Search is not available in development mode.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Run <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-brand-600 dark:text-brand-400">npm run build</code> to generate the search index.
                  </p>
                </div>
              ) : results.length > 0 ? (
                <ul className="space-y-0.5">
                  {results.map((result, idx) => (
                    <li key={idx}>
                      <a 
                        href={result.url} 
                        onClick={closeSearch}
                        className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <h4 className="font-semibold text-brand-600 dark:text-brand-400 text-sm mb-1">{result.meta.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: result.excerpt }}></p>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : query.length > 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No results found for &quot;{query}&quot;
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  Start typing to search...
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-end gap-3 text-[10px] text-gray-400 dark:text-gray-500">
              <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">↵</kbd> to select</span>
              <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
