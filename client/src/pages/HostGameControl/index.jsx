import './HostGameControl.scss';
import React from 'react';
// import background from '../../assets/images/sky-bg-1.jpg';
// import background from '../../assets/images/space-bg-9.jpg';
import background from '../../assets/images/space-bg-13.jpg';
// import background from '../../assets/gifs/star-fall.gif';

function HostGameControl() {
  return (
    <div className="host-game-control" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <div className="question">Which of the following statements are true?</div>

        <div className="media-wrapper">
          <div className="question-time">30</div>
          <img src="https://cdn.wallpapersafari.com/45/55/wjCLM0.png" alt="" className="media" />
        </div>

        <div className="answer-options">
          <div className="answer opt-1">It is impossible to lick your own elbow</div>
          <div className="answer opt-2">Saturn is the largest planet by surface area</div>
          <div className="answer opt-3">There's no word in the dictionary that rhymes with orange</div>
          <div className="answer opt-4">French fries originated in France</div>
        </div>

        <div className="control-bar"></div>
      </div>
    </div>
  );
}

export default HostGameControl;