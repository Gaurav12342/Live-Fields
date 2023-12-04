import { useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { createEquipment } from '../../store/actions/projects';
import { useDispatch } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
const userId = getUserId();

function CreateEquipment() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		name: '',
		// quantity: "",
		// hours: "",
		// notes: "",
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitEquipment = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createEquipment(info));
	};
	const { btn_equipment, create_equipment, create,ph_equipmentName} =
		getSiteLanguageData('equiqment');
	const { name } = getSiteLanguageData('commons');
	return (
		<>
			<span
				tooltip={btn_equipment.tooltip}
				data-disable-hover="false"
				className="lf-link-cursor lf-main-button float-end"
				onClick={handleShow}>
				<i className="fas fa-plus px-1"> </i>
				{btn_equipment?.text}
			</span>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{create_equipment?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEquipment}>
						<div className="row p-3 ">
							<div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{name?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-1">
									<FormControl
										placeholder={ph_equipmentName?.text}
										type="text"
										name="name"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										// value={info.name}
										required
									/>
								</InputGroup>
							</div>
							{/* <div className="col-sm-5 mt-2 ">
				<Form.Label htmlFor="templatename">Quantity</Form.Label>
				</div>

				<div className="col-sm-7 mt-2 ">
				<InputGroup className="mb-3">
					<FormControl
					placeholder="Enter Quantity"
					type="text"
					name="quantity"
					onChange={(e) => handleChange(e)}
					// value={info.quantity}
					required
					/>
				</InputGroup>
				</div>
				<div className="col-sm-5 mt-2 ">
				<Form.Label htmlFor="templatename">Hours</Form.Label>
				</div>

				<div className="col-sm-7 mt-2 ">
				<InputGroup className="mb-3">
					<FormControl
					placeholder="Enter Hours"
					type="text"
					name="hours"
					onChange={(e) => handleChange(e)}
					// value={info.hours}
					required
					/>
				</InputGroup>
				</div>
				<div className="col-sm-5 mt-2 ">
				<Form.Label htmlFor="templatename">Notes</Form.Label>
				</div>

				<div className="col-sm-7 mt-2 ">
				<InputGroup className="mb-3">
					<FormControl
					placeholder="Enter text"
					type="textarea"
					name="notes"
					onChange={(e) => handleChange(e)}
					// value={info.notes}
					required
					/>
				</InputGroup>
				</div> */}
							<div className="col-sm-12 mt-3">
								<Button
									type="submit"
									className="float-end btn btn-primary theme-btn btn-block show-verify">
									<i className="fa fa-plus pe-1"></i>
									{create?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateEquipment;
