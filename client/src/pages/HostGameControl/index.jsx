import './HostGameControl.scss';
import React from 'react';
import { BsPeopleFill, BsStopFill, BsFillCaretRightFill, BsDisplayFill, BsLaptopFill } from 'react-icons/bs';
import background from '../../assets/images/space-bg-13.jpg';

function HostGameControl() {
  return (
    <div className="host-game-control" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="question">Which of the following statements are true?</div>

        <div className="middle-wrapper">
          <div className="question-time">30</div>
          <img src="https://cdn.wallpapersafari.com/45/55/wjCLM0.png" alt="" className="media" />
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
    </div>
  );
}

export default HostGameControl;