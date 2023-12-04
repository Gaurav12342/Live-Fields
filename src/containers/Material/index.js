import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import { GET_ALL_MATERIAL_LIST } from '../../store/actions/actionType';
import { Button } from 'react-bootstrap';
import Loading from '../../components/loadig';
import AddMaterial from './Components/addMaterial';
import EditMaterial from './Components/editMaterial';
import CreateUnit from './Components/createUnit';
import {
	deleteMaterial,
	getAllMaterialList,
} from '../../store/actions/storeroom';
import { getSiteLanguageData } from '../../commons';

function Material() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [sortType, handleSortType] = useState(undefined);
	const data = useSelector((state) => {
		return state?.storeroom?.[GET_ALL_MATERIAL_LIST]?.result || [];
	});
	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllMaterialList(project_id));
		}
	}, [data?.length, dispatch]);
	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}
	const { material, dashboard, type, unit, action, minimum_quantity } =
		getSiteLanguageData('material/index');
	return (
		<Layout>
			{/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}

			{/* <Loading /> */}
			{data?.length === 0 ? (
				<Nodata type="Labour">
					<AddMaterial />
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="container-fluid">
							<div className="row">
								<div className="col-sm-6">
									<div className="col-sm-12">
										<h3>{material?.text}</h3>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="col-sm-12">
										<nav aria-label="breadcrumb text-end">
											<ol className="breadcrumb">
												<li className="breadcrumb-item">
													<a href="/dashboard">{dashboard?.text}</a>
												</li>
												<li
													className="breadcrumb-item active"
													aria-current="page">
													{material?.text}
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
								<div className="col-sm-3">
									<select
										className="form-control search-box"
										onChange={(e) => handleSortType(e.target.value)}
										value={sortType}>
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
									</select>
								</div>
								<div className="col-sm-9 text-end">
									<AddMaterial />
									<CreateUnit />
								</div>
							</div>
						</div>
					</div>

					<div className="container-fluid mt-5 ">
						<div className="">
							<table className="theme-table  mx-2">
								<tr className="theme-table-title">
									<th className="mx-2  "> {type?.text}</th>
									<th className=" mx-1 ">{unit?.text}</th>
									<th className="mx-1 ">{minimum_quantity?.text}</th>
									<th className=" mx-1 ">{action?.text}</th>
								</tr>
								{data
									?.sort((a, b) => {
										if (sortType === '1') {
											return a.type?.charCodeAt(0) - b.type?.charCodeAt(0);
										}
										if (sortType === '2') {
											return b.type?.charCodeAt(0) - a.type?.charCodeAt(0);
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
													{p.type}
												</td>
												<td className="">{p.unit}</td>
												<td className="">{p?.minimum_quantity}</td>
												<td className=" ">
													<AddMaterial data={p} />

													<Button
														className="btn-red ms-1"
														onClick={() => {
															const isConfirmDelete = window.confirm(
																`Are you sure to delete Material`,
															);
															if (isConfirmDelete) {
																dispatch(
																	deleteMaterial({
																		material_id: [p?._id],
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

export default Material;
