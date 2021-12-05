import './MultipleChoice.scss';
import React from 'react';
import { BsPeopleFill, BsStopFill, BsFillCaretRightFill, BsDisplayFill, BsLaptopFill } from 'react-icons/bs';

const media = 'https://cdn.wallpapersafari.com/45/55/wjCLM0.png';

function MultipleChoice() {
  return (
    <React.Fragment>
      <div className="question" placeholder="Type your question" contentEditable />

      <div className="middle-wrapper">
        {/* <label htmlFor="" style={{ backgroundImage: `url(${background})` }}></label> */}
        <label className="media" htmlFor="" />
      </div>

      <div className="answer-options">
        <div className="answer opt-1" placeholder="Type answer" contentEditable />
        <div className="answer opt-2" placeholder="Type answer" contentEditable />
        <div className="answer opt-3" placeholder="Type answer" contentEditable />
        <div className="answer opt-4" placeholder="Type answer" contentEditable />
      </div>
    </React.Fragment>
  );
}

export default MultipleChoice;