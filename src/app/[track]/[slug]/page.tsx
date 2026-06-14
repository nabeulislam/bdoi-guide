import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPageBySlug, getAllPages, getAdjacentPages } from '@/lib/content';
import { notFound } from 'next/navigation';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import { Problem, Problems } from '@/components/mdx/Problem';
import { Resources } from '@/components/mdx/Resource';
import { Info, Warning, Note, Callout } from '@/components/mdx/Callout';
import { Spoiler } from '@/components/mdx/Spoiler';
import { Countdown } from '@/components/mdx/Countdown';
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

  // Build components with problems from frontmatter
  const components = {
    Problem,
    Problems: (props: Record<string, unknown>) => <Problems problems={page.frontmatter.problems} {...props} />,
    Info,
    Warning,
    Note,
    Callout,
    Spoiler,
    Countdown,
  };

  return (
    <article className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href={`/${params.track}`}
            className="uppercase tracking-wider text-brand-600 dark:text-brand-400 hover:underline"
          >
            {TRACK_LABELS[params.track] || params.track}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Module {page.frontmatter.order}</span>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
        {page.frontmatter.title}
      </h1>
      
      {page.frontmatter.description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed border-l-4 border-brand-500 pl-4 py-1">
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
              rehypePlugins: [rehypeKatex, rehypeHighlight],
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
