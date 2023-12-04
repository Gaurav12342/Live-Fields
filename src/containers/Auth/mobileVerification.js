import { useCallback, useEffect, useRef, useState } from 'react';
import { FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	UserEmailVerifyProcess,
	UserMobileVerifyProcess,
	UserRegistrationEmailVerify,
} from '../../store/actions/Profile';
import { USER_EMAIL_VERIFY_PROCESS } from '../../store/actions/actionType';
import { errorNotification } from '../../commons/notification';
import { useNavigate } from 'react-router-dom';
import { ForgotPassOPTVerify } from '../../store/actions/ForgotPassword';
import CountDownTimer from '../../components/Timer';
import AuthLayout from '../../components/authLayout';
import { getSiteLanguageData } from '../../commons';

const {
	mobile_is_empty,
	enter_otp,
	verify_your_mobile,
	a_code_has_been_sent_to,
	didnt_receive_the_code,
	resend,
	verify,
	the_otp_expire_in,
} = getSiteLanguageData('mobileVerification');

function MobileVerify(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { type } = props;
	const [isEnable, setIsEnable] = useState(false);
	const [reset, setReset] = useState(false);
	const [minutes, setMinutes] = useState(1);
	const [flag, setFlag] = useState({
		otpSent: false,
	});
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
	const hoursMinSecs = { minutes };
	const verifyMobileData = useSelector((state) => {
		return state?.profile?.[USER_EMAIL_VERIFY_PROCESS] || {};
	});

	const forgotPasswordData = useSelector((state) => {
		return state.forgotPass || {};
	});

	const userProfileData = useSelector((state) => {
		return state?.profile?.user_profile_details?.result || {};
	});

	const handleOtpChange = useCallback(
		(e) => {
			let name = e.target.name;
			let value = e.target.value;
			if (!Number(value) && !value && value !== '') {
				return;
			}
			const index = name.slice(-1);
			if (parseInt(value) > 9 || value.length > 1) {
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

	const data = props.data || userProfileData;

	useEffect(() => {
		if (userProfileData?.mobile_verify === false) {
			if (data?.email && flag.otpSent === false) {
				dispatch(
					UserRegistrationEmailVerify(
						{
							email: '',
							mobile: data?.mobile,
							country_code: data?.country_code,
						},
						setIsEnable,
						setMinutes,
					),
				);
				setFlag({
					otpSent: true,
				});
			}
		}
	}, [userProfileData, data?.email, dispatch, flag]);

	const verifyMobile = useCallback(
		(e) => {
			e.preventDefault();
			const otpMatch = otp.otpF1 + otp.otpF2 + otp.otpF3 + otp.otpF4;
			if (data?.email === '') {
				return errorNotification(mobile_is_empty?.text);
			}
			if (otpMatch === '') {
				return errorNotification(enter_otp?.text);
			}
			if (type === 'forgotPassword') {
				dispatch(
					ForgotPassOPTVerify({
						email: data?.email,
						otp: otpMatch,
					}),
				);
			} else {
				dispatch(
					UserMobileVerifyProcess(
						{
							mobile: data?.mobile,
							country_code: data?.country_code,
							otp: otpMatch,
						},
						navigate,
					),
				);
			}
		},
		[otp, data?.email, dispatch],
	);

	useEffect(() => {
		if (verifyMobileData?.success === true) {
			// navigate("/welcome");
			window.location.href = '/projects';
		}
	}, [verifyMobileData?.success, dispatch]);

	useEffect(() => {
		if (forgotPasswordData?.FORGOT_PASS_OTP.success === true) {
			navigate('/reset-password');
		}
	}, [forgotPasswordData?.FORGOT_PASS_OTP.success, dispatch]);

	const handleResend = () => {
		dispatch(
			UserRegistrationEmailVerify({
				email: '',
				mobile: data?.mobile,
				country_code: data?.country_code,
			}),
		);
	};

	return (
		<AuthLayout>
			<div className="col-sm-12 mt-5 text-center verify-email">
				<img
					alt="livefield"
					src="/images/OTP_mail.svg"
					className="mb-3"
					width="80px"
				/>
				<h1>
					<strong>{verify_your_mobile?.text}</strong>
				</h1>
				<p className="text-muted mb-0">{a_code_has_been_sent_to?.text}</p>
				<p>
					{data?.country_code}
					{data?.mobile}
					{/* <a href="/dashboard" className="ms-2 theme-color theme-link-hover">Change</a> */}
				</p>
				<FormControl
					type="text"
					ref={otpRef.otpF1}
					name="otpF1"
					onChange={(e) => handleOtpChange(e)}
					value={otp.otpF1}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={otpRef.otpF2}
					name="otpF2"
					onChange={(e) => handleOtpChange(e)}
					value={otp.otpF2}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={otpRef.otpF3}
					name="otpF3"
					onChange={(e) => handleOtpChange(e)}
					value={otp.otpF3}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={otpRef.otpF4}
					name="otpF4"
					onChange={(e) => handleOtpChange(e)}
					value={otp.otpF4}
					autoComplete="off"
					className="otp-small-input"
				/>
				{/* <p className="text-muted mb-0 mt-3">- The OTP will expire in 9:21</p> */}
				<p className="text-muted">
				{didnt_receive_the_code?.text}{' '}
					<button
						disabled={isEnable}
						className="btn theme-color theme-link-hover border-0"
						onClick={handleResend}>
							{resend?.text}
					</button>
				</p>
				<div className="App">
					<span className="col-sm-9">
					{the_otp_expire_in?.text}{' '}
						<CountDownTimer
							className="theme-color"
							hoursMinSecs={hoursMinSecs}
							isEnable={isEnable}
							isReset={reset}
							handleReset={setReset}
						/>
					</span>
				</div>
				<div className="col-sm-10 offset-sm-1">
					<button
						className="btn btn-primary theme-btn btn-block mt-4"
						onClick={(e) => verifyMobile(e)}>
						<i className="fa fa-fw fa-check me-2"></i>{verify?.text}
					</button>
				</div>
			</div>
		</AuthLayout>
	);
}

export default MobileVerify;
