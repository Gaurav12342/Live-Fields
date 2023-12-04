import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import { GET_ALL_LABOUR_LIST } from '../../store/actions/actionType';
import { deleteLabour, getAllLabourList } from '../../store/actions/projects';
import { Button, InputGroup, Dropdown } from 'react-bootstrap';
import Loading from '../../components/loadig';
import CreateLabour from './createLabour';
import EditLabour from './updateLabour';
import { getSiteLanguageData } from '../../commons';

function Labour() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [sortType, handleSortType] = useState('3');
	const sortingList = [
		`New ${String.fromCharCode(60)} Old`,
		` A ${String.fromCharCode(60)} Z`,
		` Z ${String.fromCharCode(60)} A`,
		` Old ${String.fromCharCode(60)} New`,
	];
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_LABOUR_LIST]?.result || [];
	});
	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllLabourList(project_id));
		}
	}, [data?.length, dispatch]);
	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}
	const { name, quantity, hours, total_hours, notes, action,search } =
		getSiteLanguageData('commons');
	return (
		<Layout>
			{/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}

			{/* <Loading /> */}
			{data?.length === 0 ? (
				<Nodata type="Labour">
					<CreateLabour />
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="container-fluid">
							<div className="row">
								<div className="col-sm-3">
									<div className="col-sm-12">
										<InputGroup>
											<i className="fas fa-search theme-btnbg me-1 mt-2"></i>
											<input
												type="text"
												className="d-block form-control border border-0"
												placeholder={search?.text}
											/>
										</InputGroup>
									</div>
								</div>
								<div className="col-sm-3">
									<Dropdown>
										<Dropdown.Toggle
											variant="transparent"
											id="dropdown-basic"
											className="theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold fw-bold">
											<span className="">
												{sortingList[parseInt(sortType) - 1]}
											</span>
										</Dropdown.Toggle>
										<Dropdown.Menu
											style={{ backgroundColor: '#73a47' }}
											className="shadow p-2 mb-2 bg-white rounded-7 dropdown-menu ">
											{sortingList.map((st, k) => {
												return (
													<Dropdown.Item
														key={k}
														className="lf-layout-profile-menu fw-bolder"
														onClick={() => handleSortType((k + 1).toString())}>
														{st}
													</Dropdown.Item>
												);
											})}
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="col-sm-6">
									<div className="col-sm-12 text-end">
										<CreateLabour />
									</div>
								</div>
							</div>
						</div>
					</section>
					<div className="container-fluid">
						<div className="col-sm-12 pt-4">
							<div className="row">
								<div className="col-sm-3">
									{/* <select
                  className="form-control search-box"
                  onChange={(e) => handleSortType(e.target.value)}
                  value={sortType}
                >
                  <option value={undefined}>Sort : Default</option>
                  <option value={1}>
                    Name : A {String.fromCharCode(60)} Z
                  </option>
                  <option value={2}>
                    Name : Z {String.fromCharCode(60)} A
                  </option>
                  <option value={3}>
                    Date : New {String.fromCharCode(60)} Old
                  </option>
                  <option value={4}>
                    Date : Old {String.fromCharCode(60)} New
                  </option>
                </select> */}
								</div>
								<div className="col-sm-9 text-end"></div>
							</div>
						</div>
					</div>
					<div className="container-fluid mt-5 ">
						<div className="">
							<table className="theme-table  mx-2">
								<tr className="theme-table-title">
									<th className="mx-2  "> {name?.text}</th>
									<th className=" mx-1 ">{quantity?.text}</th>
									<th className=" mx-1 ">{hours?.text}</th>
									<th className="mx-1 ">{total_hours?.text}</th>
									<th className="mx-1 ">{notes?.text}</th>
									<th className=" mx-1 ">{action?.text}</th>
								</tr>

								{data
									?.sort((a, b) => {
										if (sortType === '1') {
											return a.name?.charCodeAt(0) - b.name?.charCodeAt(0);
										}
										if (sortType === '2') {
											return b.name?.charCodeAt(0) - a.name?.charCodeAt(0);
										}
										if (sortType === '3') {
											return new Date(b.createdAt) - new Date(a.createdAt);
										}
										if (sortType === '4') {
											return new Date(a.createdAt) - new Date(b.createdAt);
										}
										return true;
									})
									.map((p) => {
										return (
											<tr className=" theme-table-data-row mx-5" key={p._id}>
												<td className="task-info lf-task-content  ">
													{p.name}
												</td>
												<td className="">{p.quantity}</td>
												<td className="">{p.hours}</td>
												<td className="">{p.total_hours}</td>
												<td className="">{p.notes}</td>
												<td className=" ">
													<EditLabour data={p} />
													<Button
														className="btn-red ms-1"
														onClick={() => {
															const isConfirmDelete = window.confirm(
																`Are you sure to Delete Labour`,
															);
															if (isConfirmDelete) {
																dispatch(
																	deleteLabour({
																		labour_id: [p?._id],
																	}),
																);
															}
														}}>
														<img
															alt="livefield"
															src="/images/delete-white.svg"
															width="15px"
														/>
													</Button>
												</td>
											</tr>
										);
									})}
							</table>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
}

export default Labour;
