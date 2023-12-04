import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { updateFileName } from '../../store/actions/projects';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { UPDATE_FILE_NAME } from '../../store/actions/actionType';

function EditFileName(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		file_id: props?.file?._id,
		file_name: props?.file?.file_name || props?.fileName,
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitFileName = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(updateFileName(info));
	};
	const updateFileNameRes = useSelector((state) => {
		return state?.project?.[UPDATE_FILE_NAME] || [];
	}, shallowEqual);

	useEffect(() => {
		if (updateFileNameRes?.success === true) {
			handleClose();
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				file_id: props?.file._id,
				file_name: '',
			});
		}
	}, [updateFileNameRes?.success, dispatch]);

	const { edit_file_name, file_name,ph_file_name, update_file_name } =
		getSiteLanguageData('files');
	const { save } = getSiteLanguageData('commons');

	return (
		<>
			{/* <Button className="btn-blue ms-2"
        onClick={handleShow}>
        <img alt="livefield" src="/images/edit-white.svg" width="15px" />
      </Button> */}
			<span
				className="theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold p-1"
				tooltip={edit_file_name.tooltip}
				flow={edit_file_name.tooltip_flow}
				onClick={handleShow}>
				<i className="fas fa-edit lf-sheet-icon"></i>
			</span>
			<Modal
				className="lf-modal"
				size=""
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_file_name?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitFileName}>
						<div className="row p-3">
							<div className="col-sm-12">
								<Form.Label className="mb-0">{file_name?.text}</Form.Label>
							</div>
							<div className="col-sm-12">
								<InputGroup>
									<FormControl
										placeholder={ph_file_name?.text}
										type="text"
										name="file_name"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={decodeURI(info.file_name)}
										required
									/>
								</InputGroup>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block mt-3 show-verify float-end">
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default EditFileName;
