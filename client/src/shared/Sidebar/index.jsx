import './Sidebar.scss';
import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import explore from '../../assets/icons/search_fill.svg';
import collection from '../../assets/icons/folder.svg';
import report from '../../assets/icons/chart.svg';

function Navigation() {
  return (
    <div className="navigation">
      <NavLink to="/home" activeClassName="active">
        <img src={explore} alt="explore_icon" />
      </NavLink>
      <NavLink to="/collections" activeClassName="active">
        <img src={report} alt="collection_icon" />
      </NavLink>
      <NavLink to="/reports" activeClassName="active">
        <img src={collection} alt="report_icon" />
      </NavLink>
    </div>
  );
}

export default Navigation;