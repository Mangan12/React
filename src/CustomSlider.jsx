import React from 'react';

const CustomSlider = ({ value, onChange, min, max, label }) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  return (
    <div className="custom-slider">
      <input
        type="range"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className="slider-input"
      />
      <label className="slider-label">{label}</label>
    </div>
  );
};

export default CustomSlider;