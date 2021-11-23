import React from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import QuizCollection from './QuizCollection';

function Collection() {
  return (
    <React.Fragment>
      <Sidebar />
      <Header />
      <QuizCollection />
    </React.Fragment>
  );
}

export default Collection;