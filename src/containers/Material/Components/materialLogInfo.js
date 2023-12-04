import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup, Modal } from 'react-bootstrap';
import React from 'react';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
	GET_STORE_ROOM,
	GET_MATERIAL_DETAILS_BY_ID,
} from '../../../store/actions/actionType';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import getUserId, { getSiteLanguageData } from '../../../commons';
import { useParams } from 'react-router';
import CustomSelect from '../../../components/SelectBox';
import CustomDate from '../../../components/CustomDate';
import { getAllRoleWisePeople } from '../../../store/actions/projects';
import { getLocationList } from '../../../store/actions/Task';
import {
	getMaterialDetailsById,
	getStoreRoom,
	updateMaterialInfo,
} from '../../../store/actions/storeroom';

function MaterialLogInfo(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [editInfo, setEditInfo] = useState(true);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const [data, setData] = useState({
		material_log_id: props?.data,
		user_id: userId,
		project_id: project_id,
		description: '',
		store_room_id: '',
		assigee_id: '',
		start_date: new Date(),
		end_date: '',
		location_id: '',
	});
	const reportInfo = useSelector((state) => {
		return state?.storeroom?.[GET_MATERIAL_DETAILS_BY_ID]?.result || [];
	});
	useEffect(() => {
		if (reportInfo?.length <= 0) {
			dispatch(getMaterialDetailsById(props?.data));
		}
	}, [reportInfo?.length, dispatch]);
	const storeRoomList = useSelector((state) => {
		return state?.storeroom?.[GET_STORE_ROOM]?.result || [];
	});
	useEffect(() => {
		if (storeRoomList?.length <= 0) {
			dispatch(getStoreRoom(project_id));
		}
	}, [storeRoomList?.length, dispatch]);
	const projectLocation = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
	});
	useEffect(() => {
		if (projectLocation?.length <= 0) {
			dispatch(getLocationList(project_id, userId));
		}
	}, [projectLocation?.length, dispatch]);
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee?.length, dispatch]);
	const locations = projectLocation?.map((u) => {
		return { label: u?.name, value: u?._id };
	});
	const storeRoom = storeRoomList?.map((u) => {
		return { label: u?.description, value: u?._id };
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
		dispatch(updateMaterialInfo(data));
	};

	useEffect(() => {
		const report = reportInfo?.[0];
		//console.log(report, 'report report report report');
		// if (data?.survey_report_request_id !== report?._id) {
		setData({
			material_log_id: props?.data,
			user_id: userId,
			project_id: project_id,
			description: report?.description,
			store_room_id: report?.store_room_id,
			start_date: report?.start_date,
			end_date: report?.end_date,
			assigee_id: report?.assigee_id,
			location_id: report?.location_id,
		});
		// }
	}, [assignee?.length, dispatch, show]);

	const editReportInfo = (e) => {
		e.preventDefault();
		const report = reportInfo?.[0];
		setData({
			material_log_id: props?.data,
			user_id: userId,
			project_id: project_id,
			description: report?.description,
			store_room_id: report?.store_room_id,
			start_date: report?.start_date,
			end_date: report?.end_date,
			assigee_id: report?.assigee_id,
			location_id: report?.location_id,
		});
		setEditInfo(!editInfo);
	};
	const { info, description, project_name, assigee, created_by, created_at } =
		getSiteLanguageData('reports/toolbar');
	const { location, start_date, end_date, location_name, save ,cancel, edit} =
		getSiteLanguageData('commons');
	const { assignee_name } = getSiteLanguageData(
		'reports/components/updatesurveyreport',
	);
	const { store_room } = getSiteLanguageData('components');
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
								<div className="col-sm-12">
									<Form.Label htmlFor="templatename" className="mb-0">
										{description?.text}
									</Form.Label>
									<InputGroup>
										<FormControl
											className="lf-formcontrol-height"
											placeholder="Enter type"
											type="text"
											name="description"
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
										name="start_date"
										selected={moment(data?.start_date).toDate()}
										dateFormat="dd-MM-yyyy"
										placeholderText="Start Date"
										disabled={editInfo || props?.onlyinfo == "onlyinfo"}
										onChange={(e) =>
											handleChange('start_date', moment(e).format('YYYY-MM-DD'))
										}
										minDate={moment().toDate()}
										maxDate={
											data?.end_date ? moment(data?.end_date).toDate() : ''
										}
										required
									/>
								</div>
								<div className="col-sm-6 mt-2">
									<Form.Label className="mb-0">{end_date?.text}</Form.Label>
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
										minDate={
											data?.start_date
												? moment(data?.start_date).toDate()
												: moment(new Date()).toDate()
										}
										required
										disabled={editInfo}
									/>
								</div>
								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">{store_room?.text}</Form.Label>
									<CustomSelect
										placeholder="Select Store..."
										name="store_room_id"
										onChange={(e) => handleChange('store_room_id', e.value)}
										options={storeRoom}
										value={storeRoom?.filter(
											(u) => u.value === data?.store_room_id,
										)}
										disabled={editInfo || props?.onlyinfo == "onlyinfo"}
									/>
								</div>
								{/* 	
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
								</div> */}
								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">
										{assignee_name?.text}
									</Form.Label>
									<CustomSelect
										placeholder="Select Assignee..."
										name="assigee_id"
										moduleType="taskUsers"
										onChange={(e) => handleChange('assigee_id', e.value)}
										options={projectUsers}
										value={projectUsers?.filter(
											(u) => u.value === data?.assigee_id,
										)}
										disabled={editInfo}
									/>
								</div>
								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">
										{location_name?.text}
									</Form.Label>
									<CustomSelect
										placeholder="Select Location..."
										name="location_id"
										onChange={(e) => handleChange('location_id', e.value)}
										options={locations}
										value={locations?.filter(
											(u) => u.value === data?.location_id,
										)}
										disabled={editInfo || props?.onlyinfo == "onlyinfo"}
									/>
								</div>
								{/* <div className="col-12">
									<Button type="submit" className="theme-btn float-end my-3">
									<i class="fa-solid fa-floppy-disk pe-2"></i>	
									{save?.text}
									</Button>
								</div> */}
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
export default MaterialLogInfo;
