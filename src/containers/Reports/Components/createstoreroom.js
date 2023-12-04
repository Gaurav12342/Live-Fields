import { useState, useEffect } from 'react';
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
import {
	createStoreRoom,
	updateStoreRoom,
} from '../../../store/actions/storeroom';
import CustomSelect from '../../../components/SelectBox';
import DatePicker from 'react-datepicker';
import moment from 'moment';

function CreateStoreRoom({ storeInfo, type, ...props }) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		description: '',
		assigee_id: [userId],
		// location_id: storeInfo?.location_id || [],
		start_date: null,
		end_date: '',
	});

	useEffect(() => {
		setInfo({
			description: storeInfo?.description || '',
			assigee_id: storeInfo?.assigee_id || [userId],
			// location_id: storeInfo?.location_id || [],
			start_date: storeInfo?.start_date || new Date(),
			end_date: storeInfo?.end_date || '',
		});
	}, [storeInfo]);

	const handleClose = () => {
		setShow(false);
		if (type === 'update') {
			setInfo({
				description: storeInfo?.description,
				assigee_id: storeInfo?.assigee_id,
				// location_id: storeInfo?.location_id,
				start_date: storeInfo?.start_date,
				end_date: storeInfo?.end_date,
			});
		} else {
			setInfo({
				description: '',
				assigee_id: [],
				// location_id: [],
				start_date: new Date(),
				end_date: '',
			});
		}
	};
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	// const storeLocation = useSelector((state) => {
	//   return state?.task?.[GET_LOCATION_LIST]?.result || [];
	// });
	// const location = storeLocation?.map((tl) => {
	//   return { label: tl.name, value: tl._id }
	// })

	/* const projectUsers = [];
	assignee?.forEach((a) => {
		(a?.users).forEach((u) => {
			projectUsers.push({
				label: u.first_name + ' ' + u.last_name,
				value: u._id,
			});
		});
	}); */
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
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitStore = (e) => {
		e.preventDefault();
		const post = {
			...info,
			user_id: userId,
			project_id: project_id,
		};
		if (type == 'update') {
			post.store_room_id = storeInfo?._id;
			dispatch(updateStoreRoom(post));
		} else {
			dispatch(createStoreRoom(post));
		}
		handleClose();
	};

	const { storeroom, store, assigee } = getSiteLanguageData('reports/toolbar');
	const { name, start_date, end_date, assignee_name, save } =
		getSiteLanguageData('commons');
	return (
		<>
			{props?.children ? (
				React.cloneElement(props?.children, { onClick: handleShow })
			) : (
				<span tooltip={storeroom.tooltip} flow={storeroom.tooltip_flow}>
					<span
						className="ms-1 theme-btnbg theme-secondary rounded lf-link-cursor"
						onClick={handleShow}>
						<i className="fas fa-plus px-2"></i>
						{/* {storeroom?.text} */}
					</span>
				</span>
			)}
			<Modal
				className="lf-modal"
				size={'md'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title className="text-capitalize">
						{type || 'create'} {storeroom?.text}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitStore}>
						<div className="row px-3 ">
							<div className="col-sm-12 ">
								<Form.Label className="mb-0">{name?.text}</Form.Label>
								<InputGroup>
									<FormControl
										placeholder="Name"
										type="text"
										name="description"
										autoComplete="off"
										className=""
										onChange={(e) =>
											handleChange('description', e.target.value)
										}
										value={info.description}
										required
									/>
								</InputGroup>
								<div className="row">
									<div className="col-sm-6 mt-2">
										<Form.Label className="mb-0">{start_date?.text}</Form.Label>
										<DatePicker
											customInput={
												<FormControl className="lf-formcontrol-height" />
											}
											name="start_date"
											selected={
												info?.start_date
													? moment(info.start_date).toDate()
													: null
											}
											disabled={type == 'update'}
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
												info?.end_date ? moment(info?.end_date).toDate() : ''
											}
											autoComplete="off"
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
												info?.end_date ? moment(info?.end_date).toDate() : null
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
											autoComplete="off"
										/>
									</div>
								</div>

								{/* <div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">
										Frequency
									</Form.Label>
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
										
										value={"Daily"}
									/>
								</div> */}

								<div className="col-sm-12 mt-2">
									<Form.Label className="mb-0">{assigee.text}</Form.Label>
								</div>

								<div className="col-sm-12">
									<CustomSelect
										placeholder="Assigee..."
										moduleType={'taskUsers'}
										name="assigee_id"
										onChange={(e) => handleChange('assigee_id', [e.value])}
										options={projectUsers}
										value={projectUsers.filter((c) =>
											info?.assigee_id?.includes(c.value),
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
				</div> */}
								<div className="col-12 mt-3">
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
										<i className="fa-solid fa-floppy-disk pe-2"></i>
										{save?.text}
									</Button>
								</div>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateStoreRoom;
