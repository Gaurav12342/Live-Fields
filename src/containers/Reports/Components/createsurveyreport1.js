import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import React from 'react';
import CustomSelect from '../../../components/SelectBox';
import { useParams } from 'react-router';
import getUserId, { getSiteLanguageData } from '../../../commons';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
} from '../../../store/actions/actionType';
import { getAllRoleWisePeople } from '../../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import { getLocationList } from '../../../store/actions/Task';
import { createSurveyReport } from '../../../store/actions/report';
function CreatSurveyReport() {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			description: '',
			start_date: '',
			frequency: '',
			customday: '',
			end_date: '',
			assigee_id: '',
			location_id: '',
			questions: quetions,
		});
	};
	const handleShow = () => setShow(true);
	const [Showquetions, setShowquetions] = useState(true);
	const [quetions, setQuetions] = useState([]);
	const [counter, setCounter] = useState(0);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		description: '',
		start_date: '',
		frequency: '',
		customday: '',
		end_date: '',
		assigee_id: '',
		location_id: '',
		questions: quetions,
	});

	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const handleChangeQuestion = (value) => {
		let arr = [...quetions];
		arr.push(value);
		setQuetions(arr);
	};
	// const handleChangeQuestion = (e) => {
	//   const value = e.target.value;
	//   setQuetions(value);
	// }

	const submitReport = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(
			createSurveyReport({
				...info,
				assigee_id: info.assigee_id.value,
				location_id: info.location_id.value,
				frequency: info.frequency.value,
			}),
		);
	};

	const handleClick = () => {
		setCounter(counter + 1);
	};
	const handleremove = () => {
		setCounter(counter - 1);
	};
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee, project_id, dispatch]);
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
	const SurveyLocation = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
	});
	useEffect(() => {
		if (SurveyLocation?.length <= 0) {
			dispatch(getLocationList(project_id, userId));
		}
	}, [SurveyLocation?.length, dispatch]);
	const location = SurveyLocation?.map((tl) => {
		return { label: tl.name, value: tl._id };
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

	const { survey_report } = getSiteLanguageData(
		'reports/components/createsurveyreport',
	);

	const { name, description, start_date, end_date, frequency_name,category_name } =
		getSiteLanguageData('commons');

		const {assignee_name} = getSiteLanguageData('reports/components/updatesurveyreport');

		const {
			location_name,
			question,
			generate_report,
			back,
			checklist_items,
		} = getSiteLanguageData('reports/components/createsurveyreport');

	return (
		<>
			<span
				onClick={handleShow}
				className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
				+ {survey_report.text}
			</span>
			<Modal
				className="lf-modal"
				size={'md'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{survey_report.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitReport}>
						<div className="row">
							<div className="col-sm-12 ">
								<Form.Label className="lf-form-label">{name.text}</Form.Label>
							</div>
							<div className="col-sm-12">
								<InputGroup>
									<FormControl
										placeholder={description.text}
										type="text"
										name="description"
										autoComplete="off"
										onChange={(e) =>
											handleChange('description', e.target.value)
										}
										value={info.description}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12 mt-2">
								<div className="row">
									<div className="col-sm-6">
										{start_date.text}
										<div className="col-12 p-0">
											<FormControl
												className="lf-formcontrol-height"
												type="date"
												name="start_date"
												autoComplete="off"
												onChange={(e) =>
													handleChange('start_date', e.target.value)
												}
											/>
										</div>
									</div>
									<div className="col-sm-6">
										{end_date.text}
										<div className="col-12 p-0">
											<FormControl
												className="lf-formcontrol-height"
												type="date"
												name="end_date"
												autoComplete="off"
												onChange={(e) =>
													handleChange('end_date', e.target.value)
												}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="col-sm-12 mt-2">
								<Form.Label>{frequency_name.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<CustomSelect
									placeholder={`${category_name.text}...`}
									name="frequency"
									onChange={(e) => handleChange('frequency', e)}
									options={frequency}
									value={info.frequency}
								/>
							</div>
							{info?.frequency?.value === 'Custom_Days' ? (
								<div className="col-sm-12 mt-2 ">
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
										/>
									</InputGroup>
								</div>
							) : (
								''
							)}
							<div className="col-sm-12 mt-2">
								<CustomSelect
									placeholder={`${assignee_name.text}...`}
									name="assigee_id"
									moduleType="taskUsers"
									onChange={(e) => handleChange('assigee_id', e)}
									options={projectUsers}
									value={info.assigee_id}
								/>
							</div>
							<div className="col-sm-12 mt-2">
								<CustomSelect
									placeholder={`${location_name.text}...`}
									name="location_id"
									onChange={(e) => handleChange('location_id', e)}
									options={location}
									value={info.location_id}
								/>
							</div>
						</div>
						{/* <div className="col-sm-12 mt-2">
            <span className="float-end">
              <Button
                type="submit"
                className="btn theme-btn">
                Next
              </Button>
            </span>
          </div> */}
						<div className="row">
							<div className="col-sm-12 ">
								<Form.Label>{question.text}</Form.Label>
							</div>
							<div className="col-sm-8">
								<InputGroup>
									<FormControl
										placeholder={question.text}
										autoComplete="off"
										type="text"
										// name="description"
										onChange={(e) => handleChangeQuestion(e.target.value)}
										// value={ }
									/>
								</InputGroup>
							</div>
							<div className="col-sm-4 ps-0">
								<span className="theme-color ">
									<i
										onClick={handleClick}
										className={
											setShowquetions ? 'fas fa-plus-circle d-block' : 'd-block'
										}></i>
								</span>
							</div>
							{Showquetions ? (
								<div className="col-12">
									{
										<>
											{Array.from(Array(counter)).map((c, index) => {
												return (
													<div className="row mt-2">
														<div className="col-sm-8">
															<InputGroup>
																<FormControl
																	placeholder={question.text}
																	type="text"
																	autoComplete="off"
																	// name="description"
																	onChange={(e) =>
																		handleChangeQuestion(e.target.value)
																	}
																	value={info.description}
																/>
															</InputGroup>
														</div>
														<div className="col-sm-4 ps-0">
															<span className="theme-color ">
																<i
																	onClick={handleClick}
																	className="fas fa-plus-circle"></i>
															</span>
															<span className="theme-color ms-2">
																<i
																	onClick={handleremove}
																	className="fas fa-minus-circle"></i>
															</span>
														</div>
													</div>
												);
											})}
										</>
									}
								</div>
							) : (
								''
							)}
						</div>
						<div className="col-sm-12 mt-4 p-0">
							<Button
								type="submit"
								className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
								{generate_report.text}
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default CreatSurveyReport;
