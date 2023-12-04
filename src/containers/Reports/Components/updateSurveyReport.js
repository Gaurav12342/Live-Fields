import { Component, useState,useEffect } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';

import CustomSelect from '../../../components/SelectBox';
import DatePicker from 'react-datepicker';
import getUserId, { getSiteLanguageData } from '../../../commons';
import moment from 'moment';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_TEMPLATE,
	GET_LOCATION_LIST,
	GET_QUESTIONS_LIST_BY_REQUEST_ID,
} from '../../../store/actions/actionType';
import {
	getAllRoleWisePeople,
	getAllTemplateWithFullDetails,
} from '../../../store/actions/projects';
import { getLocationList } from '../../../store/actions/Task';
import {
	getQuestionsListByRequestId,
	updateSurveyReport,
} from '../../../store/actions/report';
import Loading from '../../../components/loadig';
import withRouter from '../../../components/withrouter';

const UpdateSurveyReport = (props)=>{
	const { surveyInfo,dispatch, questionsList,SurveyLocation, assignee, hideBtn,template,} = props;
	const report_request_id = surveyInfo?._id;
	const userId = getUserId();
	const project_id = props.router?.params.project_id;
	const projectUsers = [];

	const reportFrequency = [
		{ value: 'Daily', name: 'Daily' },
		{ value: 'First_Day_of_Month', name: 'First Day of Month' },
		{ value: 'Last_Day_of_Month', name: 'Last Day of Month' },
		{ value: 'Every_Month', name: 'Every Month' },
		{ value: 'Custom_Days', name: 'Custom Days' },
	];
	

	const [show, setShow] = useState(false);
	const [page, setPage] = useState(0);
	const [tempalteId, setTempalteId] = useState('');
	const [useTemplate, setUseTemplate] = useState(false);
	const [quetions, setQuetions] = useState([]);
	const [info, setInfo] = useState({
		survey_report_request_id: surveyInfo?._id,
		user_id: userId,
		project_id: project_id,
		description: surveyInfo?.description,
		start_date: surveyInfo?.start_date,
		frequency: surveyInfo?.frequency,
		customday: surveyInfo?.customday,
		end_date: surveyInfo?.end_date,
		assigee_id: surveyInfo?.assigee_id,
		location_id: surveyInfo?.location_id,
		questions: [''],
	});

	useEffect(() => {
		dispatch(getAllRoleWisePeople(project_id));
		dispatch(getLocationList(project_id, userId));
		dispatch(getAllTemplateWithFullDetails(project_id));
	}, [dispatch, project_id, userId, report_request_id]);

	useEffect(() => {
		let qlist = [];

		if (questionsList) {
			qlist = questionsList.map((e) => e?.question);
		}

		if (questionsList !== props.questionsList && !!surveyInfo?._id) {
			setQuetions(qlist);
		}
	}, [questionsList, surveyInfo]);

	const frequency = reportFrequency?.map((tl) => {
		return { label: tl.name, value: tl.value };
	});

	const templates = template?.map((tl) => {
		return { label: tl.name, value: tl._id };
	});

	const location = SurveyLocation?.map((tl) => {
		return { label: tl.name, value: tl._id };
	});

	const handleClose = () => {
		setQuetions([]);
		setShow(false);
		setPage(0);
	};

	const handleShow = () => setShow(true);

	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const handleChangeQuestion = (value, index) => {
		let quetions = [...quetions];
		quetions[index] = value;
		setQuetions(quetions);
	};

	const handleQuestion = (index = null) => {
		if (index) {
			const quetions = [...quetions];
			quetions.splice(index, 1);
			setQuetions(quetions);
		} else {
			const quetions = [...quetions];
			quetions.push('');
			setQuetions(quetions);
		}
	};

	const submitReport = (e) => {
		e.preventDefault();
		if (page === 0 && props?.onlyinfo != 'onlyinfo') {
			setPage(1);
			setQuetions([]);
			dispatch(getQuestionsListByRequestId(report_request_id));
		} else {
			handleClose();
			dispatch(
				updateSurveyReport({
					...info,
					questions: quetions,
					onlyinfo: props?.onlyinfo,
				}),
			);
		}
	};

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

	const { icon_edit, survey_report, update_report, back, description } =
		getSiteLanguageData('reports/toolbar');
	const { questions, name, frequency_name, assignee_name, use_template } =
		getSiteLanguageData('reports/components/updatesurveyreport');
	const { start_date, end_date, submit, location_name } =
		getSiteLanguageData('commons');

	const { manage_template } = getSiteLanguageData('setting');

	return (
		<>
			{!hideBtn ? (
				<span
					className=" p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
					tooltip={icon_edit.tooltip}
					flow={icon_edit.tooltip_flow}
					onClick={handleShow}>
					<i className="fas fa-edit"></i>
				</span>
			) : (
				''
			)}

			<Modal
				className="lf-modal"
				size={'md'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{survey_report?.text}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form onSubmit={submitReport}>
						{page === 1 ? (
							<>
								<div className="row">
									<div className="col-12 mt-2">
										{useTemplate ? (
											<div className="">
												<CustomSelect
													placeholder={`Select ${manage_template.text}...`}
													onChange={(e) => {
														setTempalteId(e?.value);
														const temp = template
															?.filter((tem) => tem?._id === e?.value)?.[0]
															?.checklist?.map((ch) => ch?.title);
														const arr = [...quetions];
														temp?.map((tt) => arr.push(tt));
														setQuetions(arr);
													}}
													options={templates}
													value={templates?.filter(
														(t) => t?.value === tempalteId,
													)}
													required
												/>
											</div>
										) : (
											<button
												className={'btn theme-btn'}
												onClick={() => setUseTemplate(true)}>
												{use_template.text}
											</button>
										)}
										<div className="col-12 mt-2">
											<Form.Label>{questions?.text}</Form.Label>
										</div>
										{quetions.map((c, index) => {
											return (
												<div className="row py-1">
													<div className="col-sm-8">
														<InputGroup>
															<FormControl
																placeholder="Questions"
																type="text"
																autoComplete="off"
																onChange={(e) =>
																	handleChangeQuestion(
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
																onClick={() => handleQuestion()}
																className="fas fa-plus-circle"></i>
														</span>
														{quetions?.length > 1 ? (
															<span className="theme-color ms-2">
																<i
																	onClick={() => handleQuestion(index)}
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
											setPage(0);
										}}>
										{back?.text}
									</Button>
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
										{update_report?.text}
									</Button>
								</div>
							</>
						) : (
							<>
								<div className="row">
									<div className="col-sm-12 ">
										<Form.Label className="mb-0">{name?.text}</Form.Label>
										<InputGroup>
											<FormControl
												placeholder={description.text}
												type="text"
												name="description"
												autoComplete="off"
												className="lf-formcontrol-height"
												onChange={(e) =>
													handleChange('description', e.target.value)
												}
												value={info?.description}
												required
											/>
										</InputGroup>
									</div>
									<div className="col-sm-12 mt-2">
										<div className="row">
											<div className="col-sm-6">
												<Form.Label className="mb-0">
													{start_date?.text}
												</Form.Label>
												<div className="col-12 mt-1">
													<DatePicker
														customInput={
															<FormControl className="lf-formcontrol-height" />
														}
														name="start_date"
														selected={moment(info.start_date).toDate()}
														dateFormat="dd-MM-yyyy"
														placeholderText="Start Date"
														disabled={true}
														onChange={(e) =>
															handleChange(
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
												<Form.Label className="mb-0">
													{end_date?.text}
												</Form.Label>
												<div className="col-12 mt-1">
													<DatePicker
														customInput={
															<FormControl className="lf-formcontrol-height" />
														}
														name="end_date"
														dateFormat="dd-MM-yyyy"
														selected={moment(info.end_date).toDate()}
														placeholderText="End Date"
														onChange={(e) =>
															handleChange(
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

									<div className="col-sm-12 mt-2">
										<Form.Label className="mb-0">
											{frequency_name?.text}
										</Form.Label>
										<CustomSelect
											placeholder={`${frequency_name.text}...`}
											name="frequency"
											onChange={(e) => handleChange('frequency', e.value)}
											options={frequency}
											value={frequency?.filter(
												(fr) => fr.value === info.frequency,
											)}
											required
										/>
									</div>

									{info?.frequency === 'Custom_Days' ? (
										<div className="col-sm-12 mt-2 ">
											<Form.Label>{frequency_name?.text}</Form.Label>
											<InputGroup>
												<FormControl
													placeholder="Enter your custom day"
													type="number"
													name="customday"
													autoComplete="off"
													onChange={(e) =>
														handleChange('customday', e.target.value)
													}
													value={info.customday}
													required
												/>
											</InputGroup>
										</div>
									) : (
										''
									)}
									<div className="col-sm-12 mt-2">
										<Form.Label className="mb-0">
											{assignee_name?.text}
										</Form.Label>
										<CustomSelect
											placeholder={`${assignee_name?.text}...`}
											name="assigee_id"
											moduleType="taskUsers"
											onChange={(e) => handleChange('assigee_id', e.value)}
											options={projectUsers}
											value={projectUsers?.filter(
												(ass) => ass.value === info.assigee_id,
											)}
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
											onChange={(e) =>
												handleChange('location_id', e.value)
											}
											options={location}
											value={location?.filter(
												(loc) => loc.value === info.location_id,
											)}
											required
										/>
									</div>
								</div>
								<div className="col-sm-12 mt-3 text-end">
									<Button type="submit" className="theme-btn btn-block">
										{props?.onlyinfo == 'onlyinfo' ? 'Save' : 'Next'}
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
export default withRouter(
	connect((state) => {
		return {
			SurveyLocation: state?.task?.[GET_LOCATION_LIST]?.result || [],
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [],
			questionsList:
				state?.report?.[GET_QUESTIONS_LIST_BY_REQUEST_ID]?.result || [],
			template: state?.project?.[GET_ALL_TEMPLATE]?.result || [],
		};
	})(UpdateSurveyReport),
);
