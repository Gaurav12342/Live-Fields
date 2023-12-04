import { useState, useCallback, useEffect } from 'react';
import { Modal, Form, Button, FormCheck } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Layout from '../../../components/layout';
import {
	GET_ALL_ROLE_WISE_PEOPLE,
	INVITE_MEETING_USER,
} from '../../../store/actions/actionType';
import {
	getAllRoleWisePeople,
	inviteUserToMeeting,
} from '../../../store/actions/projects';
import getUserId, { getSiteLanguageData } from '../../../commons';
import Loading from '../../../components/loadig';
function MeetingInvitation(props) {
	const userId = getUserId();
	const meeting_id = props?.data?._id;
	const [mode, setMode] = useState('invite');
	const [collapsibleData, manageCollapsibleData] = useState({});
	const { project_id } = useParams();
	const [info, setInfo] = useState({
		name: '',
		email: '',
		mobile: '',
		title: '',
		role_id: '',
		member_id: '',
	});
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setMode('invite');
		setInfo({
			name: '',
			email: '',
			mobile: '',
			title: '',
			role_id: '',
			member_id: '',
		});
	};
	const handleShow = () => setShow(true);
	const handleChange = useCallback(
		(e, role_id, email) => {
			setInfo({
				...info,
				role_id,
				email,
			});
		},
		[info],
	);
	const dispatch = useDispatch();
	const data = useSelector((state) => {
		return state?.project?.[GET_ALL_ROLE_WISE_PEOPLE]?.result || [];
	});
	const inviteMeetingUserResult = useSelector((state) => {
		return state?.project?.[INVITE_MEETING_USER] || [];
	});

	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getAllRoleWisePeople(project_id));
		}
	}, [data, project_id, dispatch]);

	useEffect(() => {
		if (inviteMeetingUserResult?.success === true) {
			handleClose();
			dispatch(getAllRoleWisePeople(project_id));
			dispatch({
				type: INVITE_MEETING_USER,
				[INVITE_MEETING_USER]: [],
			});
		}
	}, [inviteMeetingUserResult?.success, dispatch]);

	const handleInviteUser = useCallback((e) => {
		e.preventDefault();
		if (mode === 'invite') {
			const post = {
				user_id: userId,
				meeting_id: meeting_id,
				invitation_list: [
					{
						role_id: info?.role_id,
						email: info?.email,
					},
				],
			};
			dispatch(inviteUserToMeeting(post));
		}
	});
	if (!data?.length && data?.length !== 0) {
		return (
			<Layout>
				<div id="page-content-wrapper">
					<Loading />
				</div>
			</Layout>
		);
	}
	if (!data?.length && data?.length !== 0) {
		return <Loading />;
	}
	const { invite_people } = getSiteLanguageData('meeting');
	const { no_people_available } = getSiteLanguageData('meeting/components');

	return (
		<>
			<span
				data-toggle="tooltip"
				onClick={handleShow}
				className=" p-2 theme-btnbg theme-secondary rounded lf-link-cursor theme-btnbold float-end"
				tooltip={invite_people.tooltip}
				flow={invite_people.tooltip_flow}>
				<i className="fas fa-user-plus"></i>
			</span>
			<Modal
				className="lf-modal"
				show={show}
				size="l"
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>
						{mode === 'invite' ? 'Invite User' : 'Change User Role'}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleInviteUser}>
						<div id="page-content">
							<div className="container">
								<div className="row p-2">
									<div className="col-sm-12">
										{data?.map((r) => {
											return (
												<div className="col-sm-12 mb-1" key={r._id}>
													<span
														aria-controls="example-collapse-text"
														className="text-dark lf-link-cursor"
														variant="transparent"
														onClick={() =>
															manageCollapsibleData({
																...collapsibleData,
																[r._id]: !collapsibleData?.[r._id],
															})
														}>
														<h6 className="mb-2">
															<strong>
																{r?.name} ({r?.users?.length})
															</strong>
															<span>
																<i
																	className={
																		collapsibleData?.[r._id] === true
																			? 'fas fa-caret-down ms-2'
																			: 'fas fa-caret-right ms-2'
																	}></i>
															</span>
														</h6>
													</span>
													<table
														className={`table table-hover white-table ${
															collapsibleData?.[r._id] === true
																? 'lf-collapsible-table'
																: 'lf-collapsible-table-hidden'
														}`}>
														<tbody>
															{r?.users?.length === 0 ? (
																<tr>
																	<td className="text-center">
																		{no_people_available?.text}
																	</td>
																</tr>
															) : (
																r?.users?.map((u) => {
																	return (
																		<tr className="" key={u._id}>
																			<td className="lf-w-50">
																				<span className="">
																					<FormCheck
																						type="checkbox"
																						name="role_id"
																						onChange={(e) =>
																							handleChange(e, r._id, u.email)
																						}
																						value={r._id}
																					/>
																				</span>
																			</td>
																			<td>
																				<img
																					alt="livefield"
																					src={
																						u.profile ||
																						'/images/users/profile_user.png'
																					}
																					className="image-sm"
																				/>
																			</td>
																			<td>{u.email}</td>
																			<td className="pe-2">{u.mobile}</td>
																		</tr>
																	);
																})
															)}
														</tbody>
													</table>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>
						{/* <div className="form-group">
            <Form.Label htmlFor="Email ">Email</Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Email"
                type="text"
                name="email"
                onChange={e => handleChange(e)} value={info.email}
                required
                readOnly={mode === 'update'}
              />
            </InputGroup>
          </div>
          <div className="form-group">
            <Form.Label htmlFor="Title">User Role</Form.Label>
            <InputGroup className="mb-3">
              <FormControl as="select" name="role_id" onChange={e => handleChange(e)} value={info.role_id} required>
                <option value={null}>select role</option>
                {
                  data?.map(d => {
                    return <option key={d._id} value={d?._id}>{d?.name}</option>
                  })
                }
              </FormControl>
            </InputGroup>
          </div> */}
						<Button
							type="submit"
							className="btn  theme-btn btn-block float-end">
							{mode === 'invite' ? 'Invite' : 'Update Role'}
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default MeetingInvitation;
