import './GameReports.scss';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdMore } from 'react-icons/io';
import { BsChevronDown } from 'react-icons/bs';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

const temp = ['', '', '', '', ''];

function GameReports() {
  const navigate = useNavigate();

  const handleReportItemClick = (e, id) => {
    if (!e.target.classList.contains('manipulation-btn')) {
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
        // console.log('vgvuyvu')
        maniBtnList.forEach(maniButton => {
          maniButton.nextSibling?.classList?.remove('active');
        })
      }
    }

    document.addEventListener('click', handleManip);

    return () => document.removeEventListener('click', handleManip);
  }, []);

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
          {temp.map((item, index) => (
            <div className="report-item" key={index} onClick={(e) => handleReportItemClick(e, 1)}>
              <div className="quiz-name fl-45">Physical Science: The Energy of Holiday Lights</div>
              <div className="game-mode fl-15">Classic</div>
              <div className="report-date fl-26">December 1, 2021, 10:33 AM</div>
              <div className="players fl-10">11</div>
              <div className="manipulation fl-4">
                <IoMdMore className="manipulation-btn" onClick={handleManipulation} />
                <ul className="mani-options">
                  <li className="mani-opt">Play again</li>
                  <li className="mani-opt">Download report</li>
                  <li className="mani-opt">Move to trash</li>
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