import './Entry.scss';
import { gsap } from 'gsap';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../shared/socket';
import TextError from '../../shared/alerts/TextError';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import background from '../../assets/images/entry-bg-4-optimize.png';

const schema = yup.object({
  input: yup.string().required('Please enter code')
});

function Entry() {
  const inputRef = useRef(null);
  const overlayRef = useRef();

  const navigate = useNavigate();

  // const socket = useReactiveVar(socketVar);

  const [placeholder, setPlaceholder] = useState('Enter code here');
  const [buttonInnerText, setButtonInnerText] = useState('Join');

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const { register, handleSubmit, setError, getValues, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const { ref, ...rest } = register('input');

  const onSubmit = ({ input }) => {
    console.log(input);
    if (placeholder === 'Enter code here') {
      console.log('enter game code');
      socket.emit('classic:player-join', input); // input: game code
    } else {
      socket.emit('classic:player-input-name', input); // input: nickname
    }
  }

  useEffect(() => {
    gsap.timeline()
      .to(overlayRef.current, { opacity: 0, duration: 0.5 })
      .to(overlayRef.current, { display: 'none' })

    socket.on('classic:check-game-pin', (res) => {
      if (res === 'PASS') {
        reset();
        setPlaceholder('Nickname');
        setButtonInnerText('Ok, go!');
      } else {
        console.log('game pin wrong');
        setError('input', { message: "Can't find any games that match" }, { shouldFocus: true });
      }
    });

    socket.on('classic:namesake', (res) => {
      setError('input', { message: 'Nickname has been used' }, { shouldFocus: true });
    });

    socket.on('classic:entered-the-room', (res) => {
      console.log('entered the room');
      navigate('/lobby', { state: getValues('input') });
    });
  }, []);

  return (
    <div className="entry" style={{ backgroundImage: `url(${background})` }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="entry-wrapper"
      >
        <input
          {...rest}
          name="input"
          className="code-entering"
          placeholder={placeholder}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
        />
        <TextError>{errors.input?.message}</TextError>
        <button type="submit" className="join-btn">{buttonInnerText}</button>
      </form>
      <div className="overlay" ref={overlayRef} />
    </div>
  );
}

export default Entry;