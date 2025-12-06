import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Filter, ArrowLeft, Clock, X, Search as SearchIcon } from 'lucide-react';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { getGeminiRecommendations } from '../services/geminiService';
import { MOCK_LIBRARY } from '../constants';

interface SearchPageProps {
  query: string;
  onPress: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  watchlist: MediaItem[];
  onToggleWatchlist: (item: MediaItem) => void;
  onBack?: () => void;
  recentSearches: string[];
  onSearchHistoryItem: (query: string) => void;
  onClearHistory: () => void;
  onAddToQueue: (item: MediaItem) => void;
  onToggleWatched: (item: MediaItem) => void;
  watchedIds: string[];
}

export const SearchPage: React.FC<SearchPageProps> = ({ 
    query, 
    onPress, 
    onPlay, 
    watchlist, 
    onToggleWatchlist, 
    onBack,
    recentSearches,
    onSearchHistoryItem,
    onClearHistory,
    onAddToQueue,
    onToggleWatched,
    watchedIds
}) => {
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'library' | 'ai'>('library');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [aiError, setAiError] = useState<string | null>(null);

  // Switch to AI mode automatically if query looks like a question or natural language
  useEffect(() => {
    if (query.split(' ').length > 3 || query.includes('?')) {
      setMode('ai');
    } else {
      setMode('library');
    }
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
          setResults([]);
          return;
      }
      
      setLoading(true);
      setAiError(null);

      if (mode === 'library') {
        // Simple local filter
        const filtered = MOCK_LIBRARY.filter(item => {
          const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || 
                               item.genre?.some(g => g.toLowerCase().includes(query.toLowerCase()));
          const matchesType = filterType === 'all' || item.type === filterType;
          return matchesQuery && matchesType;
        });
        
        // Simulate delay
        setTimeout(() => {
            setResults(filtered);
            setLoading(false);
        }, 300);
      } else {
        // AI Search
        try {
          const aiResults = await getGeminiRecommendations(query, filterType);
          setResults(aiResults);
        } catch (e) {
          setAiError("Failed to get recommendations.");
        } finally {
          setLoading(false);
        }
      }
    };

    const debounce = setTimeout(fetchResults, 600);
    return () => clearTimeout(debounce);
  }, [query, mode, filterType]);

  // If no query, show history or empty state
  if (!query) {
      return (
        <div className="p-6 md:p-10 min-h-screen">
             <div className="flex items-center gap-3 mb-8">
                {onBack && (
                    <button onClick={onBack} className="text-gray-400 hover:text-white md:hidden">
                        <ArrowLeft size={24} />
                    </button>
                )}
                <h1 className="text-2xl font-bold text-white">Search</h1>
            </div>

            <div className="max-w-2xl">
                {recentSearches.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-300">Recent Searches</h2>
                            <button 
                                onClick={onClearHistory}
                                className="text-xs text-plex-orange hover:text-white uppercase font-bold"
                            >
                                Clear History
                            </button>
                        </div>
                        <div className="space-y-1">
                            {recentSearches.map((term, index) => (
                                <button 
                                    key={index}
                                    onClick={() => onSearchHistoryItem(term)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3 text-gray-300 group-hover:text-white">
                                        <Clock size={16} className="text-gray-500 group-hover:text-plex-orange" />
                                        <span>{term}</span>
                                    </div>
                                    <SearchIcon size={16} className="text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-dashed border-white/10 rounded-xl">
                         <SearchIcon size={48} className="mb-4 opacity-20" />
                         <p className="text-lg font-medium">Search for movies, shows, and more</p>
                         <p className="text-sm">Start typing to see results</p>
                    </div>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
             {onBack && (
                <button onClick={onBack} className="text-gray-400 hover:text-white md:hidden">
                    <ArrowLeft size={24} />
                </button>
             )}
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Results for "{query}"
            </h1>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <div className="bg-black/30 p-1 rounded-lg flex text-sm items-center">
                <span className="text-gray-500 px-2"><Filter size={14}/></span>
                <button 
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-md transition-all ${filterType === 'all' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilterType('movie')}
                    className={`px-3 py-1.5 rounded-md transition-all ${filterType === 'movie' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                    Movies
                </button>
                <button 
                    onClick={() => setFilterType('tv')}
                    className={`px-3 py-1.5 rounded-md transition-all ${filterType === 'tv' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                    TV
                </button>
            </div>

            {/* Mode Toggle */}
            <div className="bg-black/30 p-1 rounded-lg flex text-sm">
                <button 
                    onClick={() => setMode('library')}
                    className={`px-4 py-1.5 rounded-md transition-all ${mode === 'library' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                    Library
                </button>
                <button 
                    onClick={() => setMode('ai')}
                    className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-2 ${mode === 'ai' ? 'bg-plex-orange text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                    <Sparkles size={14} />
                    Ask AI
                </button>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 size={48} className="animate-spin mb-4 text-plex-orange" />
            <p>{mode === 'ai' ? 'Consulting the Oracle...' : 'Searching Library...'}</p>
        </div>
      ) : (
        <>
            {aiError && (
                <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg text-red-200 flex items-center gap-3 mb-6">
                    <AlertCircle size={20} />
                    {aiError}
                </div>
            )}

            {results.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    <h3 className="text-xl font-medium mb-2">No results found</h3>
                    <p>Try switching to "Ask AI" for external recommendations.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {results.map(item => (
                        <MediaCard 
                            key={item.id} 
                            item={item} 
                            onPress={onPress} 
                            onPlay={onPlay}
                            onToggleWatchlist={onToggleWatchlist}
                            isInWatchlist={watchlist.some(w => w.id === item.id)}
                            onAddToQueue={onAddToQueue}
                            onToggleWatched={onToggleWatched}
                            isWatched={watchedIds.includes(item.id)}
                        />
                    ))}
                </div>
            )}
            
            {mode === 'ai' && results.length > 0 && (
                <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                    <Sparkles className="text-plex-orange mt-1 shrink-0" size={20} />
                    <div>
                        <h4 className="font-bold text-gray-200 mb-1">AI Insight</h4>
                        <p className="text-sm text-gray-400">
                            These titles were recommended by Gemini based on your specific request. 
                            While some might not be in your local library, you can add them to your Watchlist.
                        </p>
                    </div>
                </div>
            )}
        </>
      )}
    </div>
  );
};