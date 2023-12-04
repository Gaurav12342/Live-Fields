import { Component } from 'react';
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
import React from 'react';
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

class UpdateTask extends Component {
	constructor(props) {
		super(props);
		this.projectData = props.projectData;
		this.userId = getUserId();
		this.task_id = props?.data?._id;
		this.siteData = getSiteLanguageData('task/update');
		this.start_date = props?.data?.start_date
			? moment(props?.data?.start_date).format('YYYY-MM-DD')
			: null;
		this.end_date = props?.data?.end_date
			? moment(props?.data?.end_date).format('YYYY-MM-DD')
			: null;
		this.project_id = this.props.router?.params.project_id;
		this.plan_id = this.props.router?.params.plan_id;
		this.state = {
			relatedTask: {
				user_id: this.userId,
				task_id: this.task_id,
				related_task: props?.task?.related_task
					? props?.task?.related_task
					: [],
			},
			checklistHiden: false,
			useTemp: false,
			relatedT: false,
			relateIssue: false,
			unBindedIssues: [],
			bindedIssues: props?.task?.related_tasks_issue || [],
			chatHeight: 'auto',
			issueName: '',
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				task_id: this.task_id,
				title: props?.data?.title,
				location_id: props?.data?.location_id || '',
				plan_id: props?.data?.plan_id,
				board_id: props?.data?.board_id,
				type: props?.data?.type,
				category_id: props?.data?.category_id,
				assigee_id: props?.data?.assigee_id,
				members_id: props?.data?.members_id,
				watchers: props?.data?.watchers,
				tags: props?.data?.tags,
				cost: props?.data?.cost,
				start_date: this.start_date,
				end_date: this.end_date,
				manpower: props?.data?.manpower,
				is_published: props?.data?.is_published,
				related_task: props?.task?.related_task,
			},
			infoChecklist: {
				task_id: this.task_id,
				title: '',
				state: 'unchecked',
			},
			show: props?.hideBtn || false,
			infoComment: {
				user_id: this.userId,
				task_id: this.task_id,
				comment: '',
				file_link: [],
			},
			editCheck: null,
			editActive: '',
			fieldsToBeUpdate: [],
		};
	}

	taskChatHeight = () => {
		let chatHeight =
			document.getElementsByClassName('task-info-form')[0].clientHeight -
			110 +
			'px';
		this.setState({ chatHeight: chatHeight });
	};

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getSingleTask(this.task_id));
		dispatch(getAllTags(this.project_id));
		dispatch(getBoardList(this.project_id, this.userId));
		dispatch(getAllRoleWisePeople(this.project_id));
		dispatch(GetCategoryList(this.project_id, this.userId));
		dispatch(getLocationList(this.project_id, this.userId));
		dispatch(getAllSheets(this.project_id));
		// dispatch(getAllTags(this.project_id));
		dispatch(getTaskChecklist(this.task_id));
		dispatch(getAllTaskByProjectId(this.project_id));
		dispatch(getAllTemplateWithFullDetails(this.project_id));
		this.getUnBindedIssues();
	}

	componentDidUpdate(prevProps, prevState) {
		const { task, data } = this.props;
		if (task !== prevProps.task) {
			if (!!task?._id) {
				this.setState({
					wallEditMode: false,
					chatHeight:
						document.getElementsByClassName('task-info-form')[0].clientHeight -
						110 +
						'px',
					relatedTask: {
						user_id: this.userId,
						task_id: this.task_id,
						related_task:
							task.related_tasks_list &&
							task.related_tasks_list.map((tv) => {
								return {
									value: tv._id,
									label: tv.title,
								};
							}),
					},

					bindedIssues: task?.related_tasks_issue || [],
					info: {
						user_id: this.userId,
						project_id: this.project_id,
						task_id: this.task_id,
						title: task?.title,
						location_id: data?.location_id || task?.location[0]?._id,
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
						total_work: task.total_work,
						wall_work_type: task.wall_work_type,
						// related_task: task?.related_task,
					},
				});
			}
		}
		//this.taskChatHeight();
	}

	getUnBindedIssues = () => {
		const { dispatch } = this.props;
		dispatch(
			issueForTask(
				{
					project_id: this.project_id,
					user_id: this.userId,
				},
				(resData) => {
					if (resData.result && Array.isArray(resData.result)) {
						console.log(resData.result, 'resData.result');
						this.setState({
							unBindedIssues: resData.result.map((vl) => ({
								label: vl.title,
								value: vl._id,
							})),
						});
					}
				},
			),
		);
	};

	submitChecklistData = (checkInfo) => {
		const post = {
			task_id: this.task_id,
			checklist_id: checkInfo?._id,
			title: checkInfo?.name,
			state: checkInfo?.state,
		};
		this.props.dispatch(updateTaskChecklist(post));
	};
	setEditCheck = (editCheck) => {
		this.setState({ editCheck });
	};
	setUnlinkTask = (unlinkTask) => {
		this.setState({ unlinkTask });
	};
	setChecklistHiden = (checklistHiden) => {
		this.setState({
			checklistHiden,
			useTemp: false,
		});
	};
	setUseTemplate = (useTemp) => {
		this.setState({ useTemp });
	};
	// setUseTemplate = (related) => {
	//     this.setState({ related })
	// }

	handleUnlink = (link) => {
		const { task } = this.props;
		const rt = task.relatedtask?.map((rt) => rt);
		const relatedTask = rt?.[0]?.related_task_data?.map((rt) => rt);
		const newArr = relatedTask?.filter((item) => {
			return item._id !== link._id;
		});
		const relatedId = newArr?.map((x) => x._id);
		this.props.dispatch(
			addRelatedTask({
				task_id: this.task_id,
				user_id: this.userId,
				related_task: relatedId,
			}),
		);
	};

	handleUnlinkIssue = (link) => {
		const { task } = this.props;

		this.props.dispatch(
			removeRelatedIssue(
				{
					project_id: this.project_id,
					user_id: this.userId,
					issue_id: link._id,
				},
				(resData) => {
					this.getUnBindedIssues();
					this.props.dispatch(getSingleTask(this.task_id));
				},
			),
		);
	};

	setInfoChecklist = (infoChecklist) => {
		this.setState({ infoChecklist });
	};
	handleChangeChecklist = (name, value) => {
		this.setInfoChecklist({
			...this.state.infoChecklist,
			[name]: value,
		});
	};
	submitTaskChecklist = (e) => {
		this.setState({
			infoChecklist: {
				task_id: this.task_id,
				title: '',
				state: 'unchecked',
			},
		});
		this.props.dispatch(createTaskChecklist(this.state.infoChecklist));
	};

	submitTask = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(
			updateTask(
				this.state.info,
				this.plan_id ? true : false,
				this.props.task_view_type,
				this.props?.filterData,
			),
		);
	};
	setRelatedTask = (relatedTask) => {
		this.setState({ relatedTask });
	};
	handleChangeRelated = (name, value) => {
		this.setRelatedTask({
			...this.state.relatedTask,
			[name]: value,
		});
	};
	submitRelatedTask = (e) => {
		// e.preventDefault();
		// handleClose();
		this.props.dispatch(
			addRelatedTask({
				...this.state.relatedTask,
				related_task: (this.state.relatedTask?.related_task).map((t) => {
					return t.value;
				}),
			}),
		);
		this.setState({ relatedT: false });
	};

	setRelatedIssue = (value) => {
		console.log(value, 'value');
		this.setState({
			relatedIssues: value,
		});
	};

	submitIssueTask = (e) => {
		if (this.state.relatedIssues && this.state.relatedIssues.length > 0) {
			this.props.dispatch(
				issueLinkWithTask(
					{
						task_id: this.task_id,
						project_id: this.project_id,
						related_issue: this.state.relatedIssues?.map((t) => {
							return t.value;
						}),
					},
					(resData) => {
						this.props.dispatch(getSingleTask(this.task_id));
						this.getUnBindedIssues();
						this.setRelatedIssue([]);
					},
				),
			);
		}
	};

	createIssueHandler = () => {
		let postIssue = {
			user_id: this.userId,
			project_id: this.project_id,
			title: this.state.issueName,
			status_id: 'Open',
			assigee_id: this.userId,
			watchers: [],
			tags: [],
			task_id: this.task_id,
			end_date: '',
		};
		this.props.dispatch(
			createIssue(postIssue, (resData) => {
				this.setState({
					issueName: '',
					relateIssue: false,
				});
				this.props.dispatch(getSingleTask(this.task_id));
				this.getUnBindedIssues();
				this.setRelatedIssue([]);
			}),
		);
	};

	handleShow = () => {
		this.setState({ show: true });
	};
	handleClose = () => {
		this.setState({ show: false });
		if (this.props.handleClose) {
			this.props.handleClose();
		}
	};
	setInfo = (info) => {
		this.setState(
			{ info },
			//  () => {this.onBlurSubmit()}
		);
	};
	handleChange = (name, value) => {
		if (typeof value == 'undefined') value = null;
		console.log(name, 'name, value');
		const fieldsToBeUpdate = [...this.state.fieldsToBeUpdate];
		if (!fieldsToBeUpdate.some((f) => f === name)) {
			fieldsToBeUpdate.push(name);
		}
		this.setState(
			{
				info: {
					...this.state.info,
					[name]: value,
				},
				fieldsToBeUpdate,
			},
			() => {
				if (
					name == 'board_id' ||
					name == 'assigee_id' ||
					name == 'category_id' ||
					name == 'type' ||
					name == 'plan_id' ||
					name == 'watchers' ||
					name == 'location_id' ||
					name == 'tags'
				) {
					this.onBlurSubmit();
				}
			},
		);
	};

	handleDatesChange = (start_date, end_date) => {
		const fieldsToBeUpdate = [...this.state.fieldsToBeUpdate];
		fieldsToBeUpdate.push('start_date');
		fieldsToBeUpdate.push('end_date');
		this.setState(
			{
				info: {
					...this.state.info,
					start_date: start_date,
					end_date: end_date,
				},
				fieldsToBeUpdate,
			},
			() => {
				this.onBlurSubmit();
			},
		);
	};

	handleEditElement = (type, closeType = '') => {
		this.setState({
			editActive: type,
		});
		if (closeType) {
			this.handleChange(closeType, this.props?.task?.[closeType]);
		}
	};

	onBlurSubmit = () => {
		const { fieldsToBeUpdate, info } = this.state;
		this.setState({
			fieldsToBeUpdate: [],
		});
		const post = {};
		fieldsToBeUpdate.forEach((f) => {
			if (variableValidator(typeof info[f], 'bool')) {
				post[f] = info[f];
				this.props.data[f] = info[f];
			}
		});
		if (Object.keys(post).length > 0) {
			post.user_id = this.userId;
			post.project_id = this.project_id;
			post.task_id = this.task_id;
			// post.start_date = info.start_date
			// post.end_date = info.end_date
			post.plan_id = info?.plan_id;
			this.props.dispatch(
				updateTask(
					post,
					this.plan_id ? true : false,
					this.props.task_view_type,
					this.props?.filterData,
				),
			);
		}
		this.handleEditElement('');
	};
	render() {
		console.log(this.state.bindedIssues, 'this.state.bindedIssues');
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
			relatedTask,
			filterData,
		} = this.props;

		const { editActive, info, checklistHiden, useTemp, relatedT } = this.state;
		const projectUsers = [];
		const watcherUsers = [];
		assignee?.forEach((a) => {
			(a?.users).forEach((u) => {
				projectUsers.push({
					...u,
					label: (
						<>
							{' '}
							<div className="d-flex align-items-center">
								{u?.profile ? (
									<img
										src={u.thumbnail || u.profile}
										className="me-1 priority-1 border"
									/>
								) : (
									<span
										className="task-info-category text-uppercase me-2 w-25"
										style={{ background: '#FFF', color: '#FFFFFF' }}>
										{u.first_name?.charAt(0)}
										{u.last_name?.charAt(0)}
									</span>
								)}
								<div className="lf-react-select-item w-75">
									{u.first_name} {u.last_name}
								</div>
							</div>
						</>
					),
					value: u._id,
				});
				watcherUsers.push({
					...u,
					label: (
						<>
							{u?.profile ? (
								<img
									src={u.thumbnail || u.profile}
									className="me-1 priority-1 border "
								/>
							) : (
								<span
									className="task-info-category text-uppercase me-2"
									style={{ background: '#B36BD4', color: '#FFFFFF' }}>
									{u.first_name?.charAt(0)}
									{u.last_name?.charAt(0)}
								</span>
							)}
							<span className="lf-react-select-item">
								{u.first_name} {u.last_name}
							</span>
						</>
					),
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
		const related = relatedTask
			?.filter((rt) => rt._id != this.task_id)
			?.map((rt) => {
				return { label: rt.title, value: rt._id };
			});
		if (!task) {
			return 'loading ....';
		}
		const selectedBoard = board?.filter(
			(board) => board.value === this.state.info.board_id,
		)[0];

		let historyTemp = {};
		const {
			related_task,
			add,
			delink,
			checklist,
			add_checklist,
			use_template,
			on,
			created_by,
			sheets_n,

			statusbar,
			start_end_date,
			category: TaskCategory,
			comments,
		} = getSiteLanguageData('task/update');
		const {
			types_of_work,
			category_name,
			assignee_name,
			watcher,
			start_date,
			end_date,
			manpower,
			cost,
			tags_name,
			location_name,

			unpublish,
			publish,
			manpower_unit,
			sheets_name,
			total_work
		} = getSiteLanguageData('commons');

		const { tags: TaskTags } = getSiteLanguageData('sheet/toolbar');
		const { new_template } = getSiteLanguageData('project_tamplate');
		const {unit_name}  = getSiteLanguageData('storeroom');
		const {manage_template}  = getSiteLanguageData('setting');
		return (
			<>
				{!hideBtn ? (
					<span className="">
						<img
							alt="livefield"
							src="/images/edit-orange.svg"
							width="15px"
							onClick={this.handleShow}
						/>
					</span>
				) : (
					''
				)}
				<Modal
					size="1050"
					show={this.state.show}
					className="lf-task-info-modal"
					onHide={this.handleClose}
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
								{this.props.task &&
								this.props.task.category &&
								this.props.task.category[0] &&
								this.props.task.category[0].name
									? this.props.task.category[0].name.split(' ').length > 1
										? this.props.task.category[0].name.split(' ')[0].charAt(0) +
										  this.props.task.category[0].name.split(' ')[1].charAt(0)
										: this.props.task.category[0].name.charAt(0) +
										  '' +
										  this.props.task.category[0].name.charAt(1)
									: ''}
							</div>
							<div className="ms-3 d-inline-block col-9 px-0 col-md-6 col-lg-8">
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
												onChange={(e) =>
													this.handleChange('title', e.target.value)
												}
												value={info.title}
											/>
											<div className="ms-3">
												<span
													className="task-inline-save-btn"
													onClick={this.onBlurSubmit}>
													<i className="fas fa-check"></i>
												</span>
											</div>
											<div className="ms-3">
												<span
													className="task-inline-cancel-btn"
													onClick={() => this.handleEditElement('', 'title')}>
													<i className="fas fa-times"></i>
												</span>
											</div>
										</div>
									) : (
										<div
											className=""
											onClick={() => this.handleEditElement('title')}>
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
								<div className="switch text-md-end align-middle mt-1 col-3 col-lg-2 ms-md-auto  pe-0">
									<span
										className={`btn lf-h-27 lf-w-100 ms-5 mt-md-0 mt-1 p-1 ${
											!info?.is_published ? 'btn-danger' : 'btn-success'
										}`}
										onClick={(e) =>
											this.handleChange(
												'is_published',
												!info?.is_published ? true : false,
											)
										}
										onMouseLeave={this.onBlurSubmit}>
										{!info?.is_published ? 'Unpublished' : 'Published'}
									</span>
								</div>
							)}

							{/* <span className="btn theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">Unpublish</span> */}
						</div>
					</Modal.Header>
					{/* <Modal.Body className="task-model-body py-0 bg-light"> */}
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
									<div className="col-lg-3 pe-0">
										<div className="w-100 board-selector">
											<label className="text-center fs-13">
												{this.siteData.status.label}
											</label>
											<CustomSelect
												placeholder={`${statusbar.text}...`}
												moduleType="status"
												name="board_id"
												onChange={(e) => this.handleChange('board_id', e.value)}
												options={board}
												value={board?.filter(
													(board) => board.value === this.state.info.board_id,
												)}
												// onBlur={this.onBlurSubmit}
											/>
										</div>
									</div>
									<div className=" col-lg-3 pe-0">
										<label>{start_end_date.text}</label>
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
													this.handleChange('start_date', e);
													/* this.setState({
														info: {
															...this.state.info,
															start_date: e
														},
													}); */
												}}
												selected={
													this.state.info.start_date
														? new Date(this.state.info.start_date)
														: null
												}
												onCalendarClose={this.onBlurSubmit}
												isClearable={true}
											/>
										}
									</div>
									<div className=" col-lg-3 pe-0">
										<label>{end_date.text}</label>
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
													this.handleChange('end_date', e);
												}}
												selected={
													this.state.info.end_date
														? new Date(this.state.info.end_date)
														: null
												}
												onCalendarClose={this.onBlurSubmit}
												isClearable={true}
											/>
										}
									</div>
									<div className="col-lg-3 pe-0">
										<div className="task-assignee-selector">
											<label>{assignee_name?.text}</label>
											<CustomSelect
												//styles={{ fontSize: '13px', borderRadius: '8px' }}
												placeholder={`${assignee_name.text}...`}
												name="assigee_id"
												moduleType="taskUsers"
												onChange={(e) =>
													this.handleChange('assigee_id', e.value)
												}
												options={projectUsers}
												value={projectUsers?.filter(
													(ass) => ass.value === this.state.info.assigee_id,
												)}
												// onBlur={this.onBlurSubmit}
											/>
										</div>
									</div>
								</span>
								<div className="row px-2 mt-3">
									<div className=" col-lg-3 pe-0">
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
														this.props.dispatch(
															CreateTaskCategory(
																{
																	user_id: this.userId,
																	project_id: this.project_id,
																	name: e.value,
																},
																(newCategory) => {
																	if (newCategory?.result?._id) {
																		this.handleChange(
																			'category_id',
																			newCategory?.result?._id,
																		);
																	}
																},
															),
														);
													}
													if (fireHandleChange) {
														this.handleChange(
															'category_id',
															e?.value ? e?.value : '',
														);
													}
												}}
												isSearchable={true}
												options={categories}
												value={categories?.filter(
													(board) =>
														board.value === this.state.info.category_id,
												)}
												isClearable={true}
												// onBlur={this.onBlurSubmit}
											/>
										}
									</div>

									<div className="col-lg-3 pe-0">
										<label>{types_of_work?.text}</label>
										<CustomSelect
											placeholder={`${types_of_work.text}...`}
											name="type"
											moduleType="workType"
											onChange={(e) => this.handleChange('type', e.value)}
											options={typeOfWork}
											value={typeOfWork?.filter(
												(work) => work?.value === this.state.info.type,
											)}
											// onBlur={this.onBlurSubmit}
											required
										/>
									</div>
									<div className="col-lg-3 pe-0">
										<label htmlFor="Sheet" className="col-3">
											{sheets_n.text}
										</label>
										<CustomSelect
											type="Creatable"
											controlShouldRenderValue={true}
											placeholder={`${sheets_name.text}...`}
											name="plan_id"
											moduleType="sheet"
											onChange={(e) => this.handleChange('plan_id', e?.value)}
											options={sheetInfo}
											value={sheetInfo?.filter(
												(sheet) => sheet.value === this.state.info.plan_id,
											)}
											isDisabled={!!this.props?.plan_id}
											isClearable={true}
											// onBlur={this.onBlurSubmit}
										/>
									</div>
									<div className="col-lg-3 pe-0">
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
															this.props.dispatch(
																createlocation(
																	{
																		user_id: this.userId,
																		project_id: this.project_id,
																		name: e.value,
																	},
																	(lData) => {
																		this.handleChange('location_id', lData._id);
																	},
																),
															);
														} else {
															this.handleChange('location_id', e?.value);
														}
													}}
													options={location}
													// onBlur={this.onBlurSubmit}
													value={location?.filter(
														(loc) => loc.value === this.state.info?.location_id,
													)}
												/>
											}
										</div>
									</div>
								</div>
								<div className="row px-2 mt-3">
									<div className="col-lg-3 pe-0">
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
													onChange={(e) =>
														this.handleChange('manpower', e.target.value)
													}
													onBlur={this.onBlurSubmit}
													value={this.state.info.manpower}
												/>
											</InputGroup>
										</div>
									</div>
									<div className="col-lg-3 pe-0">
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
													onChange={(e) =>
														this.handleChange('cost', e.target.value)
													}
													onBlur={this.onBlurSubmit}
													value={this.state.info.cost}
												/>
											</InputGroup>
										</div>
									</div>
									<div className="col-lg-3 pe-0">
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
														Array.isArray(this.props?.task?.taskWallList) &&
														this.props?.task?.taskWallList.length > 0
													}
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
											<label>{unit_name.text}</label>
											{
												<CustomSelect
													placeholder="Work Type"
													name="wall_work_type"
													moduleType="wall_work_type"
													isClearable={true}
													disabled={
														Array.isArray(this.props?.task?.taskWallList) &&
														this.props?.task?.taskWallList.length > 0
													}
													onChange={(e) => {
														this.handleChange('wall_work_type', e?.value);
													}}
													options={wallUnit.map((wt) => ({
														label: wt,
														value: wt,
													}))}
													onBlur={this.onBlurSubmit}
													value={wallUnit
														?.map((wt) => ({ label: wt, value: wt }))
														.find(
															(loc) =>
																loc.value === this.state.info?.wall_work_type,
														)}
												/>
											}
										</div>
									</div>
								</div>

								<div className="row px-2 mt-3">
									<div className="col-lg-6 pe-0">
										<label>{watcher?.text}</label>
										<CustomSelect
											placeholder={`${watcher?.text}...`}
											isMulti
											name="watchers"
											className={`task-waters-container`}
											moduleType="users"
											onChange={(e) =>
												this.handleChange(
													'watchers',
													e?.map((w) => w.value),
												)
											}
											options={watcherUsers}
											closeMenuOnSelect={false}
											// onBlur={this.onBlurSubmit}
											value={watcherUsers?.filter((watcher) =>
												this.state.info.watchers?.some(
													(w) => w === watcher.value,
												),
											)}
										/>
									</div>

									<div className=" col-lg-6 pe-0">
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
																	this.props.dispatch(
																		createTag(
																			{
																				user_id: this.userId,
																				project_id: this.project_id,
																				name: val.value,
																			},
																			(newTag) => {
																				if (newTag?.result?._id) {
																					this.handleChange('tags', [
																						...this.state.info.tags,
																						newTag?.result?._id,
																					]);
																				}
																			},
																		),
																	);
																},
															);
															if (fireHandleChange) {
																this.handleChange(
																	'tags',
																	e?.map((t) => t.value),
																);
															}
														}}
														options={tags}
														closeMenuOnSelect={false}
														// onBlur={this.onBlurSubmit}
														value={tags?.filter((tag) =>
															this.state.info.tags?.some(
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

								<div className="row mt-4 ">
									<div className="col-12">
										<Card className="mt-3 p-1 border-0 bg-light">
											<div className="row">
												<div className="fw-bold col-lg-8">
													<label className="p-1"> Issues</label>
												</div>
												<div className="col-4 text-end">
													<span
														onClick={() => this.setState({ relateIssue: true })}
														className="lf-common-btn">
														+ {add?.text}
													</span>
												</div>

												{this.state.relateIssue && (
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
																		this.setState({
																			issueName: e.target.value,
																		})
																	}
																	onKeyPress={(e) => {
																		if (e.key === 'Enter') {
																			this.createIssueHandler();
																		}
																	}}
																	value={this.state.issueName}
																/>
															</div>
														</div>

														<div className="col-1">
															<div className="d-flex justify-content-between">
																<span className={`btn px-0 w-25`}>
																	<i
																		onClick={this.createIssueHandler}
																		style={{
																			color: 'blue',
																			fontSize: '15px',
																		}}
																		className="fas fa-check theme-btnbg theme-secondary"></i>
																</span>
																{` `}
																<span className={`btn px-0 w-25`}>
																	<i
																		onClick={() =>
																			this.setState({
																				relateIssue: false,
																				issueName: '',
																			})
																		}
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

												{this.state.bindedIssues &&
													this.state.bindedIssues.length > 0 && (
														<div className="col-12">
															<Card className="border p-2">
																{this.state.bindedIssues &&
																	this.state.bindedIssues.map((is, bsi) => {
																		return (
																			<div
																				className={`d-flex py-2 ${
																					this.state.bindedIssues.length ==
																					bsi + 1
																						? ''
																						: 'border-bottom'
																				}`}
																				key={bsi + 'bsi'}>
																				<div className="w-100 align-middle">
																					<Link
																						to={`/issues/${this.project_id}/${is?._id}`}
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
											<span className="row">
												<div className=" fw-bold col-lg-8 ">
													<label>{related_task?.text}</label>
												</div>
												<div className="col-lg-4 text-end">
													<span
														onClick={() => {
															this.setState({ relatedT: true });
														}}
														className="py-0">
														{/* <i className={'fas fa-plus-circle theme-color'}></i> */}
														<span className="ms-1 lf-common-btn">
															+ {add?.text}
														</span>
													</span>
												</div>
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
																this.handleChangeRelated('related_task', e)
															}
															options={related}
															closeMenuOnSelect={false}
															value={this.state.relatedTask.related_task}
															onBlur={this.submitRelatedTask}
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
																				href={`/tasks/${this.project_id}/${rt?._id}`}
																				className={`hover-theme-color`}
																				target="_blank">
																				{rt.title}
																			</a>
																		</td>
																		<td className="lf-w-100 align-middle text-end text-nowrap">
																			<span
																				className="pe-3 theme-secondary theme-btnbg lf-link-cursor"
																				onClick={this.handleUnlink.bind(
																					this,
																					rt,
																				)}>
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

															<div className="col-lg-10 px-0">
																<div className="row mx-0">
																	<div className="col-lg-1">
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
																				<span className="checkblank"></span>
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
																	</div>
																	<div className="col-lg-11 px-0">
																		<InputGroup>
																			{this.state.editCheck == tc?._id ? (
																				<FormControl
																					type="text"
																					name="title"
																					autoComplete="off"
																					onBlur={(e) => {
																						const name = e.target.value;
																						this.submitChecklistData({
																							...tc,
																							name,
																						});
																						setTimeout(() => {
																							this.setEditCheck(null);
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
																</div>
															</div>
															<div className="col-lg-2 text-end">
																<i
																	className="fas fa-edit me-3 theme-btnbg theme-secondary lf-text-vertical-align"
																	onClick={(e) =>
																		this.setEditCheck(tc._id)
																	}></i>
																<i
																	className="far fa-trash-alt theme-btnbg theme-secondary lf-text-vertical-align"
																	onClick={() =>
																		sweetAlert(
																			() =>
																				this.props.dispatch(
																					deleteTaskChecklist({
																						task_id: this.task_id,
																						checklist_id: [tc?._id],
																					}),
																				),
																			'Task Checklist',
																		)
																	}></i>
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
																	this.handleChangeChecklist(
																		'title',
																		e.target.value,
																	)
																}
																value={this.state.infoChecklist.title}
																onKeyPress={(e) => {
																	if (e.key === 'Enter') {
																		this.submitTaskChecklist();
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
																			onClick={this.submitTaskChecklist}
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
																				this.setChecklistHiden(false);
																				this.handleChangeChecklist('title', '');
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
															onChange={(e) => {
																this.props.dispatch(
																	useTemplate({
																		task_id: this.task_id,
																		template_id: e.value,
																		user_id: this.userId,
																		project_id: this.project_id,
																	}),
																);
																this.setState({
																	useTemp: false,
																});
															}}
															onBlur={() => this.setChecklistHiden(false)}
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
													onClick={() => this.setChecklistHiden(true)}>
													{/* <i className={'fas fa-plus-circle theme-color'}></i>{' '} */}
													<span className="ms-1 lf-common-btn">
														+ {add_checklist.text}
													</span>
												</span>
												<span className="check-divider theme-secondary"></span>
												<span
													className="py-0 hover-theme-color"
													onClick={() => {
														this.setChecklistHiden(true);
														this.setUseTemplate(true);
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
											userId={this.userId}
											project_id={this.project_id}
											task={this.props}
										/>
									</Tab>
									<Tab eventKey="Comment" id={`task-chat-tab`} title="Comment">
										<div
											className="lf-task-comment ms-0 "
											style={{ overflow: 'hidden', height: '100%' }}>
											<Chat
												chatShow={true}
												wrapperclassName={'lf-chat-internal-component-wrapper'}
												height={this.state.chatHeight}
												room={this.task_id}
												{...this.props}
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
					{/* <Modal.Footer>
						<div className="text-center m-auto text-bold lf-footer-contact-info text-capitalize">
							{created_by.text}{' '}
							<span className="theme-color">
								{
									projectUsers?.filter(
										(ass) => ass.value === task?.createdBy,
									)[0]?.first_name
								}{' '}
								{
									projectUsers?.filter(
										(ass) => ass.value === task?.createdBy,
									)[0]?.last_name
								}
							</span>{' '}
							On{' '}
							<span className="theme-color">
								{moment(task?.createdAt).format('DD-MM-YYYY')}
							</span>
						</div>
					</Modal.Footer> */}
				</Modal>
			</>
		);
	}
}
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
