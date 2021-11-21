import './HostGameWaiting.scss';
import React from 'react';
import { MdGroup, MdMusicNote } from 'react-icons/md';
import { RiMusic2Line, RiMusic2Fill } from 'react-icons/ri';
import { BsMusicNoteBeamed, BsFillVolumeDownFill } from 'react-icons/bs';
import { IoLockOpen, IoLockClosed, IoLockOpenOutline, IoLockClosedOutline } from 'react-icons/io5'
import background from '../../assets/images/space-bg-5.jpg';

const players = ['Tran', 'Hung', 'Phi Long', 'Trinh', 'YasuoGankTem15p', 'Tho bay mau', 'chim en', 'blue', 'kakakak', 'syndra', 'annie', 'Ju Dan Te', 'Oh Yoon Hi', 'Ju Seokyung', 'Lee Suho', 'Im Ju Gyeong'];
// chưa xong UI
function HostGameWaiting() {
  return (
    <div className="host-game-waiting" style={{ backgroundImage: `url(${background})` }}>
      <div className="game-code-title">Game code</div>
      <div className="game-code-wrapper">
        <div className="game-code-number">7219348</div>
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

      <button className="start-btn">Start</button>

      <div className="members-wrapper">
        <MdGroup className="members-icon" />
        <span className="members-count">{players.length}</span>
      </div>

      {/* <div className="starting-wrapper">
        <button className="start-btn">Start</button>
        <div className="members-wrapper">
          <MdGroup className="members-icon" />
          <span className="members-count">{players.length}</span>
        </div>
      </div> */}

      <div className="members-display-wrapper">
        {players.map(player => (
          <span key={player} className="member-block">{player}</span>
        ))}
      </div>
    </div>
  );
}

export default HostGameWaiting;