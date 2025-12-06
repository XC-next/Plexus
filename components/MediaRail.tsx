import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MediaCard } from './MediaCard';
import { MediaItem } from '../types';

interface MediaRailProps {
  title: string;
  items: MediaItem[];
  onPress: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  watchlist?: MediaItem[];
  onToggleWatchlist?: (item: MediaItem) => void;
  onAddToQueue?: (item: MediaItem) => void;
  onToggleWatched?: (item: MediaItem) => void;
  watchedIds?: string[];
}

export const MediaRail: React.FC<MediaRailProps> = ({ 
    title, 
    items, 
    onPress, 
    onPlay, 
    watchlist, 
    onToggleWatchlist,
    onAddToQueue,
    onToggleWatched,
    watchedIds
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 pl-6 md:pl-10">
      <div className="flex items-center gap-2 mb-4 group cursor-pointer w-fit">
        <h2 className="text-xl font-bold text-gray-100 group-hover:text-plex-orange transition-colors">
          {title}
        </h2>
        <ChevronRight size={20} className="text-gray-500 group-hover:text-plex-orange transition-colors" />
      </div>
      
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide pr-10 pt-2 pl-1">
          {items.map((item) => (
            <MediaCard 
                key={item.id} 
                item={item} 
                onPress={onPress} 
                onPlay={onPlay} 
                onToggleWatchlist={onToggleWatchlist}
                isInWatchlist={watchlist?.some(w => w.id === item.id)}
                onAddToQueue={onAddToQueue}
                onToggleWatched={onToggleWatched}
                isWatched={watchedIds?.includes(item.id)}
            />
          ))}
        </div>
        {/* Fade effect on right edge */}
        <div className="absolute top-0 right-0 bottom-6 w-16 bg-gradient-to-l from-plex-bg to-transparent pointer-events-none md:block hidden"></div>
      </div>
    </div>
  );
};