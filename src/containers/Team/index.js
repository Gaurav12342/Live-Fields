import { useState, useEffect, useCallback, Fragment } from 'react';
import {
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
	Dropdown,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import {
	GET_ALL_ROLE_WISE_PEOPLE_TEAM,
	GET_USER_LICENSE,
	USER_PROFILE_DETAILS
} from '../../store/actions/actionType';
import {
	inviteUserToProject,
	updateUserRole,
} from '../../store/actions/projects';
import { Link } from 'react-router-dom';
import getUserId, { getSiteLanguageData } from '../../commons';
import Loading from '../../components/loadig';
import {
	changeUserLicenceRole,
	inviteUserToLicence,
	removeFromLicence,
	cencelInviteRequestLicence,
	getAllRoleWiseTeam,
	getUserLicence
} from '../../store/actions/License';

import {
	GetUserProfileDetails
} from '../../store/actions/Profile'
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { errorNotification } from '../../commons/notification';
import CustomSelect from '../../components/SelectBox';
import { CSVLink } from 'react-csv';
import CustomSearch from '../../components/CustomSearch';
import Swal from 'sweetalert2';

const TeamUserRow = ({ u, collapsibleData, data, ...props }) => {
	const userData = u?.project_users ? u?.project_users : u?.users;
	const userProfileData = props?.userProfileData;
	const userId = getUserId();
	const {
		first_name,
		last_name,
		country_code,
		mobile,
		email,
		profile,
		company_name,
	} = userData;
	const { select_role } = getSiteLanguageData('team/index');

	return (
		<tr
			className={`theme-table-data-row lf-task-color text-start bg-white  ${
				!collapsibleData?.['pending_users'] ? '' : 'd-none'
			}`}
			key={u._id}>
			<td className="people-cell align-middle">
				<span className="text-center ps-5"></span>
				<img
					alt="livefield"
					src={profile || '/images/users/profile_user.png'}
					className="people-img"
				/>
			</td>
			<td className=" text-capitalize text-start py-3 align-middle">
				{first_name} {last_name}
			</td>
			<td className=" text-lowercase py-3 align-middle">{email}</td>
			<td className="py-3 align-middle">
				{country_code}
				{mobile ? '-' : ''}
				{mobile}
			</td>
			<td className="align-middle"></td>
			<td className="text-left pe-3 py-3 align-middle">{company_name}</td>
			<td className="align-middle">
				<select
					aria-label="Default select example"
					className="form-control"
					disabled={true}
					value={u?.role}>
					<option>{select_role.text}</option>
					{data?.map((d) => {
						return (
							<option value={d._id} key={d._id}>
								{d.name}
							</option>
						);
					})}
				</select>
			</td>
			<td className='align-middle'>
				{((userProfileData?.licence_role?.role?.role == 'account_owner' || userProfileData?.licence_role?.role?.role == 'account_manager')) && (
					<div className={`px-4 text-center theme-btnbg`}>
						<i 
						onClick={()=>{
							Swal.fire({
								title: `Refuse to Join`,
								text: `Are you sure to cancel join request of ${userData.first_name} ${userData.last_name}`,
								icon: 'question',
								showCancelButton: true,
								reverseButtons: true,
								confirmButtonColor: '#dc3545',
								cancelButtonColor: '#28a745',
								confirmButtonText:
									'Yes, Cancel it!',
							}).then((result) => {
								if(result.isConfirmed){
									props.cencelUserInvitation(u);
								}
							});

						}}
						className={`far fa-trash-alt`}></i>
					</div>
				)}
				
			</td>
		</tr>
	);
};

function Team() {
	const userId = getUserId();
	const [mode, setMode] = useState('invite');
	const [collapsibleData, manageCollapsibleData] = useState({});
	const { project_id } = useParams();
	const [useAccount] = useState(true);
	const [sortType, handleSortType] = useState('1');
	const [userSearchTxt, setUserSearchTxt] = useState('');
	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];
	const [invitation_list, setInvitationList] = useState([]);
	const [info, setInfo] = useState({
		name: '',
		email: '',
		mobile: '',
		title: '',
		role_id: '',
		member_id: '',
	});
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setMode('invite');
		setInfo({
			name: '',
			email: '',
			mobile: '',
			title: '',
			role_id: '',
			member_id: '',
		});
	};
	const handleShow = () => setShow(true);
	const handleChange = useCallback(
		(e, availableLength) => {
			const name = e.target.name;
			const value = e.target.value;
			setInfo({
				...info,
				[name]: value,
			});
		},
		[info],
	);
	const dispatch = useDispatch();
	const userData = useSelector((state) => {
		return state?.license?.[GET_ALL_ROLE_WISE_PEOPLE_TEAM]?.result || [];
	});
	const licenceData = useSelector((state) => {
		return state?.license?.[GET_USER_LICENSE]?.result || {};
	});

	const userProfileData = useSelector((state) => {
		return state?.profile?.user_profile_details?.result || {};
	});

	useEffect(()=>{
		dispatch(GetUserProfileDetails(userId));
		dispatch(getUserLicence(userId))		
	},[]);

	useEffect(()=>{
		if(licenceData._id) dispatch(getAllRoleWiseTeam(licenceData?._id))
	},[licenceData])

	const data = userData?.users || [];
	const pendingUsers = userData?.pending_users || [];
	const guestUsers = userData?.guestUsers || [];
	let team = [];
	data?.forEach((te) => {
		team = team.concat( te?.users, guestUsers?.map((p) => p?.project_users), );
	});

	const handleExportJson = () => {
		let ur = [];

		data?.forEach((te) => {
			te?.users.forEach((u)=>ur.push({
				'User Name': u?.first_name +' ' +u?.last_name,
				'Company Name': u?.company_name,
				Email: u?.email,
				'Mobile No': u?.country_code + u?.mobile,
				'Company Name': u?.company_name,
				'Role':te.name
			}));			
		});
		guestUsers?.forEach((u)=>ur.push({
			'User Name': u?.project_users?.first_name +' ' +u?.project_users?.last_name,
			'Company Name': u?.project_users?.company_name,
			Email: u?.project_users?.email,
			'Mobile No': u?.project_users?.country_code + u?.project_users?.mobile,
			'Company Name': u?.project_users?.company_name,
			'Role':'Guest User'
		}));

		return ur;
	}

	const userRole = data?.map((ur) => { return { label: ur.name, value: ur._id }; });

	const handleInviteUserToProject = useCallback((e) => {
		e.preventDefault();
		if (mode === 'invite') {
			const post = {
				user_id: userId,
				project_id: project_id,
				invitation_list: [ { role_id: info?.role_id, email: info?.email, }, ],
			};
			dispatch(inviteUserToProject(post, (resData)=>handleClose()));
		}
		if (mode === 'update') {
			const post = {
				user_id: userId,
				project_id: project_id,
				member_id: info?.member_id,
				role_id: info?.role_id,
			};
			dispatch(updateUserRole(post, (resData)=>handleClose()));
		}
	});

	

	const handleInviteUser = useCallback((e) => {
		e.preventDefault();
		if (invitation_list?.length === 0) {
			return errorNotification('please enter at least one email');
		}
		const post = {
			user_licences_id: licenceData?._id,
			user_id: userId,
			invitation_list: invitation_list.map((e) => {
				return { role_id: info?.role_id, email: e, };
			}),
		};
		dispatch(inviteUserToLicence(post, (resData)=>handleClose()));
	});

	const handleInviteGuestUser = (dataObj) => {
		const post = {
			user_licences_id: dataObj.user_licences_id,
			user_id: userId,
			invitation_list: dataObj.invitation_list,
		};		
		dispatch(inviteUserToLicence(post, (resData)=>handleClose()));
	};

	const handleUpdateUserRole = (u) => {
		setInfo({
			...info,
			email: u?.email,
			member_id: u?._id,
			role_id: u?.role_id,
		});
		handleShow();
		setMode('update');
	};

	const {
		btn_invite_people,
		btn_export,
		insert_email,
		role,
		email,
		user_role,
	} = getSiteLanguageData('team');
	const { sort_by } = getSiteLanguageData('commons');
	const {
		you_do_not,
		type_email_and_press,
		select_role,
		invite_users,
		buy_now,
		guest_users,
	} = getSiteLanguageData('team/index');

	const handleRemoveUser = (userLicense) => {
		let post = {
			user_id:userId,
			member_id:userLicense._id,
			user_licences_id:userLicense.licence._id
		}
		dispatch(removeFromLicence(post));		
	};

	const cencelUserInvitation = (userLicense) => {
		let post = {
			user_id:userId,
			member_id:userLicense.users._id,
			user_licences_id:userLicense.user_licences_id,
			request_id:userLicense._id
		}
		dispatch(cencelInviteRequestLicence(post));
	}

	if ((!data?.length && data?.length !== 0) || !licenceData?._id) {
		return <Loading />;
	}

	let searchDataSource = [];
	guestUsers?.forEach((gUser) => {
		searchDataSource = searchDataSource.concat(gUser?.project_users);
	});
	data?.forEach((slist) => {
		searchDataSource = searchDataSource.concat(slist?.users);
	});

	const teamUserName = (name) => {
		setUserSearchTxt(name)
	}

	const roleOptions = (ty="") => {
		let rlArr = data?.filter((rl)=>{
			if(ty=="invite"){
				if(rl.name.toLowerCase() != "account owner"){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		});
		return rlArr?.map((r=>{
			return {
				label:r.name,
				value: r._id
			}
		}))
	}

	const availableLength =
		parseInt(licenceData?.count) -
		licenceData?.users?.length -
		parseInt(licenceData?.invition_hold_count);
	const disableInvite = availableLength <= 0;
	return (
		<Layout
			nosidebar={true}
			chatOptions={{
				room: licenceData?._id,
				chat_from: 'Team',
				title: 'Team Chat',
			}}>
			{
				<div id="page-content-wrapper" style={{minHeight: '94vh'}}>
					<section className="lf-dashboard-toolbar">
						<div className="container-fluid">
							<div className="row lf-team-header-res align-items-center">
								<div className="col-md-3 col-lg-2 col d-none d-sm-block">
									<CustomSearch
										seachText={userSearchTxt}
										suggestion={false}
										teamUserName={teamUserName}
										dataSource={{
											people: searchDataSource,
										}}
									/>
								</div>
								<div className="col-4">
									<Dropdown className="d-none d-sm-block">
										<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
											<Dropdown.Toggle
												variant="transparent"
												id="dropdown-basic"
												className="lf-common-btn">
												<span>{sortingList[parseInt(sortType) - 1]}</span>
											</Dropdown.Toggle>
										</span>
										<Dropdown.Menu
											style={{ backgroundColor: '#73a47' }}
											className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
											{sortingList.map((st, k) => {
												return (
													<Dropdown.Item
														key={k}
														className="lf-layout-profile-menu"
														onClick={() => handleSortType((k + 1).toString())}>
														{st}
													</Dropdown.Item>
												);
											})}
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="col-md-5 col-lg-6 text-end d-flex justify-content-end">
									{
										((userProfileData?.licence_role?.role?.role == 'account_owner' || userProfileData?.licence_role?.role?.role == 'account_manager') ) && (
										<>
											<span
												className=""
												tooltip={btn_export.tooltip}
												flow={btn_export.tooltip_flow}>
												<CSVLink
													className="lf-common-btn"
													data={handleExportJson()}
													filename={'team-list.csv'}
													target="_blank">
													<i className="fas fa-file-export mt-2 pt-1   "></i>{' '}
													{btn_export?.text}
												</CSVLink>
											</span>
											<span
												className="lf-link-cursor lf-main-button m-0"
												tooltip={btn_invite_people.tooltip}
												flow={btn_invite_people.tooltip_flow}
												data-target="#add-project"
												onClick={handleShow}>
												<i className="fas fa-plus"></i> {btn_invite_people?.text}{' '}
											</span>
										</>
									)}
								</div>
							</div>
						</div>
					</section>
					{/* <div className="container">
          {/* <div className="col-sm-12 pt-4"> */}
					{/* <div className="row pt-4">
            <div className="col-sm-7 text-end">
              {/* <a href="/dashboard" className="btn theme-btn" data-toggle="modal" data-target="#add-project">+ invite people</a> 
            </div>
          </div> */}
					{/* </div> 
        </div> */}
					<section className="container mt-4 grey-bg" style={{minHeight: 'auto'}}>
						<div className="theme-table-wrapper no-bg">
							<table className="table table-hover theme-table text-center">
								<tbody>
									{data
									?.sort((a, b) => {
										if (sortType == '1') {
											return a?.name.localeCompare(b?.name);
										}
										if (sortType == '2') {
											return b?.name.localeCompare(a?.name);
										}
										if (sortType == '3') {
											return new Date(b.createdAt) - new Date(a.createdAt);
										}
										if (sortType == '4') {
											return new Date(a.createdAt) - new Date(b.createdAt);
										}
										return true;
									})
									?.map((r) => {
										
										return (
											<Fragment key={r._id}>
												<tr
													className={`theme-table-data-row ${
														!collapsibleData?.[r._id]
															? 'bg-light'
															: 'bg-transparent'
													}`}>
													<td colSpan={8} className="text-start ps-2">
														<span
															aria-controls="example-collapse-text"
															className="text-dark lf-link-cursor"
															variant="transparent"
															onClick={() =>
																manageCollapsibleData({
																	...collapsibleData,
																	[r._id]: !collapsibleData?.[r._id],
																})
															}>
															<h6 className="my-2 ps-2">
																<strong>
																	{r?.name} ({r?.users?.length})
																</strong>
																<span>
																	<i
																		className={
																			!collapsibleData?.[r._id]
																				? 'fas fa-caret-down ms-2'
																				: 'fas fa-caret-right ms-2'
																		}></i>
																</span>
															</h6>
														</span>
													</td>
												</tr>
												{r?.users?.filter(osu => {
													return (!userSearchTxt) || (userSearchTxt && (osu.first_name+' '+osu.last_name).toLowerCase().includes(userSearchTxt.toLowerCase()));
												})
													?.sort((a, b) => {
														if (sortType == '1') {
															return a?.first_name.localeCompare(b?.first_name);
														}
														if (sortType == '2') {
															return b?.first_name.localeCompare(a?.first_name);
														}
														if (sortType == '3') {
															return (
																new Date(b.createdAt) - new Date(a.createdAt)
															);
														}
														if (sortType == '4') {
															return (
																new Date(a.createdAt) - new Date(b.createdAt)
															);
														}
														return true;
													})
													.map((u) => {
														return (
															<tr
																className={`theme-table-data-row lf-task-color lf-task-color text-start bg-white ${
																	!collapsibleData?.[r._id] ? '' : 'd-none'
																} align-items-center`}
																key={u._id}>
																<td className="people-cell align-middle">
																	<span className="text-center ps-5"></span>
																	<img
																		alt="livefield"
																		src={
																			u.profile ||
																			'/images/users/profile_user.png'
																		}
																		className="people-img"
																	/>
																</td>
																<td className="text-capitalize py-3 align-middle">
																	{u.first_name} {u.last_name}
																</td>
																<td className="text-lowercase py-3 align-middle">
																	{u.email}
																</td>
																<td className="py-3 align-middle">
																	{u.country_code}
																	{u.mobile ? '-' : ''}
																	{u.mobile}
																</td>
																<td className="py-3 align-middle">
																	<a to="#">{u.title}</a>
																</td>
																<td className="text-left pe-3 align-middle">
																	{u.company_name}
																</td>
																<td className="align-middle lf-w-160">
																	{(u?._id && userId && userId != u._id && (userProfileData?.licence_role?.role?.role == 'account_owner' || userProfileData?.licence_role?.role?.role == 'account_manager') ) && (
																		<CustomSelect
																			className="me-2 w-100"
																			isDisabled={u._id === licenceData?.owned_by}
																			value={userRole?.filter(
																				(f) => f.value === r._id,
																			)}
																			onChange={(e) => {
																				const c = window.confirm(
																					'Are you sure to change role?',
																				);
																				if (c) {
																					dispatch(
																						changeUserLicenceRole({
																							user_id: userId,
																							user_licences_id: licenceData?._id,
																							users: u?._id,
																							role_id: e.value,
																						}),
																					);
																				}
																			}}
																			options={
																				u._id === licenceData?.owned_by
																					? userRole
																					: userRole?.filter(
																							(f) => f.label !== 'Account Owner',
																					)
																			}
																		/>
																	)}
																	
																</td>
																<td className='align-middle'>
																	{(r.role_key && r.role_key != "account_owner" && userId != u._id && (userProfileData?.licence_role?.role?.role == 'account_owner' || userProfileData?.licence_role?.role?.role == 'account_manager')) && (
																		<div className={`px-4 text-center theme-btnbg`}>
																			<i 
																			onClick={()=>{
																				Swal.fire({
																					title: `Remove User?`,
																					text: `Are you sure to remove ${u.first_name} ${u.last_name}?`,
																					icon: 'question',
																					reverseButtons: true,
																					showCancelButton: true,																		
																					confirmButtonColor: '#dc3545',
																					cancelButtonColor: '#28a745',
																					confirmButtonText:
																						'Yes, Remove User!',
																				}).then((result) => {
																					if(result.isConfirmed){
																						handleRemoveUser(u);
																					}
																				});

																			}}
																			className={`far fa-trash-alt`}></i>
																		</div>
																	)}
																	
																</td>
															</tr>
														);
													})}
											</Fragment>
										);
									})}
									<tr
										className={`theme-table-data-row lf-task-color text-start  ${
											!collapsibleData?.['guestUsers']
												? 'bg-light'
												: 'bg-transparent'
										}`}>
										<td colSpan={8} className="text-start ps-2 align-middle">
											<span
												aria-controls="example-collapse-text"
												className="text-dark lf-link-cursor"
												variant="transparent"
												onClick={() =>
													manageCollapsibleData({
														...collapsibleData,
														['guestUsers']: !collapsibleData?.['guestUsers'],
													})
												}>
												<h6 className="my-2 ps-2">
													<strong>
														{guest_users?.text} ({guestUsers?.length})
													</strong>
													<span>
														<i
															className={
																!collapsibleData?.['guestUsers']
																	? 'fas fa-caret-down ms-2'
																	: 'fas fa-caret-right ms-2'
															}></i>
													</span>
												</h6>
											</span>
										</td>
									</tr>
									{guestUsers?.filter(osu => {
													return (!userSearchTxt) || (userSearchTxt && osu && osu.project_users && (osu.project_users.first_name+' '+osu.project_users.last_name).toLowerCase().includes(userSearchTxt.toLowerCase()));
												})?.sort((a, b) => {
														if (sortType == '1') {
															return a?.project_users?.first_name.localeCompare(b?.project_users?.first_name);
														}
														if (sortType == '2') {
															return b?.project_users?.first_name.localeCompare(a?.project_users?.first_name);
														}
														if (sortType == '3') {
															return (
																new Date(b?.project_users?.createdAt) - new Date(a?.project_users?.createdAt)
															);
														}
														if (sortType == '4') {
															return (
																new Date(a?.project_users?.createdAt) - new Date(b?.project_users?.createdAt)
															);
														}
														return true;
													})?.map((u) => {
										// return <TeamUserRow u={u} collapsibleData={collapsibleData} data={data} />
										return (
											<tr
												className={`theme-table-data-row lf-task-color bg-white text-start ${
													!collapsibleData?.['guestUsers'] ? '' : 'd-none'
												}`}
												key={u._id}>
												<td className="people-cell align-middle">
													<span className="text-center ps-5"></span>
													<img
														alt="livefield"
														src={
															u?.project_users?.profile ||
															'/images/users/profile_user.png'
														}
														className="people-img"
													/>
												</td>
												{/* <td><img alt="livefield" src="/images/wallet2.svg" width="20px" /></td> */}
												<td className="text-capitalize py-3 align-middle">
													{u?.project_users?.first_name}{' '}
													{u?.project_users?.last_name}
												</td>
												<td className=" text-lowercase py-3 align-middle">
													{u?.project_users?.email}
												</td>
												<td className="py-3 align-middle">
													{u?.project_users?.country_code}
													{u?.project_users?.mobile ? '-' : ''}
													{u?.project_users?.mobile}
												</td>
												<td className="py-3 align-middle"></td>
												<td className="text-left pe-3 align-middle">{u.company_name}</td>
												<td className="align-middle">
												{(u?._id && userId && userId != u._id && (userProfileData?.licence_role?.role?.role == 'account_owner' || userProfileData?.licence_role?.role?.role == 'account_manager') ) && (
													<CustomSelect
														className="me-2"
														disabled={u._id === licenceData?.owned_by}
														value={u.role}
														onChange={(e) => {
															const c = window.confirm(
																'Are you sure to change role ?',
															);
															if (c) {
																	handleInviteGuestUser({
																		user_licences_id: licenceData?._id,
																		invitation_list:[
																			{
																				email:u.project_users.email,
																				role_id:e.value
																			}
																		],
																	})
															}
														}}
														options={userRole?.filter(
															(f) => f.label !== 'Account Owner',
														)}
													/>
												)}
													
												</td>
												<td></td>
											</tr>
										);
									})}
									<tr
										className={`theme-table-data-row lf-task-color text-start ${
											!collapsibleData?.['pending_users']
												? 'bg-light'
												: 'bg-transparent'
										}`}>
										<td colSpan={8} className="text-start ps-2 align-middle">
											<span
												aria-controls="example-collapse-text"
												className="text-dark lf-link-cursor"
												variant="transparent"
												onClick={() =>
													manageCollapsibleData({
														...collapsibleData,
														['pending_users']:
															!collapsibleData?.['pending_users'],
													})
												}>
												<h6 className="my-2 ps-2">
													<strong>Pending ({pendingUsers?.length})</strong>
													<span>
														<i
															className={
																!collapsibleData?.['pending_users']
																	? 'fas fa-caret-down ms-2'
																	: 'fas fa-caret-right ms-2'
															}></i>
													</span>
												</h6>
											</span>
										</td>
									</tr>
									{pendingUsers?.map((u) => {
										return (
											<TeamUserRow
												u={u}
												collapsibleData={collapsibleData}
												data={data}
												userProfileData={userProfileData}
												cencelUserInvitation={cencelUserInvitation}
											/>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				</div>
			}
			{/* edit data modal */}
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className='py-2 bg-light' closeButton>
					<Modal.Title>
						{disableInvite ? 'License limit reached' : 'Invite People'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* // <div className="row  mb-2"> */}
					{/* <Form.Check inline type="radio" value="To The Account" name="radios" label="To The Account" variant="#f97316" /> */}
					{/* <Form.Check inline type="radio" value="To a Project" name="radios" label="To a Project" /> */}
					{/* <label className="radio-orange" onClick={() => handleUseAccount(true)}>To The Account
            <input type="radio" name="radio2" />
            <span className="radiokmark mt-2" ></span>
          </label> */}
					{/* <label className="radio-orange ms-2" onClick={() => handleUseAccount(false)}>To a Project
            <input type="radio" name="radio2" />
            <span className="radiokmark mt-2" ></span>
          </label> */}
					{/* // </div> */}
					{disableInvite ? (
						<div className="row p-2">
							<p className="lead">{you_do_not?.text}</p>
						</div>
					) : useAccount === true ? (
						<Form onSubmit={handleInviteUser}>
							<div className="form-group mb-2">
								<Form.Label htmlFor="Email">{insert_email?.text}</Form.Label>
								<TagsInput
									inputProps={{ placeholder: 'Enter Email' }}
									value={invitation_list}
									onChange={(e) => {
										if (e.length <= availableLength) {
											e = e.filter((email)=>(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)));
											setInvitationList(e);
											// setInvitationList(e);
										}
									}}
								/>
								<small id="emailHelp" className="form-text text-muted">
									{type_email_and_press?.text}{' '}
									{availableLength - invitation_list.length}
								</small>
							</div>
							{/* <hr /> */}
							<div className="form-group">
								<Form.Label htmlFor="Email">{role?.text}</Form.Label>
								<CustomSelect
									moduleType="roles"
									className="lf-formcontrol-height"
									name="role_id"
									onChange={(e) => {
										console.log(e, "tartet")
										handleChange({
											target:{
												name: "role_id",
												value:e.value
											}
										})
									}}
									options={roleOptions("invite")}
									value={roleOptions("invite")?.find((r)=>r._id == info.role_id)}
									closeMenuOnSelect={true}
								/>
							</div>
							{/* {
                invitation_list.map((il,key) => {
                  return <Fragment key={key}>
                    <span className="me-3">X</span> 
                    <span>{il.email}</span>
                    <select className="float-end form-control col-md-5">
                      <option value={null}>select role</option>
                      {
                        data?.map(d => {
                          return <option key={d._id} value={d?._id}>{d?.name}</option>
                        })
                      }
                    </select> 
                    <hr/>
                  </Fragment>
                })
              } */}

							{/* <hr /> */}

							<Button
								type="submit"
								className="btn theme-btn btn-block mt-3 float-end">
								<i class="fas fa-plus pe-1"></i>
								{invite_users?.text}{' '}
							</Button>
						</Form>
					) : (
						<Form onSubmit={handleInviteUserToProject}>
							<div className="form-group">
								<Form.Label htmlFor="Email ">{email?.text}</Form.Label>
								<InputGroup className="mb-3">
									<FormControl
										placeholder={email?.text}
										type="text"
										name="email"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.email}
										required
										readOnly={mode === 'update'}
									/>
								</InputGroup>
							</div>
							<div className="form-group">
								<Form.Label htmlFor="Title">{user_role?.text}</Form.Label>
								<InputGroup className="mb-3">
									<FormControl
										as="select"
										name="role_id"
										onChange={(e) => handleChange(e)}
										value={info.role_id}
										required>
										<option value={null}>select role</option>
										{data?.map((d) => {
											return (
												<option key={d._id} value={d?._id}>
													{d?.name}
												</option>
											);
										})}
									</FormControl>
								</InputGroup>
							</div>
							<Button type="submit" className="btn  theme-btn btn-block">
								{mode === 'invite' ? 'Invite' : 'Update Role'}
							</Button>
						</Form>
					)}
					{disableInvite ? (
						<a href="/subscription" className="theme-btn btn">
							{buy_now?.text}
						</a>
					) : (
						''
					)}
				</Modal.Body>
				{/* <Modal.Footer>
        {disableInvite ? <a href="/subscription" className="theme-btn btn">Buy Now</a> : ''}
      </Modal.Footer> */}
			</Modal>
		</Layout>
	);
}
export default Team;
