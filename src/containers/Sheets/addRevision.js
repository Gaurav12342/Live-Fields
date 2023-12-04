import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Modal, Form, Button } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from '../../commons';
import { FILE_UPLOAD_LOADING } from '../../store/actions/actionType';
import { addPlanRevision } from '../../store/actions/projects';
import Upload from '../../components/upload';
import { clearUploadFile } from '../../store/actions/Utility';

function AddRelatedFile(props) {
	const userId = getUserId();
	const plan_id = props?.plan_id;
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		dispatch(clearUploadFile());
		setInfo({
			user_id: userId,
			plan_id: plan_id,
			project_id: project_id,
			file_url: '',
		});
	};
	const handleShow = () => setShow(true);
	const pageLoading = useSelector((state) => {
		return state?.loading?.[FILE_UPLOAD_LOADING];
	});
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		plan_id: plan_id,
		file_url: '',
	});
	const handleDelete = (link) => {
		dispatch(clearUploadFile());
		setInfo({
			user_id: userId,
			plan_id: plan_id,
			project_id: project_id,
			file_url: '',
		});
	};
	const submitRevision = (e) => {
		e.preventDefault();
		handleClose();
		const post = {
			user_id: userId,
			project_id: project_id,
			plan_id: plan_id,
			file_url: info?.file_url,
		};
		dispatch(addPlanRevision(post));
	};
	const handleChange = (val, name) => {
		setInfo({
			...info,
			[name]: val,
		});
	};
	const { add_revision } = getSiteLanguageData('sheet/addrevision');
	return (
		<>
			<span onClick={() => handleShow()}>
				<span
					title="Link File"
					className="theme-color lf-link-cursor float-end lf-Sheets-sheetDetails-related-btn text-bold">
					<i className="fas fa-plus px-1"></i>
				</span>
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size="md"
				animation={true}>
				<Modal.Header className="bg-light pb-2" closeButton>
					<Modal.Title className="mb-0 fs-4">{add_revision?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitRevision}>
							{info.file_url !== '' ? (
								<div className="col-5 btn border mb-2">
									<div className="row">
										<span className="col-10 sheet-grid-box position-relative">
											<img
												alt="livefield"
												src={info.file_url}
												className="lf-w-150"
											/>
										</span>
										<div className="col-2">
											<h6 className="mt-2">
												<i
													className="fas fa-trash-alt"
													onClick={handleDelete.bind(this, info.file_url)}></i>
											</h6>
										</div>
									</div>
								</div>
							) : (
								<Upload
									fileType="plan"
									fileKey={plan_id}
									onFinish={(file) => handleChange(file, 'file_url')}></Upload>
							)}
							<br />
							<Button
								type="submit"
								className="theme-btn btn-block my-3 float-end">
								<i class="fas fa-plus pe-1"></i>
								{add_revision?.text}
							</Button>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default AddRelatedFile;
