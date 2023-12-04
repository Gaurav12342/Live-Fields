import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { updatePlanDirectories } from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
import { UPDATE_DIRECTORY } from '../../store/actions/actionType';
function EditDirectory(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();

	const [show, setShow] = useState('');
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		directory_id: props?.data?._id,
		name: props?.data?.name,
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitProject = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(updatePlanDirectories(info));
	};

	const { update_directory,save} = getSiteLanguageData('sheet/toolbar');
	const { directory_name_modal } = getSiteLanguageData('sheet');
	return (
		<>
			{/* <img alt="livefield" src="/images/edit-orange.svg" width="15px"
        onClick={handleShow} */}
			<span
				style={{
					fontSize: '13px',
				}}
				tooltip={update_directory.tooltip}
				flow={update_directory.tooltip_flow}>
				<i
					className="far fa-edit theme-secondary theme-bgcolor lf-sheets-list-sheetdetail-rename-icon rounded"
					onClick={handleShow}></i>
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header
					className="py-2 bg-light
				"
					closeButton>
					<Modal.Title>{update_directory?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitProject}>
						{' '}
						<div className="col-sm-12">
							<div className="form-group">
								<Form.Label htmlFor="templatename" className="mb-0">
									{directory_name_modal?.text}
								</Form.Label>
								<InputGroup>
									<FormControl
										placeholder="Name"
										type="text"
										name="name"
										autoComplete="off"
										onChange={(e) => {
											handleChange(e);
										}}
										value={info?.name}
										required
									/>
								</InputGroup>
							</div>
							<Button
								type="submit"
								className="btn btn-primary theme-btn btn-block my-3 show-verify float-end">
								<i class="fa-solid fa-floppy-disk pe-2"></i>
								{save?.text}
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default EditDirectory;
