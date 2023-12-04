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
import { createUnit } from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';

function CreateNewMaterial(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		unit: ''
		
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
	const submitUnit = (e) => {
		e.preventDefault();
		dispatch(createUnit(info, (rsData)=>{
			setInfo({
				...info,
				'unit': '',
			});
		}));
	};
	const { name, create } = getSiteLanguageData('commons');
	const { add } = getSiteLanguageData('task/update');
	const {
		btn_material,
		create_material,
		unit_name,
		please_select_unit,
		minimum_quantity,
	} = getSiteLanguageData('storeroom');
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
								<Form.Label className="mb-0">{unit_name.text}</Form.Label>
							</div>
							<div className="col-sm-12">
								<FormControl
									placeholder={`Enter ${unit_name.text} name`}
									type="text"
									name="unit"
									autoComplete="off"
									className="lf-formcontrol-height"
									onChange={(e) => handleChange('unit', e.target.value)}
									value={info.unit}
									required
								/>
							</div>
							
							<div className="col-12">
								<Button
									onClick={submitUnit}
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
							{add.text}
						</span>
					)
				}
				
			</OverlayTrigger>
		</>
	);
}
export default CreateNewMaterial;
