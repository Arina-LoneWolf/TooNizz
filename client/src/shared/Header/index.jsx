import './Header.scss';
import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsList } from 'react-icons/bs';

function Header() {
  return (
    <div className="header">
      <div className="side-btn">
        <BsList className="side-icon" />
      </div>

      <div className="logo">LOGO</div>

      <div className="create-btn">Create</div>

      <div className="search-bar">
        <input placeholder="Search" />
        <IoSearchOutline className="search-icon" />
      </div>

      <div className="btn-group">
        <div className="enter-code-btn">Enter code</div>

        <div className="search-btn">
          <IoSearchOutline className="search-icon" />
        </div>

        <div className="notifications">
          <IoMdNotificationsOutline className="notification-icon" />
        </div>

        <div className="avatar"></div>
      </div>
    </div>
  );
}

export default Header;