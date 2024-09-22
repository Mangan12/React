// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ColorPaletteExtractor from './ColorPaletteExtractor'; // Import the component
import ColorPicker from './ColorPicker';
import Home from './Home';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/color-picker">Color Picker</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/color-palette-extractor" element={<ColorPaletteExtractor />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
