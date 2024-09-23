import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Edit from './components/Edit';
import Stream from './components/Stream';
import Compress from './components/Compress';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About'; // Import About component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/compress" element={<Compress />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} /> {/* Add About route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
