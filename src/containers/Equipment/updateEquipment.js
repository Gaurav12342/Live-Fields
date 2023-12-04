import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { updateEquipment } from '../../store/actions/projects';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { UPDATE_EQUIPMENT } from '../../store/actions/actionType';

function EditEquipment(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		equipment_id: props?.data?._id,
		name: props?.data?.name,
		quantity: props?.data?.quantity,
		hours: props?.data?.hours,
		notes: props?.data?.notes,
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitEditLabour = (e) => {
		e.preventDefault();
		dispatch(updateEquipment(info));
	};
	const updateEquipmentRes = useSelector((state) => {
		return state?.project?.[UPDATE_EQUIPMENT] || [];
	}, shallowEqual);

	useEffect(() => {
		if (updateEquipmentRes?.success === true) {
			handleClose();
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				name: '',
				quantity: '',
				hours: '',
				notes: '',
			});
		}
	}, [updateEquipmentRes?.success, dispatch]);
	const { update_equipment,ph_equipmentName } = getSiteLanguageData('equiqment');
	const { name, hours, notes, quantity, save,ph_quantity,ph_hours,ph_notes} =
		getSiteLanguageData('commons');

	return (
		<>
			<span
				className="p-2 ms-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
				onClick={handleShow}>
				<i className="fas fa-edit"></i>
			</span>

			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{update_equipment?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEditLabour}>
						<div className="row p-3 ">
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">{name?.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-2">
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_equipmentName?.text}
										type="text"
										name="name"
										onChange={(e) => handleChange(e)}
										value={info.name}
										autoComplete="off"
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">{quantity?.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_quantity?.text}
										type="text"
										name="quantity"
										onChange={(e) => handleChange(e)}
										value={info.quantity}
										autoComplete="off"
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">{hours?.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_hours?.text}
										type="text"
										name="hours"
										onChange={(e) => handleChange(e)}
										value={info.hours}
										autoComplete="off"
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">{notes?.text}</Form.Label>
							</div>

							<div className="col-sm-7 mt-2 ">
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_notes?.text}
										type="textarea"
										name="notes"
										onChange={(e) => handleChange(e)}
										value={info.notes}
										autoComplete="off"
									/>
								</InputGroup>
							</div>
							<Button
								type="submit"
								className="btn btn-primary theme-btn btn-block my-1 show-verify">
								<i class="fa-solid fa-floppy-disk pe-2"></i>
								{save?.text}
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default EditEquipment;
