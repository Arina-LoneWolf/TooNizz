import React, { useState, useEffect } from 'react';

const phoneRegExp =
	/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

function Profile() {
	const onSubmit = (values) => {
		const data = {
			name: values.fullName,
			phone: values.phone,
			city: values.province,
			district: values.district,
			adress: values.addressDetail, // sai chính tả dm
		};
	};

	return (
		<React.Fragment>
			<div className="info-title">Hồ sơ của tôi</div>
			<div className="divider"></div>

			<form className="form-interface">
				<div className="form-control">
					<label htmlFor="fullName">Họ tên:</label>
					<div className="input-container">
						<input id="fullName" />
					</div>
				</div>

				<div className="form-control">
					<label htmlFor="phone">Điện thoại:</label>
					<div className="input-container">
						<input id="phone" />
					</div>
				</div>

				<div className="form-control">
					<label htmlFor="addressDetail">Địa chỉ chi tiết:</label>
					<div className="input-container">
						<input id="addressDetail" />
					</div>
				</div>

				<button className="update-btn" type="submit">
					Cập nhật
				</button>
			</form>
		</React.Fragment>
	);
}

export default Profile;
