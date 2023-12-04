import { Component } from 'react';
import { connect } from 'react-redux';

import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import {
	GET_ALL_MATERIAL_LIST,
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
	GET_ORDER_DETAILS_BY_STORE_ROOM_ID,
	GET_STORE_ROOM_FULL_DETAILS,
} from '../../store/actions/actionType';
import {
	Button,
	Form,
	FormControl,
	InputGroup,
	Tab,
	Tabs,
} from 'react-bootstrap';
import {
	getStoreRoomFullDetails,
	getOrderDetailsStoreRoomId,
	updateStoreRoom,
	getAllMaterialList,
} from '../../store/actions/storeroom';
import moment from 'moment';
import getUserId, { getSiteLanguageData } from '../../commons';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import { getLocationList } from '../../store/actions/Task';
import CreateOrder from './createorder';
import CustomSelect from '../../components/SelectBox';
import withRouter from '../../components/withrouter';
const userId = getUserId();

class Storeinfo extends Component {
	constructor(props) {
		super(props);
		this.project_id = this.props.router?.params.project_id;
		this.store_id = this.props.router?.params.store_id;
		this.state = {
			editStore: null,
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getStoreRoomFullDetails(this.store_id));
		dispatch(getAllMaterialList(this.project_id));
		dispatch(getOrderDetailsStoreRoomId(this.store_id));
		dispatch(getAllRoleWisePeople(this.project_id));
		dispatch(getLocationList(this.project_id, userId));
	}

	submitStoreData = (storeInfo) => {
		const post = {
			user_id: userId,
			project_id: this.project_id,
			store_room_id: storeInfo?._id,
			description: storeInfo?.name,
			assigee_id: storeInfo?.assigee_id,
			location_id: storeInfo?.location_id,
		};
		this.props.dispatch(updateStoreRoom(post));
	};

	setEditStore = (editStore) => {
		this.setState({ editStore });
	};

