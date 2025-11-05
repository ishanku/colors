import React, { useState } from 'react';
import { Color, convertColor, getContrastColor, isValidHex } from '../utils/colorUtils';
import './ColorCard.css';

interface ColorCardProps {
  color: Color;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'console';
  onUpdate: (id: string, updates: Partial<Color>) => void;
  onRemove: (id: string) => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, size = 'medium', variant = 'default', onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHex, setTempHex] = useState(color.hex);
  const [tempName, setTempName] = useState(color.name || '');

  const colorFormats = convertColor(color.hex);
  const textColor = getContrastColor(color.hex);

  const handleSave = () => {
    if (isValidHex(tempHex)) {
      onUpdate(color.id, { hex: tempHex.toUpperCase(), name: tempName });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempHex(color.hex);
    setTempName(color.name || '');
    setIsEditing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`color-card size-${size} variant-${variant}`} style={{ backgroundColor: color.hex }}>
      <div className="color-card-content" style={{ color: textColor }}>
        <button
          className="remove-btn"
          onClick={() => onRemove(color.id)}
          style={{ color: textColor }}
        >
          ×
        </button>

        {isEditing ? (
          <div className="edit-mode">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Color name"
              className="name-input"
            />
            <input
              type="text"
              value={tempHex}
              onChange={(e) => setTempHex(e.target.value)}
              className="hex-input"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
            <div className="edit-buttons">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="view-mode" onClick={() => setIsEditing(true)}>
            <h3 className="color-name">{color.name || 'Unnamed'}</h3>
            <div className="color-formats">
              <div className="format-item" onClick={(e) => { e.stopPropagation(); copyToClipboard(colorFormats.hex); }}>
                <span className="format-label">HEX:</span>
                <span className="format-value">{colorFormats.hex}</span>
              </div>
              <div className="format-item" onClick={(e) => { e.stopPropagation(); copyToClipboard(colorFormats.rgb); }}>
                <span className="format-label">RGB:</span>
                <span className="format-value">{colorFormats.rgb}</span>
              </div>
              <div className="format-item" onClick={(e) => { e.stopPropagation(); copyToClipboard(colorFormats.hsl); }}>
                <span className="format-label">HSL:</span>
                <span className="format-value">{colorFormats.hsl}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorCard;