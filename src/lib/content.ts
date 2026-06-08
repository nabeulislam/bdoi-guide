import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export interface Problem {
  name: string;
  url: string;
  difficulty: string;
}

export interface Resource {
  name: string;
  url: string;
  type: string;
}

export interface Frontmatter {
  title: string;
  order?: number; // Kept for backwards compatibility but we rely on filename prefixes now
  difficulty: string;
  description: string;
  problems?: Problem[];
  resources?: Resource[];
}

export interface ContentPage {
  slug: string; // The URL slug (e.g. "getting-started")
  track: string;
  categorySlug: string; // e.g. "basics"
  frontmatter: Frontmatter;
  content: string;
  order: number; // Parsed from filename prefix
}

export interface CategoryData {
  name: string; // Formatted name (e.g. "Basics")
  slug: string; // URL slug (e.g. "basics")
  order: number; // Parsed from folder prefix
  pages: ContentPage[];
}

export interface TrackData {
  track: string;
  categories: CategoryData[];
  pages: ContentPage[]; // Flat list of pages for easy adjacent navigation
}

export const TRACK_ORDER = ['intro', 'bronze', 'silver', 'gold', 'platinum'];

export function getAllTracks(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const tracks = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => TRACK_ORDER.includes(name));
  
  return tracks.sort((a, b) => TRACK_ORDER.indexOf(a) - TRACK_ORDER.indexOf(b));
}

function parseOrderSlug(name: string): { order: number; slug: string; nameStr: string } {
  // Matches "01-basics", "2-graphs", etc.
  const match = name.match(/^(\d+)-(.*)$/);
  if (match) {
    const slug = match[2];
    // Capitalize each word for the display name
    const nameStr = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return { order: parseInt(match[1], 10), slug, nameStr };
  }
  // Fallback
  return { order: 999, slug: name, nameStr: name };
}

export function getTrackData(track: string): TrackData | null {
  const trackPath = path.join(contentDir, track);
  if (!fs.existsSync(trackPath)) return null;

  const categories: CategoryData[] = [];
  const allPages: ContentPage[] = [];

  const categoryFolders = fs.readdirSync(trackPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory());

  for (const catFolder of categoryFolders) {
    const { order: catOrder, slug: catSlug, nameStr: catName } = parseOrderSlug(catFolder.name);
    const catPath = path.join(trackPath, catFolder.name);
    
    const files = fs.readdirSync(catPath)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    const categoryPages: ContentPage[] = [];

    for (const file of files) {
      const { order: pageOrder, slug: pageSlug } = parseOrderSlug(file.replace(/\.mdx?$/, ''));
      const filePath = path.join(catPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      const page: ContentPage = {
        slug: pageSlug,
        track,
        categorySlug: catSlug,
        frontmatter: data as Frontmatter,
        content,
        order: pageOrder,
      };

      categoryPages.push(page);
      allPages.push(page);
    }

    // Sort pages within category by their file prefix order
    categoryPages.sort((a, b) => a.order - b.order);

    categories.push({
      name: catName,
      slug: catSlug,
      order: catOrder,
      pages: categoryPages,
    });
  }

  // Sort categories by their folder prefix order
  categories.sort((a, b) => a.order - b.order);
  
  // Sort flat pages by category order then page order
  allPages.sort((a, b) => {
    const catA = categories.find(c => c.slug === a.categorySlug)?.order || 999;
    const catB = categories.find(c => c.slug === b.categorySlug)?.order || 999;
    if (catA !== catB) return catA - catB;
    return a.order - b.order;
  });

  return {
    track,
    categories,
    pages: allPages,
  };
}

export function getAllPages(): TrackData[] {
  const tracks = getAllTracks();
  const trackDataList: TrackData[] = [];
  for (const track of tracks) {
    const data = getTrackData(track);
    if (data) trackDataList.push(data);
  }
  return trackDataList;
}

export function getPageBySlug(track: string, slug: string): ContentPage | null {
  const data = getTrackData(track);
  if (!data) return null;
  return data.pages.find(page => page.slug === slug) || null;
}

export function getAdjacentPages(track: string, currentSlug: string) {
  const allTracks = getAllPages();
  // Flatten all pages across all tracks in curriculum order
  const allPages = allTracks.flatMap(t => t.pages);
  
  const currentIndex = allPages.findIndex(p => p.track === track && p.slug === currentSlug);
  
  if (currentIndex === -1) return { prev: null, next: null };
  
  return {
    prev: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
  };
}
