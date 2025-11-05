import React, { useState } from 'react';
import { Color, ColorBlindnessType, simulateColorBlindness, getColorBlindnessInfo } from '../utils/colorUtils';
import './ColorBlindnessSimulator.css';

interface ColorBlindnessSimulatorProps {
  palette: Color[];
}

const ColorBlindnessSimulator: React.FC<ColorBlindnessSimulatorProps> = ({ palette }) => {
  const [selectedType, setSelectedType] = useState<ColorBlindnessType>('deuteranomaly');
  const [showComparison, setShowComparison] = useState(true);

  const blindnessTypes: ColorBlindnessType[] = [
    'protanopia',
    'deuteranopia',
    'tritanopia',
    'protanomaly',
    'deuteranomaly',
    'tritanomaly',
    'achromatopsia',
    'achromatomaly'
  ];

  const selectedInfo = getColorBlindnessInfo(selectedType);

  const renderPaletteView = (colors: Color[], title: string, className: string) => (
    <div className={`palette-view ${className}`}>
      <h4>{title}</h4>
      <div className="color-grid">
        {colors.map((color, index) => (
          <div key={index} className="color-sample">
            <div
              className="color-swatch"
              style={{ backgroundColor: color.hex }}
              title={color.hex}
            />
            <div className="color-info">
              <div className="color-name">{color.name || `Color ${index + 1}`}</div>
              <div className="color-hex">{color.hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const simulatedPalette = palette.map(color => ({
    ...color,
    hex: simulateColorBlindness(color.hex, selectedType)
  }));

  if (palette.length === 0) {
    return (
      <div className="colorblindness-simulator">
        <div className="panel-header">
          <h3>👁️ Color Blindness Simulator</h3>
        </div>
        <div className="empty-message">
          Add colors to your palette to see how they appear with different types of color blindness.
        </div>
      </div>
    );
  }

  return (
    <div className="colorblindness-simulator">
      <div className="panel-header">
        <h3>👁️ Color Blindness Simulator</h3>
        <button
          className="toggle-comparison-btn"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide Comparison' : 'Show Comparison'}
        </button>
      </div>

      <div className="controls">
        <div className="type-selector">
          <label htmlFor="blindness-type">Color Vision Type:</label>
          <select
            id="blindness-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ColorBlindnessType)}
            className="type-dropdown"
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

        <div className="type-info">
          <div className="info-item">
            <strong>{selectedInfo.name}</strong>
          </div>
          <div className="info-item description">
            {selectedInfo.description}
          </div>
          <div className="info-item prevalence">
            Affects {selectedInfo.prevalence}
          </div>
        </div>
      </div>

      <div className={`simulation-content ${showComparison ? 'comparison-mode' : 'single-mode'}`}>
        {showComparison ? (
          <div className="comparison-view">
            {renderPaletteView(palette, 'Normal Vision', 'normal-view')}
            {renderPaletteView(simulatedPalette, `${selectedInfo.name} Vision`, 'simulated-view')}
          </div>
        ) : (
          <div className="single-view">
            {renderPaletteView(simulatedPalette, `${selectedInfo.name} Vision`, 'simulated-view')}
          </div>
        )}
      </div>

      <div className="accessibility-note">
        <strong>Note:</strong> This simulation provides an approximation of how colors might appear to people with different types of color vision deficiencies.
        Individual experiences may vary. Consider using high contrast and multiple visual cues beyond color for better accessibility.
      </div>
    </div>
  );
};

export default ColorBlindnessSimulator;