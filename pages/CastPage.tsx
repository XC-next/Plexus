import React, { useState, useEffect } from 'react';
import { ArrowLeft, Cast, Tv, Speaker, Loader2, Check } from 'lucide-react';

interface CastPageProps {
  onBack: () => void;
}

interface Device {
  id: string;
  name: string;
  type: 'tv' | 'speaker';
  status: 'available' | 'connecting' | 'connected';
}

export const CastPage: React.FC<CastPageProps> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Simulate scanning
    const timer = setTimeout(() => {
      setIsScanning(false);
      setDevices([
        { id: '1', name: 'Living Room TV', type: 'tv', status: 'available' },
        { id: '2', name: 'Bedroom Chromecast', type: 'tv', status: 'available' },
        { id: '3', name: 'Kitchen Speaker', type: 'speaker', status: 'available' },
        { id: '4', name: 'Office Nest Hub', type: 'tv', status: 'available' },
      ]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleConnect = (id: string) => {
    setDevices(devices.map(d => d.id === id ? { ...d, status: 'connecting' } : d));
    
    setTimeout(() => {
        setDevices(prev => prev.map(d => {
            if (d.id === id) return { ...d, status: 'connected' };
            // Disconnect others
            if (d.status === 'connected') return { ...d, status: 'available' };
            return d;
        }));
    }, 1500);
  };

  return (
    <div className="p-6 md:p-10 min-h-screen animate-in fade-in">
      <div className="max-w-3xl mx-auto">
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
                        <Cast size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Cast to Device</h1>
                        <p className="text-gray-400">Select a device to start playback</p>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8 min-h-[400px]">
                {isScanning ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <div className="relative">
                            <div className="absolute inset-0 bg-plex-orange/20 rounded-full animate-ping"></div>
                            <Loader2 size={48} className="relative z-10 animate-spin text-plex-orange" />
                        </div>
                        <p className="mt-8 font-medium">Scanning for nearby devices...</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Available Devices</p>
                        {devices.map(device => (
                            <button
                                key={device.id}
                                onClick={() => handleConnect(device.id)}
                                disabled={device.status === 'connected'}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    device.status === 'connected' 
                                        ? 'bg-plex-orange/10 border-plex-orange' 
                                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${device.status === 'connected' ? 'bg-plex-orange text-black' : 'bg-gray-800 text-gray-400'}`}>
                                        {device.type === 'tv' ? <Tv size={24} /> : <Speaker size={24} />}
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-bold ${device.status === 'connected' ? 'text-plex-orange' : 'text-white'}`}>
                                            {device.name}
                                        </p>
                                        <p className="text-xs text-gray-400 capitalize">{device.type}</p>
                                    </div>
                                </div>
                                
                                {device.status === 'connecting' && <Loader2 size={20} className="animate-spin text-plex-orange" />}
                                {device.status === 'connected' && <div className="flex items-center gap-2 text-plex-orange font-bold text-sm"><Check size={16} /> Connected</div>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 bg-black/20 text-center border-t border-white/5">
                <p className="text-sm text-gray-500">
                    Make sure your device is on the same Wi-Fi network as your Plexus Media Server.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};