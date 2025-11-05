import React from 'react';
import { isValidHex } from '../utils/colorUtils';
import './LeftSidebar.css';

interface LeftSidebarProps {
  newColorHex: string;
  setNewColorHex: (color: string) => void;
  onAddColor: () => void;
  onAddRandomColor: () => void;
  onOpenAdvancedPicker: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearPalette: () => void;
  onGenerateAccessible: () => void;
  canUndo: boolean;
  canRedo: boolean;
  paletteLength: number;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  newColorHex,
  setNewColorHex,
  onAddColor,
  onAddRandomColor,
  onOpenAdvancedPicker,
  onUndo,
  onRedo,
  onClearPalette,
  onGenerateAccessible,
  canUndo,
  canRedo,
  paletteLength
}) => {
  const quickPresets = [
    { color: '#FF6B6B', name: 'Coral' },
    { color: '#4ECDC4', name: 'Teal' },
    { color: '#45B7D1', name: 'Blue' },
    { color: '#96CEB4', name: 'Mint' },
    { color: '#FFEAA7', name: 'Yellow' },
    { color: '#DDA0DD', name: 'Plum' },
    { color: '#FF9F43', name: 'Orange' },
    { color: '#5F27CD', name: 'Purple' }
  ];

  const recentColors = JSON.parse(localStorage.getItem('recentColors') || '[]').slice(0, 6);

  const handlePresetClick = (color: string) => {
    setNewColorHex(color);
    onAddColor();
  };

  return (
    <div className="left-sidebar">
      {/* Color Input Panel */}
      <div className="console-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <div className="panel-icon">🎨</div>
            Color Input
          </h3>
        </div>

        <div className="color-input-section">
          <div className="color-picker-group">
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="console-color-picker"
            />
            <input
              type="text"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="console-input hex-input"
              placeholder="#002868"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>

          <div className="action-buttons">
            <button
              onClick={onAddColor}
              className="console-btn success"
              disabled={!isValidHex(newColorHex)}
            >
              Add Color
            </button>
            <button
              onClick={onAddRandomColor}
              className="console-btn"
            >
              Random
            </button>
            <button
              onClick={onOpenAdvancedPicker}
              className="console-btn"
            >
              🎨 Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Palette Operations */}
      <div className="console-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <div className="panel-icon">⚙️</div>
            Operations
          </h3>
        </div>

        <div className="operations-grid">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="console-btn"
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="console-btn"
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
          <button
            onClick={onClearPalette}
            className="console-btn danger"
            disabled={paletteLength === 0}
          >
            Clear All
          </button>
          <button
            onClick={onGenerateAccessible}
            className="console-btn success"
            disabled={paletteLength === 0}
          >
            Accessible
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="console-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <div className="panel-icon">🌈</div>
            Quick Colors
          </h3>
        </div>

        <div className="preset-grid">
          {quickPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset.color)}
              className="preset-color"
              style={{ backgroundColor: preset.color }}
              title={`${preset.name} - ${preset.color}`}
            >
              <span className="preset-label">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Colors */}
      {recentColors.length > 0 && (
        <div className="console-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <div className="panel-icon">🕒</div>
              Recent
            </h3>
          </div>

          <div className="recent-colors">
            {recentColors.map((color: string, index: number) => (
              <button
                key={index}
                onClick={() => handlePresetClick(color)}
                className="recent-color"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;