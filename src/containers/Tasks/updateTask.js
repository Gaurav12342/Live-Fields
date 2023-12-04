import React, { Component, useState, useEffect } from 'react';
import {
	Modal,
	InputGroup,
	FormControl,
	Card,
	Tabs,
	Tab,
	FormCheck,
	Form,
	Button,
} from 'react-bootstrap';
import {
	getSingleTask,
	getBoardList,
	GetCategoryList,
	getLocationList,
	updateTask,
	createTaskChecklist,
	getTaskChecklist,
	deleteTaskChecklist,
	updateTaskChecklist,
	addRelatedTask,
	createlocation,
	getAllTaskByProjectId,
	useTemplate,
	CreateTaskCategory,
	manageTemplate,
} from '../../store/actions/Task';
import { connect } from 'react-redux';
import getUserId, {
	getSiteLanguageData,
	sweetAlert,
	variableValidator,
	wallUnit,
} from '../../commons';
import {
	createTag,
	getAllRoleWisePeople,
	getAllSheets,
	getAllTags,
	getAllTemplateWithFullDetails,
} from '../../store/actions/projects';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_SHEETS,
	GET_ALL_TAGS,
	GET_ALL_TASK_BOARD_LIST,
	GET_ALL_TEMPLATE,
	GET_CATEGORY_LIST,
	GET_LOCATION_LIST,
	GET_SINGLE_TASK,
	GET_TASK_CHECKLIST,
	GET_TASK_LIST_BY_PROJRCT_ID,
} from '../../store/actions/actionType';
import moment from 'moment';
import AddRelatedTask from './addRelatedtask';
import CustomSelect from '../../components/SelectBox';
import Chat from '../Chat';
import DatePicker from 'react-datepicker';
import withRouter from '../../components/withrouter';
import WorkWall from './workWall';
import {
	Handler,
	createIssue,
	issueForTask,
	issueLinkWithTask,
	removeRelatedIssue,
} from '../../store/actions/Issues';
import { Link } from 'react-router-dom';


const CustomLabelForAssignee = ({ user }) => {
	return (
		<div className="d-flex align-items-center">
			{user.profile ? (
				<img
					src={user.thumbnail || user.profile}
					alt={user.first_name}
					className="me-1 priority-1 border"
				/>
			) : (
				<span
					className="task-info-category text-uppercase me-2 w-25"
					style={{ background: '#FFF', color: '#FFFFFF' }}>
					{user.first_name?.charAt(0)}
					{user.last_name?.charAt(0)}
				</span>
			)}
			<div className="lf-react-select-item w-75">
				{`${user.first_name} ${user.last_name}`}
			</div>
		</div>
	);
}

const CustomLabelForWatcher = ({ user,moduleType }) => {
	return (
		<div className="d-flex align-items-center">
			<div className="m-1">
				{user.profile ? (
					<img
						src={user.thumbnail || user.profile}
						alt={user.first_name}
						className="me-1 priority-1 border"
					/>
				) : (
					<span
						className="task-info-category text-uppercase me-2 w-25"
						style={{ background: '#FFF', color: '#FFFFFF' }}>
						{user.first_name?.charAt(0)}
						{user.last_name?.charAt(0)}
					</span>
				)}
			</div>
		</div>
	);
}


