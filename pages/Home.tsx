import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { MediaRail } from '../components/MediaRail';
import { HERO_ITEM, MOCK_LIBRARY } from '../constants';
import { MediaItem } from '../types';
import { getPersonalizedSuggestions } from '../services/geminiService';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
    onPlay: (item: MediaItem) => void;
    onPress: (item: MediaItem) => void;
    category?: string;
    watchlist: MediaItem[];
    onToggleWatchlist: (item: MediaItem) => void;
    onAddToQueue: (item: MediaItem) => void;
    onToggleWatched: (item: MediaItem) => void;
    watchedIds: string[];
    uploadedItems?: MediaItem[];
}

export const Home: React.FC<HomeProps> = ({ 
    onPlay, 
    onPress, 
    category, 
    watchlist, 
    onToggleWatchlist,
    onAddToQueue,
    onToggleWatched,
    watchedIds,
    uploadedItems = []
}) => {
    const [aiItems, setAiItems] = useState<MediaItem[]>([]);
    const [loadingAi, setLoadingAi] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        // Only fetch AI suggestions for the main Home view (no category)
        if (!category) {
            setLoadingAi(true);
            getPersonalizedSuggestions()
                .then(items => {
                    setAiItems(items);
                })
                .catch(err => console.error("Failed to load AI suggestions", err))
                .finally(() => setLoadingAi(false));
        } else {
            setAiItems([]);
        }
    }, [category]);

    // Handle Watchlist View specifically
    if (category === 'watchlist') {
        return (
            <div className="animate-fade-in pb-20 pt-10 px-6 md:px-10">
                 <h1 className="text-3xl font-bold text-white mb-6">{t('watchlist')}</h1>
                 {watchlist.length === 0 ? (
                    <div className="text-gray-500 flex flex-col items-center justify-center h-64 border border-white/5 rounded-lg bg-white/5">
                        <p>{t('empty_watchlist')}</p>
                        <p className="text-sm mt-2">{t('add_to_watchlist_hint')}</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {/* Grid handled by Rail for now */}
                    </div>
                 )}
                 
                 {watchlist.length > 0 && (
                    <MediaRail 
                        title={t('saved_content')} 
                        items={watchlist} 
                        onPress={onPress}
                        onPlay={onPlay}
                        watchlist={watchlist}
                        onToggleWatchlist={onToggleWatchlist}
                        onAddToQueue={onAddToQueue}
                        onToggleWatched={onToggleWatched}
                        watchedIds={watchedIds}
                    />
                 )}
            </div>
        );
    }

    // Filter logic based on category
    let content = [...MOCK_LIBRARY];
    let hero = HERO_ITEM;
    let pageTitle = "";

    if (category === 'movies') {
        content = content.filter(i => i.type === 'movie');
        if (hero.type !== 'movie') hero = content[0] || hero;
    } else if (category === 'tv') {
        content = content.filter(i => i.type === 'tv');
        if (hero.type !== 'tv') hero = content[0] || hero;
    } else if (category === 'uhd') {
        // Mock UHD filter: random selection
        content = content.filter(() => Math.random() > 0.5); 
        pageTitle = t('uhd_movies');
    } else if (category === 'kids') {
        // Mock Kids filter: Rating based
        content = content.filter(i => i.rating === 'PG' || i.rating === 'G' || i.rating === 'TV-Y7');
        if (content.length === 0) content = MOCK_LIBRARY.slice(0, 3); // Fallback
        pageTitle = t('kids');
    } else if (['podcasts', 'web', 'news'].includes(category || '')) {
         // Placeholder content for new sections
         content = []; 
         // Helper to capitalize first letter
         const catName = category?.charAt(0).toUpperCase() + category?.slice(1) || '';
         pageTitle = t(category || '') !== category ? t(category || '') : catName;
    }

    // Sorts for rails
    const recentlyAdded = [...content].sort(() => 0.5 - Math.random());
    const onDeck = [...content].sort(() => 0.5 - Math.random()).slice(0, 4);
    const topRated = [...content].filter(i => i.rating === 'R' || i.rating === 'TV-MA' || i.rating === 'PG-13');

    return (
        <div className="animate-fade-in pb-20">
            {pageTitle && <h1 className="text-3xl font-bold text-white px-6 md:px-10 pt-8 mb-4">{pageTitle}</h1>}
            
            {content.length > 0 || uploadedItems.length > 0 ? (
                <>
                    {!pageTitle && <HeroSection item={hero} />}

                    {/* My Uploads Rail */}
                    {!category && uploadedItems.length > 0 && (
                        <MediaRail 
                            title={t('my_uploads')} 
                            items={uploadedItems} 
                            onPress={onPress}
                            onPlay={onPlay}
                            watchlist={watchlist}
                            onToggleWatchlist={onToggleWatchlist}
                            onAddToQueue={onAddToQueue}
                            onToggleWatched={onToggleWatched}
                            watchedIds={watchedIds}
                        />
                    )}
                    
                    {!category && (
                        <div className="mb-2">
                            {loadingAi ? (
                                <div className="pl-10 h-[300px] flex items-center text-gray-500 gap-2">
                                    <Sparkles className="animate-pulse text-plex-orange" size={20}/>
                                    <span>{t('personalizing')}</span>
                                </div>
                            ) : aiItems.length > 0 ? (
                                <div className="relative">
                                    <div className="absolute -top-6 left-10 flex items-center gap-2 text-plex-orange text-xs font-bold uppercase tracking-widest opacity-80">
                                        <Sparkles size={12} />
                                        <span>{t('for_you')}</span>
                                    </div>
                                    <MediaRail 
                                        title={t('ai_recommended')}
                                        items={aiItems} 
                                        onPress={onPress}
                                        onPlay={onPlay}
                                        watchlist={watchlist}
                                        onToggleWatchlist={onToggleWatchlist}
                                        onAddToQueue={onAddToQueue}
                                        onToggleWatched={onToggleWatched}
                                        watchedIds={watchedIds}
                                    />
                                </div>
                            ) : null}
                        </div>
                    )}
                    
                    <MediaRail 
                        title={t('on_deck')} 
                        items={onDeck} 
                        onPress={onPress}
                        onPlay={onPlay}
                        watchlist={watchlist}
                        onToggleWatchlist={onToggleWatchlist}
                        onAddToQueue={onAddToQueue}
                        onToggleWatched={onToggleWatched}
                        watchedIds={watchedIds}
                    />
                    
                    <MediaRail 
                        title={category === 'tv' ? t('recently_aired') : t('recently_added')} 
                        items={recentlyAdded} 
                        onPress={onPress}
                        onPlay={onPlay}
                        watchlist={watchlist}
                        onToggleWatchlist={onToggleWatchlist}
                        onAddToQueue={onAddToQueue}
                        onToggleWatched={onToggleWatched}
                        watchedIds={watchedIds}
                    />
                    
                    <MediaRail 
                        title={t('top_rated')} 
                        items={topRated} 
                        onPress={onPress}
                        onPlay={onPlay}
                        watchlist={watchlist}
                        onToggleWatchlist={onToggleWatchlist}
                        onAddToQueue={onAddToQueue}
                        onToggleWatched={onToggleWatched}
                        watchedIds={watchedIds}
                    />

                    <MediaRail 
                        title={category === 'tv' ? t('sci_fi_series') : t('rediscover_sci_fi')} 
                        items={content} 
                        onPress={onPress}
                        onPlay={onPlay}
                        watchlist={watchlist}
                        onToggleWatchlist={onToggleWatchlist}
                        onAddToQueue={onAddToQueue}
                        onToggleWatched={onToggleWatched}
                        watchedIds={watchedIds}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <p className="text-lg">{t('no_content')} {pageTitle || 'this library'}.</p>
                    <p className="text-sm">{t('check_back')}</p>
                </div>
            )}
        </div>
    );
};