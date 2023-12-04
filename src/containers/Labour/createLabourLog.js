import { useEffect, useState } from 'react';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import {
	createLabourLog,
	getAllLabourList,
} from '../../store/actions/projects';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_LABOUR_LIST } from '../../store/actions/actionType';
import CustomSelect from '../../components/SelectBox';
import { errorNotification } from '../../commons/notification';
import moment from 'moment';
import { getParameterByName } from '../../helper';

function CreateLabourLog(props) {
	const userId = getUserId();
	const { project_id, labour_equipment_log_id } = useParams();
	const dispatch = useDispatch();
	const date = getParameterByName('labour_equipment_log_date');
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			labour_equipment_log_id: labour_equipment_log_id,
			log_date: date,
			labour_id: '',
			quantity: '',
			hours: '',
			minutes:'',
			notes: '',
		});
	};
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		labour_equipment_log_id: labour_equipment_log_id,
		log_date: date,
		labour_id: '',
		quantity: '',
		hours: '',
		minutes:'',
		notes: '',
	});
	const handleChange = (name, value) => {
		if(name == "hours" && ( value != "" && (value == 0 || Number(value) <= 0 || Number(value) > 24))){
			errorNotification("Hours value should be between 0 to 24");
		}else if(name == "minutes" && ( value != "" && (value == 0 || Number(value) <= 0 || Number(value) > 60))){
			errorNotification("Hours value should be between 0 to 60");
		}else{
			setInfo({
				...info,
				[name]: value,
			});
		}
		
	};
	const labourList = useSelector((state) => {
		return state?.project?.[GET_ALL_LABOUR_LIST]?.result || [];
	});
	useEffect(() => {
		if (labourList?.length <= 0) {
			dispatch(getAllLabourList(project_id));
		}
	}, [labourList?.length, dispatch]);

	const labourLog = labourList?.map((b) => {
		return { label: b.name, value: b._id };
	});

	const submitLabour = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createLabourLog(info));
	};
	const { btn_labour_log, create_labour_log, labour,ph_labourSelect, create_labour_log_btn } =
		getSiteLanguageData('labour');
	const { hours, minutes, notes,ph_notes, quantity, nos_text,ph_hours,ph_minutes } = getSiteLanguageData('commons');
	return (
		<>
			<span
				type="submit"
				onClick={handleShow}
				tooltip={btn_labour_log.tooltip}
				className={props?.className}>
				<i className="fas fa-plus px-1"></i> {btn_labour_log?.text}
			</span>
			<Modal show={show} onHide={handleClose} animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{create_labour_log?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitLabour}>
						<div className="row p-3 ">
							<div className="col-sm-12">
								<Form.Label className="mb-0">{labour?.text}</Form.Label>
							</div>

							<div className="col-sm-12 mb-1">
								<CustomSelect
									placeholder={ph_labourSelect?.text}
									name="labour_id"
									onChange={(e) => handleChange('labour_id', e.value)}
									options={labourLog}
									value={labourLog?.filter((as) => as.value === info.labour_id)}
									required
								/>
							</div>
							<div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{nos_text?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12  mb-1">
								<FormControl
									className="lf-formcontrol-height"
									placeholder={nos_text?.text}
									type="number"
									name="quantity"
									autoComplete="off"
									onChange={(e) => handleChange('quantity', e.target.value)}
									value={info?.quantity}
									required
								/>
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
											max={24}
											min={0}
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
											max={60}
											min={0}
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
							</div> */}

							{/* <div className="col-sm-12  mb-1">
								<FormControl
									className="lf-formcontrol-height"
									placeholder="Enter Hours"
									type="number"
									name="hours"
									autoComplete="off"
									onChange={(e) => handleChange('hours', e.target.value)}
									value={info?.hours}
									required
								/>
							</div> */}
							<div className="col-sm-12">
								<Form.Label className="mb-0" htmlFor="templatename">
									{notes?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12  mb-1">
								<FormControl
									className="lf-formcontrol-height"
									placeholder={ph_notes?.text}
									type="textarea"
									name="notes"
									autoComplete="off"
									onChange={(e) => handleChange('notes', e.target.value)}
									value={info?.notes}
								/>
							</div>
							<div className="col-sm-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn float-end btn-block show-verify">
									{create_labour_log_btn?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateLabourLog;
