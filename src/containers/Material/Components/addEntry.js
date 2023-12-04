import { useEffect, useState } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	OverlayTrigger,
} from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import {
	GET_ALL_MATERIAL_LIST,
	GET_ALL_UNIT,
	GET_MATERIAL_DETAILS_BY_ID,
} from '../../../store/actions/actionType';
import CustomSelect from '../../../components/SelectBox';
import {
	adjustmentMaterial,
	consumptionMaterial,
	createMaterial,
	getAllMaterialList,
	getAllUnitByProjectId,
	requestMaterial,
} from '../../../store/actions/storeroom';
import moment from 'moment';
import { getParameterByName } from '../../../helper';
import CreateNewMaterial from '../../StoreRoom/createNewMaterial';
import CreateNewUnit from '../../StoreRoom/createNewUnit';

function AddEntry(props) {
	const userId = getUserId();
	const { project_id, material_id } = useParams();
	const date = getParameterByName('material_date');
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		handleSelectedMaterial([]);
		handleMaterial('consumption');
	};
	const handleShow = () => setShow(true);
	const [material, handleMaterial] = useState('consumption');
	const [materialSearch, setMaterialSearch] = useState('');
	const [selectedMaterial, handleSelectedMaterial] = useState([]);
	const [editing, setEditing] = useState(true);
	
	const [store_room_id, setStoreRoomId] = useState(null);
	const [location_id, setLocationId] = useState(null);
	
	
	const singleMaterial = useSelector((state) => {
		return state?.storeroom?.[GET_MATERIAL_DETAILS_BY_ID]?.result || [];
	});


	
	
	const [consuptionInfo] = useState({
		user_id: userId,
		material_log_id: material_id,
		consumption_date: moment(new Date(date)).format('YYYY-MM-DD'),
		material_date: date,
		items: [],
	});
	const [requestMaterialInfo, handleChangeMaterlaInfo] = useState({
		user_id: userId,
		store_room_id: store_room_id,
		location_id: location_id,
		date_of_order: date,
		project_id: project_id,
		material_log_id: material_id,
		items: [],
	});
	const [adjustmentInfo] = useState({
		user_id: userId,
		material_log_id: material_id,
		adjustment_date: moment(new Date(date)).format('YYYY-MM-DD'),
		material_date: date,
		items: [],
	});
	const materialData = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [];
	});
	useEffect(() => {
		if (materialData?.length <= 0) {
			dispatch(getAllMaterialList(project_id));
		}
		if(singleMaterial && singleMaterial.length > 0){
			setStoreRoomId(singleMaterial[0]?.store_room_id);
			setLocationId(singleMaterial[0]?.location_id);
		}
	}, [materialData?.length, singleMaterial, dispatch]);


	useEffect(()=>{
		setMaterialInfo();
	},[store_room_id])
	
	const setMaterialInfo = () => {
		handleChangeMaterlaInfo({
			user_id: userId,
			store_room_id: store_room_id,
			location_id: location_id,
			date_of_order: date,
			project_id: project_id,
			material_log_id: material_id,
			items: selectedMaterial,
		})
	}

	const materials = materialData?.map((tl) => {
		return { label: tl.type, value: tl._id, quantity: '' };
	});

	


	const handleChangeItem = (name, val, k) => {
		const arr = selectedMaterial;
		arr[k] = {
			...arr[k],
			[name]: val,
		};
		handleChangeMaterial([...arr]);
	};
	const handleDelete = (m) => {
		const newArr = selectedMaterial.filter((item) => {
			return item.material_id !== m.material_id;
		});
		handleChangeMaterial(newArr);
	};
	const handleChangeMaterial = (value) => {
		handleSelectedMaterial(value);
	};
	const submitConsuption = (e) => {
		e.preventDefault();
		handleClose();
		if (material === 'adjustment') {
			dispatch(
				adjustmentMaterial({ ...adjustmentInfo, items: selectedMaterial }),
			);
		} else if (material === 'request') {
			dispatch(
				requestMaterial({ ...requestMaterialInfo, items: selectedMaterial }),
			);
		} else {
			dispatch(
				consumptionMaterial({ ...consuptionInfo, items: selectedMaterial }),
			);
		}
	};
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		type: '',
		unit: '',
		minimum_quantity: '',
		notes: '',
	});
	const unit = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_UNIT]?.result || [];
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
		entry,
		btn_consumption,
		add_entry,
		requsted,
		adjustment,
		entry_type,
		adjustment_qty,
		material_text,
		order_qty,
		request_materials,
		consumption_qty,
		notes,
		save,
		cancel,
		ph_selectMaterial
	} = getSiteLanguageData('material');

	const { search } = getSiteLanguageData('commons');
	return (
		<>
			<span
				tooltip={entry.tooltip}
				flow={entry.tooltip_flow}
				style={
					props?.isDisabled === true
						? { pointerEvents: 'none', opacity: '0.9' }
						: { opacity: '1' }
				}
				className="theme-secondary lf-common-btn btn"
				onClick={handleShow}>
				<i className="fas fa-plus px-1"></i> {entry?.text}
			</span>
			<Modal
				className="lf-modal"
				size={'lg'}
				show={show}
				onHide={handleClose}
				animation={true}
				enforceFocus={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{add_entry?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body className={`model-add-entry`}>
					<Form onSubmit={submitConsuption}>
						<div className="row">
							<div className={`col-sm-4 model-side-bar px-0`}>
								<div className='border-bottom py-2 ps-3'>
									<div>
										<label className={`radio-orange ps-3 fs-5 mb-0 ${material == 'consumption' ? 'theme-color' : ''}`}>
											{btn_consumption?.text}
											<input
												type="radio"
												name="materials"
												value={'consumption'}
												onChange={(e) => handleMaterial(e.target.value)}
												defaultChecked
											/>
											{/* <span className="radiokmark"></span> */}
										</label>
									</div>
									{
										material === 'consumption' && (
											<div
												style={{
													width: '220px',
													background: 'white',
													margin: '0 10px',
													borderRadius: '5px',
												}}
												className="p-2 border">
												<InputGroup className="toolbar-search border-bottom">
													<InputGroup.Text>
														<i className="fas fa-search"></i>
													</InputGroup.Text>
													<input
														type="text"
														className="d-block form-control bg-transparent border border-0"
														placeholder={search?.text}
														onBlur={(e) =>
															setMaterialSearch(e.target.value)
														}
														value={materialSearch}
														onChange={(e) => {
															setMaterialSearch(e.target.value)
														}}
													/>
												</InputGroup>
												<ul className="p-0 material-box">
													{materials?.filter((it)=>{
														return (materialSearch && it.label.toLowerCase().includes(materialSearch.toLowerCase())) || materialSearch == '';
													})?.map((m, i) => {
														return (
															<li key={i}>
																<label>
																<input
																	type="checkbox"
																	name="po_material"
																	style={{
																		verticalAlign: 'middle',
																	}}
																	onChange={(e) => {
																		if (e.target.checked) {
																			const sm = [...selectedMaterial];
																			sm.push({
																				material_id: m.value,
																				quantity: 0,
																			});
																			handleChangeMaterial(sm);
																		} else {
																			handleDelete({
																				material_id: m.value,
																				quantity: 0,
																			});
																		}
																	}}
																	checked={selectedMaterial?.some(
																		(sm) => sm.material_id === m.value,
																	)}
																/>{' '}
																{m.label}
																</label>
															</li>
														);
													})}
												</ul>
												<div className='text-center'>
													<CreateNewMaterial><span className='text-center pointer font-bold theme-color'>+ Material</span></CreateNewMaterial> | <CreateNewUnit><span className='text-center pointer font-bold theme-color'>+ Unit</span></CreateNewUnit>
												</div>
												
											</div>
										)
									}
								</div>
								<div className='border-bottom py-2 ps-3'>
									<div>
										<label className={`radio-orange ps-3 fs-5 mb-0 ${material == 'request' ? 'theme-color' : ''} ${moment(new Date()).format('YYYY-MM-DD') != moment(new Date(date)).format('YYYY-MM-DD') ? 'disabled' : ''}`}>
											{requsted?.text}
											<input
												type="radio"
												name="materials"
												disabled={moment(new Date()).format('YYYY-MM-DD') != moment(new Date(date)).format('YYYY-MM-DD')}
												onChange={(e) => handleMaterial(e.target.value)}
												value={'request'}
											/>
											{/* <span className="radiokmark"></span> */}
										</label>
									</div>
									{
										material === 'request' && (
											<div
												style={{
													width: '220px',
													background: 'white',
													margin: '0 10px',
													borderRadius: '5px',
												}}
												className="p-2 border">
												<InputGroup className="toolbar-search border-bottom">
													<InputGroup.Text>
														<i className="fas fa-search"></i>
													</InputGroup.Text>
													<input
														type="text"
														className="d-block form-control bg-transparent border border-0"
														placeholder={search?.text}
														onBlur={(e) =>
															setMaterialSearch(e.target.value)
														}
														value={materialSearch}
														onChange={(e) => {
															setMaterialSearch(e.target.value)
														}}
													/>
												</InputGroup>
												<ul className="p-0 material-box">
													{materials?.filter((it)=>{
														return (materialSearch && it.label.toLowerCase().includes(materialSearch.toLowerCase())) || materialSearch == '';
													})?.map((m, i) => {
														return (
															<li key={i}>
																<label>
																<input
																	type="checkbox"
																	name="po_material"
																	style={{
																		verticalAlign: 'middle',
																	}}
																	onChange={(e) => {
																		if (e.target.checked) {
																			const sm = [...selectedMaterial];
																			sm.push({
																				material_id: m.value,
																				quantity: 0,
																			});
																			handleChangeMaterial(sm);
																		} else {
																			handleDelete({
																				material_id: m.value,
																				quantity: 0,
																			});
																		}
																	}}
																	checked={selectedMaterial?.some(
																		(sm) => sm.material_id === m.value,
																	)}
																/>{' '}
																{m.label}
																</label>
															</li>
														);
													})}
												</ul>
												<div className='text-center'>
													<CreateNewMaterial><span className='text-center pointer font-bold theme-color'>+ Material</span></CreateNewMaterial> | <CreateNewUnit><span className='text-center pointer font-bold theme-color'>+ Unit</span></CreateNewUnit>
												</div>
											</div>
										)
									}
								</div>
								<div className='border-bottom py-2 ps-3 mb-4'>
									<div>
										<label className={`radio-orange ps-3 fs-5 mb-0 ${material == 'adjustment' ? 'theme-color' : ''}`}>
											{adjustment?.text}
											<input
												type="radio"
												name="materials"
												onChange={(e) => handleMaterial(e.target.value)}
												value={'adjustment'}
											/>
											{/* <span className="radiokmark"></span> */}
										</label>
									</div>
									{
										material === 'adjustment' && (
											<div
												style={{
													width: '220px',
													background: 'white',
													margin: '0 10px',
													borderRadius: '5px',
												}}
												className="p-2 border">
												<InputGroup className="toolbar-search border-bottom">
													<InputGroup.Text>
														<i className="fas fa-search"></i>
													</InputGroup.Text>
													<input
														type="text"
														className="d-block form-control bg-transparent border border-0"
														placeholder={search?.text}
														onBlur={(e) =>
															setMaterialSearch(e.target.value)
														}
														value={materialSearch}
														onChange={(e) => {
															setMaterialSearch(e.target.value)
														}}
													/>
												</InputGroup>
												<ul className="p-0 material-box">
													{materials?.filter((it)=>{
														return (materialSearch && it.label.toLowerCase().includes(materialSearch.toLowerCase())) || materialSearch == '';
													})?.map((m, i) => {
														return (
															<li key={i}>
																<label>
																<input
																	type="checkbox"
																	name="po_material"
																	style={{
																		verticalAlign: 'middle',
																	}}
																	onChange={(e) => {
																		if (e.target.checked) {
																			const sm = [...selectedMaterial];
																			sm.push({
																				material_id: m.value,
																				quantity: 0,
																			});
																			handleChangeMaterial(sm);
																		} else {
																			handleDelete({
																				material_id: m.value,
																				quantity: 0,
																			});
																		}
																	}}
																	checked={selectedMaterial?.some(
																		(sm) => sm.material_id === m.value,
																	)}
																/>{' '}
																{m.label}
																</label>
															</li>
														);
													})}
												</ul>
												<div className='text-center'>
													<CreateNewMaterial><span className='text-center pointer font-bold theme-color'>+ Material</span></CreateNewMaterial> | <CreateNewUnit><span className='text-center pointer font-bold theme-color'>+ Unit</span></CreateNewUnit>
												</div>
											</div>
										)
									}
								</div>
							</div>
							{/* <div className="col-12">
								<span>{entry_type?.text}</span>
								<span className="float-end">
									{moment(new Date()).format('DD-MM-YYYY')}
								</span>
							</div> */}


							<div className="col-sm-8 py-3 d-flex flex-column">
								<div className={`row`}>
									<div className='col-12'>
										
										
										{material === 'adjustment' ? (
											<>
												<div>
													<Form.Label className="mb-0">
														{adjustment_qty?.text}													
													</Form.Label>
													<span style={{float:'right'}}>{moment(new Date()).format('DD-MM-YYYY')}</span>
												</div>
												
												
												
												<table className="table white-table">
													<thead
														className=""
														style={{ zIndex: '10' }}>
														<tr className="bg-light text-nowrap text-capitalize">
															<th>{material_text?.text}</th>
															<th>{order_qty?.text}</th>
															<th>{notes?.text}</th>
															{/* <th></th> */}
														</tr>
													</thead>
													<tbody>
														{selectedMaterial?.map((ml, k) => {
															return (
																<tr key={k} className="col-12">
																	<td className="col-4">
																		<CustomSelect
																			placeholder={ph_selectMaterial?.text}
																			name="material_id"
																			onChange={(e) =>
																				handleChangeItem('material_id', e.value, k)
																			}
																			options={materials}
																			value={materials?.filter(
																				(m) =>
																					String(m.value) ===
																					String(ml.material_id),
																			)}
																		/>
																	</td>
																	<td className="col-4">
																		<span>
																			<InputGroup>
																				<FormControl
																					type="number"
																					pattern="[0-9]"
																					autoComplete="off"
																					style={{height:'38px'}}
																					onChange={(e) =>
																						handleChangeItem(
																							'quantity',
																							e.target.value,
																							k,
																						)
																					}
																					placeholder={'Quantity..'}
																					required
																				/>
																			</InputGroup>
																		</span>
																	</td>
																	<td className="col-4">
																		<span>
																			<InputGroup>
																				<FormControl
																					type="text"
																					autoComplete="off"
																					style={{height:'38px'}}
																					onChange={(e) =>
																						handleChangeItem(
																							'notes',
																							e.target.value,
																							k,
																						)
																					}
																					placeholder={'Note..'}
																					required
																				/>
																			</InputGroup>
																		</span>
																	</td>
																	{/* <td className="text-start col-2">
																		<span className="float-end">
																			<i
																				className="theme-bgcolor fas fa-trash-alt lf-link-cursor me-2"
																				onClick={() => handleDelete(ml)}></i>
																		</span>
																	</td> */}
																</tr>
															);
														})}
													</tbody>
												</table>
												
											</>
										) : material === 'request' ? (
											<>
												<div className="col-sm-12">
													<Form.Label className="mb-0">
														{request_materials?.text}
													</Form.Label>
													<span style={{float:'right'}}>{moment(new Date()).format('DD-MM-YYYY')}</span>
												</div>
												<div className="">
													<table className="table white-table">
														<thead
															className="position-sticky top-0"
															style={{ zIndex: '10' }}>
															<tr className="bg-light text-nowrap text-capitalize">
																<th>{material_text?.text}</th>
																<th>{order_qty.text}</th>
															</tr>
														</thead>
														<tbody>
															{selectedMaterial?.map((ml, k) => {
																return (
																	<tr key={k} className="col-12">
																		<td className="col-5">
																			<span>
																				<CustomSelect
																					placeholder={ph_selectMaterial?.text}
																					name="material_id"
																					onChange={(e) =>
																						handleChangeItem(
																							'material_id',
																							e.value,
																							k,
																						)
																					}
																					options={materials}
																					value={materials?.filter(
																						(m) =>
																							String(m.value) ===
																							String(ml.material_id),
																					)}
																				/>
																			</span>
																		</td>
																		<td className="col-2">
																			<span>
																				<InputGroup className="">
																					<FormControl
																						type="number"
																						pattern="[0-9]"
																						autoComplete="off"
																						style={{height:'38px'}}
																						onChange={(e) =>
																							handleChangeItem(
																								'quantity',
																								e.target.value,
																								k,
																							)
																						}
																						placeholder={'Quantity..'}
																						required
																					/>
																				</InputGroup>
																			</span>
																		</td>
																		{/* <td className="text-start col-1">
																			<span className="float-end">
																				<i
																					className="theme-bgcolor fas fa-trash-alt lf-link-cursor me-2"
																					onClick={() => handleDelete(ml)}></i>
																			</span>
																		</td> */}
																	</tr>
																);
															})}
														</tbody>
													</table>
												</div>
											</>
										) : (
											<>
												<div className="col-sm-12">
													<Form.Label className="mb-0">
														{consumption_qty?.text}
													</Form.Label>
													<span style={{float:'right'}}>{moment(new Date()).format('DD-MM-YYYY')}</span>
												</div>
												<div className="">
													<table className="table white-table">
														<thead
															className="position-sticky top-0"
															style={{ zIndex: '10' }}>
															<tr className="col-12 bg-light text-nowrap text-capitalize">
																<th>{material_text?.text}</th>
																<th>{order_qty?.text}</th>
																<th>{notes?.text}</th>
															</tr>
														</thead>
														<tbody>
															{selectedMaterial?.map((ml, k) => {
																return (
																	<tr key={k} className="col-12">
																		<td className="col-4">
																			<CustomSelect
																				placeholder={ph_selectMaterial?.text}
																				name="material_id"
																				onChange={(e) =>
																					handleChangeItem('material_id', e.value, k)
																				}
																				options={materials}
																				value={materials?.filter(
																					(m) =>
																						String(m.value) ===
																						String(ml.material_id),
																				)}
																			/>
																		</td>
																		<td className="col-4">
																			<span>
																				<InputGroup className="">
																					<FormControl
																						type="number"
																						pattern="[0-9]"
																						autoComplete="off"
																						style={{height:'38px'}}
																						onChange={(e) =>
																							handleChangeItem(
																								'quantity',
																								e.target.value,
																								k,
																							)
																						}
																						placeholder={'Quantity..'}
																						required
																					/>
																				</InputGroup>
																			</span>
																		</td>
																		<td className="col-4">
																			<span>
																				<InputGroup className="">
																					<FormControl
																						type="text"
																						autoComplete="off"
																						style={{height:'38px'}}
																						onChange={(e) =>
																							handleChangeItem(
																								'notes',
																								e.target.value,
																								k,
																							)
																						}
																						placeholder={'Note..'}
																						required
																					/>
																				</InputGroup>
																			</span>
																		</td>
																		{/* <td className="text-start col-1">
																			<span className="float-end">
																				<i
																					className="theme-bgcolor fas fa-trash-alt lf-link-cursor me-2"
																					onClick={() => handleDelete(ml)}></i>
																			</span>
																		</td> */}
																	</tr>
																);
															})}
														</tbody>
													</table>
												</div>
											</>
										)}
									</div>
								</div>
								<div className={`row mt-auto align-self-end`}>
									<div className='col-12 text-end'>
										<Button
											type="reset"
											variant="light"
											onClick={()=>handleClose()}
											className="light-border btn-block my-1 show-verify">
											<i class="fa-solid fa-xmark pe-2"></i>
											{cancel?.text}
										</Button>
										<Button
											type="submit"
											className="btn btn-primary theme-btn btn-block my-1 ms-3 show-verify"
											onClick={submitConsuption}>
											{' '}
											<i class="fa-solid fa-floppy-disk pe-2"></i>
											{save?.text}
										</Button>
									</div>
								</div>
							</div>							
						</div>
						{/* <hr className="mt-0" style={{ width: '470px' }}></hr> */}
						
						
					</Form>
					{/* <div className="row">
						<div className="col-sm-12 p-2 ps-0">
							<span className="theme-btnbg theme-secondary rounded p-1 lf-link-cursor theme-btnbold">
								+ NEW
							</span>
						</div>
					</div> */}
					{/* <div className="row">
						<div className="col-sm-12">
							<span className="float-end">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify"
									onClick={submitConsuption}>
									{' '}
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save?.text}
								</Button>
								<Button
									type="reset"
									className="btn btn-primary theme-btn btn-block my-1 show-verify ms-3">
									<i class="fa-solid fa-xmark"></i>
									{cancel?.text}
								</Button>
							</span>
						</div>
					</div> */}
				</Modal.Body>
			</Modal>
		</>
	);
}
export default AddEntry;
