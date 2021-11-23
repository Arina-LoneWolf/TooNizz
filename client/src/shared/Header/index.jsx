import './Header.scss';
import React, { useEffect } from 'react';
import { useNavigate, useMatch, Link } from 'react-router-dom';
import { USER_INFO } from '../../apis/userApi';
import { useReactiveVar, useQuery, useApolloClient } from '@apollo/client';
import { quizCreationShowVar } from '../apolloLocalState/popupFormState';
import { IoSearchOutline } from 'react-icons/io5';
import { BsList } from 'react-icons/bs';
import { IoNotificationsOutline } from 'react-icons/io5';
import QuizCreationForm from './QuizCreationForm';

const avatar = 'https://i.pinimg.com/564x/0b/97/f5/0b97f53a14d3b0698c1388b013ecabfa.jpg';

function Header() {
  const { data, loading, error, refetch } = useQuery(USER_INFO);

  const client = useApolloClient();

  const navigate = useNavigate();

  const quizCreationShow = useReactiveVar(quizCreationShowVar);

  const goToGameEntry = () => {
    navigate('/');
  }

  const showQuizCreationForm = () => {
    quizCreationShowVar(true);
  }

  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data]);

  useEffect(() => {
    const handleAuthentication = (e) => {
      console.log(e)
      if (e.key === 'token') {
        console.log('wfeqgwhw');
        if (e.oldValue && !e.newValue) {
          refetch();
          client.clearStore();
        } else if (e.newValue) {
          console.log('refetch');
          refetch();
        }
      }
    }

    window.addEventListener('storage', handleAuthentication)

    return function cleanup() {
      window.removeEventListener('storage', handleAuthentication)
    }
  }, []);

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

      {!data &&
        <div className="auth-btn-group">
          <Link to="/authentication/login" className="login-btn">Login</Link>
          <Link to="/authentication/signup" className="signup-btn">Sign up</Link>
        </div>}

      {data &&
        <div className="user-btn-group">
          <IoSearchOutline className="search-btn" />

          <IoNotificationsOutline className="noti-icon" />

          <div className="avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
        </div>}

      {quizCreationShow && <QuizCreationForm />}
    </div>
  );
}

export default Header;