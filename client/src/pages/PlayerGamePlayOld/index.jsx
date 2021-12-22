import './PlayerGamePlay.scss';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../shared/socket';

function PlayerGamePlay() {
  const performance = window.performance;
  const [timeStart, setTimeStart] = useState(0);

  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState({});

  useEffect(() => {
    setTimeStart(performance.now());

    socket.on('classic:sv-send-question', (question) => {
      console.log(question);
      setCurrentQuestion(question);
    });

    socket.on('classic:all-players-answered', (score) => {
      console.log(score);
    });

    socket.on('classic:host-disconnected', () => {
      navigate('/');
    });

    return () => {
      socket.off('classic:sv-send-question');
      socket.off('classic:all-players-answered');
      socket.off('classic:host-disconnected');
    }
  }, []);

  const submitAnswer= (answerNumber) => {
    const timeEnd = performance.now();
    const answerTime = timeEnd - timeStart;

    const answer = {
      time: answerTime / 1000,
      answers: [currentQuestion.answers[answerNumber]._id]
    }

    socket.emit('classic:player-answer', answer);
  }

  return (
    <div className="player-game-play">
      {<div className="answer-options">
        <div className="answer option-1" onClick={() => submitAnswer(0)}></div>
        <div className="answer option-2" onClick={() => submitAnswer(1)}></div>
        <div className="answer option-3" onClick={() => submitAnswer(2)}></div>
        <div className="answer option-4" onClick={() => submitAnswer(3)}></div>
      </div>}
    </div>
  );
}

export default PlayerGamePlay;