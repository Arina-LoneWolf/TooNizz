import '../AuthForm.scss';
import React, { useEffect } from 'react';
import { useMutation } from "@apollo/client";
import { REGISTER } from '../../../apis/userApi';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import TextError from '../../../shared/alerts/TextError';
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string()
    .required('*Required')
    .email('Invalid email'),
  name: yup.string().required('*Required'),
  password: yup.string()
    .required('*Required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .required('*Required')
    .oneOf([yup.ref('password'), ''], 'Password does not match'),
});

function SignUpForm() {
  const [registerAccount, { data, loading, error }] = useMutation(REGISTER);

  const navigate = useNavigate();

  const onGoogleSuccess = (res) => {
    console.log(res);
    const request = { tokenId: res.tokenId };
  }

  const onGoogleFailure = (res) => { }

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (values) => {
    registerAccount({
      variables: {
        user: {
          email: values.email,
          name: values.name,
          password: values.password
        }
      }
    });
  }

  useEffect(() => {
    if (data) {
      console.log(data)
      alert('Register successfully');
    }
  }, [data]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="sign-up-form"
    >
      <h3>Welcome to TooNizz</h3>

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
        <label>Sign up with email</label>
        <input {...register("email")} type="email" />
        <TextError>{errors.email?.message}</TextError>
      </div>

      <div className="form-control">
        <label>Your name</label>
        <input {...register("name")} />
        <TextError>{errors.name?.message}</TextError>
      </div>

      <div className="form-control">
        <label>Password</label>
        <input {...register("password")} type="password" />
        <TextError>{errors.password?.message}</TextError>
      </div>

      <div className="form-control">
        <label>Confirm Password</label>
        <input {...register("confirmPassword")} type="password" />
        <TextError>{errors.confirmPassword?.message}</TextError>
      </div>

      <button type="submit" className="submit-btn">Sign up</button>

      <div className="have-account-ask">Have an account? <Link to="/authentication/login" className="switch-form">Login</Link></div>
    </form>
  );
}

export default SignUpForm;