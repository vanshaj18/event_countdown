import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTANTS } from '../constants';

const BackgroundGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = CONSTANTS.IMAGES
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000); // Increased interval to 8 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-gallery">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="background-image"
          alt="background"
        />
      </AnimatePresence>
    </div>
  );
};

export default BackgroundGallery;

