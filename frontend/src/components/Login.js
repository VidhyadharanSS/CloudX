import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth'; // Assuming this is a service to handle login

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password); // Assuming login returns user data
      localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
      navigate('/'); // Redirect to home page after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Add button to navigate to signup */}
      <p className="mt-3">
        Not a user?{' '}
        <button
          className="btn btn-link"
          type="button"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;
