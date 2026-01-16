import React, { useState } from 'react';
import BackgroundGallery from './components/BackgroundGallery';
import Countdown from './components/Countdown';
import ParticleBackground from './components/ParticleBackground';
import { Box } from '@mui/material';
import { CONSTANTS } from './constants';

const AppContent: React.FC = () => {
  const [isCelebration, setIsCelebration] = useState(false);
  const [targetDate] = useState(() => {
    return new Date(CONSTANTS.TARGET_DATE);
  });

  const handleCountdownComplete = () => {
    setIsCelebration(true);
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

