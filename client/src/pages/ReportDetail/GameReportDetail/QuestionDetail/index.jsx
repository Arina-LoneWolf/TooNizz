import './QuestionDetail.scss';
import React from 'react';
import { questionDetailShowVar } from '../../../../shared/apolloLocalState/popupFormState';
import { MdOutlineClose, MdOutlineCheck } from 'react-icons/md';
import { BiTimeFive } from 'react-icons/bi';
import noImage from '../../../../assets/images/no-image.jpg';

const testImg = 'https://images.unsplash.com/photo-1593642531955-b62e17bdaa9c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80';

function QuestionDetail({ question, playerNumbers }) {
  const handleClosing = () => {
    questionDetailShowVar(false);
  }

  return (
    <div className="question-detail">
      <div id="overlay" />
      <div className="popup-container">
        <div className="popup-header">
          <div className="question-content">{question.dataQuestion.content}</div>
          <div className="header-end">
            <span className="question-type">Single-choice</span>
            <MdOutlineClose className="close-icon" onClick={handleClosing} />
          </div>
        </div>

        <div className="popup-body">
          <div className="question-detail-wrapper">
            <div className="question-detail">
              <div className="media-wrapper">
                <div className="media" style={{ backgroundImage: `url(${question.dataQuestion.image})` }}></div>
              </div>
              <div className="question-answers">
                {question.dataQuestion.answers.map(answer => (
                  <div className={"answer-opt " + (answer.isCorrect ? "correct" : "")}>
                    <span className="answer">{answer.content}</span>
                    <span className="quantity">{answer.countPlayerAnswer}</span>
                  </div>
                ))}
                <div className="answer-opt no-answer">
                  <span className="answer">No answer</span>
                  <span className="quantity">{question.dataQuestion.countPlayerNoAnswer}</span>
                </div>
              </div>
            </div>

            <div className="question-time-limit">
              <BiTimeFive className="icon" />
              {question.dataQuestion.time}s time limit
            </div>
          </div>

          <div className="general">
            <div className="correct-answers general-item">
              <span className="title">Correct answers</span>
              <span className="value">{question.percentRight}%</span>
            </div>

            <div className="avg-answers-time general-item">
              <span className="title">Avg. answers time</span>
              <span className="value">{question.avgAnswersTime}s</span>
            </div>

            <div className="players-answered general-item">
              <span className="title">Players answered</span>
              <span className="value">{playerNumbers - question.dataQuestion.countPlayerNoAnswer} of {playerNumbers}</span>
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
              {question.detailAllPlayers.map(player => (
                <div className="table-item" key={player._id}>
                  <div className="player-name fl-25">{player.name}</div>
                  <div className="answered fl-40">{player.answered[0]}</div>
                  <div className="correct-incorrect fl-20">
                    {player.correct ? <MdOutlineCheck className="answer-result-icon correct" /> : <MdOutlineClose className="answer-result-icon incorrect" />}
                    <span className="answer-result">{player.correct ? 'Correct' : 'Incorrect'}</span>
                  </div>
                  <div className="time fl-5">{player.time.toFixed(2)}s</div>
                  <div className="score fl-10">{player.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetail;