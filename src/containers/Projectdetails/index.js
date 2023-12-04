import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_COUNT,
	GET_RECENT_SHEETS,
	GET_REPORT_PERMISSION_LIST,
	GET_TASK_LIST_BY_BOARD,
	GET_TASK_LIST_BY_PROJRCT_ID,
} from '../../store/actions/actionType';
import getUserId, { sweetAlert, getSiteLanguageData } from '../../commons';
import Loading from '../../components/loadig';
import Chart from 'react-google-charts';
import {
	getAllTaskByProjectId,
	taskBoardFilter,
} from '../../store/actions/Task';
import { Card, Col, Row } from 'react-bootstrap';
import {
	getAllRoleWisePeople,
	getCount,
	getRecentSheets,
	getReportPermissionList,
	reportAction,
} from '../../store/actions/projects';
import ProgressReport from './ProgressReport';
import moment from 'moment';
import { unlockReport } from '../../store/actions/report';
import banner from '../../images/dashboard/banner.png';

const chartoptions = {
	title: '',
	is3D: true,
	colors: [],
	// hAxis: { title: "Age", viewWindow: { min: 0, max: 15 } },
	// vAxis: { title: "Weight", viewWindow: { min: 0, max: 15 } },
	// legend: "none"
};

function ProjectDashboard() {
	// declaration
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const userId = getUserId();
	const reportPermission = useSelector((state) => {
		return state?.project?.[GET_REPORT_PERMISSION_LIST]?.result || [];
	});
	const userProfileData = useSelector((state) => {
		
		return state?.profile?.user_profile_details?.result || {};
	});
	useEffect(() => {
		if (reportPermission?.length <= 0) {
			dispatch(getReportPermissionList(project_id, userId));
		}
	}, [reportPermission?.length, dispatch]);

	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee?.length, dispatch]);
	const count = useSelector((state) => {
		return state?.project?.[GET_COUNT]?.result || [];
	});
	useEffect(() => {
		if (count?.length <= 0) {
			dispatch(getCount(project_id));
		}
	}, [count?.length, dispatch]);

	const taskList = useSelector((state) => {
		return state?.task?.[GET_TASK_LIST_BY_PROJRCT_ID]?.result || [];
	});
	useEffect(() => {
		if (taskList?.length <= 0) {
			dispatch(getAllTaskByProjectId(project_id));
		}
	}, [taskList?.length, dispatch]);

	const data = useSelector((state) => {
		return state?.task?.[GET_TASK_LIST_BY_BOARD]?.result;
	});
	// life cycle
	useEffect(() => {
		if (!data) {
			// dispatch(getAllSheets(project_id));
			dispatch(
				taskBoardFilter({
					project_id,
					user_id: userId,
				}),
			);
		}
	}, []);
	const recentPlan = useSelector((state) => {
		return state?.project?.[GET_RECENT_SHEETS]?.result || [];
	});
	useEffect(() => {
		if (recentPlan?.length <= 0) {
			dispatch(getRecentSheets(project_id, userId));
		}
	}, [recentPlan?.length, dispatch]);
	if (!data) {
		return (
			<Layout>
				<Loading />
			</Layout>
		);
	}
	const chartdata = [['Tasks', 'Status']].concat(
		data?.map((board) => {
			chartoptions.colors.push(board?.color_code);
			return [board?.name, board?.task?.length];
		}),
	);

	const optionsCateory = {
		title: '',
		// chartArea: { width: "50%" },
		isStacked: true,
		colors: [],
		hAxis: {
			title: 'Nos Of Task',
			minValue: 0,
		},
		vAxis: {
			title: 'Task By Category',
		},
	};

	const categoryTask = [];
	taskList
		?.filter((s) => s?.is_deleted === false)
		.forEach((element) => {
			if (element?.category.length === 1) {
				const index = categoryTask.findIndex(
					(sl) => sl?._id == element?.category_id,
				);
				if (-1 == index) {
					categoryTask.push({
						...element.category[0],
						task: [element],
					});
				} else {
					categoryTask[index].task.push(element);
				}
			}
		});
	const dataCateory = [
		['City'].concat(
			data?.map((board) => {
				optionsCateory.colors.push(board?.color_code);
				return board?.name;
			}),
		),
	].concat(
		categoryTask?.map((c) => {
			return [
				c?.name,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf2')[0]
					?.task?.filter((tc) => tc?.category[0]?._id === c?._id).length,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf3')[0]
					?.task?.filter((tc) => tc?.category[0]?._id === c?._id).length,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf4')[0]
					?.task?.filter((tc) => tc?.category[0]?._id === c?._id).length,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf5')[0]
					?.task?.filter((tc) => tc?.category[0]?._id === c?._id).length,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf6')[0]
					?.task?.filter((tc) => tc?.category[0]?._id === c?._id).length,
			];
		}),
	);

	const assigneeTask = [];
	taskList
		?.filter((s) => s?.is_deleted === false)
		.forEach((element) => {
			if (element?.assigee.length === 1) {
				const index = assigneeTask.findIndex(
					(sl) => sl?._id == element?.assigee_id,
				);
				if (-1 == index) {
					assigneeTask.push({
						...element.assigee[0],
						_id: element?.assigee_id,
						task: [element],
					});
				} else {
					assigneeTask[index].task.push(element);
				}
			}
		});
	const optionsAsssingee = {
		title: '',
		chartArea: { width: '50%' },
		isStacked: true,
		colors: [],
		hAxis: {
			title: 'NOS.Of Task',
			minValue: 0,
		},
		vAxis: {
			title: 'Task By Assignee',
		},
	};
	const dataAsssingee = [
		['City'].concat(
			data?.map((board) => {
				optionsAsssingee.colors.push(board?.color_code);
				return board?.name;
			}),
		),
	].concat(
		assigneeTask?.map((c) => {
			return [
				`${c?.first_name} ${c?.last_name}`,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf2')[0]
					?.task?.filter((tc) => tc?.assigee_id === c?._id).length,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf3')[0]
					?.task?.filter((tc) => tc?.assigee_id === c?._id).length,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf4')[0]
					?.task?.filter((tc) => tc?.assigee_id === c?._id).length,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf5')[0]
					?.task?.filter((tc) => tc?.assigee_id === c?._id).length,
				data
					?.filter((b) => b?._id === '60f29b1e39a731803e8c4cf6')[0]
					?.task?.filter((tc) => tc?.assigee_id === c?._id).length,
			];
		}),
	);
	const projectTask = [];
	data?.forEach((a) => {
		(a?.task).forEach((u) => {
			projectTask.push(u);
		});
	});
	const optionsSpace = {
		title: '',
		pieHole: 0.4,
		is3D: false,
	};
	const dataSapce = [
		['Task', 'count'],
		['Sheets', 30],
		['Files', 40],
		['Phootos', 30],
	];

	const {
		all_stat_of_project,
		sheets,
		files,
		tasks,
		reports,
		meetings,
		teams,
		permissions,
		requested,
		unlock,
		canceled,
		cancel,
		approved,
		refuse,
		tasks_stat_by_category,
		task_by_status,
		no_request_found,
		task_stat_by_assignee,
		storagn_used_in_project,
		report_name,
		type,
		due_date,
		assignee_n,
		what_heppaning,
		no_task_available
	} = getSiteLanguageData('projects_details');
	const storeageData = [];
	for (let i = 0; i < dataSapce.length; i++) {
		if (i !== 0) {
			const element = dataSapce[i];
			storeageData.push(element[1]);
		}
	}
	var size = 0;
	for (var i in storeageData) {
		size += storeageData[i];
	}
	const statusData = [];
	for (let i = 0; i < chartdata.length; i++) {
		if (i !== 0) {
			const element = chartdata[i];
			statusData.push(element[1]);
		}
	}
	var total = 0;
	for (var i in statusData) {
		total += statusData[i];
	}

	return (
		<Layout>
			{
				<div id="page-content-wrapper">
					<div className="container-fluid p-sm-2 p-md-5">
						<div className={`row`}>
							<div className="dashboard-banner">
								<div className="ms-5 align-start">
									<h2 className="text-dark mb-2">Welcome, {userProfileData?.first_name} {userProfileData?.last_name}</h2>
									<h4 className="text-secondary">
										{what_heppaning.text}
									</h4>
								</div>
							</div>
							<div className="col-12">
								<div className="white-box">
									<label className="white-box-label">
										{all_stat_of_project?.text}
									</label>
									<div className="row mx-md-3 text-center">
										<div className="col-12">
											<div className={`d-flex justify-content-between d-xs-block`}>
												<div className="">
													<span className="dashboardStat fs-md-4">
														{count?.sheet}
													</span>
													<h6 className="pt-2 fs-md-4">{sheets?.text}</h6>
												</div>
												<div className="">
													<span className="dashboardStat fs-md-4">
														{count?.files}
													</span>
													<h6 className="pt-2 fs-md-4">{files?.text}</h6>
												</div>
												<div className="">
													<span className="dashboardStat fs-md-4">
														{projectTask?.length}
													</span>
													<h6 className="pt-2 fs-md-4">{tasks?.text}</h6>
												</div>
												<div className="">
													<span className="dashboardStat fs-md-4">
														{count?.reports}
													</span>
													<h6 className="pt-2 fs-md-4">{reports?.text}</h6>
												</div>
												{/* <div className="w-100 border-end">
													<span className="dashboardStat fs-md-4">
														{count?.meetings}
													</span>
													<h6 className="pt-2 fs-md-4">{meetings?.text}</h6>
												</div> */}
												<div className="">
													<span className="dashboardStat fs-md-4">
														{count?.teams}
													</span>
													<h6 className="pt-2 fs-md-4">{teams?.text}</h6>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="container-fluid">
								<div className="row">
									<div className="col-lg-8 col-md-7">
										<ProgressReport />
									</div>

									<div className="col-lg-4 col-md-5">
										<div className="white-box">
											<Row className="">
												<div className={`col-12`}>
													<label className="white-box-label">
														{permissions?.text}({reportPermission.length})
													</label>
												</div>
											</Row>
											{reportPermission.length ? (
												reportPermission?.map((rp, k) => {
													return (
														<Row className={`mb-4`}>
															<Col xs={2} className="text-lg-center">
																<img
																	src={rp?.requested_by?.profile}
																	className="priority-1 mt-1"
																/>
															</Col>
															<Col xs={10} className="ps-lg-0">
																<span>
																	<span className="fw-bold">
																		{rp?.requested_by?.first_name}{' '}
																		{rp?.requested_by?.last_name}{' '}
																	</span>
																	{requested?.text}{' '}
																	{rp?.requested_by?._id === userId
																		? 'to'
																		: 'you to'}{' '}
																	{unlock?.text} {rp?.report_type} on{' '}
																	{moment(rp?.report_date).format('Do MMM')}
																</span>
															</Col>

															{/* <Col xs={6} className="text-start">
																
															</Col> */}
															<Col xs={12} className={`text-end mt-1`}>
																<span className="text-secondary fs-6 ">
																	{moment(rp?.createdAt).format('MMMM DD,YYYY')}
																</span>
																{rp?.requested_by?._id === userId ? (
																	<>
																		{rp?.status === 'approved' ? (
																			''
																		) : rp?.status === 'cancel' ? (
																			<span className="lf-common-btn text-danger pe-0">
																				{canceled?.text}
																			</span>
																		) : (
																			<span
																				className="lf-common-btn py-1 text-danger pe-0"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								reportAction({
																									report_transaction_id:
																										rp?._id,
																									project_id: project_id,
																									user_id: userId,
																									report_type: rp?.report_type,
																									status: 'cancel',
																								}),
																							),
																						rp?.report_type,
																						'Cancel',
																					)
																				}>
																				{cancel?.text}
																			</span>
																		)}
																		{rp?.status === 'cancel' ? (
																			''
																		) : (
																			<span className="lf-common-btn py-1 text-success pe-0">
																				{rp?.status === 'approved'
																					? 'Approved'
																					: 'Requested'}
																			</span>
																		)}
																	</>
																) : (
																	<>
																		{rp?.status === 'cancel' ? (
																			<span className="lf-common-btn py-1 text-danger pe-0">
																				{canceled?.text}
																			</span>
																		) : rp?.status === 'approved' ? (
																			''
																		) : (
																			<span
																				className="lf-common-btn py-1 text-danger pe-0"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								reportAction({
																									report_transaction_id:
																										rp?._id,
																									project_id: project_id,
																									user_id: userId,
																									report_type: rp?.report_type,
																									status: 'refuse',
																								}),
																							),
																						rp?.report_type,
																						'Refuse',
																					)
																				}>
																				{refuse?.text}
																			</span>
																		)}
																		{rp?.status === 'cancel' ? (
																			''
																		) : rp?.status === 'approved' ? (
																			<span className="lf-common-btn py-1 text-success pe-0">
																				{approved?.text}
																			</span>
																		) : (
																			<span
																				className="lf-common-btn py-1 text-success pe-0"
																				onClick={() =>
																					sweetAlert(
																						() =>
																							dispatch(
																								unlockReport(
																									{
																										report_date: rp?.report_date,
																										project_id: project_id,
																										user_id: userId,
																										report_id: rp?.report_id,
																										report_name: rp?.report_name,
																										report_type: rp?.report_type,
																									},
																									true,
																								),
																							),
																						rp?.report_type,
																						'Unlock',
																					)
																				}>
																				{unlock?.text}
																			</span>
																		)}
																	</>
																)}
															</Col>
														</Row>
													);
												})
											) : (
												<Col
													xs={12}
													className="text-center theme-secondary fw-bold fs-6 ">
													{no_request_found?.text}
												</Col>
											)}
										</div>
									</div>
									
									<div className="col-lg-8 col-md-12">
										<div className="row">
											<div className="col-12">
												{/* <div className="white-box">
													<label className="white-box-label">
														Report To be Submitted(04)
													</label>
													<div className="table-responsive">
														<table className="table mb-1 white-table border-0">
															<thead className={`border-0`}>
																<tr className="text-nowrap text-center border-0">
																	<th className="text-start border-0">
																		{report_name?.text}
																	</th>
																	<th className="text-start border-0">
																		{type?.text}
																	</th>
																	<th className="text-start border-0">
																		{assignee_n?.text}{' '}
																	</th>
																	<th className="text-end border-0">
																		{due_date?.text}
																	</th>
																</tr>
															</thead>
															<tbody className="border-0">
																<tr className="border-0">
																	<td className={`border-0`}>
																		Survey At first floor
																	</td>
																	<td className="text-start border-0">
																		Survey
																	</td>
																	<td className="text-start border-0">
																		Akshay Sheth
																	</td>
																	<td className="text-end border-0">
																		03-05-2022
																	</td>
																</tr>
																<tr className="border-0">
																	<td className={`border-0`}>
																		Material Log At Building A
																	</td>
																	<td className="text-start border-0">
																		Material Log
																	</td>
																	<td className="text-start border-0">
																		Akshay Sheth
																	</td>
																	<td className="text-end border-0">
																		03-05-2022
																	</td>
																</tr>
																<tr className="border-0">
																	<td className={`border-0`}>Store Room Log</td>
																	<td className="text-start border-0">Store</td>
																	<td className="text-start border-0">
																		Akshay Sheth
																	</td>
																	<td className="text-end border-0">
																		03-05-2022
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div> */}
												<div className="white-box">
													<label className="white-box-label">
														{tasks_stat_by_category?.text}
													</label>
													{dataCateory.length > 1 ? (
														<>
															<Chart
																chartType="BarChart"
																data={dataCateory}
																options={optionsCateory}
																width="100%"
																height="400px"
																legendToggle
															/>
														</>
													) : (
														<>
															{/* <img
																src="/images/sheets/category.png"
																className="lf-image-opacity"
																style={{maxWidth:"100%"}}
															/> */}
															<div className='ps-1 text-secondary'>{no_task_available.text}</div>
															{/* <h5 className="lf-dashboard-graph fw-bold">
																No Task Available
															</h5> */}
														</>
													)}
												</div>

												<div className="white-box my-4">
													<label className="white-box-label">
														{task_by_status?.text}
													</label>
													{total !== 0 ? (
														<>
															<Chart
																chartType="PieChart"
																data={chartdata}
																options={chartoptions}
																width="100%"
																height="400px"
																legendToggle
															/>{' '}
														</>
													) : (
														<>
															{/* <img
																src="/images/sheets/status.png"
																className="lf-image-opacity"
																style={{maxWidth:"100%"}}
															/> */}
															<div className='ps-1 text-secondary'>{no_task_available.text}</div>
															{/* <h5 className="lf-dashboard-graph fw-bold">
																No Task Available
															</h5> */}
														</>
													)}
												</div>
												<div className="white-box my-4">
													<label className="white-box-label">
														{task_stat_by_assignee?.text}
													</label>
													{dataAsssingee.length > 1 ? (
														<>
															<Chart
																chartType="BarChart"
																data={dataAsssingee}
																options={optionsAsssingee}
																width="100%"
																height="400px"
																legendToggle
															/>{' '}
														</>
													) : (
														<>
															{/* <img
																src="/images/sheets/assignee.png"
																className="lf-image-opacity"
																style={{maxWidth:"100%"}}
															/> */}
															<div className='ps-1 text-secondary'>{no_task_available.text}</div>
															{/* <h5 className="lf-dashboard-graph fw-bold">
																No Task Available
															</h5> */}
														</>
													)}
												</div>
												{/* <div className="white-box my-4">
													<label className="white-box-label">
														{storagn_used_in_project?.text}
													</label>
													{size !== 0 ? (
														<>
															<Chart
																className="position-relative"
																chartType="PieChart"
																width="100%"
																height="400px"
																data={dataSapce}
																options={optionsSpace}
															/>
														</>
													) : (
														<>
															<img
																src="/images/sheets/storage.png"
																className="lf-image-opacity"
															/>
															<h5 className="lf-dashboard-graph fw-bold">
																No Task Available
															</h5>
														</>
													)}
												</div> */}
											</div>
										</div>
									</div>									
								</div>
							</div>
						</div>
					</div>
				</div>
			}
		</Layout>
	);
}

export default ProjectDashboard;
