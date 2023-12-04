import { useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { addSheetPhoto } from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import Upload from '../../components/upload';
import { FILE_UPLOAD_LOADING } from '../../store/actions/actionType';
import { clearUploadFile } from '../../store/actions/Utility';

const userId = getUserId();
function AddPhoto(props) {
	const plan_id = props?.plan_id;
	const { project_id } = useParams();
	const pageLoading = useSelector((state) => {
		return state?.loading?.[FILE_UPLOAD_LOADING];
	});
	// const [item, deleteItem] = useState();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const handleClose = () => {
		setShow(false);
		dispatch(clearUploadFile());
		setInfo({
			user_id: userId,
			plan_id: plan_id,
			project_id: project_id,
			title: '',
			description: '',
			file: [],
		});
	};
	const handleShow = () => setShow(true);

	const [info, setInfo] = useState({
		user_id: userId,
		plan_id: plan_id,
		project_id: project_id,
		title: '',
		description: '',
		file: [],
	});
	const submitPhoto = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(addSheetPhoto(info));
	};
	const handleDelete = (link) => {
		const newArr = info.file?.filter((item) => {
			return item !== link;
		});
		handleChange(newArr, 'file');
	};
	const handleChange = (val, name) => {
		setInfo({
			...info,
			[name]: val,
		});
	};
	const { btn_add_photo } = getSiteLanguageData('sheet/toolbar');
	const { add_photo, upload_file, description } = getSiteLanguageData(
		'sheet/addsheetsphotos',
	);
	return (
		<>
			{/* {React.cloneElement(props.children, { onClick: handleShow })} */}
			<div className='btn btn-block bg-white w-100 mt-3 border-0' onClick={handleShow}>
				<span
					className={
						props?.className ||
						'btn theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold mt-2'
					}
					>
					{btn_add_photo?.text}
				</span>
			</div>
			
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size="md"
				animation={true}>
				<Modal.Header className="bg-light pb-2" closeButton>
					<Modal.Title className="mb-0 fs-4">{add_photo?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitPhoto}>
							<div className="form-group col-sm-12 pb-2">
								<Form.Label htmlFor="Description" className="ms-1 mb-0">
									{description?.text}{' '}
								</Form.Label>
								<InputGroup className="">
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
							{info.file.length > 0 ? (
								<div className="btn border mb-2 row">
									{info.file.map((f) => {
										return (
											<span
												key={f}
												className="col-4 sheet-grid-box position-relative">
												<img alt="livefield" src={f} className="lf-w-150" />
												<h6 className="lf-common-btn">
													<i
														className="fas fa-trash-alt mt-2"
														onClick={handleDelete.bind(this, f)}></i>
												</h6>
											</span>
										);
									})}
								</div>
							) : null}

							<Upload
								isLoading={isLoading} 
								setIsLoading={setIsLoading}
								fileType="plan_photo"
								fileKey={plan_id}
								onFinish={(file) => {
									const fileList = info.file;
									fileList.push(file);
									handleChange(fileList, 'file');
								}}>
								<span className="btn ms-3 border mt-2">
									<i className="fas fa-upload" /> {upload_file?.text}{' '}
									{pageLoading ? <div className="spinner-border" /> : ''}
								</span>
							</Upload>
							<Button
								disabled={isLoading ?? false}
								type="submit"
								className="theme-btn btn-block my-3 float-end">
								<i class="fas fa-plus pe-1"></i>
								{add_photo?.text}
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default AddPhoto;
