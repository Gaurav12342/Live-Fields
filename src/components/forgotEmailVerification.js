import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { UserEmailVerifyProcess } from '../store/actions/Profile';
import { USER_EMAIL_VERIFY_PROCESS } from '../store/actions/actionType';
import { errorNotification } from '../commons/notification';
// import Timer from '../../components/Timer';
import {
	ForgotPassOPTVerify,
	ForgotPassReq,
} from '../store/actions/ForgotPassword';
import CountDownTimer from '../components/Timer';
import { getSiteLanguageData } from '../commons';

class ForgotEmailVerification extends Component {
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
			minutes: 1,
			isEnable: false,
			reset: false,
			jwtTokenData: {},
		};
	}
	componentDidMount() {
		const { verifyEmailData, forgotPasswordData } = this.props;
		if (verifyEmailData?.success === true) {
			// navigate('/welcome');
			window.location.href = 'welcome';
		}

		if (forgotPasswordData?.FORGOT_PASS_OTP.success === true) {
			// navigate('/reset-password');
			window.location.href = '/reset-password';
		}
	}
	hardReset = () => {
		this.setIsEnable(false);
		this.setMinutes(1)
		setTimeout( () =>{
			// this.setIsEnable(true);
			console.log("Time POut")
			this.setState({ isEnable:true });
		}, 120000);
	}
	componentWillUnmount() {
		const { useMobile, data } = this.props;
		if (data) {
			this.hardReset()
			/* if (!useMobile) {
				this.props.dispatch(
					ForgotPassReq(
						{ email: data?.username },
						this.setIsEnable,
						this.setMinutes,
					),
				);
			} else {
				this.props.dispatch(
					ForgotPassReq(
						{
							country_code: data?.country_code,
							mobile: data?.mobile,
						},
						this.setIsEnable,
						this.setMinutes,
					),
				);
			} */
		}
	}
	setIsEnable = (isEnable) => {
		this.setState({ isEnable });
	};
	handleReset = (reset) => {
		this.setState({ reset });
	};
	setOtp = (otp) => {
		this.setState({ otp });
	};

	setMinutes = (minutes) => {
		this.setState({ minutes });
	};
	handleOtpChange = (e) => {
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
		this.setOtp({
			...this.state.otp,
			[name]: value,
		});
	};

	verifyEmail = (e) => {
		e.preventDefault();

		const {
			email_is_empty,
			enter_otp
		} = this.emailVerificationData || {};
		const {mobile_is_empty} = this?.mobileVerificationData;

		const otpMatch =
			this.state.otp.otpF1 +
			this.state.otp.otpF2 +
			this.state.otp.otpF3 +
			this.state.otp.otpF4;
		if (this.props.data?.email) {
			if (this.props.data?.email === '') {
				return errorNotification(email_is_empty?.text);
			}
			if (otpMatch === '') {
				return errorNotification(enter_otp?.text);
			}
			if (this.props.type === 'forgotPassword') {
				this.props.dispatch(
					ForgotPassOPTVerify({
						email: this.props.data?.email,
						otp: otpMatch,
					}),
				);
			} else {
				this.props.dispatch(
					UserEmailVerifyProcess({
						email: this.props.data?.email,
						otp: otpMatch,
					}),
				);
			}
		} else {
			if (this.props.data?.mobile === '') {
				return errorNotification(mobile_is_empty?.text);
			}
			if (otpMatch === '') {
				return errorNotification(enter_otp?.text);
			}
			if (this.props.type === 'forgotPassword') {
				this.props.dispatch(
					ForgotPassOPTVerify({
						mobile: this.props.data?.mobile,
						country_code: this.props.data?.country_code,
						otp: otpMatch,
					}),
				);
			} else {
				this.props.dispatch(
					UserEmailVerifyProcess({
						email: this.props.data?.email,
						otp: otpMatch,
					}),
				);
			}
		}
	};

	handleResend = () => {
		this.handleReset(true);
		if (!this.props.useMobile) {
			this.props.dispatch(
				ForgotPassReq(
					{ email: this.props.data?.username },
					this.hardReset,
					this.setMinutes,
				),
			);
		} else {
			this.props.dispatch(
				ForgotPassReq(
					{
						country_code: this.props.data?.country_code,
						mobile: this.props.data?.mobile,
					},
					this.hardReset,
					this.setMinutes,
				),
			);
		}
	};
	render() {
		const { minutes, otp, isEnable, reset } = this.state;
		const { data } = this.props;
		const hoursMinSecs = { minutes };
		const {
			verify_your,
			a_code_has_been_sent_to,
			resend,
			didnt_receive_the_code,
			verify,
			the_otp_expire_in,
		} = getSiteLanguageData('components/forgotemailverification');
		return (
			<div className="col-sm-12 mt-5 text-center verify-email">
				<img
					alt="livefield"
					src="/images/OTP_mail.svg"
					className="mb-3"
					width="80px"
				/>
				<h1>
					<strong>
						{verify_your?.text} {data?.email ? 'Email' : 'Mobile'}
					</strong>
				</h1>
				<p className="text-muted mb-0">{a_code_has_been_sent_to?.text}</p>
				<p>
					{data?.email ? '' : data?.country_code}
					{data?.username}
				</p>
				<FormControl
					type="text"
					ref={this.otpRef?.otpF1}
					name="otpF1"
					onChange={(e) => this.handleOtpChange(e)}
					value={otp?.otpF1}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={this.otpRef?.otpF2}
					name="otpF2"
					onChange={(e) => this.handleOtpChange(e)}
					value={otp?.otpF2}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={this.otpRef?.otpF3}
					name="otpF3"
					onChange={(e) => this.handleOtpChange(e)}
					value={otp?.otpF3}
					autoComplete="off"
					className="otp-small-input"
				/>
				<FormControl
					type="text"
					ref={this.otpRef?.otpF4}
					name="otpF4"
					onChange={(e) => this.handleOtpChange(e)}
					value={otp?.otpF4}
					autoComplete="off"
					className="otp-small-input"
				/>
				{/* <p className="text-muted mb-0 mt-3">- The OTP will expire in 9:21</p> */}
				<p className="text-muted">
					{didnt_receive_the_code?.text}{' '}
					<button
						className="btn theme-color theme-link-hover border-0"
						disabled={!isEnable}
						onClick={this.handleResend}>
						{resend?.text}
					</button>
				</p>
				<div className="App">
					<span className="col-sm-9">
						{the_otp_expire_in?.text}
						<CountDownTimer
							className="theme-color"
							hoursMinSecs={hoursMinSecs}
							isEnable={!isEnable}
							isReset={reset}
							handleReset={this.handleReset}
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

// export default ForgotEmailVerification;

export default connect((state) => {
	return {
		forgotPasswordData: state?.forgotPass,
		verifyEmailData: state?.profile?.[USER_EMAIL_VERIFY_PROCESS],
		userProfileData: state?.profile?.user_profile_details?.result,
	};
})(ForgotEmailVerification);
