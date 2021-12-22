import nodemailer from 'nodemailer';
import { USERNAME_GMAIL, PASS_GMAIL } from '../config/index.js';

const sendMail = async (to, url) => {
	const smtpTransport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: USERNAME_GMAIL,
			pass: PASS_GMAIL,
		},
	});

	const mailOptions = {
		from: `TooNizz ${USERNAME_GMAIL}`,
		to: to,
		subject: 'Confirm Email',
		html: ` <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to TooNizz.</h2>
          <p>Congratulations! You're almost set to start using TooNizz.
              Just click the button below to validate your email address.
          </p>
          
          <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify your account</a>`,
	};

	smtpTransport.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
		}
		console.log(info);
	});
};

const sendMailOTP = async (to, otp) => {
	const smtpTransport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: USERNAME_GMAIL,
			pass: PASS_GMAIL,
		},
	});

	const mailOptions = {
		from: `TooNizz ${USERNAME_GMAIL}`,
		to: to,
		subject: 'Confirm Email',
		html: ` <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
		<h2 style="text-align: center; text-transform: uppercase;color: teal;">ZShop Messenger.</h2>
		<p>Please enter OTP code</p>
		
		<h2>${otp}</h2>`,
	};

	smtpTransport.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
		}
		console.log(info);
	});
};

export { sendMail, sendMailOTP };
