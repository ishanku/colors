import React from 'react';
import { useTheme, Theme } from '../hooks/useTheme';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();

  const getThemeIcon = (themeValue: Theme) => {
    switch (themeValue) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '☀️';
    }
  };

  const getThemeLabel = (themeValue: Theme) => {
    switch (themeValue) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'auto':
        return 'Auto';
      default:
        return 'Light';
    }
  };

  return (
    <div className="theme-toggle">
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        title={`Current: ${getThemeLabel(theme)} (${effectiveTheme}). Click to cycle through themes.`}
        aria-label={`Switch theme. Current: ${getThemeLabel(theme)}`}
      >
        <span className="theme-icon">{getThemeIcon(theme)}</span>
        <span className="theme-label">{getThemeLabel(theme)}</span>
      </button>

      <div className="theme-dropdown">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="theme-select"
          aria-label="Select theme"
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
          <option value="auto">🔄 Auto</option>
        </select>
      </div>
    </div>
  );
};

export default ThemeToggle;