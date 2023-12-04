import { useState } from 'react';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { signLabourAndEquipmentLog } from '../../store/actions/projects';
import { useDispatch } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { getParameterByName } from '../../helper';
import Upload from '../../components/upload';
import Signature from '../../components/signature';

function SignLabourAndEquipmentLog(props) {
	const userId = getUserId();
	const { project_id, labour_equipment_log_id } = useParams();
	const date = getParameterByName('labour_equipment_log_date');
	const dispatch = useDispatch();
	// const [url, setUrl] = useState(null);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		labour_equipment_log_id: labour_equipment_log_id,
		user_id: userId,
		project_id: project_id,
		report_date: date,
		general_notes: '',
		attachement: [],
		signature_url: '',
		signed_by: userId,
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const handleDelete = (link) => {
		const newArr = info?.attachement?.filter((item) => {
			return item !== link;
		});
		handleChange('attachement', newArr);
	};
	const submitEquipment = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(signLabourAndEquipmentLog(info));
	};
	const { submit } = getSiteLanguageData('commons');
	const { sign_labour_equipment_log, notes, sign_report, file,ph_notes } =
		getSiteLanguageData('equiqment');
	return (
		<>
			<span
				type="submit"
				className="theme-secondary lf-common-btn float-end"
				onClick={handleShow}>
				{submit?.text}
			</span>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{sign_labour_equipment_log?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEquipment}>
						<div className="row p-3 ">
							<div className="col-sm-12 mb-2">
								<Form.Label className="mb-0">{notes?.text}</Form.Label>
								<FormControl
									placeholder={ph_notes?.text}
									as="textarea"
									name="general_notes"
									rows="3"
									autoComplete="off"
									onChange={(e) =>
										handleChange('general_notes', e.target.value)
									}
									value={info?.general_notes}
								/>
							</div>
							<div className="col-sm-12 px-3">
								<Upload
									className="col-sm-2"
									fileType="Labour_photo"
									fileKey={labour_equipment_log_id}
									onFinish={(file) => {
										const fileList = info?.attachement;
										fileList.push(file);
										handleChange('attachement', fileList);
									}}>
									<span className="theme-color lf-link-cursor">
										<i className="fas fa-plus" /> {file?.text}
									</span>
								</Upload>
								<div className="card mt-2 lf-load-more-attechment">
									<span className="ms-3 my-1 d-inline-block">
										{info?.attachement.length > 0
											? info?.attachement.map((f) => {
													return (
														<>
															<img
																alt="livefield"
																src={f}
																style={{ width: '40px', height: '40px' }}
															/>
															<i
																className="fas fa-times fa-xs lf-icon"
																onClick={handleDelete.bind(this, f)}></i>
														</>
													);
											  })
											: null}
									</span>
								</div>
							</div>
							<div className="col-sm-12 mt-2 ms-1">
								<span className="theme-btnbg theme-secondary rounded theme-btnbold">
									<Signature
										type="core"
										setUrl={handleChange}
										url={info?.signature_url}
									/>
								</span>
							</div>

							<div className="col-sm-12 pt-2">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block float-end show-verify">
									{sign_report?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default SignLabourAndEquipmentLog;
