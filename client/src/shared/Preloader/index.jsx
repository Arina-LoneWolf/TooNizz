import './Preloader.scss';
import React from 'react';
import preloader from '../../assets/gifs/double-ring-preloader.gif';

function Preloader() {
  return (
    <div className="preloader">
      <img src={preloader} alt="preloader" className="preloader-img" />
    </div>
  );
}

export default Preloader;