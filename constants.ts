import { MediaItem } from './types';

// Helper to generate consistent placeholder images
const getPoster = (id: number) => `https://picsum.photos/seed/${id}/300/450`;
const getBackdrop = (id: number) => `https://picsum.photos/seed/${id}-backdrop/1280/720`;

export const MOCK_LIBRARY: MediaItem[] = [
  {
    id: '1',
    title: 'Interstellar Echoes',
    year: 2023,
    type: 'movie',
    posterUrl: getPoster(101),
    backdropUrl: getBackdrop(101),
    duration: '2 hr 14 min',
    rating: 'PG-13',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: ['Sci-Fi', 'Adventure']
  },
  {
    id: '2',
    title: 'The Silent City',
    year: 2022,
    type: 'movie',
    posterUrl: getPoster(102),
    backdropUrl: getBackdrop(102),
    duration: '1 hr 45 min',
    rating: 'R',
    description: 'In a future where sound is deadly, a family must live their lives in silence to hide from creatures that hunt by sound.',
    genre: ['Horror', 'Thriller']
  },
  {
    id: '3',
    title: 'Neon Nights',
    year: 2024,
    type: 'tv',
    posterUrl: getPoster(103),
    backdropUrl: getBackdrop(103),
    duration: '45 min',
    rating: 'TV-MA',
    description: 'A detective navigates the seedy underbelly of a cyberpunk metropolis.',
    genre: ['Sci-Fi', 'Crime']
  },
  {
    id: '4',
    title: 'Alpine Dreams',
    year: 2021,
    type: 'movie',
    posterUrl: getPoster(104),
    backdropUrl: getBackdrop(104),
    duration: '1 hr 30 min',
    rating: 'PG',
    description: 'A documentary exploring the hidden lives of mountain goats.',
    genre: ['Documentary']
  },
  {
    id: '5',
    title: 'Cyber Heist',
    year: 2023,
    type: 'movie',
    posterUrl: getPoster(105),
    backdropUrl: getBackdrop(105),
    duration: '2 hr 05 min',
    rating: 'R',
    description: 'A master hacker is forced to pull off one last job to save his family.',
    genre: ['Action', 'Thriller']
  },
  {
    id: '6',
    title: 'Lost in the Woods',
    year: 2020,
    type: 'tv',
    posterUrl: getPoster(106),
    backdropUrl: getBackdrop(106),
    duration: '50 min',
    rating: 'TV-14',
    description: 'A group of friends gets lost in a mysterious forest where time stands still.',
    genre: ['Mystery', 'Drama']
  },
    {
    id: '7',
    title: 'Ocean Deep',
    year: 2019,
    type: 'movie',
    posterUrl: getPoster(107),
    backdropUrl: getBackdrop(107),
    duration: '1 hr 55 min',
    rating: 'PG',
    description: 'Exploration of the deepest trenches of the ocean.',
    genre: ['Documentary', 'Nature']
  },
  {
    id: '8',
    title: 'Velocity',
    year: 2023,
    type: 'movie',
    posterUrl: getPoster(108),
    backdropUrl: getBackdrop(108),
    duration: '2 hr 10 min',
    rating: 'PG-13',
    description: 'High speed racing with high stakes.',
    genre: ['Action', 'Sport']
  }
];

export const HERO_ITEM: MediaItem = {
  id: 'hero-1',
  title: 'Guardians of the Galaxy Vol. 3',
  year: 2023,
  type: 'movie',
  posterUrl: 'https://picsum.photos/seed/hero-poster/300/450',
  backdropUrl: 'https://picsum.photos/seed/hero-bg/1920/1080', // Simulate high res
  duration: '2 hr 30 min',
  rating: 'PG-13',
  description: 'Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own - a mission that could mean the end of the Guardians if not successful.',
  genre: ['Action', 'Adventure', 'Comedy']
};
