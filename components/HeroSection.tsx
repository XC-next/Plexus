import React from 'react';
import { Play, Plus, Info } from 'lucide-react';
import { MediaItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionProps {
  item: MediaItem;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ item }) => {
  const { t } = useLanguage();
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] mb-8 group">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={item.backdropUrl} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-plex-bg via-plex-bg/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-plex-bg via-plex-bg/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-12 max-w-4xl">
        <div className="flex items-center gap-3 text-plex-orange font-bold text-sm tracking-wide uppercase mb-2">
            <span className="bg-plex-orange/20 px-2 py-0.5 rounded">{t('featured')}</span>
            <span>{item.type}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          {item.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-300 text-sm md:text-base mb-6 font-medium">
          <span className="text-plex-orange">{item.year}</span>
          <span>{item.rating}</span>
          <span>{item.duration}</span>
          {item.genre?.map((g) => (
             <span key={g} className="hidden md:inline px-2 py-0.5 border border-white/20 rounded-full text-xs text-gray-400">{g}</span>
          ))}
        </div>

        <p className="text-gray-300 text-base md:text-lg mb-8 line-clamp-3 md:line-clamp-none max-w-2xl drop-shadow-md">
          {item.description}
        </p>

        <div className="flex items-center gap-4">
          <button className="bg-plex-orange hover:bg-white hover:text-black text-black font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-plex-orange/20">
            <Play fill="currentColor" size={20} />
            <span>{t('play')}</span>
          </button>
          
          <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 backdrop-blur-sm transition-all border border-white/10">
            <Plus size={20} />
            <span className="hidden sm:inline">{t('watchlist')}</span>
          </button>

           <button className="bg-transparent hover:bg-white/10 text-white p-3 rounded-full transition-all border border-white/20">
            <Info size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};