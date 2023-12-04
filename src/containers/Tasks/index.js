import Layout from '../../components/layout';
// import Nodata from '../../components/nodata';
import { Dropdown, Modal } from 'react-bootstrap';
import UpdateTask from './updateTask';
import { useParams } from 'react-router';
import Filter from './filter';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_TASK_LIST_BY_BOARD,
} from '../../store/actions/actionType';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	clearTaskListBoradData,
	createTask,
	deleteTask,
	taskBoardFilter,
	taskKanbanFilter,
	taskListFilter,
} from '../../store/actions/Task';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';
import Nodata from '../../components/nodata';
import TasksListView from './list';
import KanbanTasks from './kanban';
import {
	getAllRoleWisePeople,
	getProjectDetails,
} from '../../store/actions/projects';
import CustomSearch from '../../components/CustomSearch';
import TaskImport from './TaskImport';
import { Link } from 'react-router-dom';
import { getParameterByName } from '../../helper';
import { useNavigate } from 'react-router-dom';
import ExportToCsv from './exportCsv';
import GenerateReport from '../../components/GenerateReport';

const userId = getUserId();

function Tasks() {
	const { project_id, task_id } = useParams();
	const task_view_type = getParameterByName('v') || 'list';
	const Navigate = useNavigate();
	const [sortType, handleSortType] = useState('3');
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const [multiSelect, handleMultiSelect] = useState([]);
	const [selectedTask, handleSelectetdTask] = useState(
		task_id ? { _id: task_id } : {},
	);
	// const [searchString, setSearchString] = useState('');
	const data = useSelector((state) => {
		return state?.task?.[GET_TASK_LIST_BY_BOARD]?.result;
	});
	const [taskDataSelectedType, handleTaskDataSelectedType] =
		useState('All Task');
	const [taskType, setTaskType] = useState('all_task');
	const [importMode, setImportMode] = useState(false);
	
	const [showShareModel, setShowShareModel] = useState(false);
	

	// const [sheetdata, setsheetdata] = useState(
	// 	[
	// 		[
	// 			{ value: 'Name', readOnly: true },
	// 			{ value: 'Category', readOnly: true },
	// 			{ value: 'Type', readOnly: true },
	// 		].concat(new Array(10).fill({ value: '', readOnly: true })),
	// 	].concat(new Array(15)),
	// );

	const [filterData, handleFilterData] = useState({
		status: undefined, // ["id", "id"],
		categories: undefined, // ["id"],
		watchers: undefined, // ["id"],
		plan: undefined, // [],
		tags: undefined, // [],
		assignee: undefined, // "id",
		type: undefined, // "planned",
		start_date: undefined, // "2021-07-17",
		end_date: undefined, // "2021-07-28",
		sort_option: undefined, // "task_alphabetically",
		order_option: undefined, // "ascending",
		is_published: undefined, // false
		is_archived: undefined,
		filter_type: taskType,
	});
	const setSelectetdTask = (task) => {
		handleSelectetdTask(task);
		if (task?._id) {
			Navigate(`/tasks/${project_id}/${task?._id}?v=${task_view_type}`);
		} else {
			Navigate(`/tasks/${project_id}?v=${task_view_type}`);
		}
	};

	const closeImportMode = () => {
		setImportMode(false);
	};

	const hendleShowShereModel = () => {
		setShowShareModel(!showShareModel);
	};

	const manageTaskFilter = (name, value) => {
		handleFilterData({
			...filterData,
			[name]: value !== 'unset' ? value : undefined,
		});
		getTaskData({
			...filterData,
			[name]: value !== 'unset' ? value : undefined,
		});
	};

	const clearTaskFilter = () => {
		handleFilterData({
			status: undefined, // ["id", "id"],
			categories: undefined, // ["id"],
			watchers: undefined, // ["id"],
			plan: undefined, // [],
			tags: undefined, // [],
			assignee: undefined, // "id",
			type: undefined, // "planned",
			start_date: undefined, // "2021-07-17",
			end_date: undefined, // "2021-07-28",
			sort_option: undefined, // "task_alphabetically",
			order_option: undefined, // "ascending",
			is_published: undefined, // false
			is_archived: undefined, // false
			filter_type: taskType,
		});
		getTaskData({
			status: undefined,
			categories: undefined,
			watchers: undefined,
			plan: undefined,
			tags: undefined,
			assignee: undefined,
			type: undefined,
			start_date: undefined,
			end_date: undefined,
			sort_option: undefined,
			order_option: undefined,
			is_published: undefined,
			is_archived: undefined,
			filter_type: taskType,
		});
	};

	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee, project_id, dispatch]);

	const projectUsers = [];
	assignee?.forEach((a) => {
		(a?.users).forEach((u) => {
			projectUsers.push({ label: u.first_name, value: u._id, ...u });
		});
	});

	const getTaskData = (fd = filterData) => {
		if (task_view_type === 'kanban') {
			dispatch(taskKanbanFilter({project_id,user_id: userId,...fd,}),
			);
		} else if (task_view_type === 'board') {
			dispatch(taskBoardFilter({ project_id, user_id: userId, ...fd, }),);
		} else {
			dispatch(taskListFilter({ project_id, user_id: userId, ...fd, }),);
		}
	};
	useEffect(() => {
		if (!data) {
			dispatch(getProjectDetails(project_id, userId));
			getTaskData();
		}
	}, [data, dispatch, importMode]);

	useEffect(() => {
		getTaskData();
	}, [importMode]);

	useEffect(() => {
		if (!selectedTask?._id && task_id) {
			handleSelectetdTask({ _id: task_id });
		}
	}, [task_id]);

	const handleTaskSelect = ({ target: { checked } }, t) => {
		let newArr = [...multiSelect];
		if (checked === true) {
			newArr.push(t._id);
		} else {
			newArr = newArr.filter((d) => d !== t._id);
		}
		handleMultiSelect(newArr);
	};

	const tasks = data?.map((w) => w?.task);
	
	// const searchedUsers = projectUsers?.filter((u) => {
	// 	const first_name = u.first_name?.toLowerCase();
	// 	const last_name = u.last_name?.toLowerCase();
	// 	const suggestionWord = searchString?.toLowerCase();
	// 	return (
	// 		first_name.includes(suggestionWord) ||
	// 		last_name?.includes(suggestionWord) ||
	// 		(first_name + ' ' + last_name)?.includes(suggestionWord) ||
	// 		suggestionWord === ''
	// 	);
	// });

	// const filterOnTaskList = (taskArr) => {
	// 	return taskArr.filter((t) => {
	// 		const title = t.title?.toLowerCase();
	// 		const task_no = t.task_no?.toLowerCase();
	// 		const task_no_with_hash = `#${t.task_no}`;
	// 		const suggestionWord = searchString?.toLowerCase();
	// 		return (
	// 			title?.includes(suggestionWord) ||
	// 			task_no?.includes(suggestionWord) ||
	// 			task_no_with_hash?.includes(suggestionWord)
	// 		);
	// 	});
	// };

	let searchSourceData = [];
	if (['kanban', 'board'].includes(task_view_type)) {
		data?.forEach((tlist) => {
			searchSourceData = searchSourceData.concat(tlist?.task);
		});
	} else {
		searchSourceData = data;
	}

	const {
		btn_create_task,
		btn_kanban,
		btn_list,
		btn_board,
		btn_export,
		btn_import,
		btn_filter,
		all_task,
		my_task,
		unpublished_task,
		task,
		issue,
		sort_task,
		deleteText,
	} = getSiteLanguageData('task/update');
	const { sort_by, action } = getSiteLanguageData('commons');
	const {
		generate_report
	} = getSiteLanguageData('shareFile');

	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];

	const selectedFiterCount = Object.keys(filterData).filter(
		(x) =>
			((filterData[x]) ||
				filterData[x] === true) &&
			x !== 'filter_type',
	).length;
	return (
		<Layout>
			{selectedTask?._id ? (
				<UpdateTask
					filterData={filterData}
					hideBtn={true}
					data={selectedTask}
					task_view_type={task_view_type}
					handleClose={() => {
						setSelectetdTask({});
					}}
				/>
			) : (
				''
			)}

			<div id="page-content-wrapper">
				<section className="lf-dashboard-toolbar py-0 pe-0">
					<section className="py-1">
						<div className="row align-items-center">
							<div className="col-12 my-2">
								<span className="px-4 theme-color">
									<i className="fas fa-tasks pe-2"></i>
									{task.text}
								</span>
								<span className="border-start py-0"></span>
								<span className="px-4 border-0">
									<Link className="text-dark" to={`/issues/${project_id}`}>
										<i className="fa-solid fa-triangle-exclamation pe-2"></i>
										{issue.text}
									</Link>
								</span>
							</div>
						</div>
					</section>
					<div className="border-top px-0"></div>
					<section className="theme-secondary py-1 pe-4 ">
						<div className="row align-items-center">
							
							<div className="col-lg-2 col-md-3 pe-md-0 d-none d-md-block">
								<CustomSearch
									manageTaskFilter={manageTaskFilter}
									suggestion={true}
									dataSource={{
										task: searchSourceData,
									}}
								/>
							</div>

							<div className="col-lg-10 col-md-9 col-sm-12 d-inline-block ps-md-0 col-xs-10">
								<div className="d-flex d-none d-lg-inline-block float-start mt-1">
									<Dropdown className="lf-responsive-common">
										<span tooltip={sort_by.tooltip} flow={sort_by.tooltip_flow}>
											<Dropdown.Toggle
												variant="transparent"
												id="dropdown-basic"
												className="lf-common-btn px-0">
												<span>{sortingList[parseInt(sortType) - 1]}</span>
											</Dropdown.Toggle>
										</span>
										<Dropdown.Menu
											style={{ backgroundColor: '#73a47' }}
											className="shadow p-2  bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
											{sortingList.map((st, k) => {
												return (
													<Dropdown.Item
														key={k}
														className="lf-layout-profile-menu lf-dropdown-animation"
														onClick={() => handleSortType((k + 1).toString())}>
														{' '}
														{st}
													</Dropdown.Item>
												);
											})}
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="d-flex float-start mt-1 ">
									<Dropdown className="lf-responsive-common">
										<Dropdown.Toggle
											variant="transparent"
											id="dropdown-basic"
											className="lf-common-btn">
											<span>{taskDataSelectedType}</span>
										</Dropdown.Toggle>
										<Dropdown.Menu
											style={{ backgroundColor: '#73a47' }}
											className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
											<Dropdown.Item
												className="lf-layout-profile-menu "
												onClick={() => {
													handleTaskDataSelectedType('All Task');
													setTaskType('all_task');
													manageTaskFilter('filter_type', 'all_task');
													// clearTaskFilter({})
												}}>
												{all_task?.text}
											</Dropdown.Item>
											<Dropdown.Item
												className="lf-layout-profile-menu lf-dropdown-animation"
												onClick={() => {
													handleTaskDataSelectedType('My Task');
													setTaskType('my_task');
													manageTaskFilter('filter_type', 'my_task');
													// manageTaskFilter('assignee', userId)
												}}>
												{my_task?.text}
											</Dropdown.Item>
											<Dropdown.Item
												className="lf-layout-profile-menu lf-dropdown-animation"
												onClick={() => {
													handleTaskDataSelectedType('Unpublished Task');
													setTaskType('unpublished_task');
													manageTaskFilter('filter_type', 'unpublished_task');
													// getTaskData({ is_published: true })
												}}>
												{unpublished_task?.text}
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="d-flex d-none d-sm-inline-block float-start mt-1 ">
									<div
										className={
											selectedFiterCount > 0
												? `lf-common-btn px-0 px-md-2 text-nowrap selected-filter`
												: `lf-common-btn text-nowrap px-0`
										}
										onClick={() => setOpen(!open)}
										tooltip={btn_filter.tooltip}
										flow={btn_filter.tooltip_flow}>
										<i className="fas fa-filter lf-all-icon-size"></i>
										<span className="">
											{' '}
											{btn_filter?.text}{' '}
										{selectedFiterCount > 0 ? `(${selectedFiterCount})` : ''}
										</span>
									</div>
								</div>
								<div className="ms-auto d-flex float-end mt-1">
										<span
											className="lf-main-button mr-3 ps-md-2 lf-link-cursor px-0 px-md-2 "
											tooltip={btn_create_task.tooltip}
											flow={btn_create_task.tooltip_flow}
											onClick={() => {
												dispatch(
													createTask(
														{
															user_id: userId,
															project_id: project_id,
															is_completed: false,
															is_verified: false,
															title: 'New Task',
															board_id: '60f29b1e39a731803e8c4cf2',
															type: 'planned',
															assigee_id: userId,
															members_id: [],
															watchers: [],
															tags: [],
															cost: '',
															start_date: null,
															end_date: null,
															manpower: '',
															is_published: true,
														},
														false,
														task_view_type,
														filterData,
														Navigate,
													),
												);
											}}>
											<i className="fas fa-plus pe-1"></i> {btn_create_task?.text}
										</span>
										<span className='d-none d-lg-inline-block lf-common-btn p-lg-2 p-md-1 px-1 d-none-xs'>
											<ExportToCsv
											dataSource={{ task: searchSourceData }}
											className="lf-common-btn p-lg-2 p-md-1 px-1"
										/>
										</span>
										<span
											className="d-none d-lg-inline-block lf-common-btn p-lg-2 p-md-1 px-1 d-none-xs"
											tooltip={btn_import.tooltip}
											flow={btn_import.tooltip_flow}
											onClick={() => setImportMode(!importMode)}>
											{' '}
											<i className="fas fa-file-import pe-1"></i>
											<span className="d-inline-block">
												{btn_import?.text}
											</span>
										</span>
										<Dropdown className="d-inline-block">
											<Dropdown.Toggle
												disabled={multiSelect.length === 0}
												variant="transparent"
												className="lf-common-btn px-0 px-md-1">
												<span>{action?.text}</span>
											</Dropdown.Toggle>
											<Dropdown.Menu className="shadow p-2 bg-white rounded-7 dropdown-menu  dropdown-menu lf-dropdown-center lf-dropdown-animation">
												<Dropdown.Item
													className="lf-layout-profile-menu"
													onClick={() =>
														sweetAlert(
															() =>
																dispatch(
																	deleteTask(
																		{
																			project_id: project_id,
																			user_id: userId,
																			task_id: multiSelect,
																		},
																		task_view_type,
																		filterData,
																	),
																),
															'Project Tasks',
															'Delete',
															handleMultiSelect,
														)
													}>
													<i className="far fa-trash-alt px-2" />
													{deleteText.text}
												</Dropdown.Item>
												<Dropdown.Item
													className="lf-layout-profile-menu"
													onClick={() => {
														hendleShowShereModel();
													}}>
													<i className="far fa-file-alt px-2" />
													{generate_report.text}
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
										<span className="text-nowrap ms-3 ">
											<Link
												to={`/tasks/${project_id}`}
												tooltip={btn_list.tooltip}
												flow={btn_list.tooltip_flow}
												className={`lf-toolbar-action-icon ${
													!['kanban', 'board'].includes(task_view_type)
														? 'selected'
														: ''
												}`}
												onClick={() => {
													dispatch(clearTaskListBoradData());
												}}>
												<i className="fas fa-list fa-lg"></i>
											</Link>
											<Link
												to={`/tasks/${project_id}?v=kanban`}
												tooltip={btn_kanban.tooltip}
												flow={btn_kanban.tooltip_flow}
												className={`lf-toolbar-action-icon ms-1 ${
													['kanban'].includes(task_view_type) ? 'selected' : ''
												}`}
												onClick={() => {
													dispatch(clearTaskListBoradData());
												}}>
												<i className="fab fa-trello fa-lg" aria-hidden="true"></i>
											</Link>
											<Link
												to={`/tasks/${project_id}?v=board`}
												tooltip={btn_board.tooltip}
												flow={btn_board.tooltip_flow}
												className={`lf-toolbar-action-icon ms-1 ${
													['board'].includes(task_view_type) ? 'selected' : ''
												}`}
												onClick={() => {
													dispatch(clearTaskListBoradData());
												}}>
												<i className="fas fa-clipboard-list fa-lg"></i>
											</Link>
										</span>
								</div>


								{/* <ul className="list-unstyled m-0 p-0">
									<li className="d-md-none d-inline-block">
										<Dropdown>
											<Dropdown.Toggle
												variant="transparent"
												id="dropdown-basic"
												className="ps-0 ms-2 lf-notification-toggle">
												<i className="fas fa-sort"></i>
											</Dropdown.Toggle>
											<Dropdown.Menu
												style={{ backgroundColor: '#73a47' }}
												className="shadow p-2 bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
												<Dropdown.ItemText>
													<strong>{sort_by.tooltip}</strong>
												</Dropdown.ItemText>
												{sortingList.map((st, k) => {
													return (
														<Dropdown.Item
															key={k}
															className="lf-layout-profile-menu lf-dropdown-animation"
															onClick={() =>
																handleSortType((k + 1).toString())
															}>
															<span className="ms-3"> {st} </span>
														</Dropdown.Item>
													);
												})}
												<Dropdown.ItemText>
													<strong>{sort_task.text}</strong>
												</Dropdown.ItemText>
												<Dropdown.Item
													className="lf-layout-profile-menu lf-dropdown-animation"
													onClick={() => {
														handleTaskDataSelectedType('All Task');
														setTaskType('all_task');
														manageTaskFilter('filter_type', 'all_task');
													// clearTaskFilter({})
													}}>
													<span className="ms-3">{all_task?.text}</span>
												</Dropdown.Item>
												<Dropdown.Item
													className="lf-layout-profile-menu lf-dropdown-animation"
													onClick={() => {
														handleTaskDataSelectedType('My Task');
														setTaskType('my_task');
														manageTaskFilter('filter_type', 'my_task');
													// manageTaskFilter('assignee', userId)
													}}>
													<span className="ms-3">{my_task?.text} </span>
												</Dropdown.Item>
												<Dropdown.Item
													className="lf-layout-profile-menu lf-dropdown-animation"
													onClick={() => {
														handleTaskDataSelectedType('Unpublished Task');
														setTaskType('unpublished_task');
														manageTaskFilter('filter_type', 'unpublished_task');
													// getTaskData({ is_published: true })
													}}>
													<span className="ms-3">{unpublished_task?.text}</span>
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</li> 
									<li className="d-md-none d-inline-block">
										<Dropdown>
											<Dropdown.Toggle
												variant="transparent"
												id="dropdown-basic"
												className="ps-0 ms-2 lf-notification-toggle">
												<i className="fas fa-ellipsis-v fa-md mt-1"></i>
											</Dropdown.Toggle>
											<Dropdown.Menu
												style={{ backgroundColor: '#73a47' }}
												className="shadow p-2  bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
												<Dropdown.Item className="lf-layout-profile-menu lf-link-cursor lf-dropdown-animation my-1">
													<span
														tooltip={btn_create_task.tooltip}
														flow={btn_create_task.tooltip_flow}
														onClick={() => {
															dispatch(
																createTask(
																	{
																		user_id: userId,
																		project_id: project_id,
																		is_completed: false,
																		is_verified: false,
																		title: 'New Task',
																		board_id: '60f29b1e39a731803e8c4cf2',
																		type: 'planned',
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
																	false,
																	task_view_type,
																	filterData,
																	Navigate,
																),
															);
														}}>
														<i className="fas fa-plus"></i>
													<span className="ms-2"> {btn_create_task?.text}</span>
													</span>
												</Dropdown.Item>
												<li>
													<ExportToCsv
														dataSource={{ task: searchSourceData }}
														className="dropdown-item lf-layout-profile-menu lf-link-cursor my-2 lf-dropdown-animation"
													/>
												</li>
												<Dropdown.Item className="lf-layout-profile-menu lf-link-cursor my-2 lf-dropdown-animation">
													<span
														tooltip={btn_import.tooltip}
														flow={btn_import.tooltip_flow}
														onClick={() => {
															setImportMode(!importMode);
														}}>
														{' '}
														<i className="fas fa-file-import"></i>
														<span className="ms-2">{btn_import?.text}</span>
													</span>
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</li>
								</ul> */}
							</div>


						</div>
					</section>
				</section>
				<div
					className="position-fixed end-0 mt-md-0 mt-1 mx-2 mx-md-0"
					style={{ zIndex: '3' }}>
					<Filter
						manageTaskFilter={manageTaskFilter}
						clearTaskFilter={clearTaskFilter}
						filterData={filterData}
						setOpen={setOpen}
						open={open}
					/>
				</div>
				{!data ? (
					<Loading />
				) : !tasks.length ? (
					<Nodata type="Tasks">
						<span
							className="lf-main-button lf-link-cursor"
							title={'Add Task'}
							onClick={() => {
								dispatch(
									createTask(
										{
											user_id: userId,
											project_id: project_id,
											title: 'New Task',
											board_id: '60f29b1e39a731803e8c4cf2',
											type: 'planned',
											assigee_id: userId,
											members_id: [],
											watchers: [],
											tags: [],
											cost: '',
											start_date: null,
											end_date: null,
											manpower: '',
											is_published: true,
										},
										false,
										task_view_type,
										filterData,
										Navigate,
									),
								);
							}}>
							<i className="fas fa-plus px-1"></i> {btn_create_task?.text}
						</span>
					</Nodata>
				) : task_view_type === 'kanban' || task_view_type === 'board' ? (
					<KanbanTasks
						data={data}
						clearTaskFilter={clearTaskFilter}
						filterData={filterData}
						sortType={sortType}
						multiSelect={multiSelect}
						handleMultiSelect={handleMultiSelect}
						handleTaskSelect={handleTaskSelect}
						tasks={tasks}
						setSelectetdTask={setSelectetdTask}
						project_id={project_id}
						dispatch={dispatch}
					/>
				) : (
					<TasksListView
						data={data}
						sortType={sortType}
						filterData={filterData}
						multiSelect={multiSelect}
						handleMultiSelect={handleMultiSelect}
						handleTaskSelect={handleTaskSelect}
						tasks={tasks}
						setSelectetdTask={setSelectetdTask}
						project_id={project_id}
						dispatch={dispatch}
						key={'task_list'}
					/>
				)}
			</div>
			<Modal
				style={{ width: '100%' }}
				show={importMode}
				dialogClassName="modal-95w"
				centered
				onHide={closeImportMode}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{btn_import.tooltip}</Modal.Title>
				</Modal.Header>
				<Modal.Body id={`import-model-body`}>
					<TaskImport
						closeImportMode={closeImportMode}
						importMode={importMode}
						task_view_type={task_view_type}
						filterData={filterData}
					/>
				</Modal.Body>
			</Modal>
			<GenerateReport
				open={showShareModel}
				project_id={project_id}
				multiSelect={multiSelect}
				handleClose={hendleShowShereModel}
			/>
		</Layout>
	);
}

export default Tasks;
