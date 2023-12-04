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
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_MATERIAL_LIST,
	GET_STORE_ROOM_REQUEST_LIST,
} from '../../store/actions/actionType';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import {
	adjustmentStoreRoom,
	getAllMaterialList,
	getStoreRoomRequestList,
	getStoreRoomListByStoreRoomId,
	getStoreRoom,
	issueMaterialRequest,
} from '../../store/actions/storeroom';
import { getParameterByName } from '../../helper';
import CustomDate from '../../components/CustomDate';
import CreateNewMaterial from './createNewMaterial';
import CreateNewUnit from './createNewUnit';

function IssueMaterial() {
	const userId = getUserId();
	const { project_id, store_room_id } = useParams();
	const selectDate = getParameterByName('store_room_log_date');
	const dispatch = useDispatch();

	const [show, setShow] = useState(false);
	const [entryType, handleEntryType] = useState('issue');
	const [selectedMaterial, handleSelectedMaterial] = useState([]);
	const [materialSearch, setMaterialSearch] = useState('');

	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		store_room_id: store_room_id,
		issue_date: moment(selectDate).format('YYYY-MM-DD'),
		location_id: '',
		items: [],
	});

	const materialData = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [];
	});
	const storeLocation = useSelector((state) => {
		return state?.storeroom?.[GET_STORE_ROOM_REQUEST_LIST]?.result || [];
	});

	useEffect(() => {
		if (storeLocation?.length <= 0) {
			dispatch(getStoreRoomRequestList(store_room_id, selectDate));
		}
	}, [storeLocation?.length, dispatch, show]);

	useEffect(() => {
		if (materialData?.length <= 0) {
			dispatch(getAllMaterialList(project_id));
		}
	}, [materialData?.length, dispatch, show]);

	const materials = materialData?.map((tl) => {
		return { label: tl.type, value: tl._id, quantity: '' };
	});
	const location = storeLocation?.map((tg) => {
		return { label: tg.name, value: tg._id };
	});

	const submitIssueRequest = (e) => {
		e.preventDefault();

		dispatch(issueMaterialRequest({ ...info, items: selectedMaterial }));
		setTimeout(() => {
			dispatch(getStoreRoomRequestList(store_room_id, selectDate));
			dispatch(getStoreRoomListByStoreRoomId(store_room_id, selectDate));
			dispatch(getStoreRoom(project_id));
			handleClose();
		}, 2000);
	};
	const submitAdjustment = (e) => {
		e.preventDefault();
		const post = {
			user_id: userId,
			store_room_id,
			project_id,
			adjustment_date: moment(selectDate).format('YYYY-MM-DD'),
			items: selectedMaterial.map((m) => ({
				material_id: m.material_id,
				quantity: m.quantity,
				notes: m.notes,
			})),
		};
		dispatch(adjustmentStoreRoom(post));
		handleClose();
	};

	const handleClose = () => {
		setShow(false);
		handleSelectedMaterial([]);
		handleEntryType('issue');
	};

	const handleChange = (name, value) => {
		setInfo({
			...info,
			[name]: value,
		});
	};

	const handleChangeItem = (name, val, k) => {
		const arr = selectedMaterial;
		arr[k] = {
			...arr[k],
			[name]: val,
		};
		handleChangeMaterial([...arr]);
	};

	const handleSingleChangeItem = (name, val, mlId, k) => {
		const arr = selectedMaterial;
		arr[k] = {
			...arr[k],
			material_id: mlId,
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
	const { btn_Issue, material, issued_qty, requested_qty } =
		getSiteLanguageData('storeroom');
	const { cancel, notes } = getSiteLanguageData('commons');
	const { issue } = getSiteLanguageData('task/update');
	const { adjustment, adjustment_qty } = getSiteLanguageData('material');

const quantityArray = [];

storeLocation
	?.filter((l) => l._id === info?.location_id)[0]
	?.requests?.forEach((ml, k) => {
		const materialType = ml?.materials?.type;
		const quantity = ml?.quantity - ml?.delivered_quantity;

		if (materialType) {
			const otherProperties = {
				...ml,
			};

			const existingType = quantityArray.find(
				(item) => item.type === materialType,
			);
			if (existingType) {
				existingType.totalRequestedQty += quantity;
				existingType.otherProperties = {
					...existingType.otherProperties,
					...otherProperties,
				};
			} else {
				const newItem = {
					type: materialType,
					totalRequestedQty: quantity,
					...otherProperties,
				};
				quantityArray.push(newItem);
			}
		}
	});

	
	return (
		<>
			<span
				className="theme-secondary border-0 theme-btnbg btn"
				onClick={() => setShow(true)}>
				{btn_Issue?.text}
			</span>
			<Modal
				className="lf-modal"
				size={'lg'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>Add Entry</Modal.Title>
				</Modal.Header>
				<Modal.Body className={`model-add-entry`}>
					<Form>
						{/* <div className="row">
							<div>
								<span className="col-sm-10">Entry type</span>
								<span className="float-end me-2">
									
								</span>
							</div>
						</div> */}
						<div className="row">
							<div className={`col-sm-12 col-lg-4 model-side-bar px-0`}>
								<div className="border-bottom py-2 ps-3">
									<label
										className={`radio-orange ps-3 fs-5 mb-0 ${
											entryType == 'issue' ? 'theme-color' : ''
										}`}>
										{issue.text}
										<input
											type="radio"
											name="issuematerial"
											value={'issue'}
											onChange={(e) => handleEntryType(e.target.value)}
											defaultChecked
										/>
										{/* <span className="radiokmark"></span> */}
									</label>
									<div
										className={`mb-3 px-3 ${
											entryType == 'issue' ? '' : 'd-none'
										}`}>
										{/* <Form.Label className='mb-0'>Location</Form.Label> */}
										<CustomSelect
											placeholder="Location..."
											name="location_id"
											onChange={(e) => handleChange('location_id', e.value)}
											options={location}
											value={location?.filter(
												(l) => l.value === info?.location_id,
											)}
										/>

										{/* <ul className="p-0">
											{location?.map((m, i) => {
												return (
													<li key={i}>
														<input
															type="checkbox"
															name="location_id"
															onChange={(e) => {

																if (e.target.checked) {
																	
																	handleChange('location_id', m.value);
																}else{
																	handleChange('location_id', null);
																} 
															}}
															checked={info?.location_id == m.value}
														/>{' '}
														{m.label}
													</li>
												);
											})}
										</ul> */}
									</div>
								</div>
								<div className="py-2 ps-3">
									<div>
										<label
											className={`radio-orange ps-3 fs-5 mb-1 ${
												entryType == 'adjustment' ? 'theme-color' : ''
											}`}>
											{adjustment.text}
											<input
												type="radio"
												name="issuematerial"
												onChange={(e) => handleEntryType(e.target.value)}
												value={'adjustment'}
											/>
											{/* <span className="radiokmark"></span> */}
										</label>
									</div>
									{entryType === 'adjustment' && (
										<div
											className={`p-2 border ps-3`}
											style={{
												width: '220px',

												background: 'white',
												margin: '0 10px',
												borderRadius: '5px',
											}}>
											<InputGroup className="toolbar-search border-bottom">
												<InputGroup.Text>
													<i className="fas fa-search"></i>
												</InputGroup.Text>
												<input
													type="text"
													className="d-block form-control bg-transparent border border-0"
													placeholder="Search"
													onBlur={(e) => setMaterialSearch(e.target.value)}
													value={materialSearch}
													onChange={(e) => {
														setMaterialSearch(e.target.value);
													}}
												/>
											</InputGroup>
											<ul className="p-0 material-box">
												{materials
													?.filter((it) => {
														return (
															(materialSearch &&
																it.label
																	.toLowerCase()
																	.includes(materialSearch.toLowerCase())) ||
															materialSearch == ''
														);
													})
													?.map((m, i) => {
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
											{/* <CreateNewMaterial><div className='text-center pointer font-bold theme-color'>+ Add</div></CreateNewMaterial> */}
											{/* <div className='text-center'>
													<CreateNewMaterial><span className='text-center pointer font-bold theme-color'>+ Material</span></CreateNewMaterial> | <CreateNewUnit><span className='text-center pointer font-bold theme-color'>+ Unit</span></CreateNewUnit>
												</div> */}
										</div>
									)}
								</div>
							</div>

							<div
								className={`col-sm-12 col-lg-8 py-2 d-flex flex-column`}
								style={{ minHeight: '300px' }}>
								{entryType === 'issue' ? (
									<>
										{/* <div className="row">
											<Form.Label>Location</Form.Label>
											<CustomSelect
												className="col-sm-5"
												placeholder="Location..."
												name="location_id"
												onChange={(e) => handleChange('location_id', e.value)}
												options={location}
												value={location?.filter(
													(l) => l.value === info?.location_id,
												)}
											/>
										</div> */}
										<div className={`row`}>
											<div className="col-sm-12">
												<Form.Label className="mb-0" htmlFor="">
													{issued_qty.text}
												</Form.Label>
												<span className="float-end">
													<CustomDate date={selectDate} />
												</span>
												<table className="table white-table">
													<thead>
														<tr className="bg-light text-nowrap text-capitalize">
															<th>{material.text}</th>
															<th>{requested_qty.text}.</th>
															<th>{issued_qty.text}.</th>
															<th>{notes.text}</th>
														</tr>
													</thead>
													<tbody>

													{quantityArray?.map((ml, k) => {
																return (
																	<tr key={k}>
																		<td>
																			<span>
																				{ml?.materials?.type}(
																				{ml?.materials?.unit})
																			</span>
																		</td>
																		<td>
																			<span>
																				{ml?.totalRequestedQty}
																			</span>
																		</td>
																		<td>
																			<InputGroup>
																				<FormControl
																					placeholder={`${issued_qty.text}...`}
																					type="text"
																					name="quantity"
																					autoComplete="off"
																					style={{ height: '38px' }}
																					onChange={(e) =>
																						handleSingleChangeItem(
																							'quantity',
																							e.target.value,
																							ml?.materials?._id,
																							k,
																						)
																					}
																					required
																				/>
																			</InputGroup>
																		</td>
																		<td>
																			<InputGroup>
																				<FormControl
																					placeholder={`${notes.text}...`}
																					type="text"
																					name="notes"
																					autoComplete="off"
																					style={{ height: '38px' }}
																					onChange={(e) =>
																						handleSingleChangeItem(
																							'notes',
																							e.target.value,
																							ml?.materials?._id,
																							k,
																						)
																					}
																					required
																				/>
																			</InputGroup>
																		</td>
																	</tr>
																);
															})}





														{/* {storeLocation
															?.filter((l) => l._id === info?.location_id)[0]
															?.requests?.map((ml, k) => {
																return (
																	<tr key={k}>
																		<td>
																			<span>
																				{ml?.materials?.type}(
																				{ml?.materials?.unit})
																			</span>
																		</td>
																		<td>
																			<span>
																				{ml?.quantity - ml?.delivered_quantity}
																			</span>
																		</td>
																		<td>
																			<InputGroup>
																				<FormControl
																					placeholder={`${issued_qty.text}...`}
																					type="text"
																					name="quantity"
																					autoComplete="off"
																					style={{ height: '38px' }}
																					onChange={(e) =>
																						handleSingleChangeItem(
																							'quantity',
																							e.target.value,
																							ml?.materials?._id,
																							k,
																						)
																					}
																					required
																				/>
																			</InputGroup>
																		</td>
																		<td>
																			<InputGroup>
																				<FormControl
																					placeholder={`${notes.text}...`}
																					type="text"
																					name="notes"
																					autoComplete="off"
																					style={{ height: '38px' }}
																					onChange={(e) =>
																						handleSingleChangeItem(
																							'notes',
																							e.target.value,
																							ml?.materials?._id,
																							k,
																						)
																					}
																					required
																				/>
																			</InputGroup>
																		</td>
																	</tr>
																);
															})} */}
													</tbody>
												</table>
											</div>
										</div>
										<div className={`row mt-auto align-self-end`}>
											<div className="col-sm-12 text-end mb-2">
												<Button
													type="reset"
													variant="light"
													onClick={() => handleClose()}
													className="light-border btn-block my-1 show-verify">
													{cancel?.text}
												</Button>
												<Button
													type="submit"
													className="btn btn-primary theme-btn btn-block my-1 ms-3 show-verify"
													onClick={submitIssueRequest}>
													{issue.text}
												</Button>
											</div>
										</div>
									</>
								) : (
									<>
										<div className={`row`}>
											<div className="col-sm-12">
												<Form.Label className="mb-0" htmlFor="">
													{adjustment_qty.text}
												</Form.Label>
												<span className="float-end">
													<CustomDate date={selectDate} />
												</span>
												<table className="table white-table">
													<thead>
														<tr className="bg-light text-nowrap text-capitalize">
															<th>{material.text}</th>
															<th>{adjustment_qty.text}</th>
															<th>{notes.text}</th>
														</tr>
													</thead>
													<tbody>
														{selectedMaterial?.map((ml, k) => {
															return (
																<tr key={k} className="col-12">
																	<td className="col-4">
																		<span>
																			<CustomSelect
																				placeholder={`${material.text}...`}
																				name="material_id"
																				menuPlacement="top"
																				onChange={(e) =>
																					handleChangeItem(
																						'material_id',
																						e.value,
																						k,
																					)
																				}
																				options={materials}
																				// value={materials?.filter(m => m.value === ml.value)}
																				value={materials?.filter(
																					(m) =>
																						String(m.value) ===
																						String(ml.material_id),
																				)}
																			/>
																		</span>
																	</td>
																	<td className="col-4">
																		<span>
																			<InputGroup className="">
																				<FormControl
																					type="number"
																					autoComplete="off"
																					style={{ height: '38px' }}
																					onChange={(e) =>
																						handleChangeItem(
																							'quantity',
																							e.target.value,
																							k,
																						)
																					}
																					placeholder={'Quantity'}
																					required
																				/>
																			</InputGroup>
																		</span>
																	</td>
																	<td className="text-start col-4">
																		<span>
																			<InputGroup className="">
																				<FormControl
																					type="text"
																					autoComplete="off"
																					style={{ height: '38px' }}
																					onChange={(e) =>
																						handleChangeItem(
																							'notes',
																							e.target.value,
																							k,
																						)
																					}
																					placeholder={'Notes'}
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
										</div>

										<div className="row mt-auto align-self-end">
											<div className="col-sm-12 text-end mb-2">
												<Button
													type="reset"
													variant="light"
													onClick={() => handleClose()}
													className="light-border btn-block btn-block my-1 show-verify me-3">
													{cancel?.text}
												</Button>
												<Button
													type="submit"
													className="btn btn-primary theme-btn btn-block my-1 show-verify"
													onClick={submitAdjustment}>
													{adjustment.text}
												</Button>
											</div>
										</div>
									</>
								)}
							</div>
						</div>

						{/* <span className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
							+ ISSUE MATERIAL
						</span> */}
						{/* <div className="col-sm-12 mt-2">
							<span className="float-end">
								{entryType === 'issue' ? (
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block my-1 show-verify"
										onClick={submitIssueRequest}>
										Issue
									</Button>
								) : (
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block my-1 show-verify"
										onClick={submitAdjustment}>
										Adjustment
									</Button>
								)}
								
							</span>
						</div> */}
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default IssueMaterial;
