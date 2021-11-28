import './HostGamePlay.scss';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GameReady from './GameReady';
import GameControl from './GameControl';
import background from '../../assets/images/space-bg-12.jpg';

function HostGamePlay() {
  return (
    <div className="host-game-play" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <Routes>
          <Route path='/' element={<GameReady />} />
          <Route path='/start' element={<GameControl />} />
        </Routes>
      </div>
    </div>
  );
}

export default HostGamePlay;