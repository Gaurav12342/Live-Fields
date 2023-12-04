import { Component } from 'react';
import { connect } from 'react-redux';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import {
	GET_ALL_LABOUR_LIST,
	GET_LABOUR_LOG_BY_PROJECT_ID,
	GET_LABOUR_AND_EQUIPMENT_DETAILS
} from '../../store/actions/actionType';
import {
	downloadLabourAndEquipmentLog,
	getAllLabourList,
	getLabourLogByLabourIdByDate,
	signLabourAndEquipmentLog,
	updateLabourLog,
	deleteLabourLog
	
} from '../../store/actions/projects';
import { FormControl } from 'react-bootstrap';
import CreateLabourLog from './createLabourLog';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import { getParameterByName } from '../../helper';
import getUserId, { getSiteLanguageData, sweetAlert } from '../../commons';
import CreateLabour from './createLabour';
import { unlockReport, getlabourAndequipmentDetails } from '../../store/actions/report';
import ReportInfo from '../Reports/Components/reportInfo';
import { errorNotification } from '../../commons/notification';
import DatePicker from 'react-datepicker';
import Signature from '../../components/signature';
import withRouter from '../../components/withrouter';
import LabourAndEquipmentDetails from './labourAndEquipmentDetails';
import CustomDate from '../../components/CustomDate';
import GenerateSurveyReport from '../Reports/Components/GenerateSurveyReport';
import { Link } from 'react-router-dom';

