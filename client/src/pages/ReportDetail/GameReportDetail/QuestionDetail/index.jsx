import './QuestionDetail.scss';
import React from 'react';
import { questionDetailShowVar } from '../../../../shared/apolloLocalState/popupFormState';
import { MdOutlineClose, MdOutlineCheck } from 'react-icons/md';
import { BiTimeFive } from 'react-icons/bi';
import noImage from '../../../../assets/images/no-image.jpg';

const testImg = 'https://images.unsplash.com/photo-1593642531955-b62e17bdaa9c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80';

function QuestionDetail() {
  const handleClosing = () => {
    questionDetailShowVar(false);
  }

  return (
    <div className="question-detail">
      <div id="overlay" />
      <div className="popup-container">
        <div className="popup-header">
          <div className="question-content">When was I born?</div>
          <div className="header-end">
            <span className="question-type">Multiple-choice</span>
            <MdOutlineClose className="close-icon" onClick={handleClosing} />
          </div>
        </div>

        <div className="popup-body">
          <div className="question-detail-wrapper">
            <div className="question-detail">
              <div className="media-wrapper">
                <div className="media" style={{ backgroundImage: `url(${noImage})` }}></div>
              </div>
              <div className="question-answers">
                <div className="answer-opt">
                  <span className="answer">October 22nd, 1967</span>
                  <span className="quantity">1</span>
                </div>
                <div className="answer-opt">
                  <span className="answer">March 17th, 1994</span>
                  <span className="quantity">1</span>
                </div>
                <div className="answer-opt correct">
                  <span className="answer">May 13th, 1996</span>
                  <span className="quantity">3</span>
                </div>
                <div className="answer-opt">
                  <span className="answer">July 3rd, 1989</span>
                  <span className="quantity">2</span>
                </div>
                <div className="answer-opt no-answer">
                  <span className="answer">No answer</span>
                  <span className="quantity">5</span>
                </div>
              </div>
            </div>

            <div className="question-time-limit">
              <BiTimeFive className="icon" />
              30s time limit
            </div>
          </div>

          <div className="general">
            <div className="correct-answers general-item">
              <span className="title">Correct answers</span>
              <span className="value">27%</span>
            </div>

            <div className="avg-answers-time general-item">
              <span className="title">Avg. answers time</span>
              <span className="value">24.84s</span>
            </div>

            <div className="players-answered general-item">
              <span className="title">Players answered</span>
              <span className="value">6 of 11</span>
            </div>
          </div>

          <div className="table-detail">
            <div className="heading">
              <div className="player-name-heading fl-25">Player</div>
              <div className="answered-heading fl-40">Answered</div>
              <div className="correct-incorrect-heading fl-20">Correct/incorrect</div>
              <div className="time-heading fl-5">Time</div>
              <div className="score-heading fl-10">Score</div>
            </div>

            <div className="body">
              <div className="table-item">
                <div className="player-name fl-25">Arina</div>
                <div className="answered fl-40">October 22nd, 1967</div>
                <div className="correct-incorrect fl-20">
                  <MdOutlineClose className="answer-result-icon incorrect" />
                  <span className="answer-result">Incorrect</span>
                </div>
                <div className="time fl-5">15.4s</div>
                <div className="score fl-10">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;