const UpdateTask = (props) => {
		const userId = getUserId();
	const task_id = props?.data?._id;
	const siteData = getSiteLanguageData('task/update');
	const start_date = props?.data?.start_date
		? moment(props?.data?.start_date).format('YYYY-MM-DD')
		: null;
	const end_date = props?.data?.end_date
		? moment(props?.data?.end_date).format('YYYY-MM-DD')
		: null;
	const project_id = props.router?.params.project_id;
	const plan_id = props.router?.params.plan_id;

	const [relatedTask, setRelatedTask] = useState({});
	const [checklistHiden, setChecklistHiden] = useState(false);
	const [useTemp, setUseTemp] = useState(false);
	const [relatedT, setRelatedT] = useState(false);
	const [relateIssue, setRelateIssue] = useState();
	const [unBindedIssues, setUnBindedIssues] = useState([]);
	const [bindedIssues, setBindedIssues] = useState([]);
	const [chatHeight, setChatHeight] = useState('');
	const [issueName, setIssueName] = useState('');
	const [info, setInfo] = useState({});
		const [infoChecklist, setInfoChecklist] = useState({});
	const [show, setShow] = useState(false);
	const [infoComment, setInfoComment] = useState({});
	const [editCheck, setEditCheck] = useState(null);
	const [editActive, setEditActive] = useState('');
	const [fieldsToBeUpdate, setFieldsToBeUpdate] = useState([]);
	const [relatedIssues, setRelatedIssue] = useState([]);

	useEffect(() => {
		setBindedIssues(props?.task?.related_tasks_issue || []);
		setChatHeight('auto');
		setShow(props?.hideBtn || false);

		setInfo({
			user_id: userId,
			project_id: project_id,
			task_id: task_id,
			title: props?.data?.title,
			location_id: props?.data?.location_id || '',
			plan_id: props?.data?.plan_id,
			board_id: props?.data?.board_id,
			type: props?.data?.type,
			category_id: props?.data?.category_id || props?.task?.category_id,
			assigee_id: props?.data?.assigee_id,
			members_id: props?.data?.members_id,
			watchers: props?.data?.watchers,
			tags: props?.data?.tags,
			cost: props?.data?.cost,
			start_date: start_date,
			end_date: end_date,
			manpower: props?.data?.manpower || props?.task?.manpower,
			is_published: props?.data?.is_published,
			related_task: props?.task?.related_task,
		});

		setInfoChecklist({
			task_id: task_id,
			title: '',
			state: 'unchecked',
		});

		setInfoComment({
			user_id: userId,
			task_id: task_id,
			comment: '',
			file_link: [],
		});

		setRelatedTask({
			user_id: userId,
			task_id: task_id,
			related_task: props?.task?.related_task ? props?.task?.related_task : [],
		});
	}, []);

	useEffect(() => {
		const { dispatch } = props;
		dispatch(getSingleTask(task_id));
		dispatch(getAllTags(project_id));
		dispatch(getBoardList(project_id, userId));
		dispatch(getAllRoleWisePeople(project_id));
		dispatch(GetCategoryList(project_id, userId));
		dispatch(getLocationList(project_id, userId));
		dispatch(getAllSheets(project_id));
		// dispatch(getAllTags(this.project_id));
		dispatch(getTaskChecklist(task_id));
		dispatch(getAllTaskByProjectId(project_id));
		dispatch(getAllTemplateWithFullDetails(project_id));
		getUnBindedIssues();
		onBlurSubmit();
	}, []);

	useEffect(() => {
		const { task, data } = props;
		if (!!task?._id) {
			setChatHeight(
				document?.getElementsByClassName('task-info-form')[0]?.clientHeight -
					110 +
					'px',
			);
			setRelatedTask({
				user_id: userId,
				task_id: task_id,
				related_task:
					task.related_tasks_list &&
					task.related_tasks_list.map((tv) => {
						return {
							value: tv._id,
							label: tv.title,
						};
					}),
			});
			setBindedIssues(task?.related_tasks_issue || []);
			setInfo({
				user_id: userId,
				project_id: project_id,
				task_id: task_id,
				title: task?.title,
				location_id: task?.location[0]?._id || task?.location_id,
				plan_id: task?.plan_id,
				board_id: task?.board_id,
				type: task?.type,
				category_id: task?.category_id,
				assigee_id: task?.assigee_id,
				members_id: task?.members_id,
				watchers: task?.watchers,
				tags: task?.tags,
				cost: task?.cost,
				start_date: task?.start_date,
				end_date: task?.end_date,
				manpower: task?.manpower,
				is_published: task?.is_published,
				total_work: task.total_work || "0",
				wall_work_type: task.wall_work_type,
			});
		}
	}, [props]);

	const taskChatHeight = () => {
		let chatHeight =
			document?.getElementsByClassName('task-info-form')[0]?.clientHeight -
			110 +
			'px';
		setChatHeight(chatHeight);
	};

	const getUnBindedIssues = () => {
		const { dispatch } = props;
		dispatch(
			issueForTask(
				{
					project_id: project_id,
					user_id: userId,
				},
				(resData) => {
					if (resData.result && Array.isArray(resData.result)) {
						resData.result.map((vl) => {
							return setUnBindedIssues({
								label: vl.title,
								value: vl._id,
							});
						});
					}
				},
			),
		);
	};

	const submitChecklistData = (checkInfo) => {
		const post = {
			task_id: task_id,
			checklist_id: checkInfo?._id,
			title: checkInfo?.name,
			state: checkInfo?.state,
		};
		props.dispatch(updateTaskChecklist(post));
	};

	const handleUnlink = (link) => {
		const { task } = props;
		const rt = task.relatedtask?.map((rt) => rt);
		const relatedTask = rt?.[0]?.related_task_data?.map((rt) => rt);
		const newArr = relatedTask?.filter((item) => {
			return item._id !== link._id;
		});
		const relatedId = newArr?.map((x) => x._id);
		props.dispatch(
			addRelatedTask({
				task_id: task_id,
				user_id: userId,
				related_task: relatedId,
			}),
		);
	};

	const handleUnlinkIssue = (link) => {
		const { task } = props;

		props.dispatch(
			removeRelatedIssue(
				{
					project_id: project_id,
					user_id: userId,
					issue_id: link._id,
				},
				(resData) => {
					getUnBindedIssues();
					props.dispatch(getSingleTask(task_id));
				},
			),
		);
	};

	const handleChangeChecklist = (name, value) => {
		setInfoChecklist({
			...infoChecklist,
			[name]: value,
		});
	};

	const submitTaskChecklist = (e) => {
		setInfoChecklist({
			task_id: task_id,
			title: '',
			state: 'unchecked',
		});
		props.dispatch(createTaskChecklist(infoChecklist));
	};

	const submitTask = (e) => {
		e.preventDefault();
		handleClose();
		props.dispatch(
			updateTask(
				info,
				plan_id ? true : false,
				props.task_view_type,
				props?.filterData,
			),
		);
	};

	const handleChangeRelated = (name, value) => {
		setRelatedTask({
			...relatedTask,
			[name]: value,
		});
	};

	const submitRelatedTask = (e) => {
		// e.preventDefault();
		// handleClose();
		props.dispatch(
			addRelatedTask({
				...relatedTask,
				related_task: (relatedTask?.related_task).map((t) => {
					return t.value;
				}),
			}),
		);
		setRelatedT(false);
	};

	const submitIssueTask = (e) => {
		if (relatedIssues && relatedIssues.length > 0) {
			props.dispatch(
				issueLinkWithTask(
					{
						task_id: task_id,
						project_id: project_id,
						related_issue: relatedIssues?.map((t) => {
							return t.value;
						}),
					},
					(resData) => {
						props.dispatch(getSingleTask(this.task_id));
						getUnBindedIssues();
						setRelatedIssue([]);
					},
				),
			);
		}
	};

	const createIssueHandler = () => {
		let postIssue = {
			user_id: userId,
			project_id: project_id,
			title: issueName,
			status_id: 'Open',
			assigee_id: userId,
			watchers: [],
			tags: [],
			task_id: task_id,
			end_date: '',
		};
		props.dispatch(
			createIssue(postIssue, (resData) => {
				setIssueName('');
				setRelateIssue(false);
				props.dispatch(getSingleTask(task_id));
				getUnBindedIssues();
				setRelatedIssue([]);
			}),
		);
	};

	const handleShow = () => {
		setShow(true);
	};

	const handleClose = () => {
		setShow(false);
		if (props.handleClose) {
			props.handleClose();
		}
	};

	

	const handleDatesChange = (start_date, end_date) => {
		const fieldsToBeUpdate = [...fieldsToBeUpdate];
		fieldsToBeUpdate.push('start_date');
		fieldsToBeUpdate.push('end_date');
		setInfo({
			...info,
			start_date: start_date,
			end_date: end_date,
		});

		setFieldsToBeUpdate(fieldsToBeUpdate);
	};

	const handleEditElement = (type, closeType = '') => {
		setEditActive(type);

		if (closeType) {
			handleChange(closeType, props?.task?.[closeType]);
		}
	};

	const onBlurSubmit = (fieldsToBeUpdateArray, selectedValue) => {
		let post = {};
		if (fieldsToBeUpdateArray?.length) {
			fieldsToBeUpdateArray?.forEach((f) => {
				if (variableValidator(typeof info[f], 'bool')) {
					post[f] = info[f];
					props.data[f] = info[f];
				}
			});
		}
		if (Object.keys(post).length > 0) {
			post.user_id = userId;
			post.project_id = project_id;
			post.task_id = task_id;
			// post.start_date = info.start_date
			// post.end_date = info.end_date
			post.plan_id = info?.plan_id;
			post = { ...post, ...selectedValue };
			props.dispatch(
				updateTask(
					post,
					plan_id ? true : false,
					props.task_view_type,
					props?.filterData,
				),
			);
		}
		handleEditElement('');
	};

	const handleChange = (name, value) => {
		if (typeof value == 'undefined') value = null;
		const fieldsToBeUpdateNew = [...fieldsToBeUpdate];
		if (!fieldsToBeUpdateNew.some((f) => f === name)) {
			fieldsToBeUpdateNew.push(name);
		}
		setFieldsToBeUpdate(fieldsToBeUpdateNew);
		setInfo((prevInfo) => ({
			...prevInfo,
			[name]: value,
		}));

		if (
			name === 'board_id' ||
			name === 'assigee_id' ||
			name === 'category_id' ||
			name === 'type' ||
			name === 'plan_id' ||
			name === 'watchers' ||
			name === 'location_id' ||
			name === 'tags' ||
			name === "title"
		) {
			onBlurSubmit(fieldsToBeUpdateNew,{[name]:value});
		}
	};

	// setEditCheck is missing
	// setUnlinkTask is missing
	// setChecklistHiden is missing
	// setUseTemplate is missing
	// setInfoChecklist
	// setRelatedTask
	// setRelatedIssue
	// setInfo

	const {
		task,
		boardList,
		assignee,
		category,
		taskLocation,
		tag,
		sheets,
		hideBtn,
		taskChecklist,
		templateData,
		relatedTask: relatedTasks,
		filterData,
	} = props;

	const projectUsers = [];
	const watcherUsers = [];
	

	const getOptionLabel = (option) => {
		return `${option?.label?.props?.user?.first_name} ${option?.label?.props?.user?.last_name}`;
	};

	assignee?.forEach((a) => {
		(a?.users).forEach((u) => {
			// -------------------------- Assignee -------------------
			projectUsers.push({
				label:  <CustomLabelForAssignee user={u} />,
				value: u._id,
			});


			//  ------------------------- wathcer ------------------- 
			watcherUsers.push({
				label:  <CustomLabelForWatcher user={u}/>,
				value: u._id,
			});
		});
	});

	const sheetInfo = [];
	sheets?.forEach((a) => {
		(a?.plans).forEach((s) => {
			sheetInfo.push({ label: s.sheet_no, value: s._id, url: s.file });
		});
	});

	const template = templateData?.map((tg) => {
		return { label: tg.name, value: tg._id };
	});
	const tags = tag?.map((tg) => {
		return { label: tg.name, value: tg._id };
	});
	const location = taskLocation?.map((tl) => {
		return { label: tl.name, value: tl._id };
	});
	const categories = category?.map((c) => {
		return {
			label: c?.name,
			value: c._id,
			catName: c?.name,
		};
	});


	const board = boardList?.map((b) => {
		return {
			label: (
				<>
					<div className="d-flex">
						<div style={{ width: '2%', backgroundColor: b.color_code }}>
							{' '}
						</div>
						<div style={{ width: '98%' }} className={`ps-2`}>
							{b.name}
						</div>
					</div>
				</>
			),
			isdisabled:
				(b.name == 'Completed' && task.allowCompleted == false) ||
				(b.name == 'Verified' && task.allowVerified == false),
			value: b._id,
			...b,
		};
	});
	const workTypes = [
		{ name: 'Planned', value: 'planned' },
		{ name: 'Issue', value: 'issue' },
	];
	const typeOfWork = workTypes?.map((b) => {
		return { label: b.name, value: b.value };
	});
	const taskTypes = [
		{ name: 'Publish', value: true },
		{ name: 'Unpublish', value: false },
	];
	const typeOfTask = taskTypes?.map((b) => {
		return { label: b.name, value: b.value };
	});

	const related = relatedTasks?.length && relatedTasks
		?.filter((rt) => rt._id != task_id)
		?.map((rt) => {
			return { label: rt.title, value: rt._id };
		});
	if (!task) {
		return 'loading ....';
	}
	const selectedBoard = board?.filter(
		(board) => board.value === info.board_id,
	)[0];

	let historyTemp = {};

	const {
		related_task,
		checklist,
		add_checklist,
		use_template,
		sheets_n,

		statusbar,
		category: TaskCategory,
	} = getSiteLanguageData('task/update');
	const {
		types_of_work,
		category_name,
		assignee_name,
		watcher,
		start_date:startDate,
		end_date:endDate,
		manpower,
		cost,
		tags_name,
		location_name,
		sheets_name,
		total_work,
	} = getSiteLanguageData('commons');

	const { tags: TaskTags } = getSiteLanguageData('sheet/toolbar');
	const { new_template } = getSiteLanguageData('project_tamplate');
	const {unit_name}  = getSiteLanguageData('storeroom');
	const {manage_template}  = getSiteLanguageData('setting');

	const handleRelatedTask = (e)=>{
		props.dispatch(
			manageTemplate({
				task_id: task_id,
				template_id: e.value,
				user_id: userId,
				project_id: project_id,
			}),
		);
		setUseTemp(false);
	}

	const handleInputChage = (event) => {
		const { name, value } = event.target;
		setInfo({ ...info, [name]: value });
	};

	return (
		<>
			{!hideBtn ? (
				<span className="">
					<img
						alt="livefield"
						src="/images/edit-orange.svg"
						width="15px"
						onClick={handleShow}
					/>
				</span>
			) : (
				''
			)}

			<Modal
				size="1050"
				show={show}
				className="lf-task-info-modal"
				onHide={handleClose}
				animation={false}>
					<Modal.Header closeButton className="bg align-items-start">
						<div className="d-flex align-items-start">
							<div
								className="ms-1 lf-h-40 lf-w-40  lf-br-50 text-uppercase"
								style={{
									backgroundColor: selectedBoard?.color_code,
									padding: '10px 10px 10px 11px',
									color: '#FFF',
									fontWeight: 600,
								}}>
								{props.task &&
								props.task.category &&
								props.task.category[0] &&
								props.task.category[0].name
									? props.task.category[0].name.split(' ').length > 1
										? props.task.category[0].name.split(' ')[0].charAt(0) +
										  props.task.category[0].name.split(' ')[1].charAt(0)
										: props.task.category[0].name.charAt(0) +
										  '' +
										  props.task.category[0].name.charAt(1)
									: ''}
							</div>
							<div className="ms-3 d-inline-block px-0">
								<span className="theme-secondary">
									#{task.task_no} | @
									{task?.assigee?.map((a) => {
										return <>{a.first_name}</>;
									})}
								</span>
								<div className="priority-task-info fs-6 lf-link-cursor">
									{editActive === 'title' ? (
										<div className="d-flex align-items-center">
											<FormControl
												as="input"
												name="title"
												onChange={handleInputChage}
												value={info.title}
											/>
											<div className="ms-3">
												<span
													className="task-inline-save-btn"
													onClick={()=>{
														const fieldsToBeUpdateNew = [...fieldsToBeUpdate];
														fieldsToBeUpdateNew.push("title");
														onBlurSubmit(fieldsToBeUpdateNew,{["title"]:info.title});
													}}>
													<i className="fas fa-check"></i>
												</span>
											</div>
											<div className="ms-3">
												<span
													className="task-inline-cancel-btn"
													onClick={() => handleEditElement('', 'title')}>
													<i className="fas fa-times"></i>
												</span>
											</div>
										</div>
									) : (
										<div
											className=""
											onClick={() => handleEditElement('title')}>
											<span className="text-break" title={'Edit'}>
												{info.title}
											</span>
											<span>
												<i className="ms-2 theme-secondary fs-6 far fa-edit lf-link-cursor"></i>
											</span>
										</div>
									)}
								</div>
							</div>
							{info && typeof info.is_published != 'undefined' && (
								<div className="text-end align-start ms-auto pe-0">
									<span
										className={`d-flex btn p-1 mt-1 ${
											!info?.is_published ? 'btn-danger' : 'btn-success'
										}`}
										onClick={(e) =>
											handleChange(
												'is_published',
												!info?.is_published ? true : false,
											)
										}
										onMouseLeave={onBlurSubmit}>
										{!info?.is_published ? (
										<>
											<i className="far fa-eye-slash mt-1"></i>
											<span className="d-none d-md-inline-block ps-2"> Unpublished </span>
										</>) : (<>
										<i class="far fa-eye mt-1"></i>
										<span className="ps-2 d-none d-md-inline-block"> Published </span>
										</>)}
									</span>
								</div>
							)}

							{/* <span className="btn theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">Unpublish</span> */}
						</div>
					</Modal.Header>

					<Modal.Body className="py-0 px-3">
						<div className="row">
							<div
								className="col-md-7 col-lg-8 task-info-form bg-light pt-3"
								style={{
									maxHeight: '81vh',
									height: '81vh',
									overflow: 'auto',
								}}>
								<span className="row px-2">
									<div className="col-lg-3 pe-0 mb-3">
										<div className="w-100 board-selector">
											<label className="text-center fs-13">
												{siteData.status.label}
											</label>
											<CustomSelect
												placeholder={`${statusbar.text}...`}
												moduleType="status"
												name="board_id"
												onChange={(e) => handleChange('board_id', e.value)}
												options={board}
												value={board?.filter(
													(board) => board.value === info.board_id,
												)}
												// onBlur={this.onBlurSubmit}
											/>
										</div>
									</div>
									<div className=" col-lg-3 pe-0 mb-3">
										<label>{startDate.text}</label>
										{
											<DatePicker
												className="w-100 input-border"
												customInput={
													<div className="bg-white">
														<i
															className="fas fa-calendar text-secondary"
															style={{
																padding: '12px 5px 12px 10px',
																margin: 0,
															}}></i>
														<span className="ms-2">
															{info?.start_date
																? moment(info?.start_date).format('DD MMM YYYY')
																: null}
														</span>
													</div>
												}
												// selectsRange={true}
												maxDate={
													info.end_date ? moment(info.end_date).toDate() : null
												}
												/* endDate={
													info.end_date ? moment(info.end_date).toDate() : null
												} */
												dateFormat="dd/MM/yyyy"
												onChange={(e) => {
													/* if (e[1]) {
														this.handleChange('end_date', e[1]);
													} else {
														this.handleChange('start_date', e[0]);
													} */
													// this.handleDatesChange(e[0], e[1]);
													handleChange('start_date', e);
													/* this.setState({
														info: {
															...this.state.info,
															start_date: e
														},
													}); */
												}}
												selected={
													info.start_date
														? new Date(info.start_date)
														: null
												}
												onCalendarClose={()=>{
													const fieldsToBeUpdateNew = [...fieldsToBeUpdate];
													fieldsToBeUpdateNew.push("start_date");
													onBlurSubmit(fieldsToBeUpdateNew,{["start_date"]:info.start_date});
												}}
												isClearable={true}
											/>
										}
									</div>
									<div className=" col-lg-3 pe-0 mb-3">
										<label>{endDate.text}</label>
										{
											<DatePicker
												className="w-100 input-border"
												customInput={
													<div className="bg-white">
														<i
															className="fas fa-calendar text-secondary"
															style={{
																padding: '12px 5px 12px 10px',
																margin: 0,
															}}></i>
														<span className="ms-2">
															{/* {info?.start_date
																? moment(info?.start_date).format('DD MMM')
																: null} */}
															{info?.end_date
																? `${moment(info?.end_date).format(
																		'DD MMM YYYY',
																  )}`
																: null}
														</span>
													</div>
												}
												// selectsRange={true}
												/* startDate={
													info.start_date
														? moment(info.start_date).toDate()
														: null
												} */
												minDate={
													info.start_date
														? moment(info.start_date).toDate()
														: null
												}
												dateFormat="dd/MM/yyyy"
												onChange={(e) => {
													/* if (e[1]) {
														this.handleChange('end_date', e[1]);
													} else {
														this.handleChange('start_date', e[0]);
													} */
													// this.handleDatesChange(e[0], e[1]);
													// this.setState({
													// 	info: {
													// 		...this.state.info,
													// 		// start_date: e[0],
													// 		end_date: e,
													// 	},
													// });
													handleChange('end_date', e);
												}}
												selected={
													info.end_date
														? new Date(info.end_date)
														: null
												}
												onCalendarClose={()=>{
													const fieldsToBeUpdateNew = [...fieldsToBeUpdate];
													fieldsToBeUpdateNew.push("end_date");
													onBlurSubmit(fieldsToBeUpdateNew,{["end_date"]:info.end_date});
												}}
												isClearable={true}
											/>
										}
									</div>
									<div className="col-lg-3 pe-0 mb-3">
										<div className="task-assignee-selector">
											<label>{assignee_name?.text}</label>
											<CustomSelect
												//styles={{ fontSize: '13px', borderRadius: '8px' }}
												placeholder={`${assignee_name.text}...`}
												name="assigee_id"
												moduleType="taskUsers"
												onChange={(e) =>{
													handleChange('assigee_id', e.value)
												}}
												options={projectUsers}
												value={projectUsers?.filter(
													(ass) => ass.value === info.assigee_id,
												)}
												getOptionLabel={getOptionLabel}
												isSearchable={true}
												// onBlur={this.onBlurSubmit}
											/>
										</div>
									</div>
								</span>
								<div className="row px-2">
									<div className=" col-lg-3 pe-0 mb-3">
										<label>{category_name?.text}</label>
										{
											<CustomSelect
												placeholder={`${TaskCategory.text}...`}
												type="Creatable"
												moduleType="category"
												name="category_id"
												onChange={(e) => {
													let fireHandleChange = true;
													if (e && e.__isNew__ && e.value) {
														fireHandleChange = false;
														props.dispatch(
															CreateTaskCategory(
																{
																	user_id: userId,
																	project_id: project_id,
																	name: e.value,
																},
																(newCategory) => {
																	if (newCategory?.result?._id) {
																		handleChange(
																			'category_id',
																			newCategory?.result?._id,
																		);
																	}
																},
															),
														);
													}
													if (fireHandleChange) {
														handleChange(
															'category_id',
															e?.value ? e?.value : '',
														);
													}
												}}
												isSearchable={true}
												options={categories}
												value={categories?.filter(
													(board) =>
														board.value === info.category_id,
												)}
												isClearable={true}
												// onBlur={this.onBlurSubmit}
											/>
										}
									</div>

									<div className="col-lg-3 pe-0 mb-3">
										<label>{types_of_work?.text}</label>
										<CustomSelect
											placeholder={`${types_of_work.text}...`}
											name="type"
											moduleType="workType"
											onChange={(e) => handleChange('type', e.value)}
											options={typeOfWork}
											value={typeOfWork?.filter(
												(work) => work?.value === info.type,
											)}
											// onBlur={this.onBlurSubmit}
											required
										/>
									</div>
									<div className="col-lg-3 pe-0 mb-3">
										<label htmlFor="Sheet" className="col-3">
											{sheets_n.text}
										</label>
										<CustomSelect
											type="Creatable"
											controlShouldRenderValue={true}
											placeholder={`${sheets_name.text}...`}
											name="plan_id"
											moduleType="sheet"
											onChange={(e) => handleChange('plan_id', e?.value)}
											options={sheetInfo}
											value={sheetInfo?.filter(
												(sheet) => sheet.value === info.plan_id,
											)}
											isDisabled={!!props?.plan_id}
											isClearable={true}
											// onBlur={this.onBlurSubmit}
										/>
									</div>
									<div className="col-lg-3 pe-0 mb-3">
										<div className="w-100 ">
											<label>{location_name?.text}</label>
											{
												<CustomSelect
													type="Creatable"
													placeholder={`${location_name?.text}...`}
													name="location_id"
													moduleType="location"
													isClearable={true}
													onChange={(e) => {
														if (e && e.__isNew__) {
															props.dispatch(
																createlocation(
																	{
																		user_id: userId,
																		project_id: project_id,
																		name: e.value,
																	},
																	(lData) => {
																		handleChange('location_id', lData._id);
																	},
																),
															);
														} else {
															handleChange('location_id', e?.value);
														}
													}}
													options={location}
													// onBlur={this.onBlurSubmit}
													value={location?.filter(
														(loc) => loc.value === info?.location_id,
													)}
												/>
											}
										</div>
									</div>
								</div>
								<div className="row px-2">
									<div className="col-lg-3 pe-0 mb-3">
										<div className="w-100">
											<label>{manpower?.text}</label>
											<InputGroup>
												<InputGroup.Text className="theme-secondary bg-white">
													<i className="fas fa-users"></i>
												</InputGroup.Text>
												<FormControl
													className=" lf-formcontrol-height"
													aria-label="Recipient's Manpower"
													type="number"
													name="manpower"
													pattern="[0-9]"
													autoComplete="off"
													onChange={handleInputChage}
													onBlur={()=>{
														const fieldsToBeUpdateNew = [...fieldsToBeUpdate];
														fieldsToBeUpdateNew.push("manpower");
														onBlurSubmit(fieldsToBeUpdateNew,{["manpower"]:info.manpower});
														
													}}
													value={info.manpower}
												/>
											</InputGroup>
										</div>
									</div>
									<div className="col-lg-3 pe-0 mb-3">
										<div className="w-100">
											<label>{cost?.text}</label>
											<InputGroup>
												<InputGroup.Text className="theme-secondary bg-white">
													<i className="fas fa-money-bill"></i>
												</InputGroup.Text>

												<FormControl
													className=" lf-formcontrol-height"
													aria-label="Recipient's Cost"
													type="number"
													name="cost"
													pattern="[0-9]"
													autoComplete="off"
													onChange={handleInputChage}
													onBlur={()=>{
														const fieldsToBeUpdateNew = [...fieldsToBeUpdate];
														fieldsToBeUpdateNew.push("cost");
														onBlurSubmit(fieldsToBeUpdateNew,{["cost"]:info.cost});
														
													}}
													value={info.cost}
												/>
											</InputGroup>
										</div>
									</div>
									<div className="col-lg-3 pe-0 mb-3">
										<div className="w-100">
											<label>{total_work.text}</label>
											<InputGroup>
												<InputGroup.Text className="theme-secondary bg-white">
													<i className="fas fa-briefcase"></i>
												</InputGroup.Text>
												<FormControl
													className=" lf-formcontrol-height"
													aria-label={total_work.text}
													type="number"
													name="total_work"
													disabled={
														Array.isArray(props?.task?.taskWallList) &&
														props?.task?.taskWallList.length > 0
													}
													pattern="[0-9]"
													autoComplete="off"
													onChange={handleInputChage}
													onBlur={()=>{
														const fieldsToBeUpdateNew = [...fieldsToBeUpdate];
														fieldsToBeUpdateNew.push("total_work");
														onBlurSubmit(fieldsToBeUpdateNew,{["total_work"]:info.total_work});
														
													}}
													value={info?.total_work}
												/>
											</InputGroup>
										</div>
									</div>
									<div className="col-lg-3 pe-0 mb-3">
										<div className="w-100 ">
											<label>{unit_name.text}</label>
											{
												<CustomSelect
													placeholder="Work Type"
													name="wall_work_type"
													moduleType="wall_work_type"
													isClearable={true}
													disabled={
														Array.isArray(props?.task?.taskWallList) &&
														props?.task?.taskWallList.length > 0
													}
													onChange={(e) => {
														handleChange('wall_work_type', e?.value);
													}}
													options={wallUnit.map((wt) => ({
														label: wt,
														value: wt,
													}))}
													onBlur={()=>{
														if(info?.wall_work_type){
															const result = info?.wall_work_type ? ["wall_work_type"] : [];
  															onBlurSubmit(result, { wall_work_type: info?.wall_work_type });
														}
													}}
													value={wallUnit
														?.map((wt) => ({ label: wt, value: wt }))
														.find(
															(loc) =>
																loc.value === info?.wall_work_type,
														)}
												/>
											}
										</div>
									</div>
								</div>

								<div className="row px-2">
									<div className="col-lg-6 pe-0 mb-3">
										<label>{watcher?.text}</label>
										<CustomSelect
											placeholder={`${watcher?.text}...`}
											isMulti
											name="watchers"
											className={`task-waters-container`}
											moduleType="users"
											onChange={(e) =>
												handleChange(
													'watchers',
													e?.map((w) => w.value),
												)
											}
											options={watcherUsers}
											closeMenuOnSelect={false}
											// onBlur={this.onBlurSubmit}
											value={watcherUsers?.filter((watcher) =>
												info.watchers?.some(
													(w) => w === watcher.value,
												),
											)}

											getOptionLabel={getOptionLabel}
											isSearchable={true}
										/>
									</div>

									<div className=" col-lg-6 pe-0 mb-3">
										<label>{tags_name?.text}</label>
										<InputGroup className="mb-2 w-100">
											{
												<span className="w-100">
													<CustomSelect
														type="Creatable"
														isClearable
														isMulti
														placeholder={`${tags_name?.text}...`}
														name="tags"
														moduleType="tags"
														onChange={(e) => {
															let fireHandleChange = true;
															e.filter((val) => val.__isNew__).forEach(
																(val) => {
																	fireHandleChange = false;
																	props.dispatch(
																		createTag(
																			{
																				user_id: userId,
																				project_id: project_id,
																				name: val.value,
																			},
																			(newTag) => {
																				if (newTag?.result?._id) {
																					handleChange('tags', [
																						...info.tags,
																						newTag?.result?._id,
																					]);
																				}
																			},
																		),
																	);
																},
															);
															if (fireHandleChange) {
																handleChange(
																	'tags',
																	e?.map((t) => t.value),
																);
															}
														}}
														options={tags}
														closeMenuOnSelect={false}
														// onBlur={this.onBlurSubmit}
														value={tags?.filter((tag) =>
															info.tags?.some(
																(t) => t === tag.value,
															),
														)}
													/>
												</span>
											}
										</InputGroup>
									</div>
								</div>

								{/* <div className='row px-2 mt-3'>
									<div className="col-lg-3 pe-0">
										<div className="mb-2 w-100">
											<label>Total Work</label>
											<InputGroup>
												<InputGroup.Text className="theme-secondary bg-white">
													<i className="fas fa-users"></i>
												</InputGroup.Text>
												<FormControl
													className=" lf-formcontrol-height"
													aria-label="Total Work"
													type="number"
													name="total_work"
													disabled={(Array.isArray(this.props?.task?.taskWallList) && this.props?.task?.taskWallList.length > 0)}
													pattern="[0-9]"
													autoComplete="off"
													onChange={(e) =>
														this.handleChange('total_work', e.target.value)
													}
													onBlur={this.onBlurSubmit}
													value={this.state.info.total_work}
												/>
											</InputGroup>
										</div>
									</div>
									<div className="col-lg-3 pe-0">
										<div className="w-100 ">
											<label>Unit</label>
											{
												<CustomSelect
													placeholder="Work Type"
													name="wall_work_type"
													moduleType="wall_work_type"
													isClearable={true}
													disabled={(Array.isArray(this.props?.task?.taskWallList) && this.props?.task?.taskWallList.length > 0)}
													onChange={(e) => {
														this.handleChange('wall_work_type', e?.value);
													}}
													options={wallUnit.map((wt)=>({label:wt, value: wt}))}
													onBlur={this.onBlurSubmit}
													value={wallUnit?.map((wt)=>({label:wt, value: wt})).find(
														(loc) => loc.value === this.state.info?.wall_work_type,
													)}
												/>
											}
										</div>
									</div>
								</div> */}

								<div className="row mt-2">
									<div className="col-12">
										<Card className="p-1 border-0 bg-light">
											<div className="row">
												<div className="col-12">
													<div className="d-flex align-items-center">
													<div className="fw-bold float-start">
														<label className="p-1"> Issues</label>
													</div>
													<div className="ms-auto float-end">
														<span
															onClick={() => setRelateIssue(true)}
															className="lf-common-btn">
															+ Add
														</span>
													</div>

													</div>
												</div>


												{relateIssue && (
													<>
														<div className="col-11">
															<div className="form-group pb-2 ">
																{/* <CustomSelect
																	className="border border-0"
																	isClearable
																	isMulti
																	placeholder="Select issue..."
																	name="related_issues"
																	onChange={(e) =>
																		this.setRelatedIssue( e)
																	}
																	options={this.state.unBindedIssues}
																	closeMenuOnSelect={false}
																	value={this.state.relatedIssues}
																	onBlur={this.submitIssueTask}
																/> */}

																<FormControl
																	className=" lf-formcontrol-height"
																	placeholder="Issue description"
																	type="text"
																	name="related_issues"
																	autoComplete="off"
																	onChange={(e) =>
																		// this.handleChange('manpower', e.target.value)
																		setIssueName(e.target.value)
																	}
																	onKeyPress={(e) => {
																		if (e.key === 'Enter') {
																			createIssueHandler();
																		}
																	}}
																	value={issueName}
																/>
															</div>
														</div>

														<div className="col-1">
															<div className="d-flex justify-content-between">
																<span className={`btn px-0 w-25`}>
																	<i
																		onClick={createIssueHandler}
																		style={{
																			color: 'blue',
																			fontSize: '15px',
																		}}
																		className="fas fa-check theme-btnbg theme-secondary"></i>
																</span>
																{` `}
																<span className={`btn px-0 w-25`}>
																	<i
																		onClick={() =>{
																			setRelateIssue(false);
																			setIssueName("")
																		}}
																		style={{
																			color: 'red',
																			fontSize: '15px',
																		}}
																		className="fas fa-times theme-btnbg theme-secondary"></i>
																</span>
															</div>
														</div>
													</>
												)}

												{bindedIssues &&
													bindedIssues.length > 0 && (
														<div className="col-12">
															<Card className="border p-2">
																{bindedIssues &&
																	bindedIssues.map((is, bsi) => {
																		return (
																			<div
																				className={`d-flex py-2 ${
																					bindedIssues.length ==
																					bsi + 1
																						? ''
																						: 'border-bottom'
																				}`}
																				key={bsi + 'bsi'}>
																				<div className="w-100 align-middle">
																					<Link
																						to={`/issues/${project_id}/${is?._id}`}
																						className={`hover-theme-color`}
																						target="_blank">
																						# {is.issue_no} {is.title}
																					</Link>
																				</div>
																				{/* <div className="w-25 align-middle text-end text-nowrap">
																					<span
																						className="pe-3 theme-secondary theme-btnbg lf-link-cursor"
																						onClick={this.handleUnlinkIssue.bind(
																							this,
																							is,
																						)}>
																						<i
																							className="fas fa-unlink fa-sm"
																							title="De-Link"
																						/>
																					</span>
																				</div> */}
																			</div>
																		);
																	})}
															</Card>
														</div>
													)}
											</div>
										</Card>
									</div>
								</div>

								<div className="row">
									<div className="col-12">
										<Card className="mt-3 p-1 border-0 bg-light">
											<div className="col-12">
												<div className="d-flex align-items-center">
													<div className="float-start d-inline-block fw-bold">
														<label>{related_task?.text}</label>
													</div>
													<div className="ms-auto d-inline-block float-end">
														<span
															onClick={() => {
																setRelatedT(true);
															}}
															className="">
															{/* <i className={'fas fa-plus-circle theme-color'}></i> */}
															<span className="ms-1 lf-common-btn">
																+ Add
															</span>
														</span>
													</div>
												</div>
												
											</div>
											
											<span className="row">
												
												
												{!relatedT ? (
													''
												) : (
													<div className="form-group pb-2 ">
														<CustomSelect
															className="border border-0"
															isClearable
															isMulti
															placeholder="Select Tasks..."
															name="related_task"
															onChange={(e) =>
																handleChangeRelated('related_task', e)
															}
															options={related}
															closeMenuOnSelect={false}
															value={relatedTask.related_task}
															onBlur={submitRelatedTask}
														/>
													</div>
												)}
											</span>
											{task &&
												task.relatedtask &&
												task.relatedtask.length > 0 &&
												task.relatedtask[0].related_task_data &&
												task.relatedtask[0].related_task_data.length > 0 && (
													<Card className={`border ${task.relatedtask.length}`}>
														{[task?.relatedtask[0]]?.map((td) => {
															return td?.related_task_data?.map((rt, rti) => {
																const taskCat = categories?.filter(
																	(ca) => ca?.value === rt?.category_id,
																)[0]?.catName;
																return (
																	<tr
																		className={`py-2 ${
																			td.related_task_data.length == rti + 1
																				? ''
																				: 'border-bottom'
																		} `}>
																		<td className="lf-w-50 align-middle">
																			<span
																				className="d-block task-img text-white font-weight-bold text-uppercase p-1 align-middle"
																				style={{
																					backgroundColor: board?.filter(
																						(ca) => ca?.value === rt?.board_id,
																					)[0]?.color_code,
																					fontSize: '11px',
																					lineHeight: '2.2',
																				}}>
																				{taskCat?.charAt(0)}
																				{taskCat?.charAt(1)}
																			</span>
																		</td>
																		<td className="lf-w-500 align-middle">
																			<a
																				href={`/tasks/${project_id}/${rt?._id}`}
																				className={`hover-theme-color`}
																				target="_blank">
																				{rt.title}
																			</a>
																		</td>
																		<td className="lf-w-100 align-middle text-end text-nowrap">
																			<span
																				className="pe-3 theme-secondary theme-btnbg lf-link-cursor"
																				onClick={()=>handleUnlink(rt)}>
																				<i
																					className="fas fa-unlink fa-sm"
																					title="De-Link"
																				/>
																			</span>
																		</td>
																	</tr>
																);
															});
														})}
													</Card>
												)}
										</Card>
									</div>
								</div>
								<div className="row mb-3">
									<div className="col-12">
										<Card className="mt-3 p-1 border-0 bg-light">
											<div>
												<label>{checklist.text}</label>
											</div>

											<div className={`border-0 p-3`}>
												{taskChecklist?.map((tc) => {
													return (
														<div className="my-2 task-checklist-content row">
															{/* 															<div className="col-lg-1">
																{tc?.state === 'unchecked' ? (
																	<label className="check">
																		<input
																			type="checkbox"
																			id="blankCheckbox"
																			onClick={() => {
																				this.props.dispatch(
																					updateTaskChecklist({
																						task_id: this.task_id,
																						checklist_id: tc?._id,
																						title: tc?.title,
																						state: 'completed',
																					}),
																				);
																			}}
																		/>
																		<span className="checkmark"></span>
																	</label>
																) : tc?.state === 'completed' ? (
																	<label className="checkgreen">
																		<input
																			type="checkbox"
																			id="blankCheckbox"
																			onClick={() => {
																				this.props.dispatch(
																					updateTaskChecklist({
																						task_id: this.task_id,
																						checklist_id: tc?._id,
																						title: tc?.title,
																						state: 'uncompleted',
																					}),
																				);
																			}}
																			checked
																		/>
																		<span className="checkmarkgreen"></span>
																	</label>
																) : tc?.state === 'uncompleted' ? (
																	<label className="checkred">
																		<input
																			type="checkbox"
																			onClick={() => {
																				this.props.dispatch(
																					updateTaskChecklist({
																						task_id: this.task_id,
																						checklist_id: tc?._id,
																						title: tc?.title,
																						state: 'notapplicable',
																					}),
																				);
																			}}
																			checked
																		/>
																		<span className="checkmarkred"></span>
																	</label>
																) : (
																	<label className="checkgray ">
																		<input
																			type="checkbox"
																			onClick={() => {
																				this.props.dispatch(
																					updateTaskChecklist({
																						task_id: this.task_id,
																						checklist_id: tc?._id,
																						title: tc?.title,
																						state: 'unchecked',
																					}),
																				);
																			}}
																			checked
																		/>
																		<span className="checkmarkgray"></span>
																	</label>
																)}
															</div> */}

															<div className="col-sm-10 col-md-10 px-0">
																<div className="row mx-0">
																	<div className="col-12">
																		<div className="d-flex align-items-start">	
																			<div className="float-start d-inline-block">
																				{tc?.state === 'unchecked' ? (
																					<label className="check">
																						<input
																							type="checkbox"
																							id="blankCheckbox"
																							onClick={() => {
																								props.dispatch(
																									updateTaskChecklist({
																										task_id: task_id,
																										checklist_id: tc?._id,
																										title: tc?.title,
																										state: 'completed',
																									}),
																								);
																							}}
																						/>
																						<span className="checkblank"></span>
																					</label>
																				) : tc?.state === 'completed' ? (
																					<label className="checkgreen">
																						<input
																							type="checkbox"
																							id="blankCheckbox"
																							onClick={() => {
																								props.dispatch(
																									updateTaskChecklist({
																										task_id: task_id,
																										checklist_id: tc?._id,
																										title: tc?.title,
																										state: 'uncompleted',
																									}),
																								);
																							}}
																							checked
																						/>
																						<span className="checkmarkgreen"></span>
																					</label>
																				) : tc?.state === 'uncompleted' ? (
																					<label className="checkred">
																						<input
																							type="checkbox"
																							onClick={() => {
																								props.dispatch(
																									updateTaskChecklist({
																										task_id: task_id,
																										checklist_id: tc?._id,
																										title: tc?.title,
																										state: 'notapplicable',
																									}),
																								);
																							}}
																							checked
																						/>
																						<span className="checkmarkred"></span>
																					</label>
																				) : (
																					<label className="checkgray ">
																						<input
																							type="checkbox"
																							onClick={() => {
																								props.dispatch(
																									updateTaskChecklist({
																										task_id: task_id,
																										checklist_id: tc?._id,
																										title: tc?.title,
																										state: 'unchecked',
																									}),
																								);
																							}}
																							checked
																						/>
																						<span className="checkmarkgray"></span>
																					</label>
																				)}
																			</div>
																			<div className="float-start d-inline-block">
																				<InputGroup>
																					{editCheck == tc?._id ? (
																						<FormControl
																							type="text"
																							name="title"
																							autoComplete="off"
																							className="form-inline"
																							onBlur={(e) => {
																								const name = e.target.value;
																								submitChecklistData({
																									...tc,
																									name,
																								});
																								setTimeout(() => {
																									setEditCheck(null);
																								}, 1000);
																							}}
																							defaultValue={tc?.title}
																						/>
																					) : (
																						<>
																							<span className="">{tc?.title}</span>
																						</>
																					)}
																				</InputGroup>
																			</div>
																			<div className="ms-auto float-end d-inline-block">

																			</div>
																		</div>
																	</div>
																</div>
															</div>
															<div className="col-sm-2 col-md-2 text-end">
																{editCheck == tc?._id ? (
																	<>
																		<i style={{color: 'blue',}}																			className="fas fa-check me-3 theme-btnbg theme-secondary"></i>
																		{` `}
																		<i onClick={() => setEditCheck(null)} style={{color: 'red',}}
																			className="fas fa-times theme-btnbg theme-secondary"></i>
																	</>
																) : (
																	<>
																		<i
																			className="fas fa-edit me-3 theme-btnbg theme-secondary lf-text-vertical-align"
																			onClick={(e) => setEditCheck(tc._id)}></i>
																		<i
																			className="far fa-trash-alt theme-btnbg theme-secondary lf-text-vertical-align"
																			onClick={() =>
																				sweetAlert(
																					() =>
																						props.dispatch(
																							deleteTaskChecklist({
																								task_id: task_id,
																								checklist_id: [tc?._id],
																							}),
																						),
																					'Task Checklist',
																				)
																			}></i>
																	</>
																)}
															</div>
														</div>
													);
												})}
											</div>
										</Card>
										{!checklistHiden ? (
											''
										) : (
											<>
												{!useTemp ? (
													<div className="d-flex">
														<div className="col-11 form-group pb-2 ">
															{/* <label style={{ fontSize:"14px",color:"#000"}}>Checklist</label> */}
															<FormControl
																className=" lf-formcontrol-height"
																placeholder="Enter Name"
																type="text"
																name="title"
																autoComplete="off"
																onChange={(e) =>
																	handleChangeChecklist(
																		'title',
																		e.target.value,
																	)
																}
																value={infoChecklist.title}
																onKeyPress={(e) => {
																	if (e.key === 'Enter') {
																		submitTaskChecklist();
																	}
																}}
																// onBlur={this.setChecklistHiden(true)}
																// onBlur={() => this.setChecklistHiden(false)}
																// required
															/>
														</div>

														<div className="col-1">
															<div>
																<div className="d-flex justify-content-between px-2">
																	<span className={`btn px-0 w-25`}>
																		<i
																			onClick={submitTaskChecklist}
																			style={{
																				color: 'blue',
																				fontSize: '15px',
																			}}
																			className="fas fa-check theme-btnbg theme-secondary"></i>
																	</span>
																	{` `}
																	<span className={`btn px-0 w-25`}>
																		<i
																			onClick={() => {
																				setChecklistHiden(false);
																				handleChangeChecklist('title', '');
																			}}
																			style={{
																				color: 'red',
																				fontSize: '15px',
																			}}
																			className="fas fa-times theme-btnbg theme-secondary"></i>
																	</span>
																</div>
															</div>
														</div>
													</div>
												) : (
													<>
														{/* <label style={{ fontSize:"14px",color:"#000"}}>Checklist</label> */}
														<CustomSelect
															// isClearable
															// isMulti
															placeholder={`Select ${manage_template.text}...`}
															name="related_task"
															// onChange={(e) => this.handleChangeRelated('related_task', e)}
															onChange={handleRelatedTask}
															// onChange={(e) => {
															// 	props.dispatch(
															// 		useTemplate({
															// 			task_id: task_id,
															// 			template_id: e.value,
															// 			user_id: userId,
															// 			project_id: project_id,
															// 		}),
															// 	);
															// 	setUseTemp(false);
															// }}
															onBlur={() => setChecklistHiden(false)}
															options={template}
															closeMenuOnSelect={false}
														/>
													</>
												)}
											</>
										)}
										<div className="mt-1 d-flex">
											<div className="w-100 text-center">
												<span
													className="py-0"
													onClick={() => setChecklistHiden(true)}>
													{/* <i className={'fas fa-plus-circle theme-color'}></i>{' '} */}
													<span className="ms-1 lf-common-btn">
														+ {add_checklist.text}
													</span>
												</span>
												<span className="check-divider theme-secondary"></span>
												<span
													className="py-0 hover-theme-color"
													onClick={() => {
														setChecklistHiden(true);
														setUseTemp(true);
													}}>
													{/* <i className={'fas fa-plus-circle theme-color'}></i> */}
													<span className="ms-1 lf-common-btn">
														+ {use_template.text}
													</span>
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="col-md-5 col-lg-4 task-insert-data border-start px-0"
								style={{
									maxHeight: '81vh',
									height: '81vh',
									overflow: 'auto',
								}}>
								<Tabs
									defaultActiveKey="Task Wall"
									id="uncontrolled-tab-example"
									className="text-secondary h5 task-chat-nav"
									style={{
										boxShadow:
											'0 1px 2px RGBA(0,0,0,0.1),0 -1px RGBA(0,0,0,0.1) inset,0 2px 1px -1px rgba(255, 255, 255, 0.5) inset',
									}}>
									<Tab eventKey="Task Wall" title="Progress">
																				<WorkWall
											userId={userId}
											project_id={project_id}
											task={props}
											info={info}
										/>
									</Tab>
									<Tab eventKey="Comment" id={`task-chat-tab`} title="Comment">
										<div
											className="lf-task-comment ms-0 "
											style={{ overflow: 'hidden', height: '100%' }}>
											<Chat
												chatShow={true}
												wrapperclassName={'lf-chat-internal-component-wrapper'}
												height={chatHeight}
												room={task_id}
												{...props}
												chat_from={'task'}
												mode="component"
												title={'Comment ..'}
											/>
										</div>
									</Tab>
									<Tab eventKey="History" title="Logs">
										<div className="load-more-container-500 lf-h-500">
											{task?.taskLogs?.map((r) => {
												const rDate = moment(r?._id?.createdAt).format(
													'DD-MM-yyyy',
												);

												return (
													<>
														<p className="py-2 mt-2 mb-0 text-center text-secondary">
															{rDate}
														</p>
														{r.dateData.map((log) => {
															return (
																<div
																	className="row px-3 mb-2"
																	style={{ fontSize: '12px' }}>
																	<div className={`col-12 text-start `}>
																		<b>
																			{log?.user[0].first_name}{' '}
																			{log?.user[0].last_name}
																		</b>{' '}
																		{log?.logs_text}
																	</div>
																	<div className="col-12 task-history-time">
																		{moment(log?.createdAt).format(
																			'DD MMM, HH:mm',
																		)}
																	</div>
																</div>
															);
														})}
													</>
												);
											})}
										</div>
									</Tab>
								</Tabs>
							</div>
						</div>
					</Modal.Body>
				</Modal>
		</>
	);
};

export default withRouter(
	connect((state) => {
		return {
			task: state?.task?.[GET_SINGLE_TASK]?.result || [],
			boardList: state?.task?.[GET_ALL_TASK_BOARD_LIST]?.result || [],
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
			category: state?.task?.[GET_CATEGORY_LIST]?.result || [],
			taskLocation: state?.task?.[GET_LOCATION_LIST]?.result || [],
			sheets: state?.project?.[GET_ALL_SHEETS]?.result || [],
			tag: state?.project?.[GET_ALL_TAGS]?.result || [],
			taskChecklist: state?.task?.[GET_TASK_CHECKLIST]?.result,
			relatedTask: state?.task?.[GET_TASK_LIST_BY_PROJRCT_ID]?.result || [],
			templateData: state?.project?.[GET_ALL_TEMPLATE]?.result || [],
			projectData: state?.project?.GET_PROJECT_DETAILS?.result || [],
		};
	})(UpdateTask),
);
