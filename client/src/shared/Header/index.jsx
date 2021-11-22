import './Header.scss';
import React from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { quizCreationShowVar } from '../apolloLocalState/popupFormState';
import { IoSearchOutline } from 'react-icons/io5';
import { BsList } from 'react-icons/bs';
import { IoNotificationsOutline } from 'react-icons/io5';
import QuizCreationForm from './QuizCreationForm';

const avatar = 'https://i.pinimg.com/564x/0b/97/f5/0b97f53a14d3b0698c1388b013ecabfa.jpg';

function Header() {
  const navigate = useNavigate();

  const quizCreationShow = useReactiveVar(quizCreationShowVar);

  const goToGameEntry = () => {
    navigate('/');
  }

  const showQuizCreationForm = () => {
    quizCreationShowVar(true);
  }

  // const atEntry = useMatch('/');
  // const atAuthentication = useMatch('/authentication');


  // if (atEntry || atAuthentication) return null;

  return (
    <div className="header">
      <BsList className="side-btn" />

      <div className="logo">LOGO</div>

      <div className="create-btn" onClick={showQuizCreationForm}>Create +</div>

      <div className="search-bar">
        <input placeholder="Search" />
        <IoSearchOutline className="search-icon" />
      </div>

      <div className="join-btn" onClick={goToGameEntry}>Join</div>

      <div className="user-btn-group">
        <IoSearchOutline className="search-btn" />

        <IoNotificationsOutline className="noti-icon" />

        <div className="avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
      </div>

      {quizCreationShow && <QuizCreationForm />}
    </div>
  );
}

export default Header;