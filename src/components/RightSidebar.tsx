import React from 'react';
import { isValidHex } from '../utils/colorUtils';
import './RightSidebar.css';

interface RightSidebarProps {
  newColorHex: string;
  setNewColorHex: (color: string) => void;
  onAddColor: () => void;
  onAddRandomColor: () => void;
  onOpenAdvancedPicker: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  newColorHex,
  setNewColorHex,
  onAddColor,
  onAddRandomColor,
  onOpenAdvancedPicker
}) => {

  return (
    <div className="right-sidebar">
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
              ➕ Add Color
            </button>
            <button
              onClick={onAddRandomColor}
              className="console-btn"
            >
              🎲 Random
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
    </div>
  );
};

export default RightSidebar;