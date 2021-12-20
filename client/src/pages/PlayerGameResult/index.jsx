import './PlayerGameResult.scss';
import React from 'react';
import { RiMedalFill } from 'react-icons/ri';
import { GiFinishLine } from 'react-icons/gi';
import background from '../../assets/images/space-bg-13.jpg';

function PlayerGameResult() {
  return (
    <div className="temporary-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="result-wrapper">
          {/* <div className="finish-lb">Finished!</div> */}
          <GiFinishLine className="finish-icon" />
          <div className="rank-message">
            Your rank is 1st
            <RiMedalFill className="rank-icon" />
          </div>
          <div className="finish-btn">Done</div>
        </div>
      </div>
    </div>
  );
}

export default PlayerGameResult;