import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import {
	createTimeSheet,
	getAllRoleWisePeople,
} from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId from '../../commons';
import { GET_ALL_ROLE_WISE_PEOPLE } from '../../store/actions/actionType';
const userId = getUserId();

function CreateTimeSheet() {
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
		from_date: '',
		to_date: '',
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitTimeSheet = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createTimeSheet(info));
	};
	const assingee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assingee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assingee, project_id, dispatch]);
	return (
		<>
			<Button className="btn theme-btn float-end" onClick={handleShow}>
				+ Create TimeSheet
			</Button>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>Create TimeSheet</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitTimeSheet}>
						<div className="row p-3 ">
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">Assingee</Form.Label>
							</div>

							<div className="col-sm-7 mt-2">
								<InputGroup className="mb-3">
									<FormControl
										as="select"
										name="assigee_id"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.assigee_id}
										required>
										<option value={null}>select role</option>
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
								<Form.Label htmlFor="templatename">Description</Form.Label>
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
								<Form.Label htmlFor="templatename">From Date</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										type="date"
										name="from_date"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">To Date</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										type="date"
										name="to_date"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
									/>
								</InputGroup>
							</div>

							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									+ Create TimeSheet
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateTimeSheet;
