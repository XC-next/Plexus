import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'km';

type Translations = {
  [key: string]: string;
};

const translations: Record<Language, Translations> = {
  en: {
    // Sidebar & Nav
    home: "Home",
    movies: "Movies",
    tv_shows: "TV Shows",
    music: "Music",
    watchlist: "Watchlist",
    search: "Search",
    live_tv: "Live TV",
    uhd_movies: "UHD Movies",
    kids: "Kids",
    podcasts: "Podcasts",
    web_shows: "Web Shows",
    news: "News",
    upload_media: "Upload Media",
    cast_to_device: "Cast to Device",
    settings: "Settings",
    discover: "Discover",
    my_library: "My Library",
    content: "Content",
    system: "System",
    server_online: "ONLINE",
    storage: "Storage",
    used_of: "Used of",
    secured_by: "Secured by Plexus",
    close_sidebar: "Close Sidebar",

    // TopBar
    search_placeholder: "Movies, shows, music, or ask AI...",
    listening: "Listening...",
    edit_profile: "Edit Profile",
    subscription: "Subscription",
    users_sharing: "Users & Sharing",
    sign_out: "Sign Out",
    notifications: "Notifications",
    new_arrival: "New Arrival",
    server_update: "Server Update",

    // Home
    featured: "Featured",
    play: "Play",
    more_info: "More Info",
    my_uploads: "My Uploads",
    ai_recommended: "AI Recommended",
    for_you: "For You",
    on_deck: "On Deck",
    recently_added: "Recently Added",
    recently_aired: "Recently Aired TV",
    top_rated: "Top Rated for You",
    sci_fi_series: "Sci-Fi Series",
    rediscover_sci_fi: "Rediscover Sci-Fi",
    saved_content: "Saved Content",
    no_content: "No content available in",
    check_back: "Check back later for updates.",
    empty_watchlist: "Your watchlist is empty.",
    add_to_watchlist_hint: "Add movies and shows to keep track of what you want to watch.",
    personalizing: "Personalizing your home screen...",

    // Media Detail
    synopsis: "Synopsis",
    episodes: "Episodes",
    extras_clips: "Extras & Clips",
    cast: "Cast",
    more_like_this: "More Like This",
    add_to_queue: "Add to Queue",
    mark_watched: "Mark Watched",
    mark_unwatched: "Mark Unwatched",
    edit_metadata: "Edit Metadata",
    loading: "Loading...",
    view_details: "View Details",
    media_source: "Media Source",
    import_url: "Import from URL",
    upload_video: "Upload Video",
    
    // Settings
    identity: "Identity",
    player: "Player",
    general: "General",
    language: "Language",
    save_changes: "SAVE CHANGES",
    auto_play: "Auto Play",
    interface_language: "Interface language",
    play_next: "Play next episode automatically",
    
    // Upload
    upload_successful: "Upload Successful!",
    update_successful: "Update Successful!",
    metadata: "Metadata",
    title: "Title",
    description: "Description",
    type: "Type",
    year: "Year",
    rating: "Rating",
    genres: "Genres",
    episodes_manager: "Episodes Manager",
    add_episode: "Add Episode",
    artwork: "Artwork",
    poster: "Poster",
    background: "Background",
    save: "Save",
    add_to_library: "Add Media to Library",
    saving: "Saving...",
    adding: "Adding...",
    drag_drop: "Click to upload or drag and drop",
    
    // Cast
    available_devices: "Available Devices",
    scanning: "Scanning for nearby devices...",
    connected: "Connected",
    connect_hint: "Make sure your device is on the same Wi-Fi network as your Plexus Media Server.",
  },
  km: {
    // Sidebar & Nav
    home: "ទំព័រដើម",
    movies: "ភាពយន្ត",
    tv_shows: "កម្មវិធីទូរទស្សន៍",
    music: "តន្ត្រី",
    watchlist: "បញ្ជីតាមដាន",
    search: "ស្វែងរក",
    live_tv: "ទូរទស្សន៍បន្តផ្ទាល់",
    uhd_movies: "ភាពយន្ត 4K UHD",
    kids: "កុមារ",
    podcasts: "ផតខាស់",
    web_shows: "កម្មវិធីវេបសាយ",
    news: "ព័ត៌មាន",
    upload_media: "បង្ហោះមេឌៀ",
    cast_to_device: "ចាក់ទៅឧបករណ៍",
    settings: "ការកំណត់",
    discover: "ស្វែងរក",
    my_library: "បណ្ណាល័យខ្ញុំ",
    content: "មាតិកា",
    system: "ប្រព័ន្ធ",
    server_online: "អនឡាញ",
    storage: "ការផ្ទុក",
    used_of: "បានប្រើនៃ",
    secured_by: "ការពារដោយ Plexus",
    close_sidebar: "បិទរបារចំហៀង",

    // TopBar
    search_placeholder: "ភាពយន្ត កម្មវិធី តន្ត្រី ឬសួរ AI...",
    listening: "កំពុងស្តាប់...",
    edit_profile: "កែប្រែប្រវត្តិរូប",
    subscription: "ការជាវ",
    users_sharing: "អ្នកប្រើប្រាស់ & ការចែករំលែក",
    sign_out: "ចាកចេញ",
    notifications: "ការជូនដំណឹង",
    new_arrival: "ការមកដល់ថ្មី",
    server_update: "បច្ចុប្បន្នភាពម៉ាស៊ីនមេ",

    // Home
    featured: "លេចធ្លោ",
    play: "ចាក់",
    more_info: "ព័ត៌មានបន្ថែម",
    my_uploads: "ការបង្ហោះរបស់ខ្ញុំ",
    ai_recommended: "ណែនាំដោយ AI",
    for_you: "សម្រាប់អ្នក",
    on_deck: "កំពុងរង់ចាំ",
    recently_added: "បានបន្ថែមថ្មីៗ",
    recently_aired: "កម្មវិធីទូរទស្សន៍ដែលបានចាក់ផ្សាយថ្មីៗ",
    top_rated: "ពេញនិយមបំផុតសម្រាប់អ្នក",
    sci_fi_series: "ស៊េរីវិទ្យាសាស្ត្រ",
    rediscover_sci_fi: "រកឃើញវិទ្យាសាស្ត្រឡើងវិញ",
    saved_content: "មាតិកាដែលបានរក្សាទុក",
    no_content: "មិនមានមាតិកានៅក្នុង",
    check_back: "សូមពិនិត្យមើលពេលក្រោយសម្រាប់ការអាប់ដេត។",
    empty_watchlist: "បញ្ជីតាមដានរបស់អ្នកទទេ",
    add_to_watchlist_hint: "បន្ថែមភាពយន្តនិងកម្មវិធីដើម្បីតាមដានអ្វីដែលអ្នកចង់ទស្សនា",
    personalizing: "កំពុងរៀបចំអេក្រង់ដើមរបស់អ្នក...",

    // Media Detail
    synopsis: "សង្ខេប",
    episodes: "ភាគ",
    extras_clips: "ឈុតបន្ថែម",
    cast: "តួសម្តែង",
    more_like_this: "ស្រដៀងគ្នា",
    add_to_queue: "បន្ថែមទៅជួរ",
    mark_watched: "សម្គាល់ថាបានទស្សនា",
    mark_unwatched: "សម្គាល់ថាមិនទាន់ទស្សនា",
    edit_metadata: "កែសម្រួលទិន្នន័យ",
    loading: "កំពុងផ្ទុក...",
    view_details: "មើលព័ត៌មានលម្អិត",
    media_source: "ប្រភពមេឌៀ",
    import_url: "នាំចូលពី URL",
    upload_video: "បង្ហោះវីដេអូ",

    // Settings
    identity: "អត្តសញ្ញាណ",
    player: "អ្នកលេង",
    general: "ទូទៅ",
    language: "ភាសា",
    save_changes: "រក្សាទុកការផ្លាស់ប្តូរ",
    auto_play: "ចាក់ដោយស្វ័យប្រវត្តិ",
    interface_language: "ភាសាចំណុចប្រទាក់",
    play_next: "ចាក់ភាគបន្ទាប់ដោយស្វ័យប្រវត្តិ",

    // Upload
    upload_successful: "បង្ហោះបានជោគជ័យ!",
    update_successful: "បច្ចុប្បន្នភាពបានជោគជ័យ!",
    metadata: "ទិន្នន័យមេតា",
    title: "ចំណងជើង",
    description: "ការពិពណ៌នា",
    type: "ប្រភេទ",
    year: "ឆ្នាំ",
    rating: "ការវាយតម្លៃ",
    genres: "ប្រភេទ",
    episodes_manager: "អ្នកគ្រប់គ្រងភាគ",
    add_episode: "បន្ថែមភាគ",
    artwork: "សិល្បៈ",
    poster: "ប័ណ្ណប្រកាស",
    background: "ផ្ទៃខាងក្រោយ",
    save: "រក្សាទុក",
    add_to_library: "បន្ថែមទៅបណ្ណាល័យ",
    saving: "កំពុងរក្សាទុក...",
    adding: "កំពុងបន្ថែម...",
    drag_drop: "ចុចដើម្បីបង្ហោះ ឬអូសនិងទម្លាក់",

    // Cast
    available_devices: "ឧបករណ៍ដែលមាន",
    scanning: "កំពុងស្កេនរកឧបករណ៍នៅជិត...",
    connected: "បានតភ្ជាប់",
    connect_hint: "ត្រូវប្រាកដថាឧបករណ៍របស់អ្នកស្ថិតនៅលើបណ្តាញ Wi-Fi ដូចគ្នានឹង Plexus Media Server របស់អ្នក។",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('plexus_language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('plexus_language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};