import { getTrackData } from '@/lib/content';
import { TrackLandingClient } from '@/components/TrackLandingClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const TRACK_ORDER = ['intro', 'bronze', 'silver', 'gold', 'platinum'];

export async function generateStaticParams() {
  return TRACK_ORDER.map((track) => ({
    track,
  }));
}

export async function generateMetadata({ params }: { params: { track: string } }): Promise<Metadata> {
  const trackName = params.track.charAt(0).toUpperCase() + params.track.slice(1);
  return {
    title: `${trackName} Track — BdOI Guide`,
    description: `Master competitive programming with the BdOI Guide ${trackName} track.`,
  };
}

export default async function TrackLandingPage({ params }: { params: { track: string } }) {
  if (!TRACK_ORDER.includes(params.track)) {
    return notFound();
  }

  const trackData = getTrackData(params.track);
  const categories = trackData?.categories || [];
  
  if (categories.length === 0) {
    return notFound();
  }

  const totalModules = categories.reduce((sum, cat) => sum + cat.pages.length, 0);

  return (
    <TrackLandingClient 
      track={params.track} 
      categories={categories} 
      totalModules={totalModules} 
    />
  );
}
