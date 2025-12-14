import React from 'react';
import ColorPaletteBuilderConsole from './components/ColorPaletteBuilderConsole';
import { useTheme } from './hooks/useTheme';
import './App.css';
import './styles/themes.css';

function App() {
  // Initialize theme system
  useTheme();

  return (
    <div className="App">
      <ColorPaletteBuilderConsole />
    </div>
  );
}

export default App;
