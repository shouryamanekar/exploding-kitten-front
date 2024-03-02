// pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = ({onLoginCancel}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const user = await response.json();
        // Handle successful login, e.g., update state or redirect to another page
        localStorage.setItem('username', user.username);
        navigate('/game')
      } else {
        // Handle unsuccessful login, e.g., show an error message
        setErrorMessage('Invalid username or password. Please try again.');
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please try again.');
      console.error('Error during login:', error);
    }
  };

  const cancelLogin = () => {
    navigate('/')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='login-page'>
    <div className="login-container">
      <h1>Login</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
        
      <div className="input-container">
          <label htmlFor="username">Username:</label>
      <input
        type="text"
        value={username}
        id="username"
        className="input"
        autoComplete="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      </div>
      <div className="input-container">
          <label htmlFor="password">Password:</label>
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        id="password"
        className="input"
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
      /><button type="button" className="toggle-password-button" onClick={togglePasswordVisibility}>
      {showPassword ? "👁️" : "👁"}
    </button>
    
      
      </div>
      
      <div >
            <button className="login-button" type="submit" onClick={handleLogin}>Login</button>
            <button className="login-button" onClick={cancelLogin}>Back</button>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
