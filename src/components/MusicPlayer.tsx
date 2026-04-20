import { ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

export const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthAI Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/synth1/300/300",
    duration: "03:45"
  },
  {
    id: 2,
    title: "Cyber Streets",
    artist: "GlitchBot Beta",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber1/300/300",
    duration: "04:12"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "ProtoWave Gamma",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover: "https://picsum.photos/seed/grid1/300/300",
    duration: "02:58"
  }
];

export function MusicLibrary({ 
  currentTrackIndex, 
  setCurrentTrackIndex,
  isPlaying 
}: { 
  currentTrackIndex: number; 
  setCurrentTrackIndex: (i: number) => void;
  isPlaying: boolean;
}) {
  return (
    <div className="space-y-2">
      {TRACKS.map((track, i) => (
        <div 
          key={track.id}
          onClick={() => setCurrentTrackIndex(i)}
          className={`p-3 rounded transition-all cursor-pointer flex items-center gap-3 ${
            currentTrackIndex === i 
              ? 'bg-white/5 border border-neon-cyan/30' 
              : 'hover:bg-white/5 border border-transparent'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${
            currentTrackIndex === i 
              ? 'bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f3ff]' 
              : 'bg-transparent'
          }`} />
          <div className="flex-1 overflow-hidden">
            <p className={`text-sm font-medium truncate ${currentTrackIndex === i ? 'text-neon-cyan' : 'text-white'}`}>
              {track.title}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
              {track.artist} • {track.duration}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MusicControls({
  isPlaying,
  setIsPlaying,
  skipTrack,
  currentTime,
  duration,
  handleSeek,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  formatTime
}: any) {
  return (
    <footer className="h-24 bg-[#0a0a0a] border-t border-[#222] flex items-center px-10 gap-12 w-full z-50">
      <div className="flex items-center gap-6">
        <button onClick={() => skipTrack('prev')} className="text-gray-400 hover:text-white transition-colors">
          <SkipBack size={20} fill="currentColor" />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={() => skipTrack('next')} className="text-gray-400 hover:text-white transition-colors">
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative w-full h-1 bg-[#222] rounded-full overflow-hidden group cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          />
          <div 
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-48 flex items-center gap-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-gray-500 hover:text-neon-cyan">
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="flex-1 h-1 bg-[#222] rounded-full relative group">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          />
          <div 
            className="h-full bg-neon-cyan"
            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
          />
        </div>
      </div>
    </footer>
  );
}