class LabourLog extends Component {
	constructor(props) {
		super(props);
		this.userId = getUserId();
		const { data } = this.props;
		this.project_id = this.props.router?.params.project_id;
		this.labour_log_id = this.props.router?.params.labour_equipment_log_id;
		this.date = getParameterByName('labour_equipment_log_date');
		this.report_name_log = getParameterByName('name');
		this.state = {
			sortType: '3',
			info: data?.labourRs?.map((m) => {
				return {
					labour_log_id: m?._id,
					user_id: this.userId,
					quantity: m?.quantity,
					hours: m?.hours,
					notes: m?.notes,
					labour_id: m?.labour_id,
					total_hours: m?.total_hours,
					minutes:m?.minutes,
					project_id:m?.project_id
				};
			}),
			editList: [],
			editReport: false,
			signLabour: {
				labour_equipment_log_id: this.labour_log_id,
				user_id: this.userId,
				project_id: this.project_id,
				report_date: this.date,
				signature_url: '',
				signed_by: this.userId,
			},
			show: false,
			showShareModel:false,
			shareLink:null
		};
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getAllLabourList(this.project_id));
		dispatch(getLabourLogByLabourIdByDate(this.labour_log_id, this.date));
		dispatch(getlabourAndequipmentDetails(this.labour_log_id));
	}

	componentDidUpdate(prevProps, prevState) {
		const { data } = this.props;
		if (data?.labourRs !== prevProps.data?.labourRs) {
			if (!!data?.labourRs) {
				this.setState({
					info: data?.labourRs?.map((m) => {
						return {
							labour_log_id: m?._id,
							user_id: this.userId,
							quantity: m?.quantity,
							hours: m?.hours,
							notes: m?.notes,
							labour_id: m?.labour_id,
							total_hours: m?.total_hours,
							minutes:m?.minutes,
							project_id:m?.project_id
						};
					}),
				});
			}
		}
	}

	setSignEquipment = (signLabour) => {
		this.setState({ signLabour });
	};
	handleClose = () => {
		this.setState({ show: false });
	};
	handleChange = (name, value) => {
		this.setSignEquipment({
			...this.state.signLabour,
			[name]: value,
		});
	};

	hendleShowShereModel = () => {
		this.setState({showShareModel:!this.state.showShareModel});
	};

	handleUrl = (url) => {
		this.setSignEquipment({
			...this.state.signLabour,
			signature_url: url,
		});
	};

	handleChangeLabour = (name, val, k) => {

		if(name == "hours" && ( val != "" && (val == 0 || Number(val) <= 0 || Number(val) > 24))){
			errorNotification("Hours value should be between 0 to 24");
		}else if(name == "minutes" && ( val != "" && (val == 0 || Number(val) <= 0 || Number(val) > 60))){
			errorNotification("Hours value should be between 0 to 60");
		}else{
			const arr = this.state.info;
			const editList = [...this.state.editList];
			if (!editList.includes(arr[k].labour_log_id)) {
				editList.push(arr[k].labour_log_id);
			}
			arr[k] = {
				...arr[k],
				[name]: val,
			};

			this.setState({
				info: [...arr],
				editList,
			});
		}		
	};
	handleSortType = (sortType) => {
		this.setState(sortType);
	};
	saveEditLabour = (e) => {
		e.preventDefault();
		const { info, editList } = this.state;
		const listToUpdate = info.filter((log) =>
			editList.includes(log.labour_log_id),
		);
		for (let i = 0; i < listToUpdate.length; i++) {
			this.props.dispatch(
				updateLabourLog(listToUpdate[i], {
					labour_equipment_log_id: this.labour_log_id,
					date: this.date,
					dispatchOthers: i == listToUpdate.length - 1,
					showMessage: i == listToUpdate.length - 1,
				}),
			);
		}
		this.setState({ editReport: false });
		// this.props.dispatch(getLabourLogByLabourIdByDate(this.labour_log_id, this.date));
	};
	submitLabour = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(signLabourAndEquipmentLog(this.state.signLabour));
	};
	render() {
		const { data, labourList, reportInfo } = this.props;
		const { info, editReport, signLabour } = this.state;
		const labourLog = labourList?.map((b) => {
			return { label: b.name, value: b._id };
		});
		
		// if (!data?.labourRs?.length && data?.labourRs?.length !== 0) {
		//   return <Loading />
		// }

		const minDate = reportInfo && Array.isArray(reportInfo) && reportInfo.length > 0 ? new Date(reportInfo[0].start_date) : new Date();
		const maxDate = Array.isArray(reportInfo) && reportInfo.length > 0 ? new Date(reportInfo[0].end_date) : new Date();
		

		const {
			icon_edit,
			icon_select,
			icon_save,
			btn_download,
			btn_unlock,
			Labour_Equipment,
			ph_selectLabour,
			delete_labourlog_confirmation
		} = getSiteLanguageData('labour');
		const { btn_equipment } = getSiteLanguageData('equiqment');
		const { action, description, nos, hours, minutes,total_hours, notes } =
			getSiteLanguageData('commons');
		// let tomorrow = moment(this.date).toDate();
		// let nextDate = tomorrow.setDate(tomorrow.getDate() + 1);
		// let prevDate = tomorrow.setDate(tomorrow.getDate() - 1);
		return (
			<Layout>
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar z-index-6">
						<section>
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
											<span className="text-nowrap">
												{this.report_name_log ? this.report_name_log : ''}
											</span>
										</div>
										<div className="ms-auto d-flex float-end align-items-center d-inline-block">
											<div className="float-start d-inline-block">
												<span className="pe-2 theme-secondary">
													{/* <Link to={`/reports/${this.project_id}/labour_log/${this.labour_log_id}?labour_equipment_log_date=${moment(prevDate).format('YYYY-MM-DD')}&name=${this.report_name_log}`}> */}
													<i
														className="fas fa-less-than"
														onClick={() => {
															const tomorrow = moment(this.date).toDate();
															const date = tomorrow.setDate(tomorrow.getDate() - 1);
															if(new Date(minDate) <=  new Date(moment(date).format("YYYY-MM-DD"))){
																window.location.href = `/reports/${
																	this.project_id
																}/labour_log/${
																	this.labour_log_id
																}?labour_equipment_log_date=${moment(date).format(
																	'YYYY-MM-DD',
																)}&name=${this.report_name_log}`;
															}else{
																errorNotification("You can't view before report dates data");
															}
														}}
													/>
													{/* </Link> */}
													<span
														className="theme-btnbg mx-1 react-datepicker__input-container text-nowrap theme-secondary rounded lf-link-cursor"
														style={{
															width: 'auto',
															display: 'inline-block',
														}}>
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
																window.location.href = `/reports/${this.project_id}/labour_log/${this.labour_log_id}?labour_equipment_log_date=${date}&name=${this.report_name_log}`;
															}}
															minDate={new Date(minDate)}
															maxDate={maxDate && maxDate > new Date() ? new Date() : maxDate}
														/>
													</span>
													{/* <Link to={`/reports/${this.project_id}/labour_log/${this.labour_log_id}?labour_equipment_log_date=${moment(nextDate).format('YYYY-MM-DD',)}&name=${this.report_name_log}`}> */}
													{/* {this.date} */} {/* Need o check for the removal */}
													<i
														className="fas fa-greater-than"
														onClick={() => {
															const tomorrow = moment(this.date).toDate();
															const date = tomorrow.setDate(tomorrow.getDate() + 1);
															// if (maxDate > new Date(this.date)) {
															if (new Date(this.date) < new Date(maxDate) && new Date(moment(date).format("YYYY-MM-DD")) <= new Date()) {
																window.location.href = `/reports/${
																	this.project_id
																}/labour_log/${
																	this.labour_log_id
																}?labour_equipment_log_date=${moment(date).format(
																	'YYYY-MM-DD',
																)}&name=${this.report_name_log}`;
															} else {
																errorNotification("You Can't View Feature Report");
															}
														}}
													/>
													{/* </Link> */}
												</span>
											</div>

											<div className="float-start d-none d-md-inline-block">
												<LabourAndEquipmentDetails
													data={this.labour_log_id}
													type="Labour & Equipment Log"
													onlyinfo={"onlyinfo"}
												/>
											</div>


											<div className="float-start d-inline-block">
												{data?.labourlogreportRs?.map((c) => c?.is_locked)[0] === true ? (
												<span
													className="lf-common-btn"
													onClick={() =>
														sweetAlert(
															() =>
																this.props.dispatch(
																	unlockReport({
																		report_date: this.date,
																		project_id: this.project_id,
																		labour_equipment_log_id: this.labour_log_id,
																		user_id: this.userId,
																		report_name: this.report_name_log,
																		report_id: data?.labourlogreportRs?.map(
																			(c) => c?._id,
																		)[0],
																		report_type: 'LabourEquipmentLog',
																	}),
																),
															'Labour & Equipment Log',
															'Unlock',
														)
													}>
													<i className="fa-solid fa-lock-open pe-2"></i>
													{btn_unlock?.text}
												</span>
												) : (
												// <SignLabourAndEquipmentLog />
												<>
													{
														new Date(this.date) <= new Date() && (
															<Signature
																setUrl={this.handleUrl}
																url={signLabour?.signature_url}
																signReport={this.submitLabour}
															/>
														)
													}
												</>
												)}
											</div>


											<div className="float-start d-inline-block">
												{data?.labourlogreportRs?.map((c) => c?.is_locked)[0] === true ? (
												<span
													type="submit"
													className="lf-common-btn"
													onClick={() =>{
															this.setState({shareLink:null});
															sweetAlert(
																() =>{
																		this.hendleShowShereModel();
																		this.props.dispatch(
																			downloadLabourAndEquipmentLog({
																				project_id: this.project_id,
																				user_id: this.userId,
																				report_date: this.date,
																				labour_equipment_log_id: this.labour_log_id,
																			},(repData)=>{
																				if(repData?.data?.result?.file){
																					this.setState({shareLink:repData?.data?.result?.file})
																				}else{
																					this.setState({shareLink:null})
																				}
																			}),
																		)},
																'Labour Report',
																'Download',
															)
														}
													}>
													<i className="fa-solid fa-download pe-2"></i>
													{btn_download?.text}
												</span>
												) : (
													''
												)}
											</div>
												

										</div>
									</div>
								</div>
							</div>
						</section>
						<div className='border-top'></div>
						<section>
							<div className="row align-items-center">
								<div className="col-12 my-2">
									<span className="px-4 theme-color">Labour</span>
									<span className='border-start py-0'></span>
									<span className="px-4 border-0">
										<Link
										className="text-dark"
										to={`/reports/${this.project_id}/equipment_log/${this.labour_log_id}?labour_equipment_log_date=${this.date}&name=${this.report_name_log}`}>
										{btn_equipment?.text}
									</Link>
									</span>

									
								</div>
							</div>
						</section>
					</section>
					<section className="px-3">
						<div className="row">
							{/* <div className="col-2 mt-1">
                  <i className="fas fa-search theme-btnbg py-2 m-1"></i>
                  <input
                    type="text"
                    className="d-block form-control border border-0"
                    placeholder="Search"
                  />
                </div> */}
							{/* <div className="col-5">
              {/* <Dropdown>
                    <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="mt-1 lf-common-btn">
                      <span className="">{sortingList[parseInt(this.state.sortType) - 1]}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ backgroundColor: '#73a47' }} className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu ">
                      {sortingList.map((st, k) => {
                        return <Dropdown.Item key={k} className='lf-layout-profile-menu' onClick={() => this.handleSortType((k + 1).toString())}>{st}</Dropdown.Item>
                      })}
                    </Dropdown.Menu>
                  </Dropdown> 
            </div> */}
							<div
								className="col-12"
								style={
									data?.labourlogreportRs?.map((c) => c?.is_locked)[0] === true
										? { display: 'none' }
										: { visibility: 'initial' }
								}>
								<CreateLabour />
								<CreateLabourLog className="p-1 lf-link-cursor lf-main-button float-end" />

								{!info ? (
									''
								) : (
									<>
										{
											this.state?.editReport == true ? (
												<span
													type="submit"
													className="p-2 btn theme-btnbg theme-secondary rounded float-end"
													onClick={this.saveEditLabour}>
													{icon_save?.text}
												</span>
											) : (
												<span
													type="submit"
													onClick={() => this.setState({ editReport: true })}
													className="p-2 btn theme-btnbg theme-secondary rounded float-end">
													{icon_edit?.text}
												</span>
											)
										}
										
										{/* <span
											type="submit"
											className="p-2 btn theme-btnbg theme-secondary rounded float-end">
											{icon_select?.text}
										</span> */}
										
									</>
								)}
							</div>
						</div>
					</section>
					<div className="mx-2 mt-3">
						{!data?.labourRs ? (
							<Nodata type="Labour">
								<CreateLabourLog className="p-1 lf-link-cursor lf-main-button" />
							</Nodata>
						) : (
							<div className="theme-table-wrapper card mx-3">
								<table className="table table-hover theme-table">
									<thead className="theme-table-title text-nowrap bg-light">
										<tr className="bg-light text-nowrap text-capitalize col-12">
											<th className="col-4 text-start ps-3">
												{description?.text}
											</th>
											<th className="col-1 text-center">{nos?.text}</th>
											<th className="col-1 text-center">{hours?.text}</th>
											<th className="col-1 text-center">{minutes?.text}</th>
											<th className="col-1 text-center">{total_hours?.text}</th>
											<th className="col-4 text-center">{notes?.text}</th>
											<th className="col-1 text-center">{action?.text}</th>
										</tr>
									</thead>
									<tbody>
										{
											// data?.labourRs?.sort((a, b) => {
											//   if (state.sortType === "1") {
											//     return a.name?.charCodeAt(0) - b.name?.charCodeAt(0);
											//   }
											//   if (state.sortType === "2") {
											//     return b.name?.charCodeAt(0) - a.name?.charCodeAt(0);
											//   }
											//   if (state.sortType === "3") {
											//     return new Date(b.createdAt) - new Date(a.createdAt);
											//   }
											//   if (state.sortType === "4") {
											//     return new Date(a.createdAt) - new Date(b.createdAt);
											//   }
											//   return true;
											// })
											info?.map((p, k) => {
												return (
													<tr key={k} className="col-12 align-middle">
														<td className="col-4 text-start ps-3">
															{!editReport ? (
																labourLog?.filter(
																	(as) => as.value === p?.labour_id,
																)[0]?.label
															) : (
																<CustomSelect
																	className=""
																	placeholder={ph_selectLabour?.text}
																	name="labour_id"
																	onChange={(e) =>
																		this.handleChangeLabour(
																			'labour_id',
																			e.value,
																			k,
																		)
																	}
																	options={labourLog}
																	value={labourLog?.filter(
																		(as) => as.value === p?.labour_id,
																	)}
																	// isDisabled={data?.labourlogreportRs?.map(c => c?.is_locked)[0] === true}
																	// isDisabled
																/>
															)}
														</td>
														<td className="col-1 text-center px-0">
															<span>
																{!editReport ? (
																	p?.quantity
																) : (
																	<FormControl
																		className="lf-h-37 text-center"
																		type="number"
																		autoComplete="off"
																		onChange={(e) =>
																			this.handleChangeLabour(
																				'quantity',
																				e.target.value,
																				k,
																			)
																		}
																		placeholder={nos?.text}
																		value={p?.quantity}
																		disabled={
																			data?.labourlogreportRs?.map(
																				(c) => c?.is_locked,
																			)[0] === true
																		}
																	/>
																)}
															</span>
														</td>
														<td className="col-1 text-center px-0">
															<span>
																{!editReport ? (
																	p?.hours
																) : (
																	<FormControl
																		className="lf-h-37 text-center"
																		type="text"
																		autoComplete="off"
																		onChange={(e) =>
																			this.handleChangeLabour(
																				'hours',
																				e.target.value,
																				k,
																			)
																		}
																		placeholder={hours?.text}
																		value={p?.hours}
																		disabled={
																			data?.labourlogreportRs?.map(
																				(c) => c?.is_locked,
																			)[0] === true
																		}
																	/>
																)}
															</span>
														</td>
														<td className="col-1 text-center px-0">
															<span>
																{!editReport ? (
																	p?.minutes
																) : (
																	<FormControl
																		className="lf-h-37 text-center"
																		type="text"
																		autoComplete="off"
																		onChange={(e) =>
																			this.handleChangeLabour(
																				'minutes',
																				e.target.value,
																				k,
																			)
																		}
																		placeholder={minutes?.text}
																		value={p?.minutes}
																		disabled={
																			data?.labourlogreportRs?.map(
																				(c) => c?.is_locked,
																			)[0] === true
																		}
																	/>
																)}
															</span>
														</td>
														<td className="col-1 text-center px-0">
															{p?.total_hours}
														</td>
														<td className="col-4 text-start ps-3">
															<span>
																{!editReport ? (
																	p?.notes
																) : (
																	<FormControl
																		className="lf-h-37"
																		type="text"
																		autoComplete="off"
																		onChange={(e) =>
																			this.handleChangeLabour(
																				'notes',
																				e.target.value,
																				k,
																			)
																		}
																		placeholder={notes?.text}
																		value={p?.notes}
																		disabled={
																			data?.labourlogreportRs?.map(
																				(c) => c?.is_locked,
																			)[0] === true
																		}
																	/>
																)}
															</span>
														</td>
														<td className="col-1 text-center">
															{/* <UpdateLabourLog data={p} /> */}
															<span
																style={
																	data?.labourlogreportRs?.map(
																		(c) => c?.is_locked,
																	)[0] === true
																		? { pointerEvents: 'none', opacity: '0.7' }
																		: { opacity: '1' }
																}
																className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
																onClick={() => {
																  const isConfirmDelete = window.confirm(delete_labourlog_confirmation?.text)
																  if (isConfirmDelete) {
																    this.props.dispatch(
																      deleteLabourLog({
																        labour_id: this.labour_log_id,
																        date: this.date,
																        labour_log_id: [p?.labour_log_id]
																      }))
																  }
																}}
															>
																<i className="fas fa-trash-alt"></i>
															</span>
														</td>
													</tr>
												);
											})
										}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
				<GenerateSurveyReport open={this.state.showShareModel} project_id={this.project_id} shareLink={this.state.shareLink} handleClose={this.hendleShowShereModel} />
			</Layout>
		);
	}
}

export default withRouter(
	connect((state) => {
		return {
			reportInfo:state?.report?.[GET_LABOUR_AND_EQUIPMENT_DETAILS]?.result || [],
			data: state?.project?.[GET_LABOUR_LOG_BY_PROJECT_ID]?.result || [],
			labourList: state?.project?.[GET_ALL_LABOUR_LIST]?.result || [],
		};
	})(LabourLog),
);
