import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
} from '../../store/actions/actionType';
import { getLocationList } from '../../store/actions/Task';
import CustomSelect from '../../components/SelectBox';
// import { createStoreRoom } from "../../store/actions/storeroom";
const userId = getUserId();

function StoreRoomPOOrderDeliverd() {
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

	// const submitStore = (e) => {
	//   e.preventDefault();
	//   handleClose();
	//   dispatch(createStoreRoom({ ...info, assigee_id: (info?.assigee_id).map(t => { return (t.value) }), location_id: (info?.location_id).map(t => { return (t.value) }) }));
	// };

	const {
		create_order,
		purchase_order,
		order_no,
		vendor,
		date_of_order,
		expected_delivery_date,
		order_Details,
		material,
		order_qty,
		sign_PO
	} = getSiteLanguageData('storeroom');

	const { edit } = getSiteLanguageData('commons');

	const { general_notes } = getSiteLanguageData(
		'reports/components/fieldreportinfo',
	);

	const { attachment } = getSiteLanguageData(
		'reports/toolbar',
	);

	return (
		<>
			<Button className="btn theme-btn" onClick={handleShow}>
				+ {create_order.text}
			</Button>
			<Modal
				className="lf-modal"
				size={'md'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{purchase_order.text}</Modal.Title>
					<span className="px-3 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold float-end">
						{edit.text}
					</span>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-sm-12 ">
							<Form.Label htmlFor="col-sm-12">
								{order_no.text} Ord1234
							</Form.Label>
						</div>
						<div className="col-sm-12 ">
							<Form.Label htmlFor="">
								{vendor.text} Reliance Industries
							</Form.Label>
						</div>
						<div className="form-group">
							<Form.Label htmlFor="Manpower">
								{date_of_order.text} 04-01-2022
							</Form.Label>
							<div className="form-group">
								<Form.Label htmlFor="Manpower">
									{expected_delivery_date.text} 04-01-2022
								</Form.Label>
							</div>

							<div className="col-sm-12 mt-2">
								<hr></hr>
								<Form.Label htmlFor="">{order_Details.text}</Form.Label>
							</div>
							<div className="table-responsive">
								<table className="table white-table  mt-2">
									<thead>
										<tr className="bg-light text-nowrap text-capitalize">
											<th>{material.text}</th>
											<th>{order_qty.text}</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<span>Cemeat</span>
											</td>
											<td>
												<span>50</span>
											</td>
											<td className="text-start ">
												<span className="float-end">
													<i className="theme-bgcolor fas fa-trash-alt lf-link-cursor"></i>
												</span>
											</td>
										</tr>
										<tr>
											<td>
												<span>Steel(kg)</span>
											</td>
											<td>
												{' '}
												<span>50</span>
											</td>
											<td>
												<span className="float-end">
													<i className="theme-bgcolor fas fa-trash-alt lf-link-cursor"></i>
												</span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="col-sm-12 ">
							<Form.Label htmlFor="">{general_notes.text}</Form.Label>
						</div>
						<div className="col-sm-12">
							<InputGroup>
								<FormControl
									placeholder="Cement is not as per standard"
									type="text"
									name="description"
									autoComplete="off"
									// onChange={(e) => handleChange('description', e.target.value)}
									// value={info.description}
									required
								/>
							</InputGroup>
						</div>
						<div className="col-sm-12">
							<Form.Label>{attachment.text}</Form.Label>
						</div>
						<div className="card">
							<div classNmae="card">
								<i className="fas fa-plus-circle"></i>
								<img
									alt="livefield"
									src={'/images/sheets/noImage.png'}
									className="lf-priority-report mx-3"></img>
								<img
									alt="livefield"
									src={'/images/sheets/noImage.png'}
									className="lf-priority-report"></img>
							</div>
						</div>
						<div className="col-sm-12 mt-2">
							<span className="float-end">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									{sign_PO.text}
								</Button>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify ms-3">
									<i class="fa-solid fa-xmark pe-2"></i>
								</Button>
							</span>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default StoreRoomPOOrderDeliverd;
