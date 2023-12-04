import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Nodata from '../../components/nodata';
import Layout from '../../components/layout';
import { GET_ALL_INSPECTION_LIST } from '../../store/actions/actionType';
import {
	deleteInspection,
	getAllInspectionList,
} from '../../store/actions/projects';
import { Button } from 'react-bootstrap';
import Loading from '../../components/loadig';
import CreateInspection from './createInspection';
import EditInspection from './updateInspection';
import moment from 'moment';
import { getSiteLanguageData } from '../../commons';
function Inspection() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [sortType, handleSortType] = useState(undefined);
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_INSPECTION_LIST]?.result || [];
	});
	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllInspectionList(project_id));
		}
	}, [data?.length, dispatch]);
	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}
	const {
		description,
		inspection_date,
		inspection_time,
		inspection,
		inspection_location,
		delete_inspection_message
	} = getSiteLanguageData('inspection');
	const {
		action,
		name,
		dashboard,
		sort_default,
		name_a,
		a,
		name_z,
		z,
		date_new,
		old,
		date_old,
		new_n,
	} = getSiteLanguageData('commons');
	return (
		<Layout>
			{/* { data?.length == 0 ?
       <Nodata type="Files"/>
       : */}

			{/* <Loading /> */}
			{data?.length === 0 ? (
				<Nodata type="Labour">
					<CreateInspection />
				</Nodata>
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="container-fluid">
							<div className="row">
								<div className="col-sm-6">
									<div className="col-sm-12">
										<h3>{inspection?.text}</h3>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="col-sm-12">
										<nav aria-label="breadcrumb text-end">
											<ol className="breadcrumb">
												<li className="breadcrumb-item">
													<a href="/dashboard">{dashboard.text}</a>
												</li>
												<li
													className="breadcrumb-item active"
													aria-current="page">
													{inspection?.text}
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
										<option value={undefined}>{sort_default.text}</option>
										<option value={1}>
											{name_a.text} {String.fromCharCode(60)} {z.text}
										</option>
										<option value={2}>
											{name_z.text} {String.fromCharCode(60)} {a.text}
										</option>
										<option value={3}>
											{date_new.text} {String.fromCharCode(60)} {old.text}
										</option>
										<option value={4}>
											{date_old.text} {String.fromCharCode(60)} {new_n.tetx}
										</option>
									</select>
								</div>
								<div className="col-sm-9 text-end">
									<CreateInspection />
								</div>
							</div>
						</div>
					</div>
					<div className="container-fluid mt-5 ">
						<div className="">
							<table className="theme-table mx-2">
								<tr className="theme-table-title">
									<th className="mx-2  "> {name?.text}</th>
									<th className=" mx-1 ">{description?.text}</th>
									<th className=" mx-1 ">{inspection_date?.text}</th>
									<th className="mx-1 ">{inspection_time?.text}</th>
									<th className="mx-1 ">{inspection_location?.text}</th>
									<th className=" mx-1 ">{action?.text}</th>
								</tr>
								{data
									?.sort((a, b) => {
										if (sortType === '1') {
											return (
												a.description?.charCodeAt(0) -
												b.description?.charCodeAt(0)
											);
										}
										if (sortType === '2') {
											return (
												b.description?.charCodeAt(0) -
												a.description?.charCodeAt(0)
											);
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
													{moment(p.inspection_date).format('DD-MM-YYYY')}
												</td>
												<td className="">{p.inspection_time}</td>
												<td className="">{p.location}</td>
												<td className=" ">
													<EditInspection data={p} />
													<Button
														className="btn-red ms-1"
														onClick={() => {
															const isConfirmDelete = window.confirm(
																delete_inspection_message.text,
															);
															if (isConfirmDelete) {
																dispatch(
																	deleteInspection({
																		inspection_request_id: [p?._id],
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
export default Inspection;