	// if (!data?.length && data?.length !== 0) {
	//   return <Loading />
	// }
	render() {
		const project_id = this.props.router?.params.project_id;
		const { data, storeLocation, assignee, orderData } = this.props;
		const projectUsers = [];
		const { store_info,vendor, delivery,requests_dates} = getSiteLanguageData('storeroom');
		const { material: storeInfoMaterial } = getSiteLanguageData('setting');
		const {
			dashboard,
			name,
			location: storeInfoLocation,
			quantity,date_of_order,
			materials
		} = getSiteLanguageData('commons');

		const { store_room } = getSiteLanguageData('components');

		const { assigee } = getSiteLanguageData('reports/toolbar');
		const { action ,status} = getSiteLanguageData('task/update');

		assignee?.forEach((a) => {
			(a?.users).forEach((u) => {
				projectUsers.push({
					...u,
					label: (
						<>
							{' '}
							<div className="d-flex align-items-center">
								{u?.profile ? (
									<img
										src={u.thumbnail || u.profile}
										className="me-1 priority-1 border"
									/>
								) : (
									<span
										className="task-info-category text-uppercase me-2 w-25"
										style={{ background: '#FFF', color: '#FFFFFF' }}>
										{u.first_name?.charAt(0)}
										{u.last_name?.charAt(0)}
									</span>
								)}
								<div className="lf-react-select-item w-75">
									{u.first_name} {u.last_name}
								</div>
							</div>
						</>
					),
					value: u._id,
				});
			});
		});
		const location = storeLocation?.map((tl) => {
			return { label: tl.name, value: tl._id };
		});

		return (
			<Layout>
				{/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}

				{/* <Loading /> */}
				{data?.length === 0 ? (
					<Nodata type="Store Info">{/* <AddMaterial /> */}</Nodata>
				) : (
					<div id="page-content-wrapper">
						<section className="lf-dashboard-toolbar">
							<div className="container">
								<div className="row">
									<div className="col-sm-6">
										<div className="col-sm-12">
											<h3 className="ms-5">{store_info.text}</h3>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="col-sm-12">
											<nav aria-label="breadcrumb text-end">
												<ol className="breadcrumb me-3">
													<li className="breadcrumb-item">
														<a href="/dashboard">{dashboard.text}</a>
													</li>
													<li className="breadcrumb-item">
														<a href={`/storeroom/${project_id}`}>
															{store_room.text}
														</a>
													</li>
													<li
														className="breadcrumb-item active"
														aria-current="page">
														{`${store_info.text} Info`}
													</li>
												</ol>
											</nav>
										</div>
									</div>
								</div>
							</div>
						</section>
						<div className="container">
							<div className="card mt-3 ">
								<Form>
									<div className="row m-0">
										<div className="form-group col-4">
											<Form.Label className="ms-3">{name.text}</Form.Label>
											<div className="row m-1">
												<InputGroup>
													{this.state.editStore == data?._id ? (
														<FormControl
															type="text"
															name="description"
															autoComplete="off"
															onBlur={(e) => {
																const name = e.target.value;
																this.submitStoreData({
																	...data,
																	name,
																});
																setTimeout(() => {
																	this.setEditStore(null);
																}, 1000);
															}}
															defaultValue={data?.description}
														/>
													) : (
														<>
															<div>{data?.description}</div>
															{
																<i
																	onClick={(e) => this.setEditStore(data._id)}
																	className="far fa-edit ms-2 p-1 rounded ps-2 theme-btnbg text-secondary"></i>
																//   <img alt="livefield" src="/images/edit-orange.svg" className="lf-link-cursor ms-3" width="15px" onClick={e => setEditStore(data._id)} />
															}
														</>
													)}
												</InputGroup>
											</div>
										</div>
										<div className="form-group col-4">
											<Form.Label htmlFor="First Name">
												{assigee.text}
											</Form.Label>
											<div className="row">
												<InputGroup>
													{this.state.editStore === data?._id ? (
														<div className="col-9 border p-1">
															<CustomSelect
																placeholder={`${assigee.text}...`}
																name="assigee_id"
																moduleType="taskUsers"
																// onChange={(e) => handleChange('assigee_id', e?.map(a => a.value))}
																options={projectUsers}
																// value={projectUsers?.filter(assingee => info.assigee_id?.some(a => a === assingee.value))}
																isMulti
															/>
														</div>
													) : (
														<>
															<div className="col-9 border p-1">
																<div className="lf-store-info-detail">
																	{data?.assigee?.map((as) => {
																		return (
																			<>
																				<img
																					alt="livefield"
																					src={'/images/users/profile_user.png'}
																					width={'26'}
																					height={'26'}
																					className="rounded-circle ms-1"></img>
																				<span className="ms-2">
																					{as.first_name}
																				</span>
																			</>
																		);
																	})}
																</div>
															</div>
															{
																<span>
																	<i
																		onClick={(e) =>
																			this.setEditStore(data?._id)
																		}
																		className="far fa-edit ms-2 p-1 ps-2 rounded theme-btnbg text-secondary"></i>
																</span>
																// <img alt="livefield" src="/images/edit-orange.svg" className="lf-link-cursor ms-3" width="15px" onClick={e => setEditStore(data._id)} />
															}
														</>
													)}
												</InputGroup>
											</div>
										</div>
										<div className="form-group col-4">
											<Form.Label htmlFor="First Name">
												{storeInfoLocation.text}
											</Form.Label>
											<div className="row mb-2">
												<InputGroup>
													{this.state.editStore === data?._id ? (
														<div className="col-9 border p-1">
															<CustomSelect
																placeholder={`${storeInfoLocation.text}...`}
																name="location_id"
																// onChange={(e) => handleChange('assigee_id', e?.map(a => a.value))}
																options={location}
																// value={projectUsers?.filter(assingee => info.assigee_id?.some(a => a === assingee.value))}
																isMulti
															/>
														</div>
													) : (
														<>
															<div className="col-9 border p-1">
																<div className="lf-store-info-detail">
																	{data?.location?.map((lc) => {
																		return (
																			<div className="col-9 border p-1">
																				<span className="ms-2">{lc.name}</span>
																			</div>
																		);
																	})}
																</div>
															</div>
															{
																<span>
																	<i
																		onClick={(e) => this.setEditStore(data._id)}
																		className="far fa-edit ms-2 p-1 rounded ps-2 theme-btnbg text-secondary"></i>
																</span>
																//<img alt="livefield" src="/images/edit-orange.svg" className="lf-link-cursor ms-3" width="15px" onClick={e => setEditStore(data._id)} />
															}
														</>
													)}
												</InputGroup>
											</div>
										</div>
									</div>
								</Form>
							</div>
						</div>

						<div className="container">
							<Tabs
								className="mt-3 link-dark"
								defaultActiveKey="Material Stock">
								<Tab eventKey="Material Stock" title="Material Stock">
									<div className="table-responsive">
										<table className="table white-table  mt-2">
											<thead>
												<tr className="bg-light text-nowrap text-capitalize">
													<th className="lf-w-150">{storeInfoMaterial.text}</th>
													{/* <th style={{ width: "150px" }}>Unit</th> */}
													<th className="lf-w-150">{quantity.text}</th>
													<th className="lf-w-150">{action.text}</th>
												</tr>
											</thead>
											<tbody>
												{data?.storeroomstock?.map((ms) => {
													return (
														<tr>
															<td className="lf-w-150">
																{ms?.material?.map((e) => (
																	<span>{e.type}</span>
																))}
																({ms.stock_unit})
															</td>
															{/* <td className="lf-w-150"><span>{ms.stock_unit}</span></td> */}

															<td className="lf-w-150">
																<span>{ms.stock_quantity}</span>
																<br />
																<span>min-qty-{ms.minimum_quantity}</span>
															</td>
															<td className="text-start lf-w-150">
																<span>
																	<Button className="btn theme-btn ms-2">
																		<img
																			alt="livefield"
																			src="/images/edit-white.svg"
																			width="15px"></img>
																	</Button>{' '}
																</span>
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								</Tab>
								<Tab eventKey="Orders" title="Orders">
									{/* <Button className="btn theme-btn mt-2 float-end">+ Add Order</Button> */}
									<div className="text-end mt-2">
										<CreateOrder />
									</div>
									<div className="table-responsive">
										<table className="table white-table  mt-2">
											<thead>
												<tr className="bg-light text-nowrap text-capitalize ">
													<th className="lf-w-150">{vendor.text}</th>
													<th className="lf-w-150">{date_of_order.text}</th>
													<th className="lf-w-150">{materials.text}</th>
													<th className="lf-w-150">{delivery.text}</th>
													<th className="lf-w-150">{status.label}</th>

													<th className="lf-w-150">{action.text}</th>
												</tr>
											</thead>
											<tbody>
												{orderData?.map((od) => {
													return (
														<tr>
															<td className="lf-w-150">
																<span>{od.vendor}</span>
															</td>
															<td className="lf-w-150">
																<span>
																	{moment(od.date_of_order).format(
																		'DD-MM-YYYY',
																	)}
																</span>
															</td>

															<td className="lf-w-150">
																{od?.items?.map((item) => (
																	<span>
																		{item.material_id}
																		<br />
																	</span>
																))}
																{/* {(od?.items)?.map(item => {
                                const tag = material?.filter(tt => tt._id === item.material_id)[0]
                                return <span>{tag?.type} ,</span>
                            })} */}
															</td>
															<td className="lf-w-150">
																<span>
																	{moment(od.expected_delivery_date).format(
																		'DD-MM-YYYY',
																	)}
																</span>
															</td>
															<td className="lf-w-150">
																<span>{od.status}</span>
															</td>
															<td className="lf-w-150">
																<span>
																	<Button className="btn theme-btn ms-2">
																		<img
																			alt="livefield"
																			src="/images/edit-white.svg"
																			className="lf-link-cursor "
																			width="15px"></img>
																	</Button>{' '}
																</span>
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								</Tab>
								<Tab eventKey="Requests" title="Requests">
									<div className="table-responsive">
										<table className="table white-table  mt-2">
											<thead>
												<tr className="bg-light text-nowrap text-capitalize">
													<th className="lf-w-150">{`${storeInfoLocation.text}s`}</th>
													<th className="lf-w-150">{requests_dates.text}</th>
													<th className="lf-w-150">{materials.text}</th>
													<th className="lf-w-150">{delivery.text}</th>
													<th className="lf-w-150">{action.text}</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className="lf-w-150">
														<span>{storeInfoLocation.text}</span>
													</td>
													<td className="lf-w-150">
														<span>10-02-2022</span>
													</td>
													<td className="lf-w-150">
														<span>ply-50 pies</span>
													</td>
													<td className="lf-w-150">
														<span>only status</span>
													</td>
													<td className="lf-w-150">
														<span>
															<Button className="btn theme-btn ms-2">
																<img
																	alt="livefield"
																	src="/images/edit-white.svg"
																	className="lf-link-cursor "
																	width="15px"></img>
															</Button>{' '}
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</Tab>
								<Tab eventKey="Transation" title="Transation"></Tab>
							</Tabs>
						</div>
					</div>
				)}
			</Layout>
		);
	}
}

export default withRouter(
	connect((state) => {
		return {
			data: state?.storeroom?.[GET_STORE_ROOM_FULL_DETAILS]?.result,
			material: state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result,
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result,
			orderData: state?.storeroom?.[GET_ORDER_DETAILS_BY_STORE_ROOM_ID]?.result,
			storeLocation: state?.task?.[GET_LOCATION_LIST]?.result,
		};
	})(Storeinfo),
);
