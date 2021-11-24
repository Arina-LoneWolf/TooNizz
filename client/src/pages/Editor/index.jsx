import React from 'react';
import Header from './QuizEditorHeader';
import QuizEditor from './QuizEditor';

function Editor() {
  return (
    <React.Fragment>
      <Header />
      <QuizEditor />
    </React.Fragment>
  );
}

export default Editor;