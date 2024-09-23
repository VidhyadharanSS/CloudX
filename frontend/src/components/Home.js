import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {email} from './Login'
import logo from './1.png';
function Home() {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null); // Store the logged-in user
  const navigate = useNavigate();

  // On component mount, check if a user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set the user data if found in local storage
    }
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

  const handleNext = () => {
    if (images.length > 0) {
      navigate('/edit', { state: { images } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from local storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-light bg-light">
        <h1 className="navbar-brand mb-0">ImagerML Home</h1>
        {user ? (
          <div className="d-flex align-items-center">
            <span className="mr-3">Welcome, {user.name || user.email}</span>
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn btn-outline-primary" onClick={() => navigate('/login')}>Login</button>
        )}
      </nav>

      <div className="mb-4">
        <h2>Upload Images</h2>
        <input type="file" className="form-control" multiple onChange={handleImageUpload} />
      </div>

      {images.length > 0 && (
        <button className="btn btn-primary" onClick={handleNext}>Next</button>
      )}

      {/* Bootstrap Cards Section */}
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Efficient Image Editing</h5>
              <p className="card-text">ImagerML allows you to edit your images with tools like cropping, marking, annotating, and color adjustments. All of this is done quickly and easily through a user-friendly interface.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Image Streaming</h5>
              <p className="card-text">Seamlessly stream your image files without any lag, allowing for fast loading times and smooth browsing. Perfect for viewing large image galleries or detailed photo collections.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Image Compression</h5>
              <p className="card-text">Easily compress images to reduce file sizes without compromising on quality. Ideal for optimizing storage space and speeding up uploads or downloads.</p>
            </div>
          </div>
        </div>

        {/* New Functionalities Sections */}
        <div className="col-md-4 mt-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Batch Processing</h5>
              <p className="card-text">Edit multiple images at once with batch processing. Save time and improve efficiency with our intuitive tools designed for bulk editing.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Advanced Filters</h5>
              <p className="card-text">Apply a variety of advanced filters to enhance your images. </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Image Sharing</h5>
              <p className="card-text">Easily share your edited images directly from ImagerML to your favorite social media platforms. </p>
            </div>
          </div>
        </div>

        

      </div>
    </div>
  );
}

export default Home;
