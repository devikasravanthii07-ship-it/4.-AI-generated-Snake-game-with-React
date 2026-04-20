/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import { MusicLibrary, MusicControls, TRACKS } from './components/MusicPlayer';

export default function App() {
  // Game State
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Music State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const padScore = (n: number) => n.toString().padStart(4, '0');

  return (
    <div className="w-[1024px] h-[768px] bg-[#050505] text-white flex flex-col font-sans overflow-hidden border-8 border-[#111] relative shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => skipTrack('next')}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="scanline" />

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#222] bg-[#0a0a0a] z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-tr from-neon-cyan to-neon-pink rounded-sm rotate-45 shadow-[0_0_15px_rgba(0,243,255,0.3)]"></div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic">
            SYNTH-SNAKE <span className="text-neon-cyan text-xs align-top ml-1">v2.0</span>
          </h1>
        </div>

        <div className="flex items-center gap-12 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Session Score</span>
            <span className="text-2xl text-neon-green leading-none tracking-widest neon-text-green">
              {padScore(score)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">High Score</span>
            <span className="text-2xl text-neon-cyan leading-none tracking-widest neon-text-cyan">
              {padScore(highScore)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Left */}
        <aside className="w-72 bg-[#080808] border-r border-[#222] p-6 flex flex-col gap-6 z-40">
          <div>
            <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4">Music Library</h2>
            <MusicLibrary 
              currentTrackIndex={currentTrackIndex} 
              setCurrentTrackIndex={setCurrentTrackIndex}
              isPlaying={isPlaying}
            />
          </div>

          <div className="mt-auto border-t border-[#222] pt-6">
            <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-3">Game Console</h2>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Difficulty</span>
                <span className="text-neon-pink uppercase">Hyper-Drive</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Grid Size</span>
                <span>20 x 20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Neural Sync</span>
                <span className="text-neon-green animate-pulse">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Section: Game Area */}
        <section className="flex-1 bg-black p-8 flex items-center justify-center relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none grid-pattern"></div>
          
          <SnakeGame 
            score={score} 
            setScore={setScore} 
            highScore={highScore} 
            setHighScore={setHighScore} 
          />
        </section>

        {/* Aside Right: Small Visualizer Rail */}
        <aside className="w-16 bg-[#080808] border-l border-[#222] flex flex-col items-center py-6 gap-8 z-40">
          <div className="rotate-90 text-[10px] uppercase tracking-[0.4em] text-neon-pink font-bold whitespace-nowrap mt-4">
            Visualizer v.1
          </div>
          <div className="flex-1 flex flex-col-reverse justify-center gap-1 w-full px-6">
            {[8, 12, 16, 14, 10, 6, 12, 18, 14, 8].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: h * 2 }}
                animate={{ height: isPlaying ? [h, h * 3, h] : h * 2 }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                className="w-full bg-neon-pink opacity-80"
              />
            ))}
          </div>
        </aside>
      </main>

      {/* Footer: Detailed Music Controls */}
      <MusicControls 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        skipTrack={skipTrack}
        currentTime={currentTime}
        duration={duration}
        handleSeek={handleSeek}
        volume={volume}
        setVolume={setVolume}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        formatTime={formatTime}
      />
    </div>
  );
}
