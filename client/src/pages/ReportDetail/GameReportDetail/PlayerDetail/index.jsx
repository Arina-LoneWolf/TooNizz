import './PlayerDetail.scss';
import React from 'react';
import { playerDetailShowVar } from '../../../../shared/apolloLocalState/popupFormState';
import { BsPerson } from 'react-icons/bs';
import { MdOutlineClose, MdOutlineCheck } from 'react-icons/md';
import { RiMedalFill } from 'react-icons/ri';
import { BsBarChartFill, BsQuestionCircleFill } from 'react-icons/bs';

function PlayerDetail({ player, playerNumbers }) {
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
            <div className="player-name">{player.name}</div>
          </div>
          <MdOutlineClose className="close-icon" onClick={handleClosing} />
        </div>

        <div className="popup-body">
          <div className="general">
            <div className="correct-rate">
              <div className="rate-number">{player.correctPercentAnswers}%</div>
              <div className="des-text">correct</div>
            </div>

            <div className="rank-score">
              <div className="player-rank">
                <span className="title">Rank</span>
                <span className="value">
                  <BsBarChartFill className="icon" />
                  {player.rank} of {playerNumbers}
                </span>
              </div>

              <div className="player-final-score">
                <span className="title">Final score</span>
                <span className="value">
                  <RiMedalFill className="icon" />
                  {player.finalScore}
                </span>
              </div>
            </div>

            <div className="questions-answered-wrapper">
              <div className="questions-answered">
                <span className="title">Questions answered</span>
                <span className="value">
                  <BsQuestionCircleFill className="icon" />
                  {player.detailAllQuestions.length - player.unAnswered} of {player.detailAllQuestions.length}
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
              {player?.detailAllQuestions.map(question => (
                <div className="table-item" key={question._id}>
                  <div className="question-content fl-25">{question.content}</div>
                  <div className="question-type fl-15">Single-choice</div>
                  <div className="question-answered fl-25">{question.answered[0]}</div>
                  <div className="correct-incorrect fl-20">
                    {question.correct ? <MdOutlineCheck className="answer-result-icon correct" /> : <MdOutlineClose className="answer-result-icon incorrect" />}
                    <span className="answer-result">{question.correct ? 'Correct' : 'Incorrect'}</span>
                  </div>
                  <div className="question-time fl-5">{question.time}</div>
                  <div className="question-score fl-10">{question.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetail;