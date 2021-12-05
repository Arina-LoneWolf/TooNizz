import './QuizEditor.scss';
import React from 'react';
import MultiChoiceQuestion from './MultiChoiceQuestion';
import { BiDuplicate } from 'react-icons/bi';
import { MdTimer } from 'react-icons/md';
import { RiDeleteBin4Line, RiDeleteBinLine, RiDeleteBin7Line, RiDeleteBin6Line, RiMedalLine } from 'react-icons/ri';
import { BsPatchQuestionFill, BsPatchQuestion } from 'react-icons/bs';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

const questions = ['', '', '', '', ''];

function QuizEditor() {
  return (
    <div className="quiz-editor">
      <div className="questions-list">
        {questions.map((question, index) => (
          <div className="question-choice">
            <div className="question-header">
              <div className="question-heading">
                <div className="question-number">{index + 1}</div>
                <div className="question-type">Multiple-choice</div>
              </div>
              <div className="question-mani">
                <BiDuplicate className="duplicate-btn-icon" />
                <RiDeleteBin6Line className="delete-btn-icon" />
              </div>
            </div>
            <div className="question-preview"></div>
          </div>
        ))}
      </div>

      <div className="question-editor">
        <MultiChoiceQuestion />
      </div>

      <div className="question-settings">
        <div className="settings-group">
          <div className="settings-option">
            <div className="settings-opt-label">
              <AiOutlineQuestionCircle className="question-type-icon" />
              <span>Question Type</span>
            </div>
            <select name="question-type">
              <option value="multiple-choice">Multiple-choice</option>
              <option value="type-answer">Type answer</option>
              <option value="true-false">True/false</option>
              <option value="poll">Poll</option>
            </select>
          </div>

          <div className="settings-option">
            <div className="settings-opt-label">
              <MdTimer className="time-limit-icon" />
              <span>Time Limit</span>
            </div>
            <select name="time-limit">
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="20">20 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minutes</option>
              <option value="90">1 min 30 sec</option>
              <option value="120">2 minutes</option>
              <option value="240">4 minutes</option>
            </select>
          </div>

          <div className="settings-option">
            <div className="settings-opt-label">
              <RiMedalLine className="points-icon" />
              <span>Points</span>
            </div>
            <select name="points">
              <option value="standard">Standard</option>
              <option value="double">Double points</option>
              <option value="no-points">No points</option>
            </select>
          </div>
        </div>

        <div className="question-manipulation">
          <div className="delete-btn">Delete</div>
          <div className="duplicate-btn">Duplicate</div>
        </div>
      </div>
    </div>
  );
}

export default QuizEditor;