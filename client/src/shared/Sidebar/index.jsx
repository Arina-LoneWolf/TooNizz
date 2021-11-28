import './Sidebar.scss';
import React from 'react';
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
      <NavLink to="/reports" activeClassName="active">
        <img src={report} alt="report_icon" />
      </NavLink>
      <NavLink to="/collection" activeClassName="active">
        <img src={collection} alt="collection_icon" />
      </NavLink>
    </div>
  );
}

export default Navigation;