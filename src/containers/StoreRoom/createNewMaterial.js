import { useEffect, useState } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	Dropdown,
	OverlayTrigger,
} from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_ALL_UNIT_BY_PROJECT_ID } from '../../store/actions/actionType';
import { getAllUnitByProjectId } from '../../store/actions/storeroom';
import { createMaterial } from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';

function CreateNewMaterial(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
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
		dispatch(createMaterial(info));
	};
	const {
		unit_name,
		minimum_quantity,
	} = getSiteLanguageData('storeroom');
	const { name, create,ph_name } = getSiteLanguageData('commons');
	return (
		<>
			<OverlayTrigger
				trigger="click"
				placement="right-start"
				// onExit={setEditing.bind(this) }
				rootClose={true}
				// show={editing}
				overlay={
					<div
						style={{
							zIndex: '9999',
							width: '300px',
							maxHeight: '300px',
							background: 'white',
						}}
						className="p-2 border">
						<div className="row p-3 ">
							<div className="col-sm-12">
								<Form.Label className="mb-0">{name?.text}</Form.Label>
							</div>
							<div className="col-sm-12">
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
							</div>

							<div className="col-sm-12 mt-1">
								<Form.Label className="mb-0">{minimum_quantity?.text}</Form.Label>
								<FormControl
									placeholder={minimum_quantity.text}
									type="number"
									pattern="[0-9]"
									autoComplete="off"
									name="minimum_quantity"
									className="lf-formcontrol-height"
									onChange={(e) =>
										handleChange('minimum_quantity', e.target.value)
									}
									value={info.minimum_quantity}
									required
								/>
							</div>
							<div className="col-12">
								<Button
									onClick={submitMaterial}
									type="submit"
									className="btn btn-primary mt-3 float-end theme-btn btn-block show-verify">
									<i className="fa fa-plus pe-1"></i>
									{create?.text}
								</Button>
							</div>
						</div>
					</div>
				}>
				{
					props.children ? (
						props.children
					) : (
						<span className="float-end theme-btnbg theme-secondary rounded  lf-link-cursor theme-btnbold">
							{create?.text}
						</span>
					)
				}
				
			</OverlayTrigger>
		</>
	);
}
export default CreateNewMaterial;
