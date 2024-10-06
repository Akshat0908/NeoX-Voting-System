import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnterApp }) => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="animate-pop-in">Welcome to Neo X Voting</h1>
        <p className="animate-pop-in">Secure, transparent, and decentralized voting on the Neo blockchain</p>
        <button className="enter-app-btn animate-pop-in" onClick={onEnterApp}>
          Enter App
          <span className="btn-arrow">→</span>
        </button>
      </div>
      <div className="blockchain-animation">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
    </div>
  );
};

export default LandingPage;
