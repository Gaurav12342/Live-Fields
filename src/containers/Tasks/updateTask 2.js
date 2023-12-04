import { Component } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Container,
	Col,
	Row,
	Card,
} from 'react-bootstrap';

import React from 'react';
import {
	getSingleTask,
	getBoardList,
	GetCategoryList,
	getLocationList,
	updateTask,
	taskComment,
	createTaskChecklist,
	getTaskChecklist,
	deleteTaskChecklist,
	updateTaskChecklist,
	addRelatedTask,
	createlocation,
} from '../../store/actions/Task';
import { connect } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	createTag,
	getAllRoleWisePeople,
	getAllSheets,
	getAllTags,
} from '../../store/actions/projects';
import CreatePlan from './createPlan';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_SHEETS,
	GET_ALL_TAGS,
	GET_ALL_TASK_BOARD_LIST,
	GET_CATEGORY_LIST,
	GET_LOCATION_LIST,
	GET_SINGLE_TASK,
	GET_TASK_CHECKLIST,
} from '../../store/actions/actionType';
import moment from 'moment';
import AddRelatedTask from './addRelatedtask';
import Location from '../../components/location';
import CustomSelect from '../../components/SelectBox';
import Chat from '../Chat';
import DatePicker from 'react-datepicker';
import Creatable from 'react-select/creatable';
import withRouter from '../../components/withrouter';

