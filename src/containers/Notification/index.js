import moment from 'moment';
import { useEffect, useState } from 'react';

import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';


import {
	GET_NOTIFICATION_COUNT,
	// GET_NOTIFICATION_BY_PROJECT,
	GET_PROJECT_NOTIFICATION_COUNT
} from '../../store/actions/actionType';
import {
	deleteNotification,
	getNotification,
	getNotificationProjectWiseCount,
	// getNotificationByProject,
	readNotification,
	getProjectNotification
} from '../../store/actions/Notification';
import getUserId, { getSiteLanguageData } from '../../commons';

function Notification(props) {
	
	const userId = getUserId();
	const dispatch = useDispatch();
	const [collapsibleData, manageCollapsibleData] = useState({});
	// const [open, setOpenNotification] = useState(false);
	const [openId, setOpenId] = useState("");
	const [projectNotification, setProjectNotifications] = useState({});
	// const { project_id } = useParams();
	
	// const data = useSelector((state) => {
	// 	return state?.notification?.[GET_NOTIFICATION_BY_PROJECT]?.result || [];
	// });

	const dataNotification = useSelector((state) => {
		return state?.notification?.[GET_NOTIFICATION_COUNT]?.result || [];
	});

	const projectWiseCount = useSelector((state)=>{
		return state?.notification?.[GET_PROJECT_NOTIFICATION_COUNT]?.result || [];
	});
	
	useEffect(() => {
		dispatch(getNotificationProjectWiseCount({user_id:userId}))
		// dispatch(getNotificationByProject(userId));
		dispatch(getNotification(userId));		
	}, [dispatch, props.open, userId]);

	const moveAction = (e,nt) => {
		e.preventDefault();
		dispatch(
			readNotification({
				user_id: userId,
				notification_id: [nt?._id],
				is_read: true,
			}, (resData)=>{
				if(nt?.data_message?.notification_type === "storeroom_stock"){
					console.log(nt, "nt?.data_message")
					if(nt?.data_message?.data?.store_room_id){
						window.location.href = `/reports/${nt?.data_message?.data?.project_id}/storeRoomLog/${nt?.data_message?.data?.store_room_id}?store_room_log_date=${moment(nt.createdAt).format("YYYY-MM-DD")}&name=${nt?.data_message?.data?.store_room?.description}`;
					}else{
						window.location.href = `/reports/${nt?.data_message?.data?.project_id}`;
					}
				}else if(nt?.data_message?.notification_type === "storeroom_report"){
					nt.data_message.data = Array.isArray(nt?.data_message?.data) && nt?.data_message?.data.length > 0 ? nt?.data_message?.data?.[0] : nt?.data_message?.data;
					window.location.href = `/reports/${nt?.data_message?.data?.project_id}/storeRoomLog/${nt?.data_message?.data?.store_room_id}?store_room_log_date=${nt?.data_message?.data?.report_date}`;
				}else if(nt?.data_message?.notification_type === "material_report"){
					nt.data_message.data = Array.isArray(nt?.data_message?.data) && nt?.data_message?.data.length > 0 ? nt?.data_message?.data?.[0] : nt?.data_message?.data;
					window.location.href = `/reports/${nt?.data_message?.data?.project_id}/materialLog/${nt?.data_message?.data?.material_log_id}?material_date=${nt?.data_message?.data?.report_date}&name=${nt?.data_message?.data?.report_name}`;
				}else if(nt?.data_message?.notification_type === "labour_report"){
					nt.data_message.data = Array.isArray(nt?.data_message?.data) && nt?.data_message?.data.length > 0 ? nt?.data_message?.data?.[0] : nt?.data_message?.data;
					window.location.href = `/reports/${nt?.data_message?.data?.project_id}/labour_log/${nt?.data_message?.data?.labour_equipment_log_id}?labour_equipment_log_date=${nt?.data_message?.data?.report_date}&name=${nt?.data_message?.data?.report_name}`;
				}else if(nt?.data_message?.notification_type === "task"){
					window.location.href = `/tasks/${nt?.data_message?.data?.project_id}/${nt?.data_message?.data?._id}`;
				}else if(nt?.data_message?.notification_type === "plan"){
					window.location.href = `/sheets/${nt?.data_message?.data?.project_id}/sheetInfo/${nt?.data_message?.data?._id}`;
				}else if(nt?.data_message?.notification_type === "survey_report"){
					window.location.href = `/reports/${nt?.data_message?.data?.project_id}/fieldReportInfo/${(nt?.data_message?.data?._id) ? (nt?.data_message?.data?._id) : (nt?.data_message?.data?.survey_report_request_id)}?report_date=${nt?.data_message?.data?.report_date}`;
				}else if(nt?.data_message?.notification_type === "no_redirect"){

				}
				// window.location.href=(nt?.data_message
				// ?.notification_type === 'task'
				// ? `/tasks/${nt?.data_message?.data?.project_id}/${nt?.data_message?.data?._id}?v=list`
				// : nt?.data_message
				// 		?.notification_type ===
				// 		'Project File Upload' ||
				// 	nt?.data_message
				// 		?.notification_type ===
				// 		'Project File Delete'
				// ? `/files/${
				// 		nt?.data_message?.data?.[0]
				// 			?.project_id ||
				// 		nt?.data_message?.data
				// 			?.project_id
				// 	}`
				// : (nt?.data_message
				// 		?.notification_type === 'Plan' || nt?.data_message
				// 		?.notification_type === 'plan_delete' || nt?.data_message
				// 		?.notification_type === 'plan_create')
				// ? `/sheets/${nt?.data_message?.data?.[0]?.project_id}/sheetInfo/${nt?.data_message?.data?.[0]?._id}`
				// : nt?.data_message
				// 		?.notification_type ===
				// 	'Report'
				// ? `/reports/${nt?.data_message?.data?.project_id}`
				// : 
				// 	'')
			})
		);
	}
	
	const getAllIds = () => {
		return dataNotification.ids ? dataNotification.ids : [];
	}

	const loadNotification = (projectId) => {
		let page;
		let par_page = 15
		if(projectId){
			if(projectNotification[projectId]){
				page = typeof projectNotification[projectId]["page"] != "undefined" ? (projectNotification[projectId]["page"] + 1) : 0;
			}else{
				page = 0;
			}
		}else{
			page = 0;
		}

		dispatch(getProjectNotification({
			user_id: userId,
			project_id: projectId,
			par_page: par_page,
			page: page
		},(resData)=>{
			let ntState = {...projectNotification};
			if(typeof ntState[projectId] == "undefined"){
				ntState[projectId] = {};
			}
			ntState[projectId].page = page;
			ntState[projectId].par_page = par_page;
			if(typeof ntState[projectId].notification != "undefined"){
				ntState[projectId].notification = [...ntState[projectId].notification, ...resData]
			}else{
				ntState[projectId].notification = resData;
			}

			setProjectNotifications(ntState);

		}))
	}
	const { icon_notification } = getSiteLanguageData('layout');
	return (
		<>
		{/* <span
			className={`nav-link mt-1 `}
			tooltip={icon_notification.tooltip}
			flow={icon_notification.tooltip_flow}>
			<img
				className={`mt-2`}
				onClick={() => setOpenNotification(!props.open)}
				alt="livefield"
				src="/images/notification.svg"
				width="22px"
				height="22px"
			/>
			<label className="badge theme-color ps-0 notification-badge">{dataNotification && dataNotification.count ? dataNotification.count : 0}</label>
		</span> */}
		<div 
		onClick={
			()=>{ props.setOpenNotification()}
		} 
		className={`notification-container ${props.open ? '' : 'd-none'}`}></div>
			<div
				id="mySidenav"
				style={{ width: props.open ? '350px' : '0px' }}
				
				
				className={`sidenav ${
					props.dashboard ? 'lf-layout-notification-margin-down' : null
				}`}>
				{/* <a className="closebtn theme-color" onClick={handleClose}>&times;</a>  ,marginTop: props.dashboard ?'':"0px"*/}
				<div className="topnav">
					<div className="row ms-0 notification-main border-bottom pb-2">
						<div className="col-9">
							<h4 className="ms-md-2 ms-4">
								Notification {' '}
								{projectWiseCount && projectWiseCount.length
									? `(${projectWiseCount.reduce((a, b)=> (b.notification_count ? b.notification_count : 0) + a,0)})`
									: ''}
							</h4>
						</div>
						<div className="col-3">
							<Dropdown>
								<Dropdown.Toggle
									variant="tranceperant"
									id="dropdown-basic"
									className="p-0 me-md-2 me-4 float-end lf-notification-toggle">
									<img
										alt="livefield"
										src="/images/notification-menu.svg"
										width="16px"
										height="16px"
									/>
								</Dropdown.Toggle>
								<Dropdown.Menu className="notification-dropdown-item shadow me-2 p-1 mb-2 bg-white rounded-7 dropdown-menu">
									<Dropdown.Item
										className="lf-layout-profile-menu"
										onClick={() => {
											dispatch(
												readNotification({
													user_id: userId,
													notification_id: getAllIds(),
													is_read: true,
												}),
											);
										}}>
										Mark All As Read
									</Dropdown.Item>
									<Dropdown.Item
										className="lf-layout-profile-menu"
										onClick={() => {
											dispatch(
												deleteNotification({
													user_id: userId,
													notification_id: "all",
												}),
											);
										}}>
										Clear All
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>
					<div className="lf-notification-scroll" 
					// ref={listInnerRef} 
					// onScroll={() => onScroll()}
					>
						{/* <div className="lf-notification-scroll load-more-notification-130"> */}
						{projectWiseCount?.map((r, rin) => {
							// let ntUnCount = r?.notifications?.filter((n)=> n?.is_read == false )?.length;
							return (
								<div key={rin+"nt"} className="container px-0">
									<div
										key={r?._id}
										className={
											collapsibleData?.[r?._id] === true ? 'pt-2 border-bottom bg-light' : 'py-2 border-bottom bg-light'
										}>
										<details>
											<summary
												className={
													collapsibleData?.[r?._id] === true
														? `lf-noti-arrow-summ-hide d-inline-block mx-3`
														: 'lf-noti-arrow-summ-hide d-inline-block mx-3'
												}>
												<div
													className="lf-link-cursor"
													variant="transparent"
													onClick={() =>{
															if(!collapsibleData?.[r?._id]){
																console.log("Open");
																setOpenId(r?._id);
																loadNotification(r?._id);
															}
															manageCollapsibleData({
																...collapsibleData,
																[r?._id]: !collapsibleData?.[r?._id],
															});

															
														}
														
													}>
													<span className="lf-notification-collabe-main">
														<span className="col-lg-2 ">
															<i className="fa-regular fa-folder ms-2"></i>
														</span>
														<span className="ms-2 ls">
															{r?.name} ({r.notification_count ? r.notification_count : 0})
														</span>
													</span>
													<i
														className={
															collapsibleData?.[r._id] === true
																? 'fas fa-caret-down ms-2'
																: 'fas fa-caret-right ms-2'
														}></i>
												</div>
											</summary>
											<div className="notification-box">
												{projectNotification?.[r._id]?.notification?.length > 0 ? (
													<>
													{projectNotification?.[r._id]?.notification?.map((nt, k) => {
														
														return (
															<div
																key={k+"pnt"}
																className={`${
																	collapsibleData?.[r._id] === true
																		? 'lf-collapsible-table'
																		: 'lf-collapsible-table-hidden'
																}`}>
																{
																	<div
																		className={`container ps-4 py-1 pe-2 border-bottom bg-white notification-item`}>
																		<div
																			className={`row lf-notification-menu rounded d-flex flex-nowrap py-2`}>
																			<div className="col-2 p-0">
																				<a
																					onClick={ (e)=> moveAction(e,nt)}
																				>
																					<img
																						alt="livefield"
																						src={ nt?.sender?.[0]?.thumbnail || nt?.sender?.[0]?.profile ||  `/images/notification_image.jpg`}
																						className="lf-notification-img ms-2 mt-1"
																					/>
																				</a>
																			</div>
																			<div className="col-9 text-start pe-0">
																				<a
																					className="text-start"
																					onClick={
																						(e)=>{
																							moveAction(e,nt);
																						}
																					}>

																					<div
																						className={`lf-notificatio-msg ${
																							nt?.is_read
																								? 'text-muted'
																								: ''
																						}`}>
																						<div>{nt?.message}</div>
																						<div
																						className={` ${
																							nt?.is_read
																								? 'nt-time-unread'
																								: 'nt-time-read'
																						}`}>
																						{moment(nt.createdAt).format("DD MMM, HH:mm")}</div>
																					</div>
																				</a>
																			</div>
																			{/* </Link> */}
																			<div className="col-1 ps-0">
																				<Dropdown>
																					<Dropdown.Toggle
																						variant="tranceperant"
																						id="dropdown-basic"
																						className="p-0 lf-notification-toggle">
																						<span className="lf-noti-menu">
																							{' '}
																							<img
																								alt="livefield"
																								src="/images/notification-menu.svg"
																								width="16px"
																							/>
																						</span>
																					</Dropdown.Toggle>
																					<Dropdown.Menu>
																						<Dropdown.Item
																							className="lf-layout-profile-menu btn"
																							onClick={() => {
																								dispatch(
																									readNotification({
																										user_id: userId,
																										notification_id: [nt?._id],
																										is_read: true,
																									}),
																								);
																							}}>
																							Mark As Read
																						</Dropdown.Item>
																						<Dropdown.Item
																							className="lf-layout-profile-menu btn border-0"
																							onClick={() => {
																								dispatch(
																									deleteNotification({
																										user_id: userId,
																										notification_id: [nt?._id],
																									},(resData)=>{
																										delete projectNotification[r._id];
																										setProjectNotifications(projectNotification);
																										loadNotification(r._id);
																									}),
																								);
																							}}>
																							Clear
																						</Dropdown.Item>
																					</Dropdown.Menu>
																				</Dropdown>
																				<span
																					className={` ${
																						nt?.is_read
																							? 'd-none'
																							: ''
																					}`}
																				>
																				<span className="theme-color ms-2">
																				<i className="fa-solid fa-circle fa-2xs"></i>
																				</span>
																					{/* <img
																				alt="livefield"
																				src="/images/book.svg"
																				width="15px"
																			/> */}
																				</span>
																			</div>
																		</div>
																	</div>
																}
															</div>
														);
													})}
													<div
														className={`mb-1 mt-1 me-3 p-1 text-center`}
														onClick={()=>loadNotification(openId)}
														>
														<span className="lf-common-btn">Load more</span>
													</div>
													</>
												) : (
													<div
														className={`mb-1 mt-1 me-3 p-1 text-center ${
															collapsibleData?.[r._id] === true
																? 'lf-collapsible-table'
																: 'lf-collapsible-table-hidden'
														}`}>
														Notification not available
													</div>
												)}
											</div>
											
										</details>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				
			</div>
		
		</>
	);
}

export default Notification;
