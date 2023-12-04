import { useState, useCallback, useEffect } from 'react';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import { GET_USER_ROLE_BY_ID } from '../../store/actions/actionType';
import {
	getUserRoleById,
	updateUserRoleById,
} from '../../store/actions/projects';
// import { Link } from 'react-router-dom';
import getUserId, { getSiteLanguageData } from '../../commons';
import Laoding from '../../components/loadig';
const userId = getUserId();

function UserRole() {
	const { project_id, role_id } = useParams();
	const dispatch = useDispatch();
	const data = useSelector((state) => {
		return state?.project?.[GET_USER_ROLE_BY_ID]?.result || [];
	});
	useEffect(() => {
		if (!data?._id) {
			dispatch(getUserRoleById(role_id));
		}
	}, [data?._id, dispatch]);

	const [roleInfo, setRoleInfo] = useState({
		user_id: userId,
		project_id: project_id,
		role_id: role_id,
		role_name: '',
		access: '',
	});

	const handleChange = useCallback(
		(e, r) => {
			const name = e.target.name;
			const value = e.target.checked;
			const updatedRoleInfo = roleInfo;
			updatedRoleInfo.access[r][name] = value;
			setRoleInfo(updatedRoleInfo);
		},
		[roleInfo],
	);
	const updateRole = useCallback(
		(e) => {
			e.preventDefault();
			const post = {
				user_id: userId,
				project_id: project_id,
				role_id: role_id,
				role_name: roleInfo?.role_name,
				access: roleInfo?.access,
			};
			dispatch(updateUserRoleById(post));
		},
		[roleInfo, dispatch],
	);

	useEffect(() => {
		if (['role_name', 'access'].every((p) => roleInfo[p] === '' && data?._id)) {
			setRoleInfo({
				user_id: userId,
				project_id: project_id,
				role_id: role_id,
				role_name: data?.name,
				access: data?.access,
			});
		}
	}, [roleInfo, data]);

	if (!data?._id) {
		return <Laoding />;
	}
	const {
		dashboard,
		role_access,
		people,
		Role_management_d,
		role_access_d,
		export_list,
		save,
	} = getSiteLanguageData('people');
	return (
		<Layout>
			{data?.length === 0 ? (
				<Nodata type="Role" />
			) : (
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="container">
							<div className="row">
								<div className="col-sm-6">
									<div className="col-sm-12">
										<h3>{role_access?.text}</h3>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="col-sm-12">
										<nav aria-label="breadcrumb text-end">
											<ol className="breadcrumb">
												<li className="breadcrumb-item">
													<a href="/dashboard">{dashboard?.text}</a>
												</li>
												<li className="breadcrumb-item" aria-current="page">
													{people?.text}
												</li>
												<li className="breadcrumb-item" aria-current="page">
													{Role_management_d?.text}
												</li>
												<li
													className="breadcrumb-item active"
													aria-current="page">
													{role_access_d.tex}
												</li>
											</ol>
										</nav>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div className="container">
						<div className="col-sm-12 pt-4">
							<div className="row">
								<div className="col-sm-5"></div>
								<div className="col-sm-7 text-end">
									<span className="me-4 theme-color theme-link-hover">
										{export_list?.text}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="container">
						<Form>
							<div className="row">
								{/* <h3><strong className="theme-color ms-5">{ data.name }</strong></h3> */}
								<InputGroup className="mb-3 col-sm-4">
									<FormControl
										placeholder="Role Name"
										type="text"
										name="role_name"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={roleInfo?.role_name}
										required
									/>
								</InputGroup>
								<div className="col-sm-12 main-area text-center">
									{Object.keys(data?.access)?.map((r) => {
										return (
											<div className="col-sm-12 mb-4 text-start" key={r}>
												<h6 className="mb-3 lf-link-cursor ">
													<strong>{r} </strong>
												</h6>
												<table className={`table table-hover white-table`}>
													<tbody>
														{Object.keys(data?.access?.[r]).map((field) => {
															return (
																<tr
																	className="theme-table-data-row"
																	key={field}>
																	<td className="w-100">{field}</td>
																	<td>
																		<span className={'lf-task-checkbox'}>
																			<label className="check">
																				<input
																					type="checkbox"
																					name={field}
																					onChange={(e) => handleChange(e, r)}
																					defaultChecked={
																						data?.access?.[r]?.[field]
																					}
																				/>
																				<span className="checkmark"></span>
																			</label>
																		</span>
																	</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										);
									})}
									<Button onClick={updateRole} className="btn theme-btn ">
										<i class="fa-solid fa-floppy-disk pe-2"></i>
										{save?.text}
									</Button>
								</div>
							</div>
						</Form>
					</div>
				</div>
			)}
		</Layout>
	);
}
export default UserRole;
