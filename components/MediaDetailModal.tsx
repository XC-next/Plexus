import React, { useEffect, useState, useRef } from 'react';
import { X, Play, Pause, Plus, Check, MoreVertical, Calendar, Clock, Star, Sparkles, Loader2, Maximize2, Minimize2, Volume2, VolumeX, ArrowLeft, Settings, SkipForward, SkipBack, Monitor, Captions, ListVideo, CheckCircle, Film, Edit3 } from 'lucide-react';
import { MediaItem, CastMember, Episode } from '../types';
import { getSimilarContent, getMediaCast, getEpisodes } from '../services/geminiService';
import { MediaRail } from './MediaRail';
import { useLanguage } from '../contexts/LanguageContext';

interface MediaDetailModalProps {
  item: MediaItem;
  onClose: () => void;
  onPlay: (item: MediaItem) => void;
  watchlist: MediaItem[];
  onToggleWatchlist: (item: MediaItem) => void;
  onPressItem: (item: MediaItem) => void;
  autoPlay?: boolean;
  onAddToQueue?: (item: MediaItem) => void;
  onToggleWatched?: (item: MediaItem) => void;
  watchedIds?: string[];
  onEdit?: (item: MediaItem) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ 
    item, 
    onClose, 
    onPlay, 
    watchlist, 
    onToggleWatchlist, 
    onPressItem, 
    autoPlay = false,
    onAddToQueue,
    onToggleWatched,
    watchedIds,
    onEdit
}) => {
  const [similarItems, setSimilarItems] = useState<MediaItem[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loadingCast, setLoadingCast] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const { t } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  // Player state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Player Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('1080p (12 Mbps)');
  const [subtitle, setSubtitle] = useState('Off');
  
  // Menu & Feedback State
  const [showMenu, setShowMenu] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isInWatchlist = watchlist.some(w => w.id === item.id);
  const isWatched = watchedIds?.includes(item.id);
  
  // Use item's videoUrl if available, otherwise fallback to sample
  const videoSrc = item.videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
      setIsPlaying(autoPlay);
      if (autoPlay) {
          setIsPlayingVideo(true);
      }
  }, [autoPlay, item]);

  // Click outside listener for settings menu and action menu
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
              setShowSettings(false);
          }
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
              setShowMenu(false);
          }
      };
      if (showSettings || showMenu) {
          document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [showSettings, showMenu]);

  // Fetch data when item changes
  useEffect(() => {
    if (!item) return;

    // Reset states
    setSimilarItems([]);
    setCast([]);
    setEpisodes([]);
    
    // Fetch Similar
    setLoadingSimilar(true);
    getSimilarContent(item)
        .then(res => setSimilarItems(res))
        .catch(err => console.error("Failed similar items", err))
        .finally(() => setLoadingSimilar(false));

    // Fetch Cast
    setLoadingCast(true);
    if (item.cast) {
        setCast(item.cast);
        setLoadingCast(false);
    } else {
        getMediaCast(item.title)
            .then(res => setCast(res))
            .catch(err => console.error("Failed cast items", err))
            .finally(() => setLoadingCast(false));
    }

    // Fetch Episodes - if local item has episodes, use them, otherwise fetch
    setLoadingEpisodes(true);
    if (item.episodes && item.episodes.length > 0) {
        setEpisodes(item.episodes);
        setLoadingEpisodes(false);
    } else if (item.type === 'movie' || item.type === 'tv') {
        getEpisodes(item.title, item.type)
            .then(res => setEpisodes(res))
            .catch(err => console.error("Failed episodes", err))
            .finally(() => setLoadingEpisodes(false));
    } else {
        setLoadingEpisodes(false);
    }
        
  }, [item]);

  // Menu Handlers
  const handleMenuAction = (action: string) => {
      setShowMenu(false);
      if (action === 'queue') {
          if (onAddToQueue) onAddToQueue(item);
          setFeedbackMsg(t('add_to_queue'));
          setTimeout(() => setFeedbackMsg(null), 2000);
      } else if (action === 'watched') {
          if (onToggleWatched) onToggleWatched(item);
      } else if (action === 'edit') {
          if (onEdit) onEdit(item);
      }
  };

  // Player handlers
  const togglePlay = () => {
      if (videoRef.current) {
          if (videoRef.current.paused) {
              videoRef.current.play();
              setIsPlayingVideo(true);
          } else {
              videoRef.current.pause();
              setIsPlayingVideo(false);
          }
      }
  };

  const handleTimeUpdate = () => {
      if (videoRef.current) {
          const current = videoRef.current.currentTime;
          const duration = videoRef.current.duration;
          setProgress((current / duration) * 100);
      }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      if (videoRef.current) {
          const duration = videoRef.current.duration;
          videoRef.current.currentTime = (val / 100) * duration;
          setProgress(val);
      }
  };

  const toggleMute = () => {
      if (videoRef.current) {
          videoRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (videoRef.current) {
          videoRef.current.volume = val;
          setIsMuted(val === 0);
      }
  };

  const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
          playerRef.current?.requestFullscreen();
          setIsFullscreen(true);
      } else {
          document.exitFullscreen();
          setIsFullscreen(false);
      }
  };

  const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
          if (isPlayingVideo && !showSettings) setShowControls(false);
      }, 3000);
  };

  const formatTime = (seconds: number) => {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Feedback Toast */}
      {feedbackMsg && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
                <div className="bg-black/90 text-white px-6 py-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-4 shadow-2xl border border-white/10">
                    <CheckCircle className="text-plex-orange" size={24} />
                    <span className="font-bold text-lg">{feedbackMsg}</span>
                </div>
            </div>
      )}

      <div className="relative w-full h-full md:w-[95%] md:h-[90%] lg:w-[1200px] bg-[#1f2126] md:rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/5">
        
        {/* Video Player Mode */}
        {isPlaying ? (
            <div 
                ref={playerRef}
                className="absolute inset-0 z-50 bg-black flex flex-col group"
                onMouseMove={handleMouseMove}
                onClick={() => {
                   if (!showSettings) togglePlay();
                }}
            >
                <div className="relative flex-1 bg-black flex items-center justify-center">
                     <video 
                        ref={videoRef}
                        src={videoSrc} 
                        className="w-full h-full object-contain"
                        autoPlay
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlayingVideo(false)}
                        onWaiting={() => setIsBuffering(true)}
                        onPlaying={() => setIsBuffering(false)}
                        onCanPlay={() => setIsBuffering(false)}
                     />
                     
                     {/* Buffering Indicator */}
                     {isBuffering && (
                         <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                             <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm">
                                 <Loader2 size={48} className="animate-spin text-plex-orange" />
                             </div>
                         </div>
                     )}
                     
                     {/* Overlay Controls */}
                     <div 
                        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pb-6 pt-24 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                        onClick={(e) => e.stopPropagation()} 
                     >
                        {/* Progress Bar */}
                        <div className="flex items-center gap-4 mb-4">
                             <span className="text-xs font-medium text-gray-300 w-12 text-right font-mono">
                                {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"}
                             </span>
                             <div className="relative flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer group/slider">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={progress} 
                                    onChange={handleSeek}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div 
                                    className="h-full bg-plex-orange rounded-full relative" 
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover/slider:scale-100 transition-transform shadow-lg cursor-pointer"></div>
                                </div>
                             </div>
                             <span className="text-xs font-medium text-gray-300 w-12 font-mono">
                                {videoRef.current ? formatTime(videoRef.current.duration || 0) : "0:00"}
                             </span>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button onClick={togglePlay} className="text-white hover:text-plex-orange transition-colors">
                                    {isPlayingVideo ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                                </button>
                                
                                <div className="flex items-center gap-4">
                                    <button className="text-gray-300 hover:text-white transition-colors" onClick={() => { if(videoRef.current) videoRef.current.currentTime -= 10 }}>
                                        <SkipBack size={24} />
                                    </button>
                                    <button className="text-gray-300 hover:text-white transition-colors" onClick={() => { if(videoRef.current) videoRef.current.currentTime += 10 }}>
                                        <SkipForward size={24} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 group/vol">
                                    <button onClick={toggleMute} className="text-gray-300 hover:text-white transition-colors">
                                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                    </button>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.1" 
                                        value={volume} 
                                        onChange={handleVolumeChange}
                                        className="w-0 group-hover/vol:w-24 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-plex-orange"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Settings Dropdown */}
                                <div className="relative" ref={settingsRef}>
                                    <button 
                                        onClick={() => setShowSettings(!showSettings)} 
                                        className={`transition-colors ${showSettings ? 'text-plex-orange' : 'text-gray-300 hover:text-white'}`}
                                    >
                                        <Settings size={24} />
                                    </button>

                                    {showSettings && (
                                        <div className="absolute bottom-full right-0 mb-4 w-72 bg-[#1f2126]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="p-2 border-b border-white/5 mb-1">
                                                <h3 className="text-sm font-bold text-white">Playback Settings</h3>
                                            </div>
                                            
                                            {/* Quality Section */}
                                            <div className="mb-2">
                                                <h4 className="px-2 py-1 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                    <Monitor size={12}/> Quality
                                                </h4>
                                                <div className="space-y-0.5">
                                                    {['Auto', '4K (20 Mbps)', '1080p (12 Mbps)', '720p (4 Mbps)', 'SD (1.5 Mbps)'].map(q => (
                                                        <button
                                                            key={q}
                                                            onClick={() => setQuality(q)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-colors ${quality === q ? 'bg-plex-orange text-black font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                                        >
                                                            <span>{q}</span>
                                                            {quality === q && <Check size={14}/>}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Subtitles Section */}
                                            <div>
                                                <h4 className="px-2 py-1 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                                    <Captions size={12}/> Subtitles (CC)
                                                </h4>
                                                <div className="space-y-0.5">
                                                    {['Off', 'English', 'Khmer', 'Spanish', 'French'].map(c => (
                                                        <button
                                                            key={c}
                                                            onClick={() => setSubtitle(c)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-colors ${subtitle === c ? 'bg-plex-orange text-black font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                                        >
                                                            <span>{c}</span>
                                                            {subtitle === c && <Check size={14}/>}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button onClick={toggleFullscreen} className="text-gray-300 hover:text-white transition-colors">
                                    {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                                </button>
                            </div>
                        </div>
                     </div>

                     {/* Back Button Overlay */}
                     <div 
                        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                        onClick={(e) => e.stopPropagation()}
                     >
                         <button 
                            onClick={() => setIsPlaying(false)}
                            className="flex items-center gap-4 text-white hover:text-plex-orange transition-colors group"
                         >
                            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                                <ArrowLeft size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg drop-shadow-md leading-none">{item.title}</h2>
                                <p className="text-xs text-gray-300 mt-1 drop-shadow">{item.year} • {item.rating}</p>
                            </div>
                         </button>
                     </div>
                </div>
            </div>
        ) : (
            /* Info Mode */
            <>
                {/* Close Button */}
                <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-30 p-2 bg-black/40 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                >
                <X size={24} />
                </button>

                {/* Backdrop Image - Absolute */}
                <div className="absolute inset-0 z-0">
                <img 
                    src={item.backdropUrl || item.posterUrl} 
                    alt="Backdrop" 
                    className="w-full h-full object-cover opacity-30 mask-image-gradient"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f2126] via-[#1f2126]/90 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1f2126] via-[#1f2126]/80 to-transparent"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col md:flex-row w-full h-full p-6 md:p-12 gap-8 md:gap-12 overflow-y-auto">
                
                {/* Poster Column */}
                <div className="hidden md:flex flex-col gap-4 w-[300px] flex-shrink-0 pt-8">
                    <div className="rounded-lg shadow-2xl shadow-black overflow-hidden aspect-[2/3] ring-1 ring-white/10 group relative">
                        <img 
                        src={item.posterUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        />
                         <button 
                            onClick={() => setIsPlaying(true)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                            <div className="bg-plex-orange p-4 rounded-full text-black transform hover:scale-110 transition-transform shadow-lg">
                                <Play fill="currentColor" size={32} />
                            </div>
                         </button>
                    </div>
                </div>

                {/* Details Column */}
                <div className="flex-1 flex flex-col pt-8 md:pt-16">
                    
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-plex-orange font-bold uppercase tracking-wider text-xs bg-plex-orange/10 px-2 py-0.5 rounded">{item.type}</span>
                            {item.genre?.slice(0, 1).map(g => (
                                <span key={g} className="text-gray-400 text-xs uppercase tracking-wider">{g}</span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
                            {item.title}
                        </h1>
                        
                        <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-gray-300 font-medium">
                            <span className="flex items-center gap-2">
                                <Star size={18} className="text-plex-orange fill-plex-orange" />
                                <span className="text-white">7.8</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={18} className="text-gray-500" />
                                {item.year}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={18} className="text-gray-500" />
                                {item.duration}
                            </span>
                            {item.rating && (
                                <span className="border border-gray-500 px-2 py-0.5 rounded text-sm text-gray-300">
                                    {item.rating}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                    <button 
                        onClick={() => setIsPlaying(true)}
                        className="bg-plex-orange hover:bg-[#F2B01E] text-black font-bold py-3 px-10 rounded-full flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg shadow-plex-orange/20"
                    >
                        <Play fill="currentColor" size={24} />
                        <span className="text-lg">{t('play')}</span>
                    </button>

                    <button 
                        className={`group flex flex-col items-center justify-center w-12 h-12 rounded-full border transition-colors ${isInWatchlist ? 'bg-plex-orange border-plex-orange text-black' : 'border-white/20 hover:bg-white/10 text-gray-300'}`}
                        title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                        onClick={() => onToggleWatchlist(item)}
                    >
                        {isInWatchlist ? <Check size={20} /> : <Plus size={20} className="group-hover:text-white" />}
                    </button>
                    
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className={`group flex flex-col items-center justify-center w-12 h-12 rounded-full border transition-colors ${showMenu ? 'bg-white text-black' : 'border-white/20 hover:bg-white/10 text-gray-300'}`}
                        >
                            <MoreVertical size={20} className={showMenu ? 'text-black' : 'group-hover:text-white'} />
                        </button>
                        
                         {showMenu && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-[#282a2d] border border-white/10 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 flex flex-col overflow-hidden origin-top-left">
                                <button 
                                    onClick={() => handleMenuAction('queue')}
                                    className="w-full text-left px-3 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2 transition-colors"
                                >
                                    <ListVideo size={14} /> {t('add_to_queue')}
                                </button>
                                <button 
                                    onClick={() => handleMenuAction('watched')}
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
                                {onEdit && (
                                    <>
                                        <div className="border-t border-white/5 my-0.5"></div>
                                        <button 
                                            onClick={() => handleMenuAction('edit')}
                                            className="w-full text-left px-3 py-2.5 text-xs font-bold text-plex-orange hover:bg-white/10 hover:text-plex-orange flex items-center gap-2 transition-colors"
                                        >
                                            <Edit3 size={14} /> {t('edit_metadata')}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    </div>

                    {/* Description */}
                    <div className="max-w-3xl mb-10">
                        <h3 className="text-lg font-bold text-white mb-2">{t('synopsis')}</h3>
                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                            {item.description || "No description available for this title."}
                        </p>
                    </div>

                    {/* Episodes / Scenes List */}
                    <div className="mb-10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                             {item.type === 'tv' ? t('episodes') : t('extras_clips')}
                             {loadingEpisodes && <Loader2 className="animate-spin text-gray-500" size={16} />}
                        </h3>
                        
                        {episodes.length > 0 ? (
                            <div className="space-y-2">
                                {episodes.map((ep) => (
                                    <div 
                                        key={ep.id}
                                        className="group flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                                        onClick={() => setIsPlaying(true)}
                                    >
                                        <div className="relative w-32 aspect-video bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                            <img src={ep.thumbnailUrl} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play size={20} fill="currentColor" className="text-white" />
                                            </div>
                                            {ep.duration && (
                                                <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-gray-300">
                                                    {ep.duration}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                {item.type === 'tv' && (
                                                    <span className="text-xs font-bold text-plex-orange">
                                                        S{ep.seasonNumber} E{ep.episodeNumber}
                                                    </span>
                                                )}
                                                <h4 className="font-bold text-gray-200 truncate group-hover:text-plex-orange transition-colors">{ep.title}</h4>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-2">{ep.description}</p>
                                        </div>
                                        <div className="hidden md:block text-gray-500 hover:text-white transition-colors p-2">
                                            <Plus size={18} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !loadingEpisodes && (
                             <p className="text-gray-500 text-sm">No {item.type === 'tv' ? 'episodes' : 'clips'} available.</p>
                        )}
                    </div>

                    {/* Cast */}
                    <div className="mb-10 min-h-[140px]">
                        <h3 className="text-lg font-bold text-white mb-4">{t('cast')}</h3>
                        {loadingCast ? (
                             <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="animate-spin" size={20} />
                                <span>Loading cast details...</span>
                            </div>
                        ) : cast.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
                                {cast.map((actor, i) => (
                                    <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-white/5 pr-4 p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden ring-1 ring-white/10">
                                            <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col pr-2">
                                            <span className="text-sm font-bold text-gray-200">{actor.name}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{actor.character}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-gray-500 text-sm">Cast information unavailable.</p>
                        )}
                    </div>

                    {/* More Like This (AI Powered) */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={18} className="text-plex-orange" />
                            <h3 className="text-lg font-bold text-white">{t('more_like_this')}</h3>
                        </div>
                        
                        {loadingSimilar ? (
                            <div className="flex items-center gap-2 text-gray-500 py-8">
                                <Loader2 className="animate-spin" size={20} />
                                <span>Finding recommendations...</span>
                            </div>
                        ) : (
                            <div className="-ml-6 md:-ml-10">
                                <MediaRail 
                                    title="" 
                                    items={similarItems} 
                                    onPress={onPressItem} 
                                    onPlay={onPlay}
                                    watchlist={watchlist}
                                    onToggleWatchlist={onToggleWatchlist}
                                    onAddToQueue={onAddToQueue}
                                    onToggleWatched={onToggleWatched}
                                    watchedIds={watchedIds}
                                />
                            </div>
                        )}
                    </div>

                </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};