import { Component } from 'react';
import { Modal, Form, Button, InputGroup, FormControl, Card } from 'react-bootstrap';

import React from 'react';
import { connect } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	GET_ALL_MATERIAL_LIST,
	GET_SINGLE_PO_DETAILS,
} from '../../store/actions/actionType';
import {
	deliverdStoreRoomPoOrder,
	getAllMaterialList,
	getSinglePoDDetails,
} from '../../store/actions/storeroom';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Upload from '../../components/upload';
import Signature from '../../components/signature';
import withRouter from '../../components/withrouter';

class SignPoOrder extends Component {
	constructor(props) {
		super(props);
		this.project_id = this.props.router?.params.project_id;
		this.store_room_id = this.props.router?.params.store_room_id;
		this.userId = getUserId();
		this.state = {
			url: null,
			show: this.props.show || false,
			selectedMaterial: [],
			item: [],
			page: 0,
			data: {},
			info: {
				user_id: this.userId,
				project_id: this.project_id,
				store_room_id: this.store_room_id,
				store_room_order_id: this.props?.data?._id,
				delivery_date: moment(new Date()).format('YYYY-MM-DD'),
				signature_url: '',
				notes: '',
				file: [],
				signed_by: this.userId,
				items: [],
			},
		};
	}

	componentDidMount() {
		const { dispatch, data } = this.props;
		dispatch(getSinglePoDDetails(data?._id));
		dispatch(getAllMaterialList(this.project_id));
	}
	componentDidUpdate(prevProps, prevState) {
		const { poData, data } = this.props;
		console.log(poData, "poData")
		if (poData !== prevProps.poData) {
			if (!!poData?._id) {
				this.setState({
					data: poData,
					selectedMaterial: poData?.storeroomorderdetails?.map((m) => {
						return { material_id: m.material_id, quantity: m.quantity, order_unit_rate: m.order_unit_rate };
					}),
				});
			}
		}
	}
	setPage = (page) => {
		this.setState({ page });
	};
	setUrl = (url) => {
		this.setState({ url });
	};
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
			info: {
				...this.state.info,
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

	handleChangeMaterial = (selectedMaterial) => {
		this.setState({ selectedMaterial });
	};
	handleDelete = (link) => {
		const newArr = this.state.info?.file?.filter((item) => {
			return item !== link;
		});
		this.handleChange('file', newArr);
	};
	submitStorePO = (e) => {
		e.preventDefault();
		this.handleClose();
		this.props.dispatch(
			deliverdStoreRoomPoOrder({
				...this.state.info,
				items: this.state.selectedMaterial,
				signature_url: this.state.url,
			}),
		);
		/* if (this.state.page === 0) {
			this.setPage(1);
		} else {
			this.handleClose();
			this.props.dispatch(
				deliverdStoreRoomPoOrder({
					...this.state.info,
					items: this.state.selectedMaterial,
					signature_url: this.state.url,
				}),
			);
		} */
	};
	render() {
		const { materialData, children } = this.props;
		const materials = materialData?.map((tl) => {
			return { label: tl.type, value: tl._id };
		});
		const {
			sign_PO,delivery_date,
			ordered_qty,
			unit_rate,
			received_qty,
			order_Details,
			order_price,
			tax,
			sub_total,
			materials:poOrderMaterials
		} = getSiteLanguageData('storeroom');
		const {
			notes
		} = getSiteLanguageData('commons');
		console.log(this.state.selectedMaterial, "this.state.selectedMaterial this.state.selectedMaterial")
		return (
			<>
				{children ? (
					React.cloneElement(this.props.children, { onClick: this.handleShow })
				) : (
					<i
						className="theme-bgcolor far fa-edit lf-link-cursor ms-2"
						onClick={this.handleShow}></i>
				)}
				<Modal
					size={'lg'}
					show={this.state.show}
					onHide={this.handleClose}
					animation={false}>
					<Modal.Header closeButton>
						<Modal.Title>{sign_PO.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body className="table-fix-head-600 px-3">
						<Form>
							<div className="row">
								<div className="col-sm-6">
									<div className="form-group">
										<Form.Label className="mb-0">{delivery_date.text}:</Form.Label>
										<DatePicker
											disabled
											customInput={
												<FormControl className="lf-formcontrol-height" />
											}
											name="delivery_date"
											selected={moment(new Date()).toDate()}
											dateFormat="dd-MM-yyyy"
										/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-12 mt-2">
									<Form.Label>{order_Details.text}:</Form.Label>
								</div>
								<div className="table-responsive table-fix-head">
									<table className="table table-hover table-sm">
										<thead>
											<tr className="border-0">
												<th className="col-4 border-0">{poOrderMaterials.text}</th>
												<th className="col-3 border-0">{ordered_qty.text}.</th>
												<th className="col-2 border-0">{unit_rate.text}.</th>
												<th className="col-3 border-0">{received_qty.text}.</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{this.state.selectedMaterial?.map((ml, k) => {
												return (
													<tr key={k} className="col-12">
														<td className="m-0 border-0">
															<span>
																<CustomSelect
																	isDisabled
																	placeholder={`${poOrderMaterials.text}...`}
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
															</span>
														</td>
														<td className="border-0">
															<span>
																<InputGroup className="">
																	<FormControl
																		className="lf-formcontrol-height"
																		type="text"
																		autoComplete="off"
																		disabled
																		value={ml?.quantity}
																		required
																	/>
																</InputGroup>
															</span>
														</td>
														<td className="border-0">
															<span>
																<InputGroup>
																	<FormControl
																		className="lf-formcontrol-height"
																		type="text"
																		autoComplete="off"
																		name='order_unit_rate'
																		value={ml?.order_unit_rate}
																		disabled
																		onChange={(e) =>
																			this.handleChangeItem(
																				'order_unit_rate',
																				e.target.value,
																				k,
																			)
																		}
																		placeholder={'Unit Rate'}
																		// value={ml?.quantity}
																		required
																	/>
																</InputGroup>
															</span>
														</td>
														<td className="border-0">
															<span>
																<InputGroup>
																	<FormControl
																		className="lf-formcontrol-height"
																		type="text"
																		autoComplete="off"
																		onChange={(e) =>
																			this.handleChangeItem(
																				'received_quantity',
																				e.target.value,
																				k,
																			)
																		}
																		placeholder={'Received Qty'}
																		// value={ml?.quantity}
																		required
																	/>
																</InputGroup>
															</span>
														</td>
														
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
							<div className="row mb-3">
								<div className='col-4'>
									<Card className="py-2 px-2" style={{
										backgroundColor: '#e9ecef',
										opacity: 1
									}}>
										<div>{order_price.text}: {
											this.state.selectedMaterial && this.state.selectedMaterial.length > 0 ? (
												this.state.selectedMaterial.reduce((a,b)=> a+(b.order_unit_rate ? b.order_unit_rate*(b.received_quantity ? Number(b.received_quantity) : 0) : 0),0)
											) :0
										}</div>
										<div>{tax.text}: {this.state.data.tax}</div>
										<div>{sub_total.text}: {this.state.data.tax + (this.state.selectedMaterial && this.state.selectedMaterial.length > 0 ? (
												this.state.selectedMaterial.reduce((a,b)=> a+(b.order_unit_rate ? b.order_unit_rate*(b.received_quantity ? Number(b.received_quantity) : 0) : 0),0)
											) :0)}</div>
									</Card>
								</div>
							</div>
							<div className="row">
								<div className='col-12'>
									<div className="form-group">
										<Form.Label className="mb-0">{notes.text}:</Form.Label>
										<FormControl
											placeholder={`${notes.text}...`}
											as="textarea"
											name="notes"
											rows="3"
											autoComplete="off"
											onChange={(e) => this.handleChange('notes', e.target.value)}
											value={this.state.info?.notes}
										/>
									</div>
								</div>
								<div className='col-6'>
									<div className="form-group">
										<Upload
											fileType="PO_photo"
											fileKey={this.store_room_id}
											onFinish={(file) => {
												const fileList = this.state.info?.file;
												fileList.push(file);
												this.handleChange(fileList, 'file');
											}}>
											<span className="theme-color lf-link-cursor ms-1">
												<i className="fas fa-plus" /> file
											</span>
										</Upload>
										
									</div>
								</div>
								<div className='col-6'>
									<div className="card lf-load-more-attechment mt-3">
										<span className="ms-3 my-1 d-inline-block">
											{this.state.info?.file.length > 0
												? this.state.info?.file.map((f) => {
														return (
															<>
																<img
																	alt="livefield"
																	src={f}
																	style={{ width: '40px', height: '40px' }}
																/>
																<i
																	className="fas fa-times fa-xs lf-icon"
																	onClick={this.handleDelete.bind(this, f)}></i>
															</>
														);
												})
												: null}
										</span>
									</div>
								</div>
								
							</div>
							<div className="row">
								<div className="col-sm-12 mt-2">
									<span className="theme-btnbg theme-secondary rounded theme-btnbold">
										<Signature
											type="core"
											setUrl={this.setUrl}
											url={this.state.url}
											signReport={this.submitStorePO}
										/>
									</span>
								</div>
							</div>
							{/* <div className="col-sm-12 mt-2">
								<span className="">
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block m-1 show-verify float-end">
										Save
									</Button>
									<Button
										type="reset"
										className="btn btn-primary theme-btn btn-block m-1 show-verify float-end"
										onClick={() => this.handleClose()}>
										Cancel
									</Button>
								</span>
							</div> */}
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
		};
	})(SignPoOrder),
);
