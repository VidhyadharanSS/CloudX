import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './1.png'; // Adjust the path as necessary

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="ImagerML Logo" className="navbar-logo" />
          ImagerML
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/edit" className="nav-link">Edit</Link>
            </li>
            <li className="nav-item">
              <Link to="/compress" className="nav-link">Compress</Link>
            </li>
            <li className="nav-item">
              <Link to="/stream" className="nav-link">Stream</Link>
            </li>
            <li className="nav-item">
              <a href="https://imager-ml.vercel.app" className="nav-link" target="_blank" rel="noopener noreferrer">Simplified - ImagerML</a>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About Us</Link>
            </li>
            {user ? (
              <div className="d-flex align-items-center">
                <li className="nav-item me-3">
                  <span className="navbar-text">Welcome, {user.name || user.email}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-warning btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </div>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
