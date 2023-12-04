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
import {
	GET_ALL_MATERIAL_LIST,
	GET_ALL_UNIT_BY_PROJECT_ID,
} from '../../store/actions/actionType';
import {
	getAllMaterialList,
	updateMaterial,
} from '../../store/actions/storeroom';
import { getAllUnitByProjectId } from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';

function UpdateMaterial(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			material_id: '',
			type: '',
			unit: '',
			minimum_quantity: '',
			notes: '',
		});
		setSingleMaterial('');
	};
	const handleShow = () => setShow(true);
	const materialData = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [];
	});
	useEffect(() => {
		if (materialData?.length <= 0) {
			dispatch(getAllMaterialList(project_id));
		}
	}, [materialData?.length, dispatch]);
	const [singleMaterial, setSingleMaterial] = useState();
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		material_id: '',
		type: '',
		unit: '',
		minimum_quantity: '',
		notes: '',
	});
	const mat = materialData?.filter((m) => m._id === singleMaterial);
	useEffect(() => {
		if (mat?.length === 1 && info?.material_id !== mat[0]?._id) {
			setInfo({
				...info,
				user_id: userId,
				project_id: project_id,
				material_id: mat[0]?._id,
				type: mat[0]?.type,
				unit: mat[0]?.unit,
				minimum_quantity: mat[0]?.minimum_quantity,
				notes: mat[0]?.note,
			});
		}
	}, [mat, info]);
	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitEditMaterial = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(updateMaterial(info, props?.store_room_id, props?.date));
	};
	const materials = materialData?.map((tg) => {
		return { label: tg.type, value: tg._id };
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

	const { update_material } = getSiteLanguageData(
		'material/components/editmaterial',
	);

	const { ph_selectMaterial } = getSiteLanguageData('material');
	const { name,save } = getSiteLanguageData('commons');
	const { manage_unit,minimum_quantity } = getSiteLanguageData('setting');

	return (
		<>
			<Dropdown.Item className="lf-layout-profile-menu" onClick={handleShow}>
				{update_material.text}
			</Dropdown.Item>
			<Modal
				className="lf-modal"
				size={'sm'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{update_material.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEditMaterial}>
						<div className="row p-3 ">
							<div className="col-sm-12">
								<Form.Label className="mb-0">{ph_selectMaterial.text}</Form.Label>
								<CustomSelect
									onChange={(e) => setSingleMaterial(e.value)}
									placeholder={ph_selectMaterial.text}
									options={materials}
									required
								/>
							</div>
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0" htmlFor="templatename">
									{name.text}
								</Form.Label>
							</div>

							<div className="col-sm-12">
								<InputGroup>
									<FormControl
										placeholder={`Enter ${name.text}`}
										type="text"
										name="type"
										className="lf-formcontrol-height"
										autoComplete="off"
										onChange={(e) => handleChange('type', e.target.value)}
										value={info?.type}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0" htmlFor="templatename">
									{manage_unit.text}
								</Form.Label>
							</div>

							<CustomSelect
								placeholder={`${manage_unit.text}...`}
								name="unit"
								onChange={(e) => handleChange('unit', e.value)}
								options={units}
								value={units?.filter((u) => u.value === info?.unit)}
							/>

							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0" htmlFor="templatename">
									{minimum_quantity.text}
								</Form.Label>
								<InputGroup>
									<FormControl
										placeholder="Enter text"
										type="number"
										pattern="[0-9]"
										name="minimum_quantity"
										autoComplete="off"
										className="lf-formcontrol-height"
										onChange={(e) =>
											handleChange('minimum_quantity', e.target.value)
										}
										value={info?.minimum_quantity}
										required
									/>
								</InputGroup>
							</div>

							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 float-end show-verify">
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
export default UpdateMaterial;
