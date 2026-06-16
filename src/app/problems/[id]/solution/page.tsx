import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ChevronLeft, ExternalLink, BookOpen } from 'lucide-react';
import { getAllProblems, getSolutionById } from '@/lib/content';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Solution } from '@/components/mdx/Solution';
import { Info, Warning, Note, Callout } from '@/components/mdx/Callout';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeExternalLinks from 'rehype-external-links';

const components = {
  pre: CodeBlock,
  Solution,
  Info,
  Warning,
  Note,
  Callout,
};

export async function generateStaticParams() {
  const problems = getAllProblems();
  return problems.filter(p => p.hasSolution).map((p) => ({
    id: p.id,
  }));
}

export default async function SolutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problems = getAllProblems();
  const problem = problems.find(p => p.id === id);
  const solution = getSolutionById(id);

  if (!problem || !solution) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/problems" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-6 group">
          <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Problems
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Solution: {problem.name}
        </h1>
        <div className="flex flex-wrap gap-4 items-center text-sm">
          <a href={problem.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 font-semibold transition-colors border border-blue-500/20">
            View Problem Statement <ExternalLink size={14} />
          </a>
          <span className={`px-2.5 py-1 font-bold rounded-md ${
            problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
            'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {problem.difficulty}
          </span>
          {problem.source && (
            <span className="px-2.5 py-1 bg-[#1e293b] text-slate-300 font-medium rounded-md border border-[#334155]">
              Source: {problem.source}
            </span>
          )}
        </div>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-slate-300 font-medium mb-1">Appears In</h3>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-blue-400" />
            <Link href={`/${problem.track}/${problem.moduleSlug}`} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              {problem.categoryName} - {problem.moduleName}
            </Link>
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-pre:bg-transparent prose-pre:border-none prose-pre:p-0">
        <MDXRemote 
          source={solution.content} 
          components={components} 
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath, remarkGfm],
              rehypePlugins: [
                rehypeKatex, 
                rehypeHighlight, 
                [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
              ],
            }
          }}
        />
      </div>
    </div>
  );
}
