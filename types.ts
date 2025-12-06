export interface CastMember {
  name: string;
  character: string;
  imageUrl?: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  thumbnailUrl: string;
  duration: string;
  description: string;
  airDate?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  year: number;
  type: 'movie' | 'tv' | 'music';
  posterUrl: string;
  backdropUrl?: string;
  duration?: string; // e.g. "1 hr 45 min"
  rating?: string; // e.g. "PG-13"
  description?: string;
  genre?: string[];
  cast?: CastMember[];
  videoUrl?: string; // URL for the video content
  episodes?: Episode[];
}

export interface Section {
  title: string;
  items: MediaItem[];
}

export enum NavItem {
  HOME = 'home',
  MOVIES = 'movies',
  TV = 'tv',
  MUSIC = 'music',
  WATCHLIST = 'watchlist',
  SEARCH = 'search',
  LIVE = 'live',
  SETTINGS = 'settings',
  CAST = 'cast',
  UPLOAD = 'upload',
  UHD = 'uhd',
  KIDS = 'kids',
  PODCASTS = 'podcasts',
  WEB = 'web',
  NEWS = 'news'
}