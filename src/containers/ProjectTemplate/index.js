import { useState, useEffect, useCallback, Fragment } from 'react';
import {
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
	Dropdown,
	FormCheck,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import {
	CREATE_TEMPLATE,
	CREATE_CHECKLIST,
	GET_ALL_TEMPLATE,
	DELETE_TEMPLATE,
	DELETE_CHECKLIST,
	UPDATE_PROJECT_TEMPLATE,
	UPDATE_PROJECT_TEMPLATE_CHECKLIST,
} from '../../store/actions/actionType';
import {
	createTemplate,
	createChecklist,
	getAllTemplateWithFullDetails,
	deleteTemplate,
	deleteChecklist,
	updateProjectTemplate,
	updateProjectChecklist,
} from '../../store/actions/projects';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';
import CustomSearch from '../../components/CustomSearch';

function Template() {
	const userId = getUserId();
	const [show, setShow] = useState(false);
	const [showChecklist, setShowChecklist] = useState(false);
	const [showEditTemplate, setshowEditTemplate] = useState(false);
	const [showEditChecklist, setshowEditChecklist] = useState(false);
	const handleClose = (e) => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			template_id: template_id,
			name: '',
		});
	};
	const handleShow = () => setShow(true);
	const handleCloseEditTemplate = () => setshowEditTemplate(false);
	const handleCloseEditChecklist = () => setshowEditChecklist(false);
	const [collapsibleData, manageCollapsibleData] = useState({});
	const handleCloseChecklist = () => {
		setShowChecklist(false);
		setInfoCheck({
			templates_id: '',
			project_id: project_id,
			title: '',
		});
	};
	const [sortType, handleSortType] = useState('3');
	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];
	const handleShowChecklist = (u) => {
		setInfoCheck({
			...infoCheck,
			project_templates_id: u?.project_templates_id,
		});
		setShowChecklist(true);
	};
	const handleShowEditTemplate = (u) => {
		setInfoTemp({
			...infoTemp,
			template_id: u?.tempData?._id,
			name: u?.tempData?.name,
		});
		setshowEditTemplate(true);
	};
	const handleShowEditChecklist = (u) => {
		setInfoChecklist({
			...infoChecklist,
			template_chekclist_id: u?.data?._id,
			title: u?.data?.title,
		});
		setshowEditChecklist(true);
	};

	const { project_id, template_id, template_chekclist_id } = useParams();
	const [multiSelect, handleMultiSelect] = useState([]);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		template_id: template_id,
		name: '',
	});
	const [infoCheck, setInfoCheck] = useState({
		templates_id: '',
		project_id: project_id,
		title: '',
	});
	const [infoTemp, setInfoTemp] = useState({
		template_id: template_id,
		name: '',
	});
	const [infoChecklist, setInfoChecklist] = useState({
		template_chekclist_id: template_chekclist_id,
		title: '',
	});

	const updateTemplateData = useCallback(
		(e) => {
			handleCloseEditTemplate();
			e.preventDefault();
			const post = {
				name: infoTemp?.name,
				template_id: infoTemp?.template_id,
				project_id: project_id,
			};
			dispatch(updateProjectTemplate(post));
		},
		[infoTemp],
	);

	const updateChecklistData = useCallback(
		(e) => {
			e.preventDefault();
			const post = {
				title: infoChecklist?.title,
				template_chekclist_id: infoChecklist?.template_chekclist_id,
				project_id: project_id,
			};
			dispatch(updateProjectChecklist(post));
		},
		[infoChecklist],
	);
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};

	const handleChangeChecklist = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfoCheck({
			...infoCheck,
			[name]: value,
		});
	};

	const handleChangeEditTemplate = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfoTemp({
			...infoTemp,
			[name]: value,
		});
	};

	const handleChangeEditChecklist = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfoChecklist({
			...infoChecklist,
			[name]: value,
		});
	};
	const editTemplateResult = useSelector((state) => {
		return state?.project?.[UPDATE_PROJECT_TEMPLATE] || {};
	});
	const createTemplateResult = useSelector((state) => {
		return state?.project?.[CREATE_TEMPLATE] || {};
	});
	const editChecklistResult = useSelector((state) => {
		return state?.project?.[UPDATE_PROJECT_TEMPLATE_CHECKLIST] || {};
	});
	const createChecklistResult = useSelector((state) => {
		return state?.project?.[CREATE_CHECKLIST] || {};
	});
	const dispatch = useDispatch();
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_TEMPLATE]?.result || [];
	});
	const projectTitile = useSelector((state) => {
		return state?.project?.[UPDATE_PROJECT_TEMPLATE] || {};
	});

	const deleteChecklistResult = useSelector((state) => {
		return state?.project?.[DELETE_CHECKLIST] || {};
	});

	const deleteTemplateResult = useSelector((state) => {
		return state?.project?.[DELETE_TEMPLATE] || {};
	});

	useEffect(() => {
		if (deleteTemplateResult?.success === true) {
			handleClose();
		}
	}, [deleteTemplateResult?.success, dispatch]);

	useEffect(() => {
		if (deleteChecklistResult?.success === true) {
			handleCloseChecklist();
		}
	}, [deleteChecklistResult?.success, dispatch]);

	useEffect(() => {
		if (createTemplateResult?.success === true) {
			handleCloseChecklist();
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				name: '',
			});
		}
	}, [createTemplateResult?.success, dispatch]);

	useEffect(() => {
		if (editTemplateResult?.success === true) {
			handleCloseEditTemplate();
			setInfoTemp({
				...infoTemp,
				name: '',
			});
		}
	}, [editTemplateResult?.success, dispatch]);

	useEffect(() => {
		if (editChecklistResult?.success === true) {
			handleCloseEditChecklist();
			setInfoChecklist({
				...infoChecklist,
				title: '',
			});
		}
	}, [editChecklistResult?.success, dispatch]);

	useEffect(() => {
		if (createChecklistResult?.success === true) {
			handleCloseChecklist();
			setInfoCheck({
				...infoCheck,
				title: '',
			});
		}
	}, [createChecklistResult?.success, dispatch]);

	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllTemplateWithFullDetails(project_id));
		}
	}, [data?.length, dispatch]);
	const submitProject = (e) => {
		handleClose();
		e.preventDefault();
		dispatch(createTemplate(info));
	};
	const submitChecklist = (e) => {
		e.preventDefault();
		handleCloseChecklist();
		dispatch(createChecklist(infoCheck));
	};
	useEffect(() => {
		if (!projectTitile?.name) {
			dispatch(getAllTemplateWithFullDetails(project_id));
		}
		if (['name', 'userId', 'project_id'].every((d) => data[d] === '')) {
			setInfo({
				...info,
				name: projectTitile?.name || '',
				userId: projectTitile?.userId || '',
				project_id: projectTitile?.project_id || '',
			});
		}
	}, [projectTitile, info]);
	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}
	let searchDataSource = [];
	data?.forEach((slist) => {
		searchDataSource = searchDataSource.concat(slist?.checklist);
	});
	const {
		btn_template,
		btn_Checklist,
		edit_template,
		delete_tamplate,
		delete_chacklist,
		edit_chacklist,
		no_checklist_available,
		new_template,
		template_name,
		checklist_title,
		create_template,
		create_checklist,
		create_checklist_btn,
		update_template,
		update_template_btn,
		update_checklist,
	} = getSiteLanguageData('project_tamplate');
	const { sort_by, create, icon_delete } = getSiteLanguageData('commons');
	const {action  } = getSiteLanguageData('material/index');

	return (
		<Layout>
			{data?.length === 0 ? (
				<Nodata type="template" className="mt-3">
					<span
						className="lf-link-cursor lf-main-button text-center"
						tooltip={new_template.tooltip}
						flow={new_template.tooltip_flow}
						onClick={handleShow}>
						<i className="fas fa-plus px-1 mt-2"></i>
						{new_template?.text}
					</span>
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="row">
							<div className="col-lg-2 col col-md-3">
								<CustomSearch
									suggestion={true}
									dataSource={{
										template: searchDataSource,
									}}
								/>
							</div>
							<div className="col-4">
								<Dropdown className="mt-1 lf-responsive-common">
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
													className="lf-layout-profile-menu "
													onClick={() => handleSortType((k + 1).toString())}>
													{st}
												</Dropdown.Item>
											);
										})}
									</Dropdown.Menu>
								</Dropdown>
							</div>

							<div className="col-md-5 col-lg-6">
								<Dropdown className="mt-1 d-inline-block  float-end">
									<Dropdown.Toggle
										disabled={multiSelect.length === 0}
										variant="transparent"
										className="lf-common-btn">
										{action.text}
									</Dropdown.Toggle>
									<Dropdown.Menu className="shadow p-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
										{/* <Dropdown.Item className='lf-layout-profile-menu '>Edit</Dropdown.Item> */}
										<Dropdown.Item
											className="lf-layout-profile-menu "
											onClick={() =>
												sweetAlert(
													() =>
														dispatch(
															deleteChecklist({
																project_id: project_id,
																template_chekclist_id: multiSelect,
															}),
														),
													"Template Checklist's",
													handleMultiSelect([]),
												)
											}>
											<i className="fas fa-trash-alt px-2"></i>
											{icon_delete?.text}
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
								<span
									tooltip={btn_template.tooltip}
									flow={btn_template.tooltip_flow}
									className="pb-2 lf-link-cursor lf-main-button float-end"
									onClick={handleShow}>
									<i className="fas fa-plus pe-1"></i> {btn_template?.text}
								</span>
							</div>
						</div>
					</section>

					<div className="container-fluid mt-3">
						<div className="theme-table-wrapper no-bg ">
							<table className="table table-hover theme-table">
								<tbody>
									{data
										?.sort((a, b) => {
											if (sortType === '1') {
												return a?.name.localeCompare(b?.name);
											}
											if (sortType === '2') {
												return b?.name.localeCompare(a?.name);
											}
											if (sortType === '3') {
												return new Date(b.createdAt) - new Date(a.createdAt);
											}
											if (sortType === '4') {
												return new Date(a.createdAt) - new Date(b.createdAt);
											}
											return true;
										})
										?.map((r) => {
											r = {
												...r,
												checklist: r?.checklist?.filter(
													(c) => c.is_deleted === false,
												),
											};
											return (
												<Fragment key={r._id}>
													<tr
														className={`theme-table-data-row ${
															!collapsibleData?.[r._id] === true
																? 'bg-light'
																: 'bg-transparent'
														}`}>
														<td className="text-center lf-text-vertical-align lf-w-40">
															<FormCheck
																type="checkbox"
																name="file"
																className={
																	r?.checklist?.length === 0
																		? 'invisible'
																		: 'visible'
																}
																onChange={({ target: { checked } }) => {
																	let newArr = [...multiSelect];
																	r?.checklist?.forEach((p) => {
																		if (checked === true) {
																			newArr.push(p._id);
																		} else {
																			newArr = newArr.filter(
																				(d) => d !== p._id,
																			);
																		}
																	});
																	handleMultiSelect(newArr);
																}}
																checked={r?.checklist?.every((d) =>
																	multiSelect.includes(d._id),
																)}
															/>
														</td>
														<td colSpan={2} className="ps-2">
															<span
																className="text-dark  lf-link-cursor"
																variant="transparent"
																onClick={() =>
																	manageCollapsibleData({
																		...collapsibleData,
																		[r._id]: !collapsibleData?.[r._id],
																	})
																}>
																<h6 className="d-inline-block mt-2">
																	<i className="fa-regular fa-folder me-2"></i>
																	<strong className="align-middle">
																		{r?.name} ({r?.checklist?.length})
																	</strong>
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
														<td colSpan={2} className="text-end align-middle">
															<span
																href="/dashboard"
																className="ms-2 lf-common-btn theme-secondary"
																tooltip={btn_Checklist.tooltip}
																flow={btn_Checklist.tooltip_flow}
																onClick={() =>
																	handleShowChecklist({
																		project_templates_id: r._id,
																	})
																}>
																<i className="fas fa-plus"></i>{' '}
																{btn_Checklist?.text}
															</span>
															<span
																className=" lf-common-btn theme-secondary me-1"
																tooltip={edit_template.tooltip}
																flow={edit_template.tooltip_flow}
																onClick={() =>
																	handleShowEditTemplate({ tempData: r })
																}>
																<i className="fas fa-edit"></i>
															</span>
															<span
																className=" me-1 lf-common-btn theme-secondary me-2"
																tooltip={delete_tamplate.tooltip}
																flow={delete_tamplate.tooltip_flow}
																onClick={() =>
																	sweetAlert(
																		() =>
																			dispatch(
																				deleteTemplate({
																					template_id: [r?._id],
																					project_id: project_id,
																				}),
																			),
																		'Project Template',
																	)
																}>
																<i className="fas fa-trash-alt"></i>
															</span>
														</td>
													</tr>
													{r?.checklist.length === 0 ? (
														<tr
															className={`theme-table-data-row bg-white text-center lf-text-vertical-align ${
																!collapsibleData?.[r._id] === true
																	? ''
																	: 'd-none'
															}`}>
															<td colSpan={4}>
																{no_checklist_available?.text}{' '}
															</td>
														</tr>
													) : (
														r?.checklist?.map((u) => {
															return (
																<tr
																	className={`theme-table-data-row bg-white ${
																		!collapsibleData?.[r._id] === true
																			? ''
																			: 'd-none'
																	}`}
																	key={u._id}>
																	<td className="text-center lf-text-vertical-align">
																		<FormCheck
																			type="checkbox"
																			name="plan_id"
																			className={`${
																				multiSelect.length > 0 ? 'visible' : ''
																			}`}
																			onChange={({ target: { checked } }) => {
																				let newArr = [...multiSelect];
																				if (checked === true) {
																					newArr.push(u._id);
																				} else {
																					newArr = newArr.filter(
																						(d) => d !== u._id,
																					);
																				}
																				handleMultiSelect(newArr);
																			}}
																			checked={multiSelect.includes(u._id)}
																			value={u._id}
																		/>
																	</td>
																	<td className="lf-text-vertical-align">
																		{' '}
																		<span className="lf-text-overflow-500 mt-1 lf-text-vertical-align">
																			{u.title}
																		</span>{' '}
																	</td>
																	<td></td>
																	<td className=" align-middle">
																		<span
																			className="float-end p-2 me-2 lf-common-btn theme-secondary "
																			tooltip={delete_chacklist.tooltip}
																			flow={delete_chacklist.tooltip_flow}
																			onClick={() =>
																				sweetAlert(
																					() =>
																						dispatch(
																							deleteChecklist({
																								project_id: project_id,
																								template_chekclist_id: [u?._id],
																							}),
																						),
																					'Template Checklist',
																					handleMultiSelect([]),
																				)
																			}>
																			<i className="fas fa-trash-alt"></i>
																		</span>
																		<span
																			className="float-end p-2 ms-2 lf-common-btn theme-secondary"
																			tooltip={edit_chacklist.tooltip}
																			flow={edit_chacklist.tooltip_flow}
																			onClick={() =>
																				handleShowEditChecklist({ data: u })
																			}>
																			<i className="fas fa-edit"></i>
																		</span>
																		&nbsp;
																	</td>
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
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{create_template?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitProject}>
						<div className="row p-3">
							<div className="col-sm-12">
								<div className="form-group">
									<Form.Label htmlFor="templatename" className="mb-0">
										{template_name?.text}
									</Form.Label>
									<InputGroup>
										<FormControl
											placeholder="Title"
											type="text"
											name="name"
											autoComplete="off"
											onChange={(e) => handleChange(e)}
											value={info.name}
											required
										/>
									</InputGroup>
								</div>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block mt-3 show-verify float-end">
									<i className="fa fa-plus pe-1"></i>
									{create?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
			{/* create checklist */}
			<Modal
				className="lf-modal"
				show={showChecklist}
				onHide={handleCloseChecklist}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{create_checklist?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitChecklist}>
						<div className="row p-3">
							<div className="col-sm-12">
								<div className="form-group">
									<Form.Label htmlFor="templatetitle" className="mb-0">
										{checklist_title?.text}
									</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											placeholder="Title"
											type="text"
											name="title"
											autoComplete="off"
											onChange={(e) => handleChangeChecklist(e)}
											value={infoCheck.title}
											required
										/>
									</InputGroup>
								</div>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block show-verify float-end">
									{create_checklist_btn?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
			{/* Edit Tempalte */}
			<Modal
				className="lf-modal"
				show={showEditTemplate}
				onHide={handleCloseEditTemplate}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_template?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={updateTemplateData}>
						<div className="row p-3">
							<div className="col-sm-12">
								<div className="form-group">
									<Form.Label htmlFor="templatename" className="mb-0">
										{template_name?.text}
									</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											placeholder="name"
											type="text"
											name="name"
											autoComplete="off"
											onChange={(e) => handleChangeEditTemplate(e)}
											defaultValue={infoTemp.name}
											required
										/>
									</InputGroup>
								</div>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
									{update_template_btn?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>

			{/* Edit Checklist */}
			<Modal
				className="lf-modal"
				show={showEditChecklist}
				onHide={handleCloseEditChecklist}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_checklist?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={updateChecklistData}>
						<div className="row p-3">
							<div className="col-sm-12 mt-1">
								<div className="form-group">
									<Form.Label className="mb-0" htmlFor="templatename">
										{checklist_title?.text}
									</Form.Label>
									<InputGroup className="mb-3">
										<FormControl
											placeholder="title"
											type="text"
											name="title"
											autoComplete="off"
											onChange={(e) => handleChangeEditChecklist(e)}
											value={infoChecklist.title}
											required
										/>
									</InputGroup>
								</div>
								<Button
									type="submit"
									className="float-end btn btn-primary theme-btn btn-block my-1 show-verify">
									{update_checklist?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</Layout>
	);
}
export default Template;
