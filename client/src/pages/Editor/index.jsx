import React from 'react';
import Header from './QuizEditorHeader';
import QuizEditor from './QuizEditor';
import { useLocation } from 'react-router-dom';

function Editor() {
  const { state } = useLocation();

  return (
    <React.Fragment>
      <Header quizInitial={state} />
      <QuizEditor />
    </React.Fragment>
  );
}

export default Editor;