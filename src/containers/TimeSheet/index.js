import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import { GET_ALL_TIMESHEET_LIST } from '../../store/actions/actionType';
import {
	deleteTimeSheet,
	getAllTimeSheetList,
} from '../../store/actions/projects';
import { Button } from 'react-bootstrap';
import Loading from '../../components/loadig';
import CreateTimeSheet from './createTimeSheet';
import EditTimeSheet from './updateTimeSheet';
import moment from 'moment';
function TimeSheet() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [sortType, handleSortType] = useState(undefined);
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_TIMESHEET_LIST]?.result || [];
	});
	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllTimeSheetList(project_id));
		}
	}, [data?.length, dispatch]);
	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}
	return (
		<Layout>
			{/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}

			{/* <Loading /> */}
			{data?.length === 0 ? (
				<Nodata type="Labour">
					<CreateTimeSheet />
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="container-fluid">
							<div className="row">
								<div className="col-sm-6">
									<div className="col-sm-12">
										<h3>Time Sheet</h3>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="col-sm-12">
										<nav aria-label="breadcrumb text-end">
											<ol className="breadcrumb">
												<li className="breadcrumb-item">
													<a href="/dashboard">Dashboard</a>
												</li>
												<li
													className="breadcrumb-item active"
													aria-current="page">
													Time Sheet
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
									<CreateTimeSheet />
								</div>
							</div>
						</div>
					</div>
					<div className="container-fluid mt-5 ">
						<div className="">
							<table className="theme-table  mx-2">
								<tr className="theme-table-title">
									<th className="mx-2  "> Name</th>
									<th className=" mx-1 ">Description</th>
									<th className=" mx-1 ">From Date</th>
									<th className="mx-1 ">To Date</th>
									<th className=" mx-1 ">Action</th>
								</tr>
								{data
									?.sort((a, b) => {
										if (sortType === '1') {
											return a?.name.localeCompare(b?.name);
										}
										if (sortType === '2') {
											return b?.name.localeCompare(a?.name);
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
												<td className="">{p.description}</td>
												<td className="">
													{moment(p.from_date).format('DD-MM-YYYY')}
												</td>
												<td className="">
													{moment(p.to_date).format('DD-MM-YYYY')}
												</td>
												<td className=" ">
													<EditTimeSheet data={p} />
													<Button
														className="btn-red ms-1"
														onClick={() => {
															const isConfirmDelete = window.confirm(
																`are you sure to Delete Time Sheet`,
															);
															if (isConfirmDelete) {
																dispatch(
																	deleteTimeSheet({
																		time_sheet_id: [p?._id],
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
export default TimeSheet;
