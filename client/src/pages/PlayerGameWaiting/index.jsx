
import './PlayerGameWaiting.scss';
import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import socket from '../../shared/socket';
import { useLocation, useNavigate } from 'react-router-dom';
import background from '../../assets/images/space-bg-3.jpg'

function PlayerGameWaiting() {
  const { state: name } = useLocation();
  const navigate = useNavigate();

  const overlayRef = useRef();
  const messageRef = useRef();
  const countdownRef = useRef();
  const intervalRef = useRef();

  const [countdown, setCountdown] = useState(3);
  const [firstQuestion, setFirstQuestion] = useState({});

  useEffect(() => {
    gsap.timeline()
      .addLabel('fadeIn')
      .to(overlayRef.current, { opacity: 0, duration: 1 }, 'fadeIn')
      .to(overlayRef.current, { display: 'none' })
      .to(messageRef.current, { opacity: 1, scale: 1, duration: 1.5, ease: "back.out(2.0)" }, 'fadeIn')

    socket.on('classic:player-start-game', () => {
      gsap.timeline({
        onComplete: () => {
          intervalRef.current = setInterval(handleCountdown, 1000);
        }
      }).addLabel('countdownStart')
        .to(messageRef.current, { opacity: 0 }, 'countdownStart')
        .to(countdownRef.current, { display: 'block', width: '100vw', opacity: 1, duration: 0.8, ease: "circ.easeIn" })
        .to(countdownRef.current, { color: 'white', duration: 0.1 })
      // navigate('/gameplay', { replace: true, state: name });
    });

    socket.on('classic:host-disconnected', () => {
      navigate('/');
    });

    socket.on('classic:sv-send-question', (question) => {
      console.log(question);
      setFirstQuestion(question);
    });
  }, []);

  useEffect(() => {
    if (countdown < 2) {
      clearInterval(intervalRef.current);
      setTimeout(() => {
        gsap.timeline({
          onComplete: () => {
            navigate('/gameplay', { replace: true, state: { name, firstQuestion } });
          }
        })
          .to(overlayRef.current, { opacity: 1, duration: 1 })
      }, 1000);
    }
  }, [countdown]);

  const handleCountdown = () => {
    setCountdown(prev => prev - 1);
  }

  return (
    <div className="player-game-waiting" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <span ref={messageRef}>{name}, you're in</span>
      </div>

      <div className="countdown-start" ref={countdownRef}>{countdown}</div>

      <div className="overlay" ref={overlayRef} />
    </div>
  );
}

export default PlayerGameWaiting;