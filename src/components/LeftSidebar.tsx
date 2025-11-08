import React from 'react';
import './LeftSidebar.css';

interface LeftSidebarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClearPalette: () => void;
  onGenerateAccessible: () => void;
  canUndo: boolean;
  canRedo: boolean;
  paletteLength: number;
  cardSize: 'small' | 'medium' | 'large';
  onCardSizeChange: (size: 'small' | 'medium' | 'large') => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onUndo,
  onRedo,
  onClearPalette,
  onGenerateAccessible,
  canUndo,
  canRedo,
  paletteLength,
  cardSize,
  onCardSizeChange
}) => {

  return (
    <div className="left-sidebar">
      {/* Settings Panel */}
      <div className="console-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <div className="panel-icon">⚙️</div>
            Settings
          </h3>
        </div>

        <div className="settings-section">
          <div className="setting-group">
            <label className="setting-label">Card Size:</label>
            <div className="size-buttons">
              {(['small', 'medium', 'large'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => onCardSizeChange(size)}
                  className={`console-btn size-btn ${cardSize === size ? 'active' : ''}`}
                >
                  {size.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
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

    </div>
  );
};

export default LeftSidebar;