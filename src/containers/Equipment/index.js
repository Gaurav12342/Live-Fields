import { Component } from 'react';
import { connect } from 'react-redux';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import { GET_ALL_EQUIPMENT_LIST } from '../../store/actions/actionType';
import {
	deleteEquipment,
	getAllEquipmentLogByIdAndDate,
} from '../../store/actions/projects';
import { FormControl, InputGroup } from 'react-bootstrap';
import Loading from '../../components/loadig';
import CustomSelect from '../../components/SelectBox';
import moment from 'moment';
import EditEquipment from './updateEquipment';
import CreateEquipment from './createEquipment';
import { getSiteLanguageData } from '../../commons';
import withRouter from '../../components/withrouter';

class EquipmentLog extends Component {
	constructor(props) {
		super(props);
		this.project_id = this.props.router?.params.project_id;
		this.state = {
			sortType: undefined,
		};
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(getAllEquipmentLogByIdAndDate(this.project_id));
	}
	handleSortType = (sortType) => {
		this.setState(sortType);
	};

	render() {
		const { data } = this.props;
		const state = this.state;
		if (!data?.length && data?.length !== 0) {
			return <Loading />;
		}
		const {
			action,
			description,
			nos,
			hours,
			total_hours,
			notes,
			icon_save,
			icon_edit,
			icon_select,
			submit,
			info,
			sort_default,
			name_a,
			name_z,
			date_new,
			date_old,
			new_n,
			old,
			a,
			z,
		} = getSiteLanguageData('commons');
		const { labour_equipment_log, btn_equipment } =
			getSiteLanguageData('equiqment');
		const { btn_Labour } = getSiteLanguageData('labour');
		return (
			<Layout>
				{data?.length === 0 ? (
					<Nodata type="Labour">
						<CreateEquipment />
					</Nodata>
				) : (
					<div id="page-content-wrapper">
						<section className="lf-dashboard-toolbar">
							<div className="container">
								<div className="row">
									<div className="col-6 ">
										<h3 className="ms-5 mt-2">{labour_equipment_log?.text}</h3>
									</div>
									<div className="col-6">
										<nav aria-label="breadcrumb ">
											<span className="btn p-2 theme-btnbg theme-secondary rounded float-end">
												{info?.text}
											</span>
											<span
												type="submit"
												className="p-2 btn theme-btnbg theme-secondary rounded float-end">
												{submit?.text}
											</span>
											<span className="p-2 float-end  theme-secondary">
												<i className="fas fa-less-than" />
												<i className="far fa-calendar-alt fa-lg mx-1" />{' '}
												{moment(new Date()).format('DD-MM-YYYY')}
												<i className="fas fa-greater-than" />
											</span>
										</nav>
									</div>
									<div className="row">
										<div className="col-12  ">
											<div className="ms-3 task-list pt-0 ms-5">
												<span className="btn border-0 text-secondary fw-bold">
													{btn_Labour?.text}
												</span>
												<span className="btn border-0 theme-color fw-bold">
													{/* <a href={`/storeroom/${this.project_id}/storeRoomOrderList/${this.store_room_id}?material_date=${this.date}`}> */}
													{btn_equipment?.text}
													{/* </a> */}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
						<div className="row">
							<div className="col-sm-3 mt-2">
								<select
									className="form-control search-box"
									onChange={(e) => this.handleSortType(e.target.value)}
									value={state.sortType}>
									<option value={undefined}>{sort_default?.text}</option>
									<option value={1}>
										{name_a?.text} {String.fromCharCode(60)} {z?.text}
									</option>
									<option value={2}>
										{name_z?.text} {String.fromCharCode(60)} {a?.text}
									</option>
									<option value={3}>
										{date_new?.text} {String.fromCharCode(60)} {old?.text}
									</option>
									<option value={4}>
										{date_old?.text} {String.fromCharCode(60)} {new_n?.text}
									</option>
								</select>
							</div>
							<div className="col-sm-9">
								<nav aria-label="breadcrumb">
									<ul className="breadcrumb float-end me-5">
										<li>
											{' '}
											<span
												type="submit"
												className="btn theme-btnbg theme-secondary rounded">
												{icon_save?.text}
											</span>
										</li>
										<li>
											<span
												type="submit"
												className="btn theme-btnbg theme-secondary rounded">
												{icon_select?.text}
											</span>
										</li>
										<li>
											<span
												type="submit"
												className="btn theme-btnbg theme-secondary rounded">
												{icon_edit?.text}
											</span>
										</li>
										<li>
											<CreateEquipment />
										</li>
									</ul>
								</nav>
							</div>
						</div>
						<div className="mx-2">
							<table className="table white-table mt-2">
								<thead>
									<tr className="bg-light text-nowrap text-capitalize col-12">
										<th className="col-3">{description?.text}</th>
										<th className="col-2">{nos?.text}</th>
										<th className="col-1">{hours?.text}</th>
										<th className="col-1">{total_hours?.text}</th>
										<th className="col-3">{notes?.text}</th>
										<th className="col-2">{action?.text}</th>
									</tr>
								</thead>
								<tbody>
									{data
										?.sort((a, b) => {
											if (state.sortType === '1') {
												return a.name?.charCodeAt(0) - b.name?.charCodeAt(0);
											}
											if (state.sortType === '2') {
												return b.name?.charCodeAt(0) - a.name?.charCodeAt(0);
											}
											if (state.sortType === '3') {
												return new Date(b.createdAt) - new Date(a.createdAt);
											}
											if (state.sortType === '4') {
												return new Date(a.createdAt) - new Date(b.createdAt);
											}
											return true;
										})
										.map((p, k) => {
											return (
												<tr key={k} className="col-12">
													<td className="col-3">
														<span>
															<CustomSelect
																placeholder={p?.name}
																name="material_id"
																// onChange={(e) => handleChangeAdjustmentItem('material_id', e.value, k)}
																// options={materials}
																// value={materials?.filter(m => m.value === ml.value)}
															/>
														</span>
													</td>
													<td className="col-2">
														<span>
															<InputGroup className="">
																<FormControl
																	type="text"
																	autoComplete="off"
																	// onChange={(e) => handleChangeAdjustmentItem("quantity", e.target.value, k)}
																	placeholder={'Nos.'}
																	// required
																/>
															</InputGroup>
														</span>
													</td>
													<td className="col-1">
														<span>
															<InputGroup className="">
																<FormControl
																	type="text"
																	autoComplete="off"
																	// onChange={(e) => handleChangeAdjustmentItem("quantity", e.target.value, k)}
																	placeholder={'Hours'}
																	// required
																/>
															</InputGroup>
														</span>
													</td>
													<td className="col-1">
														<span>{'total hours'}</span>
													</td>
													<td className="col-3">
														<span>
															<InputGroup className="">
																<FormControl
																	type="text"
																	autoComplete="off"
																	// onChange={(e) => handleChangeAdjustmentItem("quantity", e.target.value, k)}
																	placeholder={'Notes'}
																	// required
																/>
															</InputGroup>
														</span>
													</td>
													<td className="text-start col-2">
														<EditEquipment data={p} />
														<span
															className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
															onClick={() => {
																const isConfirmDelete = window.confirm(
																	`are you sure to Delete Labour`,
																);
																if (isConfirmDelete) {
																	this.props.dispatch(
																		deleteEquipment({
																			equipment_id: p?._id,
																		}),
																	);
																}
															}}>
															<i className="fas fa-trash-alt"></i>
														</span>
													</td>
												</tr>
											);
										})}
								</tbody>
							</table>
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
			data: state?.project?.[GET_ALL_EQUIPMENT_LIST]?.result || [],
		};
	})(EquipmentLog),
);
