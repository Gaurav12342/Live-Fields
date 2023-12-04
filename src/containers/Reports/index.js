import { Component, Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/layout';
import getUserId, { getSiteLanguageData } from '../../commons';
import SheetToolBar from './Components/ToolBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Nodata from '../../components/nodata';
import {
	GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID,
	GET_MATERIAL_LOG_LIST,
	GET_STORE_ROOM,
	GET_SURVEY_REPORT,
} from '../../store/actions/actionType';
import {
	deleteLabourAndEquipmentLog,
	deleteSurveyReport,
	getlabourAndequipmentByProjectId,
	getSurveyReport,
	getSurveyRequestDetails,
} from '../../store/actions/report';
import {
	deleteMaterialsLog,
	deleteStoreRoom,
	getMaterialsLogList,
	getStoreRoom,
} from '../../store/actions/storeroom';
import moment from 'moment';
import { errorNotification } from '../../commons/notification';
import { FormCheck } from 'react-bootstrap';
import UpdateSurveyReport from './Components/updateSurveyReport';
import CreateStoreRoom from './Components/createstoreroom';
import CreatSurveyReport from './Components/createsurveyreport';
import CreateLabourEquipmentLog from './Components/createLabourEquipmentLog';
import MaterialInfo from '../Material/Components/materialInfo';
import CustomDate from '../../components/CustomDate';
import Swal from 'sweetalert2';
import DownloadReport from './Components/downlodReport';
import withRouter from '../../components/withrouter';
// class Report extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.userId = getUserId();
// 		this.project_id = this.props.router?.params.project_id;
// 		this.state = {
// 			selectedSurveyReport: {},
// 			collapsibleData: {},
// 			multiSelect: [],
// 			selectedReportsLogs: {
// 				survey_report_request_id: [],
// 				store_room_log_id: [],
// 				material_log_id: [],
// 				laborur_and_equipment_log_id: [],
// 				inspection_request_id: [],
// 				timesheet: [],
// 			},
// 			sortType: '3',
// 			isOpen: false,
// 		};
// 	}

// 	componentDidMount() {
// 		const { dispatch } = this.props;
// 		dispatch(getSurveyReport(this.project_id));
// 		dispatch(getStoreRoom(this.project_id));
// 		dispatch(getMaterialsLogList(this.project_id));
// 		dispatch(getlabourAndequipmentByProjectId(this.project_id));
// 	}
// 	manageCollapsibleData = (collapsibleData) => {
// 		this.setState({ collapsibleData });
// 	};

// 	clearLogIds = () => {
// 		this.handleMultiSelect([]);
// 		this.setState({
// 			selectedReportsLogs: {
// 				survey_report_request_id: [],
// 				store_room_log_id: [],
// 				material_log_id: [],
// 				laborur_and_equipment_log_id: [],
// 				inspection_request_id: [],
// 				timesheet: [],
// 			},
// 		});
// 	};

// 	deleteSpecificReports = (ids, key) => {
// 		if ('survey_report_request_id' === key) {
// 			this.props.dispatch(
// 				deleteSurveyReport(
// 					{
// 						project_id: this.project_id,
// 						survey_report_request_id: ids,
// 					},
// 					this.clearLogIds,
// 				),
// 			);
// 		} else if ('store_room_log_id' === key) {
// 			this.props.dispatch(
// 				deleteStoreRoom(
// 					{
// 						project_id: this.project_id,
// 						store_room_id: ids,
// 					},
// 					this.clearLogIds,
// 				),
// 			);
// 		} else if ('material_log_id' === key) {
// 			this.props.dispatch(
// 				deleteMaterialsLog(
// 					{
// 						project_id: this.project_id,
// 						material_log_id: ids,
// 					},
// 					this.clearLogIds,
// 				),
// 			);
// 		} else if ('laborur_and_equipment_log_id' === key) {
// 			this.props.dispatch(
// 				deleteLabourAndEquipmentLog(
// 					{
// 						project_id: this.project_id,
// 						labour_equipment_log_id: ids,
// 					},
// 					this.clearLogIds,
// 				),
// 			);
// 		}
// 	};

// 	deleteReport = (e) => {
// 		this.props.dispatch(
// 			deleteSurveyReport(
// 				{
// 					...this.state.selectedReportsLogs,
// 					project_id: this.project_id,
// 				},
// 				(resData) => {
// 					this.clearLogIds();
// 				},
// 			),
// 		);
// 	};

// 	handleMultiSelectReportLog = (repIds, reportName, mSelect) => {
// 		let logName = '';
// 		if (reportName == 'survey report') logName = 'survey_report_request_id';
// 		else if (reportName.toLowerCase() == 'store room log')
// 			logName = 'store_room_log_id';
// 		else if (reportName.toLowerCase() == 'material log')
// 			logName = 'material_log_id';
// 		else if (reportName.toLowerCase() == 'laborur & equipment log')
// 			logName = 'laborur_and_equipment_log_id';
// 		else if (reportName.toLowerCase() == 'inspection request')
// 			logName = 'inspection_request_id';
// 		else if (reportName.toLowerCase() == 'timesheet') logName = 'timesheet_id';
// 		/* this.setState({
// 			...this.state.selectedReportsLogs,
// 			[logName]:repIds
// 		}) */
// 		let ids = [];
// 		if (!Array.isArray(repIds)) {
// 			if (typeof this.state.selectedReportsLogs[logName] != 'undefined') {
// 				if (this.state.selectedReportsLogs[logName].includes(repIds)) {
// 					ids = this.state.selectedReportsLogs[logName].filter(
// 						(p) => p != repIds,
// 					);
// 				} else {
// 					ids = this.state.selectedReportsLogs[logName];
// 					ids.push(repIds);
// 				}
// 			}
// 		} else if (Array.isArray(repIds)) {
// 			ids = repIds;
// 		}
// 		this.setState({
// 			selectedReportsLogs: {
// 				...this.state.selectedReportsLogs,
// 				[logName]: ids,
// 			},
// 		});
// 	};

// 	handleMultiSelect = (multiSelect, reportName) => {
// 		this.setState({ multiSelect });
// 	};
// 	setSelectetdSurveyReport = (selectedSurveyReport) => {
// 		this.setState({ selectedSurveyReport });
// 	};
// 	handleSortType = (sortType) => {
// 		this.setState({ sortType });
// 	};

// 	navigateToDetailsPage = (rp, fr) => {
// 		const { dispatch } = this.props;
// 		let cDate = new Date(moment(new Date()).format('YYYY-MM-DD'));
// 		if (rp.name === 'survey report') {
// 			let datet = fr?.final_date?.find(
// 				(x) =>
// 					moment(x).format('YYYY-MM-DD') ==
// 					moment(new Date()).format('YYYY-MM-DD'),
// 			);
// 			if (!datet) {
// 				let lastDate = fr?.final_date.slice(-1)
// 					? new Date(fr?.final_date.slice(-1))
// 					: cDate;
// 				if (new Date(fr?.final_date[0]) < cDate && lastDate <= cDate) {
// 					datet = lastDate;
// 				} else if (new Date(fr?.final_date[0]) > cDate) {
// 					datet = new Date(fr?.final_date[0]);
// 				} else {
// 					datet = cDate;
// 				}
// 			}

// 			if (fr.frequency != 'Daily') {
// 				datet = fr?.final_date?.filter(
// 					(x) =>
// 						new Date(moment(new Date(x)).format('YYYY-MM-DD')) <=
// 						new Date(moment(new Date()).format('YYYY-MM-DD')),
// 				);

// 				if (datet && Array.isArray(datet) && datet.length > 0) {
// 					datet = datet[datet.length - 1];
// 				}
// 			}

// 			dispatch(getSurveyRequestDetails(fr._id));
// 			this.props.router.navigate(
// 				`/reports/${this.project_id}/${rp?.log_name}/${fr?._id}?${
// 					rp?.log_date
// 				}=${moment(datet).format('YYYY-MM-DD')}`,
// 			);
// 		} else {
// 			let dateArr = [];
// 			let i = 0;
// 			let frStartDate = new Date(fr.start_date);
// 			dateArr.push(frStartDate);
// 			while (frStartDate < new Date(fr.end_date)) {
// 				frStartDate = new Date(moment(frStartDate).add(1, 'day'));
// 				dateArr.push(frStartDate);
// 			}

// 			let datet = dateArr?.find(
// 				(x) =>
// 					moment(x).format('YYYY-MM-DD') ==
// 					moment(new Date()).format('YYYY-MM-DD'),
// 			);

// 			if (!datet) {
// 				let lastDate = dateArr.slice(-1) ? new Date(dateArr.slice(-1)) : cDate;
// 				if (new Date(dateArr[0]) < cDate && lastDate <= cDate) {
// 					datet = lastDate;
// 				} else if (new Date(dateArr[0]) > cDate) {
// 					datet = new Date(dateArr[0]);
// 				} else {
// 					datet = cDate;
// 				}
// 			}

// 			this.props.router.navigate(
// 				`/reports/${this.project_id}/${rp?.log_name}/${fr?._id}?${
// 					rp?.log_date
// 				}=${moment(datet).format('YYYY-MM-DD')}&name=${fr?.description}`,
// 			);
// 		}
// 	};

// 	render() {
// 		const { surveyReport, storeroom, materialLog, labourAndequipment } =
// 			this.props;
// 		const { selectedSurveyReport, collapsibleData, multiSelect, sortType } =
// 			this.state;
// 		const sortingList = [
// 			`A ${String.fromCharCode(60)} Z`,
// 			` Z ${String.fromCharCode(60)} A`,
// 			` New ${String.fromCharCode(60)} Old`,
// 			` Old ${String.fromCharCode(60)} New`,
// 		];

// 		const report = [
// 			{
// 				id: '1',
// 				name: 'survey report',
// 				log_name: 'fieldReportInfo',
// 				log_date: 'report_date',
// 				data: surveyReport,
// 				key: 'survey_report_request_id',
// 			},
// 			{
// 				id: '2',
// 				name: 'store room log',
// 				log_name: 'storeRoomLog',
// 				log_date: 'store_room_log_date',
// 				data: storeroom,
// 				key: 'store_room_log_id',
// 			},
// 			{
// 				id: '3',
// 				name: 'material log',
// 				log_name: 'materialLog',
// 				log_date: 'material_date',
// 				data: materialLog,
// 				key: 'material_log_id',
// 			},
// 			{
// 				id: '4',
// 				name: 'laborur & equipment log',
// 				log_name: 'labour_log',
// 				log_date: 'labour_equipment_log_date',
// 				data: labourAndequipment,
// 				key: 'laborur_and_equipment_log_id',
// 			},
// 			/* {
// 				id: '5',
// 				name: 'inspection request',
// 				log_name: 'inspection_request_log',
// 				log_date: 'inspection_request_date',
// 				data: [],
// 				key:"inspection_request_id"
// 			},
// 			{
// 				id: '6',
// 				name: 'timesheet',
// 				log_name: 'timesheet_log',
// 				log_date: 'timesheet_date',
// 				data: [],
// 				key:"timesheet"
// 			}, */
// 		];

// 		const renderDayContents = (day, date, fr) => {
// 			const tooltipText = `Tooltip for date: ${date}`;
// 			const cdate = moment(date).format('YYYY-MM-DD');
// 			const vb = fr?.final_date?.filter(
// 				(x) => moment(x).format('YYYY-MM-DD') === cdate,
// 			);

// 			return (
// 				<span title={tooltipText}>
// 					{moment(date).date()}
// 					{vb.length > 0 ? <span className="fw-icon-dot"></span> : ''}
// 				</span>
// 			);
// 		};
// 		let searchDataSource = [];
// 		report?.forEach((slist) => {
// 			searchDataSource = searchDataSource.concat(
// 				slist?.data?.map((d) => ({
// 					...d,
// 					report_type: slist?.name,
// 					log_name: slist?.log_name,
// 					log_date: slist?.log_date,
// 				})),
// 			);
// 		});
// 		const {
// 			calender,
// 			icon_edit,
// 			icon_delete,
// 			description,
// 			assigee,
// 			created_by,
// 			frequency,
// 		} = getSiteLanguageData('reports/toolbar');
// 		const { end_date, start_date, location, action } =
// 			getSiteLanguageData('commons');
// 		const { available } = getSiteLanguageData('material');
// 		return (
// 			<Layout>
// 				{selectedSurveyReport?._id ? (
// 					<UpdateSurveyReport
// 						surveyInfo={selectedSurveyReport}
// 						hideBtn={true}
// 						type={'update'}
// 						handleClose={() => {
// 							this.setSelectetdSurveyReport({});
// 						}}
// 					/>
// 				) : (
// 					''
// 				)}
// 				{report?.length === 0 ? (
// 					<Nodata type="Report" />
// 				) : (
// 					<div id="page-content-wrapper">
// 						<SheetToolBar
// 							deleteReport={this.deleteReport}
// 							searchDataSource={searchDataSource}
// 							sortingList={sortingList}
// 							sortType={sortType}
// 							handleSortType={this.handleSortType}
// 							multiSelect={multiSelect}
// 						/>
// 						<div className="container-fluid">
// 							<div className="theme-table-wrapper no-bg mt-3 mb-0 scroll-y">
// 								<table className="table table-hover theme-table">
// 									<thead className="theme-table-title text-nowrap text-center bg-light">
// 										<tr>
// 											<th className="lf-w-50 mx-3">
// 												{/* <FormCheck className="invisible" /> */}
// 											</th>
// 											<th className="lf-w-500 text-start pe-2">
// 												{description?.text}
// 											</th>
// 											<th className="lf-w-250 text-start">{assigee?.text}</th>
// 											<th className="lf-w-100 text-start">
// 												{created_by?.text}
// 											</th>
// 											<th className="lf-w-250">{start_date?.text}</th>
// 											<th className="lf-w-250">{end_date?.text}</th>
// 											<th className="lf-w-140 m-w-140 text-start">
// 												{frequency?.text}
// 											</th>
// 											<th className="lf-w-250 text-start">{location?.text}</th>
// 											<th className="lf-w-400 text-end pe-5">{action?.text}</th>
// 										</tr>
// 									</thead>
// 									<tbody>
// 										{report?.map((rp, k) => {
// 											return (
// 												<Fragment key={k}>
// 													<tr
// 														className={`theme-table-data-row ${
// 															!collapsibleData?.[rp.id]
// 																? 'bg-light'
// 																: 'bg-transparent'
// 														}`}>
// 														<td className="text-center lf-w-50">
// 															<FormCheck
// 																className={`mx-3 ${
// 																	rp.data?.length === 0
// 																		? 'invisible '
// 																		: 'visible'
// 																}`}
// 																type="checkbox"
// 																name="Report"
// 																onChange={({ target: { checked } }) => {
// 																	let newArr = [...multiSelect];
// 																	rp?.data?.forEach((p) => {
// 																		if (checked === true) {
// 																			newArr.push(p._id);
// 																		} else {
// 																			newArr = newArr.filter(
// 																				(d) => d !== p._id,
// 																			);
// 																		}
// 																	});

// 																	let reportId = checked
// 																		? rp?.data?.map((p) => p._id)
// 																		: [];
// 																	this.handleMultiSelect(newArr, rp.name);
// 																	this.handleMultiSelectReportLog(
// 																		reportId,
// 																		rp.name,
// 																		newArr,
// 																	);
// 																}}
// 																checked={rp?.data?.every((d) =>
// 																	multiSelect.includes(d._id),
// 																)}
// 															/>
// 														</td>
// 														<td colSpan={8}>
// 															<h6
// 																className="lf-link-cursor mb-0 mt-1 text-dark d-inline-block"
// 																onClick={() =>
// 																	this.manageCollapsibleData({
// 																		...collapsibleData,
// 																		[rp.id]: !collapsibleData?.[rp.id],
// 																	})
// 																}>
// 																<span className="ms-1 fw-bold text-capitalize ls-md">
// 																	{rp.name}({rp.data?.length})
// 																</span>

// 																<span className="ms-1">
// 																	<i
// 																		className={
// 																			!collapsibleData?.[rp.id]
// 																				? 'fas  fa-caret-down text-secondary p-1'
// 																				: 'fas fa-caret-right text-secondary p-1 ms-1 '
// 																		}></i>
// 																</span>
// 															</h6>
// 															<span className="ms-1">
// 																{this.state.selectedReportsLogs[rp.key] &&
// 																Array.isArray(
// 																	this.state.selectedReportsLogs[rp.key],
// 																) &&
// 																this.state.selectedReportsLogs[rp.key]
// 																	.length ? (
// 																	<span
// 																		className="theme-btnbg theme-secondary rounded lf-link-cursor"
// 																		tooltip={icon_delete.tooltip}
// 																		flow={icon_delete.tooltip_flow}
// 																		onClick={() => {
// 																			Swal.fire({
// 																				title: `Are you sure?`,
// 																				text: `You will not be able to recover this ${rp?.name}!`,
// 																				icon: 'question',
// 																				reverseButtons: true,
// 																				showCancelButton: true,
// 																				confirmButtonColor: '#dc3545',
// 																				cancelButtonColor: '#28a745',
// 																				confirmButtonText: 'Yes, delete it!',
// 																			}).then((result) => {
// 																				if (result.isConfirmed) {
// 																					this.deleteSpecificReports(
// 																						this.state.selectedReportsLogs[
// 																							rp.key
// 																						],
// 																						rp.key,
// 																					);
// 																				}
// 																			});
// 																		}}>
// 																		<i className="fas fa-trash-alt "></i>
// 																	</span>
// 																) : (
// 																	''
// 																)}
// 															</span>
// 															{rp.key === 'survey_report_request_id' ? (
// 																<span className="ms-1">
// 																	<CreatSurveyReport />
// 																</span>
// 															) : (
// 																''
// 															)}

// 															{rp.key === 'store_room_log_id' ? (
// 																<span className="ms-1">
// 																	<CreateStoreRoom />
// 																</span>
// 															) : (
// 																''
// 															)}

// 															{rp.key === 'material_log_id' ? (
// 																<span className="ms-1">
// 																	<MaterialInfo />
// 																</span>
// 															) : (
// 																''
// 															)}

// 															{rp.key === 'laborur_and_equipment_log_id' ? (
// 																<span className="ms-1">
// 																	<CreateLabourEquipmentLog />
// 																</span>
// 															) : (
// 																''
// 															)}
// 														</td>
// 													</tr>
// 													{rp?.data?.length === 0 ? (
// 														<tr
// 															className={`theme-table-data-row bg-white text-center lf-text-vertical-align ${
// 																!collapsibleData?.[rp.id] === true
// 																	? ''
// 																	: 'd-none'
// 															}`}>
// 															<td className="text-capitalize" colSpan={9}>
// 																No {`${rp?.name}`} {available.text}
// 															</td>
// 														</tr>
// 													) : (
// 														rp?.data
// 															?.sort((a, b) => {
// 																if (sortType === '1') {
// 																	return a?.description.localeCompare(
// 																		b?.description,
// 																	);
// 																}
// 																if (sortType === '2') {
// 																	return b?.description.localeCompare(
// 																		a?.description,
// 																	);
// 																}
// 																if (sortType === '3') {
// 																	return (
// 																		new Date(b.createdAt) -
// 																		new Date(a.createdAt)
// 																	);
// 																}
// 																if (sortType === '4') {
// 																	return (
// 																		new Date(a.createdAt) -
// 																		new Date(b.createdAt)
// 																	);
// 																}
// 																return true;
// 															})
// 															?.map((fr, k) => {
// 																const datet = fr?.final_date
// 																	?.filter(
// 																		(x) => moment(x).toDate() < new Date(),
// 																	)
// 																	.slice(-1);
// 																return (
// 																	<tr
// 																		key={k}
// 																		className={`theme-table-data-row lf-text-vertical-align lf-task-color bg-white ${
// 																			!collapsibleData?.[rp.id] ? ' ' : 'd-none'
// 																		}`}>
// 																		<td className="lf-w-50 text-center">
// 																			<FormCheck
// 																				type="checkbox"
// 																				name="plan_id"
// 																				className={`mx-3 ${
// 																					multiSelect.length > 0
// 																						? 'visible'
// 																						: ''
// 																				}`}
// 																				onChange={({ target: { checked } }) => {
// 																					let newArr = [...multiSelect];
// 																					if (checked === true) {
// 																						newArr.push(fr?._id);
// 																					} else {
// 																						newArr = newArr.filter(
// 																							(d) => d !== fr?._id,
// 																						);
// 																					}
// 																					this.handleMultiSelect(
// 																						newArr,
// 																						rp.name,
// 																					);

// 																					this.handleMultiSelectReportLog(
// 																						fr?._id,
// 																						rp.name,
// 																						newArr,
// 																					);
// 																				}}
// 																				checked={multiSelect.includes(fr?._id)}
// 																				value={fr?._id}
// 																			/>
// 																		</td>
// 																		<td
// 																			className="lf-w-350 align-middle pe-2"
// 																			onClick={() => {
// 																				this.navigateToDetailsPage(rp, fr);
// 																			}}>
// 																			<span className="lf-text-overflow-350 align-middle">
// 																				{fr?.description}
// 																			</span>
// 																		</td>
// 																		<td
// 																			className="text-start text-secondary lf-text-vertical-align lf-w-200"
// 																			onClick={() => {
// 																				this.navigateToDetailsPage(rp, fr);
// 																			}}>
// 																			<div className="lf-text-overflow-100 align-middle">
// 																				{' '}
// 																				{fr?.assigee.length > 0
// 																					? fr?.assigee
// 																							?.map((as) => {
// 																								return ` ${as?.first_name} ${as?.last_name}`;
// 																							})
// 																							.join(',')
// 																					: fr?.assigee?.first_name +
// 																					  ' ' +
// 																					  fr?.assigee?.last_name}
// 																			</div>
// 																		</td>
// 																		<td
// 																			className="text-start text-secondary text-nowrap lf-text-vertical-align lf-w-100 "
// 																			onClick={() => {
// 																				this.navigateToDetailsPage(rp, fr);
// 																			}}>
// 																			{(
// 																				fr?.createdBy?.first_name +
// 																				' ' +
// 																				fr?.createdBy?.last_name
// 																			).length > 15
// 																				? (
// 																						fr?.createdBy?.first_name +
// 																						' ' +
// 																						fr?.createdBy?.last_name
// 																				  ).substring(0, 13) + '...'
// 																				: fr?.createdBy?.first_name +
// 																				  ' ' +
// 																				  fr?.createdBy?.last_name}
// 																		</td>
// 																		<td
// 																			className="text-center text-secondary text-nowrap  lf-text-vertical-align lf-w-250 "
// 																			onClick={() => {
// 																				this.navigateToDetailsPage(rp, fr);
// 																			}}>
// 																			<span className="ms-1">
// 																				{' '}
// 																				{fr?.start_date ? (
// 																					<CustomDate date={fr?.start_date} />
// 																				) : (
// 																					<CustomDate date={fr?.createdAt} />
// 																				)}
// 																			</span>
// 																		</td>
// 																		<td
// 																			className="text-center text-secondary text-nowrap lf-text-vertical-align lf-w-250 "
// 																			onClick={() => {
// 																				this.navigateToDetailsPage(rp, fr);
// 																			}}>
// 																			<span className="mx-3">
// 																				{' '}
// 																				{fr?.end_date ? (
// 																					<CustomDate date={fr?.end_date} />
// 																				) : (
// 																					''
// 																				)}
// 																			</span>
// 																		</td>
// 																		<td
// 																			className="text-start text-secondary lf-text-vertical-align lf-w-250"
// 																			onClick={() => {
// 																				this.navigateToDetailsPage(rp, fr);
// 																			}}>
// 																			{fr?.frequency
// 																				? fr?.frequency?.split('_')?.join(' ')
// 																				: ''}
// 																		</td>
// 																		<td
// 																			className="text-start text-secondary lf-text-vertical-align lf-w-200"
// 																			onClick={() => {
// 																				this.navigateToDetailsPage(rp, fr);
// 																			}}>
// 																			<span className="lf-text-overflow-110 align-middle ">
// 																				{fr?.location.length > 0
// 																					? (fr?.location)
// 																							.map((as, k) => {
// 																								return ` ${as?.name}`;
// 																							})
// 																							.join(',')
// 																					: fr?.location?.name}
// 																			</span>
// 																		</td>
// 																		<td className="text-secondary text-end text-nowrap lf-w-400 lf-text-vertical-align pe-4 ">
// 																			{rp.name === 'survey report' ? (
// 																				<span
// 																					className="theme-btnbg lf-reports-icon-parent me-2 react-datepicker__input-container text-nowrap theme-secondary rounded lf-link-cursor"
// 																					tooltip={calender.tooltip}
// 																					flow={calender.tooltip_flow}>
// 																					<DatePicker
// 																						customInput={
// 																							<i
// 																								className="far fa-calendar-alt"
// 																								title="calendar"
// 																							/>
// 																						}
// 																						dateFormat={'Y-MM-d'}
// 																						renderDayContents={(day, date) =>
// 																							renderDayContents(day, date, fr)
// 																						}
// 																						filterDate={(date) => {
// 																							let dateNew = new Date(
// 																								moment(date).format(
// 																									'YYYY-MM-DD',
// 																								),
// 																							);
// 																							if (
// 																								typeof fr?.start_date ==
// 																									'undefined' ||
// 																								!fr?.start_date
// 																							)
// 																								return false;
// 																							let startDate = new Date(
// 																								moment(fr?.start_date).format(
// 																									'YYYY-MM-DD',
// 																								),
// 																							).getTime();
// 																							let endDate = (
// 																								fr?.end_date
// 																									? new Date(
// 																											moment(
// 																												fr?.end_date,
// 																											).format('YYYY-MM-DD'),
// 																									  )
// 																									: new Date()
// 																							).getTime();
// 																							let finalDates =
// 																								fr?.final_date &&
// 																								Array.isArray(fr?.final_date) &&
// 																								fr?.final_date.length > 0
// 																									? fr?.final_date.map(
// 																											(fnDate) =>
// 																												moment(fnDate).format(
// 																													'YYYY-MM-DD',
// 																												),
// 																									  )
// 																									: [];
// 																							return (
// 																								dateNew.getTime() >=
// 																									startDate &&
// 																								dateNew.getTime() <= endDate &&
// 																								new Date(
// 																									moment(dateNew).format(
// 																										'YYYY-MM-DD',
// 																									),
// 																								) <=
// 																									new Date(
// 																										moment(new Date()).format(
// 																											'YYYY-MM-DD',
// 																										),
// 																									) &&
// 																								finalDates.includes(
// 																									moment(dateNew).format(
// 																										'YYYY-MM-DD',
// 																									),
// 																								)
// 																							);
// 																							// return startDate <= date.getTime() && (endDate <= date.getTime() && startDate <= endDate);
// 																						}}
// 																						onChange={(e) => {
// 																							const date =
// 																								moment(e).format('YYYY-MM-DD');
// 																							const vb = fr?.final_date?.filter(
// 																								(x) =>
// 																									moment(x).format(
// 																										'YYYY-MM-DD',
// 																									) === date,
// 																							);
// 																							if (vb.length > 0) {
// 																								window.location.href = `/reports/${this.project_id}/fieldReportInfo/${fr?._id}?report_date=${date}`;
// 																							} else {
// 																								errorNotification(
// 																									'Please Select valid date',
// 																								);
// 																							}
// 																						}}
// 																					/>
// 																				</span>
// 																			) : (
// 																				<span
// 																					className="theme-btnbg lf-reports-icon-parent me-2 react-datepicker__input-container text-nowrap theme-secondary rounded lf-link-cursor"
// 																					tooltip={calender.tooltip}
// 																					flow={calender.tooltip_flow}>
// 																					<DatePicker
// 																						tooltip="Calender"
// 																						flow="down"
// 																						className="d-inline-block"
// 																						customInput={
// 																							<i className="far fa-calendar-alt" />
// 																						}
// 																						onChange={(e) => {
// 																							const date =
// 																								moment(e).format('YYYY-MM-DD');
// 																							window.location.href = `/reports/${this.project_id}/${rp?.log_name}/${fr?._id}?${rp?.log_date}=${date}&name=${fr?.description}`;
// 																						}}
// 																						filterDate={(date) => {
// 																							let dateNew = new Date(
// 																								moment(date).format(
// 																									'YYYY-MM-DD',
// 																								),
// 																							);

// 																							let startDate = new Date(
// 																								moment(
// 																									fr?.start_date ||
// 																										fr.createdAt,
// 																								).format('YYYY-MM-DD'),
// 																							);

// 																							let endDate = fr?.end_date
// 																								? new Date(
// 																										moment(fr?.end_date).format(
// 																											'YYYY-MM-DD',
// 																										),
// 																								  )
// 																								: new Date(
// 																										moment().format(
// 																											'YYYY-MM-DD',
// 																										),
// 																								  );

// 																							return (
// 																								dateNew.getTime() >=
// 																									startDate.getTime() &&
// 																								dateNew.getTime() <=
// 																									endDate.getTime() &&
// 																								new Date(
// 																									moment(dateNew).format(
// 																										'YYYY-MM-DD',
// 																									),
// 																								) <=
// 																									new Date(
// 																										moment(new Date()).format(
// 																											'YYYY-MM-DD',
// 																										),
// 																									)
// 																							);
// 																							// return startDate <= date.getTime() && (endDate <= date.getTime() && startDate <= endDate);
// 																						}}
// 																					/>
// 																				</span>
// 																			)}
// 																			{rp?.name === 'store room log' ? (
// 																				<DownloadReport
// 																					store_room_id={fr?._id}
// 																					type="store room log"
// 																				/>
// 																			) : rp.name === 'material log' ? (
// 																				<DownloadReport
// 																					material_log_id={fr?._id}
// 																					type="material log"
// 																				/>
// 																			) : rp.name === 'survey report' ? (
// 																				<DownloadReport
// 																					final_date={fr?.final_date}
// 																					survey_id={fr?._id}
// 																					type="survey report"
// 																				/>
// 																			) : rp.name ===
// 																			  'laborur & equipment log' ? (
// 																				<DownloadReport
// 																					labour_equipment_log_id={fr?._id}
// 																					type="laborur and equipment log"
// 																				/>
// 																			) : (
// 																				''
// 																			)}
// 																			{rp.name === 'store room log' ? (
// 																				<CreateStoreRoom
// 																					type={'update'}
// 																					storeInfo={fr}>
// 																					<span
// 																						className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
// 																						tooltip={icon_edit.tooltip}
// 																						flow={icon_edit.tooltip_flow}>
// 																						<i className="fas fa-edit"></i>
// 																					</span>
// 																				</CreateStoreRoom>
// 																			) : rp.name === 'survey report' ? (
// 																				<UpdateSurveyReport
// 																					surveyInfo={fr}
// 																					data={fr?._id}
// 																					onlyinfo={'onlyinfo'}
// 																				/>
// 																			) : // <span className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"  onClick={() => this.setSelectetdSurveyReport(fr)} ><i className="fas fa-edit"></i></span>
// 																			rp.name === 'laborur & equipment log' ? (
// 																				<CreateLabourEquipmentLog
// 																					type={'Update'}
// 																					onlyinfo={'onlyinfo'}
// 																					data={fr}>
// 																					<span
// 																						className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
// 																						tooltip={icon_edit.tooltip}
// 																						flow={icon_edit.tooltip_flow}>
// 																						<i className="fas fa-edit"></i>
// 																					</span>
// 																				</CreateLabourEquipmentLog>
// 																			) : rp.name === 'material log' ? (
// 																				<MaterialInfo type={'Update'} data={fr}>
// 																					<span
// 																						className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
// 																						tooltip={icon_edit.tooltip}
// 																						flow={icon_edit.tooltip_flow}>
// 																						<i className="fas fa-edit"></i>
// 																					</span>
// 																				</MaterialInfo>
// 																			) : (
// 																				<span
// 																					className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
// 																					tooltip={icon_edit.tooltip}
// 																					flow={icon_edit.tooltip_flow}>
// 																					<i className="fas fa-edit"></i>
// 																				</span>
// 																			)}
// 																			<span
// 																				className="theme-btnbg theme-secondary rounded lf-link-cursor"
// 																				tooltip={icon_delete.tooltip}
// 																				flow={icon_delete.tooltip_flow}
// 																				onClick={() => {
// 																					Swal.fire({
// 																						title: `Are you sure?`,
// 																						text: `You will not be able to recover this ${rp?.name}!`,
// 																						icon: 'question',
// 																						reverseButtons: true,
// 																						showCancelButton: true,
// 																						confirmButtonColor: '#dc3545',
// 																						cancelButtonColor: '#28a745',
// 																						confirmButtonText:
// 																							'Yes, delete it!',
// 																					}).then((result) => {
// 																						if (result.isConfirmed) {
// 																							this.deleteSpecificReports(
// 																								[fr?._id],
// 																								rp.key,
// 																							);
// 																						}
// 																					});
// 																				}}>
// 																				<i className="fas fa-trash-alt "></i>
// 																			</span>
// 																		</td>
// 																	</tr>
// 																);
// 															})
// 													)}
// 												</Fragment>
// 											);
// 										})}
// 									</tbody>
// 								</table>
// 							</div>
// 						</div>
// 					</div>
// 				)}
// 			</Layout>
// 		);
// 	}
// }

const Report = (props) => {
	const { dispatch, surveyReport, storeroom, materialLog, labourAndequipment } =
		props;
	const userId = getUserId(); // Assuming getUserId is a function you have defined elsewhere
	const project_id = props.router?.params.project_id;
	let searchDataSource = [];
	const sortingList = [
		`A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` New ${String.fromCharCode(60)} Old`,
		` Old ${String.fromCharCode(60)} New`,
	];
	const {
		calender,
		icon_edit,
		icon_delete,
		description,
		assigee,
		created_by,
		frequency,
	} = getSiteLanguageData('reports/toolbar');
	const { end_date, start_date, location, action } =
		getSiteLanguageData('commons');
	const { available } = getSiteLanguageData('material');

	const report = [
		{
			id: '1',
			name: 'survey report',
			log_name: 'fieldReportInfo',
			log_date: 'report_date',
			data: surveyReport,
			key: 'survey_report_request_id',
		},
		{
			id: '2',
			name: 'store room log',
			log_name: 'storeRoomLog',
			log_date: 'store_room_log_date',
			data: storeroom,
			key: 'store_room_log_id',
		},
		{
			id: '3',
			name: 'material log',
			log_name: 'materialLog',
			log_date: 'material_date',
			data: materialLog,
			key: 'material_log_id',
		},
		{
			id: '4',
			name: 'laborur & equipment log',
			log_name: 'labour_log',
			log_date: 'labour_equipment_log_date',
			data: labourAndequipment,
			key: 'laborur_and_equipment_log_id',
		},
		/* {
			id: '5',
			name: 'inspection request',
			log_name: 'inspection_request_log',
			log_date: 'inspection_request_date',
			data: [],
			key:"inspection_request_id"
		},
		{
			id: '6',
			name: 'timesheet',
			log_name: 'timesheet_log',
			log_date: 'timesheet_date',
			data: [],
			key:"timesheet"
		}, */
	];

	const [selectedSurveyReport, setSelectedSurveyReport] = useState({});
	const [collapsibleData, setCollapsibleData] = useState({});
	const [multiSelect, setMultiSelect] = useState([]);
	const [selectedReportsLogs, setSelectedReportsLogs] = useState({
		survey_report_request_id: [],
		store_room_log_id: [],
		material_log_id: [],
		laborur_and_equipment_log_id: [],
		inspection_request_id: [],
		timesheet: [],
	});
	const [sortType, setSortType] = useState('3');
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		dispatch(getSurveyReport(project_id));
		dispatch(getStoreRoom(project_id));
		dispatch(getMaterialsLogList(project_id));
		dispatch(getlabourAndequipmentByProjectId(project_id));
	}, [dispatch, project_id]);

	const manageCollapsibleData = (collapsibleData) => {
		setCollapsibleData(collapsibleData);
	};

	const clearLogIds = () => {
		handleMultiSelect([]);
		setSelectedReportsLogs({
			survey_report_request_id: [],
			store_room_log_id: [],
			material_log_id: [],
			laborur_and_equipment_log_id: [],
			inspection_request_id: [],
			timesheet: [],
		});
	};

	const deleteSpecificReports = (ids, key) => {
		if ('survey_report_request_id' === key) {
			props.dispatch(
				deleteSurveyReport(
					{
						project_id: project_id,
						survey_report_request_id: ids,
					},
					clearLogIds,
				),
			);
		} else if ('store_room_log_id' === key) {
			props.dispatch(
				deleteStoreRoom(
					{
						project_id: project_id,
						store_room_id: ids,
					},
					clearLogIds,
				),
			);
		} else if ('material_log_id' === key) {
			props.dispatch(
				deleteMaterialsLog(
					{
						project_id: project_id,
						material_log_id: ids,
					},
					clearLogIds,
				),
			);
		} else if ('laborur_and_equipment_log_id' === key) {
			props.dispatch(
				deleteLabourAndEquipmentLog(
					{
						project_id: project_id,
						labour_equipment_log_id: ids,
					},
					clearLogIds,
				),
			);
		}
	};

	const deleteReport = (e) => {
		props.dispatch(
			deleteSurveyReport(
				{
					...selectedReportsLogs,
					project_id: project_id,
				},
				(resData) => {
					clearLogIds();
				},
			),
		);
	};

	const handleMultiSelectReportLog = (repIds, reportName, mSelect) => {
		let logName = '';
		if (reportName == 'survey report') logName = 'survey_report_request_id';
		else if (reportName.toLowerCase() == 'store room log')
			logName = 'store_room_log_id';
		else if (reportName.toLowerCase() == 'material log')
			logName = 'material_log_id';
		else if (reportName.toLowerCase() == 'laborur & equipment log')
			logName = 'laborur_and_equipment_log_id';
		else if (reportName.toLowerCase() == 'inspection request')
			logName = 'inspection_request_id';
		else if (reportName.toLowerCase() == 'timesheet') logName = 'timesheet_id';
		/* this.setState({
			...this.state.selectedReportsLogs,
			[logName]:repIds
		}) */
		let ids = [];
		if (!Array.isArray(repIds)) {
			if (typeof selectedReportsLogs[logName] != 'undefined') {
				if (selectedReportsLogs[logName].includes(repIds)) {
					ids = selectedReportsLogs[logName].filter((p) => p != repIds);
				} else {
					ids = selectedReportsLogs[logName];
					ids.push(repIds);
				}
			}
		} else if (Array.isArray(repIds)) {
			ids = repIds;
		}

		setSelectedReportsLogs({
			...selectedReportsLogs,
			[logName]: ids,
		});
	};

	const handleMultiSelect = (multiSelect, reportName) => {
		setMultiSelect(multiSelect);
	};

	const handleSortType = (sortType) => {
		setSortType(sortType);
	};

	const navigateToDetailsPage = (rp, fr) => {
		const { dispatch } = props;
		let cDate = new Date(moment(new Date()).format('YYYY-MM-DD'));
		if (rp.name === 'survey report') {
			let datet = fr?.final_date?.find(
				(x) =>
					moment(x).format('YYYY-MM-DD') ==
					moment(new Date()).format('YYYY-MM-DD'),
			);
			if (!datet) {
				let lastDate = fr?.final_date.slice(-1)
					? new Date(fr?.final_date.slice(-1))
					: cDate;
				if (new Date(fr?.final_date[0]) < cDate && lastDate <= cDate) {
					datet = lastDate;
				} else if (new Date(fr?.final_date[0]) > cDate) {
					datet = new Date(fr?.final_date[0]);
				} else {
					datet = cDate;
				}
			}

			if (fr.frequency != 'Daily') {
				datet = fr?.final_date?.filter(
					(x) =>
						new Date(moment(new Date(x)).format('YYYY-MM-DD')) <=
						new Date(moment(new Date()).format('YYYY-MM-DD')),
				);

				if (datet && Array.isArray(datet) && datet.length > 0) {
					datet = datet[datet.length - 1];
				}
			}

			dispatch(getSurveyRequestDetails(fr._id));
			props.router.navigate(
				`/reports/${project_id}/${rp?.log_name}/${fr?._id}?${
					rp?.log_date
				}=${moment(datet).format('YYYY-MM-DD')}`,
			);
		} else {
			let dateArr = [];
			let i = 0;
			let frStartDate = new Date(fr.start_date);
			dateArr.push(frStartDate);
			while (frStartDate < new Date(fr.end_date)) {
				frStartDate = new Date(moment(frStartDate).add(1, 'day'));
				dateArr.push(frStartDate);
			}

			let datet = dateArr?.find(
				(x) =>
					moment(x).format('YYYY-MM-DD') ==
					moment(new Date()).format('YYYY-MM-DD'),
			);

			if (!datet) {
				let lastDate = dateArr.slice(-1) ? new Date(dateArr.slice(-1)) : cDate;
				if (new Date(dateArr[0]) < cDate && lastDate <= cDate) {
					datet = lastDate;
				} else if (new Date(dateArr[0]) > cDate) {
					datet = new Date(dateArr[0]);
				} else {
					datet = cDate;
				}
			}

			props.router.navigate(
				`/reports/${project_id}/${rp?.log_name}/${fr?._id}?${
					rp?.log_date
				}=${moment(datet).format('YYYY-MM-DD')}&name=${fr?.description}`,
			);
		}
	};

	const renderDayContents = (day, date, fr) => {
		const tooltipText = `Tooltip for date: ${date}`;
		const cdate = moment(date).format('YYYY-MM-DD');
		const vb = fr?.final_date?.filter(
			(x) => moment(x).format('YYYY-MM-DD') === cdate,
		);

		return (
			<span title={tooltipText}>
				{moment(date).date()}
				{vb.length > 0 ? <span className="fw-icon-dot"></span> : ''}
			</span>
		);
	};


	report?.forEach((slist) => {
		searchDataSource = searchDataSource.concat(
			slist?.data?.map((d) => ({
				...d,
				report_type: slist?.name,
				log_name: slist?.log_name,
				log_date: slist?.log_date,
			})),
		);
	});

	return (
		<>
			<Layout>
				{selectedSurveyReport?._id ? (
					<UpdateSurveyReport
						surveyInfo={selectedSurveyReport}
						hideBtn={true}
						type={'update'}
						handleClose={() => {
							setSelectedSurveyReport({});
						}}
					/>
				) : (
					''
				)}

				{report?.length === 0 ? (
					<Nodata type="Report" />
				) : (
					<div id="page-content-wrapper">
						<SheetToolBar
							deleteReport={deleteReport}
							searchDataSource={searchDataSource}
							sortingList={sortingList}
							sortType={sortType}
							handleSortType={handleSortType}
							multiSelect={multiSelect}
						/>
						<div className="container-fluid">
							<div className="theme-table-wrapper no-bg mt-3 mb-0 scroll-y">
								<table className="table table-hover theme-table">
									<thead className="theme-table-title text-nowrap text-center bg-light">
										<tr>
											<th className="lf-w-50 mx-3">
												{/* <FormCheck className="invisible" /> */}
											</th>
											<th className="lf-w-500 text-start pe-2">
												{description?.text}
											</th>
											<th className="lf-w-250 text-start">{assigee?.text}</th>
											<th className="lf-w-100 text-start">
												{created_by?.text}
											</th>
											<th className="lf-w-250">{start_date?.text}</th>
											<th className="lf-w-250">{end_date?.text}</th>
											<th className="lf-w-140 m-w-140 text-start">
												{frequency?.text}
											</th>
											<th className="lf-w-250 text-start">{location?.text}</th>
											<th className="lf-w-400 text-end pe-5">{action?.text}</th>
										</tr>
									</thead>

									<tbody>
										{report?.map((rp, k) => {
											return (
												<Fragment key={k}>
													<tr
														className={`theme-table-data-row ${
															!collapsibleData?.[rp.id]
																? 'bg-light'
																: 'bg-transparent'
														}`}>
														<td className="text-center lf-w-50">
															<FormCheck
																className={`mx-3 ${
																	rp.data?.length === 0
																		? 'invisible '
																		: 'visible'
																}`}
																type="checkbox"
																name="Report"
																onChange={({ target: { checked } }) => {
																	let newArr = [...multiSelect];
																	rp?.data?.forEach((p) => {
																		if (checked === true) {
																			newArr.push(p._id);
																		} else {
																			newArr = newArr.filter(
																				(d) => d !== p._id,
																			);
																		}
																	});

																	let reportId = checked
																		? rp?.data?.map((p) => p._id)
																		: [];
																	handleMultiSelect(newArr, rp.name);
																	handleMultiSelectReportLog(
																		reportId,
																		rp.name,
																		newArr,
																	);
																}}
																checked={rp?.data?.every((d) =>
																	multiSelect.includes(d._id),
																)}
															/>
														</td>
														<td colSpan={8}>
															<h6
																className="lf-link-cursor mb-0 mt-1 text-dark d-inline-block"
																onClick={() =>
																	manageCollapsibleData({
																		...collapsibleData,
																		[rp.id]: !collapsibleData?.[rp.id],
																	})
																}>
																<span className="ms-1 fw-bold text-capitalize ls-md">
																	{rp.name}({rp.data?.length})
																</span>

																<span className="ms-1">
																	<i
																		className={
																			!collapsibleData?.[rp.id]
																				? 'fas  fa-caret-down text-secondary p-1'
																				: 'fas fa-caret-right text-secondary p-1 ms-1 '
																		}></i>
																</span>
															</h6>
															<span className="ms-1">
																{selectedReportsLogs[rp.key] &&
																Array.isArray(
																	selectedReportsLogs[rp.key],
																) &&
																selectedReportsLogs[rp.key]
																	.length ? (
																	<span
																		className="theme-btnbg theme-secondary rounded lf-link-cursor"
																		tooltip={icon_delete.tooltip}
																		flow={icon_delete.tooltip_flow}
																		onClick={() => {
																			Swal.fire({
																				title: `Are you sure?`,
																				text: `You will not be able to recover this ${rp?.name}!`,
																				icon: 'question',
																				reverseButtons: true,
																				showCancelButton: true,
																				confirmButtonColor: '#dc3545',
																				cancelButtonColor: '#28a745',
																				confirmButtonText: 'Yes, delete it!',
																			}).then((result) => {
																				if (result.isConfirmed) {
																					deleteSpecificReports(
																						selectedReportsLogs[
																							rp.key
																						],
																						rp.key,
																					);
																				}
																			});
																		}}>
																		<i className="fas fa-trash-alt "></i>
																	</span>
																) : (
																	''
																)}
															</span>
															{rp.key === 'survey_report_request_id' ? (
																<span className="ms-1">
																	<CreatSurveyReport />
																</span>
															) : (
																''
															)}

															{rp.key === 'store_room_log_id' ? (
																<span className="ms-1">
																	<CreateStoreRoom />
																</span>
															) : (
																''
															)}

															{rp.key === 'material_log_id' ? (
																<span className="ms-1">
																	<MaterialInfo />
																</span>
															) : (
																''
															)}

															{rp.key === 'laborur_and_equipment_log_id' ? (
																<span className="ms-1">
																	<CreateLabourEquipmentLog />
																</span>
															) : (
																''
															)}
														</td>
													</tr>
													{rp?.data?.length === 0 ? (
														<tr
															className={`theme-table-data-row bg-white text-center lf-text-vertical-align ${
																!collapsibleData?.[rp.id] === true
																	? ''
																	: 'd-none'
															}`}>
															<td className="text-capitalize" colSpan={9}>
																No {`${rp?.name}`} {available.text}
															</td>
														</tr>
													) : (
														rp?.data
															?.sort((a, b) => {
																if (sortType === '1') {
																	return a?.description.localeCompare(
																		b?.description,
																	);
																}
																if (sortType === '2') {
																	return b?.description.localeCompare(
																		a?.description,
																	);
																}
																if (sortType === '3') {
																	return (
																		new Date(b.createdAt) -
																		new Date(a.createdAt)
																	);
																}
																if (sortType === '4') {
																	return (
																		new Date(a.createdAt) -
																		new Date(b.createdAt)
																	);
																}
																return true;
															})
															?.map((fr, k) => {
																const datet = fr?.final_date
																	?.filter(
																		(x) => moment(x).toDate() < new Date(),
																	)
																	.slice(-1);
																return (
																	<tr
																		key={k}
																		className={`theme-table-data-row lf-text-vertical-align lf-task-color bg-white ${
																			!collapsibleData?.[rp.id] ? ' ' : 'd-none'
																		}`}>
																		<td className="lf-w-50 text-center">
																			<FormCheck
																				type="checkbox"
																				name="plan_id"
																				className={`mx-3 ${
																					multiSelect.length > 0
																						? 'visible'
																						: ''
																				}`}
																				onChange={({ target: { checked } }) => {
																					let newArr = [...multiSelect];
																					if (checked === true) {
																						newArr.push(fr?._id);
																					} else {
																						newArr = newArr.filter(
																							(d) => d !== fr?._id,
																						);
																					}
																					handleMultiSelect(
																						newArr,
																						rp.name,
																					);

																					handleMultiSelectReportLog(
																						fr?._id,
																						rp.name,
																						newArr,
																					);
																				}}
																				checked={multiSelect.includes(fr?._id)}
																				value={fr?._id}
																			/>
																		</td>
																		<td
																			className="lf-w-350 align-middle pe-2"
																			onClick={() => {
																				navigateToDetailsPage(rp, fr);
																			}}>
																			<span className="lf-text-overflow-350 align-middle">
																				{fr?.description}
																			</span>
																		</td>
																		<td
																			className="text-start text-secondary lf-text-vertical-align lf-w-200"
																			onClick={() => {
																				navigateToDetailsPage(rp, fr);
																			}}>
																			<div className="lf-text-overflow-100 align-middle">
																				{' '}
																				{fr?.assigee.length > 0
																					? fr?.assigee
																							?.map((as) => {
																								return ` ${as?.first_name} ${as?.last_name}`;
																							})
																							.join(',')
																					: fr?.assigee?.first_name +
																					  ' ' +
																					  fr?.assigee?.last_name}
																			</div>
																		</td>
																		<td
																			className="text-start text-secondary text-nowrap lf-text-vertical-align lf-w-100 "
																			onClick={() => {
																				navigateToDetailsPage(rp, fr);
																			}}>
																			{(
																				fr?.createdBy?.first_name +
																				' ' +
																				fr?.createdBy?.last_name
																			).length > 15
																				? (
																						fr?.createdBy?.first_name +
																						' ' +
																						fr?.createdBy?.last_name
																				  ).substring(0, 13) + '...'
																				: fr?.createdBy?.first_name +
																				  ' ' +
																				  fr?.createdBy?.last_name}
																		</td>
																		<td
																			className="text-center text-secondary text-nowrap  lf-text-vertical-align lf-w-250 "
																			onClick={() => {
																				navigateToDetailsPage(rp, fr);
																			}}>
																			<span className="ms-1">
																				{' '}
																				{fr?.start_date ? (
																					<CustomDate date={fr?.start_date} />
																				) : (
																					<CustomDate date={fr?.createdAt} />
																				)}
																			</span>
																		</td>
																		<td
																			className="text-center text-secondary text-nowrap lf-text-vertical-align lf-w-250 "
																			onClick={() => {
																				navigateToDetailsPage(rp, fr);
																			}}>
																			<span className="mx-3">
																				{' '}
																				{fr?.end_date ? (
																					<CustomDate date={fr?.end_date} />
																				) : (
																					''
																				)}
																			</span>
																		</td>
																		<td
																			className="text-start text-secondary lf-text-vertical-align lf-w-250"
																			onClick={() => {
																				navigateToDetailsPage(rp, fr);
																			}}>
																			{fr?.frequency
																				? fr?.frequency?.split('_')?.join(' ')
																				: ''}
																		</td>
																		<td
																			className="text-start text-secondary lf-text-vertical-align lf-w-200"
																			onClick={() => {
																				navigateToDetailsPage(rp, fr);
																			}}>
																			<span className="lf-text-overflow-110 align-middle ">
																				{fr?.location.length > 0
																					? (fr?.location)
																							.map((as, k) => {
																								return ` ${as?.name}`;
																							})
																							.join(',')
																					: fr?.location?.name}
																			</span>
																		</td>
																		<td className="text-secondary text-end text-nowrap lf-w-400 lf-text-vertical-align pe-4 ">
																			{rp.name === 'survey report' ? (
																				<span
																					className="theme-btnbg lf-reports-icon-parent me-2 react-datepicker__input-container text-nowrap theme-secondary rounded lf-link-cursor"
																					tooltip={calender.tooltip}
																					flow={calender.tooltip_flow}>
																					<DatePicker
																						customInput={
																							<i
																								className="far fa-calendar-alt"
																								title="calendar"
																							/>
																						}
																						dateFormat={'Y-MM-d'}
																						renderDayContents={(day, date) =>
																							renderDayContents(day, date, fr)
																						}
																						filterDate={(date) => {
																							let dateNew = new Date(
																								moment(date).format(
																									'YYYY-MM-DD',
																								),
																							);
																							if (
																								typeof fr?.start_date ==
																									'undefined' ||
																								!fr?.start_date
																							)
																								return false;
																							let startDate = new Date(
																								moment(fr?.start_date).format(
																									'YYYY-MM-DD',
																								),
																							).getTime();
																							let endDate = (
																								fr?.end_date
																									? new Date(
																											moment(
																												fr?.end_date,
																											).format('YYYY-MM-DD'),
																									  )
																									: new Date()
																							).getTime();
																							let finalDates =
																								fr?.final_date &&
																								Array.isArray(fr?.final_date) &&
																								fr?.final_date.length > 0
																									? fr?.final_date.map(
																											(fnDate) =>
																												moment(fnDate).format(
																													'YYYY-MM-DD',
																												),
																									  )
																									: [];
																							return (
																								dateNew.getTime() >=
																									startDate &&
																								dateNew.getTime() <= endDate &&
																								new Date(
																									moment(dateNew).format(
																										'YYYY-MM-DD',
																									),
																								) <=
																									new Date(
																										moment(new Date()).format(
																											'YYYY-MM-DD',
																										),
																									) &&
																								finalDates.includes(
																									moment(dateNew).format(
																										'YYYY-MM-DD',
																									),
																								)
																							);
																							// return startDate <= date.getTime() && (endDate <= date.getTime() && startDate <= endDate);
																						}}
																						onChange={(e) => {
																							const date =
																								moment(e).format('YYYY-MM-DD');
																							const vb = fr?.final_date?.filter(
																								(x) =>
																									moment(x).format(
																										'YYYY-MM-DD',
																									) === date,
																							);
																							if (vb.length > 0) {
																								window.location.href = `/reports/${project_id}/fieldReportInfo/${fr?._id}?report_date=${date}`;
																							} else {
																								errorNotification(
																									'Please Select valid date',
																								);
																							}
																						}}
																					/>
																				</span>
																			) : (
																				<span
																					className="theme-btnbg lf-reports-icon-parent me-2 react-datepicker__input-container text-nowrap theme-secondary rounded lf-link-cursor"
																					tooltip={calender.tooltip}
																					flow={calender.tooltip_flow}>
																					<DatePicker
																						tooltip="Calender"
																						flow="down"
																						className="d-inline-block"
																						customInput={
																							<i className="far fa-calendar-alt" />
																						}
																						onChange={(e) => {
																							const date =
																								moment(e).format('YYYY-MM-DD');
																							window.location.href = `/reports/${project_id}/${rp?.log_name}/${fr?._id}?${rp?.log_date}=${date}&name=${fr?.description}`;
																						}}
																						filterDate={(date) => {
																							let dateNew = new Date(
																								moment(date).format(
																									'YYYY-MM-DD',
																								),
																							);

																							let startDate = new Date(
																								moment(
																									fr?.start_date ||
																										fr.createdAt,
																								).format('YYYY-MM-DD'),
																							);

																							let endDate = fr?.end_date
																								? new Date(
																										moment(fr?.end_date).format(
																											'YYYY-MM-DD',
																										),
																								  )
																								: new Date(
																										moment().format(
																											'YYYY-MM-DD',
																										),
																								  );

																							return (
																								dateNew.getTime() >=
																									startDate.getTime() &&
																								dateNew.getTime() <=
																									endDate.getTime() &&
																								new Date(
																									moment(dateNew).format(
																										'YYYY-MM-DD',
																									),
																								) <=
																									new Date(
																										moment(new Date()).format(
																											'YYYY-MM-DD',
																										),
																									)
																							);
																							// return startDate <= date.getTime() && (endDate <= date.getTime() && startDate <= endDate);
																						}}
																					/>
																				</span>
																			)}
																			{rp?.name === 'store room log' ? (
																				<DownloadReport
																					store_room_id={fr?._id}
																					type="store room log"
																				/>
																			) : rp.name === 'material log' ? (
																				<DownloadReport
																					material_log_id={fr?._id}
																					type="material log"
																				/>
																			) : rp.name === 'survey report' ? (
																				<DownloadReport
																					final_date={fr?.final_date}
																					survey_id={fr?._id}
																					type="survey report"
																				/>
																			) : rp.name ===
																			  'laborur & equipment log' ? (
																				<DownloadReport
																					labour_equipment_log_id={fr?._id}
																					type="laborur and equipment log"
																				/>
																			) : (
																				''
																			)}
																			{rp.name === 'store room log' ? (
																				<CreateStoreRoom
																					type={'update'}
																					storeInfo={fr}>
																					<span
																						className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
																						tooltip={icon_edit.tooltip}
																						flow={icon_edit.tooltip_flow}>
																						<i className="fas fa-edit"></i>
																					</span>
																				</CreateStoreRoom>
																			) : rp.name === 'survey report' ? (
																				<UpdateSurveyReport
																					surveyInfo={fr}
																					data={fr?._id}
																					onlyinfo={'onlyinfo'}
																				/>
																			) : // <span className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"  onClick={() => this.setSelectetdSurveyReport(fr)} ><i className="fas fa-edit"></i></span>
																			rp.name === 'laborur & equipment log' ? (
																				<CreateLabourEquipmentLog
																					type={'Update'}
																					onlyinfo={'onlyinfo'}
																					data={fr}>
																					<span
																						className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
																						tooltip={icon_edit.tooltip}
																						flow={icon_edit.tooltip_flow}>
																						<i className="fas fa-edit"></i>
																					</span>
																				</CreateLabourEquipmentLog>
																			) : rp.name === 'material log' ? (
																				<MaterialInfo type={'Update'} data={fr}>
																					<span
																						className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
																						tooltip={icon_edit.tooltip}
																						flow={icon_edit.tooltip_flow}>
																						<i className="fas fa-edit"></i>
																					</span>
																				</MaterialInfo>
																			) : (
																				<span
																					className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
																					tooltip={icon_edit.tooltip}
																					flow={icon_edit.tooltip_flow}>
																					<i className="fas fa-edit"></i>
																				</span>
																			)}
																			<span
																				className="theme-btnbg theme-secondary rounded lf-link-cursor"
																				tooltip={icon_delete.tooltip}
																				flow={icon_delete.tooltip_flow}
																				onClick={() => {
																					Swal.fire({
																						title: `Are you sure?`,
																						text: `You will not be able to recover this ${rp?.name}!`,
																						icon: 'question',
																						reverseButtons: true,
																						showCancelButton: true,
																						confirmButtonColor: '#dc3545',
																						cancelButtonColor: '#28a745',
																						confirmButtonText:
																							'Yes, delete it!',
																					}).then((result) => {
																						if (result.isConfirmed) {
																							deleteSpecificReports(
																								[fr?._id],
																								rp.key,
																							);
																						}
																					});
																				}}>
																				<i className="fas fa-trash-alt "></i>
																			</span>
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
			</Layout>
		</>
	);
};

export default withRouter(
	connect((state) => {
		return {
			surveyReport: state?.report?.[GET_SURVEY_REPORT]?.result,
			storeroom: state?.storeroom?.[GET_STORE_ROOM]?.result,
			materialLog: state?.storeroom?.[GET_MATERIAL_LOG_LIST]?.result,
			labourAndequipment:
				state?.report?.[GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID]?.result,
		};
	})(Report),
);
