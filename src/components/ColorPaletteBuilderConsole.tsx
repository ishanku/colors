import React, { useState, useCallback, useEffect } from 'react';
import { Color, generateRandomColor, isValidHex, generateAccessiblePalette } from '../utils/colorUtils';
import { useUndoRedo } from '../hooks/useUndoRedo';
import MainConsole from './MainConsole';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import AdvancedColorPicker from './AdvancedColorPicker';
import ThemeToggle from './ThemeToggle';
import { exportToPDF } from '../utils/pdfExporter';
import { exportToCSV } from '../utils/csvExporter';
import '../styles/console-layout.css';
import './LeftSidebar.css';
import './RightSidebar.css';
import './MainConsole.css';

const ColorPaletteBuilderConsole: React.FC = () => {
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
    canRedo
  } = useUndoRedo<Color[]>(initialPalette);

  const [paletteName, setPaletteName] = useState('My Color Palette');
  const [newColorHex, setNewColorHex] = useState('#002868');
  const [isAdvancedPickerOpen, setIsAdvancedPickerOpen] = useState(false);
  const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Save recent colors to localStorage
  const saveRecentColor = useCallback((color: string) => {
    const recent = JSON.parse(localStorage.getItem('recentColors') || '[]');
    const updated = [color, ...recent.filter((c: string) => c !== color)].slice(0, 10);
    localStorage.setItem('recentColors', JSON.stringify(updated));
  }, []);

  const addColor = useCallback(() => {
    if (isValidHex(newColorHex)) {
      const newColor: Color = {
        id: Date.now().toString(),
        hex: newColorHex.toUpperCase(),
        name: `Color ${palette.length + 1}`
      };
      setPalette([...palette, newColor]);
      saveRecentColor(newColorHex);
      setNewColorHex(generateRandomColor());
    }
  }, [newColorHex, palette, setPalette, saveRecentColor]);

  const addRandomColor = useCallback(() => {
    const randomHex = generateRandomColor();
    const newColor: Color = {
      id: Date.now().toString(),
      hex: randomHex,
      name: `Color ${palette.length + 1}`
    };
    setPalette([...palette, newColor]);
    saveRecentColor(randomHex);
  }, [palette, setPalette, saveRecentColor]);

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

  const generateAccessible = useCallback(() => {
    if (palette.length > 0) {
      const accessibleColors = generateAccessiblePalette(palette[0].hex, 5);
      setPalette([...palette, ...accessibleColors]);
    }
  }, [palette, setPalette]);

  const handleAdvancedColorSelect = useCallback((color: string) => {
    setNewColorHex(color);
    const newColor: Color = {
      id: Date.now().toString(),
      hex: color,
      name: `Color ${palette.length + 1}`
    };
    setPalette([...palette, newColor]);
    saveRecentColor(color);
  }, [palette, setPalette, saveRecentColor]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(palette, paletteName);
  }, [palette, paletteName]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(palette, paletteName);
  }, [palette, paletteName]);

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
    <div className="console-layout">
      {/* Console Header */}
      <div className="console-header">
        <div className="console-title">
          <div className="console-logo">🎨</div>
          <h1>Color Palette Builder</h1>
        </div>

        <div className="palette-status">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>{palette.length} COLORS</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Left Sidebar - Settings & Operations */}
      <LeftSidebar
        onUndo={undo}
        onRedo={redo}
        onClearPalette={clearPalette}
        onGenerateAccessible={generateAccessible}
        canUndo={canUndo}
        canRedo={canRedo}
        paletteLength={palette.length}
        cardSize={cardSize}
        onCardSizeChange={setCardSize}
      />

      {/* Main Console */}
      <MainConsole
        palette={palette}
        paletteName={paletteName}
        setPaletteName={setPaletteName}
        cardSize={cardSize}
        onUpdateColor={updateColor}
        onRemoveColor={removeColor}
      />

      {/* Right Sidebar - Color Input & Analysis */}
      <RightSidebar
        palette={palette}
        paletteName={paletteName}
        newColorHex={newColorHex}
        setNewColorHex={setNewColorHex}
        onAddColor={addColor}
        onAddRandomColor={addRandomColor}
        onOpenAdvancedPicker={() => setIsAdvancedPickerOpen(true)}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
      />

      {/* Advanced Color Picker Modal */}
      <AdvancedColorPicker
        isOpen={isAdvancedPickerOpen}
        onClose={() => setIsAdvancedPickerOpen(false)}
        onColorSelect={handleAdvancedColorSelect}
        initialColor={newColorHex}
      />
    </div>
  );
};

export default ColorPaletteBuilderConsole;