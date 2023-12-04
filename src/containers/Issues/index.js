import Layout from '../../components/layout';
// import Nodata from '../../components/nodata';
import { Dropdown, Modal } from 'react-bootstrap';
import UpdateIssue from './UpdateIssue';
import { useParams } from 'react-router';
// import Filter from './filter';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ISSUE_LIST,
} from '../../store/actions/actionType';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	createIssue,
	issueDelete,
	issueListFilter,
} from '../../store/actions/Issues';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Loading from '../../components/loadig';
import Nodata from '../../components/nodata';
import IssuesListView from './list';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import CustomSearch from '../../components/CustomSearch';
import GenerateissuesReport from '../../components/GenerateIssuesReport';
import { Link } from 'react-router-dom';
import { getParameterByName } from '../../helper';
import { useNavigate } from 'react-router-dom';
import KanbanView from './Kanban';

const userId = getUserId();

function Issues() {
	const { project_id, issue_id } = useParams();
	const task_view_type = getParameterByName('v') || 'list';
	const Navigate = useNavigate();
	const [sortType, handleSortType] = useState('3');

	const dispatch = useDispatch();
	const [multiSelect, handleMultiSelect] = useState([]);
	const [selectedTask, handleSelectetdTask] = useState(
		issue_id ? { _id: issue_id } : {},
	);
	const data = useSelector((state) => state?.issues?.[GET_ISSUE_LIST]);
	
	const [showShareModel, setShowShareModel] = useState(false);
	const hendleShowShereModel = () => {
		setShowShareModel(!showShareModel);
	};


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
	});
	const setSelectetdTask = (task) => {
		handleSelectetdTask(task);
		if (task?._id) {
			Navigate(`/issues/${project_id}/${task?._id}?v=${task_view_type}`);
		} else {
			Navigate(`/issues/${project_id}?v=${task_view_type}`);
		}
	};

	const manageTaskFilter = (name, value) => {
		handleFilterData({
			...filterData,
			[name]: value !== 'unset' ? value : undefined,
		});
		getIssueData({
			...filterData,
			[name]: value !== 'unset' ? value : undefined,
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

	const getIssueData = (fd = filterData) => {
		dispatch(issueListFilter({ project_id, user_id: userId, ...fd }));
	};
	useEffect(() => {
		getIssueData();
	}, [dispatch, project_id, userId]);

	useEffect(() => {
		if (!selectedTask?._id && issue_id) {
			handleSelectetdTask({ _id: issue_id });
		}
	}, [issue_id]);

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

	let searchSourceData = [];

	const { btn_create_task } = getSiteLanguageData('task/update');
	const { sort_by, action } = getSiteLanguageData('commons');

	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];

	const {
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
		raise_issue,
		deleteText,
		createIssueText,
	} = getSiteLanguageData('task/update');

	return (
		<Layout>
			{selectedTask?._id ? (
				<UpdateIssue
					filterData={filterData}
					hideBtn={true}
					data={selectedTask}
					task_view_type={task_view_type}
					handleClose={() => {
						setSelectetdTask({});
						getIssueData();
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
								<span className="px-4 border-0">
									<Link className="text-dark" to={`/tasks/${project_id}`}>
										<i className="fas fa-tasks pe-2"></i>
										{task.text}
									</Link>
								</span>
								<span className="border-start py-0"></span>
								<span className="px-4 theme-color">
									<i className="fa-solid fa-triangle-exclamation pe-2"></i>
									{issue.text}
								</span>
							</div>
						</div>
					</section>
					<div className="border-top px-0"></div>
					<section className="theme-secondary py-1 pe-4">
						<div className="row align-items-center">
							<div className="col-lg-2 col-md-3 pe-md-0 d-none d-md-block">
								<CustomSearch
									manageTaskFilter={manageTaskFilter}
									suggestion={true}
									dataSource={{
										issues: data,
									}}
								/>
							</div>

							<div className="col-lg-10 col-md-9 col-sm-12 d-inline-block ps-md-0 col-xs-10">
								<div className="d-flex float-end float-md-start mt-1 d-none-xs">
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
								<div className="ms-auto d-flex float-end mt-1">
									<span
										className="lf-main-button mr-3 d-inline-block ps-md-2 lf-link-cursor px-0 px-md-2 "
										tooltip={`Raise Issue`}
										flow={btn_create_task.tooltip_flow}
										onClick={() => {
											let postIssue = {
												user_id: userId,
												project_id: project_id,
												title: 'New Issue',
												status_id: 'Open',
												assigee_id: userId,
												watchers: [],
												tags: [],
												start_date: '',
												end_date: '',
											};
											dispatch(
												createIssue(postIssue, (resData) => {
													if (resData && resData._id) {
														setSelectetdTask(resData);
													}
													getIssueData();
													console.log(resData, 'resData resData');
												}),
											);
										}}>
										<i className="fas fa-plus pe-1"></i> {raise_issue.text}
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
																issueDelete(
																	{
																		project_id: project_id,
																		user_id: userId,
																		_id: multiSelect,
																	},
																	(resData) => {
																		getIssueData();
																	},
																),
															),
														'Project Issue',
														'Delete',
														handleMultiSelect,
													)
												}
												>
												<i className="far fa-trash-alt px-2" /> {deleteText.text}
											</Dropdown.Item>
											<Dropdown.Item
											className="lf-layout-profile-menu"
											onClick={() => {
												hendleShowShereModel()
											}}
											>
											<i className="far fa-file-alt px-2" />
											Generate Report
										</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>

									<span className="text-nowrap ms-3 ">
										<Link
											to={`/issues/${project_id}`}
											tooltip={btn_list.tooltip}
											flow={btn_list.tooltip_flow}
											className={`lf-toolbar-action-icon ${
												!['kanban', 'board'].includes(task_view_type)
													? 'selected'
													: ''
											}`}
											onClick={() => {
												// dispatch(clearTaskListBoradData());
											}}>
											<i className="fas fa-list fa-lg"></i>
										</Link>
										<Link
											to={`/issues/${project_id}?v=kanban`}
											tooltip={btn_kanban.tooltip}
											flow={btn_kanban.tooltip_flow}
											className={`lf-toolbar-action-icon ms-1 ${
												['kanban'].includes(task_view_type) ? 'selected' : ''
											}`}
											onClick={() => {
												// dispatch(clearTaskListBoradData());
											}}>
											<i className="fab fa-trello fa-lg" aria-hidden="true"></i>
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
												<i className="fas fa-ellipsis-v fa-md mt-1"></i>
											</Dropdown.Toggle>
											<Dropdown.Menu
												style={{ backgroundColor: '#73a47' }}
												className="shadow p-2  bg-white rounded-7 dropdown-menu lf-dropdown-center lf-dropdown-animation">
												<Dropdown.Item className="lf-layout-profile-menu lf-link-cursor lf-dropdown-animation my-1">
													<span
														tooltip={`Create Issue`}
														flow={btn_create_task.tooltip_flow}
														onClick={() => {
															let postIssue = {
																user_id: userId,
																project_id: project_id,
																title: 'New Issue',
																status_id: 'Open',
																assigee_id: userId,
																watchers: [],
																tags: [],
																start_date: '',
																end_date: '',
															};
															dispatch(
																createIssue(postIssue, (resData) => {
																	// Navigate()
																	if (resData && resData._id) {
																		setSelectetdTask(resData);
																	}
																	getIssueData();
																}),
															);
														}}>
														<i className="fas fa-plus"></i>
														<span className="ms-2">{raise_issue.text}</span>
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
				{/* <div
					className="position-fixed end-0 mt-md-0 mt-1 mx-2 mx-md-0"
					style={{ zIndex: '3' }}>
					<Filter
						manageTaskFilter={manageTaskFilter}
						clearTaskFilter={clearTaskFilter}
						filterData={filterData}
						setOpen={setOpen}
						open={open}
					/>
				</div> */}
				{!data ? (
					<Loading />
				) : !tasks.length ? (
					<Nodata type="Issue">
						<span
							className="lf-main-button lf-link-cursor"
							title={'Add Issue'}
							onClick={() => {
								let postIssue = {
									user_id: userId,
									project_id: project_id,
									title: 'New Issue',
									status_id: 'Open',
									assigee_id: userId,
									watchers: [],
									tags: [],
									start_date: '',
									end_date: '',
								};
								dispatch(
									createIssue(postIssue, (resData) => {
										if (resData && resData._id) {
											setSelectetdTask(resData);
										}
										getIssueData();
									}),
								);
							}}>
							<i className="fas fa-plus px-1"></i> {createIssueText.text}
						</span>
					</Nodata>
				) : task_view_type === 'kanban' ? (
					<KanbanView
						data={data}
						project_id={project_id}
						handleMultiSelect={handleMultiSelect}
						handleTaskSelect={handleTaskSelect}
						getIssueData={getIssueData}
						setSelectetdTask={setSelectetdTask}
						dispatch={dispatch}
						multiSelect={multiSelect}
					/>
				) : (
					<IssuesListView
						data={data}
						sortType={sortType}
						multiSelect={multiSelect}
						handleMultiSelect={handleMultiSelect}
						handleTaskSelect={handleTaskSelect}
						tasks={tasks}
						getIssueData={getIssueData}
						setSelectetdTask={setSelectetdTask}
						project_id={project_id}
						dispatch={dispatch}
						key={'task_list'}
					/>
				)}
			</div>
			<GenerateissuesReport open={showShareModel} project_id={project_id} multiSelect={multiSelect} handleClose={hendleShowShereModel} />

		</Layout>
	);
}

export default Issues;
