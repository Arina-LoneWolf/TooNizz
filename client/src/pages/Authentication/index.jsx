import './Authentication.scss';
import React from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import background from '../../assets/images/auth-background-4.png';

function Authentication() {
  return (
    <div className="authentication" style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <LoginForm />
        {/* <SignUpForm /> */}
      </div>
    </div>
  );
}

export default Authentication;