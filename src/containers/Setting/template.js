import { useState, useEffect, useCallback, Fragment } from 'react';
import {
	InputGroup,
	Modal,
	FormControl,
	Form,
	Button,
	Dropdown,
	FormCheck,
	Table,
	OverlayTrigger,
	Popover,
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
	getAdminProjectTemplates,
	importAdminTemplate,
} from '../../store/actions/projects';

import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';
import CustomSearch from '../../components/CustomSearch';
const { manage_template } = getSiteLanguageData('setting');
function Template(props) {
	const userId = getUserId();
	const [show, setShow] = useState(false);
	const { project_id, template_id, template_chekclist_id } = useParams();
	const [showChecklist, setShowChecklist] = useState(false);
	const [showEditTemplate, setshowEditTemplate] = useState(false);
	const [showEditChecklist, setshowEditChecklist] = useState(false);
	const [showListChecklist, setShowListChecklist] = useState(false);
	const [listCheckListData, setListCheckListData] = useState([]);
	const [templateAdd, setTemplateAdd] = useState(false);
	const [searchTemplate, setSearchTemplate] = useState('');
	const [importModel, setImportModel] = useState(false);
	const [adminTemplateList, setAdminTemplateList] = useState([]);
	const [showProjectCheckList, setProjectCheckList] = useState(false);
	const [adminTemplateCheckList, setAdminTemplateCheckList] = useState([]);

	/* Import Things */
	const handleImportModel = () => {
		setImportModel(!importModel);
	};

	const handleProjectCheckListModel = () => {
		setProjectCheckList(!showProjectCheckList);
	};

	const handleAdminTemplateChecklist = (obj) => {
		setAdminTemplateCheckList(obj);
	};

	const importAdminTemplateHandle = (templateData) => {
		let postData = {
			project_id: project_id,
			user_id: userId,
			templateData: templateData,
		};
		dispatch(
			importAdminTemplate(postData, () => {
				setImportModel(!importModel);
			}),
		);
	};
	/* Import Things */

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
	const handleTemplateAdd = () => setTemplateAdd(!templateAdd);
	const handleCloseEditTemplate = () => setshowEditTemplate(false);
	const handleCloseEditChecklist = () => setshowEditChecklist(false);
	const handleListChecklist = () => {
		if (showListChecklist) {
			setListCheckListData([]);
		}
		setShowListChecklist(!showListChecklist);
	};
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
		// setShowChecklist(true);
	};

	const handleShowEditChecklist = (u) => {
		setInfoChecklist({
			...infoChecklist,
			template_chekclist_id: u?.data?._id,
			title: u?.data?.title,
		});
		setshowEditChecklist(true);
	};

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

	const emptyInfoTemplate = () => setInfoTemp({});
	const updateTemplateData = useCallback(
		(e) => {
			handleCloseEditTemplate();
			e.preventDefault();
			const post = {
				name: e.target.value, // infoTemp?.name,
				template_id: infoTemp?.template_id,
				project_id: project_id,
			};
			dispatch(updateProjectTemplate(post, emptyInfoTemplate));
		},
		[infoTemp],
	);

	const handleShowEditTemplate = (u) => {
		setInfoTemp({
			...infoTemp,
			template_id: u?.tempData?._id,
			name: u?.tempData?.name,
			project_id: u?.tempData?.project_id,
		});
		setshowEditTemplate(true);
	};

	const emptyCheckDataList = () => handleShowEditChecklist({});

	const updateChecklistData = useCallback(
		(e) => {
			e.preventDefault();
			const post = {
				title: e.target.value,
				template_chekclist_id: infoChecklist?.template_chekclist_id,
				project_id: project_id,
			};
			dispatch(updateProjectChecklist(post, emptyCheckDataList));
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

		if (data && data.length > 0) {
			let activeTemplate = data.find(
				(d) =>
					d._id == infoCheck.project_templates_id ||
					d._id == infoCheck.templates_id,
			);
			if (activeTemplate && activeTemplate.checklist) {
				setListCheckListData(activeTemplate.checklist);
			}
		}
	}, [data, dispatch]);
	const submitProject = (e) => {
		handleClose();
		e.preventDefault();
		dispatch(
			createTemplate(info, (tData) => {
				setTimeout(() => {
					manageCollapsibleData({
						...collapsibleData,
						[tData._id]: !collapsibleData?.[tData._id],
					});
					handleListChecklist();
					handleShowChecklist({
						project_templates_id: tData._id,
					});
					setListCheckListData([]);
				}, 2000);
			}),
		);
	};
	const submitChecklist = (e) => {
		// e.preventDefault();
		// handleCloseChecklist();
		dispatch(
			createChecklist(infoCheck, () => {
				// setInfoChecklist({})
				setInfoCheck({
					...infoCheck,
					title: '',
				});
			}),
		);
	};
	useEffect(() => {
		// if (!projectTitile?.name) {
		// 	dispatch(getAllTemplateWithFullDetails(project_id));
		// }
		if (['name', 'userId', 'project_id'].every((d) => data[d] === '')) {
			setInfo({
				...info,
				name: projectTitile?.name || '',
				userId: projectTitile?.userId || '',
				project_id: projectTitile?.project_id || '',
			});
		}
	}, [projectTitile, info]);

	useEffect(() => {
		dispatch(
			getAdminProjectTemplates((resData) => {
				setAdminTemplateList(resData?.result);
			}),
		);
	}, []);

	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}
	let searchDataSource = [];
	data?.forEach((slist) => {
		searchDataSource = searchDataSource.concat(slist?.checklist);
	});
	const scrollDownById = (id) => {
		const element = document.getElementById(id);
		setTimeout(() => {
			element.scrollTop = element.scrollHeight + 40;
		}, 1000);
	};

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
		admin_template_checklist,
	} = getSiteLanguageData('project_tamplate');
	const { sort_by, create, icon_delete, import_template,close } =
		getSiteLanguageData('commons');

	const { checklist_items } =
		getSiteLanguageData('reports/components/createsurveyreport');

	return (
		<>
			<Modal.Header className="py-2 bg-light" closeButton>
				<Modal.Title>{manage_template?.text}</Modal.Title>
				<div className="w-100 text-end">
					<Button
						className="lf-link-cursor lf-main-button text-center"
						tooltip={import_template.tooltip}
						flow={import_template.tooltip_flow}
						onClick={handleImportModel}>
						<i className="fas fa-plus px-1"></i>
						{import_template?.text}
					</Button>
				</div>
			</Modal.Header>
			<Modal.Body
				id={`template-model-body`}
				style={{
					maxHeight: '70vh',
					minHeight: '50vh',
					overflow: 'auto',
					padding: 0
				}}>
				{!importModel ? (
					<div className="">
						{data?.length !== 0 && <div className="py-2 px-4">
							<FormControl
								className="me-1 lf-formcontrol-height "
								placeholder="Search template"
								type="text"
								name="name"
								autoComplete="off"
								onChange={(e) => setSearchTemplate(e.target.value)}
								value={searchTemplate}
								// onBlur={() => setCategoryHiden(null)}
							/>
						</div>}
						<div className="">
							{data?.length === 0 ? (
								<Nodata type="template" className="mt-0">
									{/* <span
										className="lf-link-cursor lf-main-button text-center"
										tooltip={new_template.tooltip}
										flow={new_template.tooltip_flow}
										onClick={handleShow}>
										<i className="fas fa-plus px-1 mt-2"></i>
										{new_template?.text}
									</span> */}
								</Nodata>
							) : (
								<div className='py-2 px-4'>
									<Table hover size="sm">
										<thead className={`border-0`}>
											<tr className="border-0">
												<th className={`border-0`}>Name</th>
												<th className={`text-end border-0`}>Action</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{data
												?.filter((v) => {
													if (searchTemplate && searchTemplate.trim()) {
														if (
															v.name
																.toLowerCase()
																.search(searchTemplate.toLowerCase()) > -1
														) {
															return v;
														}
													} else {
														return v;
													}
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
																className={`theme-table-data-row border-0 ${
																	infoTemp && infoTemp.template_id === r._id
																		? 'bg-light'
																		: 'bg-transparent'
																}`}>
																<td className="ps-2 border-0">
																	{infoTemp &&
																	infoTemp.template_id === r._id ? (
																		<FormControl
																			type="text"
																			name="unit"
																			autoComplete="off"
																			onChange={(e) => {
																				const name = e.target.name;
																				const value = e.target.value;

																				setInfoTemp({
																					...infoTemp,
																					[name]: value,
																				});
																			}}
																			onKeyPress={(e) => {
																				if (e.key === 'Enter') {
																					updateTemplateData(e);
																				}
																			}}
																			// value={infoTemp?.name}
																			defaultValue={r?.name}
																		/>
																	) : (
																		<span
																			className="text-dark  lf-link-cursor"
																			variant="transparent"
																			onClick={() => {
																				manageCollapsibleData({
																					...collapsibleData,
																					[r._id]: !collapsibleData?.[r._id],
																				});
																				handleListChecklist();
																				handleShowChecklist({
																					project_templates_id: r._id,
																				});
																				setListCheckListData(r?.checklist);
																			}}>
																			<span className="d-inline-block">
																				{r?.name} ({r?.checklist?.length})
																			</span>
																		</span>
																	)}
																</td>
																<td className="text-end align-middle border-0">
																	{infoTemp &&
																	infoTemp.template_id === r._id ? (
																		<>
																			<div className="d-flex flex-row justify-content-end">
																				<span className={`btn px-0 w-50`}>
																					<i
																						onClick={() => {
																							if (r) {
																								const post = {
																									name: infoTemp?.unit,
																									template_id: r?._id,
																									project_id: r?.project_id,
																								};
																								dispatch(
																									updateProjectTemplate(
																										post,
																										emptyInfoTemplate,
																									),
																								);
																							}

																							handleShowEditTemplate({
																								tempData: {
																									...r,
																									name: infoTemp?.unit,
																								},
																							});
																						}}
																						style={{
																							color: 'blue',
																							fontSize: '15px',
																						}}
																						className="fas fa-check theme-btnbg theme-secondary"></i>
																				</span>
																				{` `}
																				<span className={`btn px-0 w-0`}>
																					<i
																						onClick={() => {
																							setInfoTemp({
																								...infoTemp,
																								template_id: '',
																							});
																							setshowEditTemplate(false);
																						}}
																						style={{
																							color: 'red',
																							fontSize: '15px',
																						}}
																						className="fas fa-times theme-btnbg theme-secondary"></i>
																				</span>
																			</div>
																		</>
																	) : (
																		<>
																			<span
																				className=""
																				tooltip={edit_template.tooltip}
																				flow={edit_template.tooltip_flow}
																				onClick={() =>
																					handleShowEditTemplate({
																						tempData: r,
																					})
																				}>
																				<i className="fas fa-edit theme-btnbg theme-secondary me-2"></i>
																			</span>
																			<span
																				className=""
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
																				<i className="fas fa-trash-alt theme-btnbg theme-secondary"></i>
																			</span>
																		</>
																	)}
																</td>
															</tr>
														</Fragment>
													);
												})}
										</tbody>
									</Table>
								</div>
							)}
						</div>
						
					</div>
				) : (
					<div className="row">
						<Table hover size="sm">
							<thead className={`border-0`}>
								<tr className="border-0">
									<th className={`border-0`}>Name</th>
									<th className={`text-end border-0`}>Action</th>
								</tr>
							</thead>
							<tbody className="border-0">
								{adminTemplateList?.map((r, ind) => {
									return (
										<Fragment key={r._id}>
											<tr
												className={`theme-table-data-row border-0 ${
													ind % 2 == 0 ? 'bg-light' : 'bg-transparent'
												}`}>
												<td className="ps-2 border-0">
													<span
														className="text-dark  lf-link-cursor"
														variant="transparent">
														<span className="d-inline-block">
															{r?.type} ({r?.check_list?.length})
														</span>
													</span>
												</td>
												<td className="text-end align-middle border-0">
													<span
														className=""
														tooltip={edit_template.tooltip}
														flow={edit_template.tooltip_flow}
														onClick={() => importAdminTemplateHandle(r)}>
														<i className="fas fa-download theme-btnbg theme-secondary me-2"></i>
													</span>
													{/* <OverlayTrigger
															container={this}
															trigger="click"
															placement="right"
															
															rootClose
															overlay={
																<Popover id={"popover-positioned-right"+r._id} title="Check list">
																{r.check_list.map((item)=>{
																	return (
																		<div className='px-2 mb-2 border-bottom '>
																			{item.item}
																		</div>
																	)
																})}
																</Popover>
															}
															>
															
														</OverlayTrigger> */}
													<span
														onClick={() => {
															handleProjectCheckListModel();
															handleAdminTemplateChecklist(r);
														}}>
														<i className="fas fa-eye theme-btnbg theme-secondary me-2"></i>
													</span>
												</td>
											</tr>
										</Fragment>
									);
								})}
							</tbody>
						</Table>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer className="justify-content-center py-2">
				<div className='container'>
					<div className='row'>
						{templateAdd && (
								<>
									<div className="col mb-2 pr-0">
										{/* <InputGroup> */}
										<FormControl
											placeholder="Title"
											type="text"
											name="name"
											autoComplete="off"
											onChange={(e) => handleChange(e)}
											value={info.name}
											onKeyPress={(e) => {
												if (e.key === 'Enter') {
													submitProject(e);
												}
											}}
											required
										/>

										{/* </InputGroup> */}
									</div>
									<div className="col-2 mb-2 text-end pr-1">
										<div className="d-flex">
											<span className={`btn px-0 w-50`}>
												<i
													onClick={submitProject}
													style={{ color: 'blue', fontSize: '16px' }}
													className="fas fa-check theme-btnbg theme-secondary"></i>
											</span>
											{` `}
											<span className={`btn px-0 w-50`}>
												<i
													onClick={() => {
														handleTemplateAdd();
														setInfo({
															...info,
															name: '',
														});
													}}
													style={{ color: 'red', fontSize: '16px' }}
													className="fas fa-times theme-btnbg theme-secondary"></i>
											</span>
										</div>

										{` `}
										{/* <Button
													type="button"
													
													className="btn btn-primary theme-btn btn-block show-verify float-end">
													<i className="fa fa-plus pe-1"></i>
													{create?.text}
												</Button> */}
									</div>
								</>
						)}
					</div>
					<div className='row justify-content-center align-items-center'>
						<div className='col-auto'>
							<Button
								variant="light"
								className="light-border btn-block"
								onClick={props.handleTemplateModel}>
								<i className="fa-solid fa-xmark pe-2"></i>
								{close.text}
							</Button>
						</div>
						<div className='col-auto'>
							{!importModel ? (
								<Button
									className="lf-link-cursor lf-main-button text-center"
									tooltip={new_template.tooltip}
									flow={new_template.tooltip_flow}
									onClick={() => {
										handleTemplateAdd();
										scrollDownById('template-model-body');
									}}>
									<i className="fas fa-plus px-1"></i>
									{new_template?.text}
								</Button>
							) : (
								''
							)}
						</div>
					</div>
				</div>
			</Modal.Footer>

			<Modal
				className="lf-modal"
				show={show}
				centered
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
				centered
				onHide={handleCloseChecklist}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{create_checklist?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`category-model-body`}
					style={{
						maxHeight: '70vh',
						minHeight: '70vh',
						overflowY: 'auto',
						maxWidth: '100%',
					}}>
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

			{/* Edit Tempalte Temporary Un useed */}
			<Modal
				className="lf-modal"
				show={false}
				onHide={handleCloseEditTemplate}
				centered
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
				show={false}
				onHide={handleCloseEditChecklist}
				centered
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

			{/* List Checklist */}
			<Modal
				className="lf-modal"
				show={showListChecklist}
				onHide={handleListChecklist}
				centered
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_checklist?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					id={`category-model-body`}
					style={{
						maxHeight: '70vh',
						minHeight: '70vh',
						overflowY: 'auto',
						maxWidth: '100%',
					}}>
					<div className="row p-3">
						<div className="col-sm-12">
							<div className="form-group">
								<InputGroup className="mb-3">
									<FormControl
										placeholder="Title"
										type="text"
										name="title"
										autoComplete="off"
										onChange={(e) => handleChangeChecklist(e)}
										value={infoCheck.title}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												submitChecklist(e);
											}
										}}	
										required
									/>
									<Button
										type="button"
										onClick={submitChecklist}
										className="btn btn-primary theme-btn btn-block show-verify float-end">
										{create_checklist_btn?.text}
									</Button>
								</InputGroup>
							</div>
						</div>
						<div className="col-sm-12 mt-1">
							{listCheckListData.length === 0 ? (
								<>{no_checklist_available?.text}</>
							) : (
								<Table striped hover size="sm">
									<thead>
										<tr>
											<th>Name</th>
											<th className={`text-end`}>Action</th>
										</tr>
									</thead>
									<tbody className="border-0">
										{listCheckListData?.map((u) => {
											return (
												<tr
													className={`theme-table-data-row bg-white border-0`}
													key={u._id}>
													<td className="border-0">
														{infoChecklist &&
														infoChecklist.template_chekclist_id == u._id ? (
															<>
																<FormControl
																	type="text"
																	name="unit"
																	autoComplete="off"
																	onChange={(e) => {
																		handleChangeEditChecklist(e);
																	}}
																	onKeyPress={(e) => {
																		if (e.key === 'Enter') {
																			updateChecklistData(e);
																		}
																	}}
																	// value={infoTemp?.name}
																	defaultValue={u.title}
																/>
															</>
														) : (
															u.title
														)}
													</td>
													{infoChecklist &&
													infoChecklist.template_chekclist_id == u._id ? (
														<div className="d-flex flex-row justify-content-end">
															<span className={`btn px-0 w-50`}>
																<i
																	onClick={(e) => {
																		const post = {
																			title: infoChecklist?.unit,
																			template_chekclist_id: infoChecklist?.template_chekclist_id,
																			project_id: project_id,
																		};
																		dispatch(updateProjectChecklist(post, emptyCheckDataList));
																	}}
																	style={{ color: 'blue', fontSize: '15px' }}
																	className="fas fa-check theme-btnbg theme-secondary"></i>
															</span>
															{` `}
															<span className={`btn px-0 w-25`}>
																<i
																	onClick={() => {
																		setInfoChecklist({
																			...infoChecklist,
																			template_chekclist_id: '',
																		});
																		setshowEditChecklist(false);
																	}}
																	style={{ color: 'red', fontSize: '15px' }}
																	className="fas fa-times theme-btnbg theme-secondary"></i>
															</span>
														</div>
													) : (
														<td className="text-end align-middle border-0">
															<span
																className="p-2 lf-common-btn theme-secondary"
																tooltip={edit_chacklist.tooltip}
																flow={edit_chacklist.tooltip_flow}
																onClick={() =>
																	handleShowEditChecklist({ data: u })
																}>
																<i className="fas fa-edit theme-btnbg theme-secondary"></i>
															</span>
															<span
																className="p-2 lf-common-btn theme-secondary "
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
																<i className="fas fa-trash-alt theme-btnbg theme-secondary"></i>
															</span>
															&nbsp;
														</td>
													)}
												</tr>
											);
										})}
									</tbody>
								</Table>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button
						variant="light"
						className="light-border btn-block"
						onClick={handleListChecklist}>
						<i class="fa-solid fa-xmark pe-2"></i>
						{close.text}
					</Button>
					{/* <Button
						// href="/dashboard"
						type='button'
						className="btn btn-block theme-btn"
						tooltip={btn_Checklist.tooltip}
						flow={btn_Checklist.tooltip_flow}
						onClick={() =>
							setShowChecklist(true)
						}>
						<i className="fas fa-plus"></i>{' '}
						{btn_Checklist?.text}
					</Button> */}
				</Modal.Footer>
			</Modal>

			{/* Project Template checklist */}
			<Modal
				className="lf-modal"
				show={showProjectCheckList}
				onHide={handleProjectCheckListModel}
				centered
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{adminTemplateCheckList?.type}</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={{ minHeight: '520px', maxHeight: '520px', overflowY: 'auto' }}>
					<Form onSubmit={updateTemplateData}>
						<div className="row px-3">
							<Table hover size="sm">
								<thead className={`border-0`}>
									<tr className="border-0">
										<th className={`border-0`}>{checklist_items?.text}</th>
									</tr>
								</thead>
								<tbody className="border-0">
									{adminTemplateCheckList?.check_list?.map((it, i) => {
										return (
											<tr
												className={`theme-table-data-row border-0 ${
													i % 2 == 0 ? 'bg-light' : 'bg-transparent'
												}`}>
												<td className="border-0">{it.item}</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default Template;
