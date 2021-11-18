import '../AuthForm.scss';
import React from 'react';
import { FcGoogle } from "react-icons/fc";

function SignUpForm() {
  return (
    <form id="sign-up-form">
      <h3>Welcome to TooNizz</h3>

      <div className="google-submit-btn">
        <FcGoogle className="google-icon" />
        <span>Continue with Google</span>
      </div>

      <div className="strike">
        <span>OR</span>
      </div>

      <div className="form-control">
        <label>Sign up with email</label>
        <input type="email" name="email" />
      </div>

      <div className="form-control">
        <label>Your name</label>
        <input name="name" />
      </div>

      <div className="form-control">
        <label>Password</label>
        <input type="password" name="password" />
      </div>

      <div className="form-control">
        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" />
      </div>

      <button type="submit" className="submit-btn">Sign up</button>

      <div className="have-account-ask">Have an account? <span className="switch-form">Login</span></div>
    </form>
  );
}

export default SignUpForm;