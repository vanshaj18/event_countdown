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
    <Box className="mx-3 text-center">
      <Paper elevation={3} sx={{ p: 2, minWidth: '80px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
        <Typography variant="h3" className="countdown-value">
          {value.toString().padStart(2, '0')}
        </Typography>
        <Typography variant="caption" className="countdown-label">
          {label}
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 d-flex justify-content-center flex-wrap">
          <TimeBox value={timeLeft.days} label="Days" />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <TimeBox value={timeLeft.minutes} label="Minutes" />
          <TimeBox value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </div>
  );
};

export default Countdown;

