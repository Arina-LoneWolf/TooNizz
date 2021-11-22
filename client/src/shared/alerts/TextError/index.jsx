import './TextError.scss';
import React from 'react';

function TextError(props) {
  return (
    <div className="error-container">
      <div className="error">
        {props.children}
      </div>
    </div>
  );
}

export default TextError;