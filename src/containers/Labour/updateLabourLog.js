import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import {
	getAllLabourList,
	updateLabour,
	updateLabourLog,
} from '../../store/actions/projects';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_LABOUR_LIST,
	UPDATE_LABOUR,
} from '../../store/actions/actionType';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import { getParameterByName } from '../../helper';

function UpdateLabourLog(props) {
	const userId = getUserId();
	const { project_id, labour_equipment_log_id } = useParams();
	const date = getParameterByName('labour_equipment_log_date');
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		log_id: labour_equipment_log_id,
		project_id: project_id,
		labour_log_id: props?.data?.labour_log_id,
		quantity: props?.data?.quantity,
		hours: props?.data?.hours,
		notes: props?.data?.notes,
		date: date,
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const LabourList = useSelector((state) => {
		return state?.project?.[GET_ALL_LABOUR_LIST]?.result || [];
	});
	useEffect(() => {
		if (LabourList?.length <= 0) {
			dispatch(getAllLabourList(project_id));
		}
	}, [LabourList?.length, dispatch]);
	const labour = LabourList?.map((b) => {
		return { label: b.name, value: b._id };
	});
	const submitEditLabour = (e) => {
		// e.preventDefault();
		handleClose();
		dispatch(updateLabourLog(info));
	};
	const updateLabourRes = useSelector((state) => {
		return state?.project?.[UPDATE_LABOUR] || [];
	}, shallowEqual);

	useEffect(() => {
		if (updateLabourRes?.success === true) {
			handleClose();
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				name: '',
				quantity: '',
				hours: '',
				notes: '',
			});
		}
	}, [updateLabourRes?.success, dispatch]);
	const { update_labour_log } = getSiteLanguageData('labour/updatelabourlog');
	const { ph_selectLabour } = getSiteLanguageData('labour');
	const { name, hours, notes, save, quantity, ph_quantity,ph_hours,ph_notes } =
		getSiteLanguageData('commons');
	return (
		<>
			{/* <span className="p-2 ms-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold" onClick={handleShow}>
        <i className="fas fa-edit"></i></span> */}
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_labour_log.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEditLabour}>
						<div className="row p-3">
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{name.text}</Form.Label>
							</div>
							<div className="col-sm-12 mb-2">
								<CustomSelect
									placeholder={ph_selectLabour?.text}
									name="labour_id"
									onChange={(e) => handleChange('labour_id', e.value)}
									options={labour}
									value={labour?.filter(
										(as) => as.value === props?.data?.labour_id,
									)}
									isDisabled
								/>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{quantity.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-2">
									<FormControl
										placeholder={ph_quantity?.text}
										type="text"
										name="quantity"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={(e) => handleChange('quantity', e.target.value)}
										value={info.quantity}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{hours.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-2">
									<FormControl
										placeholder={ph_hours?.text}
										type="text"
										name="hours"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={(e) => handleChange('hours', e.target.value)}
										value={info.hours}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{notes.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-2">
									<FormControl
										placeholder={ph_notes?.text}
										type="textarea"
										name="notes"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={(e) => handleChange('notes', e.target.value)}
										value={info.notes}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12">
								<Button
									type="submit"
									className="btn btn-primary mt-1 theme-btn btn-block float-end show-verify">
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default UpdateLabourLog;
