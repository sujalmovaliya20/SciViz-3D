import React from 'react';
import './Loader.css';

const Loader = ({ message = "Initialising 3D Scene..." }) => {
  return (
    <div className="loader-overlay">
      <div className="atom-container">
        <div className="nucleus"></div>
        <div className="electron electron-1"></div>
        <div className="electron electron-2"></div>
        <div className="electron electron-3"></div>
      </div>
      <p className="loader-message syne-bold">{message}</p>
    </div>
  );
};

export default Loader;
