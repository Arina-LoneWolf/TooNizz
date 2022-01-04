import React from 'react';

function ChangePassword() {
	const onSubmit = (values) => {};

	return (
		<React.Fragment>
			<div className="info-title">Thay đổi mật khẩu</div>
			<div className="divider"></div>

			<form className="form-interface">
				<div className="form-control">
					<label htmlFor="password">Nhập mật khẩu:</label>
					<div className="input-container">
						<input type="password" id="password" />
					</div>
				</div>

				<div className="form-control">
					<label htmlFor="newPassword">Nhập mật khẩu mới:</label>
					<div className="input-container">
						<input type="password" id="newPassword" />
					</div>
				</div>

				<div className="form-control">
					<label htmlFor="confirmNewPassword">Nhập lại mật khẩu:</label>
					<div className="input-container">
						<input type="password" id="confirmNewPassword" />
					</div>
				</div>

				<button className="update-btn" type="submit">
					Cập nhật
				</button>
			</form>
		</React.Fragment>
	);
}

export default ChangePassword;
