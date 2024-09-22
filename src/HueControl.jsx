// HueControl.js
import React from 'react';
import './HueControl.css'; // Add styles for the HueControl component

const HueControl = ({ hue, onHueChange }) => {
  return (
    <div className="hue-control">
      <label>Hue:</label>
      <input
        type="range"
        min="0"
        max="360"
        step="1"
        value={hue}
        onChange={onHueChange}
        className="hue-slider"
      />
      <span className="hue-percentage">
        {Math.round(hue)}°
      </span>
    </div>
  );
};

export default HueControl;
