import { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import Sidebar from './sidebar';
import { Button, Card, Col, Dropdown, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useParams } from 'react-router';
import PropTypes from 'prop-types';
import OpenNotificationModal from '../containers/Notification';
import Licence from './plans';
// import PlanModel from './PlanModel';
// import Wallet from './wallet';
import {
	GET_ALL_USER_BILLING_INFO,
	GET_LICENSE_PLANS,
	GET_USER_LICENSE,
	LICENCE_PURCHASED,
} from '../store/actions/actionType';
import Chat from '../containers/Chat';
import moment from 'moment';
import licence_img from '../images/licence.svg';
import Loading from './loadig';
// import Support from '../containers/Support';
import ImageLightBox from './ImageLightBox';
// import PlanBillingInfo from './planBillingInfo';
import { useNavigate } from 'react-router-dom';
// import { Cart } from './plans';
// import { getProjectDetails } from '../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../commons';
import { getProjectDetails } from '../store/actions/projects';
import ProfileImage from './ProfileImage';
import {
	// getLicensePlans,
	// purchaseLicence,
	// renewalLicense,
	getUserLicence
} from '../store/actions/License';
import {
	getNotification
} from '../store/actions/Notification';
import {
	GET_NOTIFICATION_COUNT
} from '../store/actions/actionType';
// import { getAllUserBillingInfo } from '../store/actions/Profile';


function Layout(props) {
	const userId = getUserId();
	const navigate = useNavigate();
	const { project_id } = useParams();
	const [toggled, doToggle] = useState(false);
	const [open, setOpenNotification] = useState(false);
	const location = useLocation();
	const dispatch = useDispatch();
	const userProfileData = useSelector((state) => {
		return state?.profile?.user_profile_details?.result || {};
	});

	const { icon_notification } = getSiteLanguageData('layout');

	const { icon_licence } = getSiteLanguageData('layout');

	const licenseFlag = useSelector((state) => {
		return state?.ui_red?.[LICENCE_PURCHASED];
	});

	const userLicence = useSelector((state) => {
		return state?.license?.[GET_USER_LICENSE]?.result;
	});

	const dataNotification = useSelector((state) => {
		return state?.notification?.[GET_NOTIFICATION_COUNT]?.result || [];
	});

	useEffect(() => {
		if(!userLicence || (userLicence && !userLicence._id)){
			dispatch(getUserLicence(userId))
		}
		
		 if (!props.nosidebar) {
			dispatch(getProjectDetails(project_id, userId));
		}
		dispatch(getNotification(userId));
	}, [dispatch, project_id, userId]);

	// const [selected_licence_period_id, setSelected_licence_period_id] = useState('');
	// const [licence_plan_id, setLicence_plan_id] = useState('');
	// const [selected_plan, setSelected_plan] = useState('');
	// const [userCount, setUserCount] = useState(0);
	// const [step, setStep] = useState(1);

	// let licence_period_id = selected_licence_period_id;
	// const billinfo = useSelector((state) => {
	// 	return state?.profile?.[GET_ALL_USER_BILLING_INFO]?.result;
	// });

	// useEffect(() => {
	// 	if (!billinfo) {
	// 		dispatch(getAllUserBillingInfo(userId));
			
	// 	}
	// }, []);
	// const data = useSelector((state) => {
	// 	return state?.license?.[GET_LICENSE_PLANS]?.result;
	// });
	// useLayoutEffect(() => {
	// 	// if (!data) {
	// 		// dispatch(getLicensePlans());
	// 		setInterval(() => {
	// 			dispatch(getNotification(userId));
	// 		}, 250000);
	// 	// }
	// }, []);
	// if (selected_licence_period_id === '') {
	// 	licence_period_id = data?.[0]?.licence_period_id;
	// }
	// const planData = {};
	// useEffect(() => {
	// 	// if (selected_licence_period_id === '') {
	// 	setSelected_licence_period_id(data?.[0]?.licence_period_id);
	// 	// }
	// });
	// data?.forEach((d) => {
	// 	if (!d?.is_trial) {
	// 		planData[d.licence_period_id] = planData[d.licence_period_id] || [];
	// 		planData[d.licence_period_id].push(d);
	// 	}
	// });

	
	const {
		purchase_plan,
		renew_plan,
		my_profile,
		my_subscription,
		logout,
		licence,
		purchase_a_plan_before_your_trial_ends,
		to_prevent_loss_of_features,
		upgrade_options,
		my_account,
		project,
		team,
		need_help
	} = getSiteLanguageData('components/layout');
	const noSideBarTopMenu = [
		{
			lable: 'Projects',
			path: '/projects',
			extraClass: 'active',
		},
		{
			lable: 'Team',
			path: '/team',
			extraClass: licenseFlag ? '' : 'd-none',
		},
		{
			lable: 'Need Help?',
			path: 'https://livefield.app/guide',
			extraClass: '',
			target:"_blank"
		},
	];
	if (userProfileData?.email_verify === false) {
		return <Navigate to="/auth/verify-email" />;
	}

	if (!userLicence) {
		return <Loading />;
	}
	if (
		userLicence?.is_expired === true &&
		location.pathname !== '/subscription' && location.pathname !== '/cart'
	) {
		window.location.href="/subscription"; // HideCart
		return (
			<>
				<Loading />
			</>
		);
	}
	
	return (
		<Fragment>
			{/*navbar-expand-lg tablet view work*/}

			{props.nosidebar ? (
				<>
					<nav className="p-0 lf-layout-fixed navbar navbar-expand d-nav d-md-flex d-none">
						<a
							className="navbar-brand lf-layoutdashfirstlogo-res"
							href="/projects">
							<img alt="livefield" className="ms-3" src="/images/logo-sm.png" />
						</a>

						{/* <i className="lf-layout-project fas fa-ellipsis-v theme-link mt-1"></i> */}

						{/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button> */}

						<div
							className="collapse navbar-collapse lf-layoutdashfirstptoject-res ls"
							id="navbarSupportedContent">
							<ul className="navbar-nav ms-auto nav-links-d">
								{noSideBarTopMenu.map((item) => (
									<li
										className={`nav-item ${item.extraClass}`}
										key={item.lable}>
										<a
											className={`nav-link ${
												item.path === location.pathname ? 'active' : ''
											}`}
											href={item.path}
											target={item.target ? item.target : ""}
										>
											{item.lable}
										</a>
									</li>
								))}
							</ul>
						</div>
						<div
							className="collapse navbar-collapse lf-layout-profile-res "
							id="navbarSupportedContent">
							<ul className="navbar-nav ms-auto">
								<li className="nav-item">
									{/* <Licence navigate={navigate}>
										<a
											className="nav-link licence-img-nav"
											tooltip={icon_licence.tooltip}
											flow={icon_licence.tooltip_flow}>
											<img
												alt="livefield"
												className="mt-2"
												src={licence_img}
												width="22px"
												height="22px"
											/>
										</a>
									</Licence> */}
									{
										userLicence && (userLicence.is_trial || userLicence.is_expired) && (
											<a className="nav-link licence-img-nav" href="/cart" ><img alt="livefield" src={licence_img} width="22px" height="22px" className="mt-2" /></a>
										)
									}									
								</li>
								<li className="nav-item">
									<span
										className={`nav-link mt-1 `}
										tooltip={icon_notification.tooltip}
										flow={icon_notification.tooltip_flow}>
										<img
											className={`mt-2`}
											onClick={() => setOpenNotification(!open)}
											alt="Notification"
											src="/images/notification.svg"
											width="22px"
											height="22px"
										/>
										<label className="badge theme-color ps-0 notification-badge">{dataNotification?.count ? dataNotification?.count > 99 ? `99+` : dataNotification?.count : 0}</label>
									</span>
									{/* <OpenNotificationModal dashboard={props.nosidebar} /> */}
									{/* <Notification /> style={{ marginTop: props.open ? '53px' : null }} ${props.open ? 'lf-team-header-res' : ''}*/}
								</li>

								<li>
									<Dropdown>
										<Dropdown.Toggle variant="transparent" id="dropdown-basic">
											<img
												title={'Profile'}
												alt="livefield"
												src={
													(userProfileData?.thumbnail ||
														userProfileData?.profile ||
														'/images/users/profile_user.png') +
													'?v=' +
													new Date().getTime()
												}
												className="top-pofile-pic"></img>{' '}
											{userProfileData?.first_name}
										</Dropdown.Toggle>
										<Dropdown.Menu className="lf-dropdown-animation lf-dropdown-center">
											<Dropdown.Item
												className="lf-layout-profile-menu lf-dropdown-animation"
												href="/profile">
												<i className="far fa-user-circle me-2"></i>{my_profile?.text}
											</Dropdown.Item>
											{licenseFlag ? (
												<>
												<Dropdown.Item
													className="lf-layout-profile-menu lf-dropdown-animation"
													href="/subscription">
													<i className="far fa-address-card me-2"></i>{my_subscription?.text}
												</Dropdown.Item>
												</>
											) : (
												''
											)}
											{/* <Wallet />
											<Support /> */}
											<Dropdown.Item
												href="/logout"
												className="lf-layout-profile-menu logout-link lf-dropdown-animation text-danger">
												<i className="fas fa-power-off me-2"></i>{logout?.text}
											</Dropdown.Item>
											{/* <Dropdown.Item href="/logout">Logout</Dropdown.Item> */}
										</Dropdown.Menu>
									</Dropdown>
								</li>
							</ul>
						</div>
					</nav>

					<div className="row g-0 d-flex d-md-none d-nav">
						<div className="col-6">
							<a href="/projects">
								<img
									alt="livefield"
									className="ms-4 mt-2"
									src="/images/logo-sm.png"
								/>
							</a>
						</div>
						<div className="col-6 lf-layout-header-mobile text-end">
							<ul>
								<li className='me-3'>
									<span
										className="nav-link px-0"
										tooltip={icon_notification.tooltip}
										flow={icon_notification.tooltip_flow}>
										<img
											onClick={() => setOpenNotification(!open)}
											alt="livefield"
											src="/images/notification.svg"
											width="22px"
											height="22px"
										/>
										<lable className="badge theme-color ps-0 notification-badge">{dataNotification?.count ? dataNotification?.count > 99 ? `99+` : dataNotification?.count : 0}</lable>
									</span>
									{/* <OpenNotificationModal dashboard={props.nosidebar} /> */}
								</li>
								<li>
									<Dropdown>
										<Dropdown.Toggle  variant="transparent" id="dropdown-basic">
											<img
												title={'Profile'}
												alt="livefield"
												src={
													(userProfileData?.thumbnail ||
														userProfileData?.profile ||
														'/images/users/profile_user.png') +
													'?v=' +
													new Date().getTime()
												}
												className="top-pofile-pic"></img>{' '}
											<div className='d-none d-sm-block ms-2'>{userProfileData?.first_name}</div>
										</Dropdown.Toggle>
										<Dropdown.Menu>

											<Dropdown.Item href="/projects" className='lf-layout-profile-menu d-sm-block'>
												<i className="fa-regular fa-folder me-2"></i>
												{project.text}
											</Dropdown.Item>

											{licenseFlag && <Dropdown.Item href="/team" className='lf-layout-profile-menu d-sm-block'>
												<i className="far fa-user me-2"></i>
												{team.text}
											</Dropdown.Item>}
											<hr className="my-0 d-sm" />
											<Dropdown.Item
												className="lf-layout-profile-menu"
												href="/profile">
												<i className="far fa-user-circle me-2"></i>
												{my_profile?.text}
											</Dropdown.Item>
											{licenseFlag ? (
												<>
												<Dropdown.Item
													className="lf-layout-profile-menu"
													href="/subscription">
													<i className="far fa-address-card me-2"></i>
													{my_subscription?.text}
												</Dropdown.Item>
												</>
											) : (
												''
											)}
											{/* <Wallet />
											<Support /> */}

											<hr className="my-0 d-sm" />
											
											<Dropdown.Item href="https://livefield.app/guide" className='lf-layout-profile-menu d-sm-block'>
												<i className="far fa-circle-question me-2"></i>
												{need_help.text}
											</Dropdown.Item>

											<Dropdown.Item
												href="/logout"
												className="lf-layout-profile-menu logout-link text-danger">
												<i className="fas fa-power-off me-2"></i>
												{logout?.text}
											</Dropdown.Item>	
												
											{/* <Dropdown.Item href="/logout">Logout</Dropdown.Item> */}
										</Dropdown.Menu>
									</Dropdown>
								</li>

								{/* <li>
									<Dropdown>
										<Dropdown.Toggle
											className="lf-notification-toggle"
											variant="transparent"
											id="dropdown-basic">
											<i className="fas fa-ellipsis-v fa-md mt-1"></i>
										</Dropdown.Toggle>
										<Dropdown.Menu className="me-1">
											<li>
												{noSideBarTopMenu.map((item) => (
													<span
														className={`${item.extraClass}`}
														key={item.lable}>
														<a
															className={`nav-link ${
																item.path === location.pathname ? 'active' : ''
															}`}
															href={item.path}
															target={item.target ? item.target : ""}
														>
															{item.lable}
														</a>
													</span>
												))}
											</li>
											<hr className="my-0" />
											<li className="lf-layout-profile-menu w-100">
												<Licence>
													<a
														className="nav-link"
														tooltip={icon_licence.tooltip}
														flow={icon_licence.tooltip_flow}>
														<span>{licence?.text}</span>
													</a>
												</Licence>
											</li>
										</Dropdown.Menu>
									</Dropdown>
								</li> */}
							</ul>
						</div>
					</div>
				</>
			) : (
				<>
					<nav className="p-0 lf-layout-fixed navbar navbar-expand navbar-light bg-light d-nav">
						<button
							className="btn-menu-toggle mx-3"
							id="menu-toggle"
							onClick={() => doToggle(!toggled)}>
							<i className="fas fa-bars"></i>
						</button>
						<a className="navbar-brand" href="/projects">
							<img
								alt="logo"
								className="lf-layout-logo-mobile-size"
								src="/images/logo-sm.png"
							/>
						</a>
						{/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button> */}

						<div
							className="collapse navbar-collapse"
							id="navbarSupportedContent">
							<ul className="navbar-nav ms-auto">
								{/* <li className="nav-item active">
                <a className="nav-link" href="/dashboard"><img alt="livefield" src="/images/cloud-sync.svg" width="25px" height="25px" /></a>
              </li> */}

								<li className="nav-item me-1 align-self-center">
									<span
										className="nav-link lf-link-cursor"
										tooltip={icon_notification.tooltip}
										flow={icon_notification.tooltip_flow}>
										<img
											className="pe-1"
											onClick={() => setOpenNotification(!open)}
											alt="notification"
											src="/images/notification.svg"
											width="22px"
											height="22px"
										/>
										<lable className="badge theme-color ps-0 notification-badge">{dataNotification?.count ? dataNotification?.count > 99 ? `99+` : dataNotification?.count : 0}</lable>
									</span>
									{/* <OpenNotificationModal dashboard={props.nosidebar} /> */}
								</li>
								<li className="profile-list">
									<Dropdown className="mx-2">
										<Dropdown.Toggle
											className="me-1 lf-layout-profilearrow-res"
											variant="transparent"
											id="dropdown-basic">
											<img
												title={'Profile'}
												alt="livefield"
												src={
													(userProfileData?.thumbnail ||
														userProfileData?.profile ||
														'/images/users/profile_user.png') +
													'?v=' +
													new Date().getTime()
												}
												className="top-pofile-pic"></img>{' '}
											<span className="d-none d-sm-inline ms-2">{userProfileData?.first_name}</span>
										</Dropdown.Toggle>
										<Dropdown.Menu className="shadow p-2 mb-2 bg-white rounded-7 lf-dropdown-center lf-dropdown-animation">
											<Dropdown.Item
												className="lf-layout-profile-menu lf-dropdown-animation"
												href={'/profile/' + project_id}>
												<i className="far fa-user-circle me-2"></i>
												{my_profile?.text}
											</Dropdown.Item>
											<Dropdown.Item
												className="lf-layout-profile-menu lf-dropdown-animation"
												href={'/subscription'}>
												<i className="far fa-address-card me-2"></i>
												{my_subscription?.text}
											</Dropdown.Item>
											{/* <Wallet /> */}
											{/* <Dropdown.Item className="lf-layout-profile-menu"  >
                    <Link to={`/wallet/:project_id`}><i className="fas fa-wallet me-2"></i>My Wallet </Link>
                    </Dropdown.Item> */}
											{/* <Support /> */}
											<Dropdown.Item
												className="lf-layout-profile-menu logout-link text-danger"
												href="/logout">
												<i className="fas fa-power-off me-2"></i>
												{logout?.text}
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
									<div
										className="dropdown-menu shadow p-1 mb-2 bg-white rounded"
										aria-labelledby="navbarDropdown">
										<a className="dropdown-item" href="/dashboard">
											<i className="far fa-user-circle me-2"></i>
											{my_profile?.text}
										</a>

										<a className="dropdown-item" href="/dashboard">
											<i className="far fa-edit me-2"></i>{my_account.text}
										</a>
										<a className="dropdown-item" href="/dashboard">
											<i className="far fa-address-card me-2"></i>
											{my_subscription?.text}
										</a>
										<a
											className="dropdown-item logout-link lf-layout-profile-menu "
											href="/dashboard">
											<i className="fas fa-power-off me-2"></i>
											{logout?.text}
										</a>
									</div>
								</li>
							</ul>
						</div>
					</nav>
					<Chat
						height={'300px'}
						room={props?.chatOptions?.room || project_id}
						{...props}
						chat_from={props?.chatOptions?.chat_from || 'project'}
						mode="component"
						title={props?.chatOptions?.title || 'Project Chat'}
					/>
				</>
			)}
			{userLicence?.is_trial ? (
				<>
				<div className="container-fluid">
					<div className="row lf-layout-second-header">
						<div className="col-12 align-self-start align-self-center my-2">
							<div className="d-flex align-items-center">
								<div className="float-start d-inline-block">
									<i
									className="fas fa-exclamation-triangle ms-4"
									style={{ fontSize: '16px' }}></i>
									<span className="ms-2">
										{purchase_a_plan_before_your_trial_ends?.text}{' '}
										{moment(userLicence?.end_date).format('DD-MM-YYYY')}{' '}
										{to_prevent_loss_of_features?.text}
									</span>
								</div>

								<div className="ms-auto float-end d-inline-block">
									<button type="button" onClick={()=>navigate("/cart")} className="btn lf-second-header-btn">
										{' '}
										{upgrade_options?.text}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				</>
			) : (
				''
			)}
			<div className="lf-layout-medium-margin-top">
				{props.nosidebar ? (
					props.children
				) : (
					<div
						className={`lf-layout-medium-margin-down ${
							toggled
								? 'd-flex toggled lf-layout-all-file'
								: 'd-flex lf-layout-all-file'
						}`}
						id="wrapper">
						<Sidebar toggled={toggled} />
						{props.children}
					</div>
				)}
			</div>

			{/* <Chat height={'300px'} room={props?.chatOptions?.room || project_id} {...props} chat_from={props?.chatOptions?.chat_from || 'project'} mode='component' title={props?.chatOptions?.title || 'Project Chat'} /> */}
			<OpenNotificationModal open={open} setOpenNotification={()=>setOpenNotification(!open)} dashboard={props.nosidebar} />
			<ImageLightBox />
		</Fragment>
	);
}
Layout.propTypes = {
	children: PropTypes.node.isRequired,
	nosidebar: PropTypes.bool,
};

export default Layout;
