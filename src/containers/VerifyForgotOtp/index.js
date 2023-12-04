import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { registration } from '../../store/actions/registration';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	UserEmailVerifyProcess,
	UserRegistrationEmailVerify,
} from '../../store/actions/Profile';
import {
	FORGOT_PASS_OTP,
	FORGOT_PASS_REQUEST,
	REGISTRATION,
	USER_EMAIL_VERIFY_PROCESS,
} from '../../store/actions/actionType';
import { errorNotification } from '../../commons/notification';
import { Link, useNavigate } from 'react-router-dom';
import { ForgotPassOPTVerify } from '../../store/actions/ForgotPassword';
import { getSiteLanguageData } from '../../commons';

function Registration() {
	const navigate = useNavigate();
	const otpRef = {
		otpF1: useRef(null),
		otpF2: useRef(null),
		otpF3: useRef(null),
		otpF4: useRef(null),
	};

	const [otp, setOtp] = useState({
		otpF1: '',
		otpF2: '',
		otpF3: '',
		otpF4: '',
	});

	const [data, setData] = useState({
		username: '',
	});
	const dispatch = useDispatch();
	const handleChange = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.value;
			setData({
				...data,
				[name]: value,
			});
		},
		[data],
	);

	const otpVerify = useSelector((state) => {
		return state?.auth?.[FORGOT_PASS_REQUEST] || {};
	});
	const verifyEmailData = useSelector((state) => {
		return state?.profile?.[FORGOT_PASS_OTP] || {};
	});

	const handleOtpChange = useCallback(
		(e) => {
			let name = e.target.name;
			let value = e.target.value;
			if (!Number(value) && !value && value !== '') {
				return;
			}
			const index = name.slice(-1);
			if (parseInt(value) > 9) {
				name = 'otpF' + (parseInt(index) === 4 ? 1 : parseInt(index) + 1);
				otpRef?.[name]?.current?.focus();
				value = value?.slice(-1);
			}
			setOtp({
				...otp,
				[name]: value,
			});
		},
		[otp],
	);

	const verifyEmail = useCallback(
		(e) => {
			e.preventDefault();
			const otpMatch = otp.otpF1 + otp.otpF2 + otp.otpF3 + otp.otpF4;
			if (data?.email === '') {
				return errorNotification('Email is empty');
			}
			if (otpMatch === '') {
				return errorNotification('Please Enter OTP');
			}
			dispatch(
				ForgotPassOPTVerify({
					email: data?.email,
					mobile: data?.mobile,
					country_code: '+91',
				}),
			);
			dispatch(
				UserEmailVerifyProcess({
					email: data?.email,
					otp: otpMatch,
				}),
			);
		},
		[otp, data?.email, dispatch],
	);

	useEffect(() => {
		if (verifyEmailData?.success === true) {
			window.location.href = 'welcome';
		}
	}, [
		otpVerify,
		data?.email,
		data?.mobile,
		verifyEmailData?.success,
		dispatch,
	]);
	const {
		verify_your_email,
		a_code_has_been_sent_to,
		didn_receive_the_code,
		resend,
		verify,
		already_have_an_account,
		login_here,
	} = getSiteLanguageData('verifyforogototp');
	return (
		<Fragment>
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm-7 login-left"></div>
					<div className="col-sm-5 login-box">
						<div className="col-sm-12 mt-5 text-center verify-email">
							<img
								alt="livefield"
								src="/images/OTP_mail.svg"
								className="mb-3"
								width="80px"
							/>
							<h1>
								<strong>{verify_your_email?.text}</strong>
							</h1>
							<p className="text-muted mb-0">{a_code_has_been_sent_to?.text}</p>
							<p>{data?.username}</p>
							<FormControl
								type="text"
								ref={otpRef.otpF1}
								name="otpF1"
								onChange={(e) => handleOtpChange(e)}
								value={otp.otpF1}
								className="otp-small-input"
								autoComplete="off"
							/>
							<FormControl
								type="text"
								ref={otpRef.otpF2}
								name="otpF2"
								onChange={(e) => handleOtpChange(e)}
								value={otp.otpF2}
								className="otp-small-input"
								autoComplete="off"
							/>
							<FormControl
								type="text"
								ref={otpRef.otpF3}
								name="otpF3"
								onChange={(e) => handleOtpChange(e)}
								value={otp.otpF3}
								className="otp-small-input"
								autoComplete="off"
							/>
							<FormControl
								type="text"
								ref={otpRef.otpF4}
								name="otpF4"
								onChange={(e) => handleOtpChange(e)}
								value={otp.otpF4}
								className="otp-small-input"
								autoComplete="off"
							/>
							<p className="text-muted">
								- {didn_receive_the_code?.text}{' '}
								<button className="btn theme-color theme-link-hover border-0">
									{resend?.text}
								</button>
							</p>
							<div className="col-sm-10 offset-sm-1">
								<button
									className="btn btn-primary theme-btn btn-block mt-4"
									onClick={(e) => verifyEmail(e)}>
									{' '}
									<i className="fa fa-check me-2"></i> {verify?.text}
								</button>
							</div>
						</div>
						<div className="col-sm-12 login-bottom-links mt-3 hide-register-link">
							<p>{already_have_an_account?.text}</p>
							<a href="/auth/login" className="theme-link text-bold ">
								{login_here?.text}
							</a>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default Registration;
