import './Sidebar.scss';
import React from 'react';

function Navigation() {
  return (
    <div className="navigation">
      <ul className="navigation-group">
        <li className="explore"></li>
        <li className="collections"></li>
        <li className="reports"></li>
      </ul>

      <div className="create-btn"></div>
    </div>
  );
}

export default Navigation;