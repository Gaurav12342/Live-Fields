import { useState } from 'react';
import { Modal, Form, Button, FormControl, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { createSubPoint } from '../../../store/actions/projects';
import { useDispatch } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';

function SubPoint(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const meetingId = props?.meeting_id;
	const metting_point_id = props?.metting_point_id;

	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = (e) => {
		setShow(false);
		setInfo({
			user_id: userId,
			meeting_id: meetingId,
			project_id: project_id,
			metting_point_id: metting_point_id,
			title: '',
		});
	};
	const handleShow = () => setShow(true);

	const [info, setInfo] = useState({
		user_id: userId,
		meeting_id: meetingId,
		project_id: project_id,
		metting_point_id: metting_point_id,
		title: '',
	});

	const submitMeetingSubPoint = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createSubPoint(info));
	};

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const { sub_point } = getSiteLanguageData('meeting');
	const { title } = getSiteLanguageData('meeting/components');
	return (
		<>
			<span
				className="lf-common-btn "
				tooltip={sub_point.tooltip}
				flow={sub_point.tooltip_flow}
				onClick={handleShow}>
				<i className="fas fa-plus" title="Add Subpoint" />
				{sub_point?.text}
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size="md"
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{`${props?.type} Sub-Point`}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="p-0">
						<Form.Label className="mb-0">{title?.text}</Form.Label>
						<Form onSubmit={submitMeetingSubPoint}>
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
								+{props?.type}
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default SubPoint;
