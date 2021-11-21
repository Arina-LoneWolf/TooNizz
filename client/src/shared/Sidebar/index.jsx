import './Sidebar.scss';
import React, { useRef } from 'react';
// import explore from '../../assets/icons/explore_flat.svg';
import explore from '../../assets/icons/search_fill.svg';
// import collection from '../../assets/icons/collection_flat.svg';
import collection from '../../assets/icons/folder.svg';
// import report from '../../assets/icons/report_flat.svg';
import report from '../../assets/icons/chart.svg';

function Navigation() {
  const exploreRef = useRef(null);
  const collectionsRef = useRef(null);
  const reportsRef = useRef(null);

  const handleNavigate = (e) => {

  }

  return (
    <ul className="navigation">
      <li className="explore active" ref={exploreRef}>
        <img src={explore} alt="explore_icon" />
      </li>
      <li className="collections" ref={collectionsRef}>
        <img src={report} alt="collection_icon" />
      </li>
      <li className="reports" ref={reportsRef}>
        <img src={collection} alt="report_icon" />
      </li>
    </ul>
  );
}

export default Navigation;