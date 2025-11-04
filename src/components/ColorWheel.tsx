import React, { useRef, useEffect, useState, useCallback } from 'react';
import { HSV, hsvToHex, hexToHsv, polarToCartesian, cartesianToPolar } from '../utils/colorUtils';

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

          const saturation = Math.min(distance / radius, 1);
          const hue = angle;

          // Convert HSV to RGB
          const h = hue / 60;
          const s = saturation;
          const v = hsv.v / 100;

          const c = v * s;
          const x1 = c * (1 - Math.abs((h % 2) - 1));
          const m = v - c;

          let r = 0, g = 0, b = 0;

          if (h >= 0 && h < 1) {
            r = c; g = x1; b = 0;
          } else if (h >= 1 && h < 2) {
            r = x1; g = c; b = 0;
          } else if (h >= 2 && h < 3) {
            r = 0; g = c; b = x1;
          } else if (h >= 3 && h < 4) {
            r = 0; g = x1; b = c;
          } else if (h >= 4 && h < 5) {
            r = x1; g = 0; b = c;
          } else if (h >= 5 && h < 6) {
            r = c; g = 0; b = x1;
          }

          const pixelIndex = (y * size + x) * 4;
          data[pixelIndex] = Math.round((r + m) * 255);
          data[pixelIndex + 1] = Math.round((g + m) * 255);
          data[pixelIndex + 2] = Math.round((b + m) * 255);
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

  const handleMouseMove = (event: React.MouseEvent | MouseEvent) => {
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
  };

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