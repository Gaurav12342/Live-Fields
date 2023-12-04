import { useState, useEffect } from 'react';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Dropdown,
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
} from 'react-bootstrap';
import {
	archiveUnarchiveProject,
	creatProject,
	deleteProject,
	getAllProjects,
	leaveProject,
	updateProjectSetting,
} from '../../store/actions/projects';
import Layout from '../../components/layout';
import Nodata from '../../components/nodata';
import {
	ARCHIVE_PROJECT,
	CREATE_PROJECT,
	DELETE_PROJECT,
	GET_ALL_PROJECT,
	LEAVE_PROJECT,
} from '../../store/actions/actionType';
// import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';
import { clearTaskListBoradData } from '../../store/actions/Task';
import CustomSearch from '../../components/CustomSearch';
// import ProjectsNodata from '../ProjectsNodata';
const userId = getUserId();
function Projects() {
	const [show, setShow] = useState(false);
	const handleClose = (e) => {
		setShow(false);
		setProject({
			user_id: userId,
			name: '',
			code: '',
		});
	};
	const handleShow = () => setShow(true);
	const [selectedProject, handleSelectedProject] = useState(false);
	const [sortType, handleSortType] = useState('3');
	const [seachText, setSeachText] = useState("");
	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];
	const projectSearchText = (txt) => {
		setSeachText(txt);
	}
	const [showArchived, showArchivedHandler] = useState(false);

	const [project, setProject] = useState({
		user_id: userId,
		name: '',
		code: '',
	});
	const [searchTerm] = useState('');
	const [searchResults] = [];
	// const searchHandler = (searchTerm) => {
	//   setSearchTerm(searchTerm);
	//   if (searchTerm !== "") {
	//     const newSearch = project.filter((pro) => {
	//       return Object.values(pro)
	//         .join(" ")
	//         .toLowerCase()
	//         .includes(searchTerm.toLowerCase());
	//     });
	//     setSearchResults(newSearch);
	//   } else {
	//     setSearchResults(project);
	//   }
	// };
	const getSearchTerm = () => {};
	const inputEl = useRef('');
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setProject({
			...project,
			[name]: value,
		});
	};

	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_PROJECT]?.result;
	});

	const createProjectResult = useSelector((state) => {
		return state?.project?.[CREATE_PROJECT] || {};
	});
	const deleteProjectResult = useSelector((state) => {
		return state?.project?.[DELETE_PROJECT] || {};
	});
	const leaveProjectResult = useSelector((state) => {
		return state?.project?.[LEAVE_PROJECT] || {};
	});
	const archiveProjectResult = useSelector((state) => {
		return state?.project?.[ARCHIVE_PROJECT] || {};
	});
	const dispatch = useDispatch();

	useEffect(() => {
		if (!data || data?.length <= 0) {
			dispatch(getAllProjects(userId));
		}
	}, []);

	useEffect(() => {
		if (createProjectResult?.success === true) {
			handleClose();
			setProject({
				user_id: userId,
				name: '',
				code: '',
			});
			dispatch(getAllProjects(userId));
		}
	}, [createProjectResult?.success, dispatch]);

	useEffect(() => {
		if (deleteProjectResult?.success === true) {
			handleSelectedProject({});
			handleClose();
		}
	}, [deleteProjectResult?.success, dispatch]);

	useEffect(() => {
		if (leaveProjectResult?.success === true) {
			handleSelectedProject({});
			handleClose();
		}
	}, [leaveProjectResult?.success, dispatch]);

	useEffect(
		(r) => {
			// const isConfirmArchive = window.confirm('are you Archive this Project ' + r?.id )
			// if (isConfirmArchive){
			if (archiveProjectResult?.success === true) {
				handleSelectedProject({});
				handleClose();
				// }
			}
		},
		[archiveProjectResult?.success, dispatch],
	);

	const handleArchivedShow = () => {
		showArchivedHandler(!showArchived);
	};

	const submitProject = (e) => {
		e.preventDefault();
		dispatch(creatProject(project));
		handleClose();
	};

	const projectSettingOnBlur = () => {
		const post = {
			user_id: userId,
			project_id: selectedProject?._id,
			name: selectedProject?.name,
			code: selectedProject?.code,
			address: selectedProject?.address,
			timezone: selectedProject?.timezone,
			currency: selectedProject?.currency,
			manpower_unit: selectedProject?.manpower_unit,
			date_formate: selectedProject?.date_formate,
		};
		dispatch(updateProjectSetting(post));
		dispatch(getAllProjects(userId));
	};
	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}
	const {
		btn_creat_archive,
		btn_new_project,
		team,
		role,
		sheet,
		project_name,
		project_code,
		new_project,
		my_projects,
		setting,
		project_setting,
		leave_project,
		delete_project,
		add_new_project,
		create_project,
		archive_project,
		unarchive_project,
		archive,
		project_text,
		leave,
	} = getSiteLanguageData('projects');
	const { sort_by } = getSiteLanguageData('commons');
	return (
		<Layout nosidebar={true}>
			{data?.length === 0 ? (
				<>
					<Nodata type="project">
						<div className="mt-3">
							<span
								style={{ display: 'inline-block' }}
								className="lf-link-cursor lf-main-button"
								onClick={handleShow}>
								{new_project?.text}
							</span>
						</div>
					</Nodata>
				</>
			) : (
				<div id="page-content-wrapper">
					<section className="grey-bg">
						<div className="container-fluid">
							<div
								className="row"
								// style={{ zIndex: '10', background: '#f3f3f8' }}
								>
								<div className="col-sm-12 pt-2">
									<div className="row lf-project-header-mobile align-items-center ">
										<div className="col-sm-5">
											<div className="row align-items-center">
												<div className="col-md-5 col-lg-3 d-none d-md-block">
													<CustomSearch
														seachText={seachText}
														projectSearchText={projectSearchText}
														suggestion={true}
														dataSource={{
															projects: data,
														}}
													/>
												</div>

												<div className="col-4 d-none d-lg-block">
													<Dropdown>
														<span
															tooltip={sort_by.tooltip}
															flow={sort_by.tooltip_flow}>
															<Dropdown.Toggle
																variant="transparent"
																id="dropdown-basic"
																className="lf-link-cursor btn-sort-dd lf-common-btn dropdown-toggle btn btn-transparent">
																<span>
																	{sortingList[parseInt(sortType) - 1]}
																</span>
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
																		onClick={() =>
																			handleSortType((k + 1).toString())
																		}>
																		{st}
																	</Dropdown.Item>
																);
															})}
														</Dropdown.Menu>
													</Dropdown>
												</div>		
											</div>
										</div>
										<div className="col-md-7 text-end">
											<button
												type="button"
												className="p-1 lf-link-cursor lf-main-button"
												tooltip={btn_new_project.tooltip}
												flow={btn_new_project.tooltip_flow}
												onClick={handleShow}>
												<i className="fas fa-plus pe-1"></i>
												{btn_new_project?.text}
											</button>
											<Link
												to={`#`}
												onClick={handleArchivedShow}
												style={{
													color: `${showArchived ? '#f97316' : '#5e6278'}`,
												}}
												className={`
													me-4 lf-link-cursor lf-common-btn xs-d-in-block
												`}>
												<span
													tooltip={btn_creat_archive.tooltip}
													flow={btn_creat_archive.tooltip_flow}>
													<i
														className="fa fa-archive pe-2"
														aria-hidden="true"></i>
													{btn_creat_archive?.text}(
													{data?.filter((p) => p.is_archived === true).length})
												</span>
											</Link>
										</div>
									</div>
								</div>
							</div>
							<div className="container-fluid">
								<div className="row">
									<div className="col-12">
										<div className="row">
											<div className="col-12 mb-3">
												<span className="mb-3">
													<i className="fa-regular fa-folder me-2 my-3"></i>
													<strong>
														{my_projects?.text} ({data?.length}){' '}
													</strong>
												</span>
												<div className="row px-4">
													{data
														?.sort((a, b) => {
															if (sortType === '1') {
																return a?.name.localeCompare(b?.name);
															}
															if (sortType === '2') {
																return b?.name.localeCompare(a?.name);
															}
															if (sortType === '3') {
																return (
																	new Date(b.createdAt) - new Date(a.createdAt)
																);
															}
															if (sortType === '4') {
																return (
																	new Date(a.createdAt) - new Date(b.createdAt)
																);
															}
															return true;
														})
														.map((p) => {
															return (
																<div
																	className={`col-lg-4 col-xl-3 col-md-6 ${
																		p.is_archived
																			? showArchived
																				? ''
																				: 'd-none'
																			: ''
																	} `}
																	key={p._id}>
																	<Link
																		to={`${
																			p.is_archived
																				? '/dashboard/' + p._id
																				: '/dashboard/' + p._id
																		}`}
																		onClick={(e) => {
																			if (p.is_archived) {
																				e.preventDefault();
																			} else {
																				clearTaskListBoradData();
																			}
																		}}>
																		<div
																			className={`project-box ${
																				p.is_archived ? 'archived-project' : ''
																			}`}
																			term={searchTerm}>
																			<div className="row">
																				<div className="col-sm-4">
																					<img
																						alt="livefield"
																						src="/images/projects/no-image.jpg"
																						className="image-full"
																					/>
																				</div>
																				<div className="col-sm-8 col-xs-8 project-box-details">
																					<span className="lf-newprojectnm-res">
																						<h3 className="ms-2 text-nowrap overflow-hidden text-truncate">
																							{p.name}
																						</h3>
																						<h4 className="ms-2">{p.code}</h4>
																					</span>
																					{/* To add login date  */}
																					{/* <h4>
																						<span>
																							<i className="lf-newprojectdate-res ms-2">
																								{new Date(
																									p.createdAt,
																								).toLocaleDateString()}
																							</i>
																						</span>
																					</h4> */}
																					<div className="project-box-footer text-nowrap p-1">
																						<p
																							className="lf-newsetting-res p-1 stared-project-icon  project-box-setting-icon"
																							onClick={(e) => {
																								e.preventDefault();
																								handleSelectedProject(p);
																							}}>
																							<img
																								className="me-1"
																								alt="livefield"
																								src="/images/projects/setting.svg"
																							/>
																							{/* {setting?.text} */}
																						</p>
																						<p
																							className="p-1"
																							tooltip={team.tooltip}
																							flow={team.tooltip_flow}>
																							<img
																								alt="livefield"
																								src="/images/projects/team.svg"
																							/>
																							{p?.users?.length}
																						</p>
																						<p
																							className="mx-1 p-1"
																							tooltip={sheet.tooltip}
																							flow={sheet.tooltip_flow}>
																							<img
																								className="mx-1"
																								alt="livefield"
																								src="/images/projects/sheet.svg"
																							/>
																							{p?.plans?.length}
																						</p>
																						<p
																							className="p-1"
																							tooltip={role.tooltip}>
																							{p?.user_role}
																							<img
																								alt="livefield"
																								src="/images/projects/role.svg"
																							/>
																						</p>
																					</div>
																				</div>
																			</div>
																		</div>
																	</Link>
																</div>
															);
														})}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			)}

			<Modal
				className="lf-modal"
				show={selectedProject?.name !== undefined}
				onHide={() => handleSelectedProject({})}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{project_setting?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-sm-4 text-center position-relative">
							<img
								alt="livefield"
								src="/images/projects/no-image.jpg"
								className="image-full"
							/>
							{/* 							<a
								href="/dashboard"
								className="small-line-btn project-photo-upload-btn p-1">
								<img alt="livefield" src="/images/camera.svg" />
							</a> */}
						</div>
						<div className="col-sm-8">
							<div className="form-group">
								<label htmlFor="projectname">{project_name?.text}</label>
								<input
									type="text"
									className="form-control"
									id="projectname"
									value={selectedProject?.name}
									onChange={(e) => {
										handleSelectedProject({
											...selectedProject,
											name: e.target.value,
										});
									}}
									onBlur={projectSettingOnBlur}
									// readOnly
								/>
							</div>
							<div className="form-group mt-2">
								<label htmlFor="projectcode">{project_code?.text}</label>
								<input
									type="text"
									className="form-control"
									id="projectcode"
									value={selectedProject?.code}
									onChange={(e) => {
										handleSelectedProject({
											...selectedProject,
											code: e.target.value,
										});
									}}
									onBlur={projectSettingOnBlur}
									// readOnly
								/>
							</div>
						</div>
						<div className="col-sm-12 mt-3 text-center">
							
								
								<button
									onClick={() =>
										sweetAlert(
											() =>
												dispatch(
													archiveUnarchiveProject({
														user_id: userId,
														project_id: selectedProject?._id,
														is_archive: !selectedProject?.is_archived,
													}),
												),
											project_text.text,
											!selectedProject?.is_archived
												? archive.text
												: unarchive_project.text,
										)
									}
									className="d-none d-sm-inline-block btn btn-block theme-btn me-2">
									<i className="fa-solid fa fa-archive px-2" />
									{!selectedProject?.is_archived
										? archive_project.text
										: unarchive_project?.text}
								</button>
								
								{
									(typeof selectedProject.is_archived != "undefined" && selectedProject.is_archived == false) && (
										
											<button
												onClick={() =>
													sweetAlert(
														() =>
															dispatch(
																leaveProject({
																	user_id: userId,
																	project_id: selectedProject?._id,
																}),
															),
														project_text.text,
														leave.text,
													)
												}
												className="btn btn-block btn-secondary me-2">
												<i className="fa-solid fa-user-minus px-2" />
												{leave_project?.text}
											</button>
										
									)
								}
								
								
								<button
									onClick={() =>
										sweetAlert(
											() =>
												dispatch(
													deleteProject({
														user_id: userId,
														project_id: selectedProject?._id,
													}),
												),
											project_text.text,
										)
									}
									className="btn btn-block btn-danger">	
									<i className="fas fa-trash-alt px-2" />
									{delete_project?.text}
								</button>
								
							
						</div>
					</div>
				</Modal.Body>
			</Modal>

			{/* add new project */}

			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{add_new_project?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitProject}>
						<div className="row p-3">
							<div className="col-sm-4 text-center position-relative">
								<img
									alt="livefield"
									src="/images/projects/no-image.jpg"
									className="image-full"
								/>
								{/* 								<a
									href="/dashboard"
									className="small-line-btn ms-3 ms-md-0 project-photo-upload-btn p-1">
									<img alt="livefield" src="/images/camera.svg" />
								</a> */}
							</div>
							<div className="col-sm-8">
								<div className="form-group">
									<Form.Label htmlFor="projectname" className="mb-0">
										{project_name?.text}
									</Form.Label>
									<InputGroup className="mb-1">
										<FormControl
											placeholder="Title"
											type="text"
											name="name"
											autoComplete="off"
											onChange={(e) => handleChange(e)}
											value={project.name}
											required
										/>
									</InputGroup>
								</div>
								<div className="form-group mt-1">
									<Form.Label htmlFor="projectcode" className="mb-0">
										{project_code?.text}
									</Form.Label>
									<InputGroup className="mb-1">
										<FormControl
											placeholder="Project Code"
											type="text"
											name="code"
											autoComplete="off"
											onChange={(e) => handleChange(e)}
											value={project.code}
										/>
									</InputGroup>
								</div>
							</div>
							{/* <hr /> */}
							<div className="col-sm-12">
								{/* <div className="form-group"></div>
				{data?.length > 0 ? (
					<>
					<hr />
					<Form.Label className="mb-0">Clone existing project</Form.Label>
					<select className="form-control">
						<option onChange={(e) => handleChange(e)} value={null}>
						Select Project
						</option>
						{data?.map((d) => (
						<option
							key={d?._id}
							onChange={(e) => handleChange(e)}
							value={d?._id}
						>
							{d?.name}
						</option>
						))}
					</select>
					<div className="form-group mt-3">
						<div className="row">
						<div className="col-sm-12">
							<Form.Group className="mb-3">
							<Form.Check
								type="checkbox"
								label="Copy All Categories"
								name="Categories"
								onChange={(e) => handleChange(e)}
								value={project.Categories}
							/>
							</Form.Group>
							<Form.Group
							className="mb-3"
							controlId="formBasicCheckbox"
							>
							<Form.Check
								type="checkbox"
								label="Copy People"
								name="People"
								onChange={(e) => handleChange(e)}
								value={project.People}
							/>
							</Form.Group>
							<Form.Group
							className="mb-3"
							controlId="formBasicCheckbox"
							>
							<Form.Check
								type="checkbox"
								label="Copy Checklists"
								name="Checklists"
								onChange={(e) => handleChange(e)}
								value={project.Checklists}
							/>
							</Form.Group>
							<Form.Group
							className="mb-3"
							controlId="formBasicCheckbox"
							>
							<Form.Check
								type="checkbox"
								label="Copy Reports"
								name="Reports"
								onChange={(e) => handleChange(e)}
								value={project.Reports}
							/>
							</Form.Group>
						</div>
						</div>
					</div>
					</>
				) : (
					""
				)} */}
								<div className="col-12 mt-3">
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block float-end show-verify">
										<i className='fas fa-plus pe-1'></i>
										{create_project?.text}
									</Button>
								</div>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Layout>
	);
}

export default Projects;
