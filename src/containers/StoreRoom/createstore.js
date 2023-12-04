import { useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
} from '../../store/actions/actionType';
import { createStoreRoom } from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';
import Location from '../../components/location';
import { createlocation } from '../../store/actions/Task';
import Creatable from 'react-select/creatable';
import DatePicker from 'react-datepicker';
import moment from 'moment';

function Createstore() {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		description: '',
		start_date: '',
		end_date: '',
		assigee_id: [],
		location_id: [],
	});
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	const storeLocation = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
	});

	const projectUsers = [];

	const {
		btn_create_order,
		purchase_order,
		order_no,
		vendor,
		date_of_order,
		expected_delivery_date,
		save,
		material,
		order_Details,
		order_qty,
		order_rate,
		create_store,
	} = getSiteLanguageData('storeroom');
	const { name: StoreName, submit } = getSiteLanguageData('commons');
	const { assigee, location: storeRoomLocation } =
		getSiteLanguageData('task/update');

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
	const location = storeLocation?.map((tl) => {
		return { label: tl.name, value: tl._id };
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitStore = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(
			createStoreRoom({
				...info,
				assigee_id: (info?.assigee_id).map((t) => {
					return t.value;
				}),
				location_id: (info?.location_id).map((t) => {
					return t.value;
				}),
			}),
		);
	};

	return (
		<>
			<span
				className="btn theme-btnbg theme-secondary rounded "
				onClick={handleShow}>
				{`+ ${create_store.text}`}
			</span>
			<Modal size={'md'} show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="pb-0 bg-light" closeButton>
					<Modal.Title>{create_store.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitStore}>
						<div className="row">
							<div className="col-sm-12">
								<Form.Label htmlFor="name" className="mb-0">
									{StoreName.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup>
									<FormControl
										placeholder={StoreName.text}
										type="text"
										name="description"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={(e) =>
											handleChange('description', e.target.value)
										}
										value={info.description}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-6">
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
									minDate={moment().toDate()}
									required
								/>
							</div>
							<div className="col-sm-6">
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
									minDate={moment().toDate()}
									required
								/>
							</div>
							<div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{assigee.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<CustomSelect
									placeholder={`${assigee.text}...`}
									name="assigee_id"
									moduleType="taskUsers"
									onChange={(e) => handleChange('assigee_id', e)}
									options={projectUsers}
									value={info.assigee_id}
									isMulti
								/>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename" className="mb-0">
									{storeRoomLocation.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<Creatable
									placeholder={`${storeRoomLocation.text}...`}
									name="location_id"
									onChange={(e) => {
										if (e.__isNew__) {
											this.props.dispatch(
												createlocation({
													user_id: userId,
													project_id: this.project_id,
													name: e.value,
												}),
											);
										}
										this.handleChangeInfo('location_id', e);
									}}
									options={location}
									value={info?.location_id}
								/>
							</div>
							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									{submit.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default Createstore;
