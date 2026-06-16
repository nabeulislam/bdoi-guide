import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPageBySlug, getAllPages, getAdjacentPages, generateProblemId, hasSolution } from '@/lib/content';
import { notFound } from 'next/navigation';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeExternalLinks from 'rehype-external-links';
import 'katex/dist/katex.min.css';
import { Problems, FocusProblem } from '@/components/mdx/Problem';
import { Resources } from '@/components/mdx/Resource';
import { Info, Warning, Note, Callout, JoinDiscord } from '@/components/mdx/Callout';
import { Spoiler } from '@/components/mdx/Spoiler';
import { Solution } from '@/components/mdx/Solution';
import { Countdown } from '@/components/mdx/Countdown';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const allTracks = getAllPages();
  const params: { track: string; slug: string }[] = [];

  allTracks.forEach(trackData => {
    trackData.pages.forEach(page => {
      params.push({
        track: trackData.track,
        slug: page.slug,
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: { track: string; slug: string } }): Promise<Metadata> {
  const page = getPageBySlug(params.track, params.slug);
  if (!page) return {};
  
  return {
    title: `${page.frontmatter.title} — ${params.track.charAt(0).toUpperCase() + params.track.slice(1)} | BdOI Guide`,
    description: page.frontmatter.description || `Learn ${page.frontmatter.title} in the BdOI Guide ${params.track} track.`,
  };
}

const TRACK_LABELS: Record<string, string> = {
  intro: 'Intro',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  contests: 'Contests',
};

export default async function Page({ params }: { params: { track: string; slug: string } }) {
  const page = getPageBySlug(params.track, params.slug);

  if (!page) {
    return notFound();
  }

  // Cross-track navigation
  const { prev: prevPage, next: nextPage } = getAdjacentPages(params.track, params.slug);

  // Augment problems with internal solution links if they exist
  const augmentedProblems = page.frontmatter.problems?.map(prob => {
    const id = generateProblemId(prob.name);
    return {
      ...prob,
      internalSolution: hasSolution(id) ? `/problems/${id}/solution` : undefined,
    };
  });

  // Build components with problems from frontmatter
  const components = {
    Problems: (props: Record<string, unknown>) => <Problems problems={augmentedProblems} {...props} />,
    FocusProblem,
    Resources,
    Info,
    Warning,
    Note,
    Callout,
    JoinDiscord,
    Spoiler,
    Solution,
    Countdown,
    pre: CodeBlock,
    table: (props: any) => (
      <div className="w-full overflow-x-auto my-8 not-prose rounded-lg border border-[#334155]">
        <table className="w-full text-left border-collapse" {...props} />
      </div>
    ),
    thead: (props: any) => <thead className="bg-[#1e293b] border-b border-[#334155]" {...props} />,
    tr: (props: any) => <tr className="border-b border-[#334155]/50 last:border-0 hover:bg-[#1e293b]/30 transition-colors" {...props} />,
    th: (props: any) => <th className="px-4 py-3 font-semibold text-xs text-slate-400 uppercase tracking-wider" {...props} />,
    td: (props: any) => <td className="px-4 py-3 text-slate-300 text-sm align-top" {...props} />,
  };

  return (
    <article className="max-w-3xl mx-auto pb-20">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href={`/${params.track}`}
            className="uppercase tracking-wider text-brand-600 dark:text-brand-400 hover:underline"
          >
            {TRACK_LABELS[params.track] || params.track}
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-500 dark:text-gray-400">Module {page.frontmatter.order}</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-white tracking-tight">
        {page.frontmatter.title}
      </h1>

      {/* Module Info Bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 py-2.5 px-4 bg-[#1e293b] rounded-lg border border-[#334155] text-sm">
        {page.frontmatter.author && (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-400">
              {Array.isArray(page.frontmatter.author) ? 'Authors:' : 'Author:'}
            </span>
            <span className="text-brand-400 font-medium">
              {Array.isArray(page.frontmatter.author) ? page.frontmatter.author.join(', ') : page.frontmatter.author}
            </span>
          </div>
        )}
        {page.frontmatter.author && page.frontmatter.difficulty && (
          <span className="text-gray-700">|</span>
        )}
        {page.frontmatter.difficulty && (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-400">Difficulty:</span>
            <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
              page.frontmatter.difficulty.toLowerCase() === 'intro' ? 'bg-[#14532d] text-[#4ade80]' :
              page.frontmatter.difficulty.toLowerCase() === 'bronze' ? 'bg-[#7c2d12] text-[#fb923c]' :
              page.frontmatter.difficulty.toLowerCase() === 'silver' ? 'bg-[#334155] text-[#94a3b8]' :
              page.frontmatter.difficulty.toLowerCase() === 'gold' ? 'bg-[#713f12] text-[#facc15]' :
              page.frontmatter.difficulty.toLowerCase() === 'platinum' ? 'bg-[#1e3a8a] text-[#60a5fa]' :
              'bg-[#1f2937] text-gray-300'
            }`}>
              {page.frontmatter.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {page.frontmatter.description && (
        <p className="text-base text-gray-300 mb-8 leading-relaxed border-l-[3px] border-brand-500 pl-4 py-0.5">
          {page.frontmatter.description}
        </p>
      )}

      {page.frontmatter.resources && (
        <Resources resources={page.frontmatter.resources} />
      )}

      <div className="prose prose-lg dark:prose-invert prose-brand max-w-none">
        <MDXRemote 
          source={page.content} 
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath, remarkGfm],
              rehypePlugins: [rehypeKatex, rehypeHighlight, [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]],
            }
          }}
        />
      </div>

      <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4">
        {prevPage ? (
          <Link 
            href={`/${prevPage.track}/${prevPage.slug}`}
            className="group flex flex-col items-start p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all sm:w-1/2 cursor-pointer"
          >
            <span className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Previous
            </span>
            <span className="font-bold text-base">{prevPage.frontmatter.title}</span>
            {prevPage.track !== params.track && (
              <span className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">
                {TRACK_LABELS[prevPage.track] || prevPage.track} Track
              </span>
            )}
          </Link>
        ) : <div className="sm:w-1/2" />}

        {nextPage ? (
          <Link 
            href={`/${nextPage.track}/${nextPage.slug}`}
            className="group flex flex-col items-end p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all sm:w-1/2 text-right cursor-pointer"
          >
            <span className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
              Next <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="font-bold text-base">{nextPage.frontmatter.title}</span>
            {nextPage.track !== params.track && (
              <span className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">
                {TRACK_LABELS[nextPage.track] || nextPage.track} Track
              </span>
            )}
          </Link>
        ) : <div className="sm:w-1/2" />}
      </div>
    </article>
  );
}
