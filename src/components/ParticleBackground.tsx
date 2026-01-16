import React, { useRef, useEffect } from 'react';
import { CONSTANTS } from '../constants';

interface ParticleBackgroundProps {
  isComplete?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ isComplete = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const isCompleteRef = useRef(isComplete);
  const stageRef = useRef<'idle' | 'forming_pigeon' | 'flying_pigeon' | 'burning' | 'final_text'>('idle');
  const stageStartTimeRef = useRef<number>(0);
  const pigeonPointsRef = useRef<{x: number, y: number, color: string}[]>([]);

  useEffect(() => {
    isCompleteRef.current = isComplete;
    if (isComplete && stageRef.current === 'idle') {
      stageRef.current = 'forming_pigeon';
      stageStartTimeRef.current = Date.now();
      if (initFuncRef.current) {
        initFuncRef.current();
      }
    }
  }, [isComplete]);

  const initFuncRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const getPigeonPoints = () => {
      const points: {x: number, y: number, color: string}[] = [];
      // Body (Ellipse-like)
      for (let i = 0; i < 400; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rX = Math.random() * 40;
        const rY = Math.random() * 20;
        points.push({
          x: Math.cos(angle) * rX,
          y: Math.sin(angle) * rY,
          color: '#4A90E2' // Pigeon Blue
        });
      }
      // Head
      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 12;
        points.push({
          x: 45 + Math.cos(angle) * r,
          y: -10 + Math.sin(angle) * r,
          color: '#4A90E2'
        });
      }
      // Beak
      for (let i = 0; i < 50; i++) {
        const px = Math.random() * 15;
        const py = (Math.random() - 0.5) * 8 * (1 - px/15);
        points.push({
          x: 57 + px,
          y: -10 + py,
          color: '#FFD700' // Yellow
        });
      }
      // Wings
      for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rX = Math.random() * 30;
        const rY = Math.random() * 15;
        points.push({
          x: -15 + Math.cos(angle) * rX,
          y: -15 + Math.sin(angle) * rY - Math.abs(Math.cos(angle)) * 20,
          color: '#357ABD' // Darker Blue
        });
      }
      return points;
    };

    pigeonPointsRef.current = getPigeonPoints();

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 80
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      density: number;
      color: string;
      originalColor: string;
      gravity: number;
      friction: number;
      settled: boolean;
      
      // Pigeon properties
      pigeonX: number = 0;
      pigeonY: number = 0;
      pigeonColor: string = '';
      
      // Animation state
      isBurning: boolean = false;
      burnTime: number = 0;

      constructor(x: number, y: number, color: string, isFalling: boolean = false) {
        this.baseX = x;
        this.baseY = y;
        this.color = color;
        this.originalColor = color;
        
        if (isFalling) {
          this.x = x + (Math.random() * 200 - 100);
          this.y = -Math.random() * canvas!.height;
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = Math.random() * 10 + 5;
          this.settled = false;
        } else {
          this.x = Math.random() * canvas!.width;
          this.y = Math.random() * canvas!.height;
          this.vx = (Math.random() - 0.5) * 5;
          this.vy = (Math.random() - 0.5) * 5;
          this.settled = true;
        }

        this.size = Math.random() * 1.5 + 1;
        this.density = (Math.random() * 40) + 5;
        this.gravity = 0.5;
        this.friction = 0.6;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        const stage = stageRef.current;
        const now = Date.now();

        if (stage === 'forming_pigeon' || stage === 'flying_pigeon') {
          let targetX = canvas!.width / 2 + this.pigeonX;
          let targetY = canvas!.height / 2 + this.pigeonY;

          if (stage === 'flying_pigeon') {
            // Add flying motion
            targetX += Math.sin(now / 1000) * 200;
            targetY += Math.cos(now / 500) * 100 + Math.sin(now / 2000) * 100;
            
            // Flapping effect (slight vertical movement for wing particles)
            if (this.pigeonColor === '#357ABD') {
               targetY += Math.sin(now / 200) * 15;
            }
          }

          let dx = targetX - this.x;
          let dy = targetY - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 1) {
            this.x += dx / 15;
            this.y += dy / 15;
            this.color = this.pigeonColor;
          } else {
            this.x = targetX;
            this.y = targetY;
          }
          return;
        }

        if (stage === 'burning') {
          if (!this.isBurning) {
            this.isBurning = true;
            this.burnTime = now;
          }
          
          const burnElapsed = now - this.burnTime;
          if (burnElapsed < 1000) {
            // Fire effect: particles flicker orange/red/yellow
            const colors = ['#FF4500', '#FF8C00', '#FFD700', '#FFFFFF'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.x += (Math.random() - 0.5) * 10;
            this.y -= Math.random() * 5; // Rising like smoke/fire
          } else {
            // Move to final text positions
            let dx = this.baseX - this.x;
            let dy = this.baseY - this.y;
            this.x += dx / 20;
            this.y += dy / 20;
            
            // Transition back to original color
            this.color = this.originalColor;
          }
          return;
        }

        // Default behavior (idle or final text)
        if (!this.settled) {
          this.vy += this.gravity;
          this.x += this.vx;
          this.y += this.vy;

          if (this.y >= this.baseY) {
            this.y = this.baseY;
            this.vy *= -this.friction;
            this.vx *= this.friction;
            if (Math.abs(this.vy) < 1 && Math.abs(this.y - this.baseY) < 1) {
              this.settled = true;
              this.y = this.baseY;
              this.x = this.baseX;
            }
          }
          return;
        }

        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = Math.max(0, (maxDistance * maxDistance) / (distance ** 1.56));
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;

          if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
          } else {
            if (this.x !== this.baseX) {
              let dx = this.x - this.baseX;
              this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
              let dy = this.y - this.baseY;
              this.y -= dy / 10;
            }
          }
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const isComplete = isCompleteRef.current;
      const newParticles: any[] = [];
      const pigeonPoints = pigeonPointsRef.current;
      
      if (isComplete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // --- HAPPY BIRTHDAY ---
        const fontSizeTop = Math.min(canvas.width / 10, 100);
        ctx.font = `bold ${fontSizeTop}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        const textTop = CONSTANTS.EVENT_NAME;
        ctx.fillText(textTop, canvas.width / 2, canvas.height / 3);
        
        const topCoords = ctx.getImageData(0, 0, canvas.width, canvas.height / 2);
        
        // --- NAME ---
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const fontSizeBottom = Math.min(canvas.width / 15, 60);
        ctx.font = `bold ${fontSizeBottom}px Arial`;
        const textBottom = CONSTANTS.PERSON_NAME;
        ctx.fillText(textBottom, canvas.width / 2, (canvas.height / 3) * 2);
        
        const bottomCoords = ctx.getImageData(0, canvas.height / 2, canvas.width, canvas.height / 2);

        const step = Math.max(2, Math.floor(canvas.width / 500));
        
        // Particles for "HAPPY BIRTHDAY"
        for (let y = 0; y < topCoords.height; y += step) {
          for (let x = 0; x < topCoords.width; x += step) {
            if (topCoords.data[(y * 4 * topCoords.width) + (x * 4) + 3] > 128) {
              newParticles.push(new Particle(x, y, 'rgba(255, 215, 0, 1)', true));
            }
          }
        }
        
        // Particles for the name
        for (let y = 0; y < bottomCoords.height; y += step) {
          for (let x = 0; x < bottomCoords.width; x += step) {
            if (bottomCoords.data[(y * 4 * bottomCoords.width) + (x * 4) + 3] > 128) {
              newParticles.push(new Particle(x, y + canvas.height / 2, 'rgba(255, 255, 255, 1)', true));
            }
          }
        }

        // Map pigeon points to particles
        for (let i = 0; i < newParticles.length; i++) {
          const pPoint = pigeonPoints[i % pigeonPoints.length];
          newParticles[i].pigeonX = pPoint.x;
          newParticles[i].pigeonY = pPoint.y;
          newParticles[i].pigeonColor = pPoint.color;
        }

      } else {
        const fontSize = Math.min(canvas.width / 12, 80);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const text = CONSTANTS.PERSON_NAME;
        ctx.fillStyle = 'white';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const step = Math.max(2, Math.floor(canvas.width / 400));
        for (let y = 0; y < textCoordinates.height; y += step) {
          for (let x = 0; x < textCoordinates.width; x += step) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
              newParticles.push(new Particle(x, y, 'rgba(255, 255, 255, 0.8)'));
            }
          }
        }

        for (let i = 0; i < 600; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          newParticles.push(new Particle(x, y, 'rgba(220, 90, 243, 0.8)'));
        }
      }
      particlesRef.current = newParticles;
    };

    initFuncRef.current = init;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const stage = stageRef.current;
      const now = Date.now();
      const elapsed = now - stageStartTimeRef.current;

      // Handle Stage Transitions
      if (isCompleteRef.current) {
        if (stage === 'forming_pigeon' && elapsed > 3000) {
          stageRef.current = 'flying_pigeon';
          stageStartTimeRef.current = now;
        } else if (stage === 'flying_pigeon' && elapsed > 6000) {
          stageRef.current = 'burning';
          stageStartTimeRef.current = now;
        } else if (stage === 'burning' && elapsed > 3000) {
          stageRef.current = 'final_text';
          stageStartTimeRef.current = now;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 5,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ParticleBackground;
