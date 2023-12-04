import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
	GetUserProfileDetails,
	UserEmailVerifyProcess,
	UserRegistrationEmailVerify,
} from '../../store/actions/Profile';
import {
	USER_EMAIL_VERIFY_PROCESS,
	USER_PROFILE_DETAILS,
} from '../../store/actions/actionType';
import { errorNotification } from '../../commons/notification';
import {
	ForgotPassOPTVerify,
	ForgotPassReq,
} from '../../store/actions/ForgotPassword';
import CountDownTimer from '../../components/Timer';
import AuthLayout from '../../components/authLayout';
import { decodeToken } from 'react-jwt';
import { getParameterByName } from '../../helper';
import getUserId from '../../commons';
import { getSiteLanguageData } from '../../commons';
const {
	email_is_empty,
	enter_otp,
	verify_your_email,
	a_code_has_been_sent_to,
	didnt_receive_the_code,
	resend,
	verify,
	the_otp_expire_in,
} = getSiteLanguageData('emailVerification');

class EmailVerification extends Component {
	constructor(props) {
		super(props);
		this.decodedToken = decodeToken(localStorage.getItem('token'));
		// this.email = this.props.router?.params?.email;

		this.email =
			getParameterByName('email') || this.props.userProfileData?.email;
		this.userId = getUserId();

		this.otpRef = {
			otpF1: React.createRef(),
			otpF2: React.createRef(),
			otpF3: React.createRef(),
			otpF4: React.createRef(),
		};
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
			sendDidMount:0
		};
	}
	componentDidMount() {
		this.props.dispatch(GetUserProfileDetails(this.decodedToken?.user));
		// if (this.email && this.state.sendDidMount == 0) {
			this.setState({ sendDidMount:1 });
			this.props.dispatch(
				UserRegistrationEmailVerify(
					{
						email: this.email,
						mobile: '',
						country_code: '',
					},
					this.handleDisable,
					this.handleHoursMinSecs,
				),
			);
		// }
	}
	componentWillUnmount() {
		/* if (this.email && this.state.sendDidMount == 0) {
			console.log(this.state.sendDidMount, "this.state.componentWillUnmount this.state.componentWillUnmount")
			this.setState({ sendDidMount:1 });
			this.props.dispatch(
				UserRegistrationEmailVerify(
					{
						email: this.email,
						mobile: '',
						country_code: '',
					},
					this.handleDisable,
					this.handleHoursMinSecs,
				),
			);
		} */
	}
	verifyEmail = (e) => {
		const { otp } = this.state;
		const { data, type } = this.props;
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
				UserEmailVerifyProcess(
					{
						email: this.email,
						otp: otpMatch,
					},
					!!this.email,
				),
			);
		}
	};

	handleDisable = (isEnable) => {
		this.setState({ isEnable });
	};
	handleReset = (reset) => {
		this.setState({ reset });
	};

	handleHoursMinSecs = (minutes) => {
		this.setState({ minutes });
	};

	handleOtpChange = (e) => {
		const { otp } = this.state;
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
		const { data, type, userProfileData } = this.props;

		const { otp, minutes } = this.state;
		const hoursMinSecs = { minutes: minutes };
		const handleResend = () => {
			this.handleReset(true);
			if (type === 'forgotPassword') {
				this.props.dispatch(
					ForgotPassReq({
						email: data?.email,
					}),
				);
			} else {
				this.props.dispatch(
					UserRegistrationEmailVerify(
						{
							email: this.email,
							mobile: '',
							country_code: '',
						},
						this.handleDisable,
						this.handleHoursMinSecs,
					),
				);
			}
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
						<strong>{verify_your_email?.text}</strong>
					</h1>
					<p className="text-muted mb-0">{a_code_has_been_sent_to?.text}</p>
					<p>
						{this.props.userProfileData
							? this.props.userProfileData.email
							: this.email || ''}
						{/* {this.email} */}
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
							disabled={this.state.isEnable}
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
								isEnable={this.state.isEnable}
								isReset={this.state.reset}
								handleReset={this.handleReset}
							/>
						</span>
					</div>
					<div className="col-sm-10 offset-sm-1">
						<button
							type="button"
							className="btn btn-primary theme-btn btn-block mt-4"
							onClick={(e) => this.verifyEmail(e)}>
							<i className="fa fa-fw fa-check me-2"></i> {verify?.text}
						</button>
					</div>
				</div>
			</AuthLayout>
		);
	}
}

// export default EmailVerification;
export default connect((state) => {
	return {
		forgotPasswordData: state.forgotPass,
		verifyEmailData: state?.profile?.[USER_EMAIL_VERIFY_PROCESS],
		userProfileData: state?.profile?.user_profile_details?.result,
		data: state?.profile?.[USER_EMAIL_VERIFY_PROCESS]?.result,
	};
})(EmailVerification);
