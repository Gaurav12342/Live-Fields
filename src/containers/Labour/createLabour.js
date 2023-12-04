import { useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { createLabour } from '../../store/actions/projects';
import { useDispatch } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';

function CreateLabour() {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		name: '',
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitLabour = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createLabour(info));
	};
	const { btn_Labour, creat_laboure,ph_LabourName } = getSiteLanguageData('labour');
	const { name, create } = getSiteLanguageData('commons');
	return (
		<>
			<span
				type="submit"
				onClick={handleShow}
				tooltip={btn_Labour.tooltip}
				className="p-1 lf-link-cursor lf-main-button float-end">
				<i className="fas fa-plus px-1"></i> {btn_Labour?.text}
			</span>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{creat_laboure?.text} </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitLabour}>
						<div className="row p-3 ">
							<div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{name?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_LabourName?.text}
										type="text"
										name="name"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										// value={info.name}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-12">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block float-end show-verify">
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
export default CreateLabour;
