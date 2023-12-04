import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal } from 'react-bootstrap';
import React from 'react';
import {
	GET_SURVEY_REQUEST_DETAILS_BY_ID,
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
	GET_QUESTIONS_LIST_BY_REQUEST_ID,
} from '../../../store/actions/actionType';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import {
	getQuestionsListByRequestId,
	getSurveyRequestDetails,
	updateSurveyReport,
} from '../../../store/actions/report';
import moment from 'moment';
import getUserId, { getSiteLanguageData } from '../../../commons';
import { useParams } from 'react-router';
import CustomSelect from '../../../components/SelectBox';
import { getAllRoleWisePeople } from '../../../store/actions/projects';
import { getLocationList } from '../../../store/actions/Task';


function SurveyReportInfo(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [editInfo, setEditInfo] = useState(true);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	
	const [data, setData] = useState({
		survey_report_request_id: '',
		user_id: userId,
		project_id: project_id,
		description: '',
		start_date: '',
		frequency: '',
		customday: '',
		end_date: '',
		assigee_id: '',
		location_id: '',
		questions: [''],
	});

	

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
	const reportInfo = useSelector((state) => {
		return state?.report?.[GET_SURVEY_REQUEST_DETAILS_BY_ID]?.result || [];
	});
	
	useEffect(() => {
		if (
			reportInfo &&
			typeof reportInfo?.length != 'undefined' &&
			reportInfo?.length <= 0
		) {
			dispatch(getSurveyRequestDetails(props?.data));
		}
	}, [reportInfo?.length, dispatch]);
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee?.length, dispatch]);
	const quetions = useSelector((state) => {
		return state?.report?.[GET_QUESTIONS_LIST_BY_REQUEST_ID]?.result || [];
	});
	useEffect(() => {
		if (quetions?.length <= 0) {
			dispatch(getQuestionsListByRequestId(props?.data));
		}
	}, [quetions?.length, dispatch]);

	const SurveyLocation = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
	});
	useEffect(() => {
		if (SurveyLocation?.length <= 0) {
			dispatch(getLocationList(project_id, userId));
		}
	}, [SurveyLocation?.length, dispatch]);

	
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


	const handleChange = (name, value) => {
		setData({
			...data,
			[name]: value,
		});
	};
	const submitReport = (e) => {
		e.preventDefault();
		handleClose();
		setEditInfo(false);
		dispatch(
			updateSurveyReport({
				...data,
				questions: quetions?.map((qu) => qu?.question),
			}),
		);
	};

	useEffect(() => {
		const report = reportInfo?.[0];
		// if (data?.survey_report_request_id !== report?._id) {
		setData({
			survey_report_request_id: props?.data,
			user_id: userId,
			project_id: project_id,
			description: report?.description,
			start_date: report?.start_date,
			frequency: report?.frequency,
			customday: report?.customday,
			end_date: report?.end_date,
			assigee_id: report?.assigee_id,
			location_id: report?.location_id,
			questions: [],
		});
		// }
	}, [SurveyLocation?.length, dispatch, show]);
	const { info } = getSiteLanguageData('reports/toolbar');
	const { name, frequency_name, assignee_name } = getSiteLanguageData(
		'reports/components/updatesurveyreport');
	const { cancel, save, edit,description,start_date,end_date,location } =
			getSiteLanguageData('commons');
	return (
		<>
			<span type="submit" className="lf-common-btn" onClick={handleShow}>
				<i className="fa-solid fa-circle-info mx-1" aria-hidden="true"></i>{' '}
				{info?.text}
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>
						{`${props.type}`} {info?.text}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitReport}>
						<>
							<div className="row">
								<div className="col-sm-12 ">
									<Form.Label className="mb-0">{name?.text}</Form.Label>
									<InputGroup>
										<FormControl
											placeholder={description.text}
											type="text"
											name="description"
											className="lf-formcontrol-height"
											onChange={(e) =>
												handleChange('description', e.target.value)
											}
											disabled={editInfo}
											value={data?.description}
											required
										/>
									</InputGroup>
								</div>
								<div className="col-sm-12 mt-2">
									<div className="row">
										<div className="col-sm-6">
											<Form.Label className="mb-0">{start_date.text}</Form.Label>
											<div className="col-12">
												<DatePicker
													customInput={
														<FormControl className="lf-formcontrol-height" />
													}
													disabled={editInfo || props?.onlyinfo == "onlyinfo"}
													name="start_date"
													selected={
														data?.start_date
															? moment(data?.start_date).toDate()
															: ''
													}
													dateFormat="dd-MM-yyyy"
													placeholderText={start_date.text}

													onChange={(e) =>
														handleChange(
															'start_date',
															moment(e).format('YYYY-MM-DD'),
														)
													}
													minDate={moment().toDate()}
													maxDate={
														data?.end_date
															? moment(data?.end_date).toDate()
															: ''
													}
													required
												/>
											</div>
										</div>
										<div className="col-sm-6">
											<Form.Label className="mb-0">{end_date.text}</Form.Label>
											<div className="col-12">
												<DatePicker
													disabled={editInfo}
													customInput={
														<FormControl className="lf-formcontrol-height" />
													}
													name="end_date"
													dateFormat="dd-MM-yyyy"
													selected={
														data?.end_date
															? moment(data?.end_date).toDate()
															: ''
													}
													placeholderText={end_date.text}
													onChange={(e) =>
														handleChange(
															'end_date',
															moment(e).format('YYYY-MM-DD'),
														)
													}
													minDate={
														data?.start_date
															? moment(data?.start_date).toDate()
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
										disabled={editInfo}
										placeholder={`${frequency_name.text}...`}
										name="frequency"										
										onChange={(e) => handleChange('frequency', e.value)}
										options={frequency}
										value={frequency?.filter(
											(fr) => fr.value === data?.frequency,
										)}
										required
									/>
								</div>

								{data?.frequency === 'Custom_Days' ? (
									<div className="col-sm-12 mt-2 ">
										<div>
											<Form.Label>{frequency_name?.text}</Form.Label>
										</div>
										<InputGroup>
											<FormControl
												placeholder="Enter your custom day"
												type="number"
												disabled={editInfo}
												name="customday"
												onChange={(e) =>
													handleChange('customday', e.target.value)
												}
												value={data?.customday}
												required
											/>
										</InputGroup>
									</div>
								) : (
									''
								)}

								{/* <div className="col-sm-12 mt-2">
										<div className="row">
											<div className="col-sm-6">
												Start Date
												<div className="col-12 mt-1">
													<DatePicker
														customInput={
															<FormControl className="lf-formcontrol-height" />
														}
														name="start_date"
														selected={
															data?.start_date
																? moment(data?.start_date).toDate()
																: ''
														}
														dateFormat="dd-MM-yyyy"
														placeholderText="Start Date"
														onChange={(e) =>
															handleChange(
																'start_date',
																moment(e).format('YYYY-MM-DD'),
															)
														}
														minDate={moment().toDate()}
														maxDate={
															data?.end_date
																? moment(data?.end_date).toDate()
																: ''
														}
														required
													/>
												</div>
											</div>
											<div className="col-sm-6">
												End Date
												<div className="col-12 mt-1">
													<DatePicker
														customInput={
															<FormControl className="lf-formcontrol-height" />
														}
														name="end_date"
														dateFormat="dd-MM-yyyy"
														selected={
															data?.end_date
																? moment(data?.end_date).toDate()
																: ''
														}
														placeholderText="End Date"
														onChange={(e) =>
															handleChange(
																'end_date',
																moment(e).format('YYYY-MM-DD'),
															)
														}
														minDate={
															data?.start_date
																? moment(data?.start_date).toDate()
																: moment(new Date()).toDate()
														}
														required
													/>
												</div>
											</div>
										</div>
									</div> */}

								{/* <div className="col-sm-12 mt-1">
										<Form.Label className="mb-0">
											{frequency_name?.text}
										</Form.Label>
									</div>
									<div className="col-sm-12">
										<CustomSelect
											placeholder="Frequency..."
											name="frequency"
											onChange={(e) => handleChange('frequency', e.value)}
											options={frequency}
											value={frequency?.filter(
												(fr) => fr.value === data?.frequency,
											)}
											required
										/>
									</div>
									{data?.frequency === 'Custom_Days' ? (
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
														handleChange('customday', e.target.value)
													}
													value={data?.customday}
													required
												/>
											</InputGroup>
										</div>
									) : (
										''
									)} */}
								<div className="col-sm-12 mt-1">
									<div>
										<Form.Label className="mb-0">
											{assignee_name?.text}
										</Form.Label>
									</div>
									<CustomSelect
										disabled={editInfo}
										placeholder={`${assignee_name?.text}...`}
										name="assigee_id"
										moduleType="fieldUsers"
										onChange={(e) => handleChange('assigee_id', e.value)}
										options={projectUsers}
										value={projectUsers?.filter(
											(ass) => ass.value === data?.assigee_id,
										)}
										required
									/>
								</div>
								<div className="col-sm-12 mt-1">
									<div>
										<Form.Label className="mb-0">{location.text}</Form.Label>
									</div>
									<CustomSelect
										disabled={editInfo}
										placeholder={`${location.text}...`}
										name="location_id"
										onChange={(e) => handleChange('location_id', e.value)}
										options={locations}
										value={locations?.filter(
											(loc) => loc.value === data?.location_id,
										)}
										required
									/>
								</div>
							</div>
							<div className="col-sm-12 text-end mt-2">
								{!editInfo ? (
									<>
										<Button
											type={'button'}
											variant="light"
											onClick={() => setEditInfo(true)}
											className="light-border btn-block mt-3 me-3">
											<i class="fa-solid fa-xmark pe-2"></i>
											{cancel?.text}
										</Button>
										<Button
											type={'submit'}
											onClick={(e) => setEditInfo(false)}
											className="theme-btn btn-block mt-3 ">
											<i class="fa-solid fa-floppy-disk pe-2"></i>
											{save?.text}
										</Button>
									</>
								) : (
									<Button
										type={'button'}
										onClick={() => setEditInfo(false)}
										className="theme-btn btn-block mt-3">
										<i className="far fa-edit me-2"></i>
										{edit?.text}
									</Button>
								)}
							</div>
						</>
					</Form>
				</Modal.Body>
			</Modal>
			
		</>
	);
}
export default SurveyReportInfo;
