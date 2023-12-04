import { Fragment, useCallback, useEffect, useState } from 'react';
import { login } from '../../store/actions/Login';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { GetUserProfileDetails } from '../../store/actions/Profile';
import getUserId, { getSiteLanguageData } from '../../commons';
import Countcode from '../../commons/CountryCodes.json';
import { AUTH_LOADING } from '../../store/actions/actionType';
import Loading from '../../components/loadig';
import { stopLoading } from '../../store/actions/loading';
import CustomSelect from '../../components/SelectBox';

function Login() {
	const userId = getUserId();
	const userProfileData = useSelector((state) => {
		return state?.profile?.user_profile_details?.result;
	});
	const isLoading = useSelector((state) => {
		return state?.loading?.[AUTH_LOADING];
	});
	const [useMobile, handleUseMobile] = useState(false);
	const [data, setData] = useState({
		username: '',
		password: '',
		country_code: '+91 ',
		os: 'web',
	});
	const [showPassword, setPasswordShow] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const loginData = useSelector((state) => {
		return state?.auth?.login_user_data || {};
	});
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

	const loginUser = useCallback(
		(e) => {
			e.preventDefault();
			const re =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (re.test(String(data?.username).toLowerCase())) {
				dispatch(
					login({ email: data?.username?.trim(), password: data?.password, os: 'web' }),
				);
			} else {
				dispatch(
					login({
						mobile: data?.username?.trim(),
						country_code: data?.country_code?.trim(),
						password: data?.password,
						os: 'web',
					}),
				);
			}
		},
		[data, dispatch],
	);

	useEffect(() => {
		if (loginData?.success === true) {
			setTimeout(function () {
				// navigate('/projects');
				window.location.href = '/projects';
			}, 1000);
		}
	}, [loginData]);

	useEffect(() => {
		if (userProfileData) {
			if (userProfileData?.first_name) {
				// navigate('/projects');
				window.location.href = '/projects';
			}
			// else {
			//   if (userId) {
			//     dispatch(GetUserProfileDetails(userId));
			//   }
			//   else {
			//     // navigate('/auth/login');
			//   }
			// }
		}
	}, [userProfileData]);

	useEffect(() => {
		if (!userId) {
			dispatch(stopLoading(AUTH_LOADING));
		}
	}, []);

	if (isLoading) {
		return <Loading />;
	}
	const countryCode = Countcode.countries.map((e) => {
		return {
			value: e?.['Final country code'],
			label: `${e?.['Country/geographical area']} (${e?.['Final country code']})`,
		};
	});
	const {
		email,
		ph_email,
		mobile,
		ph_mobile,
		password,
		ph_password,
		login_name,
		forgot_password,
		dont_have_an_account,
		create_new_account,
		use_mobile,
		use_email,
		terms_and_conditions,
	} = getSiteLanguageData('auth');
	const {
		close
	} = getSiteLanguageData('commons');
	return (
		<Fragment>
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm-7 col-lg-7 login-left"></div>
					<div className="col-sm-12 col-lg-5  login-box">
						<div className="col-sm-12 text-center">
							<img alt="livefield" src="/images/logo-with-text.png" />
						</div>
						<div className="col-sm-12 mt-5 login-toggle main-area ">
							<Form onSubmit={(e) => loginUser(e)}>
								{!useMobile ? (
									<div>
										<div className="form-group">
											<span
												onClick={() => handleUseMobile(!useMobile)}
												className="pointer float-end theme-link text-bold show-login mt-1">
												{use_mobile?.text}
											</span>
											<Form.Label htmlFor="password-field">
												{email?.text}
											</Form.Label>
											<InputGroup className="mb-3">
												<FormControl
													placeholder={ph_email?.text}
													type="text"
													name="username"
													id="exampleInputEmail1"
													aria-describedby="emailHelp"
													autoComplete="email"
													onChange={(e) => handleChange(e)}
													value={data.username}
												/>
											</InputGroup>
										</div>
									</div>
								) : (
									<div>
										<div className="form-group">
											<span
												onClick={() => handleUseMobile(!useMobile)}
												className="pointer theme-link text-bold show-login float-end mt-1">
												{use_email?.text}
											</span>
											<Form.Label htmlFor="password-field">
												{mobile?.text}
											</Form.Label>
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
													aria-describedby="emailHelp"
													onChange={(e) => handleChange(e)}
													value={data.username}
												/>
											</InputGroup>
										</div>
									</div>
								)}
								<div className="form-group">
									<Form.Label htmlFor="password-field">
										{password?.text}
									</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											className=""
											placeholder={ph_password?.text}
											autoComplete="current-password"
											type={showPassword ? 'text' : 'password'}
											name="password"
											onChange={(e) => handleChange(e)}
											value={data.password}
										/>
										<InputGroup.Text
											className="theme-color"
											onClick={() => setPasswordShow(!showPassword)}
											id="basic-addon2">
											<i
												className={
													showPassword
														? 'fa fa-fw fa-eye-slash'
														: 'fa fa-fw fa-eye'
												}></i>
										</InputGroup.Text>
									</InputGroup>
								</div>
								<div className="form-group ">
									<div className="row">
										<div className="col">
											<Form.Group controlId="formBasicCheckbox">
												<Form.Check
													type={'checkbox'}
													id={`default-checkbox`}
													label={`Remember Me`}
												/>
											</Form.Group>
										</div>
										<div className="col">
											<span>
												<a
													href="/Forgotpassword"
													className="float-end theme-link text-bold show-login text-end">
													{forgot_password?.text}
												</a>
											</span>
										</div>
									</div>
								</div>

								<Button
									type="submit"
									className="col-12 btn btn-primary theme-btn btn-block">
									<i className="fas fa-sign-in-alt me-2"></i>
									{login_name?.text}
								</Button>
							</Form>
						</div>
						<div className="col-sm-12 login-bottom-links mt-3 hide-register-link">
							<p>{dont_have_an_account?.text}</p>
							<a
								href="/auth/register"
								className="theme-link text-bold show-register ">
								{create_new_account?.text}
							</a>
							{/* <a href="/Forgotpassword" className="theme-link text-bold show-login ms-5">Forgot Password ?</a> */}
						</div>
						<div
							className="col-sm-12 login-bottom-links mt-2 show-login-link"
							style={{ display: 'none' }}>
							<p>{forgot_password.Text}</p>
							<a href="/dashboard" className="theme-link text-bold show-login">
								{forgot_password?.text}
							</a>
						</div>
					</div>
				</div>
			</div>
			{/* <!--  Terms and Conditions Modal  --> */}
			{/* <div
				className="modal fade"
				id="terms"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true">
				<div className="modal-dialog modal-xl" role="document">
					<div className="modal-content radius-0">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								{terms_and_conditions?.text}
							</h5>
							<Button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</Button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-sm-12">
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Ut enim ad minim veniam, quis nostrud exercitation
										ullamco laboris nisi ut aliquip ex ea commodo consequat.
										Duis aute irure dolor in reprehenderit in voluptate velit
										esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
										occaecat cupidatat non proident, sunt in culpa qui officia
										deserunt mollit anim id est laborum.
									</p>
									<h6>
										<strong>
											Section 1.10.32 of "de Finibus Bonorum et Malorum",
											written by Cicero in 45 BC
										</strong>
									</h6>
									<p>
										Sed ut perspiciatis unde omnis iste natus error sit
										voluptatem accusantium doloremque laudantium, totam rem
										aperiam, eaque ipsa quae ab illo inventore veritatis et
										quasi architecto beatae vitae dicta sunt explicabo. Nemo
										enim ipsam voluptatem quia voluptas sit aspernatur aut odit
										aut fugit, sed quia consequuntur magni dolores eos qui
										ratione voluptatem sequi nesciunt. Neque porro quisquam est,
										qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
										velit, sed quia non numquam eius modi tempora incidunt ut
										labore et dolore magnam aliquam quaerat voluptatem. Ut enim
										ad minima veniam, quis nostrum exercitationem ullam corporis
										suscipit laboriosam, nisi ut aliquid ex ea commodi
										consequatur? Quis autem vel eum iure reprehenderit qui in ea
										voluptate velit esse quam nihil molestiae consequatur, vel
										illum qui dolorem eum fugiat quo voluptas nulla pariatur?
									</p>
									<h6>
										<strong>
											Section 1.10.32 of "de Finibus Bonorum et Malorum",
											written by Cicero in 45 BC
										</strong>
									</h6>
									<p>
										Sed ut perspiciatis unde omnis iste natus error sit
										voluptatem accusantium doloremque laudantium, totam rem
										aperiam, eaque ipsa quae ab illo inventore veritatis et
										quasi architecto beatae vitae dicta sunt explicabo. Nemo
										enim ipsam voluptatem quia voluptas sit aspernatur aut odit
										aut fugit, sed quia consequuntur magni dolores eos qui
										ratione voluptatem sequi nesciunt. Neque porro quisquam est,
										qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
										velit, sed quia non numquam eius modi tempora incidunt ut
										labore et dolore magnam aliquam quaerat voluptatem. Ut enim
										ad minima veniam, quis nostrum exercitationem ullam corporis
										suscipit laboriosam, nisi ut aliquid ex ea commodi
										consequatur? Quis autem vel eum iure reprehenderit qui in ea
										voluptate velit esse quam nihil molestiae consequatur, vel
										illum qui dolorem eum fugiat quo voluptas nulla pariatur?
										Sed ut perspiciatis unde omnis iste natus error sit
										voluptatem accusantium doloremque laudantium, totam rem
										aperiam, eaque ipsa quae ab illo inventore veritatis et
										quasi architecto beatae vitae dicta sunt explicabo. Nemo
										enim ipsam voluptatem quia voluptas sit aspernatur aut odit
										aut fugit, sed quia consequuntur magni dolores eos qui
										ratione voluptatem sequi nesciunt. Neque porro quisquam est,
										qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
										velit, sed quia non numquam eius modi tempora incidunt ut
										labore et dolore magnam aliquam quaerat voluptatem. Ut enim
										ad minima veniam, quis nostrum exercitationem ullam corporis
										suscipit laboriosam, nisi ut aliquid ex ea commodi
										consequatur? Quis autem vel eum iure reprehenderit qui in ea
										voluptate velit esse quam nihil molestiae consequatur, vel
										illum qui dolorem eum fugiat quo voluptas nulla pariatur?
									</p>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<Button
								type="button"
								className="btn btn-secondary"
								data-dismiss="modal">
								{close?.text}
							</Button>
						</div>
					</div>
				</div>
			</div> */}
		</Fragment>
	);
}
export default Login;
