"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { TrackData } from '@/lib/content';

interface SidebarProps {
  tracks: TrackData[];
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ tracks, isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Extract current track from pathname (e.g., "/bronze/simulation" -> "bronze")
  const pathParts = pathname.split('/').filter(Boolean);
  const currentTrackId = pathParts[0];
  const currentTrack = tracks.find(t => t.track === currentTrackId) || tracks[0];
  
  // Use pre-computed categories from the track data
  const categories = currentTrack.categories;

  // State for collapsible categories — start all expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach(c => { initial[c.name] = true; });
    return initial;
  });

  // Auto-expand category containing current page
  useEffect(() => {
    const parts = pathname.split('/').filter(Boolean);
    const currentSlug = parts[1];
    if (currentSlug) {
      const activeCat = categories.find(c => c.pages.some(p => p.slug === currentSlug));
      if (activeCat) {
        setExpandedCategories(prev => {
          if (prev[activeCat.name]) return prev; // prevent unnecessary state updates
          return { ...prev, [activeCat.name]: true };
        });
      }
    }
  }, [pathname, categories]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);
  const trackDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close track dropdown on outside click
  useEffect(() => {
    if (!trackDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (trackDropdownRef.current && !trackDropdownRef.current.contains(e.target as Node)) {
        setTrackDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [trackDropdownOpen]);

  const sidebarContent = (
    <div className="p-5 pb-10">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-brand-600 dark:text-brand-400 hover:opacity-80 transition-opacity">
          <img src="/bdoi-logo.png" alt="BdOI" className="w-7 h-7 rounded-full" />
          BdOI Guide
        </Link>
        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-6 relative" ref={trackDropdownRef}>
        <button
          onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-[#0f172a] border border-[#1e293b] rounded-xl hover:border-brand-700 transition-colors cursor-pointer shadow-sm group"
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
              currentTrack.track === 'intro' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              currentTrack.track === 'bronze' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
              currentTrack.track === 'silver' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400' :
              currentTrack.track === 'gold' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              currentTrack.track === 'contests' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {currentTrack.track === 'intro' ? '🌱' :
               currentTrack.track === 'bronze' ? '🥉' :
               currentTrack.track === 'silver' ? '🥈' :
               currentTrack.track === 'gold' ? '🥇' :
               currentTrack.track === 'contests' ? '🏆' : '💎'}
            </div>
            <span className="font-bold text-sm capitalize text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{currentTrack.track}</span>
          </div>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${trackDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {trackDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-fade-in-up">
            {tracks.map(t => (
              <Link
                key={t.track}
                href={`/${t.track}`}
                onClick={() => setTrackDropdownOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${currentTrack.track === t.track ? 'bg-brand-50/50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <span className="w-5 text-center text-xs opacity-80">
                  {t.track === 'intro' ? '🌱' :
                   t.track === 'bronze' ? '🥉' :
                   t.track === 'silver' ? '🥈' :
                   t.track === 'gold' ? '🥇' :
                   t.track === 'contests' ? '🏆' : '💎'}
                </span>
                <span className="capitalize">{t.track}</span>
              </Link>
            ))}
            <div className="my-1 border-t border-[#1e293b]"></div>
            <Link
              href="/problems"
              onClick={() => setTrackDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <span className="w-5 text-center text-xs opacity-80">🧩</span>
              <span className="capitalize">Problems</span>
            </Link>
          </div>
        )}
      </div>

      <nav className="space-y-1">
        {categories.map((category) => {
          const isExpanded = expandedCategories[category.name] !== false;
          
          return (
            <div key={category.name} className="mb-1">
              {/* Only show category header if there are multiple categories */}
              {categories.length > 1 && (
                <button 
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                >
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {category.name}
                  </h3>
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </button>
              )}
              
              {isExpanded && (
                <ul className="space-y-0.5 mt-0.5">
                  {category.pages.map((page) => {
                    const href = `/${currentTrack.track}/${page.slug}`;
                    const isActive = pathname === href;

                    return (
                      <li key={page.slug}>
                        <Link
                          href={href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${isActive ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-900/20 dark:text-brand-400 border-l-2 border-brand-500 ml-0' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                          <span className="truncate">{page.frontmatter.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[#1e293b] bg-[#0f172a] min-h-screen overflow-y-auto hidden md:block">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
          <aside 
            ref={sidebarRef}
            className="absolute top-0 left-0 bottom-0 w-72 bg-[#0f172a] border-r border-[#1e293b] overflow-y-auto animate-slide-in-left shadow-2xl"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
