import './HostGameWaiting.scss';
import { gsap } from 'gsap';
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

  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const intervalRef = useRef();

  const el = useRef();
  const q = gsap.utils.selector(el);
  const tlStart = useRef();

  useEffect(() => {
    gsap.timeline()
      .to(q('.overlay'), { opacity: 0, duration: 1 })
      .to(q('.overlay'), { display: 'none' })

    // window.addEventListener('beforeunload', (e) => {
    //   return e.returnValue = '';
    // });

    socket.emit('classic:host-join', quizSetId);

    socket.on('classic:sv-send-game-pin', (code) => {
      setGameCode(code);
    });

    socket.on('classic:update-list-players', (playerList) => {
      setPlayers(playerList);
    });
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
    if (countdown < 1) {
      clearInterval(intervalRef.current);
    }
  }, [countdown]);


  const handleStartGame = () => {
    tlStart.current = gsap.timeline({
      onComplete: () => {
        // navigate('/gameplay/admin', { replace: true });
        console.log('countdown start');
        intervalRef.current = setInterval(handleCountdown, 1000);
      }
    }).addLabel('start')
      .to(q('.upper-half'), { y: '-100%' }, 'start')
      .to(q('.start-btn'), { opacity: 0 }, 'start')
      .to(q('.members-wrapper'), { opacity: 0 }, 'start')
      .to(q('.members-display-wrapper'), { y: '50vh' }, 'start')
      .to(q('.countdown-start'), { display: 'block', width: '100vw', opacity: 1, duration: 0.8, ease: "circ.easeIn" })
      .to(q('.countdown-start'), { color: 'white', duration: 0.1 })
    // .to(q('.host-game-waiting .overlay'), { display: 'block', opacity: 1, duration: 0.5 })
      // console.log('line appear');
    // gsap.timeline()
      // .to(q('.countdown-start'), { display: 'block', opacity: 1, duration: 1.2, ease: "circ.easeIn" })
      // .to(q('.countdown-start'), { color: 'white', duration: 0.2 }, '-=50%')
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

      {/* {players.length === 0 && <div className="waiting-players">Waiting for players...</div>} */}

      {/* {players.length > 0 && <button className="start-btn" onClick={handleStartGame}>Start</button>} */}
      <button className="start-btn" onClick={handleStartGame}>Start</button>

      {/* {players.length > 0 &&
        <div className="members-wrapper">
          <MdGroup className="members-icon" />
          <span className="members-count">{players.length}</span>
        </div>} */}

      <div className="members-wrapper">
        <MdGroup className="members-icon" />
        <span className="members-count">{players.length}</span>
      </div>

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