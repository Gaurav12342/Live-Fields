import { useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { createUnit } from '../../../store/actions/storeroom';
import { getSiteLanguageData } from '../../../commons';

function AddUnit() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		// project_id: project_id,
		unit: '',
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitUnit = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createUnit(info));
	};

	const { create_unit, add_unit, type, submit } = getSiteLanguageData('material/components');
	return (
		<>
			<Button className="btn theme-btn float-end me-2" onClick={handleShow}>
				{add_unit?.text}
			</Button>
			<Modal size={'md'} show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{create_unit?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitUnit}>
						<div className="row p-3 ">
							<div className="col-sm-12 mt-2 ">
								<Form.Label htmlFor="templatename">{type?.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-3">
									<FormControl
										placeholder="Enter Type"
										type="text"
										name="unit"
										autoComplete="off"
										onChange={(e) => handleChange('unit', e.target.value)}
										value={info.unit}
										required
									/>
								</InputGroup>
							</div>

							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									<i className='fa-solid fa-floppy-disk pe-2'></i>	
									{submit?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default AddUnit;
