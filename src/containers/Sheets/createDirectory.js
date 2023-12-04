import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { createDirectory, getAllSheets } from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
import { CREATE_DIRECTORY } from '../../store/actions/actionType';
function SheetDirectory(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();

	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			name: '',
		});
	};
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
	const submitDirectory = (e) => {
		e.preventDefault();
		dispatch(createDirectory(info));
	};
	const createDirRes = useSelector((state) => {
		return state?.project?.[CREATE_DIRECTORY] || [];
	}, shallowEqual);
	useEffect(() => {
		if (createDirRes?.success && show) {
			handleClose();
			dispatch(getAllSheets(project_id));
		}
	}, [createDirRes, dispatch]);

	const { directory_name, directory, create_directory } =
		getSiteLanguageData('sheet');
	const { create } = getSiteLanguageData('commons');
	return (
		<>
			{/* <Button className="btn theme-btn" onClick={handleShow}>
        +New Directory
      </Button> */}
			<span onClick={handleShow} className="lf-link-cursor lf-common-btn ms-2 xs-m-0">
				<i className="fas fa-plus pe-1"></i> {directory?.text}
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{create_directory?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Form onSubmit={submitDirectory}>
							{' '}
							<div className="col-sm-12">
								<div className="form-group ">
									<Form.Label htmlFor="templatename" className="mb-0">
										{directory_name?.text}
									</Form.Label>
									<InputGroup>
										<FormControl
											placeholder="Name"
											type="text"
											name="name"
											autoComplete="off"
											onChange={(e) => handleChange(e)}
											value={info.name}
											required
										/>
									</InputGroup>
								</div>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-3 show-verify float-end">
									<i className="fa fa-plus pe-1"></i>
									{create?.text}
								</Button>
							</div>
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default SheetDirectory;
