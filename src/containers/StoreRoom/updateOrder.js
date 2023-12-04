import { Component } from 'react';
import {
	Modal,
	Form,
	Button,
	InputGroup,
	FormControl,
	OverlayTrigger,
} from 'react-bootstrap';

import React from 'react';
import { connect } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_MATERIAL_LIST,
	GET_PROJECT_DETAILS,
	GET_SINGLE_PO_DETAILS,
} from '../../store/actions/actionType';
import {
	getAllMaterialList,
	getSinglePoDDetails,
	updateStoreRoomPO,
} from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import CreateNewMaterial from './createNewMaterial';
import withRouter from '../../components/withrouter';

class UpdateOrder extends Component {
	constructor(props) {
		super(props);
		this.project_id = this.props.router?.params.project_id;
		this.store_room_id = this.props.router?.params.store_room_id;
		this.userId = getUserId();
		this.state = {
			projectDetails: this.props.projectDetails,
			show: this.props.show || false,
			selectedMaterial: [],
			page: 0,
			item: [],
			data: {},
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				store_room_id: this.store_room_id,
				store_room_order_id: this.props?.data?._id,
				items: [],
				order_no: this.props?.data?.order_no,
				vendor_id: this.props?.data?.vendor,
				date_of_order: this.props?.data?.date_of_order,
				expected_delivery_date: this.props?.data?.expected_delivery_date,
			},
		};
	}

	componentDidMount() {
		const { dispatch, data, projectDetails } = this.props;
		this.setState({
			projectDetails: projectDetails,
		});
		dispatch(getSinglePoDDetails(data?._id));
		dispatch(getAllMaterialList(this.project_id));
	}
	componentDidUpdate(prevProps, prevState) {
		const { poData, data } = this.props;
		if (poData !== prevProps.poData) {
			if (!!poData?._id) {
				this.setState({
					data: poData,
					selectedMaterial: poData?.storeroomorderdetails?.map((m) => {
						return { material_id: m.material_id, quantity: m.quantity };
					}),
				});
			}
		}
	}
	handleShow = () => {
		this.setState({ show: true });
	};
	handleClose = () => {
		this.setState({ show: false });
		if (this.props.handleClose) {
			this.props.handleClose();
		}
	};

	handleChange = (name, value, k) => {
		this.setState({
			data: {
				...this.state.data,
				[name]: value,
			},
		});
	};
	handleChangeItem = (name, val, k) => {
		const arr = this.state.selectedMaterial;
		arr[k] = {
			...arr[k],
			[name]: val,
		};
		this.handleChangeMaterial([...arr]);
	};
	handleDelete = (m) => {
		const newArr = this.state.selectedMaterial.filter((item) => {
			return item.material_id !== m.material_id;
		});
		this.handleChangeMaterial(newArr);
	};
	setPage = (page) => {
		this.setState({ page });
	};
	handleChangeMaterial = (selectedMaterial) => {
		this.setState({ selectedMaterial });
	};
	submitStorePO = (e) => {
		e.preventDefault();
		
		const post = {
			user_id: this.userId,
			project_id: this.project_id,
			store_room_id: this.store_room_id,
			store_room_order_id: this.props?.data?._id,
			items: this.state.selectedMaterial,
			order_no: this.state.data.order_no,
			vendor: this.state.data.vendor,
			date_of_order: this.state.data.date_of_order,
			expected_delivery_date: this.state.data.expected_delivery_date,
		};
		this.handleClose();
		this.props.dispatch(updateStoreRoomPO(post));
		
		/* console.log(this.state.page, " this.state.page this.state.page")
		if (this.state.page === 0) {
			this.setPage(1);
		} else {
			
		} */
	};
	clearQuantity = () => {
		this.state.selectedMaterial?.map((s, k) =>
			this.handleChangeItem('quantity', '', k),
		);
	};
	render() {
		const { data, page } = this.state;
		const { materialData, hideBtn } = this.props;
		const materials = materialData?.map((tl) => {
			return { label: tl.type, value: tl._id };
		});
		const {
			edit_purchase_order,
			order_no,
			vendor,
			date_of_order,
			expected_delivery_date,
			order_details,
			select,
			material,
			order_qty,
			save,
			cancel,
		} = getSiteLanguageData('storeroom/updateOrder');
		return (
			<>
				{!hideBtn ? (
					<i
						className="theme-bgcolor far fa-edit lf-link-cursor ms-2"
						onClick={this.handleShow}></i>
				) : (
					''
				)}
				{/* <i className="theme-bgcolor far fa-edit  lf-link-cursor ms-2" onClick={this.handleShow}></i> */}
				<Modal
					className="lf-modal"
					size={'md'}
					show={this.state.show}
					onHide={this.handleClose}
					animation={true}>
					<Modal.Header className="py-2 bg-light" closeButton>
						<Modal.Title>{edit_purchase_order?.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.submitStorePO}>
							<div className="row">
								<div className="col-sm-5 ">
									<Form.Label className="mb-0 fw-bold">
										{order_no?.text}
									</Form.Label>
								</div>
								<div className="col-sm-7 mb-1">
									<InputGroup>
										<FormControl
											className="lf-formcontrol-height"
											// disabled
											placeholder="Order No"
											type="text"
											name="order_no"
											autoComplete="off"
											onChange={(e) =>
												this.handleChange('order_no', e.target.value)
											}
											value={data?.order_no}
											required
										/>
									</InputGroup>
								</div>
								<div className="col-sm-5 ">
									<Form.Label className="mb-0 fw-bold">
										{vendor?.text}
									</Form.Label>
								</div>
								<div className="col-sm-7 mb-1">
									<InputGroup>
										<FormControl
											className="lf-formcontrol-height"
											// disabled
											placeholder="Name"
											type="text"
											name="vendor"
											autoComplete="off"
											onChange={(e) =>
												this.handleChange('vendor', e.target.value)
											}
											value={data?.vendor}
											required
										/>
									</InputGroup>
								</div>
								<div className="form-group col-sm-5">
									<Form.Label className="mb-0 fw-bold">
										{date_of_order?.text}
									</Form.Label>
								</div>
								<div className="col-sm-7">
									<DatePicker
										// disabled
										customInput={
											<FormControl className="lf-formcontrol-height mb-1" />
										}
										name="date_of_order"
										selected={moment(data?.date_of_order).toDate()}
										dateFormat="dd-MM-yyyy"
										placeholderText="Date of Order"
										onChange={(e) =>
											this.handleChange(
												'date_of_order',
												moment(e).format('YYYY-MM-DD'),
											)
										}
										// minDate={moment(info?.date_of_order).toDate()}
									/>
								</div>
								<div className="form-group col-sm-5">
									<Form.Label className="mb-0 fw-bold">
										{expected_delivery_date?.text}
									</Form.Label>
								</div>
								<div className="col-sm-7">
									<DatePicker
										// disabled
										customInput={
											<FormControl className="lf-formcontrol-height" />
										}
										name="expected_delivery_date"
										selected={
											data?.expected_delivery_date
												? moment(
														new Date(data?.expected_delivery_date),
												  ).toDate()
												: null
										}
										dateFormat={'dd-MM-yyyy'}
										placeholderText="Date of Order"
										onChange={(e) =>
											this.handleChange(
												'expected_delivery_date',
												moment(e).format('YYYY-MM-DD'),
											)
										}
										// minDate={moment(info?.date_of_order).toDate()}
									/>
								</div>
								<div></div>

								{/* </div>
              <div className="row"> */}
							</div>

							<div className="row">
								<div className="col-sm-12 mt-3">
									{/* <hr /> */}
									<Form.Label className="mb-0 fw-bold">
										{order_details?.text}
									</Form.Label>
									<CreateNewMaterial />
									{/* <span className="float-end theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">Add </span> */}
									<span className="float-end mx-2"> | </span>
									<OverlayTrigger
										rootClose={true}
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
															<li key={i}>
																<input
																	type="checkbox"
																	name="po_material"
																	onChange={(e) => {
																		if (e.target.checked) {
																			const sm = [
																				...this.state.selectedMaterial,
																			];
																			sm.push({
																				material_id: m.value,
																				quantity: 0,
																			});
																			this.handleChangeMaterial(sm);
																		} else {
																			this.handleDelete({
																				material_id: m.value,
																				quantity: 0,
																			});
																		}
																	}}
																	checked={this.state.selectedMaterial?.some(
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
											{' '}
											{select?.text}
										</span>
									</OverlayTrigger>
								</div>
								{this.state.selectedMaterial &&
									Array.isArray(this.state.selectedMaterial) &&
									this.state.selectedMaterial.length > 0 && (
										<div className="">
											<table className="table table-hover table-sm">
												<thead>
													<tr className="border-0">
														<th className="col-8 ps-3 border-0">
															{material?.text}
														</th>
														<th className="col-3 ps-3 border-0">
															{order_qty?.text}
														</th>
														<th className="col-1 ps-3 border-0"></th>
													</tr>
												</thead>
												<tbody className="border-0">
													{this.state.selectedMaterial?.map((ml, k) => {
														return (
															<tr key={k}>
																<td className="col-8 border-0">
																	<CustomSelect
																		menuPlacement="top"
																		placeholder="Materials..."
																		name="material_id"
																		onChange={(e) =>
																			this.handleChangeItem(
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
																</td>
																<td className="col-3 border-0">
																	<FormControl
																		className="lf-formcontrol-height"
																		type="number"
																		pattern="[0-9]"
																		autoComplete="off"
																		onChange={(e) =>
																			this.handleChangeItem(
																				'quantity',
																				e.target.value,
																				k,
																			)
																		}
																		placeholder={'Quantity'}
																		value={ml?.quantity}
																		required
																	/>
																</td>
																<td className="col-1 text-secondary text-center border-0 align-middle">
																	<span className="float-end">
																		<i
																			className="theme-bgcolor fas fa-trash-alt lf-link-cursor me-2"
																			onClick={() => this.handleDelete(ml)}></i>
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
                      <span className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold">
                        + ISSUE NEW
                      </span>
                    </div> */}
							<div className="col-sm-12 pt-2">
								<span>
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block m-1 show-verify float-end">
										<i class="fa-solid fa-floppy-disk pe-2"></i>
										{save?.text}
									</Button>
									<Button
										type="reset"
										variant="light"
										className="light-border btn-block m-1 show-verify ms-3 float-end"
										onClick={() => this.clearQuantity()}>
										<i class="fa-solid fa-xmark pe-2"></i>
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
}
export default withRouter(
	connect((state) => {
		return {
			poData: state?.storeroom?.[GET_SINGLE_PO_DETAILS]?.result || [],
			materialData: state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [],
			projectDetails: state?.project?.[GET_PROJECT_DETAILS]?.result || [],
		};
	})(UpdateOrder),
);
