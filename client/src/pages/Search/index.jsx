import React from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import QuizSearch from './QuizSearch';

function Search() {
  return (
    <React.Fragment>
      <Sidebar />
      <Header />
      <QuizSearch />
    </React.Fragment>
  );
}

export default Search;