import './Dialog.scss';
import React, { useRef } from 'react';
import { dialogVar } from '../apolloLocalState/popupAlertState';
import { useReactiveVar } from '@apollo/client';

function Dialog() {
  const dialog = useReactiveVar(dialogVar);

  const dialogRef = useRef(null);

  const handleCancelClick = () => {
    closeDialog();
  }

  const handleAcceptClick = () => {
    closeDialog();
    dialog.func();
  }

  const closeDialog = () => {
    dialogVar({ ...dialog, show: false });
  }

  return (
    <React.Fragment>
      {dialog.show && <div className="dialog" ref={dialogRef}>
        <div id="overlay"></div>
        <div className={dialog.adminMode ? "dialog-container admin-mode" : "dialog-container"}>
          <div className="message">{dialog.message}</div>
          <div className={dialog.adminMode ? "option-btn-group admin-mode" : "option-btn-group"}>
            <div className="cancel-btn" onClick={handleCancelClick}>Hủy</div>
            <div className="accept-btn" onClick={handleAcceptClick}>{dialog.acceptButtonName}</div>
          </div>
        </div>
      </div>}
    </React.Fragment>
  );
}

export default Dialog;