import './GameControl.scss';
import React from 'react';

const media = 'https://i.pinimg.com/564x/b4/e5/a8/b4e5a838cbba861e5ca764ba8e28582a.jpg';

function GameControl() {
  return (
    <div className="game-control">
      <div className="question">1+1=?</div>

      <div className="middle">
        <div className="time">15</div>
        <img src={media} alt="media" className="media" />
        <div className="answered-counter">4 answers</div>
        <button className="next-btn">Next</button>
        <button className="end-btn">End</button>
      </div>

      <div className="answer-options">
        <div className="answer option-1">1</div>
        <div className="answer option-2">2</div>
        <div className="answer option-3">3</div>
        <div className="answer option-4">4</div>
      </div>

      <div className="current-question">2/3</div>
    </div>
  );
}

export default GameControl;