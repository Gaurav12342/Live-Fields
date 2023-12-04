import { Component } from 'react';
import Layout from '../../components/layout';
import AddEntry from './Components/addEntry';
import {
	downloadMateriaLog,
	getMaterialDetailsById,
	getMaterialLogListById,
	signMaterialLogReport,
	updateMaterialRequest,
	adjustmentUpdateMaterial,
	adjustmentDeleteMaterial,
	consumptionUpdateMaterial,
	consumptionDeleteMaterial,
	deleteMateriaRequest
} from '../../store/actions/storeroom';
import { getParameterByName } from '../../helper';
import moment from 'moment';

import { connect } from 'react-redux';
import {
	GET_MATERIAL_DETAILS_BY_ID,
	GET_MATERIAL_LOG_BY_DATE,
} from '../../store/actions/actionType';
import CreateMaterial from '../StoreRoom/createMaterial';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,	
} from 'react-bootstrap';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import { unlockReport } from '../../store/actions/report';
import Nodata from '../../components/nodata';
import { errorNotification } from '../../commons/notification';
import DatePicker from 'react-datepicker';
import Signature from '../../components/signature';
import withRouter from '../../components/withrouter';
import MaterialLogInfo from './Components/materialLogInfo';
import CustomDate from '../../components/CustomDate';
import GenerateSurveyReport from '../Reports/Components/GenerateSurveyReport';

