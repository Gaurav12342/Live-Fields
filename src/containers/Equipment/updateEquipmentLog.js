import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import {
	createEquipmentLog,
	getAllEquipmentList,
	updateEquipmentLog,
} from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_EQUIPMENT_LIST } from '../../store/actions/actionType';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';

function UpdateEquipmentLog(props) {
	const userId = getUserId();
	const { project_id, labour_equipment_log_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		log_id: labour_equipment_log_id,
		equipment_log_id: props?.data?._id,
		quantity: props?.data?.quantity,
		hours: props?.data?.hours,
		notes: props?.data?.notes,
		date: moment(new Date()).format('YYYY-MM-DD'),
	});
	const equipmentList = useSelector((state) => {
		return state?.project?.[GET_ALL_EQUIPMENT_LIST]?.result || [];
	});
	useEffect(() => {
		if (equipmentList?.length <= 0) {
			dispatch(getAllEquipmentList(project_id));
		}
	}, [equipmentList?.length, dispatch]);
	const equipment = equipmentList?.map((b) => {
		return { label: b.name, value: b._id };
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitEquipment = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(updateEquipmentLog(info));
	};
	const { update_equipment_log, equipment_log, quantity,ph_quantity, name_n,ph_selectEquipment } =
		getSiteLanguageData('equiqment');
	const { hours,ph_hours, notes,ph_notes } = getSiteLanguageData('commons');
	return (
		<>
			<span
				className="p-2 ms-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
				onClick={handleShow}>
				<i className="fas fa-edit"></i>
			</span>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_equipment_log?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEquipment}>
						<div className="row p-3 ">
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{name_n?.text}</Form.Label>
							</div>

							<div className="col-sm-12 mb-2">
								<CustomSelect
									placeholder={ph_selectEquipment?.text}
									name="equipment_log_id"
									onChange={(e) => handleChange('equipment_log_id', e.value)}
									options={equipment}
									value={equipment?.filter(
										(as) => as.value === props?.data?.equipment_id,
									)}
									isDisabled
								/>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{quantity?.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-2">
									<FormControl
										placeholder={ph_quantity?.text}
										type="text"
										name="quantity"
										className="lf-formcontrol-height"
										onChange={(e) => handleChange('quantity', e.target.value)}
										value={info.quantity}
										autoComplete="off"
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{hours?.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-2">
									<FormControl
										placeholder={ph_hours?.text}
										type="text"
										name="hours"
										className="lf-formcontrol-height"
										onChange={(e) => handleChange('hours', e.target.value)}
										value={info.hours}
										autoComplete="off"
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename">{notes?.text}</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-2">
									<FormControl
										placeholder={ph_notes?.text}
										type="textarea"
										name="notes"
										className="lf-formcontrol-height"
										onChange={(e) => handleChange('notes', e.target.value)}
										value={info.notes}
										autoComplete="off"
									/>
								</InputGroup>
							</div>

							<div className="col-sm-12">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block float-end show-verify">
									{equipment_log?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default UpdateEquipmentLog;
