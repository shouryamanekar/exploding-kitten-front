// pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'

const LandingPage = () => {
  const navigate=useNavigate();

  const gotoLogin = () => {
    navigate('/login')
  }

  return (
    <div className="container">
      <div className="title-container">
        <h1>Exploding Kitten Game</h1>
      </div>
      <div className="button-container">
        <button className="start-button" onClick={gotoLogin}>Start Game</button>
      </div>
    </div>
  );
};

export default LandingPage;
