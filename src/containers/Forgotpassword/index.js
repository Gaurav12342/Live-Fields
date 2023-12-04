import { Fragment, useCallback, useState, useEffect } from 'react';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getSiteLanguageData, validateEmail } from '../../commons';
import ForgotEmailVerification from '../../components/forgotEmailVerification';
import CustomSelect from '../../components/SelectBox';
import Countcode from '../../commons/CountryCodes.json';
import { ForgotPassReq } from '../../store/actions/ForgotPassword';

function ForgotPassword() {
	const [mode, setMode] = useState('registration');
	const dispatch = useDispatch();
	const [useMobile, handleUseMobile] = useState(false);
	const [data, setData] = useState({
		username: '',
		email: '',
		mobile: '',
		country_code: '+91 ',
	});
	const handleChange = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.value;
			let { email, mobile, country_code } = data;
			if (validateEmail(value)) {
				email = value;
			} else {
				mobile = value;
				country_code = value;
			}
			setData({
				...data,
				email,
				mobile,
				[name]: value,
			});
		},
		[data],
	);

	const OTPSentData = useSelector((state) => {
		return state?.forgotPass?.FORGOT_PASS_REQUEST || {};
	});

	useEffect(() => {
		
		if (OTPSentData?.success === true) {
			setMode('email_verify');
		}
	}, [OTPSentData, dispatch]);

	const forgotPass = useCallback((e) => {
		e.preventDefault();
		// setMode('email_verify');
		dispatch(
			ForgotPassReq(
				data,
				()=>{},
				()=>{},
			)
		)
	});
	const countryCode = Countcode.countries.map((e) => {
		return {
			value: e?.['Final country code'],
			label: `${e?.['Country/geographical area']} (${e?.['Final country code']})`,
		};
	});
	const { email,ph_email } = getSiteLanguageData('commons');
	const {
		mobile,
		ph_mobile,
		continueb_btn,
		login_here,
		use_mobile,
		use_email,
		already_have_an_account,
	} = getSiteLanguageData('forgotpassword');

	return (
		<Fragment>
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm-7 col-lg-7 login-left"></div>
					<div className="col-sm-12 col-lg-5 login-box">
						<div className="col-sm-12 text-center">
							<a href="/">
								<img alt="livefield" src="/images/logo-with-text.png" />
							</a>
						</div>
						{mode === 'registration' ? (
							<div className="col-sm-12 mt-5 login-toggle">
								<Form onSubmit={(e) => forgotPass(e)}>
									{!useMobile ? (
										<div className="form-group">
											<Form.Label htmlFor="username">{email?.text}</Form.Label>
											<span
												onClick={() => handleUseMobile(!useMobile)}
												className="float-end theme-link text-bold show-login text-end pointer">
												{use_mobile?.text}
											</span>
											<InputGroup className="mb-3">
												<FormControl
													placeholder={ph_email?.text}
													type="text"
													name="username"
													id="exampleInputEmail1"
													aria-describedby="emailHelp"
													autoComplete="email"
													onChange={(e) => handleChange(e)}
													value={data?.username}
												/>
											</InputGroup>
										</div>
									) : (
										<div className="form-group">
											<Form.Label htmlFor="password-field">
												{mobile?.text}
											</Form.Label>
											<span
												onClick={() => handleUseMobile(!useMobile)}
												className="pointer float-end theme-link text-bold show-login text-end">
												{use_email?.text}
											</span>
											<InputGroup className="mb-3">
												<CustomSelect
													className="col-sm-5 bg-white"
													name="country_code"
													onChange={(e) => {
														handleChange({
															target: {
																name: 'country_code',
																value: e.value,
															},
														});
													}}
													value={countryCode?.filter(
														(c) => c?.value === data?.country_code,
													)}
													options={countryCode}
												/>
												<FormControl
													className="form_mobile ms-1"
													placeholder={ph_mobile?.text}
													type="number"
													pattern="[0-9]{10}"
													name="username"
													autoComplete="tel-national"
													// id="exampleInputEmail1"
													aria-describedby="emailHelp"
													onChange={(e) => handleChange(e)}
													value={data?.username}
												/>
											</InputGroup>
										</div>
									)}
									<div className="form-group text-center">
										<Button
											type="submit"
											className="btn btn-primary theme-btn btn-block">
											{' '}
											<i className="fa fa-fw fa-paper-plane me-2"></i>{' '}
											{continueb_btn?.text}
										</Button>
									</div>
								</Form>
							</div>
						) : null}

						{mode === 'email_verify' && data ? (
							<ForgotEmailVerification
								useMobile={useMobile}
								data={data}
								type="forgotPassword"
							/>
						) : null}
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

export default ForgotPassword;
