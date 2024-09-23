import React, { useEffect } from 'react';

function ImageCarousel({ images, currentImage, setCurrentImage }) {
  // Helper function to determine whether to use createObjectURL or direct URL
  const getImageSrc = (image) => {
    if (image instanceof File || image instanceof Blob) {
      return URL.createObjectURL(image); // Create a blob URL if it's a File or Blob
    }
    return image; // Assume it's a URL string
  };

  // Automatically move to the next image every 3 seconds for the slideshow
  
  return (
    <div className="image-carousel">
      {images.length > 0 ? (
        <>
          {/* Display the image */}
          <img
            src={getImageSrc(images[currentImage])}
            alt={`Image ${currentImage + 1}`}
            className="carousel-image"
          />
          
          {/* Display current image caption */}
          <p className="image-caption">
            File {currentImage + 1} of {images.length}
          </p>

          {/* Navigation buttons */}
          <div className="carousel-controls">
            <button
              className="carousel-button carousel-button-left"
              onClick={() =>
                setCurrentImage((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1
                )
              }
            >
              &lt; {/* Left arrow */}
            </button>
            
            <button
              className="carousel-button carousel-button-right"
              onClick={() =>
                setCurrentImage((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0
                )
              }
            >
              &gt; {/* Right arrow */}
            </button>
          </div>
        </>
      ) : (
        <p>No images to display</p>
      )}
    </div>
  );
}

export default ImageCarousel;
