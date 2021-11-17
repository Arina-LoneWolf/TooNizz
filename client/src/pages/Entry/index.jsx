import './Entry.scss';
import React, { useRef } from 'react';
import { io } from "socket.io-client";

function Entry() {
  const inputRef = useRef(null);

  const handleSubmitGameCode = (e) => {
    e.preventDefault();

    if (inputRef.current.value)
      console.log(inputRef.current.value);
  }

  return (
    <div className="entry">
      <form className="entry-wrapper">
        <input className="code-entering" ref={inputRef} placeholder="Enter code here"></input>
        <button type="submit" className="join-btn" onClick={handleSubmitGameCode}>Join</button>
      </form>
    </div>
  );
}

export default Entry;