class MaterialLog extends Component {
	constructor(props) {
		super(props);
		this.date = getParameterByName('material_date');
		this.store_room_log_name = getParameterByName('name');
		this.project_id = this.props.router?.params.project_id;
		this.material_id = this.props.router?.params.material_id;
		this.userId = getUserId();
		this.state = {
			sortType: '3',
			collapsibleData: {},
			info: {
				material_log_id: this.material_id,
				user_id: this.userId,
				project_id: this.project_id,
				report_date: this.date,
				signature_url: '',
				signed_by: this.userId,
			},
			show: false,
			showEditRequestModel:false,
			editRequestData:{},
			showEditAdjustmentModel:false,
			editAdjustmentData:{},
			showEditConsumptionModel:false,
			editConsumptionData:{},
			showShareModel:false,
			shareLink:null
		};
	}

	

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getMaterialLogListById(this.material_id, this.date));
		dispatch(getMaterialDetailsById(this.material_id));
	}

	handleEditModel = ()=>{
		this.setState({showEditRequestModel:!this.state.showEditRequestModel});		
	}

	handleEditAdjustmentModel = ()=>{
		this.setState({showEditAdjustmentModel:!this.state.showEditAdjustmentModel});		
	}

	handleEditConsumptionModel = ()=>{
		this.setState({showEditConsumptionModel:!this.state.showEditConsumptionModel});		
	}

	manageCollapsibleData = (collapsibleData) => {
		this.setState({ collapsibleData });
	};
	hidebtn = (e) => {
		const { mateialLog } = this.props;
		const mm = mateialLog?.materialLogsRs?.filter(
			(x) =>
				x?.total_adustment === 0 ||
				x?.total_consumption === 0 ||
				x?.stock_quantity === 0,
		);
	};
	setInfo = (info) => {
		this.setState({ info });
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
	hendleShowShereModel = () => {
		this.setState({showShareModel:!this.state.showShareModel});
	};
	handleSign = (url) => {
		this.setInfo({
			...this.state.info,
			signature_url: url,
		});
	};

	signMaterial = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(signMaterialLogReport(this.state.info));
	};

	deleteAdjustmentHandler = (ad) => {
		let post = {
			material_log_id:ad?.material_log_id,
			material_adjustment_id:ad?._id,
			adjustment_date:this.date,
			user_id:this.userId
		}
		sweetAlert(
			() =>
				this.props.dispatch(
					adjustmentDeleteMaterial(post,(data)=>{
						this.props.dispatch(getMaterialLogListById(this.material_id, this.date));
						this.props.dispatch(getMaterialDetailsById(this.material_id));
					}),
				),
			'Adjustment',
			'Delete',
		)
	}

	editConsumptionHandler = (cn) => {
		this.handleEditConsumptionModel();
		this.setState({editConsumptionData:cn});
	}

	setConsumptionEditRequest = (e) =>{
		let reqData = this.state?.editConsumptionData ? this.state?.editConsumptionData : {};
		reqData.quantity = e.target.value;
		this.setState({ editConsumptionData: reqData });
	}

	setConsumptionNoteEditRequest = (e) =>{
		let reqData = this.state?.editConsumptionData ? this.state?.editConsumptionData : {};
		reqData.notes = e.target.value;
		this.setState({ editConsumptionData: reqData });
	}

	saveEditConsumption = () => {
		const { dispatch } = this.props;
		let post = {
			quantity:Number(this.state?.editConsumptionData?.quantity),
			material_log_id:this.state?.editConsumptionData?.material_log_id,
			consumption_id:this.state?.editConsumptionData?._id,
			consumption_date:this.date,
			project_id:this.project_id,
			notes: this.state?.editConsumptionData?.notes,
			user_id:this.userId
		}
		dispatch(consumptionUpdateMaterial(post, (data)=>{
			dispatch(getMaterialLogListById(this.material_id, post.consumption_date));
			dispatch(getMaterialDetailsById(this.material_id));
			this.handleEditConsumptionModel();
			this.setState({editConsumptionData:{}});
		}));
	}

	editAdjustmentHandler = (ad) => {
		this.handleEditAdjustmentModel();
		this.setState({editAdjustmentData:ad});
	}

	setAdjustmentEditRequest = (e) =>{
		let reqData = this.state?.editAdjustmentData ? this.state?.editAdjustmentData : {};
		reqData.adujustment_quantity = e.target.value;
		this.setState({ editAdjustmentData: reqData });
	}

	setAdjustmentEditNotes = (e) =>{
		let reqData = this.state?.editAdjustmentData ? this.state?.editAdjustmentData : {};
		reqData.notes = e.target.value;
		this.setState({ editAdjustmentData: reqData });
	}

	saveEditAdjustment = () => {
		const { dispatch } = this.props;
		let post = {
			quantity:Number(this.state?.editAdjustmentData?.adujustment_quantity),
			material_log_id:this.state?.editAdjustmentData?.material_log_id,
			material_adjustment_id:this.state?.editAdjustmentData?._id,
			notes: this.state?.editAdjustmentData?.notes,
			adjustment_date:this.date,
			user_id:this.userId
		}
		dispatch(adjustmentUpdateMaterial(post, (data)=>{
			dispatch(getMaterialLogListById(this.material_id, post.adjustment_date));
			dispatch(getMaterialDetailsById(this.material_id));
			this.handleEditAdjustmentModel();
			this.setState({editAdjustmentData:{}});
		}));
	}

	editRequestHandler = (rq) => {
		this.handleEditModel();
		this.setState({editRequestData:rq});
	}

	deleteRequestHandler = (rq) => {
		let post = {
			request_detail_id:rq._id,
			project_id:rq.project_id,			
			store_room_id:rq.store_room_id,
			store_room_request_id:rq.store_room_request_id,
			user_id:this.userId
		}
		sweetAlert(
			() =>
				this.props.dispatch(
					deleteMateriaRequest(post,(data)=>{
						this.props.dispatch(getMaterialLogListById(this.material_id, this.date));
						this.props.dispatch(getMaterialDetailsById(this.material_id));
					}),
				),
			'Request',
			'Delete',
		)
	}

	setQuanityEditRequest = (e) =>{
		let reqData = this.state?.editRequestData ? this.state?.editRequestData : {};
		reqData.quantity = e.target.value;
		this.setState({ editRequestData: reqData });
	}

	saveEditRequest = () => {
		const { dispatch } = this.props;
		let post = {
			request_detail_id:this.state.editRequestData._id,
			project_id:this.state.editRequestData.project_id,
			quantity:this.state.editRequestData.quantity,
			store_room_id:this.state.editRequestData.store_room_id,
			store_room_request_id:this.state.editRequestData.store_room_request_id,
			user_id:this.userId
		}
		dispatch(updateMaterialRequest(post, (data)=>{
			dispatch(getMaterialLogListById(this.material_id, this.date));
			dispatch(getMaterialDetailsById(this.material_id));
			this.handleEditModel();
			this.setState({editRequestData:{}});
		}));
	}

	deleteConsumptionHandler = (cn) => {
		const { dispatch } = this.props;
		let post = {
			material_log_id:cn.material_log_id,
			consumption_id:cn._id,
			consumption_date:this.date,
			project_id:this.project_id,
			user_id:this.userId
		}
		sweetAlert(
			() =>
				this.props.dispatch(
					consumptionDeleteMaterial(post,(data)=>{
						this.props.dispatch(getMaterialLogListById(this.material_id, this.date));
						this.props.dispatch(getMaterialDetailsById(this.material_id));
					}),
				),
			'Consumption',
			'Delete',
		)
	}

	render() {
		const { mateialLog, singleMaterial } = this.props;
		const { info,  } = this.state;
		let searchDataSource = [];
		mateialLog?.materialLogsRs?.forEach((slist) => {
			searchDataSource = searchDataSource.concat(slist?.material);
		});

		const minDate = singleMaterial && Array.isArray(singleMaterial) && singleMaterial.length > 0 ? new Date(singleMaterial[0].start_date) : new Date();
		const maxDate = Array.isArray(singleMaterial) && singleMaterial.length > 0 ? new Date(singleMaterial[0].end_date) : new Date();
		
		const {
			btn_hide,
			btn_unlock,
			btn_download,
			description,
			opening_qty,
			issued,
			adjustment,
			consumend,
			available,
			notes,
			requsted,
			ph_updateQuantity,
			update_adjustment,
			ph_updateAdjustment,
			adjustmentValue,
			consumption_qty,
			edit_consumption,
			ph_consumptionValue
		} = getSiteLanguageData('material');
		const { action, save,ph_quantity,ph_notes } = getSiteLanguageData('commons');
		const { material_log } = getSiteLanguageData('material/materiallog');

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
											className="lf-common-btn"
											href={`/reports/${this.project_id}`}>
											<i className="fa fa-arrow-left" aria-hidden="true"></i>
										</a>
									</div>
									<div className="float-start d-none d-lg-inline-block">
										<span className="lf-text-overflow-350 text-nowrap mt-1">
											{this.store_room_log_name
											? this.store_room_log_name
											: ''}
										</span>
									</div>
									<div className="ms-auto d-flex float-end align-items-center d-inline-block">
										<div className="float-start d-inline-block pe-2 theme-secondary">
											<i
												className="fas fa-less-than"
												onClick={() => {
													const tomorrow = moment(this.date).toDate();
													const date = tomorrow.setDate(tomorrow.getDate() - 1);
													const firstDate = moment(minDate).toDate();
													if(new Date(moment(minDate).format("YYYY-MM-DD")) <=  new Date(moment(date).format("YYYY-MM-DD"))){
														window.location.href = `/reports/${
															this.project_id
														}/materialLog/${
															this.material_id
														}?material_date=${moment(date).format(
															'YYYY-MM-DD',
														)}&name=${this.store_room_log_name}`;
													}else{
														errorNotification("You can't view before report dates data");
													}
													
												}}
											/>
											<span
												style={{
													display: 'd-inline-block',
													width:'auto'
												}}
												className="theme-btnbg mx-1 react-datepicker__input-container text-nowrap theme-secondary rounded lf-link-cursor">
												<DatePicker
													tooltip="Calender"
													flow="down"
													className="d-inline-block"
													selected={moment(this.date).toDate()}
													customInput={
														<span>
															<i className="far fa-calendar-alt " />{' '}
															<CustomDate date={this?.date} />
														</span>
													}
													onChange={(e) => {
														const date = moment(e).format('YYYY-MM-DD');
														window.location.href = `/reports/${this.project_id}/materialLog/${this.material_id}?material_date=${date}&name=${this.store_room_log_name}`;
													}}
													minDate={new Date(minDate)}
													maxDate={maxDate && maxDate > new Date() ? new Date() : maxDate}
												/>
											</span>

											<i
												className="fas fa-greater-than"
												onClick={() => {
													// const current = moment(this.date).toDate();
													const tomorrow = moment(this.date).toDate();
													const date = tomorrow.setDate(tomorrow.getDate() + 1);
													if (
														new Date(moment(this.date).format("YYYY-MM-DD")) <= new Date(moment().format("YYYY-MM-DD")) && date <= new Date()
													) {
														window.location.href = `/reports/${
															this.project_id
														}/materialLog/${
															this.material_id
														}?material_date=${moment(date).format(
															'YYYY-MM-DD',
														)}&name=${this.store_room_log_name}`;
													} else {
														errorNotification("You Can't View Future Report");
													}
												}}
											/>
										</div>

										<div className="float-start d-none d-lg-inline-block">
											<span
												className="theme-btnbg btn border-0"
												onClick={() =>
													this.manageCollapsibleData({
														...this.state.collapsibleData,
														[mateialLog?.materialLogsRs?.map((sr) => sr?._id)]:
															!this.state.collapsibleData?.[
																mateialLog?.materialLogsRs?.map((sr) => sr?._id)
															],
													})
												}>
												{this.state.collapsibleData?.[
													mateialLog?.materialLogsRs?.map((sr) => sr?._id)
												] === true ? (
													<i className="fas fa-expand-alt"></i>
												) : (
													<i className="fas fa-compress-alt"></i>
												)}
											</span>	
										</div>

										<div className="float-start d-inline-block">
											{/* <AddEntry
											isDisabled={mateialLog?.materiallogReportRs?.map((c) => c?.is_locked,)[0]}
											/> */}

											{mateialLog?.materiallogReportRs?.map(
												(c) => c?.is_locked,
											)[0] === false ? (
												<>
													{' '}
													<AddEntry
														isDisabled={mateialLog?.materiallogReportRs?.map((c) => c?.is_locked,)[0]}
													/>
												</>
											) : (
												// <SignMaterialLog />
												<>
												</>
											)}
										</div>

										<div className="float-start d-none d-md-inline-block">

										{mateialLog?.materiallogReportRs?.map(
												(c) => c?.is_locked,
											)[0] === false ? (
												<>
													{' '}
													<CreateMaterial
														type="core"
														isDisabled={
															mateialLog?.materiallogReportRs?.map(
																(c) => c?.is_locked,
															)[0]
														}/>
												</>
											) : (
												<>
												</>
											)}
										

											
										</div>

										<div className="float-start d-none d-md-inline-block">
											<MaterialLogInfo
											data={this.material_id}
											type={'Material Log'}
											onlyinfo={"onlyinfo"}
										/>
											
										</div>

										<div className="float-start d-inline-block">
											{mateialLog?.materiallogReportRs?.map(
												(c) => c?.is_locked,
											)[0] === true ? (
												<>
													{' '}
													<span
														type="submit"
														className="theme-secondary lf-common-btn btn"
														onClick={() =>{
																this.setState({shareLink:null});
																sweetAlert(
																	() => {
																		this.hendleShowShereModel();
																		this.props.dispatch(
																			downloadMateriaLog({
																				project_id: this.project_id,
																				user_id: this.userId,
																				from_date: this.date,
																				to_date: this.date,
																				material_log_id: this.material_id,
																			},(repData)=>{
																				if(repData?.data?.result?.file){
																					this.setState({shareLink:repData?.data?.result?.file})
																				}else{
																					this.setState({shareLink:null})
																				}
																			}),
																		)},
																	'Material Report',
																	'Download',
																)
															}
														}>
														<i className="fa-solid fa-download pe-2"></i>
														{btn_download?.text}
													</span>
													<span
														className="theme-secondary lf-common-btn btn"
														onClick={() =>
															sweetAlert(
																() =>
																	this.props.dispatch(
																		unlockReport({
																			report_date: this.date,
																			material_id: this.material_id,
																			project_id: this.project_id,
																			user_id: this.userId,
																			report_name: this.store_room_log_name,
																			report_id:
																				mateialLog?.materiallogReportRs?.map(
																					(c) => c?._id,
																				)[0],
																			report_type: 'MaterialLog',
																		}),
																	),
																'Material Log',
																'Unlock',
															)
														}>
														<i className="fa-solid fa-lock-open pe-2"></i>
														{btn_unlock?.text}
													</span>
												</>
											) : (
												// <SignMaterialLog />
												<>
													{
														new Date(this.date) <= new Date() && (
															<Signature
																setUrl={this.handleSign}
																url={info?.signature_url}
																signReport={this.signMaterial}
															/>
														)
													}
												</>
												
											)}
											
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					
					{!mateialLog?.materialLogsRs ? (
						<Nodata type="Material Log">
							{/* <CreateOrder className="text-center btn lf-common-btn theme-secondary border lf-link-cursor fw-bold mt-2" /> */}
						</Nodata>
					) : (
						<div className="container-fluid mt-3">
							<div className=" theme-table-wrapper scroll-y mb-4 card no-bg">
								<table className="table table-hover theme-table">
									<thead className=" theme-table-title text-nowrap text-center bg-light">
										<tr className="theme-table-data-row">
											<th className="text-start lf-w-250 m-w-200 px-2">
												{description?.text}
											</th>
											<th className="text-start lf-w-150 m-w-80">Date</th>
											<th className="text-end lf-w-120 m-w-90">{opening_qty?.text}</th>
											<th className="text-end lf-w-100 m-w-80">{issued?.text}</th>
											<th className="text-end lf-w-100 m-w-80">{adjustment?.text}</th>
											<th className="text-end lf-w-100 m-w-80">{requsted?.text}</th>
											<th className="text-end lf-w-100 m-w-80">{consumend?.text}</th>
											<th className="text-end lf-w-100 m-w-80">{available?.text}</th>
											<th className="text-center lf-w-180 m-w-90">{notes?.text}</th>
											<th className="text-center lf-w-100 m-w-70 px-2">
												{action?.text}
											</th>
										</tr>
									</thead>
									<tbody
										className={`theme-table-title text-capitalize text-nowrap text-center `}>
										{mateialLog?.materialLogsRs?.map((sr) => {
											const requestedCount = calculateRequestedCount(sr.requsted);
											const sumOfRequestedValue = calculateSumOfPositiveValues(requestedCount);
											return (
												<>
													{/* <tr
														className={`theme-table-data-row  lf-task-color ${
															!this.state.collapsibleData?.[
																mateialLog?.materialLogsRs?.map((sr) => sr?._id)
															]
																? 'bg-light'
																: 'bg-light'
														}`}> */}
														<tr
														className="theme-table-data-row  lf-task-color bg-white">
														<td
															colSpan={2}
															className="lf-w-250 text-start px-2"
															onClick={() =>
																this.manageCollapsibleData({
																	...this.state.collapsibleData,
																	[sr._id]:
																		!this.state.collapsibleData?.[sr._id],
																})
															}>
															{sr?.material?.map((m) => (
																<span className="">
																	{m?.type?.length > 25 ?  m?.type?.substr(0,25)+"..." : m?.type} ({m?.unit})
																</span>
															))}
														</td>
														{/* <td className="lf-w-100 text-start"></td> */}
														<td className="text-end lf-w-120">
															{sr?.opening_quantity}
														</td>
														<td className="text-end lf-w-100">
															{sr?.total_issued}
														</td>
														<td className="text-end lf-w-100">
															{sr?.total_adustment}
														</td>
														<td className="text-end lf-w-100">
															{sumOfRequestedValue || 0}
														</td>
														<td className="text-end lf-w-100">
															{sr?.total_consumption}
														</td>
														<td className="text-end lf-w-100">
															{sr?.stock_quantity}
														</td>
														<td className="text-start lf-w-180"></td>
														<td className="text-end lf-w-100"></td>
													</tr>
													{sr?.requsted?.map((rq) => {
														const total =
															rq?.quantity -
															(rq?.delivered_quantity
																? rq?.delivered_quantity
																: 0);
															
														return total < 0 ||
														total === 0 ||
														total == 'NaN' ? <></> :

														 (
															<tr
																className={`theme-table-data-row bg-white ${
																	!this.state.collapsibleData?.[
																		mateialLog?.materialLogsRs?.map(
																			(sr) => sr?._id,
																		)
																	]
																		? ''
																		: 'd-none'
																}`}>
																<td tooltip={rq?.store_room?.[0]?.description} flow={"right"} className={`text-start lf-w-250 ps-4 pe-2 ${rq.request?.[0]?.status != "Delivered" ? 'text-danger' : ''}`}>
																	{rq?.store_room?.[0]?.description?.length > 25 ?  rq?.store_room?.[0]?.description?.substr(0,25)+"..." : rq?.store_room?.[0]?.description} 
																	{
																		// rq?.store_room?.[0]?.description
																	} {/* {rq?.request?.map((re) => {
																		return re?.location?.map((l) => l.name);
																	})} */}
																</td>
																<td className="text-start pt-auto pb-auto lf-w-100">
																	{moment(rq?.order_info?.date_of_order).format(
																		'DD-MM-YYYY',
																	)}
																</td>
																<td className="text-center lf-w-120">
																	{/* {sr?.date_of_order} */}
																</td>
																<td className="text-center lf-w-100"></td>
																<td className="text-center lf-w-100"></td>
																<td className="text-end lf-w-100">
																	{total || 0}
																</td>
																<td className="text-center lf-w-100"></td>
																<td className="text-center lf-w-100"></td>
																<td className="text-center lf-w-180"></td>
																<td className="text-center lf-w-100">
																	{
																		rq?.request?.[0]?.status == "Pending" && (mateialLog?.materiallogReportRs?.[0]?.is_locked != true) ? (
																			<>
																				<span onClick={()=>this.editRequestHandler({
																					...rq,
																					material_name:(sr?.material?.[0]?.type)+" ("+sr?.material?.[0]?.unit+")"
																				})}>
																					<i className="theme-bgcolor far fa-edit  lf-link-cursor"></i>
																				</span>
																				<span onClick={()=>this.deleteRequestHandler(rq)}>
																				<i className="theme-bgcolor fas fa-trash-alt lf-link-cursor ms-2"></i>
																				</span>
																			</>
																		) : ('')
																	}
																	
																	
																</td>
															</tr>
														);
													})}
													{sr?.adustment?.map((ad) => {
														return (
															<tr
																className={`theme-table-data-row bg-white ${
																	!this.state.collapsibleData?.[
																		mateialLog?.materialLogsRs?.map(
																			(sr) => sr?._id,
																		)
																	]
																		? ''
																		: 'd-none'
																}`}>
																<td className="text-start lf-w-250 ps-4 pe-2">Adjustment </td>
																<td className="text-start pt-auto pb-auto lf-w-100">
																	{moment(ad?.adjustment_date).format(
																		'DD-MM-YYYY',
																	)}
																</td>
																<td className="text-center lf-w-120">
																	{/* {sr?.date_of_order} */}
																</td>
																<td className="text-center lf-w-100"></td>
																<td className="text-end lf-w-100">{ad?.adujustment_quantity}</td>
																<td className="text-end lf-w-100"></td>
																<td className="text-center lf-w-100"></td>
																<td className="text-center lf-w-100"></td>
																<td title={ad?.notes} className="text-center lf-w-180">{ad.notes && ad?.notes.length > 15 ? ad?.notes?.substr(0,14)+"..." : ad?.notes}</td>
																<td className="text-center lf-w-100">
																	{
																		(mateialLog?.materiallogReportRs?.[0]?.is_locked != true) ? (
																			<>
																				<span onClick={()=>this.editAdjustmentHandler(ad)}>
																					<i className="theme-bgcolor far fa-edit  lf-link-cursor"></i>
																				</span>
																				<span onClick={()=>this.deleteAdjustmentHandler(ad)}>
																					<i className="theme-bgcolor fas fa-trash-alt lf-link-cursor ms-2"></i>
																				</span>	
																			</>
																		): ('')
																	}
																																	
																</td>
															</tr>
														);
													})}
													{sr?.issued?.map((is) => {
														return (
															<tr
																className={`theme-table-data-row bg-light ${
																	!this.state.collapsibleData?.[
																		mateialLog?.materialLogsRs?.map(
																			(sr) => sr?._id,
																		)
																	]
																		? ''
																		: 'd-none'
																}`}>
																<td tooltip={is?.store_room?.[0]?.description} flow={"right"} className="text-start lf-w-250 ps-4 pe-2">
																	
																	{is?.store_room?.[0]?.description?.length > 25 ?  is?.store_room?.[0]?.description?.substr(0,25)+"..." : is?.store_room?.[0]?.description} 
																	{/* {is?.request?.map((re) => {
																		return re?.location?.map((l) => l.name);
																	})} */}
																</td>
																<td className="text-start pt-auto pb-auto lf-w-100">
																	{moment(is?.transaction_date).format(
																		'DD-MM-YYYY',
																	)}
																</td>
																<td className="text-center lf-w-120"></td>
																<td className="text-end lf-w-100">
																	{is?.quantity}
																</td>
																<td className="text-center lf-w-100"></td>
																<td className="text-end lf-w-100"></td>

																<td className="text-center lf-w-100">
																	{/* {rq?.quantity} */}
																</td>
																<td className="text-center lf-w-100"></td>
																<td className="text-center lf-w-180">
																	{/* notes give in ent */}
																</td>
																<td className="text-center lf-w-100">
																	{/* <i className="theme-bgcolor far fa-edit  lf-link-cursor"></i>
																	<i className="theme-bgcolor fas fa-trash-alt lf-link-cursor ms-2"></i> */}
																</td>
															</tr>
														);
													})}
													{sr?.consumption?.map((pr) => {
														// const sum =+ pr?.quantity;
														return (
															<tr
																className={`theme-table-data-row bg-light ${
																	!this.state.collapsibleData?.[
																		mateialLog?.materialLogsRs?.map(
																			(sr) => sr?._id,
																		)
																	]
																		? ''
																		: 'd-none'
																}`}>
																<td className="text-start lf-w-250 ps-4 pe-2">
																	{/* {pr?.order_info?.order_no} */}
																	Consumption
																</td>
																<td className="text-start pt-auto pb-auto lf-w-100">
																	{moment(pr?.consumption_date).format(
																		'DD-MM-YYYY',
																	)}
																</td>
																<td className="text-center lf-w-120"></td>
																<td className="text-center lf-w-100"></td>
																<td className="text-center lf-w-100"></td>
																<td className="text-center lf-w-100"></td>
																<td className="text-end lf-w-100">
																	{pr?.quantity}
																</td>
																<td className="text-center lf-w-100"></td>
																<td className="text-center lf-w-180">
																	{pr?.notes}
																</td>
																<td className="text-center lf-w-100">
																	{
																		(mateialLog?.materiallogReportRs?.[0]?.is_locked != true) ? (
																			<>
																				<span onClick={()=>this.editConsumptionHandler(pr)}>
																					<i className="theme-bgcolor far fa-edit  lf-link-cursor"></i>
																				</span>
																				<span onClick={()=>this.deleteConsumptionHandler(pr)}>
																					<i className="theme-bgcolor fas fa-trash-alt lf-link-cursor ms-2"></i>
																				</span>
																			</>
																		) : ('')
																	}
																</td>
															</tr>
														);
													})}
												</>
											);
										})}
									</tbody>
								</table>

								{/* </div> */}
							</div>
						</div>
					)}
				</div>

				<Modal
					className="lf-modal"
					size={'sm'}
					show={this.state.showEditRequestModel}
					onHide={this.handleEditModel}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>Update Request</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						
						<div className="row">
							
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{this?.state?.editRequestData?.material_name}</Form.Label>
								<InputGroup>
									<FormControl
										placeholder={ph_updateQuantity?.text}
										type="number"
										pattern="[0-9]"
										name="material_value"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={this.setQuanityEditRequest}
										value={this.state?.editRequestData?.quantity}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-12">
								<Button
									type="button"
									onClick={this.saveEditRequest}
									disabled={typeof this.state?.editRequestData?.quantity == "undefined" || (this.state?.editRequestData?.quantity && this.state?.editRequestData?.quantity <= 0)}
									className="btn btn-primary mt-3 ms-3 float-end theme-btn btn-block show-verify">
									{save?.text}
								</Button>
							</div>
						</div>
						
					</Modal.Body>
				</Modal>

				<Modal
					className="lf-modal"
					size={'sm'}
					show={this.state.showEditAdjustmentModel}
					onHide={this.handleEditAdjustmentModel}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{update_adjustment?.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						
						<div className="row">
							
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{adjustmentValue?.text}</Form.Label>
								<InputGroup>
									<FormControl
										placeholder={ph_quantity?.text}
										type="number"
										pattern="[0-9]"
										name="material_value"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={this.setAdjustmentEditRequest}
										value={this.state?.editAdjustmentData?.adujustment_quantity}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{notes?.text}</Form.Label>
								<InputGroup>
									<FormControl
										placeholder={ph_notes?.text}
										type="text"
										name="notes"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={this.setAdjustmentEditNotes}
										value={this.state?.editAdjustmentData?.notes}
										
									/>
								</InputGroup>
							</div>
							<div className="col-12">
								<Button
									type="button"
									onClick={this.saveEditAdjustment}
									disabled={typeof this.state?.editAdjustmentData?.quantity == "undefined" || (this.state?.editRequestData?.quantity && this.state?.editRequestData?.quantity <= 0)}
									className="btn btn-primary mt-3 ms-3 float-end theme-btn btn-block show-verify">
									{save?.text}
								</Button>
							</div>
						</div>
						
					</Modal.Body>
				</Modal>

				<Modal
					className="lf-modal"
					size={'sm'}
					show={this.state.showEditConsumptionModel}
					onHide={this.handleEditConsumptionModel}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{edit_consumption?.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						
						<div className="row">
							
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{consumption_qty?.text}</Form.Label>
								<InputGroup>
									<FormControl
										placeholder={ph_consumptionValue?.text}
										type="number"
										pattern="[0-9]"
										name="material_value"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={this.setConsumptionEditRequest}
										value={this.state?.editConsumptionData?.quantity}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{notes?.text}</Form.Label>
								<InputGroup>
									<FormControl
										placeholder={ph_notes?.text}
										type="text"
										name="material_value"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={this.setConsumptionNoteEditRequest}
										value={this.state?.editConsumptionData?.notes}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-12">
								<Button
									type="button"
									onClick={this.saveEditConsumption}
									disabled={typeof this.state?.editConsumptionData?.quantity == "undefined" || (this.state?.editRequestData?.quantity && this.state?.editRequestData?.quantity <= 0)}
									className="btn btn-primary mt-3 ms-3 float-end theme-btn btn-block show-verify">
										<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save?.text}
								</Button>
							</div>
						</div>
						
					</Modal.Body>
				</Modal>

				<GenerateSurveyReport open={this.state.showShareModel} project_id={this.project_id} shareLink={this.state.shareLink} handleClose={this.hendleShowShereModel} />
			</Layout>
		);
	}
}
export default withRouter(
	connect((state) => {
		return {
			mateialLog: state?.storeroom?.[GET_MATERIAL_LOG_BY_DATE]?.result || [],
			singleMaterial:state?.storeroom?.[GET_MATERIAL_DETAILS_BY_ID]?.result || [],
		};
	})(MaterialLog),
);
