import React, {
	Component,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { FormControl } from 'react-bootstrap';
import { connect, useDispatch, useSelector } from 'react-redux';
import { UserEmailVerifyProcess } from '../store/actions/Profile';
import { USER_EMAIL_VERIFY_PROCESS } from '../store/actions/actionType';
import { errorNotification } from '../commons/notification';
// import Timer from '../../components/Timer';
import { useNavigate } from 'react-router-dom';
import {
	ForgotPassOPTVerify,
	ForgotPassReq,
} from '../store/actions/ForgotPassword';
import CountDownTimer from '../components/Timer';
import { getSiteLanguageData } from '../commons';

class MobileVerification extends Component {
	// const dispatch = useDispatch();
	// const navigate = useNavigate();
	constructor(props) {
		super(props);
		this.otpRef = {
			otpF1: React.createRef(),
			otpF2: React.createRef(),
			otpF3: React.createRef(),
			otpF4: React.createRef(),
		};
		this.emailVerificationData = getSiteLanguageData('emailVerification');
		this.mobileVerificationData = getSiteLanguageData('mobileVerification');
		this.state = {
			otp: {
				otpF1: '',
				otpF2: '',
				otpF3: '',
				otpF4: '',
			},
		};
	}
	componentDidMount() {
		// useEffect(() => {
		//   if (verifyEmailData?.success === true) {
		//     this.props.navigate("/welcome");
		//     // window.location.href = 'welcome'
		//   }
		// }, [verifyEmailData?.success, this.props.history, this.props.dispatch]);
		// useEffect(() => {
		//   if (forgotPasswordData?.FORGOT_PASS_OTP.success === true) {
		//     this.props.navigate("/reset-password");
		//   }
		// }, [forgotPasswordData?.FORGOT_PASS_OTP.success, this.props.history, this.props.dispatch]);
	}
	verifyEmail = (e) => {
		const { otp } = this.state;
		const { data, type } = this.props;
		const {
			email_is_empty,
			enter_otp
		} = this.emailVerificationData || {};

		e.preventDefault();
		const otpMatch = otp.otpF1 + otp.otpF2 + otp.otpF3 + otp.otpF4;
		if (data?.email === '') {
			return errorNotification(email_is_empty?.text);
		}
		if (otpMatch === '') {
			return errorNotification(enter_otp?.text);
		}
		if (type === 'forgotPassword') {
			this.props.dispatch(
				ForgotPassOPTVerify({
					email: data?.email,
					otp: otpMatch,
				}),
			);
		} else {
			this.props.dispatch(
				UserEmailVerifyProcess({
					email: data?.email,
					otp: otpMatch,
				}),
			);
		}
	};

	handleOtpChange = (e) => {
		const { otp } = this.state;
		const { data, type } = this.props;

		let name = e.target.name;
		let value = e.target.value;
		if (!Number(value) && !value && value !== '') {
			return;
		}
		const index = name.slice(-1);
		if (parseInt(value) > 9 || value.length > 1) {
			name = 'otpF' + (parseInt(index) === 4 ? 1 : parseInt(index) + 1);
			this.otpRef?.[name]?.current?.focus();
			value = value?.slice(-1);
		}
		this.setState({
			otp: {
				...otp,
				[name]: value,
			},
		});
	};
	render() {
		const { data, type } = this.props;
		const { otp } = this.state;

		const hoursMinSecs = { minutes: 9 };
		const handleResend = () => {
			this.props.dispatch(
				ForgotPassReq({
					email: data?.email,
				}),
			);
		};
		const {
			verify_your_mobile,
			a_code_has_been_sent_to,
			resend,
			verify,
			the_otp_expire_in,
		} = getSiteLanguageData('components/mobileverification');
		return (
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
					{data?.email}
					{/* <a href="/dashboard" className="ms-2 theme-color theme-link-hover">Change</a> */}
				</p>
				<FormControl
					type="text"
					ref={this.otpRef.otpF1}
					name="otpF1"
					onChange={(e) => this.handleOtpChange(e)}
					value={otp.otpF1}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={this.otpRef.otpF2}
					name="otpF2"
					onChange={(e) => this.handleOtpChange(e)}
					value={otp.otpF2}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={this.otpRef.otpF3}
					name="otpF3"
					onChange={(e) => this.handleOtpChange(e)}
					value={otp.otpF3}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={this.otpRef.otpF4}
					name="otpF4"
					onChange={(e) => this.handleOtpChange(e)}
					value={otp.otpF4}
					autoComplete="off"
					className="otp-small-input"
				/>
				{/* <p className="text-muted mb-0 mt-3">- The OTP will expire in 9:21</p> */}
				<p className="text-muted">
					{didnt_receive_the_code?.text}{' '}
					<button
						className="btn theme-color theme-link-hover border-0"
						onClick={handleResend}>
						{resend?.text}
					</button>
				</p>
				<div className="App">
					<span className="col-sm-9">
						{the_otp_expire_in?.text}
						<CountDownTimer
							className="theme-color"
							hoursMinSecs={hoursMinSecs}
						/>
					</span>
				</div>
				<div className="col-sm-10 offset-sm-1">
					<button
						className="btn btn-primary theme-btn btn-block mt-4"
						onClick={(e) => this.verifyEmail(e)}>
						{' '}
						<i className="fa fa-check me-2"></i> {verify?.text}
					</button>
				</div>
			</div>
		);
	}
}

// export default MobileVerification;
export default connect((state) => {
	return {
		forgotPasswordData: state.forgotPass,
		verifyEmailData: state?.profile?.[USER_EMAIL_VERIFY_PROCESS],
		data: state?.profile?.[USER_EMAIL_VERIFY_PROCESS]?.result,
	};
})(MobileVerification);
