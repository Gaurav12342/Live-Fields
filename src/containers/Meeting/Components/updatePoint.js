import { useEffect, useState } from 'react';
import { Modal, Form, Button, FormControl, InputGroup } from 'react-bootstrap';
import React from 'react';
import { editMeetingPoint } from '../../../store/actions/projects';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { UPDATE_MEETING_POINT } from '../../../store/actions/actionType';
import getUserId, { getSiteLanguageData } from '../../../commons';
const userId = getUserId();
function EditPoint(props) {
	const pointId = props?.data?._id;

	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [info, setInfo] = useState({
		user_id: userId,
		metting_point_id: pointId,
		title: props?.data?.title,
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitEditPoint = (e) => {
		e.preventDefault();
		dispatch(editMeetingPoint(info));
	};
	const updatePointRes = useSelector((state) => {
		return state?.project?.[UPDATE_MEETING_POINT] || [];
	}, shallowEqual);

	useEffect(() => {
		if (updatePointRes?.success === true) {
			handleClose();
			setInfo({
				...info,
				title: '',
			});
		}
	}, [updatePointRes?.success, dispatch]);
	const { add_point } = getSiteLanguageData('meeting');
	const { save } = getSiteLanguageData('commons');
	return (
		<>
			{/* <Button className="btn-blue" onClick={handleShow}>
        <img alt="livefield" src="/images/edit-white.svg" width="15px" />
      </Button> */}
			<span
				className="p-2 me-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
				tooltip={add_point.tooltip}
				flow={add_point.tooltip_flow}
				onClick={handleShow}>
				<i className="fas fa-edit"></i>
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size="md"
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{add_point?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitEditPoint}>
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
								<i class="fa-solid fa-floppy-disk pe-2"></i>
								{save?.text}
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default EditPoint;
