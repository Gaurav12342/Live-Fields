import { useCallback, useState } from 'react';
import { registration } from '../../store/actions/registration';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Countcode from '../../commons/CountryCodes.json';
import { useNavigate } from 'react-router-dom';
import Terms from '../../components/termsModal';
import AuthLayout from '../../components/authLayout';
import CustomSelect from '../../components/SelectBox';
import { errorNotification } from '../../commons/notification';
import { getSiteLanguageData } from '../../commons';

const {
	first_name,
	ph_first_name,
	last_name,
	ph_last_name,
	email,
	ph_email,
	mobile,
	ph_mobile,
	password,
	ph_password,
	referral_code,
	ph_referral_code,
	by_signing_up,
	sing_up,
	agree_terms_privacy_policy
} = getSiteLanguageData('auth/register');
const { terms_N, privacy_policy, terms_and_conditions, close } =
	getSiteLanguageData('components/teemsmodal');


function Registration() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [data, setData] = useState({
		firstname: '',
		lastname: '',
		email: '',
		mobile: '',
		password: '',
		country_code: '+91 ',
		referral_code: '',
		term: '',
	});
	const [showPassword, setPasswordShow] = useState(false);
	const handleChange = useCallback(
		(name, value) => {
			setData({
				...data,
				[name]: value,
			});
		},
		[data],
	);
	const registerUser = useCallback(
		(e) => {
			e.preventDefault();
			if (data?.term === true) {
				dispatch(
					registration({
						first_name: data?.firstname,
						last_name: data?.lastname,
						email: data?.email?.trim(),
						mobile: data?.mobile?.trim(),
						password: data?.password,
						country_code: data?.country_code?.trim(),
						referral_code: data?.referral_code,
						term_policy: data?.term ? 'Yes' : 'No',
					},(response)=>{
						navigate(`/auth/verify-email/?email=${response.data?.result?.email}`)
					}),
				);
			} else {
				errorNotification(agree_terms_privacy_policy?.text);
			}
		},
		[data, dispatch],
	);
	const countryCode = Countcode.countries.map((e) => {
		return {
			value: e?.['Final country code'],
			label: `${e?.['Country/geographical area']} (${e?.['Final country code']})`,
		};
	});
	return (
		<AuthLayout>
			<div className="col-sm-12 mt-5">
				<Form onSubmit={(e) => registerUser(e)}>
					<div className="row">
						<div className="form-group col-sm-6">
							<Form.Label htmlFor="First Name">{first_name?.text}</Form.Label>
							<InputGroup>
								<FormControl
									placeholder={ph_first_name?.text}
									aria-label="Recipient's First Name"
									type="text"
									name="firstname"
									autoComplete="given-name"
									onChange={(e) => handleChange('firstname', e.target.value)}
									value={data.firstname}
									required
								/>
							</InputGroup>
						</div>
						<div className="form-group col-sm-6">
							<Form.Label htmlFor="Last Name">{last_name?.text}</Form.Label>
							<InputGroup className="">
								<FormControl
									placeholder={ph_last_name?.text}
									aria-label="Recipient's Lastname"
									type="text"
									name="lastname"
									autoComplete="family-name"
									onChange={(e) => handleChange('lastname', e.target.value)}
									value={data.lastname}
									required
								/>
							</InputGroup>
						</div>
					</div>
					<div className="form-group">
						<Form.Label htmlFor="email">{email?.text}</Form.Label>
						<InputGroup className="mb-3">
							<FormControl
								placeholder={ph_email?.text}
								aria-label="Recipient's email"
								type="email"
								name="email"
								autoComplete="email"
								onChange={(e) => handleChange('email', e.target.value)}
								value={data.email}
								required
							/>
						</InputGroup>
					</div>
					<div className="form-group ">
						<Form.Label htmlFor="mobile">{mobile?.text}</Form.Label>
						<div className="input-group">
							<CustomSelect
								className="col-4 ps-0 bg-white"
								name="country_code"
								autoComplete="tel-country-code"
								onChange={(e) => handleChange('country_code', e.value)}
								value={countryCode?.filter(
									(c) => c?.value === data?.country_code,
								)}
								options={countryCode}
							/>
							<FormControl
								className="form_mobile ms-1"
								placeholder={ph_mobile?.text}
								aria-label="Recipient's mobile"
								type="number"
								name="mobile"
								pattern="[0-9]{10}"
								autoComplete="tel-national"
								onChange={(e) => handleChange('mobile', e.target.value)}
								value={data.mobile}
								// required
							/>
						</div>
					</div>
					<div className="form-group ">
						<Form.Label htmlFor="password-field">{password?.text}</Form.Label>
						<InputGroup className="mb-3">
							<FormControl
								className=""
								placeholder={ph_password?.text}
								type={showPassword ? 'text' : 'password'}
								name="password"
								autoComplete="new-password"
								minLength={8}
								onChange={(e) => handleChange('password', e.target.value)}
								value={data.password}
								required
							/>

							<InputGroup.Text
								className="theme-color"
								onClick={() => setPasswordShow(!showPassword)}
								id="basic-addon2">
								<i
									className={
										showPassword ? 'fa fa-fw fa-eye-slash' : 'fa fa-fw fa-eye'
									}></i>
							</InputGroup.Text>
						</InputGroup>
					</div>
					<div className="form-group">
						<Form.Label htmlFor="Referral-field">
							{referral_code?.text}
						</Form.Label>
						<InputGroup className="mb-3">
							<FormControl
								placeholder={ph_referral_code?.text}
								aria-label="Recipient's email"
								type="text"
								name="referral_code"
								autoComplete="off"
								onChange={(e) => handleChange('referral_code', e.target.value)}
								value={data.referral_code}
							/>
						</InputGroup>
					</div>
					<div className="form-group ">
						<div className="row">
							<div className="col">
								{/* <Form.Group
                  className="mb-1"
                  controlId="formBasicCheckbox"
                >
                  <label className="check"><span className="lf-registerterms-text">By signing up, you agree to our</span><Terms type="component" />
                    <input
                      type="checkbox"
                      id="blankCheckbox"
                      onChange={(e) => handleChange("term", e.target.checked)}
                    />
                    <span className="checkmark mt-2"></span>
                  </label>
                </Form.Group> */}
								<Form.Group className="mb-1" controlId="formBasicCheckbox">
									<Form.Check
										type={'checkbox'}
										id={`default-checkbox`}
										className={''}
										label={
											<>
												<span className="">
													{by_signing_up?.text}
												</span>
												{/* <Terms type="component" /> */}
												<span
													className="text-bold show-login"
												>
													<a className='theme-color' target={'_blank'} href='https://livefield.app/terms-condition'>{' '}{terms_N?.text} </a>
													<span className="text-secondary"> & </span>
													<a className='theme-color' target={'_blank'} href={'https://livefield.app/privacy-policy'}>{privacy_policy?.text}</a>
												</span>
											</>
										}
										onChange={(e) => handleChange('term', e.target.checked)}
									/>
								</Form.Group>
							</div>
						</div>
					</div>
					<Button
						type="submit"
						className="col-12 btn btn-primary theme-btn btn-block">
						<i className="fa fa-check me-2" aria-hidden="true"></i>
						{sing_up?.text}
						{''}
					</Button>
				</Form>
			</div>
		</AuthLayout>
	);
}
export default Registration;
