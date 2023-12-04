import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import getUserId from '../../commons';
import {
	GET_NOTIFICATION,
	GET_NOTIFICATION_BY_PROJECT,
} from '../../store/actions/actionType';
import {
	deleteNotification,
	getNotification,
	getNotificationByProject,
	readNotification,
} from '../../store/actions/Notification';
// import { Row } from 'react-bootstrap';
// import { Button,Modal } from "react-bootstrap";
// import { Link } from 'react-router-dom';

function Notification(props) {
	const userId = getUserId();
	const dispatch = useDispatch();
	// const [open, setOpen] = useState(props.open);
	const [collapsibleData, manageCollapsibleData] = useState({});
	const { project_id } = useParams();
	// const handleClose = () => {
	//   setOpen(!open)
	// };
	const data = useSelector((state) => {
		return state?.notification?.[GET_NOTIFICATION_BY_PROJECT]?.result || [];
		// return state?.notification?.[GET_NOTIFICATION]?.result || []
	});
	const noti = [];
	data.forEach((s) => {
		noti.push(s?._id);
	});
	useEffect(() => {
		if (data?.length <= 0) {
			// dispatch(getNotification(userId));
			dispatch(getNotificationByProject(userId));
		}
	}, [data?.length, dispatch]);

	return (
		<>
			<div
				id="mySidenav"
				style={{ width: props.open ? '350px' : '0px' }}
				className={`sidenav ${
					props.dashboard ? 'lf-layout-notification-margin-down' : null
				}`}>
				{/* <a className="closebtn theme-color" onClick={handleClose}>&times;</a>  ,marginTop: props.dashboard ?'':"0px"*/}
				<div className="topnav">
					<div className="row ms-0 notification-main border-bottom">
						<div className="col-9">
							<h3 className="ms-md-2 ms-4 mt-2">
								Notification {data?.length === 0 ? '' : `(${data?.length})`}
							</h3>
						</div>
						<div className="col-3">
							<Dropdown>
								<Dropdown.Toggle
									variant="tranceperant"
									id="dropdown-basic"
									className="px-0 me-md-2 me-4 mt-md-1 float-end lf-notification-toggle">
									<img
										alt="livefield"
										src="/images/notification-menu.svg"
										width="25px"
										height="25px"
									/>
								</Dropdown.Toggle>
								<Dropdown.Menu className="notification-dropdown-item shadow me-2 p-1 mb-2 bg-white rounded-7 dropdown-menu">
									<Dropdown.Item
										className="lf-layout-profile-menu"
										onClick={() => {
											dispatch(
												readNotification({
													user_id: userId,
													notification_id: noti,
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
													notification_id: noti,
												}),
											);
										}}>
										Clear All
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>
					<div className="lf-notification-scroll load-more-notification-130">
						{data?.map((r) => {
							return (
								<div className="container">
									<div
										key={r?._id}
										className={
											collapsibleData?.[r?._id] === true
												? 'm-2 pb-3 lf-notification-sampleproject-bgc'
												: 'container m-2'
										}
										style={r?.is_read === true ? { opacity: 0.7 } : {}}>
										<details>
											<summary className="lf-noti-arrow-summ-hide d-inline-block">
												<span
													className="text-dark lf-link-cursor"
													variant="transparent"
													onClick={() =>
														manageCollapsibleData({
															...collapsibleData,
															[r?._id]: !collapsibleData?.[r?._id],
														})
													}>
													<span className="lf-notification-collabe-main">
														<span className="col-lg-2 ">
															<i className="fa-regular fa-folder ms-2 "></i>
														</span>
														<span className="ms-2">{r?.name}</span>
													</span>
													<i
														className={
															collapsibleData?.[r._id] === true
																? 'fas fa-caret-down ms-2'
																: 'fas fa-caret-right ms-2'
														}></i>
												</span>
											</summary>
											<div
												className={`mb-1 mt-1 me-3 ${
													collapsibleData?.[r._id] === true
														? 'lf-collapsible-table'
														: 'lf-collapsible-table-hidden'
												}`}>
												{
													<div className="container ms-2">
														<div
															className={`row lf-notification-menu bg-white rounded d-flex flex-nowrap ${
																r.is_read === false
																	? 'shadow-lg'
																	: 'shadow-none'
															}`}>
															<div className="col-1 ps-2 pt-1 p-0">
																<img
																	alt="livefield"
																	src="/images/notification_image.jpg"
																	className="lf-notification-img"
																/>
															</div>
															<div className="col-8">
																<span className="lf-notificatio-msg">
																	{r.message}
																</span>
															</div>
															<div className="col-1">
																<Dropdown>
																	<Dropdown.Toggle
																		variant="tranceperant"
																		id="dropdown-basic"
																		className="px-0 lf-notification-toggle">
																		<span className="lf-noti-menu">
																			{' '}
																			<img
																				alt="livefield"
																				src="/images/notification-menu.svg"
																				width="17px"
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
																						notification_id: [r._id],
																						is_read: true,
																					}),
																				);
																			}}>
																			Mark As Read
																		</Dropdown.Item>
																		<Dropdown.Item
																			className="lf-layout-profile-menu"
																			onClick={() => {
																				dispatch(
																					deleteNotification({
																						user_id: userId,
																						notification_id: [r._id],
																					}),
																				);
																			}}>
																			Clear
																		</Dropdown.Item>
																	</Dropdown.Menu>
																</Dropdown>
															</div>
															<div className="co-2 mt-2 ms-2">
																<img
																	alt="livefield"
																	src="/images/book.svg"
																	width="15px"
																/>
															</div>
														</div>
														{/* <div className="row shadow-lg bg-white rounded mt-1">
                            <div className="col-1 ps-2 pt-1 p-0">
                              <img alt="livefield" src="/images/notification_image.jpg" className="lf-notification-img" />

                            </div>
                            <div className="col-11">
                              <span>Rhea assigned you to 5 task </span>
                            </div>
                            <div className="row mt-3 ">
                              <div className="col-12  lf-notification-btn">
                                <span className="lf-notification-yes-no-btn me-2 btn-sm py-1">yes</span>
                                <span className="lf-notification-yes-no-btn  btn-sm py-1">no</span>
                              </div>
                            </div>
                          </div> */}
													</div>

													// <div className="container">
													//   <div className="row lf-notification-content lf-notification-box  mt-1">
													//     <div className="col">
													//       <span className="ms-4 ">
													//         <img src="/images/notification_image.jpg" className="lf-image-sm-notification me-2 lf-notification-main" />
													//       </span>
													//       <span className="col ms-1 lf-notification-msg">
													//         <span className="lf-notification-data">{r.message}</span>
													//         <div className="lf-notification-action ">
													//           <Dropdown >
													//             <Dropdown.Toggle variant="tranceperant" id="dropdown-basic" className="lf-notification-toggle">
													//               <span className="lf-stared-notification-icon lf-notification-box-setting-icon "><img src="/images/notification-menu.svg" width="17px" className="ms-4" /> </span>
													//             </Dropdown.Toggle>
													//             <Dropdown.Menu >
													//               <Dropdown.Item href="#/action-1">Mark As Read</Dropdown.Item>
													//               <Dropdown.Item href="#/action-2">Clear All</Dropdown.Item>
													//             </Dropdown.Menu>
													//           </Dropdown>
													//         </div>
													//       </span>
													//       <span className=" lf-img-sm-book">
													//         <img alt="livefield" src="/images/book.svg" width="15px" className="" />
													//       </span>
													//     </div>
													//   </div>
													//   <div className="row lf-notification-content lf-notification-box mt-3">
													//     <div className="col">
													//       <span>
													//         <img src="/images/notification_image.jpg" className="lf-image-sm-notification lf-notification-main me-2" />
													//       </span>
													//       <span className="col">
													//         <span className="lf-notification-data">Rhea assigned you to 5 task </span>
													//       </span>
													//     </div>
													//     <div className="row mt-5">
													//       <div className="col">
													//         <span className=" theme-btn  btn-sm py-1 float-end me-5 ">no</span>
													//         <span className=" theme-btn btn-sm py-1 float-end me-1">yes</span>
													//       </div>
													//     </div>
													//   </div>
													//   <div className=" lf-notification-content lf-notification-box  mt-3">
													//     <Row className="p-2">
													//       <span className="ms-4 ">
													//         <img src="/images/notification_image.jpg" className="lf-image-sm-notification me-2 lf-notification-main" />
													//       </span>
													//       <span className="col-lg-7 ms-1 lf-notification-msg">
													//         <span className="lf-notification-data">Rhea assigned you to 5 task </span>
													//         <div className="lf-notification-action ">
													//           <Dropdown >
													//             <Dropdown.Toggle variant="tranceperant" id="dropdown-basic" className="lf-notification-toggle">
													//               <span className="lf-stared-notification-icon lf-notification-box-setting-icon "><img src="/images/notification-menu.svg" width="17px" className="ms-4" /> </span>
													//             </Dropdown.Toggle>
													//             <Dropdown.Menu >
													//               <Dropdown.Item href="#/action-1">Mark As Read</Dropdown.Item>
													//               <Dropdown.Item href="#/action-2">Clear All</Dropdown.Item>
													//             </Dropdown.Menu>
													//           </Dropdown>
													//         </div>
													//       </span>
													//       <span className=" lf-img-sm-book">
													//         <img alt="livefield" src="/images/book.svg" width="15px" className="" />
													//       </span>
													//     </Row>
													//   </div>
													// </div>
												}
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
