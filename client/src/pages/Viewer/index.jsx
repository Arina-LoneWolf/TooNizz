import React from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import QuizViewer from './QuizViewer';

function Viewer() {
  return (
    <React.Fragment>
      <Sidebar />
      <Header />
      <QuizViewer />
    </React.Fragment>
  );
}

export default Viewer;