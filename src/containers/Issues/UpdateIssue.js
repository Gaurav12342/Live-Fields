import { useEffect, useState } from 'react';
// import Nodata from '../../components/nodata';
import {
	Dropdown,
	FormControl,
	InputGroup,
	Modal,
	Tab,
	Tabs,
} from 'react-bootstrap';

import getUserId, {
	getSiteLanguageData,
	issueStatusList,
	sweetAlert,
} from '../../commons';
import Loading from '../../components/loadig';
import Nodata from '../../components/nodata';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import {
	createTag,
	getAllRoleWisePeople,
	getAllTags,
} from '../../store/actions/projects';
import { useParams } from 'react-router';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_TAGS,
	GET_ISSUE_DATA,
	GET_TASK_LIST_BY_BOARD,
} from '../../store/actions/actionType';
import {
	getIssueDetails,
	issueUpdate,
	issueLogs,
} from '../../store/actions/Issues';
import Chat from '../Chat';
import { taskListFilter } from '../../store/actions/Task';

function UpdateIssue(props) {
	const userId = getUserId();
	const { project_id, issue_id } = useParams();
	const dispatch = useDispatch();
	const [popup, setPopup] = useState(true);
	const [issueData, setIssueData] = useState({});
	const [editActive, setEditActive] = useState('');
	const [chatHeight, setChatHeight] = useState('auto');
	const [issueLogsData, setIssueLogs] = useState([]);
	const issueDetails = useSelector((state) => {
		return state?.issues?.[GET_ISSUE_DATA];
	});
	const usersList = useSelector(
		(state) => state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
	);
	const tagsList = useSelector(
		(state) => state?.project?.[GET_ALL_TAGS]?.result || [],
	);
	const taskOptions = useSelector((state) => {
		return state?.task?.[GET_TASK_LIST_BY_BOARD]?.result?.map((ts) => ({
			label: ts.title,
			value: ts._id,
		}));
	});

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

	const getIssueLogs = () => {
		dispatch(
			issueLogs(
				{
					_id: issue_id,
					project_id: project_id,
					user_id: userId,
				},
				(resData) => {
					if (resData.result) {
						setIssueLogs(resData.result);
					} else {
						setIssueLogs([]);
					}
				},
			),
		);
	};

	useEffect(() => {
		dispatch(
			getIssueDetails(
				{ _id: issue_id, project_id, user_id: userId },
				(resData) => {
					setIssueData(resData.result);
				},
			),
		);
		dispatch(getAllRoleWisePeople(project_id));
		dispatch(getAllTags(project_id));

		dispatch(taskListFilter({ project_id, user_id: userId }));
		taskChatHeight();
		getIssueLogs();
	}, [dispatch, project_id]);

	const handleEditElement = (type, closeType = '') => {
		setEditActive(type);
		console.log(type, 'type');
		if (closeType) {
			// handleChange(closeType, props?.task?.[closeType]);
		}
	};

	const handleChange = (name, value) => {
		if (typeof value == 'undefined') value = null;
		setIssueData({
			...issueData,
			[name]: value,
		});
		dispatch(
			issueUpdate(
				{
					_id: issue_id,
					[name]: value,
					project_id,
					user_id: userId,
				},
				(resData) => {
					dispatch(
						getIssueDetails(
							{ _id: issue_id, project_id, user_id: userId },
							(resData) => {
								setIssueData(resData.result);
								taskChatHeight();
								getIssueLogs();
							},
						),
					);
				},
			),
		);
	};
	const projectUsers = [];
	const watcherUsers = [];

	const getOptionLabel = (option) => {
		return `${option?.label?.props?.user?.first_name} ${option?.label?.props?.user?.last_name}`;
	};

	usersList?.forEach((a) => {
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
				label:  <CustomLabelForWatcher user={u}/>,
				/* label: (
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
				), */
				value: u._id,
			});
		});
	});

	const tags = tagsList?.map((tg) => {
		return { label: tg.name, value: tg._id };
	});

	const handleClose = () => {
		if (typeof props.handleClose != 'undefined') {
			props.handleClose();
		}
		setPopup(!popup);
	};

	const taskChatHeight = () => {
		let newchatHeight =
			document.getElementsByClassName('task-info-form')[0].clientHeight -
			110 +
			'px';
		setChatHeight(newchatHeight);
	};

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
	} = getSiteLanguageData('commons');

	const { statusbar, task, created_at } = getSiteLanguageData('task/update');
	
	return (
		<Modal
			size="lg"
			show={popup}
			className="lf-task-info-modal"
			onHide={handleClose}
			animation={false}>
			<Modal.Header closeButton className="bg align-items-start">
				<div className="d-flex align-items-start">
					{/* Color Icon */}
					<div
						className="ms-1 lf-h-40 lf-w-40  lf-br-50 text-uppercase"
						style={{
							backgroundColor: issueData?.color_code,
							padding: '10px 10px 10px 11px',
							color: '#FFF',
							fontWeight: 600,
						}}></div>
					<div className="ms-3 d-inline-block col-9 px-0 col-md-7 col-lg-9">
						<span className="theme-secondary">
							#{issueData?.issue_no} | @
							{issueData?.assigee?.map((a) => {
								return <>{a.first_name}</>;
							})}
						</span>
						<div className="priority-task-info fs-6 lf-link-cursor">
							{editActive === 'title' ? (
								<div className="d-flex align-items-center">
									<FormControl
										as="input"
										onChange={(e) =>
											// handleChange('title', e.target.value)
											setIssueData({
												...issueData,
												title: e.target.value,
											})
										}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												handleChange('title', issueData.title);
												handleEditElement('', 'title');
											}
										}}
										/* onBlur={(e)=>{
											handleChange('title', e.target.value);
										}} */
										value={issueData.title}
									/>
									<div className="ms-3">
										<span
											className="task-inline-save-btn"
											onClick={() => {
												handleChange('title', issueData.title);
												handleEditElement('', 'title');
											}}>
											<i className="fas fa-check"></i>
										</span>
									</div>
									<div className="ms-3">
										<span
											className="task-inline-cancel-btn"
											onClick={() => {
												setIssueData({
													...issueData,
													title: issueDetails.title,
												});
												handleEditElement('', 'title');
											}}>
											<i className="fas fa-times"></i>
										</span>
									</div>
								</div>
							) : (
								<div className="" onClick={() => handleEditElement('title')}>
									<span className="text-break" title={'Edit'}>
										{issueData.title}
									</span>
									<span>
										<i className="ms-2 theme-secondary fs-6 far fa-edit lf-link-cursor"></i>
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</Modal.Header>
			{/* <Modal.Body className="task-model-body py-0 bg-light"> */}
			<Modal.Body className="py-0 px-3">
				<div className="row">
					<div
						className="col-md-7 col-lg-7 task-info-form bg-light pt-3"
						style={{
							maxHeight: '81vh',
							height: '81vh',
							overflow: 'auto',
						}}>
						<div className="row px-2">
							<div className="col-lg-6 pe-0">
								<div className="w-100 board-selector">
									<label className="text-center fs-13">{statusbar.text}</label>
									<CustomSelect
										placeholder={`${statusbar.text}...`}
										moduleType="status"
										name="status_id"
										onChange={(e) => handleChange('status_id', e.value)}
										options={issueStatusList}
										value={issueStatusList?.find(
											(board) => board.value === issueData.status_id,
										)}
										// onBlur={this.onBlurSubmit}
									/>
								</div>
							</div>

							<div className="col-lg-6 pe-0">
								<div className="task-assignee-selector">
									<label>{assignee_name?.text}</label>
									<CustomSelect
										//styles={{ fontSize: '13px', borderRadius: '8px' }}
										placeholder={`${assignee_name?.text}...`}
										name="assigee_id"
										moduleType="taskUsers"
										onChange={(e) => handleChange('assigee_id', e.value)}
										options={projectUsers}
										value={projectUsers?.filter(
											(ass) => ass.value === issueData.assigee_id,
										)}
										// onBlur={this.onBlurSubmit}
									/>
								</div>
							</div>
						</div>
						<div className="row px-2 mt-3">
							{issueData && issueData.createdAt && (
								<div className=" col-lg-6 pe-0">
									<label>{created_at.text}</label>
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
														{issueData?.createdAt
															? `${moment(issueData?.createdAt).format(
																	'DD MMM YYYY',
															  )}`
															: null}
													</span>
												</div>
											}
											disabled
											dateFormat="dd/MM/yyyy"
											selected={new Date(issueData.createdAt)}
										/>
									}
								</div>
							)}

							<div className=" col-lg-6 pe-0">
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
													{issueData?.end_date
														? `${moment(issueData?.end_date).format(
																'DD MMM YYYY',
														  )}`
														: null}
												</span>
											</div>
										}
										minDate={moment(new Date()).toDate()}
										dateFormat="dd/MM/yyyy"
										onChange={(e) => {
											handleChange('end_date', e);
										}}
										selected={
											issueData.end_date ? new Date(issueData.end_date) : null
										}
										// onCalendarClose={this.onBlurSubmit}
										isClearable={true}
									/>
								}
							</div>

						</div>

						<div className="row px-2 mt-3">
							<div className="col-lg-12 pe-0">
								<label className="text-center fs-13">{task.text}</label>
								<CustomSelect
									placeholder={`${task.text}...`}
									moduleType="status"
									name="status_id"
									onChange={(e) => handleChange('task_id', e.value)}
									options={taskOptions}
									value={taskOptions?.find(
										(board) => board.value === issueData.task_id,
									)}
									// onBlur={this.onBlurSubmit}
								/>
							</div>
						</div>

						<div className="row px-2 mt-3">
							<div className="col-lg-6 pe-0">
								<label>{watcher?.text}</label>
								<CustomSelect
									placeholder="Watcher..."
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
										issueData.watchers?.some((w) => w === watcher.value),
									)}
									getOptionLabel={getOptionLabel}
									isSearchable={true}
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
												placeholder="Tag..."
												name="tags"
												moduleType="tags"
												onChange={(e) => {
													let fireHandleChange = true;
													e.filter((val) => val.__isNew__).forEach((val) => {
														fireHandleChange = false;
														dispatch(
															createTag(
																{
																	user_id: userId,
																	project_id: project_id,
																	name: val.value,
																},
																(newTag) => {
																	if (newTag?.result?._id) {
																		handleChange('tags', [
																			...issueData.tags,
																			newTag?.result?._id,
																		]);
																	}
																},
															),
														);
													});
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
													issueData.tags?.some((t) => t === tag.value),
												)}
											/>
										</span>
									}
								</InputGroup>
							</div>

						</div>




					</div>
					<div
						className="col-md-5 col-lg-5 task-insert-data border-start px-0"
						style={{
							maxHeight: '81vh',
							height: '81vh',
							overflow: 'auto',
						}}>
						<Tabs
							defaultActiveKey="Comment"
							id="uncontrolled-tab-example"
							className="text-secondary h5 task-chat-nav"
							style={{
								boxShadow:
									'0 1px 2px RGBA(0,0,0,0.1),0 -1px RGBA(0,0,0,0.1) inset,0 2px 1px -1px rgba(255, 255, 255, 0.5) inset',
							}}
							fill>
							<Tab eventKey="Comment" id={`issue-chat-tab`} title="Comment">
								<div
									className="lf-task-comment ms-0 "
									style={{ overflow: 'hidden', height: '100%' }}>
									<Chat
										chatShow={true}
										wrapperclassName={'lf-chat-internal-component-wrapper'}
										height={chatHeight}
										room={issue_id}
										{...props}
										chat_from={'task'}
										mode="component"
										title={'Comment ..'}
									/>
								</div>
							</Tab>
							<Tab eventKey="History" title="Logs">
								<div className="load-more-container-500 lf-h-500">
									{typeof issueLogsData != 'undefined' &&
										issueLogsData?.map((r) => {
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
																		{log?.user?.[0]?.first_name}{' '}
																		{log?.user?.[0]?.last_name}
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
	);
}

export default UpdateIssue;
