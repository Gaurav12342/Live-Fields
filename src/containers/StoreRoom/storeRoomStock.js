import { Component } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/layout';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import {
	GET_PROJECT_DETAILS,
	GET_STORE_ROOM,
	GET_STORE_ROOM_LOG_ID_AND_DATE,
} from '../../store/actions/actionType';
import {
	downloadStoreRoomReport,
	getStoreRoom,
	getStoreRoomListByStoreRoomId,
	signStoreRoomLog,
	deleteStoreRoomAdjustment,
	updateAdjustment,
} from '../../store/actions/storeroom';
import { Dropdown } from 'react-bootstrap';
import IssueMaterial from './issueMaterial';
import CreateMaterial from './createMaterial';
import UpdateMaterial from './updateMaterial';
import { getParameterByName } from '../../helper';
import moment from 'moment';
import CustomSearch from '../../components/CustomSearch';
import SignStoreRoomLog from './signStoreRoomLog';
import { unlockReport } from '../../store/actions/report';
import Nodata from '../../components/nodata';
import ReportInfo from '../Reports/Components/reportInfo';
import { errorNotification } from '../../commons/notification';
import DatePicker from 'react-datepicker';
import Signature from '../../components/signature';
import withRouter from '../../components/withrouter';
import { Link } from 'react-router-dom';
import StoreRoomDetails from './storeRoomDetails';
import Loading from '../../components/loadig';
import UpdateAdjustment from './UpdateAdjustment';
import UpdateIssue from './UpdateIssue';
import GenerateSurveyReport from '../Reports/Components/GenerateSurveyReport';
class StoreRoomStock extends Component {
	constructor(props) {
		super(props);
		this.date = getParameterByName('store_room_log_date');
		this.store_room_log_name = getParameterByName('name');
		this.hide = window.localStorage.getItem('hideBtn');
		this.project_id = this.props.router?.params.project_id;
		this.store_room_id = this.props.router?.params.store_room_id;
		this.userId = getUserId();
		this.state = {
			sortType: '3',
			collapsibleData: {},
			hideBtn: this.hide == 'true' ? true : false,
			newDate: this.date,
			info: {
				store_room_id: this.store_room_id,
				user_id: this.userId,
				show: false,
				project_id: this.project_id,
				report_date: this.date,
				signature_url: '',
				signed_by: this.userId,
			},
			editAdjustmentData: {},
			adjustmentModel: false,
			editIssueData: {},
			issueModel: false,
			showShareModel: false,
			shareLink: null,
			searchText: '',
		};
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getStoreRoomListByStoreRoomId(this.store_room_id, this.date));
		dispatch(getStoreRoom(this.project_id));
	}
	componentDidUpdate(prevProps, prevState) {
		this.hide = window.localStorage.getItem('hideBtn');
		// if (this.hide !== prevProps.hideBtn) {
		//   if (!!data?._id) {
		//     this.setState({

		//     })
		//   }
		// }
	}

	hendleShowShereModel = () => {
		this.setState({ showShareModel: !this.state.showShareModel });
	};

	handleSortType = (sortType) => {
		this.setState(sortType);
	};
	setHideBtn = (hideBtn) => {
		this.setState({ hideBtn });
	};
	setInfo = (info) => {
		this.setState({ info });
	};
	manageCollapsibleData = (collapsibleData) => {
		this.setState({ collapsibleData });
	};
	handleClose = () => {
		this.setState({ show: false });
	};
	handleChange = (name, value) => {
		this.setInfo({
			...this.state.info,
			[name]: value,
		});
	};

	handleSetURL = (url) => {
		this.setInfo({
			...this.state.info,
			signature_url: url,
		});
	};

	signStoreRoom = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(signStoreRoomLog(this.state.info));
	};

	handleAdjustmentModel = (aj = {}) => {
		this.setState({ adjustmentModel: !this.state.adjustmentModel });
		this.setState({ editAdjustmentData: aj });
	};

	handleAdjustmentDeleteModel = (ad = {}) => {
		const { dispatch } = this.props;
		const post = {
			adjustment_id: ad._id,
			user_id: this.userId,
			project_id: this.project_id,
			store_room_id: ad.store_room_id,
			material_id: ad.material_id,
			adjustment_date: this.date,
		};
		sweetAlert(
			() =>
				this.props.dispatch(
					deleteStoreRoomAdjustment(post, (data) => {
						dispatch(
							getStoreRoomListByStoreRoomId(this.store_room_id, this.date),
						);
						dispatch(getStoreRoom(this.project_id));
					}),
				),
			'Adjustment',
			'Delete',
		);
	};

	handleIssueModel = (is) => {
		this.setState({ issueModel: !this.state.issueModel });
		this.setState({ editIssueData: is });
	};

	handleIssueDeleteModel = (is) => {};

	calculateTotalIssuedByRequest = (sr) =>
		sr?.requsted?.reduce((ps, a) => ps + a.delivered_quantity, 0);

	isInsufficientOrder = (sr) => {
		return Number(sr?.total_in_order) != 0 &&
			Number(sr?.stock_quantity) + Number(sr?.total_in_order) <
				Number(this.calculateTotalRequested(sr)) -
					Number(this.calculateTotalIssuedByRequest(sr))
			? true
			: false;

		// return (Number(sr?.stock_quantity) + Number(sr?.total_in_order)) < ( Number(this.calculateTotalRequested(sr)) - Number(this.calculateTotalIssuedByRequest(sr))) ? true : false;
	};

	calculateTotalRequested = (sr) =>
		sr?.requsted?.reduce((ps, a) => ps + a.quantity, 0);

	isInsufficientMaterial = (sr) => {
		return Number(sr?.total_in_order) == 0 &&
			(Number(sr?.stock_quantity) <
				this.calculateTotalRequested(sr) -
					this.calculateTotalIssuedByRequest(sr) ||
				Number(sr?.stock_quantity) < Number(sr?.material?.[0].minimum_quantity))
			? true
			: false;

		// return Number(sr?.total_in_order) == 0 && ((Number(sr?.stock_quantity) < (Number(sr?.material?.[0].minimum_quantity))) || this.calculateTotalRequested(sr) < ) ? true : false;
	};

	storeRoollogTextHandle = (txt) => {
		this.setState({ searchText: txt });
	};

	render() {
		const { storeRoomLog, storeroom, UI_DATA } = this.props;
		const sortingList = [
			`New ${String.fromCharCode(60)} Old`,
			` A ${String.fromCharCode(60)} Z`,
			` Z ${String.fromCharCode(60)} A`,
			` Old ${String.fromCharCode(60)} New`,
		];
		const { info } = this.state;
		let filteredVal = storeRoomLog?.storeroomLogsRs?.filter((log) => {
			if (
				!log?.opening_quantity &&
				!log?.stock_quantity &&
				!log?.total_adustment &&
				!log?.total_in_order &&
				!log?.total_issued &&
				!log?.total_purchased &&
				!log?.total_requsted &&
				!log?.in_order?.length &&
				!log?.adustment?.length &&
				!log?.issued?.length &&
				!log?.purchased?.length &&
				!log?.requsted?.length &&
				this.state.hideBtn
			) {
				return false;
			} else {
				return true;
			}
		});

		let searchDataSource = [];
		filteredVal?.forEach((slist) => {
			searchDataSource = searchDataSource.concat(slist?.material);
		});

		filteredVal = filteredVal?.filter((log) => {
			if (
				!this.state.searchText ||
				(this.state.searchText &&
					log.material?.[0]?.type
						?.toLowerCase()
						?.includes(this.state.searchText.toLowerCase()))
			) {
				return true;
			} else {
				return false;
			}
		});

		// log

		const storeRoomRs =
			storeroom && Array.isArray(storeroom)
				? storeroom.find((v) => v._id === this.store_room_id)
				: {};

		const {
			btn_material,
			btn_show,
			btn_hide,
			btn_download,
			btn_unlock,
			storeroom_text,
			stock,
			purchased,
			in_order,
			requested,
			insufficient_order,
			insufficient_material,
		} = getSiteLanguageData('storeroom');

		const { description, date, action } = getSiteLanguageData('commons');
		const { opening_qty, issued, adjustment, notes, available } =
			getSiteLanguageData('material');

		const calculateRequestedCount = (requestedData) => {
			const requestedCount = [];
			requestedData?.map((data) => {
				const res = data.quantity - (data.delivered_quantity ?? 0);
				requestedCount.push(res);
			});
			return requestedCount;
		};

		const calculateSumOfPositiveValues = (numbers) => {
			const positiveValues = numbers.filter((number) => number > 0);
			return positiveValues.reduce(
				(acc, currentValue) => acc + currentValue,
				0,
			);
		};

		return (
			<Layout>
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="row align-items-center">
							<div className="col-12">
								<div className="d-flex align-items-center">
									<div className="float-start d-none d-md-inline-block">
										<a
											className="lf-common-btn my-1"
											href={`/reports/${this.project_id}`}>
											<i className="fa fa-arrow-left" aria-hidden="true"></i>
										</a>
									</div>
									<div className="float-start d-none d-lg-inline-block">
										<span className="lf-text-overflow-350 text-nowrap mt-1">
											{this.store_room_log_name ? this.store_room_log_name : ''}
										</span>
									</div>
										
									
									<div className="d-flex ms-auto">
										<span>
											{/* <ReportInfo
													data={this?.store_room_id}
													type={'Store Room'}
												/> */}
											<StoreRoomDetails
												type="Store Room"
												data={this.store_room_id}
												onlyinfo={'onlyinfo'}
											/>
										</span>
										{storeRoomLog?.storeroomReportRs?.map(
											(c) => c?.is_locked,
										)[0] === true ? (
											<>
												<span
													className="lf-common-btn"
													onClick={() =>
														sweetAlert(
															() =>
																this.props.dispatch(
																	unlockReport({
																		report_date: this.date,
																		store_room_id: this.store_room_id,
																		project_id: this.project_id,
																		user_id: this.userId,
																		report_name: this.store_room_log_name,
																		report_id: storeRoomLog?.storeroomReportRs?.map(
																			(c) => c?._id,
																		)[0],
																		report_type: 'StoreRoomLog',
																	}),
																),
															'Store Room',
															'Unlock',
														)
													}>
													<i className="fa-solid fa-lock-open pe-2"></i>
													{btn_unlock?.text}
												</span>
												<span
													className="lf-common-btn"
													onClick={() => {
														this.setState({ shareLink: null });
														sweetAlert(
															() => {
																this.hendleShowShereModel();
																this.props.dispatch(
																	downloadStoreRoomReport(
																		{
																			store_room_id: this.store_room_id,
																			user_id: this.userId,
																			from_date: this.date,
																			to_date: this.date,
																			project_id: this.project_id,
																		},
																		(repData) => {
																			if (repData?.data?.result?.file) {
																				this.setState({
																					shareLink: repData?.data?.result?.file,
																				});
																			} else {
																				this.setState({ shareLink: null });
																			}
																		},
																	),
																);
															},
															'Store Room',
															'Download',
														);
													}}>
													<i className="fa-solid fa-download pe-2"></i>
													{btn_download?.text}
												</span>
											</>
										) : (
											// <SignStoreRoomLog />
											!(
												storeRoomRs.start_date &&
												new Date(moment(storeRoomRs.start_date)) > moment().toDate()
											) &&
											new Date(this.date) <=
												new Date(moment(new Date()).format('YYYY-MM-DD')) && (
												<Signature
													setUrl={this.handleSetURL}
													url={info?.signature_url}
													signReport={this.signStoreRoom}
												/>
											)
										)}
									</div>

								</div>
								
							</div>
						</div>
					</section>
					<section className="lf-dashboard-toolbar">
						<div className="row align-items-center">
							<div className="col-12 mt-1">
								<span className="px-4 border-0 theme-color">{stock.text}</span>
								<span className="border-start py-0"></span>
								<span className="px-4 border-0">
									<Link
										className="text-dark"
										to={`/storeroom/${this.project_id}/storeRoomOrderList/${this.store_room_id}?store_room_log_date=${this.date}&name=${this.store_room_log_name}`}>
										PO
									</Link>
								</span>
							</div>
						</div>
					</section>
					<section className="px-3">
						<div className="row my-1">
							<div className="col-12 bg-white bg-transparent">
								<div className="d-flex align-items-center">
									<div className="d-flex float-start align-items-center d-none d-md-inline-block ">
										<CustomSearch
											dataSource={{
												storeroomlog: searchDataSource,
											}}
											storeRoollogTextHandle={this.storeRoollogTextHandle}
											seachText={this.state.seachText}
										/>
									</div>
									<div className="ms-auto float-end d-flex align-items-center d-inline-block" style={
										(storeRoomLog?.storeroomReportRs?.map(
											(c) => c?.is_locked,
										)[0] ===
											true) ===
										true
											? { pointerEvents: '' }
											: {}
									}>

										<div className="float-start d-inline-block pe-2">
											<span className="theme-secondary">
												<i
													className="fas fa-less-than"
													onClick={() => {
														const tomorrow = moment(this.date).toDate();
														const date = tomorrow.setDate(tomorrow.getDate() - 1);
														const stDate = new Date(
															moment(storeRoomRs.start_date).format('YYYY-MM-DD'),
														);
														if (
															stDate <= new Date(moment(date).format('YYYY-MM-DD'))
														) {
															window.location.href = `/reports/${
																this.project_id
															}/storeRoomLog/${
																this.store_room_id
															}?store_room_log_date=${moment(date).format(
																'YYYY-MM-DD',
															)}&name=${this.store_room_log_name}`;
														} else {
															errorNotification("You Can't View Feature Report");
														}
													}}
												/>
												<span
													style={{
														display: 'inline-block',
														width: 'auto',
													}}
													className="theme-btnbg mx-1 react-datepicker__input-container text-nowrap theme-secondary rounded lf-link-cursor">
													<DatePicker
														tooltip="Calender"
														flow="down"
														disabled={
															storeRoomRs.start_date
																? new Date(moment(storeRoomRs.start_date)) >
																moment().toDate()
																: false
														}
														className=""
														selected={moment(this.date).toDate()}
														filterDate={(date) => {
															let stateDate = new Date(
																moment(storeRoomRs.start_date).format('YYYY-MM-DD'),
															).getTime();
															let gtDate = new Date(
																moment(new Date()).format('YYYY-MM-DD'),
															).getTime();
															let dpDate = new Date(
																moment(new Date(date)).format('YYYY-MM-DD'),
															).getTime();
															return storeRoomRs && storeRoomRs.start_date
																? stateDate <= dpDate && gtDate >= dpDate
																: false;
															// return storeRoomRs && storeRoomRs.start_date && storeRoomRs.end_date ?
														}}
														customInput={
															<span>
																<i className="far fa-calendar-alt" />{' '}
																{moment(this.date).format(
																	this.props.projectDetails &&
																		this.props.projectDetails.date_formate
																		? this.props.projectDetails.date_formate
																		: 'YYYY-MM-DD',
																)}
															</span>
														}
														onChange={(e) => {
															const date = moment(e).format('YYYY-MM-DD');
															window.location.href = `/reports/${this.project_id}/storeRoomLog/${this.store_room_id}?store_room_log_date=${date}&name=${this.store_room_log_name}`;
														}}
														minDate={
															storeRoomRs.start_date
																? new Date(
																		moment(storeRoomRs.start_date).format(
																			'YYYY-MM-DD',
																		),
																)
																: new Date()
														}
														maxDate={
															storeRoomRs.end_date
																? new Date(
																		moment(storeRoomRs.end_date).format('YYYY-MM-DD'),
																)
																: new Date()
														}
													/>
												</span>

												<i
													className="fas fa-greater-than"
													onClick={() => {
														const tomorrow = moment(this.date).toDate();
														const date = tomorrow.setDate(tomorrow.getDate() + 1);
														if (
															new Date(this.date) <
																new Date(
																	moment(new Date(storeRoomRs.end_date)).format(
																		'YYYY-MM-DD',
																	),
																) &&
															date <= new Date()
														) {
															window.location.href = `/reports/${
																this.project_id
															}/storeRoomLog/${
																this.store_room_id
															}?store_room_log_date=${moment(date).format(
																'YYYY-MM-DD',
															)}&name=${this.store_room_log_name}`;
														} else {
															errorNotification("You Can't View Feature Report");
														}
													}}
												/>
											</span>
										</div>

										<div className="float-start d-none d-lg-inline-block">
											<span
												className="theme-btnbg theme-secondary btn border-0"
												onClick={() =>
													this.manageCollapsibleData({
														...this.state.collapsibleData,
														[filteredVal?.map((sr) => sr?._id)]:
															!this.state.collapsibleData?.[
																filteredVal?.map((sr) => sr?._id)
															],
													})
												}>
												{this.state.collapsibleData?.[
													filteredVal?.map((sr) => sr?._id)
												] === true ? (
													<i className="fas fa-expand-alt" />
												) : (
													<i className="fas fa-compress-alt" />
												)}
											</span>
										</div>

										<div className="float-start d-none d-sm-inline-block">
											<Dropdown className="lf-dropdwon-animation">
												<Dropdown.Toggle
													variant="transparent"
													className="theme-secondary theme-btnbg">
													{btn_material?.text}
												</Dropdown.Toggle>
												<Dropdown.Menu className="lf-dropdwon-animation lf-dropdwon-center">
													<CreateMaterial />
													<UpdateMaterial
														store_room_id={this.store_room_id}
														date={this.date}
													/>
												</Dropdown.Menu>
											</Dropdown>
										</div>

										<div className="float-start d-inline-block">
											{storeRoomLog?.storeroomReportRs?.map(
												(c) => c?.is_locked,
											)?.[0] === true ? (
												''
											) : (
												<IssueMaterial />
											)}
										</div>

										<div className="float-start d-none d-lg-inline-block">
											{this.state.hideBtn === false ? (
												<span
													type="submit"
													onClick={() => {
														this.setState({ collapsibleData: [] });
														this.setHideBtn(true);
														window.localStorage.setItem('hideBtn', true);
													}}
													className="theme-btnbg theme-secondary btn border-0">
													{btn_hide?.text}
												</span>
											) : (
												<span
													type="submit"
													onClick={() => {
														this.setState({ collapsibleData: [] });
														this.setHideBtn(false);
														window.localStorage.setItem('hideBtn', false);
													}}
													className="theme-btnbg theme-secondary btn border-0">
													{btn_show?.text}
												</span>
											)}
										</div>

										

									</div>
								</div>
							</div>

							{/* <Dropdown>
                      <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="mt-1 lf-common-btn">
                        <span className="">{sortingList[parseInt(this.state.sortType) - 1]}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ backgroundColor: '#73a47' }} className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu ">
                        {sortingList.map((st, k) => {
                          return <Dropdown.Item key={k} className='lf-layout-profile-menu' onClick={() => this.handleSortType((k + 1).toString())}>{st}</Dropdown.Item>
                        })}
                      </Dropdown.Menu>
                    </Dropdown> */}
						</div>
					</section>

					<div className="container-fluid">
						{UI_DATA.loading_data ? <Loading /> : ''}
						{storeRoomLog?.length === 0 ? (
							<Nodata type="Store Room Stock"></Nodata>
						) : (
							<div className="theme-table-wrapper scroll-y mb-0 w-md-100 card no-bg ">
								{/* <div className="col-sm-12 mt-2"> */}
								<div className="">
									<table className="table theme-table table-hover">
										<thead className="theme-table-title text-nowrap text-center bg-light">
											<tr>
												<th className="text-start lf-w-250 m-w-200 px-2">
													{description.text}
												</th>
												<th className="lf-w-150 m-w-80 text-start">
													{date.text}
												</th>
												<th className="text-end lf-w-130 m-w-90">
													{opening_qty.text}
												</th>
												<th className="text-end lf-w-80 m-w-80">
													{purchased.text}
												</th>
												<th className="text-end lf-w-130 m-w-70">
													{issued.text}
												</th>
												<th className="text-end lf-w-130 m-w-90">
													{adjustment.text}
												</th>
												<th className="text-end lf-w-130 m-w-75">
													{in_order.text}
												</th>
												<th className="text-end lf-w-130 m-w-90">
													{requested.text}
												</th>
												<th className="text-end lf-w-130 m-w-80">
													{available.text}
												</th>
												<th className="text-center lf-w-180 m-w-90 ps-1">
													{`${notes.text}s`}
												</th>
												<th className="text-center lf-w-80 m-w-70">
													{action.text}
												</th>
											</tr>
										</thead>

										<tbody
											className={`theme-table-title text-capitalize text-nowrap  bg-light`}>
											{filteredVal?.map((sr) => {
												const requestedCount = calculateRequestedCount(sr.requsted);
  												const sumOfRequestedValue = calculateSumOfPositiveValues(requestedCount);

												return (
													<>
														<tr
															className={`theme-table-data-row  lf-task-color bg-white `}>
															<td
																colSpan={2}
																className="lf-w-250 px-2"
																onClick={() => {
																	this.manageCollapsibleData({
																		...this.state.collapsibleData,
																		[sr._id]:
																			!this.state.collapsibleData?.[sr._id],
																	});
																}}>
																{sr?.material?.map((m) => (
																	<span
																		flow="right"
																		tooltip={m?.type}
																		className={
																			this.isInsufficientOrder(sr)
																				? 'text-danger'
																				: this.isInsufficientMaterial(sr)
																				? 'text-danger'
																				: ''
																		}>
																		{m?.type?.length > 25
																			? m?.type?.substr(0, 25) + '...'
																			: m?.type}{' '}
																		({m?.unit})
																	</span>
																))}
															</td>
															{/* <td className="lf-w-150"></td> */}
															<td className="text-end  lf-w-120">
																<span>{sr?.opening_quantity}</span>
															</td>
															<td className="text-end  lf-w-100">
																<span>{sr?.total_purchased}</span>
															</td>
															<td className="text-end  lf-w-100">
																<span>{sr?.total_issued}</span>
															</td>
															<td className="text-end  lf-w-100">
																<span>{sr?.total_adustment}</span>
															</td>
															<td className="text-end  lf-w-100">
																<span>{sr?.total_in_order}</span>
															</td>
															<td className="text-end  lf-w-100">
																<span>{sumOfRequestedValue || 0}</span>
															</td>
															<td className="text-end  lf-w-100">
																<span>{sr?.stock_quantity}</span>
															</td>
															<td className="text-center ps-3 lf-w-180">
																{this.isInsufficientOrder(sr) ? (
																	<span className={`text-danger`}>
																		{insufficient_order.text}
																	</span>
																) : this.isInsufficientMaterial(sr) ? (
																	<span className={`text-danger`}>
																		{insufficient_material.text}
																	</span>
																) : (
																	''
																)}
															</td>
															<td className="text-center  lf-w-180"></td>
														</tr>

														{sr?.requsted?.map((rq) => {
															const total =
																rq?.quantity -
																(rq?.delivered_quantity
																	? rq?.delivered_quantity
																	: 0);

															return total < 0 ||
																total === 0 ||
																total == 'NaN' ? (
																<></>
															) : (
																<>
																	<tr
																		className={`theme-table-data-row bg-white ${
																			!this.state.collapsibleData?.[
																				filteredVal?.map((sr) => sr?._id)
																			]
																				? ''
																				: 'd-none'
																		} ${
																			rq?.request?.[0]?.status != 'Delivered'
																				? 'text-danger'
																				: ''
																		}`}>
																		<td className="lf-w-250 ps-4 pe-2">
																			{rq?.request?.map((re) => {
																				return re?.location?.map((l) => l.name);
																			})}
																		</td>
																		<td className=" lf-w-150">
																			{moment(
																				rq?.request?.[0].date_of_order,
																			).format(
																				this.props.projectDetails &&
																					this.props.projectDetails.date_formate
																					? this.props.projectDetails
																							.date_formate
																					: 'YYYY-MM-DD',
																			)}
																		</td>
																		<td className="text-center lf-w-120"></td>
																		<td className="text-center lf-w-100"></td>
																		<td className="text-center lf-w-100"></td>
																		<td className="text-center lf-w-100"></td>
																		<td className="text-center lf-w-100"></td>
																		<td className="text-end lf-w-100">
																			<span>{total || 0}</span>
																		</td>
																		<td className="text-center lf-w-100"></td>
																		<td className="text-center lf-w-180"></td>
																		<td className="text-center lf-w-180"></td>
																	</tr>
																</>
															);
																													})}
														{sr?.adustment?.map((aj) => {
															return (
																<tr
																	className={`theme-table-data-row bg-white ${
																		!this.state.collapsibleData?.[
																			filteredVal?.map((sr) => sr?._id)
																		]
																			? ''
																			: 'd-none'
																	}`}>
																	<td className="lf-w-250 ps-4 pe-2">
																		<span>
																			{/* storeroom?.filter(
																					(st) => st?._id === aj?.store_room_id,
																				)?.[0]?.description */}
																			Adjustment
																		</span>
																	</td>
																	<td className=" lf-w-150">
																		{moment(aj?.adjustment_date).format(
																			this.props.projectDetails &&
																				this.props.projectDetails.date_formate
																				? this.props.projectDetails.date_formate
																				: 'YYYY-MM-DD',
																		)}
																	</td>
																	<td className="text-center lf-w-120"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-end lf-w-100">
																		<span>{aj?.adujustment_quantity}</span>
																	</td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td
																		className="text-center lf-w-180"
																		flow="up"
																		tooltip={aj?.notes}>
																		{aj?.notes?.substr(0, 15)}
																	</td>
																	<td className="text-center lf-w-180">
																		{storeRoomLog?.storeroomReportRs?.map(
																			(c) => c?.is_locked,
																		)?.[0] === true ? (
																			''
																		) : (
																			<>
																				<span
																					onClick={() =>
																						this.handleAdjustmentModel(aj)
																					}>
																					<i className="theme-bgcolor far fa-edit  lf-link-cursor"></i>
																				</span>
																				<span
																					onClick={() =>
																						this.handleAdjustmentDeleteModel(aj)
																					}>
																					<i className="theme-bgcolor fas fa-trash-alt lf-link-cursor ms-2"></i>
																				</span>
																			</>
																		)}
																	</td>
																</tr>
															);
														})}
														{sr?.issued?.map((is) => {
															return (
																<tr
																	className={`theme-table-data-row bg-white ${
																		!this.state.collapsibleData?.[
																			filteredVal?.map((sr) => sr?._id)
																		]
																			? ''
																			: 'd-none'
																	}`}>
																	<td className="lf-w-250 ps-4 pe-2">
																		{is?.request?.map((re) => {
																			return re?.location?.map((l) => l.name);
																		})}
																	</td>
																	<td className=" lf-w-150">
																		{moment(is?.transaction_date).format(
																			this.props.projectDetails &&
																				this.props.projectDetails.date_formate
																				? this.props.projectDetails.date_formate
																				: 'YYYY-MM-DD',
																		)}
																	</td>
																	<td className="text-center lf-w-120"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-end lf-w-100">
																		<span>{is?.quantity}</span>
																	</td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td
																		className="text-center lf-w-180"
																		flow="up"
																		tooltip={is?.note}>
																		{is?.note?.substr(0, 15)}
																	</td>
																	<td className="text-center lf-w-100">
																		{/* <>
																		{
																			(storeRoomLog?.storeroomReportRs?.[0]?.is_locked) != true ? (
																				<span onClick={()=>this.handleIssueModel(is)}>
																					<i className="theme-bgcolor far fa-edit  lf-link-cursor"></i>
																				</span>
																			) : ('')
																		}
																	</> */}
																	</td>
																</tr>
															);
														})}
														{sr?.purchased?.map((pr) => {
															return (
																<tr
																	className={`theme-table-data-row bg-white ${
																		!this.state.collapsibleData?.[
																			filteredVal?.map((sr) => sr?._id)
																		]
																			? ''
																			: 'd-none'
																	}`}>
																	<td className="lf-w-250 ps-4 pe-2">
																		{pr?.order_info?.order_no}
																	</td>
																	<td className=" lf-w-150">
																		{moment(
																			pr?.order_info?.date_of_order,
																		).format(
																			this.props.projectDetails &&
																				this.props.projectDetails.date_formate
																				? this.props.projectDetails.date_formate
																				: 'YYYY-MM-DD',
																		)}
																	</td>
																	<td className="text-center lf-w-120"></td>
																	<td className="text-end lf-w-100">
																		<span>{pr?.received_quantity}</span>
																	</td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-180">
																		{/* {pr?.order_info?.notes?.substring(0,30)} */}
																	</td>
																	<td className="text-center lf-w-100"></td>
																</tr>
															);
														})}

														{sr?.in_order?.map((io) => {
															return (
																<tr
																	className={`theme-table-data-row bg-white ${
																		!this.state.collapsibleData?.[
																			filteredVal?.map((sr) => sr?._id)
																		]
																			? ''
																			: 'd-none'
																	}`}>
																	<td className="lf-w-250 ps-4 pe-2">
																		{io?.order_info?.order_no}
																	</td>
																	<td className="lf-w-150">
																		{moment(
																			io?.order_info?.date_of_order,
																		).format(
																			this.props.projectDetails &&
																				this.props.projectDetails.date_formate
																				? this.props.projectDetails.date_formate
																				: 'YYYY-MM-DD',
																		)}
																	</td>
																	<td className="text-center lf-w-120"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-end lf-w-100">
																		<span>{io?.quantity}</span>
																	</td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-100"></td>
																	<td className="text-center lf-w-180"></td>
																	<td className="text-center lf-w-180"></td>
																	{/* <td className="text-center lf-w-40">
								<i className="theme-bgcolor far fa-edit  lf-link-cursor ms-2"></i>
									<i className="theme-bgcolor fas fa-trash-alt lf-link-cursor"></i>
								</td> */}
																</tr>
															);
														})}
													</>
												);
											})}
										</tbody>
									</table>
								</div>

								{/* </div> */}
							</div>
						)}
					</div>
				</div>
				<UpdateAdjustment
					adjustmentModel={this.state.adjustmentModel}
					handleAdjustmentModel={this.handleAdjustmentModel}
					editAdjustmentData={this.state.editAdjustmentData}
					date={this.date}
				/>

				<UpdateIssue
					issueModel={this.state.issueModel}
					handleIssueModel={this.handleIssueModel}
					editIssueData={this.state.editIssueData}
					date={this.date}
				/>
				<GenerateSurveyReport
					open={this.state.showShareModel}
					project_id={this.project_id}
					shareLink={this.state.shareLink}
					handleClose={this.hendleShowShereModel}
				/>
			</Layout>
		);
	}
}
export default withRouter(
	connect((state) => {
		return {
			storeRoomLog:
				state?.storeroom?.[GET_STORE_ROOM_LOG_ID_AND_DATE]?.result || [],
			storeroom: state?.storeroom?.[GET_STORE_ROOM]?.result,
			projectDetails: state?.project?.[GET_PROJECT_DETAILS]?.result || [],
			UI_DATA: state?.ui_red,
		};
	})(StoreRoomStock),
);
