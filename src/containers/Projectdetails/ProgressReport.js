import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import { GET_ALL_ROLE_WISE_PEOPLE } from '../../store/actions/actionType';
import getUserId, { sweetAlert, getSiteLanguageData } from '../../commons';
import Loading from '../../components/loadig';

import { Button, Card, Col, Row } from 'react-bootstrap';
import {
	getStoreRoomList,
	getMaterialsLogList,
	labourAndEquipmentLogList,
	generateDPR,
} from '../../store/actions/projects';
import moment from 'moment';
import { unlockReport } from '../../store/actions/report';
import banner from '../../images/dashboard/banner.png';
import DatePicker from 'react-datepicker';
import ShareFile from '../../components/shareFile';

function ProgressReport() {
	// declaration
	const dispatch = useDispatch();
	const { project_id } = useParams();
	const userId = getUserId();

	const [storeRoomList, setStoreRoomList] = useState([]);
	const [storeRoomView, setStoreRoomView] = useState(false);
	const [materialLogList, setMaterialLogList] = useState([]);
	const [materialLogView, setMaterialLogView] = useState(false);
	const [labourAndEqLogList, setLabourAndEqLogList] = useState([]);
	const [labourEqLogView, setLabourEqLogView] = useState(false);
	const [reportConfig, setReportConfig] = useState({
		report_type: [],
		from_date: new Date(),
		to_date: new Date(),
	});
	const [showShareModel, setShowShareModel] = useState(false);
	const [shareLink, setShareLink] = useState('');

	const handleChange = (name, value) => {
		setReportConfig({
			...reportConfig,
			[name]: value,
		});
	};

	useEffect(() => {
		getStoreRoomListHandle();
		getMaterialLogListHandle();
		getLabourAndEqLogListHandle();
	}, []);

	const getStoreRoomListHandle = () => {
		dispatch(
			getStoreRoomList(project_id, (resData) => {
				setStoreRoomList(resData);
			}),
		);
	};

	const getMaterialLogListHandle = () => {
		dispatch(
			getMaterialsLogList(project_id, (resData) => {
				setMaterialLogList(resData);
			}),
		);
	};

	const getLabourAndEqLogListHandle = () => {
		dispatch(
			labourAndEquipmentLogList(project_id, (resData) => {
				setLabourAndEqLogList(resData);
			}),
		);
	};

	const handleSubmitReport = () => {
		let post = {
			...reportConfig,
			user_id: userId,
			project_id: project_id,
		};

		if (post.dpr_days == 'today') {
			post.from_date = moment().format('YYYY-MM-DD');
			post.to_date = moment().format('YYYY-MM-DD');
		} else if (post.dpr_days == '7_days') {
			post.from_date = moment().subtract(7, 'days').format('YYYY-MM-DD');
			post.to_date = moment().format('YYYY-MM-DD');
		} else if (post.dpr_days == '15_days') {
			post.from_date = moment().subtract(15, 'days').format('YYYY-MM-DD');
			post.to_date = moment().format('YYYY-MM-DD');
		}

		if (post.from_date)
			post.from_date = moment(post.from_date).format('YYYY-MM-DD');
		if (post.to_date) post.to_date = moment(post.to_date).format('YYYY-MM-DD');

		hendleShowShereModel();
		setShareLink('');
		dispatch(
			generateDPR(post, (resData) => {
				if (resData) {
					handleSharableLink(resData);
				} else {
					setShowShareModel(false);
				}
			}),
		);
	};

	const hendleShowShereModel = () => {
		setShowShareModel(!showShareModel);
	};

	const handleSharableLink = (data) => {
		setShareLink(data);
	};

	const {
		generate_progress_report,
		today,
		days,
		specific_data,
		work_progress,
        issue_raised,
        store_room_details,
        material_log_details,
        labour_equipment_log,
        generate
	} = getSiteLanguageData('reports/toolbar');

	return (
		<div className="white-box">
			<Row className="">
				<div className={`col-12`}>
					<label className="white-box-label">
						{generate_progress_report.text}
					</label>
				</div>
			</Row>
			<Row className="">
				<div className={`col-sm-12 col-md-5 border-end`}>
					<div className="mb-2">
						<label
							className="radio-orange d-inline"
							style={{ fontSize: '12px', marginBottom: '0px' }}>
							{today.text}
							<input
								type="radio"
								name="dpr_days"
								defaultChecked={true}
								checked={
									reportConfig.dpr_days === 'today' || !reportConfig.dpr_days
								}
								value={'today'}
								onChange={(e) => {
									handleChange('dpr_days', e.target.value);
								}}
							/>
							<span
								onClick={() => {
									handleChange('dpr_days', 'today');
								}}
								className="radiokmark mt-1"></span>
						</label>
					</div>
					<div className="mb-2">
						<label
							className="radio-orange d-inline"
							style={{ fontSize: '12px', marginBottom: '0px' }}>
							{`7 ${days.text}`}
							<input
								type="radio"
								name="dpr_days"
								defaultChecked={false}
								checked={reportConfig.dpr_days === '7_days'}
								value={'7_days'}
								onChange={(e) => {
									handleChange('dpr_days', e.target.value);
								}}
							/>
							<span
								onClick={() => {
									handleChange('dpr_days', '7_days');
								}}
								className="radiokmark mt-1"></span>
						</label>
					</div>
					<div className="mb-2">
						<label
							className="radio-orange d-inline"
							style={{ fontSize: '12px', marginBottom: '0px' }}>
							{`15 ${days.text}`}
							<input
								type="radio"
								name="dpr_days"
								defaultChecked={false}
								checked={reportConfig.dpr_days === '15_days'}
								value={'15_days'}
								onChange={(e) => {
									handleChange('dpr_days', e.target.value);
								}}
							/>
							<span
								onClick={() => {
									handleChange('dpr_days', '15_days');
								}}
								className="radiokmark mt-1"></span>
						</label>
					</div>
					<div className="mb-2">
						<div>
							<label
								className="radio-orange d-inline"
								style={{ fontSize: '12px', marginBottom: '0px' }}>
								{specific_data.text}
								<input
									type="radio"
									name="dpr_days"
									defaultChecked={false}
									value={'specific_days'}
									checked={reportConfig.dpr_days === 'specific_days'}
									onChange={(e) => {
										handleChange('dpr_days', e.target.value);
									}}
								/>
								<span
									onClick={() => {
										handleChange('dpr_days', 'specific_days');
									}}
									className="radiokmark mt-1"></span>
							</label>
						</div>
						{reportConfig.dpr_days === 'specific_days' && (
							<div className="d-flex ps-3 mt-2">
								<div className="lfwpr-47 me-1">
									<DatePicker
										className="w-100 input-border"
										customInput={
											<div className="bg-white">
												<i
													className="fas fa-calendar text-secondary"
													style={{
														padding: '12px 5px 12px 5px',
														margin: 0,
													}}></i>
												<span>
													{reportConfig.from_date
														? moment(reportConfig.from_date).format(
																'DD MMM YYYY',
														  )
														: null}
												</span>
											</div>
										}
										// selectsRange={true}
										maxDate={
											reportConfig.to_date
												? moment(reportConfig.to_date).toDate()
												: new Date()
										}
										/* endDate={
                                                info.end_date ? moment(info.end_date).toDate() : null
                                            } */
										dateFormat="dd/MM/yyyy"
										onChange={(e) => {
											handleChange('from_date', e);
										}}
										isClearable={true}
									/>
								</div>

								<div className="lfwpr-47">
									<DatePicker
										className="w-100 input-border"
										customInput={
											<div className="bg-white">
												<i
													className="fas fa-calendar text-secondary"
													style={{
														padding: '12px 5px 12px 5px',
														margin: 0,
													}}></i>
												<span>
													{reportConfig.to_date
														? moment(reportConfig.to_date).format('DD MMM YYYY')
														: null}
												</span>
											</div>
										}
										// selectsRange={true}
										maxDate={new Date()}
										minDate={
											reportConfig.from_date
												? new Date(reportConfig.from_date)
												: new Date()
										}
										dateFormat="dd/MM/yyyy"
										onChange={(e) => {
											handleChange('to_date', e);
											/* if (e[1]) {
                                                    this.handleChange('end_date', e[1]);
                                                } else {
                                                    this.handleChange('start_date', e[0]);
                                                } */
											// this.handleDatesChange(e[0], e[1]);
											// this.handleChange('start_date', e);
											/* this.setState({
                                                    info: {
                                                        ...this.state.info,
                                                        start_date: e
                                                    },
                                                }); */
										}}
										// selected={this.state.info.start_date ? new Date(this.state.info.start_date) : null}
										// onCalendarClose={this.onBlurSubmit}
										isClearable={true}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
				
				<hr className="my-2 d-sm-block d-md-none"/>
				<div className={`col-sm-12 col-md-7`}>
					<div className="mb-2">
						<label
							className="radio-orange d-inline"
							style={{ fontSize: '12px', marginBottom: '0px' }}>
							<input
								type="checkbox"
								name="report_type"
								defaultChecked={false}
								value={'Work Progress'}
								onChange={(e) => {
									let newData = Array.isArray(reportConfig.report_type)
										? reportConfig.report_type
										: [];
									if (e.target.checked) {
										newData.push(e.target.value);
										handleChange('report_type', newData);
									} else {
										newData = newData.filter((v) => v != e.target.value);
										handleChange('report_type', newData);
									}
								}}
							/>
							<span className="radiokmark mt-1"></span>
						</label>{' '}
						{work_progress.text}
					</div>
					<div className="mb-2">
						<label
							className="radio-orange d-inline"
							style={{ fontSize: '12px', marginBottom: '0px' }}>
							<input
								type="checkbox"
								name="report_type"
								defaultChecked={false}
								value={'Issues Raised'}
								onChange={(e) => {
									let newData = Array.isArray(reportConfig.report_type)
										? reportConfig.report_type
										: [];
									if (e.target.checked) {
										newData.push(e.target.value);
										handleChange('report_type', newData);
									} else {
										newData = newData.filter((v) => v != e.target.value);
										handleChange('report_type', newData);
									}
								}}
							/>
							<span className="radiokmark mt-1"></span>
						</label>{' '}
						{issue_raised.text}
					</div>
					<div className="mb-2">
						<div>
							<label
								className="radio-orange d-inline"
								style={{ fontSize: '12px', marginBottom: '0px' }}>
								<input
									type="checkbox"
									name="report_type"
									style={{ left: 0 }}
									defaultChecked={false}
									value={'Store Room Details'}
									onChange={(e) => {
										let newData = Array.isArray(reportConfig.report_type)
											? reportConfig.report_type
											: [];
										if (e.target.checked) {
											newData.push(e.target.value);
											handleChange('report_type', newData);
											handleChange(
												'store_room',
												storeRoomList.map((sr) => sr._id),
											);
										} else {
											newData = newData.filter((v) => v != e.target.value);
											handleChange('report_type', newData);
											handleChange('store_room', []);
										}
									}}
								/>
								<span
									checked={true}
									className={`${
										reportConfig?.report_type?.includes('Store Room Details') &&
										reportConfig?.store_room?.length === storeRoomList?.length
											? 'radiokmark'
											: reportConfig?.store_room?.length > 0 &&
											  storeRoomList?.length > 0 &&
											  reportConfig?.store_room?.length !==
													storeRoomList?.length
											? 'checkmarkhalf'
											: 'radiokmark'
									} mt-1`}></span>
							</label>{' '}
							<span
								className="pointer"
								onClick={() => {
									setStoreRoomView(!storeRoomView);
								}}>
								{store_room_details.text}
								{storeRoomView ? (
									<i className="text-secondary ms-1 fas fa-caret-down"></i>
								) : (
									<i className="text-secondary ms-1 fas fa-caret-right"></i>
								)}
							</span>
						</div>
						<div
							className={`${
								storeRoomView ? '' : 'd-none'
							}  card p-2 ms-3 mt-2`}>
							{storeRoomList &&
								storeRoomList.map((sr) => {
									return (
										<div className="mb-2" key={`sr-${sr._id}`}>
											<label
												className="d-inline pointer"
												style={{ fontSize: '12px', marginBottom: '0px' }}>
												<input
													type="checkbox"
													name="store_room"
													className="theme-bg-checkbox"
													defaultChecked={false}
													checked={
														reportConfig.store_room &&
														reportConfig.store_room.includes(sr._id)
													}
													value={sr._id}
													onChange={(e) => {
														let newData = Array.isArray(reportConfig.store_room)
															? reportConfig.store_room
															: [];
														if (e.target.checked) {
															newData.push(e.target.value);
															handleChange('store_room', newData);
														} else {
															newData = newData.filter(
																(v) => v != e.target.value,
															);
															handleChange('store_room', newData);
														}
													}}
												/>
												{/* <span className="radiokmark mt-1"></span> */}{' '}
												{sr.description}
											</label>
										</div>
									);
								})}
						</div>
					</div>
					<div className="mb-2">
						<div>
							<label
								className="radio-orange d-inline"
								style={{ fontSize: '12px', marginBottom: '0px' }}>
								<input
									type="checkbox"
									name="report_type"
									style={{ left: 0 }}
									defaultChecked={false}
									value={'Material Log Details'}
									onChange={(e) => {
										let newData = Array.isArray(reportConfig.report_type)
											? reportConfig.report_type
											: [];
										if (e.target.checked) {
											newData.push(e.target.value);
											handleChange('report_type', newData);
											handleChange(
												'material_logs',
												materialLogList
													? materialLogList.map((sr) => sr._id)
													: [],
											);
										} else {
											console.log(e.target.value, 'e.target.value');
											newData = newData.filter((v) => v != e.target.value);
											handleChange('report_type', newData);
											handleChange('material_logs', []);
										}
									}}
								/>
								<span
									className={`${
										reportConfig?.report_type?.includes(
											'Material Log Details',
										) &&
										(!reportConfig?.material_logs?.length ||
											reportConfig?.material_logs?.length ==
												materialLogList?.length)
											? 'radiokmark'
											: reportConfig?.report_type?.includes(
													'Material Log Details',
											  )
											? 'checkmarkhalf'
											: 'radiokmark'
									} mt-1`}></span>
							</label>
							<span
								className="pointer"
								onClick={() => {
									setMaterialLogView(!materialLogView);
								}}>
								{material_log_details.text}
								{materialLogView ? (
									<i className="text-secondary ms-1 fas fa-caret-down"></i>
								) : (
									<i className="text-secondary ms-1 fas fa-caret-right"></i>
								)}{' '}
							</span>
						</div>
						<div
							className={`${
								materialLogView ? '' : 'd-none'
							}  card p-2 ms-3 mt-2`}>
							{materialLogList &&
								materialLogList.map((sr) => {
									return (
										<div className="mb-2" key={`mr-${sr._id}`}>
											<label
												className=" d-inline pointer"
												style={{ fontSize: '12px', marginBottom: '0px' }}>
												<input
													type="checkbox"
													className="theme-bg-checkbox"
													name="material_logs"
													checked={
														reportConfig.material_logs &&
														reportConfig.material_logs.includes(sr._id)
													}
													defaultChecked={false}
													value={sr._id}
													onChange={(e) => {
														let newData = Array.isArray(
															reportConfig.material_logs,
														)
															? reportConfig.material_logs
															: [];
														if (e.target.checked) {
															newData.push(e.target.value);
															handleChange('material_logs', newData);
														} else {
															newData = newData.filter(
																(v) => v != e.target.value,
															);
															handleChange('material_logs', newData);
														}
													}}
												/>
												{sr.description}
												{/* <span className="radiokmark mt-1"></span> */}
											</label>
										</div>
									);
								})}
						</div>
					</div>
					<div className="mb-2">
						<div>
							<label
								className="radio-orange d-inline"
								style={{ fontSize: '12px', marginBottom: '0px' }}>
								<input
									type="checkbox"
									style={{ left: 0 }}
									name="report_type"
									defaultChecked={false}
									value={'Labour & Equipment Log'}
									onChange={(e) => {
										let newData = Array.isArray(reportConfig.report_type)
											? reportConfig.report_type
											: [];
										if (e.target.checked) {
											newData.push(e.target.value);
											handleChange('report_type', newData);
											handleChange(
												'labour_and_eq_logs',
												labourAndEqLogList
													? labourAndEqLogList.map((sr) => sr._id)
													: [],
											);
										} else {
											console.log(e.target.value, 'e.target.value');
											newData = newData.filter((v) => v != e.target.value);
											handleChange('report_type', newData);
											handleChange('labour_and_eq_logs', []);
										}
									}}
								/>
								<span
									className={`${
										reportConfig?.report_type?.includes(
											'Labour & Equipment Log',
										) &&
										(!reportConfig?.labour_and_eq_logs?.length ||
											reportConfig?.labour_and_eq_logs?.length ==
												labourAndEqLogList?.length)
											? 'radiokmark'
											: reportConfig?.report_type?.includes(
													'Labour & Equipment Log',
											  )
											? 'checkmarkhalf'
											: 'radiokmark'
									} mt-1`}></span>
							</label>{' '}
							<span
								className="pointer"
								onClick={() => {
									setLabourEqLogView(!labourEqLogView);
								}}>
								{labour_equipment_log.text}
								{labourEqLogView ? (
									<i className="text-secondary ms-1 fas fa-caret-down"></i>
								) : (
									<i className="text-secondary ms-1 fas fa-caret-right"></i>
								)}{' '}
							</span>
						</div>
						<div
							className={`${
								labourEqLogView ? '' : 'd-none'
							}  card p-2 ms-3 mt-2`}>
							{labourAndEqLogList &&
								labourAndEqLogList.map((sr) => {
									return (
										<div className="mb-2" key={`le-${sr._id}`}>
											<label
												className="d-inline pointer"
												style={{ fontSize: '12px', marginBottom: '0px' }}>
												<input
													type="checkbox"
													name="labour_and_eq_logs"
													className="theme-bg-checkbox"
													defaultChecked={false}
													checked={
														reportConfig.labour_and_eq_logs &&
														reportConfig.labour_and_eq_logs.includes(sr._id)
													}
													value={sr._id}
													onChange={(e) => {
														let newData = Array.isArray(
															reportConfig.labour_and_eq_logs,
														)
															? reportConfig.labour_and_eq_logs
															: [];
														if (e.target.checked) {
															newData.push(e.target.value);
															handleChange('labour_and_eq_logs', newData);
														} else {
															newData = newData.filter(
																(v) => v != e.target.value,
															);
															handleChange('labour_and_eq_logs', newData);
														}
													}}
												/>
												{sr.description}
											</label>
										</div>
									);
								})}
						</div>
					</div>
				</div>
				<div className="col-12 text-end">
					<Button
						className="btn-primary text-white"
						onClick={handleSubmitReport}>
						<i className="fa-regular fa-file me-1"></i> {generate.text}
					</Button>
				</div>
			</Row>
			<ShareFile
				open={showShareModel}
				shareLink={shareLink}
				handleClose={hendleShowShereModel}
			/>
		</div>
	);
}

export default ProgressReport;
