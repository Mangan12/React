// src/cropImage.js

export const getCroppedImg = (imageSrc, crop, rotation = 0) => {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // Needed to avoid cross-origin issues
        image.src = url;
      });
  
    const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180;
  
    return new Promise(async (resolve, reject) => {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      const safeArea = Math.max(image.width, image.height) * 2;
  
      // Set canvas to double size to ensure the rotated image fits
      canvas.width = safeArea;
      canvas.height = safeArea;
  
      // Translate and rotate the canvas
      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate(getRadianAngle(rotation));
      ctx.translate(-safeArea / 2, -safeArea / 2);
  
      // Draw the image
      ctx.drawImage(image, (safeArea - image.width) / 2, (safeArea - image.height) / 2);
  
      // Extract the cropped image
      const data = ctx.getImageData(crop.x, crop.y, crop.width, crop.height);
  
      // Set canvas to the size of the crop
      canvas.width = crop.width;
      canvas.height = crop.height;
  
      // Paste the cropped image data
      ctx.putImageData(data, 0, 0);
  
      // Convert to data URL
      resolve(canvas.toDataURL('image/jpeg'));
    });
  };
  