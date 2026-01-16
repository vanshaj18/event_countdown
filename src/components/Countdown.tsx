import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface CountdownProps {
  targetDate: Date;
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference <= 0) {
        onComplete();
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining) {
        setTimeLeft(remaining);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <Box sx={{ m: { xs: 1, sm: 2 }, textAlign: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          minWidth: { xs: '70px', sm: '100px' }, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          color: 'white',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Typography 
          variant="h3" 
          className="countdown-value"
          sx={{ 
            fontSize: { xs: '2.2rem', sm: '4rem' },
            fontWeight: 'bold'
          }}
        >
          {value.toString().padStart(2, '0')}
        </Typography>
        <Typography 
          variant="caption" 
          className="countdown-label"
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '1rem' },
            display: 'block',
            mt: 0.5,
            opacity: 0.8
          }}
        >
          {label}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 }
        }}
      >
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </Box>
    </Box>
  );
};

export default Countdown;

