import './PlayerDetail.scss';
import React from 'react';
import { playerDetailShowVar } from '../../../../shared/apolloLocalState/popupFormState';
import { BsPerson } from 'react-icons/bs';
import { MdOutlineClose, MdOutlineCheck } from 'react-icons/md';
import { RiMedalFill } from 'react-icons/ri';
import { BsBarChartFill, BsQuestionCircleFill } from 'react-icons/bs';

function PlayerDetail() {
  const handleClosing = () => {
    playerDetailShowVar(false);
  }

  return (
    <div className="player-detail">
      <div id="overlay" />
      <div className="popup-container">
        <div className="popup-header">
          <div className="player-name-group">
            <BsPerson className="player-icon" />
            <div className="player-name">Arina</div>
          </div>
          <MdOutlineClose className="close-icon" onClick={handleClosing} />
        </div>

        <div className="popup-body">
          <div className="general">
            <div className="correct-rate">
              <div className="rate-number">40%</div>
              <div className="des-text">correct</div>
            </div>

            <div className="rank-score">
              <div className="player-rank">
                <span className="title">Rank</span>
                <span className="value">
                  <BsBarChartFill className="icon" />
                  2 of 11
                </span>
              </div>

              <div className="player-final-score">
                <span className="title">Final score</span>
                <span className="value">
                  <RiMedalFill className="icon" />
                  3101
                </span>
              </div>
            </div>

            <div className="questions-answered-wrapper">
              <div className="questions-answered">
                <span className="title">Questions answered</span>
                <span className="value">
                  <BsQuestionCircleFill className="icon" />
                  9 of 10
                </span>
              </div>
            </div>
          </div>

          <div className="table-detail">
            <div className="heading">
              <div className="question-content-heading fl-25">Question</div>
              <div className="question-type-heading fl-15">Type</div>
              <div className="answered-heading fl-25">Answered</div>
              <div className="correct-incorrect-heading fl-20">Correct/incorrect</div>
              <div className="question-time-heading fl-5">Time</div>
              <div className="question-score-heading fl-10">Score</div>
            </div>

            <div className="body">
              <div className="table-item">
                <div className="question-content fl-25">When was I born?</div>
                <div className="question-type fl-15">Multiple-choice</div>
                <div className="question-answered fl-25">Going out with friends</div>
                <div className="correct-incorrect fl-20">
                  <MdOutlineCheck className="answer-result-icon correct" />
                  <span className="answer-result">Correct</span>
                </div>
                <div className="question-time fl-5">11.7s</div>
                <div className="question-score fl-10">805</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetail;