import './GameControl.scss';
import React, { useEffect, useState } from 'react';
import socket from '../../../shared/socket';

const media = 'https://i.pinimg.com/564x/b4/e5/a8/b4e5a838cbba861e5ca764ba8e28582a.jpg';

function GameControl() {
  const [currentQuestion, setCurrentQuestion] = useState({});

  useEffect(() => {
    socket.emit('classic:host-start-game');

    socket.on('classic:sv-send-question', (question) => {
      console.log(question.answers[0].content);
      setCurrentQuestion(question);
    });

    socket.on('classic:time-up', (result) => {
      console.log(result);
    });
  }, []);

  return (
    <div className="game-control">
      <div className="question">{currentQuestion?.content}</div>

      <div className="middle">
        <div className="time">15</div>
        <img src={media} alt="media" className="media" />
        <div className="answered-counter">4 answers</div>
        <button className="next-btn">Next</button>
        <button className="end-btn">End</button>
      </div>

      {currentQuestion.answers &&
        <div className="answer-options">
          <div className="answer option-1">{currentQuestion.answers[0].content}</div>
          <div className="answer option-2">{currentQuestion.answers[1].content}</div>
          <div className="answer option-3">{currentQuestion.answers[2].content}</div>
          <div className="answer option-4">{currentQuestion.answers[3].content}</div>
        </div>}

      <div className="current-question">2/3</div>
    </div>
  );
}

export default GameControl;