class UpdateTask extends Component {
	constructor(props) {
		super(props);
		this.userId = getUserId();
		this.task_id = props?.data?._id;
		this.start_date = moment(props?.data?.start_date).format('YYYY-MM-DD');
		this.end_date = moment(props?.data?.end_date).format('YYYY-MM-DD');
		this.project_id = this.props.router?.params.project_id;
		this.state = {
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				task_id: this.task_id,
				title: props?.data?.title,
				location_id: props?.data?.location_id,
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
		};
	}

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
	}

	componentDidUpdate(prevProps, prevState) {
		const { task } = this.props;
		if (task !== prevProps.task) {
			if (!!task?._id) {
				this.setState({
					info: {
						user_id: this.userId,
						project_id: this.project_id,
						task_id: this.task_id,
						title: task?.title,
						location_id: task?.location_id,
						plan_id: task?.plan_id,
						board_id: task?.board_id,
						type: task?.type,
						category_id: task?.category_id,
						assigee_id: task?.assigee_id,
						members_id: task?.members_id,
						watchers: task?.watchers,
						tags: task?.tags,
						cost: task?.cost,
						start_date: this.start_date,
						end_date: this.end_date,
						manpower: task?.manpower,
						is_published: task?.is_published,
					},
				});
			}
		}
	}

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
		e.preventDefault();
		this.props.dispatch(createTaskChecklist(this.state.infoChecklist));
	};
	submitTask = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(
			updateTask(this.state.info, false, this.props.task_view_type),
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
		this.setState({ info });
	};
	handleChange = (name, value) => {
		this.setInfo({
			...this.state.info,
			[name]: value,
		});
	};

	handleEditElement = (type) => {
		this.setState({
			editActive: type,
		});
	};

	onBlurSubmit = () => {
		this.props.dispatch(
			updateTask(this.state.info, false, this.props.task_view_type),
		);
		this.handleEditElement('');
	};

	render() {
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
		} = this.props;
		const { editActive, info } = this.state;
		const projectUsers = [];
		assignee?.forEach((a) => {
			(a?.users).forEach((u) => {
				projectUsers.push({ label: u.first_name, value: u._id });
			});
		});
		const watcherUsers = [];
		assignee?.forEach((a) => {
			(a?.users).forEach((u) => {
				watcherUsers.push({
					label: u.first_name,
					value: u._id,
					profile: u?.profile,
				});
			});
		});
		const sheetInfo = [];
		sheets?.forEach((a) => {
			(a?.plans).forEach((s) => {
				sheetInfo.push({ label: s.name, value: s._id, url: s.file });
			});
		});
		const tags = tag?.map((tg) => {
			return { label: tg.name, value: tg._id };
		});
		const location = taskLocation?.map((tl) => {
			return { label: tl.name, value: tl._id };
		});
		const categories = category?.map((c) => {
			return { label: c.name, value: c._id };
		});
		const board = boardList?.map((b) => {
			return { label: b.name, value: b._id, ...b };
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
		if (!task) {
			return 'loading ....';
		}

		const selectedBoard = board?.filter(
			(board) => board.value === this.state.info.board_id,
		)[0];

		const {
			unpublish,
			publish,
			watcher,
			assignee_name,
			location_name,
			types_of_work,
			manpower_unit,
			cost,
			sheets_name,
		} = getSiteLanguageData('commons');
		const {
			statusbar,
			start_end_date,
			category: TaskCategory,
			related_task,
			comments,
		} = getSiteLanguageData('task/update');
		const { tags: TaskTags } = getSiteLanguageData('sheet/toolbar');
		const { new_template } = getSiteLanguageData('project_tamplate');

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
					size="xl"
					show={this.state.show}
					className="lf-task-info-modal"
					onHide={this.handleClose}
					animation={false}>
					<Modal.Header closeButton>
						{/* <Modal.Title>Update Task</Modal.Title> */}
						<div className="ms-2 mt-2 fw-90">
							<div
								className="task-img-size task-img  d-inline-block font-weight-bold"
								style={{ backgroundColor: selectedBoard?.color_code }}></div>
							<div className="priority-task-info d-inline-block">
								#{task.task_no}|@
								{task?.assigee?.map((a) => {
									return <>{a.first_name}</>;
								})}
								<div
									className="priority-task-info text-bold theme-secondary  fs-5 "
									onClick={() => this.handleEditElement('title')}>
									{editActive === 'title' ? (
										<textarea
											onChange={(e) =>
												this.handleChange('title', e.target.value)
											}
											value={info.title}
											onBlur={this.onBlurSubmit}
										/>
									) : (
										<span className="lf-text-overflow-420">{info.title}</span>
									)}
								</div>
							</div>
							<label className="switch">
								<input
									type="checkbox"
									id="togBtn"
									checked={info?.is_published}
								/>
								<div className="slider round">
									<span className="on">{publish.text}</span>
									<span className="off">{unpublish.text}</span>
								</div>
							</label>
							{/* <label className="switch">
                                {info?.is_published === true ?
                                    <span className="btn lf-main-button p-1 ms-2" value={true} onClick={''}>Publish
                                    </span>
                                    :
                                    <span className="btn lf-main-button p-1 ms-2" value={false} onClick={''}>Unpublish
                                    </span>
                                }
                            </label> */}
							{/* <span className="btn theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">Unpublish</span> */}
						</div>
					</Modal.Header>
					<Modal.Body>
						<div className="row">
							<div className="col-8">
								<div className="row">
									<div className="col-2">
										{editActive === 'status' ? (
											<CustomSelect
												placeholder={`${statusbar.text}...`}
												name="board_id"
												onChange={(e) => {
													this.handleChange('board_id', e.value);
													this.onBlurSubmit();
												}}
												options={board}
												value={selectedBoard}
											/>
										) : (
											<div
												className="fw-bolder lf-task-border-kanban p-2"
												style={{ backgroundColor: selectedBoard?.color_code }}
												onClick={() => this.handleEditElement('status')}>
												{selectedBoard?.name}
											</div>
										)}
									</div>
									<div className="col-3">
										{editActive === 'watcher' ? (
											<CustomSelect
												placeholder={`${watcher.text}...`}
												isMulti
												name="watchers"
												onChange={(e) =>
													this.handleChange(
														'watchers',
														e?.map((w) => w.value),
													)
												}
												options={watcherUsers}
												closeMenuOnSelect={false}
												onBlur={this.onBlurSubmit}
												value={watcherUsers?.filter((watcher) =>
													this.state.info.watchers?.some(
														(w) => w === watcher.value,
													),
												)}
											/>
										) : (
											<div
												className="lf-user-wrapper"
												onClick={() => this.handleEditElement('watcher')}>
												{watcherUsers
													?.filter((watcher) =>
														this.state.info.watchers?.some(
															(w) => w === watcher.value,
														),
													)
													?.map((ass) => {
														return (
															<img
																title={ass.label}
																src={ass.profile}
																className="lf-user-wrapper-item"
															/>
														);
													})}
											</div>
										)}
									</div>
									<div className="col-3">
										{editActive === 'tags' ? (
											<Creatable
												isClearable
												isMulti
												placeholder={`${TaskTags.text}...`}
												name="tags"
												onChange={(e) => {
													e.forEach((val) => {
														if (val.__isNew__) {
															this.props.dispatch(
																createTag({
																	user_id: this.userId,
																	project_id: this.project_id,
																	name: val.value,
																}),
															);
														}
													});
													this.handleChange(
														'tags',
														e?.map((t) => t.value),
													);
												}}
												options={tags}
												closeMenuOnSelect={false}
												value={tags?.filter((tag) =>
													this.state.info.tags?.some((t) => t === tag.value),
												)}
											/>
										) : (
											<span
												className="card fw-bolder d-inline-block p-2 lf-word-break-all lf-load-more-attechment"
												onClick={() => this.handleEditElement('tags')}>
												{tags
													?.filter((tag) =>
														this.state.info.tags?.some((t) => t === tag.value),
													)
													?.map((ass) => (
														<span className="border m-1">{ass.label}</span>
													))}
											</span>
										)}
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<span className="form-group row ">
											<Form.Label className=" col-3">
												{assignee_name.text}
											</Form.Label>
											{editActive === 'assignee' ? (
												<span className="col-8">
													<CustomSelect
														placeholder={`${assignee_name.text}...`}
														name="assigee_id"
														onChange={(e) =>
															this.handleChange('assigee_id', e.value)
														}
														options={projectUsers}
														value={projectUsers?.filter(
															(ass) => ass.value === this.state.info.assigee_id,
														)}
													/>
												</span>
											) : (
												<span
													className="fw-bolder lf-task-border-kanban p-2 mb-2 col-8 "
													onClick={() => this.handleEditElement('assignee')}>
													{projectUsers
														?.filter(
															(ass) => ass.value === this.state.info.assigee_id,
														)
														.map((ass) => {
															return ass.label;
														})}
												</span>
											)}
										</span>

										<span className="form-group row ">
											<Form.Label className=" col-3">
												{location_name.text}
											</Form.Label>
											{editActive === 'location' ? (
												<span className="col-8">
													<Creatable
														placeholder={`${location_name.text}...`}
														name="location_id"
														onChange={(e) => {
															if (e.__isNew__) {
																this.props.dispatch(
																	createlocation({
																		user_id: this.userId,
																		project_id: this.project_id,
																		name: e.value,
																	}),
																);
															}
															this.handleChange('location_id', e.value);
														}}
														options={location}
														value={location?.filter(
															(loc) =>
																loc.value === this.state.info.location_id,
														)}
													/>
												</span>
											) : (
												<span
													className="fw-bolder lf-task-border-kanban p-2 mb-2 col-8"
													onClick={() => this.handleEditElement('location')}>
													{location
														?.filter(
															(lc) => lc.value === this.state.info.location_id,
														)
														.map((ass) => {
															return ass?.label;
														})}
												</span>
											)}
										</span>
										<span className="form-group row">
											<Form.Label htmlFor="Manpower" className="col-3">
												{start_end_date.text}
											</Form.Label>
											<span className="col-8">
												{editActive === 'start_date' ? (
													<DatePicker
														customInput={
															<FormControl className="lf-formcontrol-height" />
														}
														name="start_date"
														selected={moment(
															this.state.info.start_date,
														).toDate()}
														dateFormat="dd-MM-yyyy"
														placeholderText="Start Date"
														onChange={(e) =>
															this.handleChange(
																'start_date',
																moment(e).format('YYYY-MM-DD'),
															)
														}
														minDate={moment(
															this.state.info.start_date,
														).toDate()}
													/>
												) : (
													<span
														className="fw-bolder lf-task-border-kanban p-2 mb-2 col-11"
														onClick={() =>
															this.handleEditElement('start_date')
														}>
														{this.state.info?.start_date}
													</span>
												)}
												{editActive === 'end_date' ? (
													<DatePicker
														customInput={
															<FormControl className="lf-formcontrol-height" />
														}
														name="end_date"
														dateFormat="dd-MM-yyyy"
														// selected={new Date()}
														selected={moment(this.state.info.end_date).toDate()}
														placeholderText="End Date"
														onChange={(e) =>
															this.handleChange(
																'end_date',
																moment(e).format('YYYY-MM-DD'),
															)
														}
														minDate={moment(
															this.state.info.start_date,
														).toDate()}
													/>
												) : (
													<span
														className="fw-bolder lf-task-border-kanban p-2 mb-2 col-11"
														onClick={() => this.handleEditElement('end_date')}>
														{this.state.info?.end_date}
													</span>
												)}
											</span>
										</span>

										<span className="form-group row">
											<Form.Label className=" col-3">
												{TaskCategory.text}
											</Form.Label>
											{editActive === 'category' ? (
												<span className="col-8">
													<CustomSelect
														placeholder={`${TaskCategory.text}...`}
														name="category_id"
														onChange={(e) =>
															this.handleChange('category_id', e.value)
														}
														options={categories}
														value={categories?.filter(
															(board) =>
																board.value === this.state.info.category_id,
														)}
													/>
												</span>
											) : (
												<span
													className="fw-bolder lf-task-border-kanban p-2 mb-2 col-8"
													onClick={() => this.handleEditElement('category')}>
													{categories
														?.filter(
															(board) =>
																board.value === this.state.info.category_id,
														)
														.map((ass) => {
															return ass.label;
														})}
												</span>
											)}
										</span>
										<span className="form-group row">
											<Form.Label className=" col-3">
												{types_of_work.text}
											</Form.Label>
											{editActive === 'type_of_work' ? (
												<span className="col-8">
													<CustomSelect
														placeholder={`${types_of_work.text}...`}
														name="type"
														onChange={(e) => this.handleChange('type', e.value)}
														options={typeOfWork}
														value={typeOfWork?.filter(
															(work) => work?.value === this.state.info.type,
														)}
														required
													/>
												</span>
											) : (
												<span
													className="fw-bolder lf-task-border-kanban p-2 mb-2 col-8"
													onClick={() =>
														this.handleEditElement('type_of_work')
													}>
													{typeOfWork
														?.filter(
															(ass) => ass.value === this.state.info.type,
														)
														.map((ass) => {
															return ass.label;
														})}
												</span>
											)}
										</span>

										<span className="form-group row">
											<Form.Label htmlFor="Manpower" className="col-3">
												{manpower_unit.text}
											</Form.Label>
											<span className="col-8">
												<InputGroup className="mb-2">
													{editActive === 'manpower' ? (
														<FormControl
															className="lf-formcontrol-height"
															aria-label="Recipient's Manpower"
															type="number"
															name="manpower"
															pattern="[0-9]"
															onChange={(e) =>
																this.handleChange('manpower', e.target.value)
															}
															value={this.state.info.manpower}
														/>
													) : (
														<span
															className="fw-bolder lf-task-border-kanban p-2 mb-2 col-11"
															onClick={() =>
																this.handleEditElement('manpower')
															}>
															{this.state.info.manpower}
														</span>
													)}
												</InputGroup>
											</span>
										</span>
										<span className="form-group row">
											<Form.Label htmlFor="Cost" className="col-3">
												{cost.text}
											</Form.Label>
											<span className="col-8">
												<InputGroup className="mb-2">
													{editActive === 'cost' ? (
														<FormControl
															className="lf-formcontrol-height"
															aria-label="Recipient's Cost"
															type="number"
															name="cost"
															pattern="[0-9]"
															onChange={(e) =>
																this.handleChange('cost', e.target.value)
															}
															value={this.state.info.cost}
														/>
													) : (
														<span
															className="fw-bolder lf-task-border-kanban p-2 mb-2 col-11"
															onClick={() => this.handleEditElement('cost')}>
															{this.state.info.cost}
														</span>
													)}
												</InputGroup>
											</span>
										</span>
										<span className="form-group row">
											<Form.Label htmlFor="Cost" className="col-3">
												{sheets_name.text}
											</Form.Label>
											<span className="col-9">
												<InputGroup className="mb-2 lf-formcontrol-height">
													{editActive === 'sheet' ? (
														<span className="col-10">
															{/* <CreatePlan >
                                                                            <span className="theme-color float-end theme-link-hover lf-link-cursor">+ create plan</span>
                                                                        </CreatePlan> */}
															<i
																className="fas fa-users"
																style={{
																	padding: '13px 3px',
																	borderRadius: '8px 0px 0px 8px',
																	color: '#A1A5B7',
																	background: '#E9E9E9',
																	margin: 0,
																}}></i>
															<CustomSelect
																placeholder={`${sheets_name.text}...`}
																name="plan_id"
																onChange={(e) =>
																	this.handleChange('plan_id', e.value)
																}
																options={sheetInfo}
																value={sheetInfo?.filter(
																	(sheet) =>
																		sheet.value === this.state.info.plan_id,
																)}
																isDisabled={!!this.props?.plan_id}
															/>
														</span>
													) : (
														<span
															className="fw-bolder lf-task-border-kanban p-2 mb-2"
															onClick={() => this.handleEditElement('sheet')}>
															{sheetInfo
																?.filter(
																	(ass) =>
																		ass.value === this.state.info.plan_id,
																)
																.map((ass) => {
																	return ass.label;
																})}
														</span>
													)}
												</InputGroup>
											</span>
										</span>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<Card className="mt-2 p-1">
											<span className="row">
												<div className="form-group col-lg-8">
													<Form.Label>Checklist</Form.Label>
													<InputGroup className="mb-1">
														<FormControl
															placeholder="Enter Name"
															type="text"
															name="title"
															onChange={(e) =>
																this.handleChangeChecklist(
																	'title',
																	e.target.value,
																)
															}
															value={this.state.infoChecklist.title}
															// required
														/>
													</InputGroup>
												</div>
												<div className="col-lg-4">
													<span
														onClick={this.submitTaskChecklist}
														className="lf-check-btn theme-btn btn theme-secondary">
														{new_template.text}
													</span>
												</div>
											</span>

											<Card className="load-more-container-180">
												{taskChecklist?.map((tc) => {
													return (
														<div className="mt-2 p-1 task-checklist-content">
															<span className="col-lg-1 d-inline-block p-1">
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
																						state: 'uncompleted',
																					}),
																				);
																			}}
																			checked
																		/>
																		<span className="checkmark"></span>
																	</label>
																) : tc?.state === 'uncompleted' ? (
																	<label className="checkred ">
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
															</span>

															<span className="col-lg-7 m-1 d-inline-block">
																<InputGroup>
																	{this.state.editCheck == tc?._id ? (
																		<FormControl
																			type="text"
																			name="title"
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
																			<span className="col-lg-7 m-2">
																				{tc?.title}
																			</span>
																		</>
																	)}
																</InputGroup>
															</span>
															<span className="col-lg-4 ">
																<i
																	className="far fa-trash-alt float-end me-3 mt-2 theme-btnbg theme-secondary"
																	onClick={() => {
																		const isConfirmDelete = window.confirm(
																			`are you sure to Delete Task Checklist`,
																		);
																		if (isConfirmDelete) {
																			this.props.dispatch(
																				deleteTaskChecklist({
																					task_id: this.task_id,
																					checklist_id: [tc?._id],
																				}),
																			);
																		}
																	}}></i>
																<i
																	className="fas fa-edit float-end me-3 mt-2 theme-btnbg theme-secondary"
																	onClick={(e) =>
																		this.setEditCheck(tc._id)
																	}></i>
															</span>
														</div>
													);
												})}
											</Card>
										</Card>
									</div>
								</div>
							</div>
							<span className="col-lg-4 task-insert-data mt-1">
								<div className="row">
									<div className="col-6 mt-2 text-start">
										<span className="text-bold">{related_task.text}</span>
									</div>

									<span className="col-6">
										<AddRelatedTask task_id={this.task_id} />
									</span>
								</div>
								<hr />
								<Container className="mt-2">
									<div className="load-more-container">
										<ul className="lf-view-more">
											<li className="">
												{task?.relatedtask?.map((td) => {
													return td?.related_task_data?.map((rt) => {
														return (
															<Row className="bg-white mx-1 mt-1 lf-related-task-row">
																<Col>
																	{' '}
																	<p
																		className="priority-1 ms-2 mt-3"
																		style={{ backgroundColor: 'red' }}></p>
																</Col>
																<Col
																	lg={7}
																	className="text-start p-2 lf-related-task-info">
																	<span className="">{rt.code}</span>
																	<h6 className="text-bold">{rt.title}</h6>
																</Col>
																<Col>
																	{' '}
																	<i
																		className="fas fa-link mt-1 rounded theme-secondary p-2 theme-btnbg"
																		onClick={this.handleUnlink.bind(
																			this,
																			rt,
																		)}></i>
																</Col>
															</Row>
														);
													});
												})}
												{/* {
                                                            tasklink?.map((rt) => {
                                                                return <Row className="bg-white mx-1 mt-1 lf-related-task-row">
                                                                    <Col> <p className="priority-1 ms-2 mt-3" style={{ backgroundColor: "red" }} ></p></Col>
                                                                    <Col lg={7} className="text-start p-2 lf-related-task-info"><span className="">{rt.code}</span>
                                                                        <h6 className="text-bold">{rt.title}</h6></Col>
                                                                    <Col> <i className="fas fa-link mt-1 rounded theme-secondary p-2 theme-btnbg" onClick={this.handleUnlink.bind(this, rt)}></i></Col>
                                                                </Row>
                                                            })
                                                        } */}
											</li>
										</ul>
									</div>
								</Container>

								<div className="related-task-comment text-start p-1 ">
									<h4 className="text-bold">{comments.text}</h4>
								</div>
								<div
									className="lf-task-comment ms-1"
									style={{ overflow: 'hidden', height: '100%' }}>
									<Chat
										chatShow={true}
										wrapperclassName={'lf-chat-internal-component-wrapper'}
										height={'270px'}
										room={this.task_id}
										{...this.props}
										chat_from={'task'}
										mode="component"
										title={`${comments.text}...`}
									/>
								</div>
							</span>
						</div>
						{/* <div className="form-group col-lg-3">
                                                    <Form.Label>Types of Task</Form.Label>
                                                    <CustomSelect
                                                        name="is_published"
                                                        onChange={(e) => this.handleChange('is_published', e.value)}
                                                        placeholder="Select Type"
                                                        options={typeOfTask}
                                                        value={typeOfTask?.filter(work => work?.value === this.state.info.is_published)}
                                                        required
                                                    />
                                                </div> */}
						{/* <div className="form-group col-lg-3">
                                                    <Form.Label >Status</Form.Label>
                                                    <CustomSelect
                                                        placeholder="Status..."
                                                        name="board_id"
                                                        onChange={(e) => this.handleChange('board_id', e.value)}
                                                        options={board}
                                                        value={board?.filter(board => board.value === this.state.info.board_id)}
                                                    />
                                                </div> */}

						{/* <div className="form-group col-lg-3">
                                                    <Form.Label>Types of Work</Form.Label>
                                                    <CustomSelect
                                                        placeholder="Select Type..."
                                                        name="type"
                                                        onChange={(e) => this.handleChange('type', e.value)}
                                                        options={typeOfWork}
                                                        value={typeOfWork?.filter(work => work?.value === this.state.info.type)}
                                                        required
                                                    />
                                                </div> */}

						{/* <div className="form-group col-lg-2 ">
                                                    <Form.Label htmlFor="Manpower" className="ms-1">Start Date</Form.Label>
                                                    <DatePicker
                                                        customInput={<FormControl className="lf-formcontrol-height" />}
                                                        name="start_date"
                                                        selected={moment(this.state.info.start_date).toDate()}
                                                        dateFormat="dd-MM-yyyy"
                                                        placeholderText="Start Date"
                                                        onChange={(e) => this.handleChange('start_date', moment(e).format('YYYY-MM-DD'))}
                                                        minDate={moment(this.state.info.start_date).toDate()}
                                                    />
                                                </div> */}
						{/* <div className="form-group col-lg-2">
                                                    <Form.Label htmlFor="Manpower" className="ms-1">End Date</Form.Label>
                                                    <DatePicker
                                                        customInput={<FormControl className="lf-formcontrol-height" />}
                                                        name="end_date"
                                                        dateFormat="dd-MM-yyyy"
                                                        // selected={new Date()}
                                                        selected={moment(this.state.info.end_date).toDate()}
                                                        placeholderText="End Date"
                                                        onChange={(e) => this.handleChange('end_date', moment(e).format('YYYY-MM-DD'))}
                                                        minDate={moment(this.state.info.start_date).toDate()}
                                                    />
                                                </div> */}
						{/* <div className="form-group col-lg-3">
                                                    <Form.Label>Types of Work</Form.Label>
                                                    <CustomSelect
                                                        placeholder="Select Type..."
                                                        name="type"
                                                        onChange={(e) => this.handleChange('type', e.value)}
                                                        options={typeOfWork}
                                                        value={typeOfWork?.filter(work => work?.value === this.state.info.type)}
                                                        required
                                                    />
                                                </div> */}
						{/* <div className="form-group col-lg-4 ">
                                                        <Form.Label htmlFor="Manpower" className="ms-1">Manpower</Form.Label>
                                                        <InputGroup className="mb-2">
                                                            <FormControl className="lf-formcontrol-height"
                                                                aria-label="Recipient's Manpower"
                                                                type="number"
                                                                name="manpower"
                                                                pattern="[0-9]"
                                                                onChange={(e) => this.handleChange('manpower', e.target.value)}
                                                                value={this.state.info.manpower}
                                                            />
                                                        </InputGroup>
                                                    </div> */}
						{/* <div className="form-group col-lg-4">
                                                        <Form.Label htmlFor="Cost" className="ms-1">Cost</Form.Label>
                                                        <InputGroup className="mb-2">
                                                            <FormControl className="lf-formcontrol-height"
                                                                aria-label="Recipient's Cost"
                                                                type="number"
                                                                name="cost"
                                                                pattern="[0-9]"
                                                                onChange={(e) => this.handleChange('cost', e.target.value)}
                                                                value={this.state.info.cost}
                                                            />
                                                        </InputGroup>
                                                    </div> */}
						{/* <div className="form-group col-lg-4">
                                                    <Form.Label>Sheets</Form.Label>
                                                    <CreatePlan >
                                                        <span className="theme-color float-end theme-link-hover lf-link-cursor">+ create plan</span>
                                                    </CreatePlan>
                                                    <CustomSelect
                                                        placeholder="Sheets..."
                                                        name="plan_id"
                                                        onChange={(e) => this.handleChange('plan_id', e.value)}
                                                        options={sheetInfo}
                                                        value={sheetInfo?.filter(sheet => sheet.value === this.state.info.plan_id)}
                                                        isDisabled={!!this.props?.plan_id}
                                                    />
                                                </div> */}
						{/* <div className="form-group col-lg-4">
                                                    <Form.Label>Watcher</Form.Label>
                                                    <CustomSelect
                                                        placeholder="Watcher..."
                                                        isMulti
                                                        name="watchers"
                                                        onChange={(e) => this.handleChange('watchers', e?.map(w => w.value))}
                                                        options={watcherUsers}
                                                        closeMenuOnSelect={false}
                                                        value={watcherUsers?.filter(watcher => this.state.info.watchers?.some(w => w === watcher.value))}
                                                    />
                                                </div> */}
						{/* <div className="form-group col-lg-4">
                                                    <Form.Label>Tags</Form.Label>
                                                    <CustomSelect
                                                        isClearable
                                                        isMulti
                                                        placeholder="Tag..."
                                                        name="tags"
                                                        onChange={(e) => this.handleChange('tags', e?.map(t => t.value))}
                                                        options={tags}
                                                        closeMenuOnSelect={false}
                                                        value={tags?.filter(tag => this.state.info.tags?.some(t => t === tag.value))}
                                                    />
                                                </div> */}
					</Modal.Body>
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
		};
	})(UpdateTask),
);
