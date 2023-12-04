import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserRegistrationEmailVerify } from '../store/actions/Profile';
import {
	REGISTRATION,
	USER_EMAIL_VERIFY_PROCESS,
} from '../store/actions/actionType';
import { useNavigate } from 'react-router-dom';
import { getSiteLanguageData } from '../commons';

function AuthLayout(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [mode, setMode] = useState('registration');

	const [data] = useState({
		firstname: '',
		lastname: '',
		email: '',
		mobile: '',
		password: '',
		country_code: '',
	});

	const registerData = useSelector((state) => {
		return state?.auth?.[REGISTRATION] || {};
	});
	const verifyEmailData = useSelector((state) => {
		return state?.profile?.[USER_EMAIL_VERIFY_PROCESS] || {};
	});
	// const handleChange = useCallback(
	//   (e) => {
	//     const name = e.target.name;
	//     const value = e.target.value;
	//     setData({
	//       ...data,
	//       [name]: value,
	//     });
	//   },
	//   [data]
	// );
	// const registerUser = useCallback(
	//   (e) => {
	//     e.preventDefault();
	//     dispatch(
	//       registration({
	//         first_name: data?.firstname,
	//         last_name: data?.lastname,
	//         email: data?.email,
	//         mobile: data?.mobile,
	//         password: data?.password,
	//         country_code: data?.country_code,
	//       })
	//     );
	//   },
	//   [data, dispatch]
	// );
	useEffect(() => {
		if (registerData?.success === true) {
			setMode('email_verify');
			if (data?.email)
				dispatch(
					UserRegistrationEmailVerify({
						email: data?.email,
						mobile: '',
						country_code: '',
					}),
				);
		}
	}, [registerData, data?.email, dispatch]);

	useEffect(() => {
		if (verifyEmailData?.success === true) {
			if (localStorage.getItem('ruserId'))
				localStorage.setItem('userId', localStorage.getItem('ruserId'));
			if (localStorage.getItem('rtoken'))
				localStorage.setItem('token', localStorage.getItem('rtoken'));
			// navigate('/welcome');
			// window.location.href = 'welcome'
		}
	}, [verifyEmailData?.success, dispatch]);
	const { already_have_an_account, login_here } = getSiteLanguageData(
		'components/authlayout',
	);
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
						{props.children}
						<div className="col-sm-12 login-bottom-links mt-2 hide-register-link">
							<p>{already_have_an_account?.text}</p>
							<a
								href="/auth/login"
								onClick={() => {
									localStorage.removeItem('token');
									localStorage.removeItem('userId');
								}}
								className="theme-link text-bold">
								{login_here?.text}
							</a>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
export default AuthLayout;
