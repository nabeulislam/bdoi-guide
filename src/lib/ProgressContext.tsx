"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ProgressContextType {
  completedPages: string[];
  markCompleted: (slug: string) => void;
  markIncomplete: (slug: string) => void;
  isCompleted: (slug: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedPages, setCompletedPages] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bdoi-progress');
    if (saved) {
      try {
        setCompletedPages(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bdoi-progress', JSON.stringify(completedPages));
    }
  }, [completedPages, isLoaded]);

  const markCompleted = (slug: string) => {
    setCompletedPages(prev => Array.from(new Set([...prev, slug])));
  };

  const markIncomplete = (slug: string) => {
    setCompletedPages(prev => prev.filter(p => p !== slug));
  };

  const isCompleted = (slug: string) => {
    return completedPages.includes(slug);
  };

  return (
    <ProgressContext.Provider value={{ completedPages, markCompleted, markIncomplete, isCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
