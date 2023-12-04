import { Component } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Dropdown,
} from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';

import CustomSelect from '../../../components/SelectBox';
import DatePicker from 'react-datepicker';
import getUserId, { getSiteLanguageData } from '../../../commons';
import moment from 'moment';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
} from '../../../store/actions/actionType';
import { getAllRoleWisePeople } from '../../../store/actions/projects';
import { getLocationList } from '../../../store/actions/Task';
import { createSurveyReport } from '../../../store/actions/report';
import withRouter from '../../../components/withrouter';

class CreatSurveyReport extends Component {
	constructor(props) {
		super(props);
		this.userId = getUserId();
		this.project_id = this.props.router?.params.project_id;
		this.state = {
			show: false,
			page: 0,
			quetions: [''],
			counter: 0,
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				description: '',
				start_date: new Date(),
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
	}
	setShow = (show) => {
		this.setState({ show });
	};
	setQuetions = (quetions) => {
		this.setState({ quetions });
	};
	setCounter = (counter) => {
		this.setState(counter);
	};
	setPage = (page) => {
		this.setState({ page });
	};
	setInfo = (info) => {
		this.setState({ info });
	};
	handleClose = () => {
		this.setState({
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				description: '',
				start_date: new Date(),
				frequency: '',
				customday: '',
				end_date: '',
				assigee_id: '',
				location_id: '',
				questions: [''],
			},
			page: 0,
		});
		this.setState({ show: false });
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
		const { info, quetions } = this.state;
		e.preventDefault();
		if (this.state.page === 0) {
			this.setPage(1);
		} else {
			this.handleClose();
			this.props.dispatch(
				createSurveyReport({
					...info,
					assigee_id: info.assigee_id.value,
					location_id: info.location_id.value,
					frequency: info.frequency.value,
					questions: quetions,
				}),
			);
		}
	};

