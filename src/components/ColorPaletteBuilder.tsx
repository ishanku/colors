import React, { useState, useCallback, useEffect } from 'react';
import { Color, generateRandomColor, isValidHex } from '../utils/colorUtils';
import ColorCard from './ColorCard';
import ExportControls from './ExportControls';
import AdvancedColorPicker from './AdvancedColorPicker';
import AccessibilityPanel from './AccessibilityPanel';
import ColorBlindnessSimulator from './ColorBlindnessSimulator';
import ThemeToggle from './ThemeToggle';
import { useUndoRedo } from '../hooks/useUndoRedo';
import './ColorPaletteBuilder.css';

const ColorPaletteBuilder: React.FC = () => {
  const initialPalette: Color[] = [
    { id: '1', hex: '#FF6B6B', name: 'Coral Red' },
    { id: '2', hex: '#4ECDC4', name: 'Turquoise' },
    { id: '3', hex: '#45B7D1', name: 'Sky Blue' },
    { id: '4', hex: '#96CEB4', name: 'Mint Green' },
    { id: '5', hex: '#FFEAA7', name: 'Banana Yellow' }
  ];

  const {
    state: palette,
    setState: setPalette,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory
  } = useUndoRedo<Color[]>(initialPalette);

  const [paletteName, setPaletteName] = useState('My Color Palette');
  const [newColorHex, setNewColorHex] = useState('#002868');
  const [isAdvancedPickerOpen, setIsAdvancedPickerOpen] = useState(false);
  const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>('medium');

  const addColor = useCallback(() => {
    if (isValidHex(newColorHex)) {
      const newColor: Color = {
        id: Date.now().toString(),
        hex: newColorHex.toUpperCase(),
        name: `Color ${palette.length + 1}`
      };
      setPalette([...palette, newColor]);
      setNewColorHex(generateRandomColor());
    }
  }, [newColorHex, palette, setPalette]);

  const addRandomColor = useCallback(() => {
    const randomHex = generateRandomColor();
    const newColor: Color = {
      id: Date.now().toString(),
      hex: randomHex,
      name: `Color ${palette.length + 1}`
    };
    setPalette([...palette, newColor]);
  }, [palette, setPalette]);

  const updateColor = useCallback((id: string, updates: Partial<Color>) => {
    setPalette(palette.map(color =>
      color.id === id ? { ...color, ...updates } : color
    ));
  }, [palette, setPalette]);

  const removeColor = useCallback((id: string) => {
    setPalette(palette.filter(color => color.id !== id));
  }, [palette, setPalette]);

  const clearPalette = useCallback(() => {
    setPalette([]);
  }, [setPalette]);

  const handleAdvancedColorSelect = useCallback((color: string) => {
    setNewColorHex(color);
    const newColor: Color = {
      id: Date.now().toString(),
      hex: color,
      name: `Color ${palette.length + 1}`
    };
    setPalette([...palette, newColor]);
  }, [palette, setPalette]);

  const handleAddAccessibleColors = useCallback((colors: Color[]) => {
    setPalette([...palette, ...colors]);
  }, [palette, setPalette]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if ((event.metaKey || event.ctrlKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="color-palette-builder">
      <header className="header">
        <div className="header-left">
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
        </div>
        <div className="header-center">
          <h1>Color Palette Builder</h1>
          <p className="tagline">Create, customize, and export beautiful color palettes</p>
        </div>
        <div className="header-right">
          <div className="color-input-section">
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="color-picker"
              title="Pick a color"
            />
            <input
              type="text"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="hex-input-small"
              placeholder="#002868"
              pattern="^#[0-9A-Fa-f]{6}$"
              title="Enter hex color code"
            />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="controls">
        <div className="left-controls-section">
          {/* Space for additional controls if needed */}
        </div>

        <div className="center-controls-section">
          <button onClick={addColor} className="add-btn primary">
            ➕ Add Color
          </button>
          <div className="secondary-actions">
            <button onClick={addRandomColor} className="random-btn">
              🎲 Random
            </button>
            <button onClick={() => setIsAdvancedPickerOpen(true)} className="advanced-btn">
              🎨 Advanced
            </button>
          </div>
        </div>

        <div className="right-controls-section">
          <div className="undo-redo-controls">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="undo-btn"
              title="Undo (Ctrl+Z)"
            >
              ↶ Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="redo-btn"
              title="Redo (Ctrl+Y)"
            >
              ↷ Redo
            </button>
          </div>
          <button onClick={clearPalette} className="clear-btn">
            🗑️ Clear All
          </button>
          <span className="color-count">
            {palette.length} color{palette.length !== 1 ? 's' : ''}
          </span>
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
        <>
          <AccessibilityPanel
            palette={palette}
            onAddColors={handleAddAccessibleColors}
          />
          <ColorBlindnessSimulator palette={palette} />
          <ExportControls palette={palette} paletteName={paletteName} />
        </>
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