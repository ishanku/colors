import React, { useState, useCallback } from 'react';
import { Color, generateRandomColor, isValidHex } from '../utils/colorUtils';
import ColorCard from './ColorCard';
import ExportControls from './ExportControls';
import AdvancedColorPicker from './AdvancedColorPicker';
import './ColorPaletteBuilder.css';

const ColorPaletteBuilder: React.FC = () => {
  const [palette, setPalette] = useState<Color[]>([
    { id: '1', hex: '#FF6B6B', name: 'Coral Red' },
    { id: '2', hex: '#4ECDC4', name: 'Turquoise' },
    { id: '3', hex: '#45B7D1', name: 'Sky Blue' },
    { id: '4', hex: '#96CEB4', name: 'Mint Green' },
    { id: '5', hex: '#FFEAA7', name: 'Banana Yellow' }
  ]);
  const [paletteName, setPaletteName] = useState('My Color Palette');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [isAdvancedPickerOpen, setIsAdvancedPickerOpen] = useState(false);
  const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>('medium');

  const addColor = useCallback(() => {
    if (isValidHex(newColorHex)) {
      const newColor: Color = {
        id: Date.now().toString(),
        hex: newColorHex.toUpperCase(),
        name: `Color ${palette.length + 1}`
      };
      setPalette(prev => [...prev, newColor]);
      setNewColorHex(generateRandomColor());
    }
  }, [newColorHex, palette.length]);

  const addRandomColor = useCallback(() => {
    const randomHex = generateRandomColor();
    const newColor: Color = {
      id: Date.now().toString(),
      hex: randomHex,
      name: `Color ${palette.length + 1}`
    };
    setPalette(prev => [...prev, newColor]);
  }, [palette.length]);

  const updateColor = useCallback((id: string, updates: Partial<Color>) => {
    setPalette(prev => prev.map(color =>
      color.id === id ? { ...color, ...updates } : color
    ));
  }, []);

  const removeColor = useCallback((id: string) => {
    setPalette(prev => prev.filter(color => color.id !== id));
  }, []);

  const clearPalette = useCallback(() => {
    setPalette([]);
  }, []);

  const handleAdvancedColorSelect = useCallback((color: string) => {
    setNewColorHex(color);
    const newColor: Color = {
      id: Date.now().toString(),
      hex: color,
      name: `Color ${palette.length + 1}`
    };
    setPalette(prev => [...prev, newColor]);
  }, [palette.length]);

  return (
    <div className="color-palette-builder">
      <header className="header">
        <h1>Color Palette Builder</h1>
        <div className="palette-name-section">
          <label htmlFor="palette-name">Palette Name:</label>
          <input
            id="palette-name"
            type="text"
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            className="palette-name-input"
            placeholder="Enter palette name"
          />
        </div>
      </header>

      <div className="controls">
        <div className="add-color-section">
          <input
            type="color"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            className="color-picker"
          />
          <input
            type="text"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            className="hex-input"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
          <button onClick={addColor} className="add-btn">
            Add Color
          </button>
          <button onClick={addRandomColor} className="random-btn">
            Add Random
          </button>
          <button onClick={() => setIsAdvancedPickerOpen(true)} className="advanced-btn">
            🎨 Advanced Picker
          </button>
        </div>

        <div className="palette-controls">
          <div className="left-controls">
            <button onClick={clearPalette} className="clear-btn">
              Clear All
            </button>
            <span className="color-count">
              {palette.length} color{palette.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="size-controls">
            <label className="size-label">Card Size:</label>
            <div className="size-toggle">
              <button
                className={`size-btn ${cardSize === 'small' ? 'active' : ''}`}
                onClick={() => setCardSize('small')}
                title="Small cards"
              >
                S
              </button>
              <button
                className={`size-btn ${cardSize === 'medium' ? 'active' : ''}`}
                onClick={() => setCardSize('medium')}
                title="Medium cards"
              >
                M
              </button>
              <button
                className={`size-btn ${cardSize === 'large' ? 'active' : ''}`}
                onClick={() => setCardSize('large')}
                title="Large cards"
              >
                L
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`palette-grid size-${cardSize}`}>
        {palette.map(color => (
          <ColorCard
            key={color.id}
            color={color}
            size={cardSize}
            onUpdate={updateColor}
            onRemove={removeColor}
          />
        ))}

        {palette.length === 0 && (
          <div className="empty-state">
            <p>No colors in your palette yet!</p>
            <p>Add some colors to get started.</p>
          </div>
        )}
      </div>

      {palette.length > 0 && (
        <ExportControls palette={palette} paletteName={paletteName} />
      )}

      <AdvancedColorPicker
        isOpen={isAdvancedPickerOpen}
        onClose={() => setIsAdvancedPickerOpen(false)}
        onColorSelect={handleAdvancedColorSelect}
        initialColor={newColorHex}
      />
    </div>
  );
};

export default ColorPaletteBuilder;