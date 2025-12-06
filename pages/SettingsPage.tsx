import React, { useState, useRef } from 'react';
import { User, CreditCard, Shield, Sliders, PlayCircle, Monitor, Captions, Speaker, Settings as SettingsIcon, Check, Mail, Edit3, Camera, Fingerprint, Zap, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsPageProps {
    onBack?: () => void;
    userProfile?: {name: string, email: string, avatar: string | null};
    setUserProfile?: (profile: {name: string, email: string, avatar: string | null}) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, userProfile, setUserProfile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage();

  // Helper to access current profile data (either from prop or local fallback)
  const currentProfile = userProfile || { name: 'Demo User', email: 'demo@plexus.app', avatar: localAvatar };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          if (setUserProfile && userProfile) {
              setUserProfile({ ...userProfile, avatar: url });
          } else {
              setLocalAvatar(url);
          }
      }
  };

  const handleUpdateField = (field: 'name' | 'email', value: string) => {
      if (setUserProfile && userProfile) {
          setUserProfile({ ...userProfile, [field]: value });
      }
  };

  const tabs = [
    { id: 'profile', label: t('identity'), icon: User },
    { id: 'subscription', label: t('subscription'), icon: CreditCard },
    { id: 'sharing', label: t('users_sharing'), icon: Shield },
    { id: 'player', label: t('player'), icon: PlayCircle },
    { id: 'general', label: t('general'), icon: Sliders },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="relative w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-plex-orange/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="relative overflow-hidden rounded-[2rem] bg-[#1a1c20]/60 backdrop-blur-2xl border border-white/5 shadow-2xl">
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-plex-orange/50 to-transparent opacity-50"></div>
                
                <div className="p-8 md:p-12 relative z-10">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 tracking-tight uppercase">
                                {t('identity')}<span className="text-plex-orange">.</span>
                            </h2>
                            <p className="text-sm text-gray-400 font-medium tracking-widest uppercase mt-2 flex items-center gap-2">
                                <Fingerprint size={14} className="text-plex-orange"/> Personalize your digital presence
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                SYNCED
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        
                        {/* Avatar Column */}
                        <div className="w-full lg:w-auto flex flex-col items-center">
                            <div 
                                className="relative group cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {/* Rotating Ring Effect */}
                                <div className="absolute -inset-4 bg-gradient-to-tr from-plex-orange/20 via-purple-500/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 opacity-50 group-hover:opacity-100"></div>
                                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-50"></div>
                                
                                <div className="relative w-48 h-48 rounded-full bg-[#131518] border-[6px] border-[#1a1c20] shadow-2xl flex items-center justify-center overflow-hidden">
                                    {currentProfile.avatar ? (
                                        <img src={currentProfile.avatar} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                            <span className="text-6xl font-black text-white/20">{currentProfile.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                                        <Camera size={32} className="text-white mb-2" />
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Upload</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-4 right-4 bg-plex-orange text-black p-2.5 rounded-full shadow-lg shadow-plex-orange/20 border-4 border-[#1a1c20] group-hover:scale-110 transition-transform">
                                    <Edit3 size={18} />
                                </div>
                            </div>
                            
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*"
                            />
                            
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500 font-mono mb-1">AVATAR_ID</p>
                                <p className="text-[10px] text-gray-600 font-mono uppercase">{Math.random().toString(36).substring(2, 10)}</p>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="flex-1 w-full space-y-8">
                            <div className="grid gap-8">
                                <div className="group relative">
                                    <label className="absolute -top-3 left-4 px-2 bg-[#1f2227] text-[10px] font-bold text-plex-orange uppercase tracking-widest z-10">
                                        Display Name
                                    </label>
                                    <div className="relative bg-black/20 rounded-2xl border border-white/5 transition-colors group-hover:border-white/10 focus-within:border-plex-orange/50 focus-within:bg-black/40 focus-within:ring-1 focus-within:ring-plex-orange/50 overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <User size={20} className="text-gray-500 group-focus-within:text-white transition-colors" />
                                        </div>
                                        <input 
                                            type="text" 
                                            value={currentProfile.name}
                                            onChange={(e) => handleUpdateField('name', e.target.value)}
                                            className="w-full bg-transparent border-none py-5 pl-14 pr-6 text-white placeholder-gray-600 focus:ring-0 text-lg font-medium"
                                            placeholder="Enter your name"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                                            <Edit3 size={16} className="text-gray-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="absolute -top-3 left-4 px-2 bg-[#1f2227] text-[10px] font-bold text-plex-orange uppercase tracking-widest z-10">
                                        Email Address
                                    </label>
                                    <div className="relative bg-black/20 rounded-2xl border border-white/5 transition-colors group-hover:border-white/10 focus-within:border-plex-orange/50 focus-within:bg-black/40 focus-within:ring-1 focus-within:ring-plex-orange/50 overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Mail size={20} className="text-gray-500 group-focus-within:text-white transition-colors" />
                                        </div>
                                        <input 
                                            type="email" 
                                            value={currentProfile.email}
                                            onChange={(e) => handleUpdateField('email', e.target.value)}
                                            className="w-full bg-transparent border-none py-5 pl-14 pr-6 text-white placeholder-gray-600 focus:ring-0 text-lg font-medium"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <button className="flex-1 bg-gradient-to-r from-plex-orange to-amber-500 hover:from-white hover:to-white hover:text-black text-black font-bold py-5 rounded-2xl shadow-lg shadow-plex-orange/10 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                                    <Check size={20} />
                                    <span>{t('save_changes')}</span>
                                </button>
                                <button className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                    <Zap size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="max-w-2xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Plexus Pass</h2>
            <div className="bg-gradient-to-r from-plex-orange/20 to-plex-orange/5 border border-plex-orange/30 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-plex-orange mb-2">Lifetime Plexus Pass</h3>
                    <p className="text-gray-300">You have access to all premium features.</p>
                </div>
                <span className="bg-plex-orange text-black font-bold px-3 py-1 rounded text-xs uppercase">Active</span>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-4">Payment Method</h3>
            <div className="flex items-center gap-4 p-4 border border-white/10 rounded bg-white/5">
                <CreditCard className="text-gray-400" />
                <div>
                    <p className="font-bold">Visa ending in 4242</p>
                    <p className="text-xs text-gray-400">Expires 12/28</p>
                </div>
                <button className="ml-auto text-sm text-plex-orange hover:text-white">Edit</button>
            </div>
          </div>
        );
      case 'sharing':
        return (
          <div className="max-w-2xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">{t('users_sharing')}</h2>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Home Users</h3>
                <button className="bg-plex-orange text-black px-4 py-2 rounded font-bold hover:bg-white transition-colors">Add User</button>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">D</div>
                    <div className="flex-1">
                        <p className="font-bold">Demo User</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/5 opacity-70">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">K</div>
                    <div className="flex-1">
                        <p className="font-bold">Kids Profile</p>
                        <p className="text-xs text-gray-400">Restricted</p>
                    </div>
                     <button className="text-sm text-gray-400 hover:text-white">Edit</button>
                </div>
            </div>
          </div>
        );
      case 'player':
        return (
            <div className="max-w-2xl animate-fade-in space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <SettingsIcon className="text-plex-orange" />
                        Player Settings
                    </h2>
                    
                    {/* Video Quality Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Monitor size={20} className="text-gray-400" /> Video Quality
                        </h3>
                        <div className="space-y-4 bg-white/5 p-5 rounded-lg border border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-200">Home Streaming</p>
                                    <p className="text-xs text-gray-400">Quality for devices on the same network</p>
                                </div>
                                <select className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white focus:border-plex-orange focus:outline-none min-w-[140px]">
                                    <option>Maximum</option>
                                    <option>20 Mbps (4K)</option>
                                    <option>12 Mbps (1080p)</option>
                                    <option>8 Mbps (1080p)</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-200">Remote Streaming</p>
                                    <p className="text-xs text-gray-400">Quality when streaming over the internet</p>
                                </div>
                                <select className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white focus:border-plex-orange focus:outline-none min-w-[140px]">
                                    <option>2 Mbps (720p)</option>
                                    <option>4 Mbps (720p)</option>
                                    <option>8 Mbps (1080p)</option>
                                    <option>Original</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div>
                                    <p className="font-medium text-gray-200">Auto Adjust Quality</p>
                                    <p className="text-xs text-gray-400">Automatically adjust quality based on connection speed</p>
                                </div>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input type="checkbox" name="toggle" id="toggle-quality" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5" defaultChecked/>
                                    <label htmlFor="toggle-quality" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-600 cursor-pointer checked:bg-plex-orange"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Reset Button */}
                    <div className="flex justify-end">
                        <button 
                            onClick={() => {
                                alert("Settings reset to default.");
                            }}
                            className="text-sm text-gray-400 hover:text-white underline decoration-dashed underline-offset-4 transition-colors"
                        >
                            Reset Defaults
                        </button>
                    </div>

                    {/* Subtitles & CC */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Captions size={20} className="text-gray-400" /> Subtitles (CC)
                        </h3>
                        <div className="space-y-4 bg-white/5 p-5 rounded-lg border border-white/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-200">Burn Subtitles</p>
                                    <p className="text-xs text-gray-400">Determine when to burn-in subtitles</p>
                                </div>
                                <select className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white focus:border-plex-orange focus:outline-none min-w-[140px]">
                                    <option>Automatic</option>
                                    <option>Only Image Formats</option>
                                    <option>Always</option>
                                </select>
                            </div>
                             <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-200">Subtitle Size</p>
                                    <p className="text-xs text-gray-400">Size of the text on screen</p>
                                </div>
                                <select className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white focus:border-plex-orange focus:outline-none min-w-[140px]">
                                    <option>Tiny</option>
                                    <option>Small</option>
                                    <option>Normal</option>
                                    <option>Large</option>
                                    <option>Huge</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Audio & Player */}
                    <div>
                         <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Speaker size={20} className="text-gray-400" /> Audio & Playback
                        </h3>
                        <div className="space-y-4 bg-white/5 p-5 rounded-lg border border-white/5">
                             <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-200">Audio Boost</p>
                                    <p className="text-xs text-gray-400">Boost volume for downmixed audio</p>
                                </div>
                                <select className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white focus:border-plex-orange focus:outline-none min-w-[140px]">
                                    <option>None</option>
                                    <option>Small</option>
                                    <option>Large</option>
                                    <option>Huge</option>
                                </select>
                            </div>
                             <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="font-medium text-gray-200">Cinema Trailers</p>
                                    <p className="text-xs text-gray-400">Play trailers before movies</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select className="bg-black/40 border border-white/10 rounded p-2 text-sm text-white focus:border-plex-orange focus:outline-none">
                                        <option>None</option>
                                        <option>1 Trailer</option>
                                        <option>2 Trailers</option>
                                        <option>3 Trailers</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
       case 'general':
       default:
           return (
               <div className="max-w-2xl animate-fade-in">
                   <h2 className="text-2xl font-bold mb-6">{t('general')} {t('settings')}</h2>
                   <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                           <div>
                               <p className="font-medium">{t('language')}</p>
                               <p className="text-sm text-gray-400">{t('interface_language')}</p>
                           </div>
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value as 'en' | 'km')}
                                className="bg-black/20 border border-white/10 rounded p-2 text-sm text-white focus:border-plex-orange focus:outline-none"
                            >
                                <option value="en">English</option>
                                <option value="km">Khmer (ខ្មែរ)</option>
                            </select>
                       </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                           <div>
                               <p className="font-medium">{t('auto_play')}</p>
                               <p className="text-sm text-gray-400">{t('play_next')}</p>
                           </div>
                            <input type="checkbox" defaultChecked className="accent-plex-orange w-5 h-5" />
                       </div>
                   </div>
               </div>
           );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1b1d21]">
      <div className="md:hidden flex items-center p-4 border-b border-white/5">
          {onBack && (
              <button onClick={onBack} className="mr-4 text-gray-400">
                  <ArrowLeft size={24} />
              </button>
          )}
          <h1 className="text-lg font-bold">{t('settings')}</h1>
      </div>
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-white/5 p-4 md:p-6 bg-[#17191c]">
            {onBack && (
                <button 
                    onClick={onBack}
                    className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="font-medium">Back</span>
                </button>
            )}

            <h1 className="text-xl font-bold mb-8 px-3 hidden md:block">{t('settings')}</h1>
            
            <div className="space-y-1">
            {tabs.map(tab => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-plex-orange text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                <tab.icon size={18} />
                {tab.label}
                </button>
            ))}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-plex-bg relative">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};