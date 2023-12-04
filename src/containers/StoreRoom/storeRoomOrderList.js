import { Component } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/layout';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import Nodata from '../../components/nodata';
import {
	GET_ORDER_DETAILS_BY_STORE_ROOM_ID,
	GET_STORE_ROOM_FULL_DETAILS,
} from '../../store/actions/actionType';
import {
	getOrderDetailsStoreRoomId,
	deleteStoreRoomPO,
	getStoreRoomFullDetails,
} from '../../store/actions/storeroom';
import CreateOrder from './createorder';
import { getParameterByName } from '../../helper';
import UpdateOrder from './updateOrder';
import SignPoOrder from './signPoOrder';
import CustomDate from '../../components/CustomDate';
import { unlockReport } from '../../store/actions/report';
import ReportInfo from '../Reports/Components/reportInfo';
import CustomSearch from '../../components/CustomSearch';
import SignPoOrderInfo from './signPoOrderInfo';
import withRouter from '../../components/withrouter';
import { Link } from 'react-router-dom';
import StoreRoomDetails from './storeRoomDetails';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import GenerateReport from './GenerateReport';

class StoreRoomOrderList extends Component {
	constructor(props) {
		super(props);
		this.date = getParameterByName('store_room_log_date');
		this.project_id = this.props.router?.params.project_id;
		this.store_room_log_name = getParameterByName('name');
		this.store_room_id = this.props.router?.params.store_room_id;
		this.userId = getUserId();
		this.state = {
			collapsibleData: {},
			multiSelect: [],
			isOpen: false,
			selectedOrder: {},
			sortType: '3',
			selectedPoOrder: {},
			selectedPoOrderDetails: {},
			vendorModel: false,
		};
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getOrderDetailsStoreRoomId(this.store_room_id));
		dispatch(getStoreRoomFullDetails(this.store_room_id));
	}
	setSelectetdSheet = (selectedOrder) => {
		this.setState({ selectedOrder });
	};
	handleSortType = (sortType) => {
		this.setState(sortType);
	};
	setSelectetdPoOrder = (selectedPoOrder) => {
		// console.log(this.router, "this.router")
		this.props.router.navigate(
			`/storeroom/${this.project_id}/store-room-order-manage/${this.store_room_id}/fill_po/${selectedPoOrder._id}/${this.date}&name=${this.store_room_log_name}`,
		);
	};
	setSelectetdPoOrderDetails = (selectedPoOrderDetails) => {
		// this.setState({ selectedPoOrderDetails });
		this.props.router.navigate(
			`/storeroom/${this.project_id}/store-room-order-manage/${this.store_room_id}/fill_po/${selectedPoOrderDetails._id}/${this.date}&name=${this.store_room_log_name}`,
		);
	};

	handleDeletePo = (sr) => {
		const { dispatch } = this.props;
		const post = {
			store_room_order_id: sr._id,
			store_room_id: sr.store_room_id,
			project_id: sr.project_id,
			user_id: this.userId,
		};
		dispatch(
			deleteStoreRoomPO(post, (data) => {
				dispatch(getOrderDetailsStoreRoomId(this.store_room_id));
				dispatch(getStoreRoomFullDetails(this.store_room_id));
			}),
		);
	};

	handleVendorReportModel = () => {
		this.setState({ vendorModel: !this.state.vendorModel });
	};

	render() {
		const { storeroomData, storeRoomDetails } = this.props;

		const {
			icon_edit,
			icon_delete,
			storeroom_text,
			stock,
			btn_create_order,
			insights,
			order_date,
			expected_date,
			delivery_date,
			po,
		} = getSiteLanguageData('storeroom');

		const { vendor_name } = getSiteLanguageData('setting');

		const { statusbar, action } = getSiteLanguageData('task/update');

		const { signed_by } = getSiteLanguageData(
			'reports/components/fieldreportinfo',
		);
		return (
			<Layout>
				{this.state.selectedOrder?._id ? (
					<UpdateOrder
						data={this.state.selectedOrder}
						handleClose={() => {
							this.setSelectetdSheet({});
						}}
						hideBtn={true}
						show={true}
					/>
				) : (
					''
				)}
				{this.state.selectedPoOrder?._id ? (
					<SignPoOrder
						data={this.state.selectedPoOrder}
						handleClose={() => {
							this.setSelectetdPoOrder({});
						}}
						hideBtn={true}
						show={true}
					/>
				) : (
					''
				)}
				{this.state.selectedPoOrderDetails?._id ? (
					<SignPoOrderInfo
						data={this.state.selectedPoOrderDetails?._id}
						handleClose={() => {
							this.setSelectetdPoOrderDetails({});
						}}
						hideBtn={true}
						show={true}
					/>
				) : (
					''
				)}

				<div id="page-content-wrapper">
					<div>
						<section
							className="lf-dashboard-toolbar"
							style={{ minHeight: '47px' }}>
							<div className="row align-items-center">
								<div className="col-12">
									<div className="d-flex align-items-center">
										<div className="float-start d-none d-md-inline-block">
											<a
												className="lf-common-btn"
												href={`/reports/${this.project_id}`}>
												<i className="fa fa-arrow-left" aria-hidden="true"></i>
											</a>

										</div>
										<div className="float-start d-none d-lg-inline-block">
											<span className="lf-text-overflow-350 text-nowrap mt-1">{this.store_room_log_name}</span>
										</div>	
										<div className="d-flex ms-auto">
											<span>
											{/* <ReportInfo data={this.store_room_id} type={'Store Room'} /> */}
												<StoreRoomDetails
													type="Store Room"
													data={this.store_room_id}
												/>
											</span>
										</div>									
									</div>
									
								</div>
							</div>
						</section>
						<section className="lf-dashboard-toolbar">
							<div className="row align-items-center">
								<div className="col-12 mt-1">
									<span className="px-4 border-0">
										<Link
											className="text-dark"
											to={`/reports/${this.project_id}/storeRoomLog/${this.store_room_id}?store_room_log_date=${this.date}&name=${this.store_room_log_name}`}>
											{stock.text}
										</Link>
									</span>
									<span className="border-start py-0"></span>
									<span className="px-4 border-0 theme-color">PO</span>
								</div>
							</div>
						</section>
					</div>
					<section className="px-3">
						<div className="row my-1">
							<div className="col-12 bg-transparent">
								<div className="d-flex align-items-center">
									<div className="float-start d-none d-md-inline-block">
										<CustomSearch
										suggestion={true}
										setSelectetdPoOrderDetails={this.setSelectetdPoOrderDetails}
										setSelectetdPoOrder={this.setSelectetdPoOrder}
										dataSource={{
											storeroomPO: storeroomData,
										}}/>
									</div>
									<div className="d-flex align-items-center ms-auto">
										<div className="float-end d-inline-block">
											<Link
												className="lf-common-btn"
												to={`/storeroom/${this.project_id}/store-room-order-manage/${this.store_room_id}/${this.date}&name=${this.store_room_log_name}`}>
												+ {btn_create_order.text}
											</Link>
										</div>
										<div className="float-end d-inline-block">
											<Button
												onClick={() => {
													this.handleVendorReportModel();
												}}
												className={'btn lf-main-button'}>
												<i className="theme-bgcolor far fa-file lf-link-cursor me-2"></i>
												{insights.text}
											</Button>
										</div>
									</div>

								</div>
							</div>
						</div>
					</section>

					<div className="container-fluid">
						{storeroomData?.length === 0 ? (
							<Nodata type="PO">
								{/* <CreateOrder className="text-center btn lf-common-btn theme-secondary border lf-link-cursor fw-bold mt-2" /> */}
								<Link
									className="text-white lf-main-button"
									to={`/storeroom/${this.project_id}/store-room-order-manage/${this.store_room_id}/${this.date}&name=${this.store_room_log_name}`}>
									+ {btn_create_order.text}
								</Link>
							</Nodata>
						) : (
							<div className=" theme-table-wrapper theme-table-wrapper-180 card">
								<table className="table theme-table table-hover">
									<thead className="theme-table-title text-nowrap text-center bg-light">
										<th className="text-start lf-w-25 px-2">{po.text}</th>
										<th className="lf-w-200 text-start">{vendor_name.text}</th>
										<th className="text-start lf-w-100">{order_date.text}</th>
										<th className="text-start lf-w-100">
											{expected_date.text}
										</th>
										<th className="text-start lf-w-100">
											{delivery_date.text}
										</th>
										<th className="text-start lf-w-100">{signed_by.text}</th>
										<th className="text-start lf-w-40">{statusbar.text}</th>
										<th className="text-end lf-w-40 px-2">{action.text}</th>
										{/* <th></th> */}
									</thead>
									<tbody className="text-secondary text-start">
										{storeroomData?.map((sr, k) => {
											return (
												<tr className={`theme-table-data-row`} key={k}>
													<td
														onClick={() =>
															sr?.is_locked === true
																? this.setSelectetdPoOrderDetails(sr)
																: this.setSelectetdPoOrder(sr)
														}
														className="lf-w-100 text-start lf-task-color px-2">
														<span
															flow="right"
															tooltip={sr?.order_no?.length > 10
																? sr?.order_no : ""}>
																{sr?.order_no?.length > 10
																		? sr?.order_no?.substr(0, 10) + '...'
																		: sr?.order_no}{' '}
														</span>	
														{/* {sr?.order_no} */}
													</td>
													<td
														onClick={() =>
															sr?.is_locked === true
																? this.setSelectetdPoOrderDetails(sr)
																: this.setSelectetdPoOrder(sr)
														}
														className="pt-auto pb-auto lf-w-200 text-start lf-task-color pe-2">
														{sr?.vendor_data?.vendor_name || sr?.vendor}
													</td>
													<td
														onClick={() =>
															sr?.is_locked === true
																? this.setSelectetdPoOrderDetails(sr)
																: this.setSelectetdPoOrder(sr)
														}
														className="lf-w-90 text-start">
														<CustomDate date={sr?.date_of_order} />
													</td>
													<td
														onClick={() =>
															sr?.is_locked === true
																? this.setSelectetdPoOrderDetails(sr)
																: this.setSelectetdPoOrder(sr)
														}
														className="text-start lf-w-40">
														<CustomDate date={sr?.expected_delivery_date} />
													</td>
													<td
														onClick={() =>
															sr?.is_locked === true
																? this.setSelectetdPoOrderDetails(sr)
																: this.setSelectetdPoOrder(sr)
														}
														className="text-start lf-w-40">
														{sr?.delivery_date ? (
															<CustomDate date={sr?.delivery_date} />
														) : (
															''
														)}
													</td>
													<td
														onClick={() =>
															sr?.is_locked === true
																? this.setSelectetdPoOrderDetails(sr)
																: this.setSelectetdPoOrder(sr)
														}
														className="text-start lf-w-100">
														{sr?.signedby?.map(
															(sb) => sb?.first_name + ' ' + sb?.last_name,
														)}
													</td>
													<td
														onClick={() =>
															sr?.is_locked === true
																? this.setSelectetdPoOrderDetails(sr)
																: this.setSelectetdPoOrder(sr)
														}
														className="text-start lf-w-50">
														{sr?.status}
													</td>
													<td className="text-end lf-w-80 px-2">
														{sr?.is_locked === true ? (
															storeRoomDetails?.end_date &&
															new Date(storeRoomDetails.end_date).getTime() >=
																new Date().getTime() ? (
																<span
																	onClick={() =>
																		sweetAlert(
																			() =>
																				this.props.dispatch(
																					unlockReport({
																						store_room_id: this.store_room_id,
																						user_id: this.userId,
																						report_date: sr?.date_of_order,
																						project_id: this.project_id,
																						report_name:
																							this.store_room_log_name,
																						report_id: sr?._id,
																						report_type: 'StoreRoomPoOrder',
																					}),
																				),
																			'Store-Room Po Order',
																			'Unlock',
																		)
																	}>
																	<i className="p-1 ms-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold fas fa-unlock"></i>
																</span>
															) : (
																''
															)
														) : (
															<>
																{/* <span
																	tooltip={icon_edit.tooltip}
																	flow={icon_edit.tooltip_flow}>
																	<i
																		className="p-1 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold far fa-edit"
																		onClick={() => this.setSelectetdSheet(sr)}
																	/>{' '}
																</span> */}
																<Link
																	className="text-secondary"
																	to={`/storeroom/${
																		sr.project_id
																	}/store-room-order-manage/${
																		sr.store_room_id
																	}/order/${sr._id}/${moment(
																		sr.date_of_order,
																	).format('YYYY-MM-DD')}&name=${
																		this.store_room_log_name
																	}`}>
																	<i className="p-1 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold far fa-edit" />
																</Link>
																<span
																	onClick={() => this.handleDeletePo(sr)}
																	tooltip={icon_delete.tooltip}
																	flow={icon_delete.tooltip_flow}>
																	<i className="p-1 ms-1 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold fas fa-trash-alt"></i>
																</span>
															</>
														)}
													</td>
													{/* <td className="text-center lf-w-20"></td> */}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>

				<GenerateReport
					open={this.state.vendorModel}
					handleClose={this.handleVendorReportModel}
					project_id={this.project_id}
					store_room_id={this.store_room_id}
				/>
			</Layout>
		);
	}
}

export default withRouter(
	connect((state) => {
		return {
			storeroomData:
				state?.storeroom?.[GET_ORDER_DETAILS_BY_STORE_ROOM_ID]?.result || [],
			storeRoomDetails: state?.storeroom?.[GET_STORE_ROOM_FULL_DETAILS]?.result,
		};
	})(StoreRoomOrderList),
);
