import './HostGameWaiting.scss';
import React, { useEffect, useState } from 'react';
import socket from '../../shared/socket';
// import { useReactiveVar } from '@apollo/client';
// import { socketVar } from '../../shared/apolloLocalState/socketState';
import { MdGroup, MdMusicNote } from 'react-icons/md';
import { RiMusic2Line, RiMusic2Fill } from 'react-icons/ri';
import { BsMusicNoteBeamed, BsFillVolumeDownFill } from 'react-icons/bs';
import { IoLockOpen, IoLockClosed, IoLockOpenOutline, IoLockClosedOutline } from 'react-icons/io5'
import background from '../../assets/images/space-bg-5.jpg';

const quizSetId = '619b6629ad2e4c2a48924f7f';
// const players = ['Tran', 'Hung', 'Phi Long', 'Trinh', 'YasuoGankTem15p', 'Tho bay mau', 'chim en', 'blue', 'kakakak', 'syndra', 'annie', 'Ju Dan Te', 'Oh Yoon Hi', 'Ju Seokyung', 'Lee Suho', 'Im Ju Gyeong'];
// chưa xong UI
// 7219348
function HostGameWaiting() {
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([]);

  // const socket = useReactiveVar(socketVar);

  useEffect(() => {
    socket.emit('classic:host-join', quizSetId);

    socket.on('classic:sv-send-gamePin', (code) => {
      setGameCode(code);
    });

    socket.on('classic:update-listPlayers', (playerList) => {
      setPlayers(playerList);
    })
  }, []);

  return (
    <div className="host-game-waiting" style={{ backgroundImage: `url(${background})` }}>
      <div className="game-code-title">Game code</div>
      <div className="game-code-wrapper">
        <div className="game-code-number">{gameCode}</div>
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

      {players.length === 0 && <div className="waiting-players">Waiting for players...</div>}

      {players.length > 0 && <button className="start-btn">Start</button>}

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
    </div>
  );
}

export default HostGameWaiting;