import './Entry.scss';
import React, { useRef, useEffect } from 'react';
import background from '../../assets/images/entry-bg-4.png';

function Entry() {
  const inputRef = useRef(null);

  const handleSubmitGameCode = (e) => {
    e.preventDefault();

    if (inputRef.current.value)
      console.log(inputRef.current.value);
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="entry" style={{ backgroundImage: `url(${background})` }}>
      <form className="entry-wrapper">
        <input className="code-entering" ref={inputRef} placeholder="Enter code here"></input>
        <button type="submit" className="join-btn" onClick={handleSubmitGameCode}>Join</button>
      </form>
    </div>
  );
}

export default Entry;