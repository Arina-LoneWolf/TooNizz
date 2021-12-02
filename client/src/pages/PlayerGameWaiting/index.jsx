
import './PlayerGameWaiting.scss';
import React, { useEffect } from 'react';
import socket from '../../shared/socket';
import { useLocation, useNavigate } from 'react-router-dom';
import background from '../../assets/images/space-bg-3.jpg'

// const name = 'Trinh';

function PlayerGameWaiting() {
  const { state: name } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('classic:player-start-game', () => {
      navigate('/gameplay', { replace: true, state: name });
    });

    socket.on('classic:host-disconnected', () => {
      navigate('/');
    });
  }, []);

  return (
    <div className="player-game-waiting" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <span>{name}, you're in</span>
      </div>
    </div>
  );
}

export default PlayerGameWaiting;