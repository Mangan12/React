import CropControl from "./CropControl";
import HueControl from "./HueControl";
import Palette from "./Palette";
import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faCrop } from "@fortawesome/free-solid-svg-icons";
import UTIF from "utif";
import "./ColorPicker.css";
import LayersPanel from "./LayersPanel";
// import { useNavigate } from "react-router-dom";

const ColorPicker = () => {
  const [image, setImage] = useState(null);
  const [color, setColor] = useState("#fff");
  const [overlayColor, setOverlayColor] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropInProgress, setCropInProgress] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saturation, setSaturation] = useState(1); // Default saturation level
  const [hue, setHue] = useState(0); // Default hue level
  const [previewImage, setPreviewImage] = useState(null); // For real-time preview of saturation

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name here
      const reader = new FileReader();
      reader.onloadend = () => {
        if (
          file.name.toLowerCase().endsWith(".tif") ||
          file.name.toLowerCase().endsWith(".tiff")
        ) {
          handleTiffFile(reader.result)        } else {
          setImage(reader.result);
          setPreviewImage(reader.result); // Set the preview image to the original image
        }
      };
      if (
        file.name.toLowerCase().endsWith(".tif") ||
        file.name.toLowerCase().endsWith(".tiff")
      ) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const [imageLayers, setImageLayers] = useState([]);
  const handleTiffFile = (arrayBuffer) => {
    const ifds = UTIF.decode(arrayBuffer);
    console.log(ifds[0].width, ifds[0].height, ifds[0]);
    const layers = [];
    console.log(ifds)
    ifds.forEach((ifd, index) => {
      UTIF.decodeImage(arrayBuffer, ifd); // Decode each layer/image
      const rgba = UTIF.toRGBA8(ifd); // Convert to RGBA
      console.log(rgba)
      const canvas = document.createElement('canvas');
      canvas.width = ifd.width;
      canvas.height = ifd.height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      imageData.data.set(rgba);
      ctx.putImageData(imageData, 0, 0);

      layers.push({
        id: index,
        width: ifd.width,
        height: ifd.height,
        dataUrl: canvas.toDataURL(),
      });
    });

    setImageLayers(layers);
    UTIF.decodeImage(arrayBuffer, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]);

    const canvas = document.createElement("canvas");
    canvas.width = ifds[0].width;
    canvas.height = ifds[0].height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    imageData.data.set(rgba);
    ctx.putImageData(imageData, 0, 0);

    setImage(canvas.toDataURL());
    setPreviewImage(canvas.toDataURL());
  };
  

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    setOverlayColor(
      `rgba(${newColor.rgb.r}, ${newColor.rgb.g}, ${newColor.rgb.b}, 0.5)`
    );
  };

  useEffect(() => {
    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          let [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
          s *= saturation;
          h += hue / 360; // Adjust hue
          if (h > 1) h -= 1;
          const [r, g, b] = hsvToRgb(h, s, v);
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }

        ctx.putImageData(imageData, 0, 0);
        setPreviewImage(canvas.toDataURL());
      };
    }
  }, [saturation, hue, image]);

  const handleHueChange = (event) => {
    setHue(event.target.value);
  };

  const handleSave = () => {
    if (previewImage && overlayColor) {
      const img = document.createElement("img");
      img.src = previewImage; // Use the preview image with adjusted saturation
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        // Draw the original image with adjusted saturation
        ctx.drawImage(img, 0, 0);

        // Remove existing overlay (if any) by using globalCompositeOperation
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Apply the new color overlay
        ctx.globalCompositeOperation = "multiply";
        const [r, g, b] = overlayColor.match(/\d+/g).map(Number); // Extract RGB values from overlayColor
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update the image with the new color and saturation
        setImage(canvas.toDataURL());
        setPreviewImage(canvas.toDataURL()); // Update the preview image
        setOverlayColor(null); // Reset overlay color if needed
      };
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    setCropInProgress(true);
  };

  const getCroppedImg = async () => {
    if (image && croppedAreaPixels) {
      const canvas = document.createElement("canvas");
      const img = document.createElement("img");
      img.src = image;

      const { width, height, x, y } = croppedAreaPixels;
      img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        const croppedImg = canvas.toDataURL();
        setImage(croppedImg);
        setPreviewImage(croppedImg); // Update preview image after cropping
        setCropInProgress(false);
        setShowCropper(false);
      };
    }
  };

  const handleSaturationChange = (event) => {
    setSaturation(event.target.value);
  };
  const [fileName, setFileName] = useState(""); // Added state for file name

  const handleChangeFile = () => {
    document.getElementById("image-upload").click();
  };

  // const navigate = useNavigate();
  // const handleButtonClick = () => {
  //   navigate("/color-palette-extractor");
  // };
  // const [extractedImages, setExtractedImages] = useState([]); // State to hold extracted images

  return (
    <div className="color-picker-page">
      <div className=".color-picker-container">
        <h2>Extracted Layers:</h2>
        {imageLayers.length > 0 ? (
          imageLayers.map((layer) => (
            <div key={layer.id} className="layer">
              <strong>Layer {layer.id + 1}</strong>
              <img src={layer.dataUrl} alt={`Layer ${layer.id}`} />
            </div>
          ))
        ) : (
          <p>No layers found.</p>
        )}
      </div>
      <div className="generate">
        <h2 style={{ flex: 1, textAlign: "center" }}>Image Color Picker</h2>
      </div>

      <div className="image-container">
        <div className="image-wrapper">
          {image ? (
            showCropper ? (
              <CropControl
                image={image}
                onCropComplete={onCropComplete}
                onCropImage={getCroppedImg}
              />
            ) : (
              <div className="image-overlay-wrapper">
                <img
                  src={previewImage || image}
                  alt="Uploaded"
                  className="uploaded-image"
                />
                <div
                  className="image-overlay"
                  style={{ backgroundColor: overlayColor }}
                ></div>
              </div>
            )
          ) : (
            <div className="upload-placeholder">
              <input
                type="file"
                accept="image/*,.tif,.tiff"
                id="image-upload"
                onChange={handleImageUpload}
                className="upload-input"
              />
              <FontAwesomeIcon
                icon={faUpload}
                className="upload-icon-large"
                onClick={() => document.getElementById("image-upload").click()}
              />
              <span> Upload an Image</span>
            </div>
          )}
        </div>
      </div>

      <div className="controls-container">
        {image && (
          <>
            <button
              className="control-toggle"
              onClick={() => setShowCropper(!showCropper)}
            >
              <FontAwesomeIcon icon={faCrop} className="control-icon" />
              {showCropper ? "Cancel Crop" : "Crop Image"}
            </button>
          </>
        )}

        {overlayColor && (
          <button className="control-save" onClick={handleSave}>
            Save
          </button>
        )}

        {showCropper && (
          <button
            className="apply-crop-button"
            onClick={getCroppedImg}
            disabled={!croppedAreaPixels}
          >
            Apply Crop
          </button>
        )}
      </div>

      <div className="color-picker-container">
        <div className="color-picker-section">
          <h3>Color Picker</h3>
          <SketchPicker color={color} onChangeComplete={handleColorChange} />
        </div>
        {image && (
          <div className="color-controls-container">
            <div className="saturation-control">
              <label>Saturation:</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={saturation}
                onChange={handleSaturationChange}
                className="saturation-slider"
              />
              <span className="saturation-percentage">
                {Math.round(saturation * 100 - 100)}%
              </span>
            </div>
            <HueControl hue={hue} onHueChange={handleHueChange} />
            <LayersPanel/>
          </div>
        )}
      </div>
      <Palette />

      {image && (
        <div className="upload-container">
          <input
            type="file"
            accept="image/*,.tif,.tiff"
            id="image-upload"
            onChange={handleImageUpload}
          />
          {fileName && (
            <div className="file-info">
              <span>File: {fileName} </span>
              <a href="#" onClick={handleChangeFile}>
                Change File
              </a>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};

// Helper functions to convert between RGB and HSV
const rgbToHsv = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h,
    s,
    v = max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  s = max === 0 ? 0 : delta / max;

  return [h, s, v];
};

const hsvToRgb = (h, s, v) => {
  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      break;
  }

  return [r * 255, g * 255, b * 255];
};

export default ColorPicker;
