import React from 'react';
import { Home, Film, Tv, Music, Heart, Radio, Sparkles, Mic, Globe, Newspaper, Search, Upload, Server, Database, ShieldCheck, PanelLeftClose, Cast, Settings } from 'lucide-react';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  isOpen: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, isOpen, onToggle }) => {
  const { t } = useLanguage();
  
  const navGroups = [
    {
      title: t('discover'),
      items: [
        { id: NavItem.HOME, icon: Home, label: t('home'), badge: 'AI' },
        { id: NavItem.SEARCH, icon: Search, label: t('search') },
        { id: NavItem.LIVE, icon: Radio, label: t('live_tv') },
        { id: NavItem.WATCHLIST, icon: Heart, label: t('watchlist') },
      ]
    },
    {
      title: t('my_library'),
      items: [
        { id: NavItem.MOVIES, icon: Film, label: t('movies') },
        { id: NavItem.TV, icon: Tv, label: t('tv_shows') },
        { id: NavItem.MUSIC, icon: Music, label: t('music') },
        { id: NavItem.UHD, icon: '4K', label: t('uhd_movies') },
        { id: NavItem.KIDS, icon: 'K', label: t('kids') },
      ]
    },
    {
      title: t('content'),
      items: [
        { id: NavItem.PODCASTS, icon: Mic, label: t('podcasts') },
        { id: NavItem.WEB, icon: Globe, label: t('web_shows') },
        { id: NavItem.NEWS, icon: Newspaper, label: t('news') },
      ]
    },
    {
      title: t('system'),
      items: [
        { id: NavItem.UPLOAD, icon: Upload, label: t('upload_media') },
        { id: NavItem.CAST, icon: Cast, label: t('cast_to_device') },
        { id: NavItem.SETTINGS, icon: Settings, label: t('settings') },
      ]
    }
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 md:static w-64 bg-[#121417] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
      `}
    >
      {/* Server Status Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-gradient-to-r from-plex-orange/5 to-transparent relative overflow-hidden group">
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 w-1 h-full bg-plex-orange shadow-[0_0_15px_rgba(229,160,13,0.5)]"></div>
        
        <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
                <Server size={20} className="text-plex-orange" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#121417] rounded-full animate-pulse"></div>
            </div>
            <div>
                <h2 className="text-sm font-bold text-white leading-none tracking-wide">PLEXUS SERVER</h2>
                <div className="flex items-center gap-1.5 mt-1">
                    <ActivityIcon />
                    <span className="text-[10px] text-green-500 font-mono font-medium tracking-wider">{t('server_online')} v2.6.0</span>
                </div>
            </div>
        </div>

        {onToggle && (
            <button 
                onClick={onToggle}
                className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 relative z-20"
                title={t('close_sidebar')}
            >
                <PanelLeftClose size={18} />
            </button>
        )}
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {navGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
                <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    {group.title}
                    <div className="h-px flex-1 bg-white/5"></div>
                </h3>
                <div className="space-y-1">
                    {group.items.map((item) => {
                         const isActive = activeNav === item.id;
                         return (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id as NavItem)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative
                                    ${isActive 
                                        ? 'text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                {/* Active Background with Glassmorphism */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-plex-orange/20 to-transparent rounded-xl border border-plex-orange/10 backdrop-blur-sm"></div>
                                )}
                                
                                <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-plex-orange drop-shadow-[0_0_8px_rgba(229,160,13,0.5)]' : ''}`}>
                                    {typeof item.icon === 'string' ? (
                                        <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-black border border-white/10 shadow-inner ${item.icon === '4K' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                            {item.icon}
                                        </span>
                                    ) : (
                                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    )}
                                </div>
                                
                                <span className="relative z-10 flex-1 text-left tracking-wide">{item.label}</span>
                                
                                {item.badge && (
                                    <div className="relative z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-plex-orange text-[9px] font-extrabold text-black uppercase tracking-wider shadow-[0_0_10px_rgba(229,160,13,0.4)]">
                                        {item.badge === 'AI' && <Sparkles size={8} fill="black" />}
                                        {item.badge !== 'AI' && item.badge}
                                    </div>
                                )}
                            </button>
                         );
                    })}
                </div>
            </div>
        ))}
      </div>

      {/* Storage Widget */}
      <div className="p-4 border-t border-white/5 bg-[#0d0f11]">
        <div className="bg-[#1a1d21] rounded-xl p-4 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2 text-gray-400">
                    <Database size={14} />
                    <span className="text-xs font-bold tracking-wider uppercase">{t('storage')}</span>
                </div>
                <span className="text-xs font-mono text-plex-orange">74%</span>
            </div>
            
            <div className="relative h-1.5 bg-black rounded-full overflow-hidden mb-3">
                <div className="absolute top-0 left-0 h-full w-[74%] bg-gradient-to-r from-plex-orange to-orange-600 rounded-full shadow-[0_0_10px_rgba(229,160,13,0.3)]"></div>
            </div>
            
            <div className="flex justify-between items-end relative z-10">
                <div>
                    <p className="text-white font-bold text-sm">3.8 TB</p>
                    <p className="text-[10px] text-gray-500">{t('used_of')} 5.0 TB</p>
                </div>
                <button 
                    onClick={() => setActiveNav(NavItem.UPLOAD)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Manage Storage"
                >
                    <Settings size={14} />
                </button>
            </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-300">
            <ShieldCheck size={12} />
            <span className="text-[10px] tracking-widest font-mono uppercase">{t('secured_by')}</span>
        </div>
      </div>
    </aside>
  );
};

// Helper for Activity icon as it was missing in imports in previous iteration
const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);