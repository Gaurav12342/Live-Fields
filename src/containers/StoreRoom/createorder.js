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
import { GET_ALL_MATERIAL_LIST, GET_VENDOR_LIST } from '../../store/actions/actionType';
import {
	createStoreRoomPO,
	getAllMaterialList,
} from '../../store/actions/storeroom';
import { addVendor, getVendorsList } from '../../store/actions/projects'
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import CreateNewMaterial from './createNewMaterial';
// import { createStoreRoom } from "../../store/actions/storeroom";

function CreateOrder(props) {
	const userId = getUserId();
	const { project_id, store_room_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [page, setPage] = useState(0);
	const handleClose = () => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			store_room_id: store_room_id,
			order_no: '',
			vendor: '',
			date_of_order: new Date(),
			expected_delivery_date: new Date(),
			delivery_date: '',
			items: [],
		});
		handleSelectedMaterial([]);
	};
	const handleShow = () => setShow(true);
	const [selectedMaterial, handleSelectedMaterial] = useState([]);
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		store_room_id: store_room_id,
		order_no: '',
		vendor: '',
		date_of_order: moment(new Date()).format('YYYY-MM-DD'),
		expected_delivery_date: moment(new Date()).format('YYYY-MM-DD'),
		delivery_date: '',
		items: [],
	});

	const handleChange = (name, value, k) => {
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
	const handleDelete = (m) => {
		const newArr = selectedMaterial.filter((item) => {
			return item.material_id !== m.material_id;
		});
		handleChangeMaterial(newArr);
	};

	const handleChangeMaterial = (value) => {
		handleSelectedMaterial(value);
	};

	const materialData = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [];
	});

	const vendorList = useSelector((state)=> state?.project?.[GET_VENDOR_LIST]?.result || [])

	useEffect(() => {
		if (materialData?.length <= 0) {
			dispatch(getAllMaterialList(project_id));
		}
	}, [materialData?.length, dispatch]);

	useEffect(()=>{
		getVendors();		
	}, []);

	const getVendors = () => {
		dispatch(getVendorsList(project_id,()=>{

		}));
	}

	const materials = materialData?.map((tl) => {
		return { label: tl.type, value: tl._id };
	});

	const submitStorePO = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(createStoreRoomPO({ ...info, items: selectedMaterial }));
		/* if (page === 0) {
			setPage(1);
		} else {
			
		} */
	};
	const {
		btn_create_order,
		purchase_order,
		order_no,
		vendor,
		date_of_order,
		expected_delivery_date,
		save,
		material,
		order_Details,
		order_qty,
		order_rate
	} = getSiteLanguageData('storeroom');
	const { cancel, select } = getSiteLanguageData('commons');
	return (
		<>
			<span
				className={props.className || 'lf-link-cursor lf-main-button '}
				tooltip={btn_create_order.tooltip}
				flow={btn_create_order.tooltip_flow}
				onClick={handleShow}>
				<i className="fas fa-plus"> </i> {btn_create_order?.text}
			</span>
			<Modal
				className="lf-modal"
				size={'md'}
				show={show}
				onHide={handleClose}
				animation={true}
				enforceFocus={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{purchase_order?.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitStorePO}>
						{/* {
              page === 1 ?
                <> */}
						<div className="row">
							<div className="col-sm-5">
								<Form.Label className="mb-0 fw-bold">
									{order_no?.text}
								</Form.Label>
							</div>
							<div className="col-sm-7">
								<InputGroup className="mb-1">
									<FormControl
										className="lf-formcontrol-height"
										placeholder={order_no.text}
										type="text"
										autoComplete="off"
										name="order_no"
										onChange={(e) => handleChange('order_no', e.target.value)}
										value={info?.order_no}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-5">
								<Form.Label className="mb-0 fw-bold">{vendor?.text}</Form.Label>
							</div>
							<div className="col-sm-7">
								<div className="mb-1 w-100">
									{/* <FormControl
										className="lf-formcontrol-height"
										placeholder="Name"
										type="text"
										name="vendor"
										autoComplete="off"
										onChange={(e) => handleChange('vendor', e.target.value)}
										value={info?.vendor}
										required
									/> */}
									<CustomSelect
										placeholder={`${vendor.text}...`}
										type="Creatable"
										moduleType="vendor_po"
										name="vendor"
										fullWidth
										onChange={(e) => {
											let fireHandleChange = true;
											if (e && e.__isNew__ && e.value) {
												fireHandleChange = false;
												dispatch(
													addVendor({
														user_id: userId,
														project_id: project_id,
														vendor_name: e.value,
													}, (newVendor) => {
														dispatch(getVendorsList(project_id,()=>{
															if (newVendor?.result?._id) {
																handleChange('vendor', newVendor?.result?._id);																
															}
														}));
														
													}),
												);
											}
											if (fireHandleChange) {
												handleChange('vendor', (e?.value) ? e?.value : "");
											}
										}}
										isSearchable={true}
										options={vendorList?.map((v)=>({label:v.vendor_name, value: v._id}))}
										value={vendorList?.find((v)=>v._id == info?.vendor)}
										isClearable={true}
										// onBlur={this.onBlurSubmit}
									/>
								</div>
							</div>
							<div className="form-group col-sm-5">
								<Form.Label className="mb-0 fw-bold">
									{date_of_order?.text}
								</Form.Label>
							</div>
							<div className="col-sm-7">
								<DatePicker
									customInput={
										<FormControl className="lf-formcontrol-height mb-1" />
									}
									name="date_of_order"
									selected={moment(info.date_of_order).toDate()}
									dateFormat="dd-MM-yyyy"
									placeholderText="Date of Order"
									onChange={(e) =>
										handleChange(
											'date_of_order',
											moment(e).format('YYYY-MM-DD'),
										)
									}
									minDate={moment(new Date()).toDate()}
								/>
							</div>
							<div className="form-group col-sm-5">
								<Form.Label className="mb-0 fw-bold">
									{expected_delivery_date?.text}
								</Form.Label>
							</div>
							<div className="col-sm-7">
								<DatePicker
									customInput={
										<FormControl className="lf-formcontrol-height" />
									}
									name="expected_delivery_date"
									selected={moment(info.expected_delivery_date).toDate()}
									dateFormat="dd-MM-yyyy"
									placeholderText="Date of Order"
									onChange={(e) =>
										handleChange(
											'expected_delivery_date',
											moment(e).format('YYYY-MM-DD'),
										)
									}
									minDate={moment(info?.date_of_order).toDate()}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-12 mt-3">
								<Form.Label>{order_Details?.text}</Form.Label>
								<CreateNewMaterial />
								<span className="float-end mx-2"> | </span>
								<OverlayTrigger
									trigger="click"
									placement="right-start"
									rootClose={true}
									overlay={
										<div
											style={{
												zIndex: '9999',
												width: '150px',
												maxHeight: '200px',
												overflow: 'auto',
												background: 'white',
											}}
											className="p-2 border">
											<ul className="p-0">
												{materials?.map((m, i) => {
													return (
														<li key={i}>
															<input
																type="checkbox"
																name="po_material"
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
														</li>
													);
												})}
											</ul>
										</div>
									}>
									<span className="float-end theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
										{select?.text}
									</span>
								</OverlayTrigger>
							</div>
							{selectedMaterial &&
								Array.isArray(selectedMaterial) &&
								selectedMaterial.length > 0 && (
									<div className="">
										<table className="table table-hover table-sm">
											<thead>
												<tr className="border-0">
													<th className="col-5 border-0">
														{material?.text}
													</th>
													<th className="col-3 border-0">
														{order_qty?.text}
													</th>
													<th className="col-3 border-0">
														{order_rate.text}
													</th>
													<th className="col-1 border-0"></th>
												</tr>
											</thead>
											<tbody className="border-0">
												{selectedMaterial?.map((ml, k) => {
													return (
														<tr key={k} className="col-12  ">
															<td className="border-0">
																<CustomSelect
																	menuPlacement="top"
																	placeholder={`${materials.text}...`}
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
															<td className="border-0">
																<InputGroup className="lf-formcontrol-height">
																	<FormControl
																		type="number"
																		pattern="[0-9]"
																		autoComplete="off"
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
															</td>
															<td className="border-0">																
																<InputGroup className="lf-formcontrol-height">
																	<FormControl
																		type="number"
																		pattern="[0-9]"
																		autoComplete="off"
																		name='order_unit_rate'
																		onChange={(e) =>
																			handleChangeItem(
																				'order_unit_rate',
																				e.target.value,
																				k,
																			)
																		}
																		placeholder={'Unit Rate'}
																		required
																	/>
																</InputGroup>																
															</td>
															<td className="text-secondary text-end align-middle border-0">
																<span className="">
																	<i
																		className="theme-bgcolor fas fa-trash-alt lf-link-cursor me-2"
																		onClick={() => handleDelete(ml)}></i>
																</span>
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								)}
						</div>
						{/* <div className="col-sm-12 mt-2">
                    <spanfaffg className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
                      + ISSUE NfEW
                    </span>
                  </div> */}
						<div className="col-sm-12 mt-2">
							<span>
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block m-1 show-verify float-end">
									<i className="fa-solid fa-floppy-disk pe-2"></i>
									{save?.text}
								</Button>
								<Button
									type="button"
									onClick={()=>handleClose()}
									variant="light"
									className="light-border btn-block m-1 show-verify  float-end">
									<i className="fa-solid fa-xmark pe-2"></i>
									{cancel?.text}
								</Button>
								
							</span>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default CreateOrder;
