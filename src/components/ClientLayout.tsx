"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Search } from '@/components/Search';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { TrackData } from '@/lib/content';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface ClientLayoutProps {
  tracks: TrackData[];
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ tracks, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Determine if we're on a module page (e.g., /bronze/simulation) vs track root (e.g., /bronze)
  const pathParts = pathname.split('/').filter(Boolean);
  const isModulePage = pathParts.length >= 2 && pathParts[0] !== 'roadmap';
  const isTrackRoot = pathParts.length === 1 && ['intro', 'bronze', 'silver', 'gold', 'platinum'].includes(pathParts[0]);
  
  // Sidebar only on module pages
  const showSidebar = isModulePage;

  return (
    <ThemeProvider>
      {showSidebar && (
        <Sidebar tracks={tracks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col min-h-screen max-h-screen overflow-y-auto relative">
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {showSidebar && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            )}
            <Link href="/" className={`font-bold text-brand-600 dark:text-brand-400 text-sm hover:opacity-80 transition-opacity cursor-pointer ${showSidebar ? 'md:hidden' : ''}`}>
              BdOI Guide
            </Link>
            
            {/* Desktop Track Navigation */}
            {!showSidebar && (
              <nav className="hidden md:flex items-center gap-1 ml-4">
                {tracks.map(t => (
                  <Link 
                    key={t.track}
                    href={`/${t.track}`}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors cursor-pointer ${pathname === `/${t.track}` ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                  >
                    {t.track}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Search />
            <ThemeToggle />
          </div>
        </header>
        
        <main className={`flex-1 w-full mx-auto ${isTrackRoot ? '' : 'max-w-4xl p-4 sm:p-6 md:p-10 lg:p-12'}`}>
          <div className="animate-fade-in-up h-full">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};
