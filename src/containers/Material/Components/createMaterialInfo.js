import { useEffect, useState } from 'react';
import { Modal, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import Select from 'react-select';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import {
	GET_ALL_UNIT,
	UPDATE_MATERIAL,
} from '../../../store/actions/actionType';
import { updateMaterial } from '../../../store/actions/storeroom';
import { getAllUnit } from '../../../store/actions/storeroom';
import CustomSelect from '../../../components/SelectBox';

function MaterialInfoDetails(props) {
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
		return state?.storeroom?.[GET_ALL_UNIT]?.result || [];
	});
	useEffect(() => {
		if (unit?.length <= 0) {
			dispatch(getAllUnit());
		}
	}, [unit?.length, dispatch]);

	const units = unit?.map((u) => {
		return { label: u.unit, value: u.unit };
	});
	const { save } = getSiteLanguageData('commons');
	const { material_info, info_n } = getSiteLanguageData(
		'material/components/creatematerialinfo',
	);
	return (
		<>
			<span
				className="lf-common-btn theme-secondary float-end"
				onClick={handleShow}>
				{info_n?.text}
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{material_info?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitEditMaterial}>
						<div className="row p-3">
							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 float-end show-verify">
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
export default MaterialInfoDetails;
