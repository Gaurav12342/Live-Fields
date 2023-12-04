import { useEffect, useState } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Dropdown,
} from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
} from '../../../store/actions/actionType';
import CustomSelect from '../../../components/SelectBox';
import { getLocationList } from '../../../store/actions/Task';
import { getAllRoleWisePeople } from '../../../store/actions/projects';
import {
	createLabourAndEquipmentLog,
	updateLabourAndEquipmentLog,
} from '../../../store/actions/report';
import moment from 'moment';
import DatePicker from 'react-datepicker';

function CreateLabourEquipmentLog({ data, type, ...props }) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		if (type === 'Update') {
			setInfo({
				description: data?.description,
				assigee_id: data?.assigee_id,
				start_date: data?.start_date,
				end_date: data?.end_date,
				location_id: data?.location_id,
			});
		} else {
			setInfo({
				description: '',
				assigee_id: '',
				start_date: new Date(),
				end_date: new Date(),
				location_id: '',
			});
		}
	};
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		description: data?.description || '',
		assigee_id: data?.assigee_id || '',
		start_date: data?.start_date || new Date(),
		end_date: data?.end_date,
		location_id: data?.location_id || '',
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitLabourAndEquipment = (e) => {
		e.preventDefault();
		handleClose();
		const post = {
			...info,
			user_id: userId,
			project_id: project_id,
		};
		if (type == 'Update') {
			post.labour_equipment_log_id = data?._id;
			dispatch(updateLabourAndEquipmentLog(post));
		} else {
			dispatch(createLabourAndEquipmentLog(post));
		}
	};
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee?.length, dispatch]);
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
	const materialLocation = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
	});
	useEffect(() => {
		if (materialLocation?.length <= 0) {
			dispatch(getLocationList(project_id, userId));
		}
	}, [materialLocation?.length, dispatch]);
	const location = materialLocation?.map((tl) => {
		return { label: tl.name, value: tl._id };
	});
	const { Labour_Equipment, labour_equipment_log } =
		getSiteLanguageData('reports/toolbar');
	const { ph_SelectAssignee } = getSiteLanguageData(
		'reports/components/updatesurveyreport',
	);
	const {
		description,
		start_date,
		end_date,
		assignee_name,
		location_name,
		save,
		ph_SelectLocation
	} = getSiteLanguageData('commons');
	return (
		<>
			{props?.children ? (
				React.cloneElement(props?.children, { onClick: handleShow })
			) : (
				<span
					tooltip={Labour_Equipment.tooltip}
					flow={Labour_Equipment.tooltip_flow}>
					<span
						className="ms-1 theme-btnbg theme-secondary rounded lf-link-cursor"
						onClick={handleShow}>
						<i className="fas fa-plus px-2"></i>
						{/* {Labour_Equipment?.text} */}
					</span>
				</span>
			)}
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>
						{type || 'Create'} {labour_equipment_log?.text}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitLabourAndEquipment}>
						<div className="row">
							<div className="col-sm-12 mt-2">
								<Form.Label htmlFor="templatename" className="mb-0">
									{description?.text}
								</Form.Label>
								<FormControl
									className="lf-formcontrol-height"
									placeholder="Enter Description"
									type="text"
									name="description"
									autoComplete="off"
									onChange={(e) => handleChange('description', e.target.value)}
									value={info?.description}
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
									selected={moment(info.start_date).toDate()}
									dateFormat="dd-MM-yyyy"
									placeholderText="Start Date"
									onChange={(e) =>
										handleChange('start_date', moment(e).format('YYYY-MM-DD'))
									}
									disabled={props?.onlyinfo == 'onlyinfo'}
									minDate={moment().toDate()}
									maxDate={
										info?.end_date ? moment(info?.end_date).toDate() : ''
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
										info.end_date ? moment(info.end_date).toDate() : null
									}
									dateFormat="dd-MM-yyyy"
									placeholderText="End Date"
									onChange={(e) =>
										handleChange('end_date', moment(e).format('YYYY-MM-DD'))
									}
									minDate={
										info?.start_date
											? moment(info?.start_date).toDate()
											: moment(new Date()).toDate()
									}
								/>
							</div>
							<div className="col-sm-12 mt-2">
								<Form.Label className="mb-0">{assignee_name?.text}</Form.Label>
								<CustomSelect
									placeholder={`${ph_SelectAssignee.text}`}
									name="assigee_id"
									onChange={(e) => handleChange('assigee_id', e.value)}
									options={projectUsers}
									moduleType="taskUsers"
									value={projectUsers?.filter(
										(u) => u.value === info.assigee_id,
									)}
								/>
							</div>
							<div className="col-sm-12 mt-2">
								<Form.Label className="mb-0">{location_name?.text}</Form.Label>
								<CustomSelect
									placeholder={`${ph_SelectLocation.text}`}
									name="location_id"
									onChange={(e) => handleChange('location_id', e.value)}
									options={location}
									value={location?.filter((u) => u.value === info.location_id)}
								/>
							</div>
							<div className="col-12">
								<Button type="submit" className="theme-btn float-end my-3">
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateLabourEquipmentLog;
