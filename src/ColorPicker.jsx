import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFilter, faCrop } from '@fortawesome/free-solid-svg-icons';
import UTIF from 'utif';
import SaturationControl from './SaturationControl';
import HueControl from './HueControl';
import CropControl from './CropControl';
import './ColorPicker.css';

const ColorPicker = () => {
  const [image, setImage] = useState(null);
  const [color, setColor] = useState('#fff');
  const [overlayColor, setOverlayColor] = useState('rgba(0, 0, 0, 0)');
  const [showPicker, setShowPicker] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')) {
          handleTiffFile(reader.result);
        } else {
          setImage(reader.result);
        }
      };
      if (file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleTiffFile = (arrayBuffer) => {
    const ifds = UTIF.decode(arrayBuffer);
    UTIF.decodeImage(arrayBuffer, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]);

    const canvas = document.createElement('canvas');
    canvas.width = ifds[0].width;
    canvas.height = ifds[0].height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    imageData.data.set(rgba);
    ctx.putImageData(imageData, 0, 0);

    setImage(canvas.toDataURL());
  };

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    setOverlayColor(`rgba(${newColor.rgb.r}, ${newColor.rgb.g}, ${newColor.rgb.b}, 0.5)`);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = async () => {
    if (image && croppedAreaPixels) {
      const canvas = document.createElement('canvas');
      const img = document.createElement('img');
      img.src = image;

      const { width, height, x, y } = croppedAreaPixels;
      img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        const croppedImg = canvas.toDataURL();
        setImage(croppedImg);  // Set the cropped image
        setShowCropper(false);
      };
    }
  };

  return (
    <div className="color-picker-page">
      <h1>Image Color Picker</h1>

      <div className="upload-container">
        <input
          type="file"
          accept="image/*,.tif,.tiff"
          id="image-upload"
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload" className="upload-label">
          <FontAwesomeIcon icon={faUpload} className="upload-icon" />
          <span>Upload Image (including .tif)</span>
        </label>
      </div>

      {image && (
        <div className="image-container">
          <div className="image-wrapper">
            {showCropper ? (
              <CropControl
                image={image}
                onCropComplete={onCropComplete}
                onCropImage={getCroppedImg}
              />
            ) : (
              <>
                <div className="image-overlay-wrapper">
                  <img src={image} alt="Uploaded" className="uploaded-image" />
                  <div className="image-overlay" style={{ backgroundColor: overlayColor }}></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="controls-container">
        <button
          className="control-toggle"
          onClick={() => setShowControls(!showControls)}
        >
          <FontAwesomeIcon icon={faFilter} className="control-icon" />
          {showControls ? 'Hide Filters' : 'Show Filters'}
        </button>

        <button
          className="control-toggle"
          onClick={() => setShowCropper(!showCropper)}
        >
          <FontAwesomeIcon icon={faCrop} className="control-icon" />
          {showCropper ? 'Cancel Crop' : 'Crop Image'}
        </button>
      </div>

      {showCropper && (
        <div className="cropper-controls">
          <button className="control-toggle" onClick={getCroppedImg}>
            Apply Crop
          </button>
        </div>
      )}

      {showControls && (
        <div className="color-picker-container">
          <div className="color-picker-section">
            <h3>Color Picker</h3>
            <SketchPicker color={color} onChangeComplete={handleColorChange} />
          </div>
          <div className="color-picker-section">
            <h3>Saturation Control</h3>
            <SaturationControl color={color} onColorChange={handleColorChange} />
          </div>
          <div className="color-picker-section">
            <h3>Hue Control</h3>
            <HueControl color={color} onColorChange={handleColorChange} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
