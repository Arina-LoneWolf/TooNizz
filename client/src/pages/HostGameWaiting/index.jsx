import './HostGameWaiting.scss';
import { gsap } from 'gsap';
import { TextPlugin } from "gsap/TextPlugin";
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../shared/socket';
import { MdGroup, MdMusicNote } from 'react-icons/md';
import { RiMusic2Line, RiMusic2Fill } from 'react-icons/ri';
import { BsMusicNoteBeamed, BsFillVolumeDownFill } from 'react-icons/bs';
import { IoLockOpen, IoLockClosed, IoLockOpenOutline, IoLockClosedOutline } from 'react-icons/io5'
import background from '../../assets/images/space-bg-5.jpg';

const quizSetId = '619b6629ad2e4c2a48924f7f';

function HostGameWaiting() {
  const navigate = useNavigate();

  gsap.registerPlugin(TextPlugin);

  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [firstQuestion, setFirstQuestion] = useState({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const intervalRef = useRef();

  const el = useRef();
  const q = gsap.utils.selector(el);
  const tlStart = useRef();

  useEffect(() => {
    gsap.timeline()
      .addLabel('fadeIn')
      .to(q('.overlay'), { opacity: 0, duration: 1 }, 'fadeIn')
      .to(q('.overlay'), { display: 'none' })
      .to(q('.waiting-players'), { text: 'Waiting for players...', duration: 1.4, ease: "circ.out" }, 'fadeIn+=50%')

    // window.addEventListener('beforeunload', (e) => {
    //   return e.returnValue = '';
    // });

    socket.emit('classic:host-join', quizSetId);

    socket.on('classic:sv-send-game-pin', (code) => {
      setGameCode(code);
    });

    socket.on('classic:sv-send-question', (question) => {
      // console.log(question.answers[0].content);
      setFirstQuestion(question);
    });

    socket.on('classic:sv-send-info-list-questions', (questionSetInfo) => {
      setTotalQuestions(questionSetInfo.lengthListQuestions)
    });

    socket.on('classic:update-list-players', (playerList) => {
      setPlayers(playerList);

      if (playerList.length > 0) {
        gsap.timeline()
          .addLabel('playerJoin')
          .to(q('.waiting-players'), { opacity: 0, duration: 0.5 }, 'playerJoin')
          .to(q('.waiting-players'), { display: 'none'})
          .from(q('.start-btn'), { opacity: 0, scale: 0, duration: 1, ease: "back.out(2.0)" }, 'playerJoin')
          .from(q('.members-wrapper'), { opacity: 0, duration: 0.5 })
          .from(q('.members-display-wrapper'), { opacity: 0, duration: 0.5 })
      }
    });

    socket.on('classic:player-start-game', () => {
      gsap.timeline({
        onComplete: () => {
          intervalRef.current = setInterval(handleCountdown, 1000);
        }
      }).addLabel('start')
        .to(q('.upper-half'), { y: '-100%' }, 'start')
        .to(q('.start-btn'), { opacity: 0 }, 'start')
        .to(q('.members-wrapper'), { opacity: 0 }, 'start')
        .to(q('.members-display-wrapper'), { y: '50vh' }, 'start')
        .to(q('.countdown-start'), { display: 'block', width: '100vw', opacity: 1, duration: 0.8, ease: "circ.easeIn" })
        .to(q('.countdown-start'), { color: 'white', duration: 0.1 })
    });

    return () => {
      socket.off('classic:sv-send-game-pin');
      socket.off('classic:sv-send-question');
      socket.off('classic:sv-send-info-list-questions');
      socket.off('classic:update-list-players');
      socket.off('classic:player-start-game');
    }
  }, []);

  const handleCopyToClipboard = (e) => {
    const codeElem = e.target;
    navigator.clipboard.writeText(codeElem.innerText);
    // alert("Copied!");
  }

  const handleCountdown = () => {
    setCountdown(prev => prev - 1);
  }

  useEffect(() => {
    if (countdown < 2) {
      clearInterval(intervalRef.current);
      setTimeout(() => {
        gsap.timeline({
          onComplete: () => {
            navigate('/gameplay/admin', { replace: true, state: { firstQuestion, totalQuestions, totalPlayers: players.length } });
          }
        })
          .to(q('.overlay'), { opacity: 1, duration: 1 })
      }, 1000);
    }
  }, [countdown]);


  const handleStartGame = () => {
    socket.emit('classic:host-start-game');

    // tlStart.current = gsap.timeline({
    //   onComplete: () => {
    //     intervalRef.current = setInterval(handleCountdown, 1000);
    //   }
    // }).addLabel('start')
    //   .to(q('.upper-half'), { y: '-100%' }, 'start')
    //   .to(q('.start-btn'), { opacity: 0 }, 'start')
    //   .to(q('.members-wrapper'), { opacity: 0 }, 'start')
    //   .to(q('.members-display-wrapper'), { y: '50vh' }, 'start')
    //   .to(q('.countdown-start'), { display: 'block', width: '100vw', opacity: 1, duration: 0.8, ease: "circ.easeIn" })
    //   .to(q('.countdown-start'), { color: 'white', duration: 0.1 })
  }

  return (
    <div className="host-game-waiting" ref={el} style={{ backgroundImage: `url(${background})` }}>
      <div className="upper-half">
        <div className="game-code-title">Game code</div>
        <div className="game-code-wrapper">
          <div className="game-code-number" onClick={handleCopyToClipboard}>{gameCode}</div>
        </div>

        <div className="control-group">
          <div className="control-wrapper">
            <MdMusicNote className="music-icon icon" />
          </div>
          <div className="control-wrapper">
            <BsFillVolumeDownFill className="volume-icon icon" />
          </div>
          <div className="control-wrapper">
            <IoLockOpen className="lock-icon icon" />
          </div>
        </div>
      </div>

      {players.length === 0 && <div className="waiting-players"></div>}

      {players.length > 0 && <button className="start-btn" onClick={handleStartGame}>Start</button>}

      {players.length > 0 &&
        <div className="members-wrapper">
          <MdGroup className="members-icon" />
          <span className="members-count">{players.length}</span>
        </div>}

      <div className="members-display-wrapper">
        {players.map(player => (
          <span key={player.id} className="member-block">{player.name}</span>
        ))}
      </div>

      <div className="countdown-start">{countdown}</div>

      <div className="overlay" />
    </div>
  );
}

export default HostGameWaiting;