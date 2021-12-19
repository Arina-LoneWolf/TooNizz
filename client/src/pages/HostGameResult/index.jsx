import './HostGameResult.scss';
import React from 'react';
import background from '../../assets/images/space-bg-13.jpg';
import { FaStar } from 'react-icons/fa';

// ko biết nên làm trang riêng như này hay là để tạm thôi nữa

function HostGameResult() {
  return (
    <div className="temporary-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="test-name-lb">Chemistry Test</div>

        <div className="last-rank">
          <div className="rank-2 rank-bar">
            <div className="player-name">Arina</div>
            <div className="top-info">
              <FaStar className="top-icon" />
              <div className="player-score">1240</div>
              <div className="rank-number">2</div>
            </div>
          </div>

          <div className="rank-1 rank-bar">
            <div className="player-name">Trinh</div>
            <div className="top-info">
              <FaStar className="top-icon" />
              <div className="player-score">3246</div>
              <div className="rank-number rank-number-1">1</div>
            </div>
          </div>

          <div className="rank-3 rank-bar">
            <div className="player-name">Aroma</div>
            <div className="top-info">
              <FaStar className="top-icon" />
              <div className="player-score">897</div>
              <div className="rank-number">3</div>
            </div>
          </div>
        </div>

        <div className="finish-btn">Finish</div>
      </div>
    </div>
  );
}

export default HostGameResult;