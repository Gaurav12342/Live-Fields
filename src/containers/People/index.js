import { useState, useCallback, useEffect, Fragment } from 'react';
import {
	Dropdown,
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	INVITE_USER,
	REMOVE_USER,
	UPDATE_ROLE,
} from '../../store/actions/actionType';
import {
	getAllRoleWisePeople,
	inviteUserToProject,
	removeUserFromProject,
	updateUserRole,
} from '../../store/actions/projects';
import { Link } from 'react-router-dom';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';
import TagsInput from 'react-tagsinput';
import CustomSearch from '../../components/CustomSearch';
import CustomSelect from '../../components/SelectBox';

function People() {
	const userId = getUserId();
	const [mode, setMode] = useState('invite');
	const [collapsibleData, manageCollapsibleData] = useState({});
	const { project_id } = useParams();
	const [info, setInfo] = useState({
		name: '',
		email: '',
		mobile: '',
		title: '',
		role_id: '',
		member_id: '',
	});
	const [invitation_list, setInvitationList] = useState([]);
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
		(name, value) => {
			setInfo({
				...info,
				[name]: value,
			});
		},
		[info],
	);
	const dispatch = useDispatch();
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	const updateRoleResult = useSelector((state) => {
		return state?.project?.[UPDATE_ROLE] || [];
	});
	const inviteUserResult = useSelector((state) => {
		return state?.project?.[INVITE_USER] || [];
	});
	const removeUserResult = useSelector((state) => {
		return state?.project?.[REMOVE_USER] || [];
	});

	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [data, project_id, dispatch]);

	useEffect(() => {
		if (inviteUserResult?.success === true) {
			handleClose();
			dispatch(getAllRoleWisePeople(project_id));
			dispatch({
				type: INVITE_USER,
				[INVITE_USER]: [],
			});
		}
	}, [inviteUserResult?.success, dispatch]);

	useEffect(() => {
		if (updateRoleResult?.success === true) {
			handleClose();
			dispatch(getAllRoleWisePeople(project_id));
			dispatch({
				type: UPDATE_ROLE,
				[UPDATE_ROLE]: [],
			});
		}
	}, [updateRoleResult?.success, dispatch]);

	useEffect(() => {
		if (removeUserResult?.success === true) {
			handleClose();
			dispatch(getAllRoleWisePeople(project_id));
			dispatch({
				type: REMOVE_USER,
				[REMOVE_USER]: [],
			});
		}
	}, [removeUserResult?.success, dispatch]);

	const handleInviteUser = useCallback((e) => {
		e.preventDefault();
		if (mode === 'invite') {
			const post = {
				user_id: userId,
				project_id: project_id,
				invitation_list: invitation_list.map((e) => {
					return {
						role_id: info?.role_id,
						email: e,
					};
				}),
			};
			dispatch(inviteUserToProject(post, (resData) => handleClose()));
		}
		if (mode === 'update') {
			const post = {
				user_id: userId,
				project_id: project_id,
				member_id: info?.member_id,
				role_id: info?.role_id,
			};
			dispatch(updateUserRole(post, (resData) => handleClose()));
		}
	});

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
	const [sortType, handleSortType] = useState('3');
	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];
	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}

	let searchDataSource = [];
	data?.forEach((slist) => {
		searchDataSource = searchDataSource.concat(slist?.users);
	});

	const role = data?.map((tg) => {
		return { label: tg.name, value: tg._id };
	});

	const {
		btn_invite_people,
		btn_manage,
		icon_edit,
		icon_delete,
		no_user,
		email,
		user_role,
		invite_user,
		change_user_role,
		enter_email,
		invite,
		update_role,
	} = getSiteLanguageData('people');
	const { sort_by } = getSiteLanguageData('commons');
	return (
		<Layout>
			{data?.length === 0 ? (
				<Nodata type="People" />
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="row">
							<div className="col-12">
								<div className="d-flex align-items-center">
									<div className="float-start d-none d-md-inline-block">
										<CustomSearch
											suggestion={true}
											dataSource={{
												people: searchDataSource,
											}}
											handlePeopleModal={(prop) => {
												handleUpdateUserRole(prop, data);
											}}/>
									</div>

									<div className="float-start d-none d-lg-inline-block">
										<Dropdown className="">
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
												className="shadow p-2 mb-2 bg-white rounded-7 lf-dropdown-center lf-dropdown-animation dropdown-menu ">
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

									<div className="ms-auto float-end d-flex align-items-center d-inline-block">
										<div className="float-start d-inline-block">
											<Link
												to={`/people/${project_id}/roles`}
												className=" btn lf-common-btn lf-link-cursor mt-1">
												<i className="fa-solid fa-user-pen pe-1"></i>{' '}
												{btn_manage?.text}
											</Link>

										</div>

										<div className="float-start d-inline-block">
											<span
												tooltip={btn_invite_people.tooltip}
												flow={btn_invite_people.tooltip_flow}
												className="pb-2 lf-link-cursor lf-main-button"
												data-target="#add-project"
												onClick={handleShow}>
												<i className="fas fa-plus pe-1"></i>{' '}
												{btn_invite_people?.text}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div className="container mt-3">
						<div className="theme-table-wrapper no-bg">
							<table className="table table-hover theme-table people-table">
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
										.map((r) => {
											return (
												<Fragment>
													<tr
														className={`theme-table-data-row ${
															!collapsibleData?.[r._id]
																? 'bg-light'
																: 'bg-transparent'
														}`}>
														<td colSpan={6} className={'ps-2'}>
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
																<h6 className=" p-1">
																	<span className="fw-bold">
																		{r?.name} ({r?.users?.length})
																	</span>
																	<span>
																		<i
																			className={
																				!collapsibleData?.[r._id] === true
																					? 'fas fa-caret-down theme-secondary ms-2'
																					: 'fas fa-caret-right theme-secondary ms-2'
																			}></i>
																	</span>
																</h6>
															</span>
														</td>
													</tr>
													{r.users.length === 0 ? (
														<tr
															className={`theme-table-data-row bg-white text-center lf-text-vertical-align ${
																!collapsibleData?.[r._id] === true
																	? ''
																	: 'd-none'
															}`}>
															<td colSpan={6}>{no_user?.text}</td>
														</tr>
													) : (
														r?.users
															?.sort((a, b) => {
																if (sortType == '1') {
																	return (
																		a?.first_name + a?.last_name
																	).localeCompare(b?.first_name + b?.last_name);
																}
																if (sortType == '2') {
																	return (
																		a?.first_name +
																		a?.last_name.localeCompare(
																			b?.first_name + b?.last_name,
																		)
																	);
																}
																if (sortType == '3') {
																	return (
																		new Date(b.createdAt) -
																		new Date(a.createdAt)
																	);
																}
																if (sortType == '4') {
																	return (
																		new Date(a.createdAt) -
																		new Date(b.createdAt)
																	);
																}
																return true;
															})
															?.map((u) => {
																return (
																	<tr
																		className={`theme-table-data-row lf-task-color bg-white ${
																			!collapsibleData?.[r._id] ? ' ' : 'd-none'
																		}`}
																		key={u._id}>
																		<td className="people-cell">
																			<span className="text-center ps-5"></span>
																			<img
																				alt="livefield"
																				src={
																					u.thumbnail ||
																					u.profile ||
																					'/images/users/profile_user.png'
																				}
																				className="people-img"
																			/>
																		</td>
																		<td className=" text-capitalize py-3">
																			{u.first_name} {u.last_name}
																		</td>
																		<td className=" text-lowercase py-3">
																			{u.email}
																		</td>
																		<td className="py-3">
																			{u.country_code}
																			{u.mobile ? '-' : ''}
																			{u.mobile}
																		</td>
																		<td className="py-3">
																			<a to="#">{u.title}</a>
																		</td>
																		{userId !== u._id ? (
																			<td className="py-3">
																				{r.name === 'Super Admin' ? (
																					''
																				) : (
																					<>
																						<span
																							className="theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold p-2"
																							data-target="#add-project"
																							tooltip={icon_edit.tooltip}
																							flow={icon_edit.tooltip_flow}
																							onClick={() =>
																								handleUpdateUserRole({
																									...u,
																									role_id: r._id,
																								})
																							}>
																							<i
																								className="fas fa-edit"
																								width="15px"></i>
																						</span>
																						&nbsp;
																						<span
																							className="theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold p-2"
																							tooltip={icon_delete.tooltip}
																							flow={icon_delete.tooltip_flow}
																							onClick={() =>
																								sweetAlert(
																									() =>
																										dispatch(
																											removeUserFromProject({
																												user_id: userId,
																												project_id: project_id,
																												member_id: u._id,
																											}),
																										),
																									u?.email,
																									'Remove',
																								)
																							}>
																							<i
																								className="fas fa-trash-alt"
																								width="15px"></i>
																						</span>
																					</>
																				)}
																			</td>
																		) : (
																			<td>
																				<Link
																					className="btn-blue "
																					to={'/profile/' + project_id}>
																					<img
																						alt="livefield"
																						src="/images/edit-white.svg"
																						width="15px"
																					/>
																				</Link>
																				&nbsp;
																			</td>
																		)}
																	</tr>
																);
															})
													)}
												</Fragment>
											);
										})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
			{/* edit data modal */}
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>
						{mode === 'invite' ? invite_user.text : change_user_role.text}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleInviteUser}>
						<div className="form-group mb-3">
							<Form.Label htmlFor="Email" className="mb-0">
								{email?.text}
							</Form.Label>
							{mode === 'invite' ? (
								<>
									<TagsInput
										inputProps={{ placeholder: 'Enter Email' }}
										value={invitation_list}
										onChange={(e) => {
											if (e && Array.isArray(e)) {
												e = e.filter((email) =>
													/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(
														email,
													),
												);
												setInvitationList(e);
											}
										}}
									/>
									{/* <div style={{color:'#808080'}}>Type Email and press enter to add another.</div> */}
									<small id="emailHelp" className="form-text text-muted">
										{enter_email.text}
									</small>
								</>
							) : (
								<InputGroup>
									<FormControl
										className="lf-formcontrol-height"
										placeholder="Email"
										type="text"
										autoComplete="off"
										name="email"
										onChange={(e) => handleChange('email', e.target.value)}
										value={info.email}
										required
										readOnly={mode === 'update'}
									/>
								</InputGroup>
							)}
						</div>
						<div>
							<Form.Label className="mt-1 mb-0" htmlFor="Title">
								{user_role?.text}
							</Form.Label>
							{/* <InputGroup className="mb-3"> */}
							{/* <FormControl as="select" name="role_id" onChange={e => handleChange(e)} value={info.role_id} required>
                <option value={null}>select role</option>
                {
                  data?.map(d => {
                    return <option key={d._id} value={d?._id}>{d?.name}</option>
                  })
                }
              </FormControl> */}

							<CustomSelect
								placeholder="Select Role..."
								className="lf-h-45"
								name="role_id"
								onChange={(e) => handleChange('role_id', e.value)}
								options={role.filter((r) => r.label != 'Super Admin')}
								value={role?.filter((as) => as.value === info.role_id)}
							/>
							{/* </InputGroup> */}
						</div>
						<Button
							type="submit"
							className="btn theme-btn btn-block float-end mt-3">
							{mode === 'invite' ? invite.text : update_role.text}
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</Layout>
	);
}
export default People;
