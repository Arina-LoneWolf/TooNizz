import React from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import GameReport from './GameReports';

function Reports() {
  return (
    <React.Fragment>
      <Sidebar />
      <Header />
      <GameReport />
    </React.Fragment>
  );
}

export default Reports;