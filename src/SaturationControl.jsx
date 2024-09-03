import React from 'react';
import { SliderPicker } from 'react-color';

const SaturationControl = ({ color, onColorChange }) => {
  return (
    <div className="saturation-control">
      <SliderPicker color={color} onChange={onColorChange} />
    </div>
  );
};

export default SaturationControl;
