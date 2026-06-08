import React from 'react';
import { Info as InfoIcon, AlertTriangle, Lightbulb } from 'lucide-react';

export const Callout: React.FC<{ children: React.ReactNode; type?: 'info' | 'warning' | 'note' }> = ({ 
  children, 
  type = 'info' 
}) => {
  let style = 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-200';
  let Icon = InfoIcon;

  if (type === 'warning') {
    style = 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-200';
    Icon = AlertTriangle;
  } else if (type === 'note') {
    style = 'bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-950/40 dark:border-brand-900/50 dark:text-brand-200';
    Icon = Lightbulb;
  }

  return (
    <div className={`my-6 flex gap-3 p-4 rounded-xl border ${style}`}>
      <div className="mt-0.5 flex-shrink-0">
        <Icon size={20} className="opacity-80" />
      </div>
      <div className="prose-p:m-0 prose-p:leading-relaxed text-sm">
        {children}
      </div>
    </div>
  );
};

export const Info: React.FC<{ children: React.ReactNode }> = ({ children }) => <Callout type="info">{children}</Callout>;
export const Warning: React.FC<{ children: React.ReactNode }> = ({ children }) => <Callout type="warning">{children}</Callout>;
export const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => <Callout type="note">{children}</Callout>;
