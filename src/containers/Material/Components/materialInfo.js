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
	GET_STORE_ROOM,
} from '../../../store/actions/actionType';
import {
	createMaterialInfo,
	getStoreRoom,
	updateMaterialInfo,
} from '../../../store/actions/storeroom';
import CustomSelect from '../../../components/SelectBox';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { getLocationList } from '../../../store/actions/Task';
import { getAllRoleWisePeople } from '../../../store/actions/projects';

function MaterialInfo({ data, type, ...props }) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		if (type === 'Update') {
			setInfo({
				description: data?.description,
				store_room_id: data?.storeroom?._id,
				start_date: data?.start_date,
				end_date: data?.end_date,
				assigee_id: data?.assigee_id,
				location_id: data?.location_id,
			});
		} else {
			setInfo({
				description: '',
				store_room_id: '',
				start_date: new Date(),
				end_date: null,
				assigee_id: '',
				location_id: '',
			});
		}
	};
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		description: data?.description || '',
		store_room_id: data?.storeroom?._id || '',
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
	const submitEditMaterial = (e) => {
		e.preventDefault();
		handleClose();
		const post = {
			...info,
			user_id: userId,
			project_id: project_id,
		};
		if (type === 'Update') {
			post.material_log_id = data?._id;
			dispatch(updateMaterialInfo(post));
		} else {
			dispatch(createMaterialInfo(post));
		}
	};
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
	const location = projectLocation?.map((u) => {
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
	const { material_log } = getSiteLanguageData('reports/toolbar');
	const {
		description,
		start_date,
		end_date,
		assignee_name,
		location_name,
		save,
	} = getSiteLanguageData('commons');
	const { store_room } = getSiteLanguageData('components');
	return (
		<>
			{props?.children ? (
				React.cloneElement(props?.children, { onClick: handleShow })
			) : (
				<span tooltip={material_log.tooltip} flow={material_log.tooltip_flow}>
					<span
						className="ms-1 theme-btnbg theme-secondary rounded lf-link-cursor"
						onClick={handleShow}>
						<i className="fas fa-plus px-2"></i>
						{/* {material_log?.text} */}
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
						{type || 'Create'} {material_log?.text}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEditMaterial}>
						<div className="row px-3">
							<div className="col-sm-5 mt-3">
								<Form.Label htmlFor="templatename" className="mb-0">
									{description?.text}
								</Form.Label>
							</div>
							<div className="col-sm-12">
								<InputGroup className="">
									<FormControl
										className="lf-formcontrol-height"
										placeholder="Enter type"
										type="text"
										name="description"
										autoComplete="off"
										onChange={(e) =>
											handleChange('description', e.target.value)
										}
										value={info?.description}
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
									selected={moment(info?.start_date).toDate()}
									dateFormat="dd-MM-yyyy"
									placeholderText="Start Date"
									disabled={type == "Update"}
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
							<div className="col-sm-6 mt-1">
								<Form.Label className="mb-0">{end_date?.text}</Form.Label>
								<DatePicker
									customInput={
										<FormControl className="lf-formcontrol-height" />
									}
									name="end_date"
									selected={
										info?.end_date ? moment(info?.end_date).toDate() : null
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
								/>
							</div>
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{store_room?.text}</Form.Label>
								<CustomSelect
									placeholder="Select Store..."
									name="store_room_id"
									onChange={(e) => handleChange('store_room_id', e.value)}
									options={storeRoom}
									value={storeRoom?.filter(
										(u) => u.value === info?.store_room_id,
									)}
								/>
							</div>
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{assignee_name?.text}</Form.Label>
								<CustomSelect
									placeholder="Select Assignee..."
									name="assigee_id"
									moduleType="taskUsers"
									onChange={(e) => handleChange('assigee_id', e.value)}
									options={projectUsers}
									value={projectUsers?.filter(
										(u) => u.value === info?.assigee_id,
									)}
								/>
							</div>
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{location_name?.text}</Form.Label>
								<CustomSelect
									placeholder="Select Location..."
									name="location_id"
									onChange={(e) => handleChange('location_id', e.value)}
									options={location}
									value={location?.filter((u) => u.value === info?.location_id)}
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
export default MaterialInfo;
