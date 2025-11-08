import React, { useState } from 'react';
import { Color, ColorBlindnessType, simulateColorBlindness, getColorBlindnessInfo } from '../utils/colorUtils';
import ThemeToggle from './ThemeToggle';
import './LeftSidebar.css';

interface LeftSidebarProps {
  palette: Color[];
  cardSize: 'small' | 'medium' | 'large';
  onCardSizeChange: (size: 'small' | 'medium' | 'large') => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  palette,
  cardSize,
  onCardSizeChange
}) => {
  const [selectedBlindnessType, setSelectedBlindnessType] = useState<ColorBlindnessType>('deuteranomaly');

  const blindnessTypes: ColorBlindnessType[] = [
    'protanopia', 'deuteranopia', 'tritanopia', 'protanomaly',
    'deuteranomaly', 'tritanomaly', 'achromatopsia', 'achromatomaly'
  ];

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


      {/* Color Blindness Preview */}
      {palette.length > 0 && (
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
      )}

    </div>
  );
};

export default LeftSidebar;