import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import {
	createInspection,
	getAllRoleWisePeople,
} from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
} from '../../store/actions/actionType';
import { getLocationList } from '../../store/actions/Task';
const userId = getUserId();

function CreateInspection() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		assigee_id: '',
		description: '',
		reqsuested_name: '',
		inspection_date: '',
		inspection_time: '',
		location: '',
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitInspection = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createInspection(info));
	};
	const assingee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assingee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assingee, project_id, dispatch]);
	const location = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
	});
	useEffect(() => {
		if (location?.length <= 0) {
			dispatch(getLocationList(project_id, userId));
		}
	}, [location?.length, dispatch]);
	const {
		create_inspection,
		create_inspection_name,
		select_role,
		requested_user,
		description,
		inspection_date_n,
		inspection_time,
		select_location,
	} = getSiteLanguageData('inspection');
	const { assignee_name, location_name } = getSiteLanguageData('commons');
	return (
		<>
			<Button className="btn theme-btn float-end" onClick={handleShow}>
				{create_inspection?.text}
			</Button>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{create_inspection_name?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitInspection}>
						<div className="row p-3 ">
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">
									{assignee_name?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-2">
								<InputGroup className="mb-3">
									<FormControl
										as="select"
										name="assigee_id"
										onChange={(e) => handleChange(e)}
										value={info.assigee_id}
										autoComplete="off"
										required>
										<option value={null}>{select_role?.text}</option>
										{assingee?.map((d) => {
											return d?.users?.map((u) => {
												return (
													<option key={u._id} value={u?._id}>
														{u?.first_name}
													</option>
												);
											});
										})}
									</FormControl>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">
									{requested_user?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-2">
								<InputGroup className="mb-3">
									<FormControl
										as="select"
										name="reqsuested_name"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.reqsuested_name}
										required>
										<option value={null}>{select_role?.text}</option>
										{assingee?.map((d) => {
											return d?.users?.map((u) => {
												return (
													<option key={u._id} value={u?._id}>
														{u?.first_name}
													</option>
												);
											});
										})}
									</FormControl>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">
									{description?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										placeholder="Enter Description"
										as="textarea"
										name="description"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">
									{inspection_date_n?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										type="date"
										name="inspection_date"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">
									{inspection_time?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										type="time"
										name="inspection_time"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">
									{location_name?.text}
								</Form.Label>
							</div>

							<div className="col-sm-7 mt-2">
								<InputGroup className="mb-3">
									<FormControl
										as="select"
										name="location"
										onChange={(e) => handleChange(e)}
										value={info.location}
										autoComplete="off"
										required>
										<option value={null}>{select_location?.text}</option>
										{location?.map((l) => {
											return (
												<option key={l._id} value={l?.name}>
													{l?.name}
												</option>
											);
										})}
									</FormControl>
								</InputGroup>
							</div>

							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									{create_inspection?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateInspection;
