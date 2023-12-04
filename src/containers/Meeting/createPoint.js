import { useState } from 'react';
import { Modal, Form, Button, FormControl, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { createPoint } from '../../store/actions/projects';
import { useDispatch } from 'react-redux';
import getUserId from '../../commons';

const userId = getUserId();
function CreatePoint(props) {
	const { project_id } = useParams();
	const meetingId = props?.meeting_id;

	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [info, setInfo] = useState({
		user_id: userId,
		meeting_id: meetingId,
		project_id: project_id,
		title: '',
	});

	const submitMeetingPoint = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createPoint(info));
	};

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	return (
		<>
			{React.cloneElement(props.children, { onClick: handleShow })}
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size="md"
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>Create Point</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form.Label className="mb-0">Title</Form.Label>
						<Form onSubmit={submitMeetingPoint}>
							<InputGroup>
								<FormControl
									placeholder="Title"
									type="text"
									name="title"
									autoComplete="off"
									onChange={(e) => handleChange(e)}
									value={info.title}
									required
								/>
							</InputGroup>
							<Button
								type="submit"
								className="theme-btn btn-block float-end my-3">
								+Create
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreatePoint;
