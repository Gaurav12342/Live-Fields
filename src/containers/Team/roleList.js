import { useState, useCallback, useEffect } from 'react';
import {
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
	Row,
	Dropdown,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_USER_ROLE_BY_ID,
	GET_ALL_ROLE,
	INVITE_USER,
	REMOVE_USER,
	UPDATE_ROLE,
	CREATE_USER_ROLE,
	DELETE_USER_ROLE_BY_ID,
	GET_ALL_ACCESS_KEYS,
} from '../../store/actions/actionType';
import {
	getAllRoleWisePeople,
	getUserRoleById,
	getAllPeopleRole,
	inviteUserToProject,
	removeUserFromProject,
	updateUserRole,
	creatUserRole,
	deleteUserRoleById,
	getAccessKey,
} from '../../store/actions/projects';
import { Link } from 'react-router-dom';
import getUserId, { getSiteLanguageData } from '../../commons';
import Laoding from '../../components/loadig';
const userId = getUserId();
// import { getAllPeople, getAllRoleWisePeople } from '../../store/actions/people';
// const _id = window.localStorage.getItem('_id')

function UserRole() {
	const [mode, setMode] = useState('invite');
	const dispatch = useDispatch();
	const [collapsibleData, manageCollapsibleData] = useState({});
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
	const handleShowRole = (u) => {
		setInfoRole({
			...infoRole,
		});
		setShowRole(true);
	};

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
	const Roledata = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE]?.result || [];
	});

	const UserRoledata = useSelector((state) => {
		return state?.project?.[GET_USER_ROLE_BY_ID]?.result || [];
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
		if (UserRoledata?.length <= 0) {
			dispatch(getUserRoleById(role_id));
		}
	}, [UserRoledata?.length, dispatch]);

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

	const handleRemoveUser = (u) => {
		const isConfirmDelete = window.confirm(
			'are you sure to remove ' + u?.email,
		);
		if (isConfirmDelete) {
			dispatch(
				removeUserFromProject({
					user_id: userId,
					project_id: project_id,
					member_id: u._id,
				}),
			);
		}
	};
	// if (!data?.length && data?.length !== 0) {
	//   return <Layout>
	//     <div id="page-content-wrapper">
	//       <Laoding />
	//     </div>
	//   </Layout>
	// }
	if (!data?.length && data?.length !== 0) {
		return <Laoding />;
	}
	const {
		new_role,
		user_role,
		role_management,
		dashboard,
		people,
		invite_people,
		Create_Role_n,
		select_role,
		email,
	} = getSiteLanguageData('team/rolelist');
	const {
		role_name:roleName
	} = getSiteLanguageData('team/createrole');
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
					<section className="lf-dashboard-toolbar">
						<div className="container">
							<div className="row">
								<div className="col-sm-6">
									<div className="col-sm-12">
										<h3>{role_management?.text}</h3>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="col-sm-12">
										<nav aria-label="breadcrumb text-end">
											<ol className="breadcrumb">
												<li className="breadcrumb-item">
													<a href="/dashboard">{dashboard?.text}</a>
												</li>
												<li className="breadcrumb-item" aria-current="page">
													{people?.text}
												</li>
												<li
													className="breadcrumb-item active"
													aria-current="page">
													{role_management?.text}
												</li>
											</ol>
										</nav>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div className="container">
						<div className="col-sm-12 pt-4">
							<div className="row">
								<div className="col-sm-5"></div>
								<div className="col-sm-7 text-end">
									<span
										className="me-4 theme-color theme-link-hover"
										onClick={() => handleShowRole()}>
										{create_Role?.text}
									</span>
									<span className="btn theme-color">
										<Link
											to={`/people/${project_id}/roles/create`}
											className="theme-color">
											{create_Role?.text}
										</Link>
									</span>
									<Button
										className="btn theme-btn"
										data-target="#add-project"
										onClick={handleShow}>
										{invite_people?.text}
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div className="container">
						<div className="row">
							<div className="col-sm-12 main-area">
								<table className="table table-hover white-table">
									<tbody>
										{Roledata?.map((r) => {
											return (
												<tr key={r._id}>
													<td>
														<label className="check">
															<input
																type="checkbox"
																id="blankCheckbox"
																value="option1"
															/>
															<span className="checkmark"></span>
														</label>
													</td>
													<td>{r.name}</td>
													{userId !== r._id ? (
														<td>
															<Link
																className="btn-blue"
																to={
																	'/people/' + project_id + '/roles/' + r._id
																}>
																<img
																	alt="livefield"
																	src="/images/edit-white.svg"
																	width="15px"
																/>
															</Link>
															&nbsp;
															<Button
																className="btn-red"
																onClick={() => {
																	const isConfirmDelete = window.confirm(
																		`are you sure to Delete User Role`,
																	);
																	if (isConfirmDelete) {
																		dispatch(
																			deleteUserRoleById({
																				project_id: project_id,
																				role_id: r._id,
																			}),
																		);
																	}
																}}>
																<img
																	alt="livefield"
																	src="/images/delete-white.svg"
																	width="15px"
																/>
															</Button>
														</td>
													) : (
														<td>
															<Link
																className="btn-blue"
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
										})}
									</tbody>
								</table>

								{/* {
                  Roledata?.map(r => {
                    return <div className="col-sm-12 mb-4" key={r._id}>
                      <span
                        aria-controls="example-collapse-text"
                        className="text-dark lf-link-cursor"
                        variant="transparent"
                        // onClick={() => manageCollapsibleData({
                        //   ...collapsibleData,
                        //   [r._id]: !collapsibleData?.[r._id]
                        // })}
                      >
                        <h6 className="mb-3"><strong>{r?.name} ({r?.users?.length})</strong><span><i className={collapsibleData?.[r._id] === true ? "fas fa-caret-down ms-2" : "fas fa-caret-right ms-2"}></i></span>
                        </h6>
                      </span>
                      <table className={`table table-hover white-table ${collapsibleData?.[r._id] === true ? 'lf-collapsible-table' : 'lf-collapsible-table-hidden'}`}>
                        <tbody>
                          {
                            r?.users?.length === 0 ? <tr>
                              <td className="text-center"> No Data available </td>
                            </tr>
                              :
                              r?.users?.map(u => {
                                return 
                              })
                          }
                        </tbody>
                      </table>
                    </div>
                  })
                } */}
							</div>
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
						{mode === 'invite' ? 'Invite User' : 'Change User Role'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleInviteUser}>
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
									autoComplete="off"
									onChange={(e) => handleChange(e)}
									value={info.role_id}
									required>
									<option value={null}>{select_role?.text}</option>
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
				</Modal.Body>
			</Modal>

			<Modal show={showRole} onHide={handleCloseRole} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{Create_Role_n?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitRole}>
						<div className="row p-3">
							<div className="col-sm-12 mt-2">
								<div className="form-group">
									<Form.Label htmlFor="roletitle">{roleName?.text}</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											placeholder={roleName?.text}
											type="text"
											name="role_name"
											autoComplete="off"
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
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									{create_Role?.text}
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
