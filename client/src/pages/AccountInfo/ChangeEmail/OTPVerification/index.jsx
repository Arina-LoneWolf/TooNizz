import './OTPVerification.scss';
import React, { useState, useRef } from 'react';

const OTPVerification = React.forwardRef(
	({ resendOTP, updateNewEmail }, ref) => {
		return (
			<div className="otp-verification" ref={ref}>
				<div className="otp-verification-body">
					<div id="overlay"></div>
					<form className="otp-verification-container">
						<p className="otp-message">
							Mã xác nhận đã được gửi đến email mới của bạn. Vui lòng kiểm tra
							và nhập mã xác nhận để hoàn tất cập nhật.
						</p>

						<div className="otp-input">
							<input type="text" />
							<button type="submit" className="submit-otp-btn">
								Xác nhận
							</button>
						</div>

						<span className="resend-otp-message">
							Không nhận được mã xác minh?
						</span>
						<span className="resend-otp-btn" onClick={resendOTP}>
							Gửi lại mã
						</span>
					</form>
				</div>
			</div>
		);
	}
);

export default OTPVerification;
