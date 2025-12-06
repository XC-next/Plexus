import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Link, FileVideo, CheckCircle, Loader2, Image as ImageIcon, Film, Save, Plus, Trash2 } from 'lucide-react';
import { MediaItem, Episode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface UploadPageProps {
  onBack: () => void;
  onUpload: (item: MediaItem) => void;
  editItem?: MediaItem | null;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onBack, onUpload, editItem }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState<'movie' | 'tv' | 'music'>('movie');
  const [rating, setRating] = useState('PG-13');
  const [genre, setGenre] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [backdropPreview, setBackdropPreview] = useState<string>('');

  // Episode Management State
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpSeason, setNewEpSeason] = useState(1);
  const [newEpNumber, setNewEpNumber] = useState(1);
  const [newEpDesc, setNewEpDesc] = useState('');

  const posterInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Populate form if editing
  useEffect(() => {
    if (editItem) {
        setTitle(editItem.title);
        setDescription(editItem.description || '');
        setYear(editItem.year);
        setType(editItem.type);
        setRating(editItem.rating || 'PG-13');
        setGenre(editItem.genre?.join(', ') || '');
        setPosterPreview(editItem.posterUrl);
        setBackdropPreview(editItem.backdropUrl || '');
        setVideoUrl(editItem.videoUrl || '');
        setActiveTab(editItem.videoUrl ? 'url' : 'file');
        if (editItem.episodes) {
            setEpisodes(editItem.episodes);
        }
    }
  }, [editItem]);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setVideoFile(file);
          if (!title && !editItem) {
              setTitle(file.name.replace(/\.[^/.]+$/, ""));
          }
      }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          // Basic check for video type
          if (file.type.startsWith('video/') || file.name.endsWith('.mkv') || file.name.endsWith('.avi')) {
              setVideoFile(file);
              if (!title && !editItem) {
                  setTitle(file.name.replace(/\.[^/.]+$/, ""));
              }
          }
      }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'poster' | 'backdrop') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          if (type === 'poster') {
              setPosterFile(file);
              setPosterPreview(url);
          } else {
              setBackdropFile(file);
              setBackdropPreview(url);
          }
      }
  };

  const handleAddEpisode = () => {
      if (!newEpTitle) return;
      const newEp: Episode = {
          id: `ep-${Date.now()}`,
          title: newEpTitle,
          seasonNumber: newEpSeason,
          episodeNumber: newEpNumber,
          description: newEpDesc,
          duration: 'Unknown',
          thumbnailUrl: 'https://picsum.photos/300/170', // Placeholder
      };
      setEpisodes([...episodes, newEp]);
      setNewEpTitle('');
      setNewEpNumber(prev => prev + 1);
      setNewEpDesc('');
  };

  const handleDeleteEpisode = (id: string) => {
      setEpisodes(episodes.filter(ep => ep.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsUploading(true);

      // Simulate processing time
      setTimeout(() => {
          const finalVideoUrl = activeTab === 'file' && videoFile 
              ? URL.createObjectURL(videoFile) 
              : videoUrl;
          
          const newItem: MediaItem = {
              id: editItem ? editItem.id : `upload-${Date.now()}`,
              title,
              year: Number(year),
              type,
              rating,
              description,
              genre: genre.split(',').map(g => g.trim()),
              duration: editItem?.duration || 'Unknown',
              posterUrl: posterPreview || 'https://picsum.photos/300/450', // Fallback
              backdropUrl: backdropPreview || 'https://picsum.photos/1280/720', // Fallback
              videoUrl: finalVideoUrl || editItem?.videoUrl,
              episodes: type === 'tv' ? episodes : undefined,
              cast: editItem?.cast 
          };

          onUpload(newItem);
          setIsUploading(false);
          setIsSuccess(true);
          
          // Reset after success if not editing
          if (!editItem) {
            setTimeout(() => {
                setIsSuccess(false);
                setTitle('');
                setDescription('');
                setGenre('');
                setVideoFile(null);
                setVideoUrl('');
                setPosterFile(null);
                setPosterPreview('');
                setBackdropFile(null);
                setBackdropPreview('');
                setEpisodes([]);
            }, 2000);
          }
      }, 1000);
  };

  return (
    <div className="p-6 md:p-10 min-h-screen animate-in fade-in pb-20">
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
            </button>

            <div className="bg-[#1b1d21] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                 <div className="p-8 border-b border-white/5 bg-gradient-to-r from-plex-orange/10 to-transparent">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-plex-orange rounded-full text-black">
                            {editItem ? <Save size={32} /> : <Upload size={32} />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{editItem ? t('edit_metadata') : t('upload_media')}</h1>
                            <p className="text-gray-400">{editItem ? 'Update content details' : 'Add content to your personal library'}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white">{editItem ? t('update_successful') : t('upload_successful')}</h3>
                            <p className="text-gray-400 mt-2">Your media has been saved.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Source Selection - Only for Movies or single video items */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Film size={20} className="text-plex-orange" /> {t('media_source')}
                                </h3>
                                <div className="flex gap-4 mb-6 border-b border-white/5 pb-1">
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('file')}
                                        className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'file' ? 'border-plex-orange text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                                    >
                                        <FileVideo size={16} /> {t('upload_video')} (MP4)
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('url')}
                                        className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'url' ? 'border-plex-orange text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                                    >
                                        <Link size={16} /> {t('import_url')}
                                    </button>
                                </div>

                                {activeTab === 'file' ? (
                                    <div 
                                        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all group relative ${
                                            isDragging 
                                                ? 'border-plex-orange bg-plex-orange/10 scale-[1.01]' 
                                                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input 
                                            type="file" 
                                            accept="video/mp4,video/x-m4v,video/*"
                                            onChange={handleVideoFileChange}
                                            className="hidden" 
                                            id="video-upload"
                                        />
                                        <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full min-h-[160px]">
                                            {videoFile ? (
                                                <>
                                                    <FileVideo size={56} className="text-plex-orange mb-4 drop-shadow-lg" />
                                                    <p className="font-bold text-white text-lg">{videoFile.name}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{(videoFile.size / (1024*1024)).toFixed(2)} MB</p>
                                                    <p className="text-xs text-plex-orange mt-4">Click or drag to replace</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={56} className={`mb-4 transition-colors ${isDragging ? 'text-plex-orange' : 'text-gray-500 group-hover:text-plex-orange'}`} />
                                                    <p className={`font-bold text-lg transition-colors ${isDragging ? 'text-plex-orange' : 'text-gray-300'}`}>
                                                        {isDragging ? 'Drop video file here' : t('drag_drop')}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-2">MP4, MKV, AVI or WEBM</p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                ) : (
                                    <div>
                                        <input 
                                            type="url" 
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            placeholder="https://example.com/movie.mp4"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-plex-orange focus:outline-none focus:ring-1 focus:ring-plex-orange transition-all" 
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Direct link to a video file.</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Details Column */}
                                <div className="md:col-span-2 space-y-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                                        {t('metadata')}
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('title')}</label>
                                            <input 
                                                type="text" 
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-plex-orange focus:outline-none focus:ring-1 focus:ring-plex-orange" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('type')}</label>
                                            <select 
                                                value={type}
                                                onChange={(e) => setType(e.target.value as any)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-plex-orange focus:outline-none"
                                            >
                                                <option value="movie">Movie</option>
                                                <option value="tv">TV Show</option>
                                                <option value="music">Music</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('year')}</label>
                                            <input 
                                                type="number" 
                                                value={year}
                                                onChange={(e) => setYear(Number(e.target.value))}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-plex-orange focus:outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('rating')}</label>
                                            <select 
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-plex-orange focus:outline-none"
                                            >
                                                <option>G</option>
                                                <option>PG</option>
                                                <option>PG-13</option>
                                                <option>R</option>
                                                <option>NC-17</option>
                                                <option>TV-Y</option>
                                                <option>TV-14</option>
                                                <option>TV-MA</option>
                                            </select>
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('genres')} (comma separated)</label>
                                            <input 
                                                type="text" 
                                                value={genre}
                                                onChange={(e) => setGenre(e.target.value)}
                                                placeholder="Action, Sci-Fi"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-plex-orange focus:outline-none" 
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">{t('description')}</label>
                                            <textarea 
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={4}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-plex-orange focus:outline-none" 
                                            />
                                        </div>
                                    </div>

                                    {/* Episodes Manager (Only for TV) */}
                                    {type === 'tv' && (
                                        <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                                {t('episodes_manager')}
                                            </h3>
                                            
                                            {/* Add Episode Form */}
                                            <div className="bg-white/5 p-4 rounded-lg border border-white/5 mb-6">
                                                <h4 className="text-sm font-bold text-gray-300 mb-3">{t('add_episode')}</h4>
                                                <div className="grid grid-cols-6 gap-3 mb-3">
                                                    <div className="col-span-1">
                                                        <input 
                                                            type="number" 
                                                            placeholder="S#" 
                                                            value={newEpSeason}
                                                            onChange={(e) => setNewEpSeason(parseInt(e.target.value) || 1)}
                                                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <input 
                                                            type="number" 
                                                            placeholder="E#" 
                                                            value={newEpNumber}
                                                            onChange={(e) => setNewEpNumber(parseInt(e.target.value) || 1)}
                                                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm"
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Episode Title" 
                                                            value={newEpTitle}
                                                            onChange={(e) => setNewEpTitle(e.target.value)}
                                                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm"
                                                        />
                                                    </div>
                                                    <div className="col-span-6">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Description (Optional)" 
                                                            value={newEpDesc}
                                                            onChange={(e) => setNewEpDesc(e.target.value)}
                                                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={handleAddEpisode}
                                                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={16} /> {t('add_episode')}
                                                </button>
                                            </div>

                                            {/* Episode List */}
                                            {episodes.length > 0 ? (
                                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                                    {episodes.map(ep => (
                                                        <div key={ep.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                                                            <div>
                                                                <p className="font-bold text-sm text-white">
                                                                    <span className="text-plex-orange mr-2">S{ep.seasonNumber} E{ep.episodeNumber}</span>
                                                                    {ep.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{ep.description}</p>
                                                            </div>
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleDeleteEpisode(ep.id)}
                                                                className="text-gray-500 hover:text-red-400 p-2"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic text-center py-4">No episodes added yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Artwork Column */}
                                <div className="space-y-6">
                                     <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                                        <ImageIcon size={20} className="text-plex-orange" /> {t('artwork')}
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('poster')}</label>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            ref={posterInputRef} 
                                            onChange={(e) => handleImageChange(e, 'poster')} 
                                            className="hidden" 
                                        />
                                        <div 
                                            onClick={() => posterInputRef.current?.click()}
                                            className="aspect-[2/3] bg-black/40 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all overflow-hidden relative group shadow-inner"
                                        >
                                            {posterPreview ? (
                                                <>
                                                    <img src={posterPreview} alt="Poster Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                                                        <ImageIcon size={24} className="text-white mb-1" />
                                                        <span className="text-white font-bold text-sm">Change Poster</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center text-gray-500 p-4">
                                                    <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                                    <span className="text-xs font-medium block">Upload Poster</span>
                                                    <span className="text-[10px] text-gray-600">Click to browse</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('background')} (Optional)</label>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            ref={backdropInputRef} 
                                            onChange={(e) => handleImageChange(e, 'backdrop')} 
                                            className="hidden" 
                                        />
                                        <div 
                                            onClick={() => backdropInputRef.current?.click()}
                                            className="aspect-video bg-black/40 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all overflow-hidden relative group shadow-inner"
                                        >
                                             {backdropPreview ? (
                                                <>
                                                    <img src={backdropPreview} alt="Backdrop Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                                                        <ImageIcon size={24} className="text-white mb-1" />
                                                        <span className="text-white font-bold text-sm">Change Background</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center text-gray-500 p-4">
                                                    <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                                    <span className="text-xs font-medium block">Upload Background</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <button 
                                    type="submit" 
                                    disabled={isUploading || (!videoFile && !videoUrl && !editItem) || !title}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                                        isUploading || (!videoFile && !videoUrl && !editItem) || !title
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                        : 'bg-plex-orange text-black hover:bg-white hover:scale-[1.01]'
                                    }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" /> {editItem ? t('saving') : t('adding')}
                                        </>
                                    ) : (
                                        <>
                                            {editItem ? <Save size={24} /> : <Upload size={24} />} {editItem ? t('save_changes') : t('add_to_library')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};