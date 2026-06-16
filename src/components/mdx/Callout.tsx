import React from 'react';
import { Info as InfoIcon, AlertTriangle, Lightbulb } from 'lucide-react';

export const Callout: React.FC<{ children: React.ReactNode; type?: 'info' | 'warning' | 'note' }> = ({ 
  children, 
  type = 'info' 
}) => {
  let style = 'bg-blue-950/40 border-blue-900/50 text-blue-200';
  let Icon = InfoIcon;

  if (type === 'warning') {
    style = 'bg-amber-950/40 border-amber-900/50 text-amber-200';
    Icon = AlertTriangle;
  } else if (type === 'note') {
    style = 'bg-brand-950/40 border-brand-900/50 text-brand-200';
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

export const JoinDiscord: React.FC = () => {
  return (
    <div className="my-8 p-6 rounded-xl bg-[#0f172a] border border-[#1e293b]">
      <h3 className="text-xl font-semibold text-white mb-2">Join the BdOI Discord!</h3>
      <p className="text-gray-400 text-sm mb-6">
        Stuck on a problem, or don&apos;t understand a module? Join the official BdOI Discord and get help from other competitive programmers!
      </p>
      <a 
        href="#" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-gray-200 font-medium rounded-md transition-colors text-sm"
      >
        Join Discord
      </a>
    </div>
  );
};
