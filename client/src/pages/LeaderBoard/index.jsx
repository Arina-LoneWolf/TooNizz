import './LeaderBoard.scss';
import React from 'react';
import background from '../../assets/images/space-bg-13.jpg';

const leaders = [
  {
    name: 'Trinh',
    score: 1350
  },
  {
    name: 'Tu',
    score: 879
  },
  {
    name: 'Helen',
    score: 774
  },
  {
    name: 'Andrew',
    score: 592
  },
  {
    name: 'Dani',
    score: 250
  },
];

// tạm thui, mốt gộp vô chung với HostGameControl
function LeaderBoard() {
  return (
    <div className="temporary-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="leader-board-lb">Leader Board</div>
        <div className="leaders-list">
          {leaders.map(leader => (
            <div className="top-player-card" key={leader.name}>
              <span className="player-name">{leader.name}</span>
              <span className="player-score">{leader.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeaderBoard;