import React, { useState } from 'react';
import { Color, isValidHex, checkAccessibility } from '../utils/colorUtils';
import './RightSidebar.css';

interface RightSidebarProps {
  palette: Color[];
  newColorHex: string;
  setNewColorHex: (color: string) => void;
  onAddColor: () => void;
  onAddRandomColor: () => void;
  onOpenAdvancedPicker: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  palette,
  newColorHex,
  setNewColorHex,
  onAddColor,
  onAddRandomColor,
  onOpenAdvancedPicker
}) => {
  const [selectedContrastColors, setSelectedContrastColors] = useState<{ fg: string; bg: string }>({
    fg: palette[0]?.hex || '#000000',
    bg: '#FFFFFF'
  });

  // Common background colors for accessibility testing
  const commonBackgrounds = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Light Gray', hex: '#F5F5F5' },
    { name: 'Medium Gray', hex: '#9CA3AF' },
    { name: 'Dark Gray', hex: '#374151' },
    { name: 'Black', hex: '#000000' },
    ...palette.map(color => ({ name: color.name || color.hex, hex: color.hex }))
  ];

  const getAccessibilityScore = () => {
    if (palette.length < 2) return 0;
    let passCount = 0;
    let totalChecks = 0;

    for (let i = 0; i < palette.length; i++) {
      for (let j = i + 1; j < palette.length; j++) {
        const result = checkAccessibility(palette[i].hex, palette[j].hex);
        if (result.score === 'pass') passCount++;
        totalChecks++;
      }
    }

    return totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : 0;
  };

  const accessibilityScore = getAccessibilityScore();
  const contrastResult = checkAccessibility(selectedContrastColors.fg, selectedContrastColors.bg);

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

      {/* Accessibility Analysis */}
      {palette.length > 0 && (
        <div className="console-panel">
          <div className="panel-header">
            <h3 className="panel-title">
              <div className="panel-icon">♿</div>
              Accessibility
            </h3>
          </div>

          <div className="accessibility-section">
            <div className="score-display">
              <div className="score-circle">
                <div className="score-value">{accessibilityScore}%</div>
                <div className="score-label">WCAG Score</div>
              </div>
            </div>

            <div className="contrast-checker">
              <label className="setting-label">Quick Contrast Check:</label>
              <div className="contrast-inputs">
                <div className="contrast-row">
                  <label className="contrast-label">Text Color:</label>
                  <select
                    value={selectedContrastColors.fg}
                    onChange={(e) => setSelectedContrastColors(prev => ({ ...prev, fg: e.target.value }))}
                    className="console-input contrast-select"
                  >
                    {palette.map(color => (
                      <option key={color.id} value={color.hex}>
                        {color.name || color.hex}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="contrast-row">
                  <label className="contrast-label">Background:</label>
                  <select
                    value={selectedContrastColors.bg}
                    onChange={(e) => setSelectedContrastColors(prev => ({ ...prev, bg: e.target.value }))}
                    className="console-input contrast-select"
                  >
                    {commonBackgrounds.map((bg, index) => (
                      <option key={index} value={bg.hex}>
                        {bg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="contrast-preview">
                <div
                  className="contrast-sample"
                  style={{
                    backgroundColor: selectedContrastColors.bg,
                    color: selectedContrastColors.fg
                  }}
                >
                  Sample Text
                </div>
              </div>
              <div className={`contrast-result ${contrastResult.score}`}>
                <span className="ratio">{contrastResult.ratio.toFixed(2)}:1</span>
                <span className="level">{contrastResult.level}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;