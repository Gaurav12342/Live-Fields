import { useEffect, useState } from 'react';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import React from 'react';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
	GET_LABOUR_AND_EQUIPMENT_DETAILS,
} from '../../store/actions/actionType';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import getUserId, { getSiteLanguageData } from '../../commons';
import { useParams } from 'react-router';
import CustomSelect from '../../components/SelectBox';
import CustomDate from '../../components/CustomDate';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import { getLocationList } from '../../store/actions/Task';
import {
	getlabourAndequipmentDetails,
	updateLabourAndEquipmentLog,
} from '../../store/actions/report';

function LabourAndEquipmentDetails(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [editInfo, setEditInfo] = useState(true);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const [data, setData] = useState({
		labour_equipment_log_id: props?.data,
		user_id: userId,
		project_id: project_id,
		description: '',
		assigee_id: '',
		start_date: '',
		end_date: '',
		location_id: '',
	});
	const reportInfo = useSelector((state) => {
		return state?.report?.[GET_LABOUR_AND_EQUIPMENT_DETAILS]?.result || [];
	});
	useEffect(() => {
		if (reportInfo?.length <= 0) {
			dispatch(getlabourAndequipmentDetails(props?.data));
		}
	}, [reportInfo?.length, dispatch]);
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
		dispatch(updateLabourAndEquipmentLog(data));
	};

	useEffect(() => {
		const report = reportInfo?.[0];
		// if (data?.survey_report_request_id !== report?._id) {
		setData({
			labour_equipment_log_id: report?._id,
			user_id: userId,
			project_id: project_id,
			description: report?.description,
			assigee_id: report?.assigee_id,
			start_date: report?.start_date,
			end_date: report?.end_date,
			location_id: report?.location_id,
		});
		// }
	}, [assignee?.length, dispatch, show]);

	/* 	const editReportInfo = (e) => {
		e.preventDefault();
		const report = reportInfo?.[0];
		setData({
			labour_equipment_log_id: report?._id,
			user_id: userId,
			project_id: project_id,
			description: report?.description,
			assigee_id: report?.assigee_id,
			start_date: report?.start_date,
			end_date: report?.end_date,
			location_id: report?.location_id,
		});
		setEditInfo(!editInfo);
	}; */
	const { info, description, project_name, assigee, created_by, created_at,ph_description } =
		getSiteLanguageData('reports/toolbar');
	const { location, start_date, end_date, location_name,ph_SelectLocation, edit, save, cancel } =
		getSiteLanguageData('commons');
	const { assignee_name,ph_SelectAssignee } = getSiteLanguageData(
		'reports/components/updatesurveyreport',
	);
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
									<Form.Label htmlFor="templatename" className="mb-0">
										{description?.text}
									</Form.Label>
									<FormControl
										className="lf-formcontrol-height"
										placeholder={ph_description?.text}
										type="text"
										name="description"
										onChange={(e) =>
											handleChange('description', e.target.value)
										}
										disabled={editInfo}
										value={data?.description}
										required
									/>
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
										maxDate={
											data?.end_date ? moment(data?.end_date).toDate() : ''
										}
										disabled={editInfo || props?.onlyinfo == "onlyinfo"}
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
									<Form.Label className="mb-0">
										{assignee_name?.text}
									</Form.Label>
									<CustomSelect
										placeholder={ph_SelectAssignee?.text}
										name="assigee_id"
										onChange={(e) => handleChange('assigee_id', e.value)}
										options={projectUsers}
										moduleType="taskUsers"
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
										placeholder={ph_SelectLocation?.text}
										name="location_id"
										onChange={(e) => handleChange('location_id', e.value)}
										options={locations}
										value={locations?.filter(
											(u) => u.value === data?.location_id,
										)}
										disabled={editInfo}
									/>
								</div>
								<div className="col-sm-12 mt-2 text-end">
									{!editInfo ? (
										<>
											<Button
												type={'button'}
												variant="light"
												onClick={() => setEditInfo(true)}
												className="light-border mt-3 me-3">
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
							</div>
						</>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default LabourAndEquipmentDetails;
