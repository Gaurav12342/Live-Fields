import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { getAllRoleWisePeople } from '../../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
} from '../../../store/actions/actionType';
import { getLocationList } from '../../../store/actions/Task';
import CustomSelect from '../../../components/SelectBox';
// import { createStoreRoom } from "../../store/actions/storeroom";
const userId = getUserId();

function EditEntry() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// const [info, setInfo] = useState({
	//   user_id: userId,
	//   project_id: project_id,
	//   description: "",
	//   assigee_id: [],
	//   location_id: []
	// });
	const assignee = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	useEffect(() => {
		if (assignee?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [assignee, project_id, dispatch]);
	const storeLocation = useSelector((state) => {
		return state?.task?.[GET_LOCATION_LIST]?.result || [];
	});
	useEffect(() => {
		if (storeLocation?.length <= 0) {
			dispatch(getLocationList(project_id, userId));
		}
	}, [storeLocation?.length, dispatch]);

	const projectUsers = [];
	assignee?.forEach((a) => {
		(a?.users).forEach((u) => {
			projectUsers.push({ label: u.first_name, value: u._id });
		});
	});

	// const submitStore = (e) => {
	//   e.preventDefault();
	//   handleClose();
	//   dispatch(createStoreRoom({ ...info, assigee_id: (info?.assigee_id).map(t => { return (t.value) }), location_id: (info?.location_id).map(t => { return (t.value) }) }));
	// };

	const { edit_entry, select_type } = getSiteLanguageData('components');
	const {
		consumption_qty,
		request,
		select_material,
		adjustment_qty,
		material_unit,
		update,
		cancel,
		quantity,
		note,
	} = getSiteLanguageData('editEntry');
	return (
		<>
			{/* <Button className="btn theme-btn" onClick={handleShow}>
                + Create Order
            </Button> */}
			<span
				onClick={handleShow}
				className="theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
				<i className="theme-bgcolor far fa-edit  lf-link-cursor ms-2"></i>
			</span>
			<Modal size={'md'} show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{edit_entry?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-sm-12">{select_type?.text}</div>

						<div className="form-group">
							<label className="radio-orange store-Issue-btn">
								{consumption_qty?.text}
								<input type="radio" name="licence_period" />
								<span className="radiokmark"></span>
							</label>
							<label className="radio-orange store-Issue-btn">
								{request?.text}
								<input type="radio" name="licence_period" />
								<span className="radiokmark"></span>
							</label>
							<label className="radio-orange store-Issue-btn">
								{adjustment_qty?.text}
								<input type="radio" name="licence_period" />
								<span className="radiokmark"></span>
							</label>
						</div>

						<div className="col-sm-12 ">
							<Form.Label htmlFor="">{select_material?.text}</Form.Label>
						</div>
						<div className="col-sm-8">
							<InputGroup>
								<FormControl
									placeholder=""
									type="text"
									name="description"
									autoComplete="off"
									// onChange={(e) => handleChange('description', e.target.value)}
									// value={info.description}
									required
								/>
							</InputGroup>
						</div>
						<div className="col-sm-12 ">
							<Form.Label htmlFor="">{material_unit?.text}</Form.Label>
						</div>
						<div className="col-sm-8">
							<InputGroup>
								<FormControl
									placeholder=""
									type="text"
									name="description"
									autoComplete="off"
									// onChange={(e) => handleChange('description', e.target.value)}
									// value={info.description}
									required
								/>
							</InputGroup>
						</div>
						<div className="col-sm-12 ">
							<Form.Label htmlFor="">{quantity?.text}</Form.Label>
						</div>
						<div className="col-sm-8">
							<InputGroup>
								<FormControl
									placeholder=""
									type="text"
									name="description"
									autoComplete="off"
									// onChange={(e) => handleChange('description', e.target.value)}
									// value={info.description}
									required
								/>
							</InputGroup>
						</div>
						<div className="col-sm-12 ">
							<Form.Label htmlFor="">{note?.text}</Form.Label>
						</div>
						<div className="col-sm-8">
							<InputGroup>
								<FormControl
									placeholder=""
									type="text"
									name="description"
									autoComplete="off"
									// onChange={(e) => handleChange('description', e.target.value)}
									// value={info.description}
									required
								/>
							</InputGroup>
						</div>
						<div className="col-sm-12 mt-2">
							<span className="float-end">
								<Button
									type="submit"
									variant="light"
									className="light-border btn-block my-1 show-verify ms-3">
									<i class="fa-solid fa-xmark pe-2"></i>
									{cancel?.text}
								</Button>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									{update?.text}
								</Button>
								
							</span>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default EditEntry;
