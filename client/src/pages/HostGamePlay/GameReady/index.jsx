import './GameReady.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GameReady() {
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    }
  }, []);

  useEffect(() => {
    if (countdown < 1) {
      navigate('/gameplay/admin/start', { replace: true });
    }
  }, [countdown]);

  return (
    <div className="game-ready">
      {countdown}
    </div>
  );
}

export default GameReady;