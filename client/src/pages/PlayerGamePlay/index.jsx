import './PlayerGamePlay.scss';
import { gsap } from 'gsap';
import socket from '../../shared/socket';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import background from '../../assets/images/space-bg-13.jpg';
import { BsFillSquareFill, BsFillCircleFill, BsFillTriangleFill, BsFillDiamondFill, BsFillHexagonFill } from 'react-icons/bs';
import { BiBadgeCheck } from 'react-icons/bi';
import { RiEmotionSadFill, RiEmotionLaughFill, RiMedalFill, RiMedalLine } from 'react-icons/ri';
import rolling from '../../assets/gifs/rolling.svg';

const CORRECT = 'Correct';
const INCORRECT = 'Incorrect';
const TIME_UP = 'Time Up';

function PlayerGamePlay() {
  const { state: { name, firstQuestion } } = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(firstQuestion);
  const [questionTime, setQuestionTime] = useState(firstQuestion.time * 1000);
  const timeoutRef = useRef();

  const [waitingOthers, setWaitingOthers] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [totalScore, setTotalScore] = useState(0);
  const [questionScore, setQuestionScore] = useState(0);
  const [resultMessage, setResultMessage] = useState(INCORRECT);

  const performance = window.performance;
  const [timeStart, setTimeStart] = useState(0);

  const el = useRef();
  const q = gsap.utils.selector(el);
  const tlAnswers = useRef();

  useEffect(() => {
    console.log(currentQuestion);
    gsap.timeline({
      onComplete: () => {

      }
    })
      .addLabel('fadeIn')
      .to(q('.overlay'), { opacity: 0, duration: 1 }, 'fadeIn')
      .to(q('.overlay'), { display: 'none' })
      .from(q('.status-bar'), { scale: 0, duration: 0.7, ease: "back.out(0.8)" })

    socket.on('classic:countdown-start-player', () => {
      timeoutRef.current = setTimeout(() => {
        console.log('emit het gio')
        const answer = {
          answers: [],
          time: -1
        }
        setResultMessage(TIME_UP);
        socket.emit('classic:player-answer', answer);
        tlAnswers.current.reverse();
      }, questionTime);

      setTimeStart(performance.now());

      tlAnswers.current = gsap.timeline({
        onReverseComplete: () => {
          setWaitingOthers(true);
        }
      }).to(q('.answer'), { scale: 1, duration: 0.4 })
    });

    socket.on('classic:all-players-answered', (score) => {
      console.log(score);
      clearTimeout(timeoutRef.current);
      setQuestionScore(score);
      score ? setResultMessage(CORRECT) : setResultMessage(INCORRECT);
      setShowResult(true);
    });

    socket.on('classic:sv-send-question', (question) => {
      console.log(question);
      setCurrentQuestion(question);
      setQuestionTime(question.time);
    });
  }, []);

  useEffect(() => {
    if (showResult)
      setWaitingOthers(false);
  }, [showResult, waitingOthers])

  const submitAnswer = (answerNumber) => {
    const timeEnd = performance.now();
    const answerTime = timeEnd - timeStart;

    const answer = {
      time: answerTime / 1000,
      answers: [currentQuestion.answers[answerNumber]._id]
    }

    socket.emit('classic:player-answer', answer);

    tlAnswers.current.reverse();
  }

  return (
    <div className="player-game-play" ref={el} style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="status-bar">
          <div className="question-number">1 of 15</div>
          <div className="question-type">Multiple-choice</div>
          <div className="score-wrapper">
            <label className="score-lb">Your score</label>
            <span className="player-score">{totalScore}</span>
          </div>
        </div>

        <div className="answer-options">
          <div className="answer opt-1" onClick={() => submitAnswer(0)}><BsFillTriangleFill className="answer-icon" /></div>
          <div className="answer opt-2" onClick={() => submitAnswer(1)}><BsFillCircleFill className="answer-icon" /></div>
          <div className="answer opt-3" onClick={() => submitAnswer(2)}><BsFillHexagonFill className="answer-icon" /></div>
          <div className="answer opt-4" onClick={() => submitAnswer(3)}><BsFillDiamondFill className="answer-icon" /></div>
        </div>
      </div>

      {waitingOthers && <img src={rolling} className="waiting-others" alt="Waiting others" />}

      {showResult && <div className="question-result">
        <div className="message">{resultMessage}</div>
        <RiEmotionSadFill className="result-icon" />
        <div className="result">+{questionScore}</div>
        <div className="current-rank">
          <span className="rank-message">Your current rank is 3rd</span>
          <RiMedalFill className="rank-icon" />
        </div>
      </div>}

      <div className="overlay" />
    </div>
  );
}

export default PlayerGamePlay;