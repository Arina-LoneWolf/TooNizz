import './PlayerGamePlay.scss';
import React from 'react';
import background from '../../assets/images/space-bg-13.jpg';
import { BsFillSquareFill, BsFillCircleFill, BsFillTriangleFill, BsFillDiamondFill, BsFillHexagonFill } from 'react-icons/bs';

function PlayerGamePlay() {
  return (
    <div className="player-game-play" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="status-bar">
          <div className="question-number">1 of 15</div>
          <div className="question-type">Multiple-choice</div>
          <div className="score-wrapper">
            <label className="score-lb">Your score</label>
            <span className="player-score">850</span>
          </div>
        </div>
        <div className="answer-options">
          <div className="answer opt-1"><BsFillTriangleFill className="answer-icon" /></div>
          <div className="answer opt-2"><BsFillCircleFill className="answer-icon" /></div>
          <div className="answer opt-3"><BsFillHexagonFill className="answer-icon" /></div>
          <div className="answer opt-4"><BsFillDiamondFill className="answer-icon" /></div>
        </div>
      </div>
    </div>
  );
}

export default PlayerGamePlay;