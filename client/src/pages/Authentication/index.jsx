import './Authentication.scss';
import React from 'react';
import { useParams } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import background from '../../assets/images/auth-background-4.png';

const formOption = {
  login: <LoginForm />,
  signup: <SignUpForm />
};

function Authentication() {
  const { formType } = useParams();

  return (
    <div className="authentication" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay" />
      {formOption[formType]}
    </div>
  );
}

export default Authentication;