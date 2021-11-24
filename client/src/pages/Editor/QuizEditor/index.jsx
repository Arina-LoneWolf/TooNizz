import './QuizEditor.scss';
import React from 'react';
import MultiChoiceQuestion from './MultiChoiceQuestion';

const questions = ['', '', '', ''];

function QuizEditor() {
  return (
    <div className="quiz-editor">
      <div className="questions-list">
        {questions.map(question => (
          <div className="question-choice">
            <div className="question-header">
              <div className="question-number">1</div>
              <div className="question-type">Multi-choice</div>
              <div className="question-mani">
                {/* icon */}
                {/* icon */}
              </div>
            </div>
            <div className="question-preview"></div>
          </div>
        ))}
      </div>

      <MultiChoiceQuestion />

      <div className="question-settings">
        <label>Question Type</label>
        <select name="question-type">
          <option value="multi-choice">Multi-choice</option>
          <option value="type-answer">Type answer</option>
          <option value="true-false">True/false</option>
          <option value="poll">Poll</option>
        </select>

        <label>Time limit</label>
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

        <label>Points</label>
        <select name="points">
          <option value="standard">Standard</option>
          <option value="double">Double points</option>
          <option value="no-points">No points</option>
        </select>

        <div className="question-manipulation">
          <div className="delete-btn">Delete</div>
          <div className="duplicate-btn">Duplicate</div>
        </div>
      </div>
    </div>
  );
}

export default QuizEditor;