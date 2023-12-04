import { useEffect, useState } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Dropdown,
} from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_UNIT_BY_PROJECT_ID } from '../../store/actions/actionType';
import { getAllUnitByProjectId } from '../../store/actions/storeroom';
import { createMaterial } from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';

function CreateMaterial(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			type: '',
			unit: '',
			minimum_quantity: '',
			notes: '',
		});
	};
	const handleShow = () => setShow(true);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		type: '',
		unit: '',
		minimum_quantity: '',
		notes: '',
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
		if (info?.unit === '') {
			setInfo({ unit: 'undefine' });
		} else {
			handleClose();
			dispatch(createMaterial(info));
		}
	};
	const {
		btn_material,
		create_material,
		unit_name,
		please_select_unit,
		minimum_quantity,
	} = getSiteLanguageData('storeroom');
	const { name, create,ph_name } = getSiteLanguageData('commons');
	return (
		<>
			{props.type === 'core' ? (
				<span
					tooltip={btn_material.tooltip}
					flow={btn_material.tooltip_flow}
					className="theme-secondary lf-common-btn btn"
					style={
						props?.isDisabled === true
							? { pointerEvents: 'none', opacity: '0.9' }
							: { opacity: '1' }
					}
					onClick={handleShow}>
					<i className="fas fa-plus px-1"></i>
					{btn_material?.text}
				</span>
			) : (
				<Dropdown.Item className="lf-layout-profile-menu" onClick={handleShow}>
					{create_material?.text}
				</Dropdown.Item>
			)}
			<Modal
				className="lf-modal"
				size={'sm'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{create_material?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitMaterial}>
						<div className="row p-3 ">
							<div className="col-sm-12">
								<Form.Label className="mb-0">{name?.text}</Form.Label>
							</div>
							<div className="col-sm-12">
								<InputGroup>
									<FormControl
										placeholder={ph_name.text}
										type="text"
										name="type"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={(e) => handleChange('type', e.target.value)}
										value={info.type}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{unit_name?.text}</Form.Label>
							</div>
							<div className="col-sm-12 ">
								<CustomSelect
									placeholder={`${unit_name.text}s...`}
									name="unit"
									onChange={(e) => handleChange('unit', e.value)}
									options={units}
								/>
								{info?.unit === 'undefine' ? (
									<span className="text-danger">
										{please_select_unit?.text}
									</span>
								) : (
									''
								)}
							</div>

							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">
									{minimum_quantity?.text}
								</Form.Label>
								<InputGroup>
									<FormControl
										placeholder={minimum_quantity.text}
										type="number"
										pattern="[0-9]"
										name="minimum_quantity"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={(e) =>
											handleChange('minimum_quantity', e.target.value)
										}
										value={info.minimum_quantity}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-12">
								<Button
									type="submit"
									className="btn btn-primary mt-3 ms-3 float-end theme-btn btn-block show-verify">
									<i className="fa fa-plus pe-1"></i>
									{create?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateMaterial;
