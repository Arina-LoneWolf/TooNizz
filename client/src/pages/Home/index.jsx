import React from 'react';
import TopQuizSets from'./TopQuizSets';
import Header from '../../shared/Header';
import Sidebar from '../../shared/Sidebar';

function Home() {
  return (
    <React.Fragment>
      <Header />
      <Sidebar />
      <TopQuizSets />
    </React.Fragment>
  );
}

export default Home;