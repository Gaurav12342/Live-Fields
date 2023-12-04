import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import { GET_ALL_UNIT_BY_PROJECT_ID } from '../../../store/actions/actionType';
import { getAllUnitByProjectId } from '../../../store/actions/storeroom';
import {
	createMaterial,
	updateMaterial,
} from '../../../store/actions/storeroom';
import CustomSelect from '../../../components/SelectBox';

function AddMaterial(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = (e) => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			material_id: props?.data?._id,
			type: props?.data?.type || '',
			unit: props?.data?.unit || '',
			minimum_quantity: props?.data?.minimum_quantity || '',
			notes: props?.data?.notes || '',
		});
	};
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		material_id: props?.data?._id,
		type: props?.data?.type || '',
		unit: props?.data?.unit || '',
		minimum_quantity: props?.data?.minimum_quantity || '',
		notes: props?.data?.notes || '',
	});
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
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitMaterial = (e) => {
		e.preventDefault();
		handleClose();
		if (props?.data) {
			dispatch(updateMaterial(info));
		} else {
			dispatch(createMaterial(info));
		}
	};
	const {
		add_Material,
		type,
		unit_name,
		minimum_quantity,
		ph_minimum_quantity,
		icon_edit,
		add_material,
		material_name,
		ph_material_name,
		ph_selectUnit
	} = getSiteLanguageData('setting');
	return (
		<>
			{props?.data ? (
				<span
					className="float-end"
					tooltip={icon_edit.tooltip}
					flow={icon_edit.tooltip_flow}>
					<i
						className="fas fa-edit  me-3 mt-2 theme-btnbg theme-secondary"
						onClick={handleShow}></i>
				</span>
			) : props?.className ? (
				<span
					className={props?.className}
					tooltip={add_Material.tooltip}
					flow={add_Material.tooltip_flow}
					onClick={handleShow}>
					<i className={'fas fa-plus'} /> {add_Material?.text}
				</span>
			) : (
				<Button className="btn theme-btn float-end" onClick={handleShow}>
					{add_material?.text}
				</Button>
			)}
			<Modal
				className="lf-modal"
				size={'md'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>
						{props?.data ? 'Update Material' : 'Create Material'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitMaterial}>
						<div className="row p-3 ">
							<div className="col-sm-12 mt-2 ">
								<Form.Label htmlFor="templatename" className="mb-0">
								{material_name?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup className="mb-2">
									<FormControl
										placeholder={ph_material_name?.text}
										type="text"
										autoComplete="off"
										name="type"
										onChange={(e) => handleChange('type', e.target.value)}
										value={info.type}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12">
								<Form.Label htmlFor="templatename" className="mb-0">
									{unit_name?.text}
								</Form.Label>
							</div>

							<div className="col-sm-12 ">
								<CustomSelect
									placeholder={ph_selectUnit?.text}
									name="unit"
									onChange={(e) => handleChange('unit', e.value)}
									options={units}
									value={units?.filter((u) => u.value === info.unit)}
								/>
							</div>

							<div className="col-sm-12 mt-2 ">
								<Form.Label htmlFor="templatename" className="mb-0">
									{minimum_quantity?.text}
								</Form.Label>
								<InputGroup className="mb-3">
									<FormControl
										placeholder={ph_minimum_quantity?.text}
										type="number"
										pattern="[0-9]"
										autoComplete="off"
										name="minimum_quantity"
										onChange={(e) =>
											handleChange('minimum_quantity', e.target.value)
										}
										value={info.minimum_quantity}
										required
									/>
								</InputGroup>
							</div>
							<div className="row">
								<Button
									type="submit"
									className="btn btn-primary my-1 ms-3 theme-btn btn-block show-verify">
									{props?.data ? 'Update Material' : 'Create Material'}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default AddMaterial;
