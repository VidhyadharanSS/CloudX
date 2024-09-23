import React, { useState } from 'react';

function About() {
  const [suggestion, setSuggestion] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage('Thank you! Your suggestion has been sent.');
    setSuggestion('');
    
    // Here, you can implement actual form submission logic if needed
  };

  return (
    <div className="container mt-5">
      <h2>About ImagerML</h2>
      <p>ImagerML is your go-to platform for efficient image editing, compression, and streaming. Our goal is to provide an easy-to-use interface that allows users to manage their images seamlessly.</p>
      <h3>Contact Us</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="suggestion" className="form-label">Your Suggestions:</label>
          <textarea
            id="suggestion"
            className="form-control"
            rows="4"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
      {message && <div className="alert alert-success mt-3">{message}</div>}
    </div>
  );
}

export default About;
