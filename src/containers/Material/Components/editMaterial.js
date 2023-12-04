import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import Select from 'react-select';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import {
	GET_ALL_UNIT_BY_PROJECT_ID,
	UPDATE_MATERIAL,
} from '../../../store/actions/actionType';
import { updateMaterial } from '../../../store/actions/storeroom';
import { getAllUnitByProjectId } from '../../../store/actions/storeroom';
import CustomSelect from '../../../components/SelectBox';

function EditMaterial(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		material_id: props?.data?._id,
		type: props?.data?.type,
		unit: props?.data?.unit,
		minimum_quantity: props?.data?.minimum_quantity,
		notes: props?.data?.notes,
	});
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitEditMaterial = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(updateMaterial(info));
	};
	const updateMaterialRes = useSelector((state) => {
		return state?.store?.[UPDATE_MATERIAL] || [];
	}, shallowEqual);

	useEffect(() => {
		if (updateMaterialRes?.success === true) {
			handleClose();
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				type: '',
				unit: '',
				quantity: '',
				notes: '',
			});
		}
	}, [updateMaterialRes?.success, dispatch]);

	const unit = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_UNIT_BY_PROJECT_ID]?.result || [];
	});
	useEffect(() => {
		if (unit?.length <= 0) {
			dispatch(getAllUnitByProjectId(project_id));
		}
	}, [unit?.length, dispatch]);

	const units = unit?.map((u) => {
		return { label: u.unit, value: u.unit };
	});
	const { update_material, type } = getSiteLanguageData(
		'material/components/editmaterial',
	);
	const { save } = getSiteLanguageData('commons');
	const { minimum_quantity, ph_minimum_quantity } = getSiteLanguageData('setting');
	return (
		<>
			<Button className="btn-blue" onClick={handleShow}>
				<img alt="livefield" src="/images/edit-white.svg" width="15px" />
			</Button>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_material?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEditMaterial}>
						<div className="row p-3">
							<div className="col-sm-5 mt-2 ">
								<Form.Label htmlFor="templatename">{type?.text}</Form.Label>
							</div>

							<div className="col-sm-12 mt-2">
								<InputGroup className="mb-3">
									<FormControl
										placeholder="Enter type"
										type="text"
										name="type"
										autoComplete="off"
										onChange={(e) => handleChange('type', e.target.value)}
										value={info.type}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12 ">
								<Form.Label htmlFor="templatename">{unit?.text}</Form.Label>
							</div>

							<CustomSelect
								placeholder="Unit..."
								name="unit"
								onChange={(e) => handleChange('unit', e.value)}
								options={units}
								value={units?.filter((u) => u.value === info.unit)}
							/>

							<div className="col-sm-12 mt-2 ">
								<Form.Label htmlFor="templatename">
									{minimum_quantity?.text}
								</Form.Label>
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_minimum_quantity?.text}
										type="text"
										name="minimum_quantity"
										autoComplete="off"
										onChange={(e) =>
											handleChange('minimum_quantity', e.target.value)
										}
										value={info.minimum_quantity}
										required
									/>
								</InputGroup>
							</div>

							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default EditMaterial;
