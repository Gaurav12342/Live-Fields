import { Component } from 'react';
import { Modal, Form, FormControl, InputGroup } from 'react-bootstrap';

import React from 'react';
import { connect } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { GET_SINGLE_PO_DETAILS } from '../../store/actions/actionType';
import { getSinglePoDDetails } from '../../store/actions/storeroom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import CustomSelect from '../../components/SelectBox';
import withRouter from '../../components/withrouter';

class SignPoOrderInfo extends Component {
	constructor(props) {
		super(props);
		this.project_id = this.props.router?.params.project_id;
		this.store_room_id = this.props.router?.params.store_room_id;
		this.userId = getUserId();
		this.state = {
			show: this.props.show || false,
		};
	}

	componentDidMount() {
		const { dispatch, data } = this.props;
		dispatch(getSinglePoDDetails(data));
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

	render() {
		const { children, poData } = this.props;
		const {
			sign_PO,
			delivery_date,
			ordered_qty,
			unit_rate,
			received_qty,
			order_Details,
			order_price,
			tax,
			sub_total,
			po_details,
			materials: poOrderMaterials,
		} = getSiteLanguageData('storeroom');

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
					size={'md'}
					show={this.state.show}
					onHide={this.handleClose}
					animation={false}>
					<Modal.Header closeButton>
						<Modal.Title>{po_details.text}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form style={{ pointerEvents: 'none', opacity: 0.9 }}>
							<div className="row">
								<div className="form-group">
									<Form.Label className="ms-1">
										{delivery_date.text}:
									</Form.Label>
									<DatePicker
										customInput={
											<FormControl className="lf-formcontrol-height" />
										}
										name="delivery_date"
										selected={moment(poData?.delivery_date).toDate()}
										dateFormat="dd-MM-yyyy"
									/>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-12 mt-2">
									<Form.Label>{order_Details.text}:</Form.Label>
								</div>
								<div className="table-responsive table-fix-head">
									<table className="table table-hover table-sm mb-0">
										<thead>
											<tr className="border-0">
												<th className="col-6 ps-3 border-0">
													{poOrderMaterials.text}
												</th>
												<th className="col-3 ps-3 border-0">
													{ordered_qty.text}.
												</th>
												<th className="col-3 ps-3 border-0">
													{received_qty.text}.
												</th>
											</tr>
										</thead>
										<tbody className="border-0">
											{poData?.storeroomorderdetails?.map((ml, k) => {
												return (
													<tr key={k} className="col-12">
														<td className="col-6 m-0 border-0">
															<span>
																<CustomSelect
																	placeholder={ml?.material?.[0].type}
																	name="material_id"
																	options={ml.material?.map((tl) => {
																		return { label: tl.type, value: tl._id };
																	})}
																	value={ml.material_id}
																/>
															</span>
														</td>
														<td className="col-3 m-0 border-0">
															<span>
																<InputGroup>
																	<FormControl
																		className="lf-formcontrol-height"
																		type="text"
																		autoComplete="off"
																		value={ml?.quantity}
																		required
																	/>
																</InputGroup>
															</span>
														</td>
														<td className="col-3 m-0 border-0">
															<span>
																<InputGroup>
																	<FormControl
																		className="lf-formcontrol-height"
																		type="text"
																		autoComplete="off"
																		placeholder={'Received Quantity'}
																		value={ml?.received_quantity}
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
								<div
									className={`form-group ${
										poData?.notes?.length === 0 ? 'd-none' : 'visible'
									}`}>
									<Form.Label className="ms-1">Notes:</Form.Label>
									<label className="form-control">{poData?.notes}</label>
									{/* <FormControl
										placeholder="Notes.. "
										as="textarea"
										name="notes"
										rows={
											poData && poData.notes && poData.notes.length > 120
												? 3
												: 1
										}
										autoComplete="off"
										value={poData?.notes}
									/> */}
								</div>
								{poData?.file &&
									Array.isArray(poData?.file) &&
									poData?.file.length > 0 && (
										<div className="form-group pt-2">
											<div className="lf-load-more-attechment">
												<span className="ms-3 my-1 d-inline-block">
													{poData?.file
														? poData?.file.map((f, k) => {
																return (
																	<>
																		<img
																			key={k}
																			alt="livefield"
																			src={f}
																			style={{ width: '40px', height: '40px' }}
																		/>
																	</>
																);
														  })
														: ''}
												</span>
											</div>
										</div>
									)}
							</div>

							<div className="row p-0 mb-2 mt-1">
								<div className="col-12">
									<Form.Label>Signed by:</Form.Label>
									<span className="my-1">
										{poData?.signature_url ? (
											<img
												src={poData?.signature_url}
												alt="LiveFiled"
												style={{
													display: 'block',
													width: '150px',
													height: '100px',
													borderBottom: '1px solid #ced4da',
												}}
											/>
										) : null}
									</span>
									<span>
										{poData?.signedby?.[0]?.first_name}{' '}
										{poData?.signedby?.[0]?.last_name}
									</span>
								</div>
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
		};
	})(SignPoOrderInfo),
);
