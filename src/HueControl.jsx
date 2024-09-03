import React from 'react';
import { HuePicker } from 'react-color';

const HueControl = ({ color, onColorChange }) => {
  return (
    <div className="hue-control">
      <HuePicker color={color} onChange={onColorChange} />
    </div>
  );
};

export default HueControl;
