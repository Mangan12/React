import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

const ColorPaletteExtractor = () => {
  const [image, setImage] = useState(null);
  const [palette, setPalette] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maxColors, setMaxColors] = useState(30);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('maxColors', maxColors);

    try {
      const response = await fetch('/api/extract-colors', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPalette(data.colors);
    } catch (err) {
      setError('Failed to extract colors. Please try again.');
      console.error('Error extracting colors:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Advanced Color Palette Extractor</h1>
      
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <label htmlFor="image-upload" className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition duration-300">
          <Upload className="mr-2 h-5 w-5" />
          Upload Image
        </label>
        <input id="image-upload" type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
        
        <div className="flex items-center space-x-4">
          <label htmlFor="max-colors" className="text-gray-700">Max Colors:</label>
          <input 
            id="max-colors" 
            type="number" 
            value={maxColors} 
            onChange={(e) => setMaxColors(e.target.value)} 
            className="border border-gray-300 rounded-lg px-3 py-1.5 w-24 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            min="1"
            max="100"
          />
        </div>
      </div>

      {image && (
        <div className="mb-6 text-center">
          <img src={image} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-md border border-gray-300" />
        </div>
      )}

      {loading && <p className="text-gray-600 text-center">Extracting colors...</p>}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-6 w-6 mr-3" />
          <span>{error}</span>
        </div>
      )}

      {palette.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Extracted Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {palette.map((color, index) => (
              <div key={index} className="text-center">
                <div
                  style={{ backgroundColor: color }}
                  className="w-24 h-24 rounded-lg border border-gray-300"
                ></div>
                <span className="text-sm text-gray-600 mt-2">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteExtractor;
