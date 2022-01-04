import './Header.scss';
import React, { useEffect } from 'react';
import { useNavigate, useMatch, Link } from 'react-router-dom';
import { USER_INFO } from '../../apis/userApi';
import { useReactiveVar, useQuery, useApolloClient } from '@apollo/client';
import { quizCreationShowVar } from '../apolloLocalState/popupFormState';
import { userVar } from '../apolloLocalState/userState';
import { IoSearchOutline } from 'react-icons/io5';
import { BsList } from 'react-icons/bs';
import { IoNotificationsOutline } from 'react-icons/io5';
import QuizCreationForm from './QuizCreationForm';

const avatar = 'https://i.pinimg.com/564x/0b/97/f5/0b97f53a14d3b0698c1388b013ecabfa.jpg';

function Header() {
  const { data, loading, error, refetch } = useQuery(USER_INFO, {
    onCompleted: () => {
      userVar(data.getInfo);
    }
  });

  const client = useApolloClient();

  const navigate = useNavigate();

  const quizCreationShow = useReactiveVar(quizCreationShowVar);
  const user = useReactiveVar(userVar);

  const goToGameEntry = () => {
    navigate('/');
  }

  const showQuizCreationForm = () => {
    quizCreationShowVar(true);
  }

  // làm đồng bộ đăng nhập nữa

  const handleAvatarClick = (e) => {
    const userOptions = e.target.querySelector('.user-options');
    if (userOptions?.classList?.contains('active')) {
      userOptions.classList.remove('active');
    } else {
      userOptions?.classList?.add('active');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    userVar({});
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

      {!user.id &&
        <div className="auth-btn-group">
          <Link to="/authentication/login" className="login-btn">Login</Link>
          <Link to="/authentication/signup" className="signup-btn">Sign up</Link>
        </div>}

      {user?.id &&
        <div className="user-btn-group">
          <IoSearchOutline className="search-btn" />

          <IoNotificationsOutline className="noti-icon" />

          <div className="avatar" style={{ backgroundImage: `url(${avatar})` }} onClick={handleAvatarClick}>
            <ul className="user-options">
              <li className="option">Account</li>
              <li className="option" onClick={handleLogout}>Log out</li>
            </ul>
          </div>
        </div>}

      {quizCreationShow && <QuizCreationForm />}
    </div>
  );
}

export default Header;