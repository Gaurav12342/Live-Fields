import { Fragment, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ForgotPassReset } from '../../store/actions/ForgotPassword';
import { getParameterByName } from '../../helper';
import { getSiteLanguageData } from '../../commons';

function ForgotPassword() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showPassword, setPasswordShow] = useState(false);
	const [showConfirmPassword, setConfirmPasswordShow] = useState(false);
	const userName = getParameterByName('userName');
	const code = getParameterByName('code');
	const otp = getParameterByName('otp');
	const [data, setData] = useState({
		// firstname : '',
		// otp : '',
		newpassword: '',
		confirmpassword: '',
		// password : ''
	});
	const {
		new_password,
		match_password,
		not_match_passowrd,
		confirm_password,
		change_password,
		register_mobile_email,
		login_here,
		submit,
		first_name,
	} = getSiteLanguageData('profile');

	const { by_signing_up, terms_privacy_policy, sing_up, password, last_name, email, mobile,change,otp_will_expire,verify } = getSiteLanguageData('auth/register');
	const { verify_your_email,a_code_has_been_sent_to,didn_receive_the_code,resend,already_have_an_account } =
		getSiteLanguageData('verifyforogototp');

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
	const forgotData = useSelector((state) => state?.forgotPass);
	const resetPassword = useCallback(
		(e) => {
			e.preventDefault();

			dispatch(
				ForgotPassReset({
					email: code ? '' : userName,
					mobile: code ? userName : '',
					country_code: decodeURI(code),
					otp: otp,
					password: data.newpassword,
				}),
			);
		},
		[data, forgotData, dispatch],
	);

	useEffect(() => {
		if (forgotData?.forgot_pass_reset.success === true) {
			navigate('/auth/login');
		}
	}, [forgotData?.forgot_pass_reset.success, dispatch]);

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
						<div className="col-sm-12 mt-5 login-toggle">
							<Form onSubmit={(e) => resetPassword(e)} method="post">
								{/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email / Mobile</label>
                        <input type="text" name=
                        "username" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={e => handleChange(e)} value={data.username}/>
                      </div> */}
								{/* <div className="form-group">
                        <Form.Label htmlFor="password-field"> Enter Otp</Form.Label >
                        <InputGroup className="mb-3">
                            <FormControl
                              placeholder="Enter Otp"
                              aria-label="Recipient's otp"

                              type="number"
                              name="otp"
                              onChange={e => handleChange(e)} value={data.otp}
                            />

                          </InputGroup>
                      </div> */}

								<div className="form-group">
									<Form.Label htmlFor="password-field">{new_password.text}</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											placeholder={new_password.text}
											aria-label="Recipient's newpassword"
											type={showPassword ? 'text' : 'password'}
											name="newpassword"
											autoComplete="new-password"
											minLength={8}
											onChange={(e) => handleChange(e)}
											value={data.newpassword}
										/>
										<InputGroup.Text
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
								<div className="form-group">
									<span className="float-end mt-1">
										{data.newpassword &&
											data.confirmpassword &&
											(data?.newpassword === data?.confirmpassword ? (
												<span className="text-success">{match_password.text}</span>
											) : (
												<span className="text-danger">
													{not_match_passowrd.text}
												</span>
											))}
									</span>
									<Form.Label htmlFor="password-field">
										{confirm_password.text}
									</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											placeholder={confirm_password.text}
											aria-label="Recipient's confirmpassword"
											aria-describedby="basic-addon"
											autoComplete="off"
											type={showConfirmPassword ? 'text' : 'password'}
											name="confirmpassword"
											minLength={8}
											onChange={(e) => handleChange(e)}
											value={data.confirmpassword}
										/>
										<InputGroup.Text
											onClick={() =>
												setConfirmPasswordShow(!showConfirmPassword)
											}
											id="basic-addon">
											<i
												className={
													showConfirmPassword
														? 'fa fa-fw fa-eye-slash'
														: 'fa fa-fw fa-eye'
												}></i>
										</InputGroup.Text>
									</InputGroup>
								</div>

								<div className="d-flex justify-content-center mt-4">
									<Button
										disabled={data?.newpassword !== data?.confirmpassword}
										type="submit"
										className="btn btn-primary theme-btn btn-block ls">
										{' '}
										<i className="fa-solid fa-key me-2"></i> {change_password.text}
									</Button>
								</div>
							</Form>
						</div>
						<div
							className="col-sm-12 mt-5 forget-pass-toggle"
							style={{ display: 'none' }}>
							<form>
								<div className="form-group">
									<label htmlFor="fp">{register_mobile_email.text}</label>
									<input type="email" className="form-control" id="fp" />
								</div>
								<div className="form-group">
									<div className="row">
										<div className="col-sm-6"></div>
										<div className="col-sm-6 text-end">
											<a href="/dashboard" className="theme-link show-lg">
												{login_here.text}
											</a>
										</div>
									</div>
								</div>
								<button
									type="submit"
									className="btn btn-primary theme-btn btn-block">
									{submit.text}
								</button>
							</form>
						</div>
						<div
							className="col-sm-12 mt-5 register-toggle"
							style={{ display: 'none' }}>
							<form>
								<div className="row">
									<div className="form-group col-sm-6">
										<label htmlFor="r-fname">{first_name.text}</label>
										<input type="text" className="form-control" id="r-fname" />
									</div>
									<div className="form-group col-sm-6">
										<label htmlFor="r-lname">{last_name?.text}</label>
										<input type="text" className="form-control" id="r-lname" />
									</div>
								</div>
								<div className="form-group">
									<label htmlFor="r-email">{email.text}</label>
									<input type="text" className="form-control" id="r-email" />
								</div>
								<div className="form-group">
									<label htmlFor="mobile">{mobile.text}</label>
									<div className="input-group">
										<select className="form-control mobile-code-selector">
											<option>IND +91</option>
											<option>USA +1</option>
										</select>
										<input type="text" className="form-control" id="mobile" />
									</div>
								</div>
								<div className="form-group">
									<label htmlFor="r-password">{password.text}</label>
									<input
										type="password"
										className="form-control"
										id="r-password"
									/>
								</div>
								<div className="form-group">
									<div className="row">
										<div className="col-sm-12">
											<label className="theme-checkbox">
												{by_signing_up.text}
												<a
													href="/dashboard"
													data-toggle="modal"
													data-target="#terms"
													className="theme-link">
													{terms_privacy_policy.text}
												</a>
												<input type="checkbox" />
												<span className="checkmark"></span>
											</label>
										</div>
									</div>
								</div>
								<button
									type="submit"
									className="btn btn-primary theme-btn btn-block show-verify">
									{sing_up.text}
								</button>
							</form>
						</div>
						<div
							className="col-sm-12 mt-5 text-center verify-email"
							style={{ display: 'none' }}>
							<img
								alt="livefield"
								src="/images/OTP_mail.svg"
								className="mb-3"
								width="80px"
							/>
							<h1>
								<strong>{verify_your_email.text}</strong>
							</h1>
							<p className="text-muted mb-0">{a_code_has_been_sent_to.text}</p>
							<p>
								livefield@gmail.com
								<a
									href="/dashboard"
									className="ms-2 theme-color theme-link-hover">
									{change.text}
								</a>
							</p>
							<input
								type="text"
								name=""
								className="otp-small-input"
								autoFocus
							/>
							<input type="text" name="" className="otp-small-input" />
							<input type="text" name="" className="otp-small-input" />
							<input type="text" name="" className="otp-small-input" />
							<p className="text-muted mb-0 mt-3">
								{`- ${otp_will_expire.text} 9:21`}
							</p>
							<p className="text-muted">
								{`-${didn_receive_the_code?.text}`}
								<a href="/dashboard" className="theme-color theme-link-hover">
									{resend?.text}
								</a>
							</p>
							<div className="col-sm-10 offset-sm-1">
								<a
									href="welcome.html"
									className="btn btn-primary theme-btn btn-block mt-4">
									{verify.text}
								</a>
							</div>
						</div>
						<div className="col-sm-12 login-bottom-links mt-3 hide-register-link">
							<p>{already_have_an_account?.text}</p>
							<a
								href="/auth/login"
								className="theme-link text-bold show-register">
								{login_here.text}
							</a>
						</div>
						<div
							className="col-sm-12 login-bottom-links mt-2 show-login-link"
							style={{ display: 'none' }}>
							<p>{already_have_an_account?.text}</p>
							<a href="/dashboard" className="theme-link text-bold show-login">
							{login_here.text}
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* <!--  Terms and Conditions Modal  --> */}
			<div
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
								Terms and Conditions - Last Updated 26th Aug, 2020
							</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
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
							<button
								type="button"
								className="btn btn-secondary"
								data-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			{/*

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="js/bootstrap.min.js"></script>
    <script>
        $(document).ready(function(){
          $(".show-fp").click(function(){
            $(".forget-pass-toggle").show(1000);
            $(".login-toggle").hide(1000);
          });
          $(".show-lg").click(function(){
            $(".forget-pass-toggle").toggle(1000);
            $(".login-toggle").toggle(1000);
          });
          $(".show-verify").click(function(){
            $(".verify-email").show(1000);
            $(".register-toggle").hide(1000);
            $(".show-login-link").hide(1000);
          });
          $(".show-register").click(function(){
            $(".forget-pass-toggle").hide(1000);
            $(".login-toggle").hide(1000);
            $(".hide-register-link").hide(1000);
            $(".show-login-link").show(1000);
            $(".register-toggle").toggle(1000);
          });
          $(".show-login").click(function(){
            $(".forget-pass-toggle").hide(1000);
            $(".register-toggle").hide(1000);
            $(".login-toggle").show(1000);
            $(".show-login-link").hide(1000);
            $(".hide-register-link").show(1000);
          });
          $(".toggle-password").click(function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
              input.attr("type", "text");
            } else {
              input.attr("type", "password");
            }
          });
        });
    </script>
  */}
		</Fragment>
	);
}

export default ForgotPassword;
