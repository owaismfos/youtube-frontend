import React, { useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Captions
} from "lucide-react";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleVolume = (e) => {
    const value = e.target.value;
    setVolume(value);
    videoRef.current.volume = value;
  };

  const handleProgress = (e) => {
    const video = videoRef.current;
    const value = e.target.value;
    video.currentTime = (value / 100) * video.duration;
    setProgress(value);
  };

  const updateProgress = () => {
    const video = videoRef.current;
    const value = (video.currentTime / video.duration) * 100;
    setProgress(value);
  };

  const toggleFullscreen = () => {
    const player = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      player.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        onTimeUpdate={updateProgress}
        className="w-full"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
      />

      {/* Controls Overlay */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white p-3 space-y-2">
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgress}
          className="w-full accent-red-600 cursor-pointer"
        />

        {/* Control Buttons */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-3">
            <button onClick={togglePlay} className="p-2 hover:text-red-500">
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 1)}
                className="p-2 hover:text-red-500"
              >
                {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolume}
                className="w-16 accent-red-500"
              />
            </div>

            <span className="text-xs text-gray-300">
              10:50 / 33:42
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            <button className="hover:text-red-500"><ThumbsUp size={18} /></button>
            <button className="hover:text-red-500"><ThumbsDown size={18} /></button>
            <button className="hover:text-red-500"><MessageCircle size={18} /></button>
            <button className="hover:text-red-500"><Captions size={18} /></button>
            <button className="hover:text-red-500"><Settings size={18} /></button>
            <button onClick={toggleFullscreen} className="hover:text-red-500">
              {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
