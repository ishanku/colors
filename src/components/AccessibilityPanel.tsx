import React, { useState } from 'react';
import { Color, checkAccessibility, getContrastRatio, getBestContrastColor, generateAccessiblePalette } from '../utils/colorUtils';
import './AccessibilityPanel.css';

interface AccessibilityPanelProps {
  palette: Color[];
  onAddColors: (colors: Color[]) => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ palette, onAddColors }) => {
  const [selectedColor1, setSelectedColor1] = useState<string>(palette[0]?.hex || '#000000');
  const [selectedColor2, setSelectedColor2] = useState<string>('#ffffff');
  const [showMatrix, setShowMatrix] = useState(false);

  const contrastResult = checkAccessibility(selectedColor1, selectedColor2);

  const generateAccessibleColors = () => {
    if (palette.length > 0) {
      const baseColor = palette[0].hex;
      const accessibleColors = generateAccessiblePalette(baseColor, 5);
      onAddColors(accessibleColors);
    }
  };

  const renderContrastMatrix = () => {
    if (palette.length < 2) return null;

    return (
      <div className="contrast-matrix">
        <h4>Contrast Matrix</h4>
        <div className="matrix-grid">
          <div className="matrix-header">
            <div></div>
            {palette.map(color => (
              <div key={color.id} className="matrix-cell header">
                <div
                  className="color-preview"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              </div>
            ))}
          </div>
          {palette.map(color1 => (
            <div key={color1.id} className="matrix-row">
              <div className="matrix-cell header">
                <div
                  className="color-preview"
                  style={{ backgroundColor: color1.hex }}
                  title={color1.hex}
                />
              </div>
              {palette.map(color2 => {
                const ratio = getContrastRatio(color1.hex, color2.hex);
                const accessibility = checkAccessibility(color1.hex, color2.hex);

                return (
                  <div
                    key={color2.id}
                    className={`matrix-cell ratio ${accessibility.score}`}
                    title={`${ratio.toFixed(2)}:1 - ${accessibility.level}`}
                  >
                    {ratio.toFixed(1)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="matrix-legend">
          <div className="legend-item pass">
            <span className="legend-color"></span>
            Passes WCAG (4.5:1+)
          </div>
          <div className="legend-item fail">
            <span className="legend-color"></span>
            Fails WCAG (&lt;4.5:1)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="accessibility-panel">
      <div className="panel-header">
        <h3>♿ Accessibility</h3>
        <button
          className="toggle-matrix-btn"
          onClick={() => setShowMatrix(!showMatrix)}
        >
          {showMatrix ? 'Hide Matrix' : 'Show Matrix'}
        </button>
      </div>

      <div className="contrast-checker">
        <h4>Contrast Checker</h4>
        <div className="color-selectors">
          <div className="color-selector">
            <label>Foreground:</label>
            <select
              value={selectedColor1}
              onChange={(e) => setSelectedColor1(e.target.value)}
              className="color-select"
            >
              {palette.map(color => (
                <option key={color.id} value={color.hex}>
                  {color.name || color.hex}
                </option>
              ))}
            </select>
            <div
              className="color-preview-small"
              style={{ backgroundColor: selectedColor1 }}
            />
          </div>

          <div className="color-selector">
            <label>Background:</label>
            <input
              type="color"
              value={selectedColor2}
              onChange={(e) => setSelectedColor2(e.target.value)}
              className="color-input"
            />
            <input
              type="text"
              value={selectedColor2}
              onChange={(e) => setSelectedColor2(e.target.value)}
              className="hex-input-small"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="contrast-result">
          <div className="contrast-preview">
            <div
              className="preview-box"
              style={{
                backgroundColor: selectedColor2,
                color: selectedColor1
              }}
            >
              Sample Text
              <div className="preview-small">Small text example</div>
            </div>
          </div>

          <div className="contrast-info">
            <div className="ratio-display">
              <span className="ratio-number">{contrastResult.ratio.toFixed(2)}</span>
              <span className="ratio-text">:1</span>
            </div>
            <div className={`accessibility-level ${contrastResult.score}`}>
              <span className="level-badge">{contrastResult.level}</span>
              <span className="level-text">
                {contrastResult.score === 'pass' ? '✓ Passes' : '✗ Fails'} WCAG Guidelines
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="accessibility-actions">
        <button
          className="generate-accessible-btn"
          onClick={generateAccessibleColors}
          disabled={palette.length === 0}
        >
          Generate Accessible Palette
        </button>
        <div className="best-contrast">
          <span>Best contrast for {selectedColor2}: </span>
          <span
            className="best-color"
            style={{
              backgroundColor: getBestContrastColor(selectedColor2),
              color: selectedColor2,
              padding: '2px 6px',
              borderRadius: '3px',
              marginLeft: '4px'
            }}
          >
            {getBestContrastColor(selectedColor2)}
          </span>
        </div>
      </div>

      {showMatrix && renderContrastMatrix()}
    </div>
  );
};

export default AccessibilityPanel;