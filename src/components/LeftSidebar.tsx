import React, { useState } from 'react';
import { Color, ColorBlindnessType, simulateColorBlindness, getColorBlindnessInfo, checkAccessibility } from '../utils/colorUtils';
import ThemeToggle from './ThemeToggle';
import './LeftSidebar.css';

interface LeftSidebarProps {
  palette: Color[];
  paletteName: string;
  onClearPalette: () => void;
  onGenerateAccessible: () => void;
  paletteLength: number;
  cardSize: 'small' | 'medium' | 'large';
  onCardSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  palette,
  paletteName,
  onClearPalette,
  onGenerateAccessible,
  paletteLength,
  cardSize,
  onCardSizeChange,
  onExportPDF,
  onExportCSV
}) => {
  const [selectedBlindnessType, setSelectedBlindnessType] = useState<ColorBlindnessType>('deuteranomaly');
  const [selectedContrastColors, setSelectedContrastColors] = useState<{ fg: string; bg: string }>({
    fg: palette[0]?.hex || '#000000',
    bg: '#FFFFFF'
  });

  const blindnessTypes: ColorBlindnessType[] = [
    'protanopia', 'deuteranopia', 'tritanopia', 'protanomaly',
    'deuteranomaly', 'tritanomaly', 'achromatopsia', 'achromatomaly'
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

          <div className="setting-group">
            <label className="setting-label">Theme:</label>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Palette Operations */}
      <div className="console-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <div className="panel-icon">🛠️</div>
            Palette Operations
          </h3>
        </div>

        <div className="operations-grid">
          <button
            onClick={onClearPalette}
            className="console-btn danger"
            disabled={paletteLength === 0}
          >
            🗑️ Clear All
          </button>
          <button
            onClick={onGenerateAccessible}
            className="console-btn success"
            disabled={paletteLength === 0}
          >
            ♿ Accessible
          </button>
        </div>
      </div>

      {/* Accessibility Analysis */}
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
              <input
                type="color"
                value={selectedContrastColors.bg}
                onChange={(e) => setSelectedContrastColors(prev => ({ ...prev, bg: e.target.value }))}
                className="console-color-picker small"
              />
            </div>
            <div className={`contrast-result ${contrastResult.score}`}>
              <span className="ratio">{contrastResult.ratio.toFixed(2)}:1</span>
              <span className="level">{contrastResult.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Blindness Preview */}
      <div className="console-panel">
        <div className="panel-header">
          <h3 className="panel-title">
            <div className="panel-icon">👁️</div>
            Vision Simulation
          </h3>
        </div>

        <div className="vision-section">
          <div className="blindness-selector">
            <select
              value={selectedBlindnessType}
              onChange={(e) => setSelectedBlindnessType(e.target.value as ColorBlindnessType)}
              className="console-input"
            >
              {blindnessTypes.map(type => {
                const info = getColorBlindnessInfo(type);
                return (
                  <option key={type} value={type}>
                    {info.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="vision-preview">
            {palette.slice(0, 6).map((color, index) => (
              <div key={index} className="vision-color-pair">
                <div
                  className="color-sample original"
                  style={{ backgroundColor: color.hex }}
                  title={`Original: ${color.hex}`}
                />
                <div
                  className="color-sample simulated"
                  style={{ backgroundColor: simulateColorBlindness(color.hex, selectedBlindnessType) }}
                  title={`${getColorBlindnessInfo(selectedBlindnessType).name}: ${simulateColorBlindness(color.hex, selectedBlindnessType)}`}
                />
              </div>
            ))}
          </div>

          <div className="vision-info">
            <div className="info-text">
              {getColorBlindnessInfo(selectedBlindnessType).description}
            </div>
            <div className="prevalence">
              Affects {getColorBlindnessInfo(selectedBlindnessType).prevalence}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LeftSidebar;