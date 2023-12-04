import { useState, useCallback, useEffect, Fragment } from 'react';
import {
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
	FormCheck,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_ROLE,
	INVITE_USER,
	REMOVE_USER,
	UPDATE_ROLE,
	DELETE_USER_ROLE_BY_ID,
	GET_ALL_ACCESS_KEYS,
	GET_ALL_ROLE_ACCESS_KEYS,
} from '../../store/actions/actionType';
import {
	getAllRoleWisePeople,
	getAllPeopleRole,
	inviteUserToProject,
	updateUserRole,
	creatUserRole,
	getAccessKey,
	getAllRoleAccessKey,
	updateUserRoleById,
	deleteUserRoleById,
} from '../../store/actions/projects';
import { Link } from 'react-router-dom';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Laoding from '../../components/loadig';

function UserRole() {
	const userId = getUserId();
	const [mode, setMode] = useState('invite');
	const dispatch = useDispatch();
	const { project_id, role_id } = useParams();
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
	const [showRole, setShowRole] = useState(false);
	const handleCloseRole = () => setShowRole(false);
	const [editRole, setEditRole] = useState(null);
	const submitRole = (e) => {
		handleCloseRole();
		e.preventDefault();
		dispatch(creatUserRole(infoRole));
	};

	const handleChangeRole = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfoRole({
			...infoRole,
			[name]: value,
		});
	};
	const [infoRole, setInfoRole] = useState({
		user_id: userId,
		project_id: project_id,
		role_name: '',
	});
	const handleShow = () => setShow(true);
	const handleChange = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.value;
			setInfo({
				...info,
				[name]: value,
			});
		},
		[info],
	);
	const deleteUserRoleResult = useSelector((state) => {
		return state?.project?.[DELETE_USER_ROLE_BY_ID] || {};
	});

	useEffect(() => {
		if (deleteUserRoleResult?.success === true) {
			dispatch(getAllPeopleRole(project_id));
		}
	}, [deleteUserRoleResult?.success, dispatch]);
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	const accessKey = useSelector((state) => {
		return state?.project?.[GET_ALL_ACCESS_KEYS]?.result || [];
	});
	const allRoleAccessKey = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_ACCESS_KEYS]?.result || [];
	});
	const Roledata = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE]?.result || [];
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
		if (accessKey?.length <= 0) {
			dispatch(getAccessKey());
		}
	}, [accessKey, dispatch]);
	useEffect(() => {
		if (allRoleAccessKey?.length <= 0) {
			dispatch(getAllRoleAccessKey(project_id));
		}
	}, [accessKey, dispatch]);
	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [data, project_id, dispatch]);

	useEffect(() => {
		if (Roledata?.length <= 0) {
			dispatch(getAllPeopleRole(project_id));
		}
	}, [Roledata?.length, dispatch]);

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
				invitation_list: [
					{
						role_id: info?.role_id,
						email: info?.email,
					},
				],
			};
			dispatch(inviteUserToProject(post));
		}
		if (mode === 'update') {
			const post = {
				user_id: userId,
				project_id: project_id,
				member_id: info?.member_id,
				role_id: info?.role_id,
			};
			dispatch(updateUserRole(post));
		}
	});

	const updateRole = (roleInfo) => {
		// e.preventDefault();
		const post = {
			user_id: userId,
			project_id: project_id,
			role_id: roleInfo?._id,
			role_name: roleInfo?.name,
			access: roleInfo?.access,
		};
		dispatch(updateUserRoleById(post));
	};

	if (
		(!data?.length && data?.length !== 0) ||
		!accessKey?._id ||
		allRoleAccessKey?.length === 0
	) {
		return <Laoding />;
	}
	const {
		icon_edit_manage,
		icon_delete_manage,
		btn_invite_people,
		create_role,
		new_role,
		user_role,
		create_role_btn,
		access_key_name,
		role_name,
		role_list,
		invite_user,
		change_user_role,
		invite,
		update_role,
	} = getSiteLanguageData('people');

	const { email } = getSiteLanguageData('commons');

	const { select_role } = getSiteLanguageData('team/rolelist');
	return (
		<Layout>
			{data?.length === 0 ? (
				<Nodata type="People">
					<Button className="btn theme-btn" onClick={handleShow}>
						{new_role?.text}
					</Button>
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<div className="lf-dashboard-toolbar">
						<section className="px-3">
							<div className="row align-items-center">
								<div className="col-12">
									<div className="d-flex align-items-center">
										<div className="float-start d-inline-block">
											<a
												className="lf-common-btn"
												href={`/people/${project_id}`}>
												<i className="fa fa-arrow-left" aria-hidden="true"></i>
											</a>
										</div>

										<div className="float-start d-inline-block">
											<span className="text-nowrap">{role_list?.text} </span>
										</div>

										<div className="ms-auto float-end d-inline-block">
											<span
											className="lf-link-cursor lf-main-button float-end"
											tooltip={create_role.tooltip}
											flow={create_role.tooltip_flow}>
												<Link
													to={`/people/${project_id}/roles/create`}
													className="Nav_link p-2 px-0">
													<i className="fas fa-plus pe-1"></i> {create_role?.text}
												</Link>
											</span>
										</div>
										


										
									</div>
								</div>
							</div>
						</section>
					</div>
					<div className="container-fluid  mt-2">
						<div className="theme-table-wrapper theme">
							<table
								className="table table-hover theme-table fixed-first"
								style={{ minWidth: allRoleAccessKey?.length * 150 + 'px' }}>
								<thead className="theme-table-title text-nowrap text-center bg-light">
									<tr className="bg-light">
										<th className="lf-w-150 text-capitalize ">
											{access_key_name?.text}
										</th>
										{allRoleAccessKey?.map((role, key) => {
											return (
												<th className="lf-w-150 text-capitalize" key={key}>
													{editRole === role?._id ? (
														<FormControl
															className="text-center"
															type="text"
															name="role_name"
															autoComplete="off"
															onBlur={(e) => {
																const name = e.target.value;
																updateRole({
																	...role,
																	name,
																});
																setTimeout(() => {
																	setEditRole(null);
																}, 1000);
															}}
															defaultValue={role.name}
														/>
													) : (
														<>
															{role?.name}
															{role?.is_default !== 1 ? (
																<>
																	<span
																		className="px-1 theme-btnbg rounded lf-link-cursor"
																		tooltip={icon_edit_manage.tooltip}
																		flow={icon_edit_manage.tooltip_flow}
																		onClick={(e) => setEditRole(role?._id)}>
																		<i className="fas fa-edit"></i>
																	</span>
																	<span
																		className="px-1 theme-btnbg rounded lf-link-cursor"
																		tooltip={icon_delete_manage.tooltip}
																		flow={icon_delete_manage.tooltip_flow}
																		onClick={() =>
																			sweetAlert(
																				() =>
																					dispatch(
																						deleteUserRoleById({
																							project_id: project_id,
																							role_id: role._id,
																						}),
																					),
																				role?.name,
																			)
																		}>
																		<i className="fas fa-trash-alt"></i>
																	</span>
																</>
															) : (
																''
															)}
														</>
													)}
												</th>
											);
										})}
									</tr>
								</thead>
								<tbody>
									{Object.keys(accessKey?.access_keys).map((pm, key) => {
										return (
											<Fragment key={key}>
												<tr className="text-capitalize theme-table-data-row bg-light">
													<td className="ps-3">
														<b>{pm?.replace(/_/g, ' ')}</b>
													</td>
													<td colSpan={allRoleAccessKey?.length}></td>
												</tr>
												{accessKey?.access_keys?.[pm]?.map((pmk, key) => {
													return (
														<tr
															key={key}
															className="text-capitalize theme-table-data-row bg-white">
															<td
																style={{ width: '250px', height: '30px' }}
																className="p-2 text-capitalize ">
																{pmk?.replace(/_/g, ' ')}
															</td>
															{allRoleAccessKey?.map((role, key) => {
																return (
																	<td className="text-center">
																		<FormCheck
																			type="checkbox"
																			className="visible"
																			disabled={role?.is_default === 1}
																			checked={role?.access?.[pm]?.[pmk]}
																			onChange={(e) => {
																				const access = role?.access;
																				if (typeof access[pm] == 'undefined') {
																					access[pm] = {};
																				}
																				access[pm][pmk] = e.target.checked;
																				updateRole({
																					...role,
																					access,
																				});
																			}}
																		/>
																	</td>
																);
															})}
														</tr>
													);
												})}
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
						<div className="form-group">
							<Form.Label htmlFor="Email" className="mb-0">
								{email?.text}
							</Form.Label>
							<InputGroup className="mb-1">
								<FormControl
									placeholder="Email"
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
						<div className="form-group ">
							<Form.Label htmlFor="Title" className="mb-0">
								{user_role?.text}
							</Form.Label>
							<InputGroup>
								<FormControl
									as="select"
									name="role_id"
									autoComplete="off"
									onChange={(e) => handleChange(e)}
									value={info.role_id}
									required>
									<option value={null}>{select_role.text}</option>
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
						<Button
							type="submit"
							className="btn  theme-btn btn-block mt-3 float-end">
							{mode === 'invite' ? invite.text : update_role.text}
						</Button>
					</Form>
				</Modal.Body>
			</Modal>

			<Modal show={showRole} onHide={handleCloseRole} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{create_role?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitRole}>
						<div className="row p-3">
							<div className="col-sm-12 mt-2">
								<div className="form-group">
									<Form.Label htmlFor="roletitle">{role_name?.text}</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											placeholder="Role Name"
											type="text"
											autoComplete="off"
											name="role_name"
											onChange={(e) => handleChangeRole(e)}
											value={infoRole.role_name}
											required
										/>
									</InputGroup>
									<div>
										{/* {
						Object.keys(accessKey?.access_keys)?.map(r => {
						return <div className="col-sm-12 mb-4 text-start" key={r}>
							<h6 className="mb-3 lf-link-cursor "><strong>{r} </strong>
							</h6>
							<table className={`table table-hover white-table`}>
							<tbody>
								{
								Object.keys(data?.access?.[r]).map(field => {
									return <tr key={field}>
									<td className="w-100">{field}</td>
									<td >
										<label className="check">
										<input
											type="checkbox"
											name={field}
											onChange={(e) => handleChange(e, r)}
											// defaultChecked={data?.access?.[r]?.[field]}
										/>
										<span className="checkmark"></span>
										</label>
									</td>
									</tr>
								})
								}
							</tbody>
							</table>
						</div>
						})
					} */}
									</div>
								</div>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 float-end show-verify">
									<i class="fas fa-plus pe-1"></i>
									{create_role_btn?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Layout>
	);
}
export default UserRole;
