import '../AuthForm.scss';
import React from 'react';
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
  return (
    <form id="login-form">
      <h3>Login to TooNizz</h3>

      <div className="google-submit-btn">
        <FcGoogle className="google-icon" />
        <span>Continue with Google</span>
      </div>

      <div className="strike">
        <span>OR</span>
      </div>

      <div className="form-control">
        <label>Login with email</label>
        <input type="email" name="email" />
      </div>

      <div className="form-control">
        <label>Password</label>
        <input type="password" name="password" />
      </div>

      <div className="form-control">
        <span className="forgot-password">Forgot password?</span>
      </div>

      <button type="submit" className="submit-btn">Log in</button>

      <div className="have-account-ask">Don't have an account? <span className="switch-form">Sign up</span></div>
    </form>
  );
}

export default LoginForm;