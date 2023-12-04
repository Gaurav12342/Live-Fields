import { Component } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';

import CustomSelect from '../../../components/SelectBox';
import DatePicker from 'react-datepicker';
import getUserId, { getSiteLanguageData } from '../../../commons';
import moment from 'moment';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
	GET_QUESTIONS_LIST_BY_REQUEST_ID,
	GET_SURVEY_REQUEST_DETAILS_BY_ID,
} from '../../../store/actions/actionType';
import { getAllRoleWisePeople } from '../../../store/actions/projects';
import { getLocationList } from '../../../store/actions/Task';
import {
	getQuestionsListByRequestId,
	getSurveyRequestDetails,
	updateSurveyReport,
} from '../../../store/actions/report';
import Loading from '../../../components/loadig';
import withRouter from '../../../components/withrouter';
import CustomDate from '../../../components/CustomDate';

class UpdateSurveyReport extends Component {
	constructor(props) {
		super(props);
		const { surveyInfo, questionsList, type, reportInfo } = this.props;
		this.report_request_id = surveyInfo?._id;
		this.userId = getUserId();
		this.project_id = this.props.router?.params.project_id;
		this.date = moment(new Date()).toDate();
		this.state = {
			show: false,
			page: 0,
			quetions: [],
			infoType: type,
			info: {
				survey_report_request_id: this.props?.data,
				user_id: this.userId,
				project_id: this.project_id,
				description: '',
				start_date: '',
				frequency: '',
				customday: '',
				end_date: '',
				assigee_id: '',
				location_id: '',
				questions: [''],
			},
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getAllRoleWisePeople(this.project_id));
		dispatch(getLocationList(this.project_id, this.userId));
		// dispatch(getQuestionsListByRequestId(this.report_request_id));
		dispatch(getSurveyRequestDetails(this.props?.data));
	}

	componentDidUpdate(prevProps, prevState) {
		const { reportInfo, surveyInfo, questionsList } = this.props;
		const report = reportInfo?.[0];
		let qlist = [];
		questionsList?.map((e) => {
			return qlist.push(e?.question);
		});
		if (questionsList !== prevProps.questionsList) {
			if (!!surveyInfo?._id) {
				this.setState({
					quetions: qlist,
				});
			}
			if (report) {
				this.setInfo({
					survey_report_request_id: report?._id,
					user_id: this.userId,
					project_id: this.project_id,
					description: report?.description,
					start_date: moment(report?.start_date).toDate(),
					frequency: report?.frequency,
					customday: report?.customday,
					end_date: moment(report?.end_date).toDate(),
					assigee_id: report?.assigee_id,
					location_id: report?.location_id,
					questions: [''],
				});
			}
		}
	}

	setShow = (show) => {
		this.setState({ show });
	};
	setQuetions = (quetions) => {
		this.setState({ quetions });
	};
	setPage = (page) => {
		this.setState({ page });
	};
	setInfoType = (infoType) => {
		this.setState({ infoType });
	};
	setInfo = (info) => {
		this.setState({ info });
	};
	handleClose = () => {
		this.setState({
			quetions: [],
			show: false,
			page: 0,
		});
		this.setInfoType('info');
	};
	handleShow = () => this.setShow(true);

	handleChange = (name, value) => {
		this.setInfo({
			...this.state.info,
			[name]: value,
		});
	};
	handleChangeQuestion = (value, index) => {
		let quetions = [...this.state.quetions];
		quetions[index] = value;
		this.setState({ quetions });
	};

