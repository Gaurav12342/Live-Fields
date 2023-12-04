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
	GET_SINGLE_PO_DETAILS,
} from '../../store/actions/actionType';
import {
	createStoreRoomPO,
	getAllMaterialList,
	getSinglePoDDetails,
	updateStoreRoomPO,
} from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import DatePicker from 'react-datepicker';
// import { createStoreRoom } from "../../store/actions/storeroom";

function CreateOrder(props) {
	const userId = getUserId();
	const { project_id, store_room_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setInfo({
			user_id: userId,
			project_id: project_id,
			store_room_id: store_room_id,
			store_room_order_id: '',
			items: [],
		});
		handleSelectedMaterial([]);
	};
	const handleShow = () => setShow(true);
	const [selectedMaterial, handleSelectedMaterial] = useState([]);
	const [item, setItem] = useState([]);
	const poData = useSelector((state) => {
		return state?.storeroom?.[GET_SINGLE_PO_DETAILS]?.result || [];
	});
	const [info, setInfo] = useState({
		user_id: userId,
		project_id: project_id,
		store_room_id: store_room_id,
		store_room_order_id: props?.data,
		items: [],
	});

	const handleChange = (name, value, k) => {
		setInfo({
			...info,
			[name]: value,
		});
	};
	const handleChangeItem = (name, val, k) => {
		const arr = item.filter((file) => {
			return file !== val;
		});
		arr[k] = {
			...arr[k],
			[name]: val,
		};
		setItem([...arr]);
	};
	const handleDelete = (m) => {
		const newArr = selectedMaterial.filter((item) => {
			return item.value !== m.value;
		});
		handleChangeMaterial(newArr);
	};
	const handleChangeMaterial = (value) => {
		handleSelectedMaterial(value);
	};
	useEffect(() => {
		if (poData?.length <= 0) {
			dispatch(getSinglePoDDetails(props?.data));
		}
	}, [poData?.length, dispatch]);

	const materialData = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [];
	});
	useEffect(() => {
		if (materialData?.length <= 0) {
			dispatch(getAllMaterialList(project_id));
		}
	}, [materialData?.length, dispatch]);

	const materials = materialData?.map((tl) => {
		return { label: tl.type, value: tl._id };
	});

	const submitStorePO = (e) => {
		e.preventDefault();
		handleClose();
		dispatch(updateStoreRoomPO({ ...info, items: item }));
	};

	const {
		purchase_order,
		order_no,
		vendor,
		date_of_order,
		expected_delivery_date,
		order_Details,
		btn_material,
		order_qty,
		issue_new
	} = getSiteLanguageData('storeroom');
	const {
		select,save,cancel
	} = getSiteLanguageData('commons');
	return (
		<>
			<i
				className="theme-bgcolor far fa-edit  lf-link-cursor ms-2"
				onClick={handleShow}></i>
			<Modal size={'md'} show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>{purchase_order.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitStorePO}>
						<div className="row">
							<div className="col-sm-12 ">
								<Form.Label htmlFor="">{order_no.text}</Form.Label>
							</div>
							<div className="col-sm-12">
								<InputGroup>
									<FormControl
										disabled
										placeholder={order_no.text}
										type="text"
										name="order_no"
										autoComplete="off"
										onChange={(e) => handleChange('order_no', e.target.value)}
										value={poData?.order_no}
										required
									/>
								</InputGroup>
							</div>
							<div className="col-sm-12 ">
								<Form.Label htmlFor="">{vendor.text}</Form.Label>
							</div>
							<div className="col-sm-12">
								<InputGroup>
									<FormControl
										disabled
										placeholder="Name"
										type="text"
										name="vendor"
										autoComplete="off"
										onChange={(e) => handleChange('vendor', e.target.value)}
										value={poData?.vendor}
										required
									/>
								</InputGroup>
							</div>
							<div className="form-group">
								<Form.Label htmlFor="Manpower" className="ms-1">
									{date_of_order.text}
								</Form.Label>
								<DatePicker
									disabled
									customInput={
										<FormControl className="lf-formcontrol-height" />
									}
									name="date_of_order"
									selected={moment(poData?.date_of_order).toDate()}
									dateFormat="dd-MM-yyyy"
									placeholderText="Date of Order"
									// onChange={(e) => handleChange('date_of_order', moment(e).format('YYYY-MM-DD'))}
									// minDate={moment(info?.date_of_order).toDate()}
								/>
							</div>
							<div className="form-group">
								<Form.Label htmlFor="Manpower" className="ms-1">
									{expected_delivery_date.text}
								</Form.Label>
								<DatePicker
									disabled
									customInput={
										<FormControl className="lf-formcontrol-height" />
									}
									name="expected_delivery_date"
									selected={moment(poData?.expected_delivery_date).toDate()}
									dateFormat="dd-MM-yyyy"
									placeholderText="Date of Order"
									// onChange={(e) => handleChange('expected_delivery_date', moment(e).format('YYYY-MM-DD'))}
									// minDate={moment(info?.date_of_order).toDate()}
								/>
							</div>
							<div className="col-sm-12 mt-2">
								<hr />
								<Form.Label htmlFor="">{order_Details.text}</Form.Label>
								<span className="float-end theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
									Add{' '}
								</span>
								<span className="float-end mx-2"> | </span>
								<OverlayTrigger
									trigger="click"
									placement="right-start"
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
														<li>
															<input
																type="checkbox"
																name="po_material"
																onChange={(e) => {
																	if (e.target.checked) {
																		const sm = [...selectedMaterial];
																		sm.push(m);
																		handleSelectedMaterial(sm);
																	} else {
																		handleDelete(m);
																	}
																}}
																checked={selectedMaterial?.some(
																	(sm) => sm.value === m.value,
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
										{select.text}	
									</span>
								</OverlayTrigger>
							</div>
							<div className="table-responsive">
								<table className="table white-table">
									<thead>
										<tr className="bg-light text-nowrap text-capitalize">
											<th>{btn_material.text}</th>
											<th>{order_qty.text}</th>
										</tr>
									</thead>
									<tbody>
										{poData?.storeroomorderdetails?.map((ml, k) => {
											return (
												<tr key={k} className="col-12">
													<td className="col-8">
														<span>
															<CustomSelect
																placeholder={`${btn_material.text}...`}
																name="material_id"
																onChange={(e) =>
																	handleChangeItem('material_id', e.value, k)
																}
																options={materials}
																value={materials?.filter(
																	(m) => m.value === ml.material_id,
																)}
															/>
														</span>
													</td>
													<td className="col-3">
														<span>
															<InputGroup>
																<FormControl
																	type="text"
																	autoComplete="off"
																	onChange={(e) =>
																		handleChangeItem(
																			'quantity',
																			e.target.value,
																			k,
																		)
																	}
																	placeholder={'Quantity'}
																	value={ml?.quantity}
																	required
																/>
															</InputGroup>
														</span>
													</td>
													<td className="text-start col-1">
														<span className="float-end">
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
						</div>
						<div className="col-sm-12 mt-2">
							<span className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
								+ {issue_new.text}
							</span>
						</div>
						<div className="col-sm-12 mt-2">
							<span className="float-end">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify">
									{save.text}
								</Button>
								<Button
									type="reset"
									variant="light"
									className="light-border btn-block my-1 show-verify ms-3">
									{cancel.text}
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
