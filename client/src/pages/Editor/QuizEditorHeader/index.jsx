import './QuizEditorHeader.scss';
import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';

function QuizEditorHeader({ quizInitial }) {
  const [quizName, setQuizName] = useState(quizInitial.quizName);

  return (
    <div className="quiz-editor-header">
      <div className="left-part">
        <div className="logo">TooNizz</div>
        <div className="quiz-title-mani">
          <div className="quiz-title" contentEditable>{quizName}</div>
          <MdEdit className="title-edit-icon" />
        </div>
      </div>

      <div className="right-part">
        <div className="settings-btn">Settings</div>
        <div className="save-btn">Save</div>
        <div className="exit-btn">Exit</div>
      </div>
    </div>
  );
}

export default QuizEditorHeader;