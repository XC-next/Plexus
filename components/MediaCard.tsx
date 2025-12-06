import React, { useState, useRef, useEffect } from 'react';
import { Play, Plus, Check, MoreVertical, ListVideo, Eye, Info, CheckCircle, Clock } from 'lucide-react';
import { MediaItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MediaCardProps {
  item: MediaItem;
  onPress: (item: MediaItem) => void;
  onPlay: (item: MediaItem) => void;
  onToggleWatchlist?: (item: MediaItem) => void;
  isInWatchlist?: boolean;
  onAddToQueue?: (item: MediaItem) => void;
  onToggleWatched?: (item: MediaItem) => void;
  isWatched?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ 
    item, 
    onPress, 
    onPlay, 
    onToggleWatchlist, 
    isInWatchlist,
    onAddToQueue,
    onToggleWatched,
    isWatched
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(item);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWatchlist) {
        onToggleWatchlist(item);
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowMenu(!showMenu);
  };

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setShowMenu(false);
      
      if (action === 'details') {
          onPress(item);
      } else if (action === 'queue') {
          if (onAddToQueue) onAddToQueue(item);
          setShowFeedback(t('add_to_queue'));
          setTimeout(() => setShowFeedback(null), 2000);
      } else if (action === 'watched') {
          if (onToggleWatched) onToggleWatched(item);
      }
      
      // Return focus to button
      if (buttonRef.current) {
          buttonRef.current.focus();
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
          setShowMenu(false);
          buttonRef.current?.focus();
      }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div 
      className="group relative w-[160px] flex-shrink-0 cursor-pointer flex flex-col gap-2 transition-transform duration-200"
      onClick={() => onPress(item)}
      role="article"
      aria-label={`Media card for ${item.title}`}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-md bg-plex-card transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/50 ring-1 ring-white/10 group-hover:ring-plex-orange z-0 group-hover:z-10">
        
        {/* Image wrapper with overflow hidden for zoom effect */}
        <div className="absolute inset-0 rounded-md overflow-hidden">
            <img 
            src={item.posterUrl} 
            alt={item.title} 
            className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${isWatched ? 'opacity-50 grayscale-[0.5]' : 'opacity-90 group-hover:opacity-100'}`}
            loading="lazy"
            />
        </div>
        
        {/* Watchlist Badge */}
        {isInWatchlist && (
           <div className="absolute top-2 left-2 bg-plex-orange/90 text-black p-1 rounded-full shadow-md z-10 pointer-events-none group-hover:opacity-0 transition-opacity">
               <Check size={10} strokeWidth={4} />
           </div>
        )}
        
        {/* Watched / New Badge */}
        {isWatched ? (
             <div className="absolute top-2 right-2 bg-black/60 text-plex-orange p-1 rounded-full shadow-md z-10">
                <CheckCircle size={14} />
             </div>
        ) : (
             <div className="absolute top-2 right-2 bg-plex-orange text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-md z-10 pointer-events-none">
                NEW
             </div>
        )}

        {/* Feedback Toast Overlay */}
        {showFeedback && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20 rounded-md animate-in fade-in duration-200">
                <div className="flex flex-col items-center text-white">
                    <CheckCircle size={32} className="text-plex-orange mb-1" />
                    <span className="text-xs font-bold text-center px-1">{showFeedback}</span>
                </div>
            </div>
        )}

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 flex items-center justify-center rounded-md ${showMenu ? 'opacity-100' : 'group-hover:opacity-100'}`}>
             {/* Play Button - Center */}
             <button 
                onClick={handlePlayClick}
                className="h-12 w-12 rounded-full bg-plex-orange flex items-center justify-center shadow-lg hover:bg-white hover:text-plex-orange text-black transition-all transform hover:scale-110"
                title={t('play')}
                aria-label={`Play ${item.title}`}
            >
                <Play fill="currentColor" size={20} className="ml-1" />
            </button>
        </div>
        
        {/* Quick Actions (Hover) - Top Left */}
        <div className={`absolute top-2 left-2 opacity-0 transition-opacity duration-300 ${showMenu ? 'opacity-100' : 'group-hover:opacity-100'}`}>
            <button 
                onClick={handleWatchlistClick}
                className={`p-1.5 rounded-full transition-colors backdrop-blur-sm ${isInWatchlist ? 'bg-plex-orange text-black hover:bg-white' : 'bg-black/60 text-white hover:bg-white hover:text-black'}`}
                title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
                {isInWatchlist ? <Check size={16} /> : <Plus size={16} />}
            </button>
        </div>

        {/* Quick Actions (Hover) - Bottom Right */}
        <div className={`absolute bottom-2 right-2 opacity-0 transition-opacity duration-300 ${showMenu ? 'opacity-100' : 'group-hover:opacity-100'}`}>
            <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
                <button 
                    ref={buttonRef}
                    onClick={toggleMenu}
                    aria-haspopup="true"
                    aria-expanded={showMenu}
                    aria-label="More options"
                    className={`p-1.5 rounded-full transition-colors backdrop-blur-sm ${showMenu ? 'bg-white text-black' : 'bg-black/60 hover:bg-white text-white hover:text-black'}`}
                >
                    <MoreVertical size={16} />
                </button>

                {showMenu && (
                    <div 
                        role="menu"
                        className="absolute bottom-full right-0 mb-2 w-48 bg-[#282a2d] border border-white/10 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col overflow-hidden origin-bottom-right"
                    >
                        <button 
                            role="menuitem"
                            onClick={(e) => handleMenuAction('queue', e)}
                            className="w-full text-left px-3 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <ListVideo size={14} /> {t('add_to_queue')}
                        </button>
                        <button 
                            role="menuitem"
                            onClick={(e) => handleMenuAction('watched', e)}
                            className="w-full text-left px-3 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            {isWatched ? (
                                <>
                                    <Clock size={14} /> {t('mark_unwatched')}
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={14} /> {t('mark_watched')}
                                </>
                            )}
                        </button>
                        <div className="border-t border-white/5 my-0.5"></div>
                        <button 
                            role="menuitem"
                            onClick={(e) => handleMenuAction('details', e)}
                            className="w-full text-left px-3 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <Info size={14} /> {t('view_details')}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="px-1 pt-1">
        <h3 className="text-sm font-bold text-gray-200 truncate group-hover:text-plex-orange transition-colors leading-tight">
          {item.title}
        </h3>
        <div className="flex items-center text-xs text-gray-400 gap-2 mt-1">
          <span>{item.year}</span>
          {item.rating && (
             <>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-500"></span>
                <span className="border border-gray-600 px-1 rounded-[3px] text-[10px] text-gray-400 uppercase">{item.rating}</span>
             </>
          )}
        </div>
      </div>
    </div>
  );
};