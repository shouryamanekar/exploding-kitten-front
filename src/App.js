// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import './App.css';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage  />}/>
        <Route path="/game" element={<GamePage  />} />
      </Routes>
    </Router>
  );
}

export default App;
