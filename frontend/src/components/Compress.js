import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Compressor from './Compressor';
import './Compress.css';

function Compress() {
  const [file, setFile] = useState(null);
  const [options, setOptions] = useState({
    quality: 1,
    outputType: 'image/jpeg',
    width: 0,
    height: 0
  });
  const [compressedImage, setCompressedImage] = useState(null);
  const [imageInfo, setImageInfo] = useState({});
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState(null);
  
  const originalImageRef = useRef(null);
  const compressedImageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    showDefaultImages();
  }, []);

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      changeOriginalImage(selectedFile);
    }
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptions((prev) => ({
      ...prev,
      [name]: name === 'quality' ? parseFloat(value) : value,
    }));
  };

  const changeOriginalImage = (selectedFile) => {
    if (originalImageRef.current) {
      originalImageRef.current.style.backgroundImage = `url(${URL.createObjectURL(selectedFile)})`;
    }
    setInfo(selectedFile);
  };

  const compressImage = () => {
    if (!file) return;

    new Compressor(file, {
      ...options,
      success: (blob) => {
        setCompressedImage(URL.createObjectURL(blob));
        setCompressedBlob(blob);
        setInfo(blob);
      },
      error: (error) => {
        console.error(error);
      },
      progress: (percent) => {
        setCompressionProgress(percent);
      }
    });
  };

  const setInfo = (file) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const info = {
        name: file.name,
        width: image.width,
        height: image.height,
        size: (file.size / 1024).toFixed(3) + ' KB',
        type: file.type,
      };
      setImageInfo(info);
    };
  };

  const handleEdit = () => {
    navigate('/edit', { state: { image: file } });
  };

  const handleDownload = () => {
    if (compressedBlob) {
      const url = URL.createObjectURL(compressedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `compressed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  function showDefaultImages() {
    const image = document.querySelector(".dummy-image");
    if (!image) {
      console.error("Dummy image not found");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (image.complete) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      createBlob(canvas);
    } else {
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        createBlob(canvas);
      };
    }
  }
  
  function createBlob(canvas) {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          blob.name = "Lanzarote, Spain";
          changeOriginalImage(blob);
        }
      },
      "image/png",
      1
    );
  }

  return (
    <div className="compress-container">
      <h1 className="compress-title">Compress Images</h1>
      <div className="image-container">
        <div className="original-image" ref={originalImageRef}>
          <h2>Original Image</h2>
          <input type="file" accept="image/*" onChange={handleFileInputChange} className="file-input" />
          <div className="image-info">
            {imageInfo.name && (
              <>
                <p>Name: {imageInfo.name}</p>
                <p>Width: {imageInfo.width}px</p>
                <p>Height: {imageInfo.height}px</p>
                <p>File Size: {imageInfo.size}</p>
                <p>File Type: {imageInfo.type}</p>
              </>
            )}
          </div>
        </div>
        <div className="compressed-image-frame" ref={compressedImageRef}>
          <h2>Compressed Image</h2>
          <div className="compressed-image" style={{ backgroundImage: `url(${compressedImage})` }}></div>
          {compressedImage && (
            <div className="image-info">
              <p>Width: {options.width || imageInfo.width}px</p>
              <p>Height: {options.height || imageInfo.height}px</p>
              <p>File Size: {(compressedBlob?.size / 1024).toFixed(3) + ' KB'}</p>
              <p>File Type: {options.outputType}</p>
            </div>
          )}
        </div>
      </div>
      <div className="controls">
        <div className="control-group">
          <label className="control-label">
            Quality:
            <input
              type="range"
              name="quality"
              min="0"
              max="1"
              step="0.01"
              value={options.quality}
              onChange={handleOptionChange}
              className="range-input"
            />
            <span>{options.quality.toFixed(2)}</span>
          </label>
        </div>
        <div className="control-group">
          <label className="control-label">
            Output File Type:
            <select name="outputType" value={options.outputType} onChange={handleOptionChange} className="select-input">
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
          </label>
        </div>
        <div className="control-group">
          <label className="control-label">
            Width:
            <input
              type="number"
              name="width"
              value={options.width}
              onChange={handleOptionChange}
              placeholder="Original width"
              className="number-input"
            />
          </label>
        </div>
        <div className="control-group">
          <label className="control-label">
            Height:
            <input
              type="number"
              name="height"
              value={options.height}
              onChange={handleOptionChange}
              placeholder="Original height"
              className="number-input"
            />
          </label>
        </div>
      </div>
      <div className="button-group">
        <button onClick={compressImage} className="action-button compress-button">Compress</button>
        <button onClick={handleEdit} className="action-button edit-button">Edit</button>
        {compressedImage && (
          <button onClick={handleDownload} className="action-button download-button">Download</button>
        )}
      </div>
      {compressionProgress > 0 && compressionProgress < 100 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${compressionProgress}%` }}></div>
        </div>
      )}
    </div>
  );
}

export default Compress;
