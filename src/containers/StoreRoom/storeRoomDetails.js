import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal } from 'react-bootstrap';
import React from 'react';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_STORE_ROOM_FULL_DETAILS,
} from '../../store/actions/actionType';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import getUserId, { getSiteLanguageData } from '../../commons';
import { useParams } from 'react-router';
import CustomSelect from '../../components/SelectBox';
import CustomDate from '../../components/CustomDate';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import {
	getStoreRoomFullDetails,
	updateStoreRoom,
} from '../../store/actions/storeroom';

function StoreRoomDetails(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [editInfo, setEditInfo] = useState(true);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const [data, setData] = useState({
		description: '',
		assigee_id: [],
		// location_id: storeInfo?.location_id || [],
		start_date: new Date(),
		end_date: '',
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
		return state?.storeroom?.[GET_STORE_ROOM_FULL_DETAILS]?.result || [];
	});
	useEffect(() => {
		if (reportInfo?.length <= 0) {
			dispatch(getStoreRoomFullDetails(props?.data));
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

	// const SurveyLocation = useSelector((state) => {
	// 	return state?.task?.[GET_LOCATION_LIST]?.result || [];
	// });
	// useEffect(() => {
	// 	if (SurveyLocation?.length <= 0) {
	// 		dispatch(getLocationList(project_id, userId));
	// 	}
	// }, [SurveyLocation?.length, dispatch]);

	// const locations = SurveyLocation?.map((tl) => {
	// 	return { label: tl.name, value: tl._id };
	// });
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
		dispatch(updateStoreRoom(data));
	};

	useEffect(() => {
		const report = reportInfo?.[0];
		// if (data?.survey_report_request_id !== report?._id) {
		setData({
			store_room_id: reportInfo?._id,
			user_id: userId,
			project_id: project_id,
			description: reportInfo?.description,
			start_date: reportInfo?.start_date,
			end_date: reportInfo?.end_date,
			assigee_id: reportInfo?.assigee_id,
		});
		// }
	}, [assignee?.length, dispatch, show]);

	/* 	const editReportInfo = (e) => {
		e.preventDefault();
		setData({
			store_room_id: reportInfo?._id,
			user_id: userId,
			project_id: project_id,
			description: reportInfo?.description,
			start_date: reportInfo?.start_date,
			end_date: reportInfo?.end_date,
			assigee_id: reportInfo?.assigee_id,
			// location_id: reportInfo?.location_id,
		});
		setEditInfo(!editInfo);
	}; */
	const {
		info,
		description,
		project_name,
		assigee,
		created_by,
		created_at,
		storeroom,
		store,
	} = getSiteLanguageData('reports/toolbar');
	const { location, name, start_date, end_date, assignee_name, edit, save, cancel } =
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
								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">{name?.text}</Form.Label>
									<InputGroup>
										<FormControl
											placeholder="Name"
											type="text"
											name="description"
											className="py-2"
											onChange={(e) =>
												handleChange('description', e.target.value)
											}
											disabled={editInfo}
											value={data?.description}
											required
										/>
									</InputGroup>
								</div>
								<div className="col-sm-6 mt-2">
									<Form.Label className="mb-0">{start_date?.text}</Form.Label>
									<DatePicker
										customInput={
											<FormControl className="lf-formcontrol-height" />
										}
										disabled={editInfo || props?.onlyinfo == "onlyinfo"}
										name="start_date"
										selected={
											data?.start_date
												? moment(data?.start_date).toDate()
												: null
										}
										dateFormat="dd-MM-yyyy"
										placeholderText="Start Date"
										onChange={(e) =>
											handleChange('start_date', moment(e).format('YYYY-MM-DD'))
										}
										minDate={moment().toDate()}
										maxDate={
											data?.end_date ? moment(data?.end_date).toDate() : ''
										}
										/* disabled */
									/>
								</div>
								<div className="col-sm-6 mt-2">
									<Form.Label className="mb-0">{end_date?.text}</Form.Label>
									<div className="col-12">
										<DatePicker
											customInput={
												<FormControl className="lf-formcontrol-height" />
											}
											name="end_date"
											disabled={editInfo}
											selected={
												data?.end_date ? moment(data?.end_date).toDate() : ''
											}
											placeholderText="End Date"
											onChange={(e) =>
												handleChange('end_date', moment(e).format('YYYY-MM-DD'))
											}
											minDate={
												data?.start_date
													? moment(data?.start_date).toDate()
													: moment(new Date()).toDate()
											}
											dateFormat="dd-MM-yyyy"
											required
										/>
									</div>
								</div>

								{/* <div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">Frequency</Form.Label>
								</div>

								<div className="col-sm-12">
									<FormControl
										isDisabled={true}
										readOnly
										placeholder="Name"
										type="text"
										name="Frequency"
										autoComplete="off"
										className="disabled"
										value={'Daily'}
									/>
								</div> */}
								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">
										{assignee_name?.text}
									</Form.Label>
								</div>

								<div className="col-sm-12">
									<CustomSelect
										placeholder="Assigee..."
										name="assigee_id"
										disabled={editInfo}
										moduleType="taskUsers"
										onChange={(e) => handleChange('assigee_id', [e.value])}
										options={projectUsers}
										value={projectUsers.filter((c) =>
											data?.assigee_id?.includes(c.value),
										)}
										required
									/>
								</div>
								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">{location?.text}</Form.Label>
									<InputGroup>
										<FormControl
											placeholder="Assign Location"
											type="text"
											name="Location"
											className="py-2"
											/* onChange={(e) =>
												handleChange('description', e.target.value)
											} */
											disabled
											value={reportInfo?.location
												?.map((l) => {
													return ` ${l?.name}`;
												})
												.join(',')}
										/>
									</InputGroup>
								</div>
								<div className="col-sm-12 text-end">
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

								{/* <div className="col-12 mt-3">
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
										{submit?.text}
									</Button>
								</div> */}
							</div>
						</>
					</Form>
					{/* 
					{editInfo ? (
						<Form onSubmit={submitReport}>
							<div className="row px-3 ">
								<div className="col-sm-12 ">
									<Form.Label className="mb-0">{name?.text}</Form.Label>
									<InputGroup>
										<FormControl
											placeholder="Name"
											type="text"
											name="description"
											className="py-2"
											onChange={(e) =>
												handleChange('description', e.target.value)
											}
											value={reportInfo?.description}
											required
										/>
									</InputGroup>
								</div>
								<div className="col-sm-6 mt-2">
									<Form.Label className="mb-0">{start_date?.text}</Form.Label>
									<DatePicker
										customInput={
											<FormControl className="lf-formcontrol-height" />
										}
										name="start_date"
										selected={
											data?.start_date
												? moment(data?.start_date).toDate()
												: null
										}
										dateFormat="dd-MM-yyyy"
										placeholderText="Start Date"
										onChange={(e) =>
											handleChange('start_date', moment(e).format('YYYY-MM-DD'))
										}
										minDate={moment().toDate()}
										disabled
									/>
								</div>
								<div className="col-sm-6 mt-2">
									<Form.Label className="mb-0">{end_date?.text}</Form.Label>
									<div className="col-12">
										<DatePicker
											customInput={
												<FormControl className="lf-formcontrol-height" />
											}
											name="end_date"
											selected={
												data?.end_date ? moment(data?.end_date).toDate() : null
											}
											dateFormat="dd-MM-yyyy"
											placeholderText="End Date"
											onChange={(e) =>
												handleChange('end_date', moment(e).format('YYYY-MM-DD'))
											}
											minDate={moment(data?.start_date).toDate()}
											required
										/>
									</div>
								</div>
								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">Frequency</Form.Label>
								</div>

								<div className="col-sm-12">
									<FormControl
										isDisabled={true}
										readOnly
										placeholder="Name"
										type="text"
										name="Frequency"
										autoComplete="off"
										className="disabled"
										value={'Daily'}
									/>
								</div>
								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">
										{assignee_name?.text}
									</Form.Label>
								</div>

								<div className="col-sm-12">
									<CustomSelect
										placeholder="Assigee..."
										name="assigee_id"
										moduleType="taskUsers"
										onChange={(e) => handleChange('assigee_id', [e.value])}
										options={projectUsers}
										value={projectUsers.filter((c) =>
											data?.assigee_id?.includes(c.value),
										)}
									/>
								</div>
								{/* <div className="col-sm-12 mt-2">
				<Form.Label className="mb-0">Location</Form.Label>
				</div>

				<div className="col-sm-12 ">
				<CustomSelect
					placeholder="Location..."
					name="location_id"
					onChange={(e) => handleChange('location_id', [e.value])}
					options={location}
					value={location.filter(c => c?.value === info?.location_id[0])}
				/>
				</div> 
								<div className="col-12 mt-3">
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
										{submit?.text}
									</Button>
								</div>
							</div>
						</Form>
					) : (
						<>
							<div className="row">
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{description?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0">{reportInfo?.description}</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{project_name?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0">{reportInfo?.project?.name}</label>
								</div>
								<div className="col-sm-4 ">
									<label className="mb-0 fw-bold">Frequency</label>
								</div>
								<div className="col-sm-6">
									<label className="mb-0">Daily</label>
								</div>

								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{assigee?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0 ">
										{reportInfo?.assigee
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
										{reportInfo?.location
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
										{reportInfo?.createdBy?.first_name +
											' ' +
											reportInfo?.createdBy?.last_name}
									</label>
								</div>
								<div className="col-sm-4">
									<label className="mb-0 fw-bold">{created_at?.text}</label>
								</div>
								<div className="col-sm-8">
									<label className="mb-0 text-break">
										{reportInfo?.createdAt ? (
											<CustomDate date={reportInfo?.createdAt} />
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
										{reportInfo?.start_date ? (
											<CustomDate date={reportInfo?.start_date} />
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
										{reportInfo?.end_date ? (
											<CustomDate date={reportInfo?.end_date} />
										) : (
											''
										)}
									</label>
								</div>
							</div>
						</>
					)} */}
				</Modal.Body>
			</Modal>
		</>
	);
}
export default StoreRoomDetails;