	handleClick = () => {
		this.setCounter(this.state.counter + 1);
	};
	handleremove = () => {
		this.setCounter(this.state.counter - 1);
	};
	setPage;
	render() {
		const { survey_report, question, generate_report } = getSiteLanguageData(
			'reports/components/createsurveyreport',
		);

		const { back } = getSiteLanguageData('reports/toolbar');
		const {
			start_date,
			end_date,
			frequency_name,
			assignee_name,
			location_name,
			next_btn,
		} = getSiteLanguageData('commons');

		const { SurveyLocation, assignee } = this.props;
		const { page } = this.state;
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

		const location = SurveyLocation?.map((tl) => {
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

		return (
			<>
				<Dropdown.Item
					title={survey_report.text}
					className="lf-layout-profile-menu"
					onClick={this.handleShow}>
					<i className="fas fa-plus px-2"></i>
					{survey_report.text}
				</Dropdown.Item>
				<Modal
					className="lf-modal"
					size={'md'}
					show={this.state.show}
					onHide={this.handleClose}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{survey_report.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.submitReport}>
							{page === 1 ? (
								<>
									<div className="row">
										<div className="col-12 mt-2">
											<Form.Label>{question.text}</Form.Label>
											{this.state.quetions.map((c, index) => {
												return (
													<div className="row p-1">
														<div className="col-sm-8">
															<InputGroup>
																<FormControl
																	placeholder={question.text}
																	type="text"
																	autoComplete="off"
																	onChange={(e) =>
																		this.handleChangeQuestion(
																			e.target.value,
																			index,
																		)
																	}
																	value={c}
																/>
															</InputGroup>
														</div>
														<div className="col-sm-4 ps-0">
															<span className="theme-color ">
																<i
																	onClick={() => this.handleQuestion()}
																	className="fas fa-plus-circle"></i>
															</span>
															{this.state.quetions?.length > 1 ? (
																<span className="theme-color ms-2">
																	<i
																		onClick={() => this.handleQuestion(index)}
																		className="fas fa-minus-circle"></i>
																</span>
															) : null}
														</div>
													</div>
												);
											})}
										</div>
									</div>
									<div className="col-sm-12 mt-4 p-0">
										<Button
											type="button"
											className="btn btn-light btn-block my-1 show-verify"
											onClick={(e) => {
												e.preventDefault();
												this.setPage(0);
											}}>
											{back.text}
										</Button>
										<Button
											type="submit"
											className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
											<i className="fas fa-plus px-1"></i>
											{generate_report.text}
										</Button>
									</div>
								</>
							) : (
								<>
									<div className="row">
										<div className="col-sm-12 ">
											<Form.Label className="mb-0">Name</Form.Label>
											<InputGroup>
												<FormControl
													placeholder="Description"
													type="text"
													name="description"
													autoComplete="off"
													className="lf-formcontrol-height"
													onChange={(e) =>
														this.handleChange('description', e.target.value)
													}
													value={this.state.info?.description}
													required
												/>
											</InputGroup>
										</div>
										<div className="col-sm-12 mt-2">
											<div className="row">
												<div className="col-sm-6">
													<Form.Label className="mb-0">
														{start_date.text}
													</Form.Label>
													<DatePicker
														customInput={
															<FormControl className="lf-formcontrol-height" />
														}
														name="start_date"
														selected={moment(
															this.state.info.start_date,
														).toDate()}
														dateFormat="dd-MM-yyyy"
														placeholderText={start_date.text}
														onChange={(e) =>
															this.handleChange(
																'start_date',
																moment(e).format('YYYY-MM-DD'),
															)
														}
														minDate={moment().toDate()}
														required
													/>
												</div>
												<div className="col-sm-6">
													<Form.Label className="mb-0">
														{end_date.text}
													</Form.Label>
													<DatePicker
														customInput={
															<FormControl className="lf-formcontrol-height" />
														}
														name="end_date"
														dateFormat="dd-MM-yyyy"
														selected={
															this.state.info.end_date
																? moment(this.state.info.end_date).toDate()
																: null
														}
														placeholderText={end_date.text}
														onChange={(e) =>
															this.handleChange(
																'end_date',
																moment(e).format('YYYY-MM-DD'),
															)
														}
														minDate={moment(
															this.state.info.start_date,
														).toDate()}
														required
													/>
												</div>
											</div>
										</div>

										<div className="col-sm-12 mt-2">
											<Form.Label className="mb-0">
												{frequency_name.text}
											</Form.Label>
											<CustomSelect
												placeholder={`${frequency_name.text}...`}
												name="frequency"
												onChange={(e) => this.handleChange('frequency', e)}
												options={frequency}
												value={this.state.info.frequency}
												required
											/>
										</div>
										{this.state.info?.frequency?.value === 'Custom_Days' ? (
											<div className="col-sm-12 mt-2">
												<Form.Label className="mb-0">
													{frequency_name.text}
												</Form.Label>
												<InputGroup>
													<FormControl
														placeholder="Enter your custom day"
														type="number"
														name="customday"
														autoComplete="off"
														onChange={(e) =>
															this.handleChange('customday', e.target.value)
														}
														value={this.state.info.customday}
														required
													/>
												</InputGroup>
											</div>
										) : (
											''
										)}
										<div className="col-sm-12 mt-2">
											<Form.Label className="mb-0">
												{assignee_name.text}
											</Form.Label>
											<CustomSelect
												placeholder={`${assignee_name.text}...`}
												name="assigee_id"
												onChange={(e) => this.handleChange('assigee_id', e)}
												options={projectUsers}
												moduleType="taskUsers"
												value={this.state.info.assigee_id}
												required
											/>
										</div>
										<div className="col-sm-12 mt-2">
											<Form.Label className="mb-0">
												{location_name.text}
											</Form.Label>
											<CustomSelect
												placeholder={`${location_name.text}...`}
												name="location_id"
												onChange={(e) => this.handleChange('location_id', e)}
												options={location}
												value={this.state.info.location_id}
												required
											/>
										</div>
									</div>
									<div className="col-sm-12 mt-2">
										<Button
											type="submit"
											className="theme-btn btn-block float-end">
											{next_btn.text}
										</Button>
									</div>
								</>
							)}
						</Form>
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
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
		};
	})(CreatSurveyReport),
);
