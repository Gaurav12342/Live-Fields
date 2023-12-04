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
import { updateStoreRoom } from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';
const userId = getUserId();

function Updatestore(props) {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		store_room_id: props?.data?._id,
		description: props?.data?.description,
		assigee_id: props?.data?.assigee_id,
		location_id: props?.data?.location_id,
	});

	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitStoreData = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(updateStoreRoom(info));
	};
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	const storeLocation = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
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
	const location = storeLocation?.map((tl) => {
		return { label: tl.name, value: tl._id };
	});

	const { name, assignee_name, location_name, save} =
		getSiteLanguageData('commons');
	const { update_store_Room, info_name } = getSiteLanguageData(
		'storeroom/updatestore',
	);

	return (
		<>
			<span
				className="p-2 ms-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
				onClick={handleShow}>
				<i className="fas fa-edit"></i>
			</span>
			<Modal size={'md'} show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{update_store_Room?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitStoreData}>
						<div className="row p-3 ">
							<div className="col-sm-12 mt-2 ">
								<Form.Label htmlFor="templatename">{name?.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup>
									<FormControl
										placeholder={name?.text}
										type="text"
										name="description"
										autoComplete="off"
										onChange={(e) =>
											handleChange('description', e.target.value)
										}
										value={info.description}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{assignee_name?.text}</Form.Label>
							</div>

							<div className="col-sm-12 ">
								<CustomSelect
									placeholder={`${assignee_name?.text}...`}
									name="assigee_id"
									moduleType="taskUsers"
									onChange={(e) =>
										handleChange(
											'assigee_id',
											e?.map((a) => a.value),
										)
									}
									options={projectUsers}
									value={projectUsers?.filter((assingee) =>
										info.assigee_id?.some((a) => a === assingee.value),
									)}
									isMulti
								/>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{location_name?.text}</Form.Label>
							</div>

							<div className="col-sm-12 ">
								<CustomSelect
									placeholder={`${location_name.text}...`}
									name="location_id"
									onChange={(e) =>
										handleChange(
											'location_id',
											e?.map((l) => l.value),
										)
									}
									options={location}
									value={location?.filter((locat) =>
										info.location_id?.some((a) => a === locat.value),
									)}
									isMulti
								/>
							</div>
							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
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
export default Updatestore;
