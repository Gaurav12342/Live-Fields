import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import {
	createEquipmentLog,
	getAllEquipmentList,
} from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_EQUIPMENT_LIST } from '../../store/actions/actionType';
import CustomSelect from '../../components/SelectBox';
import { errorNotification } from '../../commons/notification';
import moment from 'moment';
import { getParameterByName } from '../../helper';

const { btn_equipment_log, create_equipment_log, equipment_log,err_hoursValue,err_minutesValue, ph_equipmentSelect,ph_hours, ph_minutes, ph_notes } =
getSiteLanguageData('equiqment');
const { name, hours, minutes, notes, quantity, nos_text } = getSiteLanguageData('commons');

function CreateEquipmentLog(props) {
	const userId = getUserId();
	const { project_id, labour_equipment_log_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const date = getParameterByName('labour_equipment_log_date');
	const handleClose = () => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			labour_equipment_log_id: labour_equipment_log_id,
			equipment_id: '',
			quantity: '',
			hours: '',
			minutes:'',
			notes: '',
			log_date: date,
		});
	};
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		labour_equipment_log_id: labour_equipment_log_id,
		equipment_id: '',
		quantity: '',
		hours: '',
		minutes:'',
		notes: '',
		log_date: date,
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
		if(name == "hours" && ( value != "" && (value == 0 || Number(value) <= 0 || Number(value) > 24))){
			errorNotification(err_hoursValue?.text);
		}else if(name == "minutes" && ( value != "" && (value == 0 || Number(value) <= 0 || Number(value) > 60))){
			errorNotification(err_minutesValue?.text);
		}else{
			setInfo({
				...info,
				[name]: value,
			});
		}
		
	};
	const submitEquipment = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createEquipmentLog(info));
	};
	return (
		<>
			<span
				tooltip={btn_equipment_log.tooltip}
				data-tooltip
				aria-haspopup="false"
				className={`${props?.className} lf-test`}
				onClick={handleShow}>
				<i className="fas fa-plus px-1"> </i> {btn_equipment_log?.text}
			</span>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{create_equipment_log?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEquipment}>
						<div className="row p-3 ">
							<div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{name?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12 mb-1">
								<CustomSelect
									placeholder={ph_equipmentSelect?.text}
									name="equipment_id"
									onChange={(e) => handleChange('equipment_id', e.value)}
									options={equipment}
									value={equipment?.filter(
										(as) => as.value === info.equipment_id,
									)}
								/>
							</div>
							<div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{nos_text?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-1">
									<FormControl
										className="lf-formcontrol-height"
										placeholder={nos_text.text}
										type="number"
										name="quantity"
										autoComplete="off"
										onChange={(e) => handleChange('quantity', e.target.value)}
										// value={info.quantity}
										required
									/>
								</InputGroup>
							</div>

							<div className='col-12'>
								<div className='row'>
									<div className='col-6'>
										<Form.Label className="mb-0">
											{hours?.text}
										</Form.Label>
										<FormControl
											className="lf-formcontrol-height"
											placeholder={ph_hours?.text}
											type="number"
											name="hours"
											autoComplete="off"
											onChange={(e) => handleChange('hours', e.target.value)}
											value={info?.hours}
											required
										/>
									</div>

									<div className='col-6'>
										<Form.Label className="mb-0">
											{minutes?.text}
										</Form.Label>
										<FormControl
											className="lf-formcontrol-height"
											placeholder={ph_minutes?.text}
											type="number"
											name="minutes"
											autoComplete="off"
											onChange={(e) => handleChange('minutes', e.target.value)}
											value={info?.minutes}
										/>
									</div>

								</div>

							</div>

							{/* <div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{hours?.text}
								</Form.Label>
								<InputGroup className="mb-1">
									<FormControl
										className="lf-formcontrol-height"
										placeholder="Enter Hours"
										type="number"
										name="hours"
										autoComplete="off"
										onChange={(e) => handleChange('hours', e.target.value)}
										// value={info.hours}
										required
									/>
								</InputGroup>
							</div> */}
							<div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{notes?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-1">
									<FormControl
										className="lf-formcontrol-height"
										placeholder={ph_notes?.text}
										type="textarea"
										name="notes"
										autoComplete="off"
										onChange={(e) => handleChange('notes', e.target.value)}
										// value={info.notes}
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12 mt-3">
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
export default CreateEquipmentLog;
