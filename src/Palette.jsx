import React, { useState } from "react";
import "./Palette.css";
import { SketchPicker } from "react-color";

function Palette() {
  const [colors, setColors] = useState(generateInitialColors(5));
  const [selectedColor, setSelectedColor] = useState(null); // Track selected color index
  const [colorPickerVisible, setColorPickerVisible] = useState(false); // Control the visibility of SketchPicker
  var mixedColor;

  // Function to generate random hex color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    console.log(color)
    return color;
  }
  // Generate an initial palette of 5 colors
  function generateInitialColors(num) {
    const colorArray = [];
    for (let i = 0; i < num; i++) {
      colorArray.push({ color: getRandomColor(), locked: false });
    }
     // Extract the 'color' property from each object in the array
    const colors1 = colorArray.map(colorObj => colorObj.color);
    mixedColor = mixColors(colors1)
    console.log(mixedColor)
    return colorArray;
  }

  // Function to add a new color to the palette
  function addColor() {
    if (colors.length < 10) {
      // Restrict the maximum number of colors to 10
      const newColors = [...colors, { color: getRandomColor(), locked: false }];
      setColors(newColors);
    }
    // Call the function to get the mixture of colors
    
  }
  // Function to convert hex color to RGB
function hexToRgb(hex) {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
}

// Function to convert RGB to hex color
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Function to calculate the average of the RGB components
function mixColors(colors1) {
  console.log(colors1.length)
  let totalR = 0, totalG = 0, totalB = 0;
  
  colors1.forEach(color => {
      let [r, g, b] = hexToRgb(color);
      totalR += r;
      totalG += g;
      totalB += b;
  });
  
  let avgR = Math.round(totalR / colors1.length);
  let avgG = Math.round(totalG / colors1.length);
  let avgB = Math.round(totalB / colors1.length);
  
  return rgbToHex(avgR, avgG, avgB);
}

  // Function to remove a color from the palette
  function removeColor() {
    if (colors.length > 2) {
      // Restrict the minimum number of colors to 2
      setColors(colors.slice(0, -1));
    }
  }

  

  function shuffleColors() {
    let shuffledColors;
    do {
      shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    } while (JSON.stringify(shuffledColors) === JSON.stringify(colors));
    setColors(shuffledColors);
  }

  const handleColorBoxClick = (index) => {
    setSelectedColor(index); // Select the color box
    setColorPickerVisible(true); // Show color picker
  };

  const handleColorChange = (newColor) => {
    const updatedColors = colors.map((colorObj, index) =>
      index === selectedColor ? { color: newColor.hex } : colorObj
    );
    setColors(updatedColors); // Update the selected color box with new color
  };
  return (
    <div className="palette-container">
       {/* Display the mixed color box */}
       <div className="mixed-color-box" style={{ backgroundColor: mixedColor}}>
        {/* You can add content here if needed */}
      </div>
      <div className="palette">
        {colors.map((colorObj, index) => (
          <div
            key={index}
            className={`color-box ${index === selectedColor ? "selected" : ""}`}
            style={{ backgroundColor: colorObj.color }}
            onClick={() => handleColorBoxClick(index)} // Trigger color picker on click
          />
        ))}
      </div>
      <div className="buttons">
        <button className="add-color" onClick={addColor}>
          +
        </button>
        <button className="remove-color" onClick={removeColor}>
          -
        </button>
      </div>
      <div className="buttons">
        <button className="shuffle-color" onClick={shuffleColors}>
          ⟳
        </button>
      </div>
      {colorPickerVisible && (
        <div className="color-picker-popover">
          <SketchPicker
            color={colors[selectedColor].color}
            onChange={handleColorChange}
          />
          <button
            onClick={() => {
              setColorPickerVisible(false);
              setSelectedColor(null);
            }}
          >
            Close
          </button>{" "}
        </div>
      )}
    </div>
  );
}

export default Palette;
