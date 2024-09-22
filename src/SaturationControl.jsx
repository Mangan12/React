// SaturationControl.js
import React from 'react';
import './SaturationControl.css'; // Ensure you have this CSS file for styling

const SaturationControl = ({ saturation, onSaturationChange }) => {
  const handleChange = (event) => {
    const value = event.target.value;
    onSaturationChange(value);
  };

  return (
    <div className="saturation-control">
      <label htmlFor="saturation-slider">Saturation:</label>
      <input
        id="saturation-slider"
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={saturation}
        onChange={handleChange}
        className="slider"
      />
      <div className="percentage-display">
        {Math.round(saturation * 100)}%
      </div>
    </div>
  );
};

export default SaturationControl;