	handleQuestion = (index = null) => {
		if (index) {
			const quetions = [...this.state.quetions];
			quetions.splice(index, 1);
			this.setState({ quetions });
		} else {
			const quetions = [...this.state.quetions];
			quetions.push('');
			this.setState({ quetions });
		}
	};
	submitReport = (e) => {
		const { info, quetions, infoType } = this.state;
		e.preventDefault();
		// if (this.state.page === 0) {
		if (infoType !== 'info') {
			this.setInfoType('info');
			this.setQuetions([]);
			this.props.dispatch(getQuestionsListByRequestId(this.report_request_id));
		}
		this.handleClose();
		this.props.dispatch(updateSurveyReport({ ...info, questions: quetions }));
	};
	render() {
		const {
			SurveyLocation,
			assignee,
			surveyInfo,
			hideBtn,
			questionsList,
			type,
			reportInfo,
		} = this.props;
		const { page, quetions, info, show, infoType } = this.state;
		const reportFrequency = [
			{ value: 'Daily', name: 'Daily' },
			{ value: 'First_Day_of_Month', name: 'First Day of Month' },
			{ value: 'Last_Day_of_Month', name: 'Last Day of Month' },
			{ value: 'Every_Month', name: 'Every Month' },
			{ value: 'Custom_Days', name: 'Custom Days' },
		];
		const frequency = reportFrequency?.map((tl) => {
			return { label: tl.name, value: tl.value };
		});

		const locations = SurveyLocation?.map((tl) => {
			return { label: tl.name, value: tl._id };
		});
		const projectUsers = [];
		assignee?.forEach((a) => {
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
			});
		});
		const {
			icon_edit,
			survey_report,
			update_report,
			back,
			description,
			project_name,
			assigee,
			created_by,
			created_at,
		} = getSiteLanguageData('reports/toolbar');
		const { questions, name, frequency_name, assignee_name } =
			getSiteLanguageData('reports/components/updatesurveyreport');
		const { location, start_date, end_date } = getSiteLanguageData('commons');

		return (
			<>
				{!hideBtn ? (
					<span
						className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
						tooltip={icon_edit.tooltip}
						flow={icon_edit.tooltip_flow}
						onClick={this.handleShow}>
						<i className="fas fa-pencil-alt"></i>
					</span>
				) : (
					<span
						type="submit"
						className="lf-common-btn"
						onClick={this.handleShow}>
						<i className="fa-solid fa-circle-info mx-1" aria-hidden="true"></i>{' '}
						info
					</span>
				)}
				{infoType === 'info' ? '' : ''}
				{/* <span className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1" onClick={this.handleShow} ><i className="fas fa-pencil-alt" title="Edit"></i></span> */}
				<Modal
					className="lf-modal"
					size={'md'}
					show={show}
					onHide={this.handleClose}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{survey_report?.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{infoType === 'info' ? (
							<div className="row">
								<Button
									type="button"
									className="btn btn-light btn-block my-1 show-verify"
									onClick={(e) => {
										e.preventDefault();
										this.setInfoType('ccc');
									}}>
									{back?.text}
								</Button>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{description?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0">{reportInfo[0]?.description}</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{project_name?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0">{reportInfo[0]?.project?.name}</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{assigee?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0 ">
										{reportInfo[0]?.assigee
											?.map((as) => {
												return ` ${as?.first_name} ${as?.last_name}`;
											})
											.join(',')}
									</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{location?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0 text-break">
										{reportInfo[0]?.location
											?.map((l) => {
												return ` ${l?.name}`;
											})
											.join(',')}
									</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{created_by?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0 text-break">
										{reportInfo[0]?.createdBy?.first_name +
											' ' +
											reportInfo[0]?.createdBy?.last_name}
									</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{created_at?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0 text-break">
										{reportInfo[0]?.createdAt ? (
											<CustomDate date={reportInfo[0]?.createdAt} />
										) : (
											''
										)}
									</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{start_date?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0 text-break">
										{reportInfo[0]?.start_date ? (
											<CustomDate date={reportInfo[0]?.start_date} />
										) : (
											''
										)}
									</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{end_date?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0 text-break">
										{reportInfo[0]?.end_date ? (
											<CustomDate date={reportInfo[0]?.end_date} />
										) : (
											''
										)}
									</label>
								</div>
							</div>
						) : (
							<Form onSubmit={this.submitReport}>
								<>
									<div className="row">
										<div className="col-sm-12 ">
											<Form.Label className="mb-0">{name?.text}</Form.Label>
										</div>
										<div className="col-sm-12">
											<InputGroup>
												<FormControl
													placeholder="Description"
													type="text"
													name="description"
													className="lf-formcontrol-height"
													onChange={(e) =>
														this.handleChange('description', e.target.value)
													}
													value={info?.description}
													required
												/>
											</InputGroup>
										</div>
										<div className="col-sm-12 mt-2">
											<div className="row">
												<div className="col-sm-6">
													{start_date.text}
													<div className="col-12 mt-1">
														<DatePicker
															customInput={
																<FormControl className="lf-formcontrol-height" />
															}
															name="start_date"
															selected={
																info?.start_date
																	? moment(info?.start_date).toDate()
																	: ''
															}
															dateFormat="dd-MM-yyyy"
															placeholderText="Start Date"
															onChange={(e) =>
																this.handleChange(
																	'start_date',
																	moment(e).format('YYYY-MM-DD'),
																)
															}
															minDate={moment().toDate()}
															maxDate={
																info?.end_date
																	? moment(info?.end_date).toDate()
																	: ''
															}
															required
														/>
													</div>
												</div>
												<div className="col-sm-6">
													{end_date.text}
													<div className="col-12 mt-1">
														<DatePicker
															customInput={
																<FormControl className="lf-formcontrol-height" />
															}
															name="end_date"
															dateFormat="dd-MM-yyyy"
															selected={
																info?.end_date
																	? moment(info?.end_date).toDate()
																	: ''
															}
															placeholderText="End Date"
															onChange={(e) =>
																this.handleChange(
																	'end_date',
																	moment(e).format('YYYY-MM-DD'),
																)
															}
															minDate={
																info?.start_date
																	? moment(info?.start_date).toDate()
																	: moment(new Date()).toDate()
															}
															required
														/>
													</div>
												</div>
											</div>
										</div>

										<div className="col-sm-12 mt-1">
											<Form.Label className="mb-0">
												{frequency_name?.text}
											</Form.Label>
										</div>
										<div className="col-sm-12">
											<CustomSelect
												placeholder="Frequency..."
												name="frequency"
												onChange={(e) =>
													this.handleChange('frequency', e.value)
												}
												options={frequency}
												value={frequency?.filter(
													(fr) => fr.value === info.frequency,
												)}
												required
											/>
										</div>
										{info?.frequency === 'Custom_Days' ? (
											<div className="col-sm-12 mt-2 ">
												<div>
													<Form.Label>{frequency_name?.text}</Form.Label>
												</div>
												<InputGroup>
													<FormControl
														placeholder="Enter your custom day"
														type="number"
														name="customday"
														onChange={(e) =>
															this.handleChange('customday', e.target.value)
														}
														value={info.customday}
														required
													/>
												</InputGroup>
											</div>
										) : (
											''
										)}
										<div className="col-sm-12 mt-1">
											<div>
												<Form.Label className="mb-0">
													{assignee_name?.text}
												</Form.Label>
											</div>
											<CustomSelect
												placeholder="Assignee..."
												name="assigee_id"
												moduleType="taskUsers"
												onChange={(e) =>
													this.handleChange('assigee_id', e.value)
												}
												options={projectUsers}
												value={projectUsers?.filter(
													(ass) => ass.value === info.assigee_id,
												)}
												required
											/>
										</div>
										<div className="col-sm-12 mt-1">
											<div>
												<Form.Label className="mb-0">Location</Form.Label>
											</div>
											<CustomSelect
												placeholder="Location..."
												name="location_id"
												onChange={(e) =>
													this.handleChange('location_id', e.value)
												}
												options={locations}
												value={locations?.filter(
													(loc) => loc.value === info.location_id,
												)}
												required
											/>
										</div>
									</div>
									<div className="col-sm-12">
										<Button
											type="submit"
											className="theme-btn btn-block float-end mt-3">
											Submit
										</Button>
									</div>
								</>
							</Form>
						)}
					</Modal.Body>
				</Modal>
			</>
		);
	}
}
export default withRouter(
	connect((state) => {
		return {
			SurveyLocation: state?.task?.[GET_LOCATION_LIST]?.result || [],
			reportInfo:
				state?.report?.[GET_SURVEY_REQUEST_DETAILS_BY_ID]?.result || [],
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
			questionsList:
				state?.report?.[GET_QUESTIONS_LIST_BY_REQUEST_ID]?.result || [],
		};
	})(UpdateSurveyReport),
);
