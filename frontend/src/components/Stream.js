import React from 'react';
import { useLocation } from 'react-router-dom';

function Stream() {
  const location = useLocation();
  const images = location.state?.images || [];

  return (
    <div className="container mt-5">
      <h1>Stream Images</h1>
      <p>Implement streaming functionality here.</p>
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Streamed Image ${index + 1}`} className="img-fluid mb-3" />
      ))}
    </div>
  );
}

export default Stream;