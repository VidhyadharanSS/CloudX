import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import './Edit.css';
import CropModal from './CropModal';

import Compress from './Compress'; // Import Compress
import Stream from './Stream';     // Import Stream

function Edit() {
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [editedImages, setEditedImages] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [progress, setProgress] = useState(0); // Progress state
  const [isProcessing, setIsProcessing] = useState(false); // To track if processing
  const [blurStrength, setBlurStrength] = useState(5);
  const [brightness, setBrightness] = useState(1.5);
  const [watermarkText, setWatermarkText] = useState('');
  const [showWatermark, setShowWatermark] = useState(false);
  const [noiseAmount, setNoiseAmount] = useState(50);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [sepiaFilter, setSepiaFilter] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);

  useEffect(() => {
    if (location.state?.images) {
      const loadedImages = location.state.images.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setImages(loadedImages);
      setEditedImages(loadedImages.map(img => img.url));
    }
  }, [location.state]);

  const applyEdit = (editFunction) => {
    setIsProcessing(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Show progress for editing
      const totalSteps = 10; // Define total steps for progress
      for (let i = 0; i < totalSteps; i++) {
        setTimeout(() => {
          setProgress(Math.round(((i + 1) / totalSteps) * 100));
        }, i * 100);
      }

      editFunction(ctx, canvas);
      const newUrl = canvas.toDataURL();
      setHistory((prev) => [...prev, editedImages[currentImage]]);
      setRedoStack([]);
      setEditedImages(prev => {
        const newImages = [...prev];
        newImages[currentImage] = newUrl;
        return newImages;
      });

      setTimeout(() => {
        setProgress(100);
        setIsProcessing(false);
      }, totalSteps * 100);
    };
    img.src = editedImages[currentImage];
  };

  // ... existing event handlers ...
  const handleUndo = () => {
    if (history.length > 0) {
      setRedoStack((prev) => [...prev, editedImages[currentImage]]); // Save current state to redo stack
      const previous = history.pop();
      setEditedImages(prev => {
        const newImages = [...prev];
        newImages[currentImage] = previous;
        return newImages;
      });
      setHistory([...history]); // Update history after pop
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack.pop();
      setHistory((prev) => [...prev, editedImages[currentImage]]); // Save current state to history
      setEditedImages(prev => {
        const newImages = [...prev];
        newImages[currentImage] = next;
        return newImages;
      });
      setRedoStack([...redoStack]); // Update redo stack after pop
    }
  };

  const handleFlipHorizontal = () => {
    applyEdit((ctx, canvas) => {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(canvas, 0, 0);
    });
  };

  const handleFlipVertical = () => {
    applyEdit((ctx, canvas) => {
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      ctx.drawImage(canvas, 0, 0);
    });
  };

  const handleMonochrome = () => {
    applyEdit((ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
      ctx.putImageData(imageData, 0, 0);
    });
  };

  const handleEdgeDetection = () => {
    applyEdit((ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const w = canvas.width;
      const h = canvas.height;
      const grayscale = new Array(w * h);

      for (let i = 0; i < data.length; i += 4) {
        grayscale[i / 4] = (data[i] + data[i + 1] + data[i + 2]) / 3;
      }

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const gx = 
            -1 * grayscale[(y - 1) * w + (x - 1)] +
            -2 * grayscale[y * w + (x - 1)] +
            -1 * grayscale[(y + 1) * w + (x - 1)] +
            1 * grayscale[(y - 1) * w + (x + 1)] +
            2 * grayscale[y * w + (x + 1)] +
            1 * grayscale[(y + 1) * w + (x + 1)];

          const gy = 
            -1 * grayscale[(y - 1) * w + (x - 1)] +
            -2 * grayscale[(y - 1) * w + x] +
            -1 * grayscale[(y - 1) * w + (x + 1)] +
            1 * grayscale[(y + 1) * w + (x - 1)] +
            2 * grayscale[(y + 1) * w + x] +
            1 * grayscale[(y + 1) * w + (x + 1)];

          const index = (y * w + x) * 4;
          const magnitude = Math.sqrt(gx * gx + gy * gy);
          data[index] = data[index + 1] = data[index + 2] = magnitude;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    });
  };

  const handleGaussianBlur = () => {
    applyEdit((ctx, canvas) => {
      ctx.filter = `blur(${blurStrength}px)`;
      ctx.drawImage(canvas, 0, 0);
    });
  };

  const handleBrightness = () => {
    applyEdit((ctx, canvas) => {
      ctx.filter = `brightness(${brightness})`;
      ctx.drawImage(canvas, 0, 0);
    });
  };

  const handleGlitchEffect = () => {
    applyEdit((ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (i % 40 === 0) {
          data[i] = data[i + 4]; // Red
          data[i + 1] = data[i + 6]; // Green
        }
      }
      ctx.putImageData(imageData, 0, 0);
    });
  };

  const handleWatermark = () => {
    applyEdit((ctx, canvas) => {
      ctx.font = "30px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText(watermarkText, canvas.width - 200, canvas.height - 30);
    });
  };

  const handleRemoveWatermark = () => {
    setShowWatermark(false);
  };

  const handleNoiseEffect = () => {
    applyEdit((ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * noiseAmount - noiseAmount / 2;
        data[i] += noise; // Red
        data[i + 1] += noise; // Green
        data[i + 2] += noise; // Blue
      }
      ctx.putImageData(imageData, 0, 0);
    });
  };

  const handleRotate = (angle) => {
    applyEdit((ctx, canvas) => {
      const radians = angle * Math.PI / 180;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    });
  };

  const handleSepia = () => {
    applyEdit((ctx, canvas) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        data[i] = red * 0.393 + green * 0.769 + blue * 0.189; // Red channel
        data[i + 1] = red * 0.349 + green * 0.686 + blue * 0.168; // Green channel
        data[i + 2] = red * 0.272 + green * 0.534 + blue * 0.131; // Blue channel
      }
      ctx.putImageData(imageData, 0, 0);
    });
  };

  const handleCrop = () => {
    setCropMode(true);
  };

  const handleCropConfirm = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = cropRect.w;
      canvas.height = cropRect.h;
      ctx.drawImage(img, cropRect.x, cropRect.y, cropRect.w, cropRect.h, 0, 0, cropRect.w, cropRect.h);
      const newUrl = canvas.toDataURL();
      setEditedImages(prev => {
        const newImages = [...prev];
        newImages[currentImage] = newUrl;
        return newImages;
      });
      setCropMode(false);
    };
    img.src = editedImages[currentImage];
  };

  const handleResize = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = resizeWidth;
      canvas.height = resizeHeight;
      ctx.drawImage(img, 0, 0, resizeWidth, resizeHeight);
      const newUrl = canvas.toDataURL();
      setEditedImages(prev => {
        const newImages = [...prev];
        newImages[currentImage] = newUrl;
        return newImages;
      });
    };
    img.src = editedImages[currentImage];
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = editedImages[currentImage];
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="edit-container">
      <div className="carousel-container">
        <ImageCarousel images={editedImages} currentImage={currentImage} />
        <button onClick={handlePreviousImage}>Previous</button>
        <button onClick={handleNextImage}>Next</button>
      </div>

      <div className="controls">
        <h3>Edit Controls</h3>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
        <button onClick={handleFlipHorizontal}>Flip Horizontal</button>
        <button onClick={handleFlipVertical}>Flip Vertical</button>
        <button onClick={handleMonochrome}>Monochrome</button>
        <button onClick={handleEdgeDetection}>Edge Detection</button>
        <button onClick={handleGaussianBlur}>Blur</button>
        <button onClick={handleBrightness}>Brightness</button>
        <button onClick={handleGlitchEffect}>Glitch Effect</button>
        <button onClick={handleWatermark}>Watermark</button>
        <button onClick={handleRemoveWatermark}>Remove Watermark</button>
        <button onClick={handleNoiseEffect}>Noise Effect</button>
        <button onClick={() => handleRotate(90)}>Rotate 90°</button>
        <button onClick={handleSepia}>Sepia</button>
        <button onClick={handleCrop}>Crop</button>
        <button onClick={handleResize}>Resize</button>
        <button onClick={handleDownload}>Download</button>
        <button onClick={() => navigate('/compress')}>Compress</button>
        <button onClick={() => navigate('/stream')}>Stream</button>


        {isProcessing && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}>{progress}%</div>
          </div>
        )}
      </div>

      {cropMode && (
        <CropModal
          onClose={() => setCropMode(false)}
          onConfirm={handleCropConfirm}
          image={editedImages[currentImage]}
        />
      )}
    </div>
  );
};

export default Edit;
