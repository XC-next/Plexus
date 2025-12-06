import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Home } from './pages/Home';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { CastPage } from './pages/CastPage';
import { UploadPage } from './pages/UploadPage';
import { NavItem, MediaItem } from './types';
import { MediaDetailModal } from './components/MediaDetailModal';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItem>(NavItem.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // State for Detail Modal
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [autoPlayModal, setAutoPlayModal] = useState(false);

  // State for Editing
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  // User Profile State
  const [userProfile, setUserProfile] = useState<{name: string, email: string, avatar: string | null}>({
    name: 'Demo User',
    email: 'demo@plexus.app',
    avatar: null
  });

  // Watchlist State with Persistence
  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => {
    try {
        const saved = localStorage.getItem('plexus_watchlist');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to load watchlist", e);
        return [];
    }
  });

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('plexus_recent_searches');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  // Queue State (In-memory for session)
  const [queue, setQueue] = useState<MediaItem[]>([]);

  // Watched State (Persisted)
  const [watchedIds, setWatchedIds] = useState<string[]>(() => {
      try {
          const saved = localStorage.getItem('plexus_watched');
          return saved ? JSON.parse(saved) : [];
      } catch (e) {
          return [];
      }
  });

  // Uploaded Items State
  const [uploadedItems, setUploadedItems] = useState<MediaItem[]>([]);

  const handleToggleWatchlist = (item: MediaItem) => {
    setWatchlist(prev => {
        const exists = prev.find(i => i.id === item.id);
        let newWatchlist;
        if (exists) {
            newWatchlist = prev.filter(i => i.id !== item.id);
        } else {
            newWatchlist = [...prev, item];
        }
        localStorage.setItem('plexus_watchlist', JSON.stringify(newWatchlist));
        return newWatchlist;
    });
  };

  const handleAddToQueue = (item: MediaItem) => {
      setQueue(prev => [...prev, item]);
      console.log(`Added to queue: ${item.title}. Queue length: ${queue.length + 1}`);
  };

  const handleToggleWatched = (item: MediaItem) => {
      setWatchedIds(prev => {
          let newWatched;
          if (prev.includes(item.id)) {
              newWatched = prev.filter(id => id !== item.id);
          } else {
              newWatched = [...prev, item.id];
          }
          localStorage.setItem('plexus_watched', JSON.stringify(newWatched));
          return newWatched;
      });
  };

  const handleEditMedia = (item: MediaItem) => {
    setEditingItem(item);
    setSelectedMedia(null);
    setActiveNav(NavItem.UPLOAD);
  };

  const handleUpload = (item: MediaItem) => {
    // Check if updating an existing item
    const existingIndex = uploadedItems.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
        // Update existing item
        setUploadedItems(prev => {
            const newItems = [...prev];
            newItems[existingIndex] = item;
            return newItems;
        });
    } else {
        // Add new item
        setUploadedItems(prev => [item, ...prev]);
    }
    
    setEditingItem(null);
    setActiveNav(NavItem.HOME);
  };

  // When search is triggered
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveNav(NavItem.SEARCH);
    setIsSearchActive(false); 
    setSelectedMedia(null); 

    // Add to history
    if (query.trim()) {
        const newHistory = [query, ...recentSearches.filter(q => q !== query)].slice(0, 10);
        setRecentSearches(newHistory);
        localStorage.setItem('plexus_recent_searches', JSON.stringify(newHistory));
    }
  };

  const handleClearHistory = () => {
      setRecentSearches([]);
      localStorage.removeItem('plexus_recent_searches');
  };

  // When user focuses search bar
  const handleSearchFocus = () => {
      // If we are not on search page, go there to show recent searches
      if (activeNav !== NavItem.SEARCH) {
          setActiveNav(NavItem.SEARCH);
      }
  };

  const handleCardPress = (item: MediaItem) => {
    setAutoPlayModal(false);
    setSelectedMedia(item);
  };

  const handlePlay = (item: MediaItem) => {
    setAutoPlayModal(true);
    setSelectedMedia(item);
  };

  const handleCloseModal = () => {
    setSelectedMedia(null);
    setAutoPlayModal(false);
  };

  const handleBack = () => {
      if (editingItem) {
          setEditingItem(null);
      }
      setActiveNav(NavItem.HOME);
  };

  const handleToggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
  };

  // Responsive Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    if (activeNav === NavItem.SEARCH) {
        return <SearchPage 
            query={searchQuery} 
            onPress={handleCardPress} 
            onPlay={handlePlay} 
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onBack={handleBack}
            recentSearches={recentSearches}
            onSearchHistoryItem={handleSearch}
            onClearHistory={handleClearHistory}
            onAddToQueue={handleAddToQueue}
            onToggleWatched={handleToggleWatched}
            watchedIds={watchedIds}
        />;
    }
    
    if (activeNav === NavItem.SETTINGS) {
        return <SettingsPage 
            onBack={handleBack} 
            userProfile={userProfile} 
            setUserProfile={setUserProfile} 
        />;
    }

    if (activeNav === NavItem.CAST) {
        return <CastPage onBack={handleBack} />;
    }

    if (activeNav === NavItem.UPLOAD) {
        return <UploadPage onBack={handleBack} onUpload={handleUpload} editItem={editingItem} />;
    }

    // Determine category based on navigation
    let category: string | undefined = undefined;
    if (activeNav === NavItem.MOVIES) category = 'movies';
    if (activeNav === NavItem.TV) category = 'tv';
    if (activeNav === NavItem.WATCHLIST) category = 'watchlist';
    if (activeNav === NavItem.UHD) category = 'uhd';
    if (activeNav === NavItem.KIDS) category = 'kids';
    if (activeNav === NavItem.PODCASTS) category = 'podcasts';
    if (activeNav === NavItem.WEB) category = 'web';
    if (activeNav === NavItem.NEWS) category = 'news';

    return <Home 
        onPlay={handlePlay} 
        onPress={handleCardPress} 
        category={category} 
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
        onAddToQueue={handleAddToQueue}
        onToggleWatched={handleToggleWatched}
        watchedIds={watchedIds}
        uploadedItems={uploadedItems}
    />;
  };

  return (
    <div className="flex h-screen w-full bg-plex-bg text-plex-text overflow-hidden font-sans selection:bg-plex-orange selection:text-black">
      
      {selectedMedia && (
          <MediaDetailModal 
              item={selectedMedia} 
              onClose={handleCloseModal} 
              onPlay={handlePlay}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onPressItem={handleCardPress}
              autoPlay={autoPlayModal}
              onAddToQueue={handleAddToQueue}
              onToggleWatched={handleToggleWatched}
              watchedIds={watchedIds}
              onEdit={handleEditMedia}
          />
      )}

      <Sidebar 
          activeNav={activeNav} 
          setActiveNav={setActiveNav} 
          isOpen={sidebarOpen}
          onToggle={handleToggleSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        <TopBar 
          onSearch={handleSearch}
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          currentSearchQuery={searchQuery}
          onNavigate={setActiveNav}
          onSearchFocus={handleSearchFocus}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
          userProfile={userProfile}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative">
          {renderContent()}
        </main>
        
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;