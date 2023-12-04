import { useState, useCallback, useEffect } from 'react';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Nodata from '../../components/nodata';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
import {
	GET_ALL_ACCESS_KEYS,
	GET_USER_ROLE_BY_ID,
	UPDATE_USER_ROLE_BY_ID,
} from '../../store/actions/actionType';
import {
	creatUserRole,
	getAccessKey,
	getUserRoleById,
	updateUserRoleById,
} from '../../store/actions/projects';
// import { Link } from 'react-router-dom';
import getUserId from '../../commons';
import Laoding from '../../components/loadig';
const userId = getUserId();

function UserRoleCreate() {
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const accessKey = useSelector((state) => {
		return state?.project?.[GET_ALL_ACCESS_KEYS]?.result || [];
	});
	useEffect(() => {
		if (accessKey?.length <= 0) {
			dispatch(getAccessKey());
		}
	}, [accessKey, dispatch]);

	const [infoRole, setInfoRole] = useState({
		user_id: userId,
		project_id: project_id,
		role_name: '',
		access: '',
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

	const submitRole = (e) => {
		e.preventDefault();
		dispatch(creatUserRole(infoRole));
	};

	// if (!data?._id) {
	//   return <Laoding />
	// }
	const {
		role_management,
		dashboard,
		people,
		role_name,
		create_Role,
		export_list,
	} = getSiteLanguageData('team/createrole');
	return (
		<Layout>
			{
				// data?.length === 0 ?
				// (
				//   <Nodata type="Role" />
				// )
				// :
				<div id="page-content-wrapper">
					<section className="lf-dashboard-toolbar">
						<div className="container">
							<div className="row">
								<div className="col-sm-6">
									<div className="col-sm-12">
										<h3>{role_management?.text}</h3>
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
												<li
													className="breadcrumb-item active"
													aria-current="page">
													{role_management?.text}
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
												onChange={(e) => handleChange(e)}
												value={infoRole.role_name}
												required
											/>
										</InputGroup>
										<div>
											{/* {
                    Object.keys(accessKey?.access_keys)?.map(r => {
                      return <div className="col-sm-12 mb-4 text-start" key={r}>
                        <h6 className="mb-3 lf-link-cursor "><strong>{r} </strong>
                        </h6>
                        <table className={`table table-hover white-table`}>
                          <tbody>
                            {
                              Object.keys(accessKey?.access_keys?.[r]).map(field => {
                                return <tr key={field}>
                                  <td className="w-100">{field}</td>
                                  <td >
                                    <label className="check">
                                      <input
                                        type="checkbox"
                                        name={field}
                                        onChange={(e) => handleChange(e, r)}
                                        // defaultChecked={data?.access?.[r]?.[field]}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  </td>
                                </tr>
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    })
                  } */}
										</div>
									</div>
									<Button
										type="submit"
										className="btn btn-primary theme-btn btn-block my-1 show-verify">
										{create_Role?.text}
									</Button>
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
