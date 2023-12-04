import { useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { addProjectPhoto } from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import Upload from '../../components/upload';
import { FILE_UPLOAD_LOADING } from '../../store/actions/actionType';
const userId = getUserId();
function AddPhoto(props) {
	const { project_id } = useParams();
	const pageLoading = useSelector((state) => {
		return state?.loading?.[FILE_UPLOAD_LOADING];
	});
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		title: '',
		description: '',
		file: '',
	});
	const submitPhoto = (e) => {
		e.preventDefault();
		handleClose();
		const post = {
			user_id: userId,
			project_id: project_id,
			title: info?.title,
			description: info?.description,
			file: info?.file,
		};
		dispatch(addProjectPhoto(post));
	};

	const handleChange = (val, name) => {
		setInfo({
			...info,
			[name]: val,
		});
	};
	const { btn_photo, title, photos } = getSiteLanguageData('photos');
	const { description } = getSiteLanguageData('commons');
	return (
		<>
			{/* {React.cloneElement(props.children, { onClick: handleShow })} */}
			<span
				tooltip={btn_photo.tooltip}
				flow={btn_photo.tooltip_flow}
				className={
					props.className || 'lf-main-button lf-link-cursor  float-end'
				}
				onClick={handleShow}>
				<i className="fas fa-plus pe-1"></i> {btn_photo?.text}
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size="sm"
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{photos?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitPhoto}>
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Add Photo" className="ms-1 mb-0">
									{title?.text}
								</Form.Label>
								<InputGroup>
									<FormControl
										type="text"
										autoComplete="off"
										onChange={(e) => handleChange(e.target.value, 'title')}
										placeholder={'Photo Title'}
									/>
								</InputGroup>
							</div>
							<div className="form-group col-sm-12 ">
								<Form.Label htmlFor="Description" className="ms-1 mt-1 mb-0">
									{description?.text}{' '}
								</Form.Label>
								<InputGroup>
									<FormControl
										type="text"
										autoComplete="off"
										onChange={(e) =>
											handleChange(e.target.value, 'description')
										}
										placeholder={'Description'}
									/>
								</InputGroup>
							</div>
							<span className="btn mt-1">
								{info.file !== '' ? (
									<img
										alt="livefield"
										src={info.file}
										style={{ width: '150px' }}
									/>
								) : (
									''
								)}
							</span>
							<Upload
								fileType="project_photo"
								onFinish={(file) => handleChange(file, 'file')}>
								{/* <span className="btn mt-2 border border">
					{
					
					info.file !== "" ? <img alt="livefield" src={info.file} style={{ width: '150px' }} /> :
						<><i className="fas fa-upload" /> upload file {pageLoading ? <div className="spinner-border" />  : ""} </>
					}
				</span> */}
							</Upload>
							<div>
								<Button
									type="submit"
									className="theme-btn btn-block my-3 float-end">
									{btn_photo?.text}
								</Button>
							</div>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default AddPhoto;
