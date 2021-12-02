import './HostGamePlay.scss';
import { gsap } from 'gsap';
import React, { useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import GameReady from './GameReady';
import GameControl from './GameControl';
import background from '../../assets/images/space-bg-12.jpg';

function HostGamePlay() {
  const el = useRef();
  const q = gsap.utils.selector(el);
  const tlLoad = useRef();

  useEffect(() => {
    tlLoad.current = gsap.timeline().from(q('.blur-overlay'), { background: 'rgba( 0, 0, 0, 1)', duration: 5});
  }, [])

  return (
    <div className="host-game-play" ref={el} style={{ backgroundImage: `url(${background})` }}>
      <div className="blur-overlay">
        <Routes>
          <Route path='/' element={<GameReady />} />
          <Route path='/start' element={<GameControl />} />
        </Routes>
      </div>
      {/* <div className="overlay" /> */}
    </div>
  );
}

export default HostGamePlay;