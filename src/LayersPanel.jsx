import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid';
import './LayersPanel.css'; // Import the external CSS file

const LayersPanel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isSwatchesVisible, setIsSwatchesVisible] = useState(false); // Toggle state for Swatches
  const toggleSwatches = () => {
    setIsSwatchesVisible(!isSwatchesVisible); // Toggle visibility
  };
  return (
    <div className="panel-container">
      {/* Upper Section */}
      <div className="upper-section">
        {/* History & Swatches */}
        <div className="history-swatches">
          <h2 className="section-header">History</h2>
          <h2 className="section-header" onClick={toggleSwatches}>Swatches</h2>
        </div>
        {/* Swatches Color Palette */}
        {isSwatchesVisible && (
          <div className="swatches-palette">
            <div className="color-box2" style={{ backgroundColor: 'black' }}></div>
            <div className="color-box2" style={{ backgroundColor: 'red' }}></div>
            <div className="color-box2" style={{ backgroundColor: 'green' }}></div>
            <div className="color-box2" style={{ backgroundColor: 'blue' }}></div>
            <div className="color-box2" style={{ backgroundColor: 'cyan' }}></div>
            <div className="color-box2" style={{ backgroundColor: 'magenta' }}></div>
            <div className="color-box2" style={{ backgroundColor: 'yellow' }}></div>
            <div className="color-box2" style={{ backgroundColor: 'gray' }}></div>
            <div className="color-box2" style={{ backgroundColor: 'white' }}></div>
          </div>
        )}
        <div className="placeholder"></div>

        {/* Open Button */}
        {/* <button className="panel-button">Open</button> */}
      </div>

      {/* Lower Section */}
      <div className="lower-section">
        {/* Tabs: Layers, Channels, Paths */}
        <div className="tabs">
          <button className="tab-button active-tab">Layers</button>
          <button className="tab-button">Channels</button>
          <button className="tab-button">Paths</button>
        </div>

        {/* Layer Panel */}
        <div className="layer-panel">
          {/* Layer Info */}
          <div className="layer-info">
            {/* Left Side */}
            <div className="left-side">
              <select className="dropdown">
                <option>Normal</option>
              </select>
              <div className="text">Opacity:</div>
              <input
                type="text"
                value="100%"
                readOnly
                className="input"
              />
            </div>

            {/* Lock & Fill */}
            <div className="right-side">
              <div className="icon-group">
                <button onClick={() => setIsLocked(!isLocked)} className="icon-button">
                  {isLocked ? (
                    <LockClosedIcon className="icon" />
                  ) : (
                    <LockOpenIcon className="icon" />
                  )}
                </button>
              </div>

              <div className="icon-group">
                <div className="text">Fill:</div>
                <input
                  type="text"
                  value="100%"
                  readOnly
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Layers List */}
          <div className="layer-item">
            <div className="left-side">
              <button onClick={() => setIsVisible(!isVisible)} className="icon-button">
                {isVisible ? (
                  <EyeIcon className="icon" />
                ) : (
                  <EyeOffIcon className="icon icon-inactive" />
                )}
              </button>
              <span className="layer-name">Background</span>
            </div>

            <div className="text">100%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;
