import React, { useState, useRef, useEffect } from 'react';
import BackgroundGallery from './components/BackgroundGallery';
import Countdown from './components/Countdown';
import ParticleBackground from './components/ParticleBackground';
import { Box } from '@mui/material';
import { CONSTANTS } from './constants';

const AppContent: React.FC = () => {
  const [isCelebration, setIsCelebration] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [targetDate] = useState(() => {
    return new Date(CONSTANTS.TARGET_DATE);
  });

  useEffect(() => {
    // Initialize audio object
    audioRef.current = new Audio(CONSTANTS.MUSIC_URL);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleCountdownComplete = () => {
    setIsCelebration(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.warn("Audio playback failed:", error);
      });
    }
  };

  return (
    <Box className="app-container">
      <BackgroundGallery />
      <ParticleBackground isComplete={isCelebration} />
      {!isCelebration ? (
        <Box className="content-overlay">
          <Countdown targetDate={targetDate} onComplete={handleCountdownComplete} />
        </Box>
      ) : null}
    </Box>
  );
};

export default AppContent;

