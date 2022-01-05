import './GameReports.scss';
import React, { useEffect } from 'react';
import { useQuery, useLazyQuery, useReactiveVar } from "@apollo/client";
import { dialogVar } from '../../../shared/apolloLocalState/popupAlertState';
import { GET_ALL_REPORTS, DOWNLOAD_REPORT, DELETE_REPORT } from '../../../apis/reportApi';
import { useNavigate } from 'react-router-dom';
import { IoMdMore } from 'react-icons/io';
import { BsChevronDown } from 'react-icons/bs';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

const temp = ['', '', '', '', ''];

function GameReports() {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_ALL_REPORTS);
  const [downloadReport, { data: reportLink }] = useLazyQuery(DOWNLOAD_REPORT, {
    onCompleted: () => {
      window.open(reportLink.DownloadReport);
    }
  });
  const [deleteReport, { data: deleteMessage }] = useLazyQuery(DELETE_REPORT, {
    onCompleted: () => {
      console.log(deleteMessage);
    }
  })

  const handleReportItemClick = (e, id) => {
    if (!e.target.classList.contains('manipulation-btn') && !e.target.classList.contains('mani-opt')) {
      navigate(`/reports/detail/${id}`);
    }
  }

  const handleManipulation = (e) => { // chưa ok
    const manipulation = e.target.nextSibling;
    if (!manipulation) return;

    if (manipulation.classList.contains('active')) {
      manipulation.classList.remove('active');
    } else {
      manipulation.classList.add('active');
    }
  }

  useEffect(() => {
    const handleManip = (e) => {
      const maniBtnList = document.querySelectorAll('.manipulation-btn');
      if (!e.target.classList.contains('manipulation-btn')) {
        maniBtnList.forEach(maniButton => {
          maniButton.nextSibling?.classList?.remove('active');
        })
      }
    }

    document.addEventListener('click', handleManip);

    return () => document.removeEventListener('click', handleManip);
  }, []);

  const convertDate = (reportDate) => {
    let date = new Date(parseInt(reportDate));
    date = date.toUTCString().split(' ');
    return `${date[1]} ${date[2]} ${date[3]} ${date[4]}`;
  }

  const handleDownloadReport = (reportId) => {
    downloadReport({
      variables: {
        reportId
      }
    });
  }

  const handleDeleteReport = (reportId) => {
    dialogVar({
      show: true,
      message: 'Are you sure you want to delete the report?',
      acceptButtonName: 'Delete',
      func: () => {
        // deleteReport({
        //   variables: {
        //     reportId
        //   }
        // });
      }
    });
  }

  return (
    <div className="game-report">
      <h1>My Reports</h1>
      <div className="reports-list">
        <div className="heading">
          <div className="quiz-name-heading fl-45">
            Name
            <BiChevronDown className="icon down" />
          </div>
          <div className="game-mode-heading fl-15">Game mode</div>
          <div className="date-heading fl-26">
            Date
            <BiChevronDown className="icon down" />
          </div>
          <div className="players-heading fl-10">
            Players
            <BiChevronDown className="icon down" />
          </div>
          <div className="manipulation fl-4"></div>
        </div>

        <div className="body">
          {data?.GetAllReports?.reports?.map((report) => (
            <div className="report-item" key={report._id} onClick={(e) => handleReportItemClick(e, report._id)}>
              <div className="quiz-name fl-45">{report.name}</div>
              <div className="game-mode fl-15">{report.gameMode}</div>
              <div className="report-date fl-26">{convertDate(report.createdAt)}</div>
              <div className="players fl-10">{report.players.length}</div>
              <div className="manipulation fl-4">
                <IoMdMore className="manipulation-btn" onClick={handleManipulation} />
                <ul className="mani-options">
                  <li className="mani-opt">Play again</li>
                  <li className="mani-opt" onClick={() => handleDownloadReport(report._id)}>Download report</li>
                  <li className="mani-opt" onClick={() => handleDeleteReport(report._id)}>Move to trash</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameReports;