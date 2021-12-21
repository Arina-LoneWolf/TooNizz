import './PlayerGamePlay.scss';
import { gsap } from 'gsap';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import background from '../../assets/images/space-bg-13.jpg';
import { BsFillSquareFill, BsFillCircleFill, BsFillTriangleFill, BsFillDiamondFill, BsFillHexagonFill } from 'react-icons/bs';

function PlayerGamePlay() {
  const { state: { name, firstQuestion } } = useLocation();
  const [currentQuestion, setcurrentQuestion] = useState(firstQuestion);

  const performance = window.performance;
  const [timeStart, setTimeStart] = useState(0);

  const el = useRef();
  const q = gsap.utils.selector(el);

  useEffect(() => {
    console.log(currentQuestion);
    gsap.timeline({
      onComplete: () => {

      }
    })
      .addLabel('fadeIn')
      .to(q('.overlay'), { opacity: 0, duration: 1 }, 'fadeIn')
      .to(q('.overlay'), { display: 'none' })
      .from(q('.status-bar'), { scale: 0, duration: 0.7,  ease: "back.out(0.8)" })
      .from(q('.answer'), { scale: 0, duration: 0.8})
  }, []);

  return (
    <div className="player-game-play" ref={el} style={{ backgroundImage: `url(${background})` }}>
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

      <div className="overlay" />
    </div>
  );
}

export default PlayerGamePlay;