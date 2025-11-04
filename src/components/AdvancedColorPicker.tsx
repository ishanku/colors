import React, { useState, useCallback } from 'react';
import { HSV, hsvToHex, hexToHsv, generateRandomColor } from '../utils/colorUtils';
import ColorWheel from './ColorWheel';
import BrightnessSlider from './BrightnessSlider';
import './AdvancedColorPicker.css';

interface AdvancedColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  initialColor?: string;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({
  isOpen,
  onClose,
  onColorSelect,
  initialColor = '#FF6B6B'
}) => {
  const [activeTab, setActiveTab] = useState<'wheel' | 'sliders' | 'presets' | 'gradients'>('wheel');
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [hsv, setHsv] = useState<HSV>(hexToHsv(initialColor));

  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#A9DFBF',
    '#F9E79F', '#D7BDE2', '#A2D9CE', '#FAD7A0', '#D5A6BD',
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#E67E22', '#34495E', '#95A5A6', '#16A085'
  ];

  const gradientPresets = [
    { name: 'Sunset', colors: ['#FF6B6B', '#FF8E53', '#FF6B9D'] },
    { name: 'Ocean', colors: ['#667eea', '#764ba2', '#667eea'] },
    { name: 'Forest', colors: ['#134E5E', '#71B280', '#134E5E'] },
    { name: 'Fire', colors: ['#FF416C', '#FF4B2B', '#FF416C'] },
    { name: 'Purple', colors: ['#667eea', '#764ba2', '#667eea'] },
    { name: 'Mint', colors: ['#00b09b', '#96c93d', '#00b09b'] }
  ];

  const updateColor = useCallback((newHsv: HSV) => {
    setHsv(newHsv);
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setCurrentColor(hex);
  }, []);

  const handleWheelChange = useCallback((color: string) => {
    setCurrentColor(color);
    setHsv(hexToHsv(color));
  }, []);

  const handleBrightnessChange = useCallback((value: number) => {
    const newHsv = { ...hsv, v: value };
    updateColor(newHsv);
  }, [hsv, updateColor]);

  const handleHueChange = useCallback((value: number) => {
    const newHsv = { ...hsv, h: value };
    updateColor(newHsv);
  }, [hsv, updateColor]);

  const handleSaturationChange = useCallback((value: number) => {
    const newHsv = { ...hsv, s: value };
    updateColor(newHsv);
  }, [hsv, updateColor]);

  const handlePresetClick = useCallback((color: string) => {
    setCurrentColor(color);
    setHsv(hexToHsv(color));
  }, []);

  const handleRandomColor = useCallback(() => {
    const randomColor = generateRandomColor();
    setCurrentColor(randomColor);
    setHsv(hexToHsv(randomColor));
  }, []);

  const handleConfirm = useCallback(() => {
    onColorSelect(currentColor);
    onClose();
  }, [currentColor, onColorSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="advanced-color-picker-overlay" onClick={onClose}>
      <div className="advanced-color-picker" onClick={(e) => e.stopPropagation()}>
        <div className="picker-header">
          <h3>Advanced Color Picker</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="picker-tabs">
          <button
            className={`tab ${activeTab === 'wheel' ? 'active' : ''}`}
            onClick={() => setActiveTab('wheel')}
          >
            🎨 Color Wheel
          </button>
          <button
            className={`tab ${activeTab === 'sliders' ? 'active' : ''}`}
            onClick={() => setActiveTab('sliders')}
          >
            🎚️ Sliders
          </button>
          <button
            className={`tab ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            🎯 Presets
          </button>
          <button
            className={`tab ${activeTab === 'gradients' ? 'active' : ''}`}
            onClick={() => setActiveTab('gradients')}
          >
            🌈 Gradients
          </button>
        </div>

        <div className="picker-content">
          {activeTab === 'wheel' && (
            <div className="wheel-tab">
              <div className="wheel-container">
                <ColorWheel
                  color={currentColor}
                  size={250}
                  onChange={handleWheelChange}
                />
              </div>
              <div className="brightness-container">
                <label>Brightness</label>
                <BrightnessSlider
                  hsv={hsv}
                  onChange={handleBrightnessChange}
                  width={250}
                  height={20}
                />
                <span>{Math.round(hsv.v)}%</span>
              </div>
            </div>
          )}

          {activeTab === 'sliders' && (
            <div className="sliders-tab">
              <div className="slider-group">
                <label>Hue: {Math.round(hsv.h)}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsv.h}
                  onChange={(e) => handleHueChange(Number(e.target.value))}
                  className="hue-slider"
                />
              </div>
              <div className="slider-group">
                <label>Saturation: {Math.round(hsv.s)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsv.s}
                  onChange={(e) => handleSaturationChange(Number(e.target.value))}
                  className="saturation-slider"
                />
              </div>
              <div className="slider-group">
                <label>Brightness: {Math.round(hsv.v)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsv.v}
                  onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                  className="brightness-slider"
                />
              </div>
              <button className="random-btn" onClick={handleRandomColor}>
                🎲 Random Color
              </button>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="presets-tab">
              <div className="preset-grid">
                {presetColors.map((color, index) => (
                  <button
                    key={index}
                    className={`preset-color ${currentColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handlePresetClick(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gradients' && (
            <div className="gradients-tab">
              {gradientPresets.map((gradient, index) => (
                <div key={index} className="gradient-preset">
                  <div className="gradient-name">{gradient.name}</div>
                  <div className="gradient-colors">
                    {gradient.colors.map((color, colorIndex) => (
                      <button
                        key={colorIndex}
                        className="gradient-color"
                        style={{ backgroundColor: color }}
                        onClick={() => handlePresetClick(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="picker-preview">
          <div className="current-color">
            <div
              className="color-display"
              style={{ backgroundColor: currentColor }}
            />
            <div className="color-info">
              <div className="color-value">{currentColor}</div>
              <div className="color-hsv">
                HSV({Math.round(hsv.h)}, {Math.round(hsv.s)}%, {Math.round(hsv.v)}%)
              </div>
            </div>
          </div>
        </div>

        <div className="picker-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Use This Color
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedColorPicker;