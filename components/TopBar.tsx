import React, { useState, useRef, useEffect } from 'react';
import { Search, Cast, Settings, User, Bell, ChevronLeft, LogOut, CreditCard, Shield, Mic, Loader2 } from 'lucide-react';
import { NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TopBarProps {
  onSearch: (query: string) => void;
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  currentSearchQuery: string;
  onNavigate: (nav: NavItem) => void;
  onSearchFocus?: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  userProfile: {name: string, email: string, avatar: string | null};
}

export const TopBar: React.FC<TopBarProps> = ({ 
    onSearch, 
    isSearchActive, 
    setIsSearchActive, 
    currentSearchQuery, 
    onNavigate,
    onSearchFocus,
    onToggleSidebar,
    sidebarOpen,
    userProfile
}) => {
  const [localQuery, setLocalQuery] = useState(currentSearchQuery);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
      setLocalQuery(currentSearchQuery);
  }, [currentSearchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localQuery); 
  };

  const handleNav = (nav: NavItem) => {
      onNavigate(nav);
      setIsUserMenuOpen(false);
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice search is not supported in this browser. Please use Chrome.');
        return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsListening(true);
    };

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLocalQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.start();
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-plex-bg/95 backdrop-blur-md sticky top-0 z-40">
      
      {/* Left: Menu / Back / Branding */}
      <div className="flex items-center gap-4">
        {/* Menu Button (Always visible now) */}
        {!isSearchActive && (
            <button 
                onClick={onToggleSidebar}
                className="text-gray-400 hover:text-white mr-2 transition-transform active:scale-95"
                aria-label="Toggle Sidebar"
            >
                <div className="space-y-1.5">
                    <span className={`block w-6 h-0.5 bg-current transition-transform ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-current transition-opacity ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-current transition-transform ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
            </button>
        )}

        {isSearchActive ? (
            <button 
                onClick={() => setIsSearchActive(false)}
                className="text-gray-400 hover:text-white md:hidden"
            >
                <ChevronLeft size={24} />
            </button>
        ) : (
             /* Show branding only if sidebar is closed */
            !sidebarOpen && (
                <div className="text-plex-orange font-bold text-xl tracking-tighter cursor-pointer animate-in fade-in" onClick={() => onNavigate(NavItem.HOME)}>
                    PLEXUS
                </div>
            )
        )}
      </div>

      {/* Center: Search Bar */}
      <div className={`flex-1 max-w-2xl mx-4 ${isSearchActive ? 'block' : 'hidden md:block'}`}>
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 group-focus-within:text-plex-orange" />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={onSearchFocus}
            placeholder={isListening ? t('listening') : t('search_placeholder')}
            className={`block w-full pl-10 pr-10 py-2 bg-black/20 border border-white/5 rounded-full leading-5 text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white/5 focus:border-plex-orange/50 focus:ring-1 focus:ring-plex-orange/50 sm:text-sm transition-all ${isListening ? 'ring-2 ring-plex-orange animate-pulse' : ''}`}
          />
          <button 
            type="button"
            onClick={startVoiceSearch}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${isListening ? 'text-plex-orange' : 'text-gray-400 hover:text-white'}`}
            title="Voice Search"
          >
            {isListening ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
          </button>
        </form>
      </div>

      {/* Right: Actions */}
      <div className={`flex items-center gap-2 md:gap-4 ${isSearchActive ? 'hidden md:flex' : 'flex'}`}>
        <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsSearchActive(true)}
        >
            <Search size={22} />
        </button>

        <button 
            className="p-2 text-plex-orange hover:bg-white/10 rounded-full transition-colors hidden sm:block"
            title={t('cast_to_device')}
            onClick={() => onNavigate(NavItem.CAST)}
        >
          <Cast size={20} />
        </button>
        
        <div className="relative" ref={notifRef}>
            <button 
                className={`p-2 rounded-full transition-colors ${isNotificationsOpen ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title={t('notifications')}
            >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-plex-orange rounded-full border border-plex-bg"></span>
            </button>
            {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#282a2d] border border-white/10 rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/5 text-sm font-bold text-white">{t('notifications')}</div>
                    <div className="px-4 py-3 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">
                        <p className="font-semibold text-white">{t('new_arrival')}</p>
                        <p className="text-xs text-gray-400 mt-1">"Guardians of the Galaxy Vol. 3" is now available.</p>
                    </div>
                     <div className="px-4 py-3 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">
                        <p className="font-semibold text-white">{t('server_update')}</p>
                        <p className="text-xs text-gray-400 mt-1">Plexus Media Server updated to v1.32.0.</p>
                    </div>
                </div>
            )}
        </div>

        <button 
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={() => onNavigate(NavItem.SETTINGS)}
            title={t('settings')}
        >
          <Settings size={20} />
        </button>
        
        <div className="relative" ref={userMenuRef}>
            <div 
                className="h-8 w-8 ml-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-plex-orange transition-all overflow-hidden"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
                {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User size={16} className="text-white" />
                )}
            </div>

            {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#282a2d] border border-white/10 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                             {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-bold text-lg">{userProfile.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="overflow-hidden">
                             <p className="text-sm font-bold text-white truncate">{userProfile.name}</p>
                             <p className="text-xs text-gray-400 truncate">{userProfile.email}</p>
                        </div>
                    </div>
                    <div className="py-1">
                        <button 
                            onClick={() => handleNav(NavItem.SETTINGS)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                        >
                            <User size={16} /> {t('edit_profile')}
                        </button>
                        <button 
                            onClick={() => handleNav(NavItem.SETTINGS)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                        >
                             <CreditCard size={16} /> {t('subscription')}
                        </button>
                         <button 
                            onClick={() => handleNav(NavItem.SETTINGS)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                        >
                             <Shield size={16} /> {t('users_sharing')}
                        </button>
                    </div>
                    <div className="border-t border-white/5 py-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                            <LogOut size={16} /> {t('sign_out')}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};