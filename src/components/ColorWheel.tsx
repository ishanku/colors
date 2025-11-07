import React, { useRef, useEffect, useState, useCallback } from 'react';
import { HSV, hsvToHex, hexToHsv, polarToCartesian, cartesianToPolar, hsvToRgb } from '../utils/colorUtils';

interface ColorWheelProps {
  color: string;
  size?: number;
  onChange: (color: string) => void;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ color, size = 200, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hsv, setHsv] = useState<HSV>(hexToHsv(color));

  const center = size / 2;
  const radius = (size - 20) / 2;

  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Draw color wheel
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
          if (angle < 0) angle += 360;

          const saturation = Math.min(distance / radius, 1) * 100;
          const hue = angle;

          // Convert HSV to RGB using utility function
          const [r, g, b] = hsvToRgb(hue, saturation, hsv.v);

          const pixelIndex = (y * size + x) * 4;
          data[pixelIndex] = r;
          data[pixelIndex + 1] = g;
          data[pixelIndex + 2] = b;
          data[pixelIndex + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw selection indicator
    const currentPos = polarToCartesian(center, center, (hsv.s / 100) * radius, hsv.h);
    ctx.beginPath();
    ctx.arc(currentPos.x, currentPos.y, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(currentPos.x, currentPos.y, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [size, center, radius, hsv]);

  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  useEffect(() => {
    setHsv(hexToHsv(color));
  }, [color]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(event);
  };

  const handleMouseMove = useCallback((event: React.MouseEvent | MouseEvent) => {
    if (!isDragging && event.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { radius: distance, angle } = cartesianToPolar(center, center, x, y);

    if (distance <= radius) {
      const newSaturation = Math.min((distance / radius) * 100, 100);
      const newHue = angle;

      const newHsv = { ...hsv, h: newHue, s: newSaturation };
      setHsv(newHsv);
      onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
    }
  }, [isDragging, center, radius, hsv, onChange]);

  const handleMouseUp = () => {
    setIsDragging(false);
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
  }, [isDragging, handleMouseMove]);

  return (
    <div className="color-wheel">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ cursor: 'crosshair', borderRadius: '50%' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default ColorWheel;