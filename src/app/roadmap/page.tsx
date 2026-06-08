import { getAllPages } from '@/lib/content';
import { RoadmapClient } from '@/components/RoadmapClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Roadmap — BdOI Guide',
  description: 'Track your progress through the BdOI competitive programming curriculum across all tracks from Intro to Platinum.',
};

export default function RoadmapPage() {
  const tracks = getAllPages();

  return <RoadmapClient tracks={tracks} />;
}
