// src/CropControl.js

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './CropControl.css';

const CropControl = ({ image, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    onCropComplete(croppedArea, croppedAreaPixels);
  }, [onCropComplete]);

  return (
    <div className="crop-container">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={4 / 3} // You can adjust the aspect ratio as needed
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
      />
      <div className="slider-container">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
          className="zoom-slider"
        />
      </div>
    </div>
  );
};

export default CropControl;
