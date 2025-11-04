import React, { useRef, useEffect, useState } from 'react';
import { HSV, hsvToHex } from '../utils/colorUtils';

interface BrightnessSliderProps {
  hsv: HSV;
  onChange: (value: number) => void;
  width?: number;
  height?: number;
}

const BrightnessSlider: React.FC<BrightnessSliderProps> = ({
  hsv,
  onChange,
  width = 200,
  height = 20
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const drawSlider = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient from black to full brightness
    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    for (let i = 0; i <= 10; i++) {
      const value = (i / 10) * 100;
      const color = hsvToHex(hsv.h, hsv.s, value);
      gradient.addColorStop(i / 10, color);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw current value indicator
    const position = (hsv.v / 100) * width;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, height);
    ctx.stroke();

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, height);
    ctx.stroke();
  };

  useEffect(() => {
    drawSlider();
  }, [hsv, width, height]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(event);
  };

  const handleMouseMove = (event: React.MouseEvent | MouseEvent) => {
    if (!isDragging && event.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(width, event.clientX - rect.left));
    const value = (x / width) * 100;

    onChange(value);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (event: MouseEvent) => {
        handleMouseMove(event);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="brightness-slider">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default BrightnessSlider;