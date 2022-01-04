import React from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import GameReportDetail from './GameReportDetail';

function ReportDetail() {
  return (
    <React.Fragment>
      <Sidebar />
      <Header />
      <GameReportDetail />
    </React.Fragment>
  );
}

export default ReportDetail;