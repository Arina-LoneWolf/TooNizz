import './HostQuestionResult.scss';
import React from 'react';
import { BsCheck } from 'react-icons/bs';
import background from '../../assets/images/space-bg-13.jpg';

// tạm thôi. Giả sử đáp án thứ 2 là đáp án đúng

const answers = [8, 4, 2, 6];

function HostQuestionResult() {
  return (
    <div className="temporary-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="answers-analysis">
          <div className="answer-bar opt-1">
            <span>8</span>
          </div>
          <div className="answer-bar opt-2 tick">
            <span>
              4
              <BsCheck className="tick-icon" />
            </span>
          </div>
          <div className="answer-bar opt-3">
            <span>2</span>
          </div>
          <div className="answer-bar opt-4">
            <span>6</span>
          </div>
        </div>

        <div className="next-btn">Next</div>
      </div>
    </div>
  );
}

export default HostQuestionResult;