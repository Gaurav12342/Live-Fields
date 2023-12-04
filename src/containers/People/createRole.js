import { useState, useCallback, useEffect } from 'react';
import {
	InputGroup,
	FormControl,
	Form,
	Button,
	FormCheck,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import { GET_ALL_ACCESS_KEYS } from '../../store/actions/actionType';
import { creatUserRole, getAccessKey } from '../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../commons';
import Laoding from '../../components/loadig';

function UserRoleCreate() {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const accessKey = useSelector((state) => {
		return state?.project?.[GET_ALL_ACCESS_KEYS]?.result;
	});
	useEffect(() => {
		dispatch(getAccessKey());
	}, []);

	const [infoRole, setInfoRole] = useState({
		user_id: userId,
		project_id: project_id,
		role_name: '',
		access: {},
	});

	const handleChange = useCallback(
		(e, r) => {
			const name = e.target.name;
			const value = e.target.checked;
			const createRoleInfo = infoRole;
			createRoleInfo.access[r][name] = value;
			setInfoRole(createRoleInfo);
		},
		[infoRole],
	);

	useEffect(() => {
		if (
			accessKey?.access_keys &&
			Object.keys(accessKey.access_keys).length >= 0 &&
			Object.keys(infoRole.access).length === 0
		) {
			const access = {};
			Object.keys(accessKey.access_keys).forEach((f) => {
				access[f] = {};
				accessKey?.access_keys?.[f]?.forEach((ak) => {
					access[f][ak] = 0;
				});
			});
			setInfoRole({
				...infoRole,
				access,
			});
			// dispatch(getAccessKey());
		}
	}, [accessKey?.access_keys]);

	const submitRole = (e) => {
		e.preventDefault();
		dispatch(creatUserRole(infoRole));
	};
	if (!accessKey?._id) {
		return <Laoding />;
	}
	const {
		role_name,
		create_role_btn,
		Role_management,
		people,
		create_role,
		Role_management_d,
		dashboard,
	} = getSiteLanguageData('people');

	return (
		<Layout>
			{
				// data?.length === 0 ?
				// (
				//   <Nodata type="Role" />
				// )
				// :
				<div id="page-content-wrapper">
					<div className="lf-dashboard-toolbar">
						<section className="px-3">
							<div className="row align-items-center">
								<div className="col-12">
									<div className="d-flex align-items-center">
										<div className="float-start d-inline-block">
											<a
												className="lf-common-btn"
												href={`/people/${project_id}/roles`}>
												<i className="fa fa-arrow-left" aria-hidden="true"></i>
											</a>
										</div>
										<div className="float-start d-inline-block">
											<span className="text-nowrap">{Role_management?.text} </span>
										</div>
										<div className="ms-auto float-end d-inline-block">
										<Button
											type="button"
											onClick={submitRole}
											className="lf-main-button">
											<i className='fas fa-plus pe-1'></i>
											{create_role_btn?.text}
										</Button>
										</div>
									</div>
									
								</div>
							</div>
						</section>
					</div>
					<div className="container">
						<Form onSubmit={submitRole}>
							<div className="row p-3">
								<div className="col-sm-12 mt-2">
									<div className="form-group">
										<Form.Label htmlFor="roletitle">
											{role_name?.text}
										</Form.Label>
										<InputGroup className="mb-3">
											<FormControl
												placeholder="Role Name"
												type="text"
												name="role_name"
												autoComplete="off"
												onChange={(e) => {
													setInfoRole({
														...infoRole,
														role_name: e.target.value,
													});
												}}
												value={infoRole.role_name}
												required
											/>
										</InputGroup>
										<div>
											{Object.keys(accessKey?.access_keys)?.map((r) => {
												return (
													<div
														className="col-sm-12 mb-4 text-start
													"
														key={r}>
														<h6 className="mb-3 lf-link-cursor text-uppercase">
															<strong>{r?.replace(/_/g, ' ')} </strong>
														</h6>
														<table className={`table table-hover white-table`}>
															<tbody>
																{accessKey?.access_keys?.[r].map((field) => {
																	return (
																		<tr
																			className="theme-table-data-row"
																			key={field}>
																			<td className="w-100 text-capitalize px-2">
																				{field?.replace(/_/g, ' ')}
																			</td>
																			<td>
																				<FormCheck
																					className="me-5"
																					type="checkbox"
																					name={field}
																					onChange={(e) => handleChange(e, r)}
																					// defaultChecked={data?.access?.[r]?.[field]}
																				/>
																			</td>
																		</tr>
																	);
																})}
															</tbody>
														</table>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						</Form>
					</div>
				</div>
			}
		</Layout>
	);
}
export default UserRoleCreate;
