import React from 'react';
import { Color } from '../utils/colorUtils';
import ColorCard from './ColorCard';
import './MainConsole.css';

interface MainConsoleProps {
  palette: Color[];
  paletteName: string;
  setPaletteName: (name: string) => void;
  cardSize: 'small' | 'medium' | 'large';
  onUpdateColor: (id: string, updates: Partial<Color>) => void;
  onRemoveColor: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

const MainConsole: React.FC<MainConsoleProps> = ({
  palette,
  paletteName,
  setPaletteName,
  cardSize,
  onUpdateColor,
  onRemoveColor,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportPDF,
  onExportCSV
}) => {
  return (
    <div className="main-console">
      {/* Console Screen Header */}
      <div className="console-screen-header">
        <div className="palette-name-section">
          <label htmlFor="palette-name" className="console-label">
            PALETTE.NAME &gt;
          </label>
          <input
            id="palette-name"
            type="text"
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            className="console-input palette-name-input"
            placeholder="Enter palette name..."
          />
        </div>

        {/* Control Actions */}
        <div className="control-actions">
          <div className="action-group undo-redo-group">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="console-btn action-btn"
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="console-btn action-btn"
              title="Redo (Ctrl+Y)"
            >
              ↷
            </button>
          </div>
          <div className="action-group export-group">
            <button
              onClick={onExportPDF}
              disabled={palette.length === 0}
              className="console-btn action-btn"
              title="Export as PDF"
            >
              📄
            </button>
            <button
              onClick={onExportCSV}
              disabled={palette.length === 0}
              className="console-btn action-btn"
              title="Export as CSV"
            >
              📊
            </button>
            <button
              disabled={palette.length === 0}
              className="console-btn action-btn"
              title="Share Palette"
            >
              🔗
            </button>
            <button
              className="console-btn action-btn"
              title="Import Palette"
            >
              📥
            </button>
          </div>
        </div>

        <div className="console-status">
          <div className="status-item">
            <span className="status-label">COLORS:</span>
            <span className="status-value">{palette.length.toString().padStart(2, '0')}</span>
          </div>
          <div className="status-item">
            <span className="status-label">STATUS:</span>
            <span className="status-value online">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Palette Display */}
      <div className="console-screen">
        <div className="screen-border">
          {palette.length > 0 ? (
            <div className={`palette-grid console-grid size-${cardSize}`}>
              {palette.map(color => (
                <ColorCard
                  key={color.id}
                  color={color}
                  size={cardSize}
                  onUpdate={onUpdateColor}
                  onRemove={onRemoveColor}
                  variant="console"
                />
              ))}
            </div>
          ) : (
            <div className="empty-console">
              <div className="empty-icon">🎨</div>
              <div className="empty-title">CONSOLE READY</div>
              <div className="empty-subtitle">
                Initialize your color palette using the controls on the left
              </div>
              <div className="empty-prompt">
                &gt; ADD_COLOR() to begin_
              </div>
            </div>
          )}
        </div>

        {/* Console Footer */}
        <div className="console-footer">
          <div className="footer-left">
            <span className="footer-text">SYSTEM: COLOR_PALETTE_BUILDER_V2.0</span>
          </div>
          <div className="footer-right">
            <span className="footer-text">
              {new Date().toLocaleTimeString()} |
              MEMORY: {(palette.length * 24).toString().padStart(3, '0')}KB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainConsole;