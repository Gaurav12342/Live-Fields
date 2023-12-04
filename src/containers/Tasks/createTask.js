import { Component } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Popover,
} from 'react-bootstrap';

import React from 'react';
import {
	createlocation,
	createTask,
	getBoardList,
	GetCategoryList,
	getLocationList,
} from '../../store/actions/Task';
import { connect } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {
	createTag,
	getAllRoleWisePeople,
	getAllSheets,
	getAllTags,
} from '../../store/actions/projects';
import CreatePlan from '../Sheets/Components/createPlan';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_SHEETS,
	GET_ALL_TAGS,
	GET_ALL_TASK_BOARD_LIST,
	GET_CATEGORY_LIST,
	GET_LOCATION_LIST,
} from '../../store/actions/actionType';
import CustomSelect from '../../components/SelectBox';
import Location from '../../components/location';
import Creatable from 'react-select/creatable';
import withRouter from '../../components/withrouter';
const userId = getUserId();

class CreateTask extends Component {
	constructor(props) {
		super(props);
		const sheettask = { label: props?.name, value: props?.plan_id };
		this.project_id = this.props.router?.params.project_id;
		this.state = {
			dateRange: ['', ''],
			info: {
				user_id: userId,
				project_id: this.project_id,
				title: '',
				board_id: '60f29b1e39a731803e8c4cf2',
				location_id: '',
				plan_id: props.plan_id ? sheettask : '',
				type: 'planned',
				category_id: '',
				assigee_id: userId,
				members_id: [],
				watchers: [],
				tags: [],
				cost: '',
				start_date: '',
				end_date: '',
				manpower: '',
				is_published: true,
			},
			show: false,
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getAllTags(this.project_id));
		dispatch(getBoardList(this.project_id, userId));
		dispatch(getAllRoleWisePeople(this.project_id));
		dispatch(GetCategoryList(this.project_id, userId));
		dispatch(getLocationList(this.project_id, userId));
		dispatch(getAllSheets(this.project_id));
	}

	handleShow = () => {
		this.setState({ show: true });
	};
	handleClose = () => {
		this.setState({
			dateRange: [null, null],
			info: {
				user_id: userId,
				project_id: this.project_id,
				title: '',
				board_id: '60f29b1e39a731803e8c4cf2',
				location_id: '',
				plan_id: '',
				type: 'planned',
				category_id: '',
				assigee_id: userId,
				members_id: [],
				watchers: [],
				tags: [],
				cost: '',
				start_date: '',
				end_date: '',
				manpower: '',
				is_published: true,
			},
		});
		this.setState({ show: false });
		if (this.props.handleClose) {
			this.props.handleClose();
		}
	};

	submitTask = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(
			createTask(
				{
					...this.state.info,
					start_date: this.state.dateRange[0]
						? moment(this.state.dateRange[0]).format('YYYY-MM-DD')
						: null,
					end_date: this.state.dateRange[1]
						? moment(this.state.dateRange[1]).format('YYYY-MM-DD')
						: null,
					category_id: this.state.info.category_id.value,
					plan_id: this.state.info.plan_id.value,
					location_id: this.state.info.location_id.value,
					watchers: (this.state.info?.watchers).map((e) => {
						return e.value;
					}),
					tags: (this.state.info?.tags).map((t) => {
						return t.value;
					}),
				},
				this.props.plan_id ? true : false,
				this.props.task_view_type,
			),
		);
	};
	setDateRange = (dateRange) => {
		this.setState({ dateRange });
	};
	setInfo = (info) => {
		this.setState({ info });
	};
	handleChangeInfo = (name, value) => {
		this.setInfo({
			...this.state.info,
			[name]: value,
		});
	};

	render() {
		const { boardList, assignee, category, taskLocation, tag, sheets } =
			this.props;
		const [startDate, endDate] = this.state.dateRange;
		const projectUsers = [];
		assignee?.forEach((a) => {
			(a?.users).forEach((u) => {
				projectUsers.push({ label: u.first_name, value: u._id });
			});
		});
		const watcherUsers = [];
		assignee?.forEach((a) => {
			(a?.users).forEach((u) => {
				watcherUsers.push({ label: u.first_name, value: u._id });
			});
		});
		const sheetInfo = [];
		sheets?.forEach((a) => {
			(a?.plans).forEach((s) => {
				sheetInfo.push({ label: s.name, value: s._id });
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
			return { label: b.name, value: b._id };
		});
		const brandColor = '#f97316';
		const customStyles = {
			control: (base, state) => ({
				...base,
				borderRadius: 'none',
				boxShadow: state.isFocused ? 0 : 0,
				borderColor: state.isFocused ? brandColor : base.borderColor,
				'&:hover': {
					borderColor: state.isFocused ? brandColor : base.borderColor,
				},
			}),
		};
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
		const { new_task_btn, add_task_btn, create_task, title } =
			getSiteLanguageData('task/update');
		const {
			assignee_name,
			category_name,
			types_of_task,
			status_name,
			types_of_work,
			location_name,
			date,
			manpower,
			cost,
			sheets_name,
			watcher,
			tags_name,
			save,
			create_plan,name
		} = getSiteLanguageData('commons');
		return (
			<>
				{this.props?.plan_id == null ? (
					// <span className={this.props.className || "p-1  theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"} onClick={this.handleShow}>+ New Tasks</span>
					<span
						title={'New Task'}
						className={this.props.className || ' lf-link-cursor lf-main-button'}
						style={{ backgroundColor: '#ffe4b0a3' }}
						onClick={this.handleShow}>
						<i className="fas fa-plus px-1"></i>
						{new_task_btn?.text}
					</span>
				) : (
					<span
						className={this.props.className}
						title={'Add Task'}
						onClick={this.handleShow}>
						<i className="fas fa-plus px-1"></i> {add_task_btn?.text}
					</span>
				)}
				<Modal
					className="lf-modal"
					size="xl"
					show={this.state.show}
					onHide={this.handleClose}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{create_task?.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.submitTask}>
							<div className="row">
								<div className="container">
									<Modal.Body>
										<div className="row">
											<span className="col-lg-12">
												<span className="row">
													<div className="form-group col-lg-4">
														<Form.Label className="mb-0">
															{title?.text}
														</Form.Label>
														<InputGroup className="mb-1 ">
															<FormControl
																className="lf-formcontrol-height"
																placeholder={`Enter ${name.text}`}
																type="text"
																name="title"
																autoComplete="none"
																onChange={(e) =>
																	this.handleChangeInfo('title', e.target.value)
																}
																value={this.state.info.title}
																required
															/>
														</InputGroup>
													</div>
													<div className="form-group col-lg-4">
														<Form.Label className="mb-0">
															{assignee_name?.text}
														</Form.Label>
														<CustomSelect
															placeholder={`${assignee_name?.text}...`}
															name="assigee_id"
															onChange={(e) =>
																this.handleChangeInfo('assigee_id', e.value)
															}
															options={projectUsers}
															value={projectUsers?.filter(
																(as) => as.value === this.state.info.assigee_id,
															)}
														/>
													</div>

													<div className="form-group col-lg-4">
														<Form.Label className="mb-0">
															{category_name?.text}
														</Form.Label>
														<CustomSelect
															placeholder={`${category_name?.text}...`}
															name="category_id"
															onChange={(e) =>
																this.handleChangeInfo('category_id', e)
															}
															options={categories}
															value={this.state.info.category_id}
														/>
													</div>
												</span>
												<span className="row">
													<div className="form-group col-lg-3 mt-1">
														<Form.Label className="mb-0">
															{types_of_task?.text}
														</Form.Label>
														<CustomSelect
															name="is_published"
															onChange={(e) =>
																this.handleChangeInfo('is_published', e.value)
															}
															placeholder="Select Type"
															options={typeOfTask}
															value={typeOfTask?.filter(
																(as) =>
																	as.value === this.state.info.is_published,
															)}
															required
														/>
													</div>
													<div className="form-group col-lg-3 mt-1">
														<Form.Label className="mb-0">
															{status_name?.text}
														</Form.Label>
														<CustomSelect
															placeholder={`${status_name?.text}...`}
															name="board_id"
															onChange={(e) =>
																this.handleChangeInfo('board_id', e.value)
															}
															options={board}
															value={board?.filter(
																(as) => as.value === this.state.info.board_id,
															)}
														/>
													</div>

													<div className="form-group col-lg-3 mt-1">
														<Form.Label className="mb-0">
															{types_of_work?.text}
														</Form.Label>
														<CustomSelect
															placeholder={`Select ${types_of_work.text}`}
															name="type"
															onChange={(e) =>
																this.handleChangeInfo('type', e.value)
															}
															options={typeOfWork}
															value={typeOfWork?.filter(
																(as) => as.value === this.state.info.type,
															)}
															required
														/>
													</div>
													<div className="form-group col-lg-3 mt-1">
														<Form.Label className="mb-0">
															{location_name?.text}
														</Form.Label>
														{/* <Location />
														<CustomSelect
															placeholder="Location..."
															name="location_id"
															onChange={(e) => this.handleChangeInfo('location_id', e)}
															options={location}
															value={this.state.info.location_id}
														/> */}
														<Creatable
															placeholder={`${location_name?.text}...`}
															name="location_id"
															onChange={(e) => {
																if (e.__isNew__) {
																	this.props.dispatch(
																		createlocation({
																			user_id: userId,
																			project_id: this.project_id,
																			name: e.value,
																		},(lData)=>{
																			this.handleChangeInfo('location_id', lData._id);
																		}),
																	);
																}else{
																	this.handleChangeInfo('location_id', e);
																}
															}}
															options={location}
															styles={customStyles}
															value={this.state.info.location_id}
														/>
													</div>
												</span>
												<span className="row">
													<div className="form-group col-lg-4 mt-1">
														<Form.Label
															htmlFor="Manpower"
															className="ms-1 mb-0">
															{date?.text}
														</Form.Label>
														<DatePicker
															customInput={
																<FormControl className="lf-formcontrol-height" />
															}
															selectsRange={true}
															startDate={startDate}
															endDate={endDate}
															onChange={(update) => {
																this.setDateRange(update);
															}}
															styles={customStyles}
															isClearable={true}
															// required
														/>
														{/* <DatePicker
															customInput={<FormControl className="lf-formcontrol-height" />}
															name="start_date"
															selected={moment(this.state.info.start_date).toDate()}
															dateFormat="dd-MM-yyyy"
															placeholderText="Start Date"
															onChange={(e) => this.handleChangeInfo('start_date', moment(e).format('YYYY-MM-DD'))}
															minDate={moment().toDate()}
														/> */}
													</div>
													{/* <div className="form-group col-lg-2">
														<Form.Label htmlFor="Manpower" className="ms-1">End Date</Form.Label>
														<DatePicker
															customInput={<FormControl className="lf-formcontrol-height" />}
															name="end_date"
															dateFormat="dd-MM-yyyy"
															selected={moment(this.state.info.end_date).toDate()}
															placeholderText="End Date"
															onChange={(e) => this.handleChangeInfo('end_date', moment(e).format('YYYY-MM-DD'))}
															minDate={moment(this.state.info.start_date).toDate()}
														/>
													</div> */}
													<div className="form-group col-lg-4 mt-1">
														<Form.Label
															htmlFor="Manpower"
															className="ms-1 mb-0">
															{manpower?.text}
														</Form.Label>
														<FormControl
															className="lf-formcontrol-height"
															aria-label="Recipient's Manpower"
															placeholder={manpower?.text}
															type="number"
															name="manpower"
															pattern="[0-9]"
															autoComplete="none"
															onChange={(e) =>
																this.handleChangeInfo(
																	'manpower',
																	e.target.value,
																)
															}
															value={this.state.info.manpower}
														/>
													</div>
													<div className="form-group col-lg-4 mt-1">
														<Form.Label htmlFor="Cost" className="ms-1 mb-0">
															{cost?.text}
														</Form.Label>
														<FormControl
															className="lf-formcontrol-height rounded-0"
															aria-label="Recipient's Cost"
															placeholder={cost?.text}
															type="number"
															name="cost"
															pattern="[0-9]"
															autoComplete="none"
															onChange={(e) =>
																this.handleChangeInfo('cost', e.target.value)
															}
															value={this.state.info.cost}
														/>
													</div>
												</span>
												<span className="row">
													<div className="form-group col-lg-4 mt-1">
														<Form.Label className="mb-0">
															{sheets_name?.text}
														</Form.Label>
														<CreatePlan type="common">
															<span className="theme-color float-end theme-link-hover lf-link-cursor">
																{create_plan?.text}
															</span>
														</CreatePlan>

														<CustomSelect
															placeholder={`${sheets_name.text}...`}
															name="plan_id"
															onChange={(e) =>
																this.handleChangeInfo('plan_id', e)
															}
															options={sheetInfo}
															value={this.state.info.plan_id}
															isDisabled={!!this.props?.plan_id}
														/>
													</div>
													<div className="form-group col-lg-4 mt-1">
														<Form.Label className="mb-0">
															{watcher?.text}
														</Form.Label>
														<CustomSelect
															placeholder={`${watcher?.text}..`}
															isMulti
															name="watchers"
															onChange={(e) =>
																this.handleChangeInfo('watchers', e)
															}
															options={watcherUsers}
															closeMenuOnSelect={false}
															value={this.state.info.watchers}
														/>
													</div>
													<div className="form-group col-lg-4 mt-1">
														<Form.Label className="mb-0">
															{tags_name?.text}
														</Form.Label>
														{/* <CustomSelect
															isClearable
															isMulti
															placeholder="Tag..."
															name="tags"
															onChange={(e) => this.handleChangeInfo('tags', e)}
															options={tags}
															closeMenuOnSelect={false}
															value={this.state.info.tags}
														/> */}
														<Creatable
															isClearable
															isMulti
															placeholder={`${tags_name?.text}...`}
															name="tags"
															onChange={(e) => {
																e.forEach((val) => {
																	if (val.__isNew__) {
																		this.props.dispatch(
																			createTag({
																				user_id: userId,
																				project_id: this.project_id,
																				name: val.value,
																			}),
																		);
																	}
																});
																this.handleChangeInfo('tags', e);
															}}
															options={tags}
															closeMenuOnSelect={false}
															value={this.state.info.tags}
														/>
													</div>
												</span>
											</span>
										</div>
									</Modal.Body>
									<div className="col-sm-12">
										<Button
											type="submit"
											className="btn btn-primary theme-btn btn-block me-3 mb-3 float-end show-verify">
											<i class="fa-solid fa-floppy-disk pe-2"></i>
											{save?.text}
										</Button>
									</div>
									{/* <Modal.Footer> */}
									{/* <Button className="btn theme-btn btn-block"><h4>Payable Amount $ 00.00</h4></Button> */}
									{/* </Modal.Footer> */}
								</div>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}
// export default CreateTask;
export default withRouter(
	connect((state) => {
		// export default connect((state) => {
		return {
			boardList: state?.task?.[GET_ALL_TASK_BOARD_LIST]?.result || [],
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
			category: state?.task?.[GET_CATEGORY_LIST]?.result || [],
			taskLocation: state?.task?.[GET_LOCATION_LIST]?.result || [],
			sheets: state?.project?.[GET_ALL_SHEETS]?.result || [],
			tag: state?.project?.[GET_ALL_TAGS]?.result || [],
		};
	})(CreateTask),
);
