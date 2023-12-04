import { useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { createLabour } from '../../store/actions/projects';
import { useDispatch } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';

function CreateLabourInfo() {
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
	const { labour_info } = getSiteLanguageData('labour');
	const { create } = getSiteLanguageData('commons');
	return (
		<>
			<span
				type="submit"
				onClick={handleShow}
				className="mt-1 fw-bold theme-secondary lf-common-btn float-end">
				Info
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title className="mb-0 fs-4">{labour_info?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitLabour}>
						<div className="row p-3 ">
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
export default CreateLabourInfo;
