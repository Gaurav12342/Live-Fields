import Layout from '../../components/layout';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
	ChangePassword,
	GetUserProfileDetails,
	UpdateProfile,
	UploadProfileImage,
	updateSettings
} from '../../store/actions/Profile';
import { useParams } from 'react-router';
import Countcode from '../../commons/CountryCodes.json';
import { useNavigate } from 'react-router-dom';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import CustomSelect from '../../components/SelectBox';
import ProfileImage from '../../components/ProfileImage';
import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import CropProfile from './components/cropProfile';

function Profile() {
	const userId = getUserId();
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const Navigate = useNavigate();
	const userProfileData = useSelector((state) => {
		return state?.profile?.user_profile_details?.result || {};
	}, shallowEqual);

	const [data, setData] = useState({
		old_password: '',
		new_password: '',
		confirm_password: '',
		company_name: '',
		country_code: '',
		createdAt: '',
		created_date: '',
		email: '',
		email_otp: '',
		email_otp_time: '',
		email_verify: '',
		first_name: '',
		is_deleted: '',
		job_title: '',
		last_name: '',
		mobile: '',
		mobile_otp: '',
		mobile_otp_time: '',
		mobile_verify: '',
		password: '',
		password_otp: '',
		password_otp_time: '',
		profile: '/images/users/profile_user.png',
		referral_code: '',
		profile_update: false,
		user_setting: {
			notification_low_stock_alert: true,
			notification_daily_email_alert: true,
			notification_email_project_creation_deletion: true,
			notification_email_sheet_updated: true,
			notification_email_task_assigned: true,
			notification_sms_project_creation_deletion: true,
			notification_sms_sheet_updated: true,
			notification_sms_task_assigned: true,
		},
	});
	const handleChange = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.value;
			let profile_update = data?.profile_update;
			if (
				['old_password', 'new_password', 'confirm_password'].every(
					(d) => d !== name,
				)
			) {
				profile_update = true;
			}
			setData({
				...data,
				profile_update,
				[name]: value,
			});
		},
		[data],
	);
	const handleSettingChange = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.checked;
			setData({
				...data,
				profile_update: true,
				user_setting: {
					...data.user_setting,
					[name]: value,
				},
			});
		},
		[data],
	);

	const country_code = data.country_code.trim();
	const updateProfile = useCallback(
		(e) => {
			e.preventDefault();
			const post = {
				user_id: userId,
				first_name: data?.first_name,
				last_name: data?.last_name,
				email: data?.email,
				company_name: data?.company_name,
				job_title: data?.job_title,
				country_code: country_code?.trim(),
				mobile: data?.mobile,
				user_setting: data?.user_setting,
			};
			
			if (data?.profile_update) {
				dispatch(UpdateProfile(post, Navigate));
			}
		},
		[data, dispatch],
	);

	const updatePassword = useCallback(
		(e) => {
			e.preventDefault();
			
			const cpwPost = {
				user_id: userId,
				old_password: data?.old_password,
				new_password: data?.new_password,
				confirm_password: data?.confirm_password,
			};
			if (data?.old_password && data?.old_password !== '') {

				if (data?.new_password && data?.new_password.length < 8) {
					return errorNotification('Password must be at least 8 characters long');
				}
				
				if (!data?.new_password || data?.new_password === '') {
					return errorNotification('New Password can not be empty');
				}


				if (data?.new_password !== data?.confirm_password) {
					return errorNotification(
						'New Password and Confirm Password not matched',
					);
				}
				dispatch(ChangePassword(cpwPost, Navigate));
			}
		},
		[data, dispatch],
	);

	useEffect(() => {
		if (!userProfileData?.first_name) {
			dispatch(GetUserProfileDetails(userId));
		}
	}, [userProfileData]);

	useEffect(() => {
		if (
			['first_name', 'last_name', 'email', 'mobile'].every(
				(d) => data[d] === '',
			)
		) {
			setData({
				...data,
				company_name: userProfileData?.company_name || '',
				country_code: userProfileData?.country_code || '',
				createdAt: userProfileData?.createdAt || '',
				created_date: userProfileData?.created_date || '',
				email: userProfileData?.email || '',
				email_otp: userProfileData?.email_otp || '',
				email_otp_time: userProfileData?.email_otp_time || '',
				email_verify: userProfileData?.email_verify || '',
				first_name: userProfileData?.first_name || '',
				is_deleted: userProfileData?.is_deleted || '',
				job_title: userProfileData?.job_title || '',
				last_name: userProfileData?.last_name || '',
				mobile: userProfileData?.mobile || '',
				mobile_otp: userProfileData?.mobile_otp || '',
				mobile_otp_time: userProfileData?.mobile_otp_time || '',
				mobile_verify: userProfileData?.mobile_verify || '',
				password: userProfileData?.password || '',
				password_otp: userProfileData?.password_otp || '',
				password_otp_time: userProfileData?.password_otp_time || '',
				// profile: userProfileData?.profile ? userProfileData?.profile+'?'+Math.random() : "/images/users/profile_user.png",
				profile: userProfileData?.profile || '/images/users/profile_user.png',
				referral_code: userProfileData?.referral_code || '',
				user_setting: userProfileData?.user_setting,
			});
		} else if (
			userProfileData?.profile &&
			data?.profile !== userProfileData?.profile
		) {
			setData({
				...data,
				profile: userProfileData?.profile || '/images/users/profile_user.png',
			});
		}
	}, [userProfileData, data]);

	const saveNotificationSettings = () => {
		console.log(data, "data data data");
		const post = {
			...data.user_setting,
			user_id: userId
		}
		dispatch(updateSettings(post, (resData)=>{

		}))

	}
	
	const {
		Profile,
		dashboard,
		referral_code,
		personal_details,
		first_name,
		last_name,
		job_title,
		email,
		mobile,
		company,
		settings,
		email_notification_settings,
		push_notification_settings,
		change_password,
		sms_notification_settings,
		old_password,
		new_password,
		confirm_password,
		copy,
		share,
		save,
		match_password,
		not_match_passowrd,
		clipboard_to_copy
	} = getSiteLanguageData('profile');
	return (
		<Layout nosidebar={!project_id ? true : false}>
			<div id="page-content-wrapper">
				{/*	<section className="lf-dashboard-toolbar">
					<div className="container-fluid">
						<div className="row p-2">
							<div className="col-2">
								<h3 className="ms-3">{Profile?.text}</h3>
							</div>
							 <div className="col-10 text-nowrap">
                <nav aria-label="breadcrumb text-end">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/dashboard">{dashboard?.text}</a>
                    </li>
                    <li
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      {Profile?.text}
                    </li>
                  </ol>
                </nav>
              </div> 
						</div> 
					</div>
				</section> */}
				<div className="container">
					<div className="row">
						<div className="col-sm-12 main-area">
							<div className="row">
								<div className="col-lg-3 col-md-4">
									<div className="col-12 white-box text-center">
										<img
											alt="livefield"
											src={
												(userProfileData?.profile ||
													'/images/users/profile_user.png') +
												'?v=' +
												Math.random()
											}
											className="profile-page-photo"
										/>

										<div className="row">
											<div className="col-sm-12 d-flex justify-content-center">
												<span className="d-flex text-center me-5">
													<CropProfile src={data?.profile} />

													{/* ------------------------------------- */}

													{/* This Code For Old Upload Function */}
													{/* <Upload fileType="profile" fileKey={userId}>
                            <span className="theme-btnbg theme-secondary rounded lf-link-cursor p-1" tooltip={customize_profile.tooltip} flow={customize_profile.tooltip_flow}>
                              <i className="fas fa-edit lf-sheet-icon fa-lg "></i></span>
                          </Upload> */}

													{/* ------------------------------------- */}

													<span
														className="theme-btnbg theme-secondary rounded lf-link-cursor p-1 lf-btn-trash "
														onClick={() =>
															sweetAlert(
																() =>
																	dispatch(
																		UploadProfileImage({
																			user_id: userId,
																			profile_url: 'unset',
																		}),
																	),
																'Profile',
															)
														}>
														<i className="fas fa-trash-alt lf-sheet-icon m-1"></i>
													</span>
												</span>
											</div>
										</div>
									</div>
									<div className="white-box">
										<label className="white-box-label">
											{referral_code?.text}{' '}
										</label>
										<div className="form-group">
											<InputGroup className="mb-3">
												<FormControl
													type="text"
													name="referral_code"
													autoComplete="off"
													value={data.referral_code}
												/>
												<div className="input-group-prepend lf-profile-referral mt-2">
													<span
														tooltip={copy.tooltip}
														flow={copy.tooltip_flow}
														className="theme-btnbg theme-secondary rounded lf-link-cursor">
														<i
															className="far fa-copy lf-sheet-icon ms-3"
															onClick={() =>
																navigator.clipboard
																	.writeText(data.referral_code)
																	.then(() => {
																		successNotification(clipboard_to_copy.text);
																	})
															}></i>
													</span>
													<span
														tooltip={share.tooltip}
														flow={share.tooltip_flow}
														className="theme-btnbg theme-secondary rounded lf-link-cursor">
														<i
															className="fas fa-share-alt lf-sheet-icon ms-3"
															onClick={() =>
																navigator.share({
																	title: `Share`,
																	text: `Please register using my referral code ${data.referral_code} and earn rewards. Hope you like it`,
																	url: 'https://devweb.livefield.app/auth/register',
																})
															}></i>
													</span>
												</div>
											</InputGroup>
										</div>
									</div>
								</div>
								<div className="col-lg-9 col-md-8">
									<div className="col-sm-12 white-box ">
										<div className='row'>
											<div className="col-6">
												<label className="white-box-label">
													{' '}
													{personal_details?.text}
												</label>
											</div>
											<div className="col-6 text-end">
												<Button onClick={updateProfile} className="btn  theme-btn ">
												<i class="fa-solid fa-floppy-disk pe-2"></i>
												{save?.text}
												</Button>
											</div>
										</div>
										<Form className="row">
											<div className="form-group col-sm-4">
												<Form.Label htmlFor="First Name">
													{first_name?.text}
												</Form.Label>
												<InputGroup className="mb-3">
													<FormControl
														placeholder="Firstname"
														type="text"
														name="first_name"
														autoComplete="given-name"
														onChange={(e) => handleChange(e)}
														value={data.first_name}
													/>
												</InputGroup>
											</div>
											<div className="form-group col-sm-4">
												<Form.Label htmlFor="Last Name">
													{last_name?.text}
												</Form.Label>
												<InputGroup className="mb-3">
													<FormControl
														placeholder="Lastname"
														type="text"
														name="last_name"
														autoComplete="family-name"
														onChange={(e) => handleChange(e)}
														value={data.last_name}
													/>
												</InputGroup>
											</div>
											<div className="form-group col-sm-4">
												<Form.Label htmlFor="Last Name">
													{job_title?.text}
												</Form.Label>
												<InputGroup className="mb-3">
													<FormControl
														placeholder="Job Title"
														aria-label="Recipient's Job Title"
														type="text"
														name="job_title"
														autoComplete="off"
														onChange={(e) => handleChange(e)}
														value={data.job_title}
													/>
												</InputGroup>
											</div>
											<div className="form-group col-sm-4">
												<Form.Label htmlFor="Email">{email?.text}</Form.Label>
												{data.email_verify === true ? (
													<span>
														<img
															alt="livefield"
															src="/images/verified.png"
															width="18px"
														/>
													</span>
												) : (
													<a href="/auth/verify-email">
														<img
															alt="livefield"
															src="/images/notverify.png"
															width="18px"
														/>
													</a>
												)}
												<InputGroup className="mb-3">
													<FormControl
														placeholder="Email"
														aria-label="Recipient's Email"
														type="text"
														name="email"
														autoComplete="email"
														onChange={(e) => handleChange(e)}
														value={data.email}
													/>
												</InputGroup>
											</div>
											<div className="form-group col-lg-4 col-md-8">
												<Form.Label htmlFor="Mobile">
													{' '}
													{mobile?.text}
												</Form.Label>
												{data.mobile_verify === true ? (
													<span>
														<img
															alt="livefield"
															src="/images/verified.png"
															width="18px"
														/>
													</span>
												) : (
													<a href="/auth/verify-mobile">
														<img
															alt="livefield"
															src="/images/notverify.png"
															width="18px"
														/>
													</a>
												)}
												<InputGroup>
													<CustomSelect
														className="col-sm-5 ps-0 "
														moduleType="profile"
														name="country_code"
														onChange={(e) => {
															handleChange({
																target: {
																	name: 'country_code',
																	value: e.value,
																},
															});
														}}
														value={{
															label: data.country_code,
															value: data.country_code,
														}}
														options={Countcode.countries.map((e) => {
															return {
																value: e?.['Final country code'],
																label: `${e?.['Country/geographical area']} (${e?.['Final country code']})`,
															};
														})}
													/>
													<FormControl
														className="mb-3"
														placeholder="Mobile"
														aria-label="Recipient's Mobile"
														type="number"
														pattern="[0-9]{10}"
														autoComplete="tel-national"
														name="mobile"
														onChange={(e) => handleChange(e)}
														value={data.mobile}
													/>
												</InputGroup>
											</div>
											<div className="form-group col-sm-4">
												<Form.Label htmlFor="Company">
													{company?.text}
												</Form.Label>
												<InputGroup className="mb-3">
													<FormControl
														placeholder="Company"
														aria-label="Recipient's Company"
														type="text"
														name="company_name"
														autoComplete="organization"
														onChange={(e) => handleChange(e)}
														value={data.company_name}
													/>
												</InputGroup>
											</div>
										</Form>
									</div>

									<div className="col-sm-12 white-box">
										<div className='row'>
											<div className='col-6'>
												<label className="white-box-label"> {settings?.text}</label>
											</div>
											
											<div className="col-6 text-end">
												<Button onClick={saveNotificationSettings} className="btn  theme-btn ">
												<i class="fa-solid fa-floppy-disk pe-2"></i>
													{save?.text}
												</Button>
											</div>
											<div className='col-6'>
												<h6 className="theme-color">
													{email_notification_settings?.text}
												</h6>
											</div>
											<div className='col-12'>
												<Form.Check
													type="switch"
													id="notification_daily_email_alert"
													name="notification_daily_email_alert"
													onChange={handleSettingChange}
													checked={
														data?.user_setting?.notification_daily_email_alert
													}
													label="Enable daily email alert"
												/>
											</div>
											<div className='col-6'>
												<h6 className="theme-color mt-3">
													{push_notification_settings?.text}
												</h6>
											</div>
											<div className='col-12'>
												<Form.Check
													type="switch"
													id="notification_low_stock_alert"
													name="notification_low_stock_alert"
													onChange={handleSettingChange}
													checked={
														data?.user_setting?.notification_low_stock_alert
													}
													label="Enable Low stock alert"
												/>
											</div>
										
										</div>
										
										
										
										

										{/* <Form.Check
											type="switch"
											id="notification_email_sheet_updated"
											name="notification_email_sheet_updated"
											onChange={handleSettingChange}
											checked={
												data?.user_setting?.notification_email_sheet_updated
											}
											label="When a New sheet is uploaded."
										/>
										<Form.Check
											type="switch"
											id="notification_email_project_creation_deletion"
											name="notification_email_project_creation_deletion"
											onChange={handleSettingChange}
											checked={
												data?.user_setting
													?.notification_email_project_creation_deletion
											}
											label="When a new project is created or deleted."
										/>
										<Form.Check
											type="switch"
											id="notification_email_task_assigned"
											name="notification_email_task_assigned"
											onChange={handleSettingChange}
											checked={
												data?.user_setting?.notification_email_task_assigned
											}
											label="When New task is assigned."
										/>

										<h6 className="theme-color mt-3">
											{sms_notification_settings?.text}
										</h6>
										<Form.Check
											type="switch"
											id="notification_sms_sheet_updated"
											name="notification_sms_sheet_updated"
											onChange={handleSettingChange}
											checked={
												data?.user_setting?.notification_sms_sheet_updated
											}
											label="When a New sheet is uploaded."
										/>
										<Form.Check
											type="switch"
											id="notification_sms_project_creation_deletion"
											name="notification_sms_project_creation_deletion"
											onChange={handleSettingChange}
											checked={
												data?.user_setting
													?.notification_sms_project_creation_deletion
											}
											label="When a new project is created or deleted."
										/>
										<Form.Check
											type="switch"
											id="notification_sms_task_assigned"
											name="notification_sms_task_assigned"
											onChange={handleSettingChange}
											checked={
												data?.user_setting?.notification_sms_task_assigned
											}
											label="When New task is assigned."
										/> */}
									</div>
									<div className="col-sm-12 white-box">
										<div className='row'>
											<div className="col-6">
												<label className="white-box-label">
													{change_password?.text}
												</label>
											</div>
											<div className="col-6 text-end">
												<Button onClick={updatePassword} className="btn  theme-btn ">
												<i class="fa-solid fa-key pe-2"></i>
													{change_password?.text}
												</Button>
											</div>
										</div>
										
										
										<Form className="row">
											<div className="form-group col-sm-4">
												<Form.Label htmlFor="Old Password">
													{old_password?.text}
												</Form.Label>
												<InputGroup className="mb-3">
													<FormControl
														placeholder="Old Password"
														aria-label="Recipient's Old Password"
														type="password"
														name="old_password"
														autoComplete="current-password"
														onChange={(e) => handleChange(e)}
														value={data.old_password}
													/>
												</InputGroup>
											</div>
											<div className="form-group col-sm-4">
												<Form.Label htmlFor="New Password">
													{new_password?.text}
												</Form.Label>
												<InputGroup className="mb-3">
													<FormControl
														placeholder="New Password"
														aria-label="Recipient's New Password"
														type="password"
														name="new_password"
														autoComplete="new-password"
														minLength={8}
														onChange={(e) => handleChange(e)}
														value={data.new_password}
													/>
												</InputGroup>
											</div>
											<div className="form-group col-sm-4">
												<Form.Label htmlFor="Confirm Password">
													{confirm_password?.text}
												</Form.Label>
												<InputGroup className="mb-3">
													<FormControl
														placeholder="Confirm Password"
														aria-label="Recipient's Confirm Password"
														type="password"
														name="confirm_password"
														autoComplete="off"
														minLength={8}
														onChange={(e) => handleChange(e)}
														value={data.confirm_password}
													/>
												</InputGroup>
											</div>
											{data?.new_password === data?.confirm_password ? (
												data?.new_password && data?.confirm_password ? (
													<span className="text-success fw-bold text-end">
														{match_password.text}
													</span>
												) : (
													''
												)
											) : (
												<span className="text-danger fw-bold text-end">
													{not_match_passowrd.text}
												</span>
											)}
										</Form>
									</div>
									<div className="col-sm-12 text-end"></div>
								</div>
								
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default Profile;
