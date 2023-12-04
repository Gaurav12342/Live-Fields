import { Component } from 'react';
import { connect } from 'react-redux';

import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import {
	GET_ALL_MATERIAL_LIST,
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_LOCATION_LIST,
	GET_STORE_ROOM,
} from '../../store/actions/actionType';
import { Button } from 'react-bootstrap';
import Createstore from './createstore';
import Updatestore from './updatestore';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	deleteStoreRoom,
	getAllMaterialList,
	getStoreRoom,
} from '../../store/actions/storeroom';
import { getLocationList } from '../../store/actions/Task';
import { getAllRoleWisePeople } from '../../store/actions/projects';
import withRouter from '../../components/withrouter';

class Storeroom extends Component {
	constructor(props) {
		super(props);
		this.project_id = this.props.router?.params.project_id;
	}

	componentDidMount() {
		const { dispatch } = this.props;
		const userId = getUserId();
		dispatch(getStoreRoom(this.project_id));
		dispatch(getLocationList(this.project_id, userId));
		dispatch(getAllRoleWisePeople(this.project_id));
		dispatch(getAllMaterialList(this.project_id));
	}

	// if (!data?.length && data?.length !== 0) {
	//   return <Loading />
	// }
	render() {
		const project_id = this.props.router?.params.project_id;
		const { data } = this.props;
		const { store_room } = getSiteLanguageData('components');
		const {dashboard} = getSiteLanguageData("commons")

		return (
			<Layout>
				{/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}

				{/* <Loading /> */}
				{data?.length === 0 ? (
					<Nodata type="Store Room">
						{/* <AddMaterial /> */}
						<Createstore />
					</Nodata>
				) : (
					<div id="page-content-wrapper">
						<section className="lf-dashboard-toolbar">
							<div className="container">
								<div className="row">
									<div className="col-sm-6">
										<div className="col-sm-12">
											<h3 className="ms-5">{store_room.text}</h3>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="col-sm-12">
											<nav aria-label="breadcrumb text-end">
												<ol className="breadcrumb me-3">
													<li className="breadcrumb-item">
														<a href="/dashboard">{dashboard.text}</a>
													</li>
													<li
														className="breadcrumb-item active"
														aria-current="page">
														{store_room.text}
													</li>
												</ol>
											</nav>
										</div>
									</div>
								</div>
							</div>
						</section>
						<div className="container-fluid">
							<div className="col-sm-12 pt-4">
								<div className="row">
									<div className="col-sm-12 text-end">
										<span className="me-3">
											<Createstore />
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="container">
							<div className="table-responsive">
								<table className="table white-table  mt-2">
									<thead>
										<tr className="bg-light text-nowrap ">
											<th style={{ width: '150px' }}>Name</th>
											<th style={{ width: '150px' }}>Location</th>
											<th style={{ width: '150px' }}>Assignee</th>
											<th style={{ width: '150px' }}>Action</th>
										</tr>
									</thead>
									<tbody>
										{data?.map((sr) => {
											return (
												<tr>
													<td style={{ width: '150px' }}>
														<span>
															<a
																href={`/storeroom/${project_id}/storeinfo/${sr._id}`}
																className="text-bold btn overflow-hidden text-nowrap text-truncate theme-color p-0">
																{sr.description}
															</a>
														</span>
														<br />
														<span>
															<a
																href={`/storeroom/${project_id}/storeRoomStock/${sr._id}`}
																className="text-bold btn overflow-hidden text-nowrap text-truncate theme-color p-0">
																{sr.description} Order
															</a>
														</span>
													</td>
													<td style={{ width: '150px' }}>
														{sr?.location
															?.map((lc) => {
																return `${lc.name}`;
															})
															.join(',')}
													</td>
													<td style={{ width: '150px' }}>
														{sr?.assigee
															?.map((as) => {
																return ` ${as.first_name}`;
															})
															.join(',')}
													</td>
													<td style={{ width: '150px' }} className="text-start">
														<span>
															<span
																className="p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold"
																onClick={() => {
																	const isConfirmDelete = window.confirm(
																		`are you sure to Delete Store Room`,
																	);
																	if (isConfirmDelete) {
																		this.props.dispatch(
																			deleteStoreRoom({
																				project_id: project_id,
																				store_room_id: [sr?._id],
																			}),
																		);
																	}
																}}>
																<i className="fas fa-trash-alt"></i>
															</span>
															<Updatestore data={sr}></Updatestore>
														</span>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
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
			data: state?.storeroom?.[GET_STORE_ROOM]?.result,
			storeLocation: state?.task?.[GET_LOCATION_LIST]?.result,
			assignee: state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result,
			materialData: state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result,
			// deleteFileResult: state?.project?.[DELETE_FILE],
			// deleteFileDirectoryResult: state?.project?.[DELETE_FILE_DIRECTORY]
		};
	})(Storeroom),
);
