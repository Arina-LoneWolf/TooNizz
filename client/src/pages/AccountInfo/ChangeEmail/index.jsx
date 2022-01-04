import React, { useRef } from 'react';

import OTPVerification from './OTPVerification';

function ChangeEmail() {
	return (
		<React.Fragment>
			<div className="info-title">Cập nhật địa chỉ Email</div>
			<div className="divider"></div>

			<form className="form-interface">
				<div className="form-control">
					<label htmlFor="currentEmail">Địa chỉ email hiện tại:</label>
					<div className="input-container">
						<input type="email" disabled />
					</div>
				</div>

				<div className="form-control">
					<label htmlFor="newEmail">Địa chỉ email mới:</label>
					<div className="input-container">
						<input type="email" />
					</div>
				</div>

				<button className="update-btn" type="submit">
					Cập nhật
				</button>
			</form>

			<OTPVerification />
		</React.Fragment>
	);
}

export default ChangeEmail;
