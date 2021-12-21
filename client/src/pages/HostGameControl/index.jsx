import './HostGameControl.scss';
import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsPeopleFill, BsStopFill, BsFillCaretRightFill, BsDisplayFill, BsLaptopFill } from 'react-icons/bs';
import background from '../../assets/images/space-bg-13.jpg';
import alternative from '../../assets/images/alternative-media.png';
import socket from '../../shared/socket';

function HostGameControl() {
  const { state: firstQuestion } = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(firstQuestion);
  const [countdown, setCountdown] = useState(firstQuestion.time);

  const navigate = useNavigate();

  const intervalRef = useRef();

  const el = useRef();
  const q = gsap.utils.selector(el);

  useEffect(() => {
    console.log(currentQuestion);
    gsap.timeline({
      onComplete: () => {
        socket.emit('classic:countdown-start-host');
      }
    })
      .addLabel('fadeIn')
      .to(q('.overlay'), { opacity: 0, duration: 1 }, 'fadeIn')
      .to(q('.overlay'), { display: 'none' })
      .from(q('.question'), { scale: 0, duration: 0.7,  ease: "back.out(0.8)" })
      .from(q('.answer'), { scale: 0, duration: 0.8})
      .from(q('.control-bar'), { opacity: 0, duration: 0.8 })
      .from(q('.media'), { opacity: 0, duration: 0.8 }, '<')
      .from(q('.question-time'), { opacity: 0, scale: 0, duration: 1 }, '<')
      .from(q('.question-time'), { color: 'transparent', duration: 1 })

    socket.on('classic:countdown-start-player', () => {
      intervalRef.current = setInterval(handleCountdown, 1000);
    });

    socket.on('classic:sv-send-question', (question) => {
      console.log(question);
      setCurrentQuestion(question);
      setCountdown(question.time);
    });
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      clearInterval(intervalRef.current);
    }
  }, [countdown]);

  const handleCountdown = () => {
    setCountdown(prev => prev - 1);
  }

  return (
    <div className="host-game-control" ref={el} style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="question">Which of the following statements are true?</div>

        <div className="middle-wrapper">
          <div className="question-time">{countdown}</div>
          <img src={alternative} alt="" className="media" />
          <div className="control-bar">
            <div className="question-number-display">
              <BsLaptopFill className="icon" />
              <div className="question-number">1/15</div>
            </div>

            <div className="people-answers-display">
              <BsPeopleFill className="icon" />
              <div className="people-answers">11/50</div>
            </div>

            <div className="next-question-btn">
              <BsFillCaretRightFill className="icon" />
            </div>

            <div className="stop-game-btn">
              <BsStopFill className="icon" />
            </div>
          </div>
        </div>

        <div className="answer-options">
          <div className="answer opt-1">It is impossible to lick your own elbow</div>
          <div className="answer opt-2">Saturn is the largest planet by surface area</div>
          <div className="answer opt-3">There's no word in the dictionary that rhymes with orange</div>
          <div className="answer opt-4">French fries originated in France</div>
        </div>
      </div>

      <div className="overlay" />
    </div>
  );
}

export default HostGameControl;