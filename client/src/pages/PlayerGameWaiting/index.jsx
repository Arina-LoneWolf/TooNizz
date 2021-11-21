
import './PlayerGameWaiting.scss';
import React from 'react';
import background from '../../assets/images/space-bg-1.jpg'

const name = 'Trinh';

function PlayerGameWaiting() {
  return (
    <div className="player-game-waiting" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <span>{name}, you're in</span>
      </div>
    </div>
  );
}

export default PlayerGameWaiting;