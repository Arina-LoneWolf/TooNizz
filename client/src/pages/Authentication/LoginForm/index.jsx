import '../AuthForm.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import TextError from '../../../shared/alerts/TextError';
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string()
    .required('Please enter email')
    .email('Invalid email'),
  password: yup.string()
    .required('Please enter password')
    .min(6, 'Password must be at least 6 characters')
});

function LoginForm() {
  const onGoogleSuccess = (res) => {
    console.log(res);
    const request = { tokenId: res.tokenId };
  }

  const onGoogleFailure = (res) => { }

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (values) => {
    const request = {
      email: values.email,
      password: values.password
    }
    console.log(request);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="login-form"
    >
      <h3>Login to TooNizz</h3>

      <GoogleLogin
        clientId="941926115379-6cbah41jf83kjm236uimrtjdr62t7k71.apps.googleusercontent.com"
        cookiePolicy={'single_host_origin'}
        onSuccess={onGoogleSuccess}
        onFailure={onGoogleFailure}
        render={renderProps => (
          <div onClick={renderProps.onClick} className="google-submit-btn">
            <FcGoogle className="google-icon" />
            <span>Continue with Google</span>
          </div>
        )}
      />

      <div className="strike">
        <span>OR</span>
      </div>

      <div className="form-control">
        <label>Login with email</label>
        <input {...register("email")} type="email" />
        <TextError>{errors.email?.message}</TextError>
      </div>

      <div className="form-control">
        <label>Password</label>
        <input {...register("password")} type="password" />
        <TextError>{errors.password?.message}</TextError>
      </div>

      <div className="form-control">
        <Link to="/authentication/forgot-password" className="forgot-password">Forgot password?</Link>
      </div>

      <button type="submit" className="submit-btn">Log in</button>

      <div className="have-account-ask">Don't have an account? <Link to="/authentication/signup" className="switch-form">Sign up</Link></div>
    </form>
  );
}

export default LoginForm;