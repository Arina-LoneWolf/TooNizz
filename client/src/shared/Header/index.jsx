import './Header.scss';
import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsList } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { IoNotificationsOutline } from 'react-icons/io5';

const avatar = 'https://i.pinimg.com/564x/0b/97/f5/0b97f53a14d3b0698c1388b013ecabfa.jpg';

function Header() {
  return (
    <div className="header">
      <BsList className="side-btn" />

      <div className="logo">LOGO</div>

      <div className="create-btn">Create +</div>

      <div className="search-bar">
        <input placeholder="Search" />
        <IoSearchOutline className="search-icon" />
      </div>

      <div className="join-btn">Join</div>

      <div className="btn-group">
        <IoSearchOutline className="search-btn" />

        <IoNotificationsOutline className="noti-icon" />

        <div className="avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
      </div>
    </div>
  );
}

export default Header;