import './PlayerGameResult.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMedalFill } from 'react-icons/ri';
import { GiFinishLine } from 'react-icons/gi';
import background from '../../assets/images/space-bg-13.jpg';

function PlayerGameResult() {
  const navigate = useNavigate();

  const handleDoneClick = () => {
    navigate('/', { replace: true });
  }

  return (
    <div className="temporary-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="result-wrapper">
          <GiFinishLine className="finish-icon" />
          <div className="rank-message">
            Your rank is 1st
            <RiMedalFill className="rank-icon" />
          </div>
          <div className="finish-btn" onClick={handleDoneClick}>Done</div>
        </div>
      </div>
    </div>
  );
}

export default PlayerGameResult;