import './PlayerQuestionResult.scss';
import React from 'react';
import background from '../../assets/images/space-bg-13.jpg';
import { BiBadgeCheck } from 'react-icons/bi';
import { RiEmotionSadFill, RiEmotionLaughFill, RiMedalFill, RiMedalLine } from 'react-icons/ri';

// tạm thui, mốt gộp vô PlayerGamePlay

function PlayerQuestionResult() {
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

        <div className="question-result">
          <div className="message">Incorrect</div>
          <RiEmotionSadFill className="result-icon" />
          <div className="result">+0</div>
          <div className="current-rank">
            <span className="rank-message">Your current rank is 3rd</span>
            <RiMedalFill className="rank-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerQuestionResult;