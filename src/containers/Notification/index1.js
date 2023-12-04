import { useEffect, useState } from 'react';
import { Dropdown, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { GET_NOTIFICATION } from '../../store/actions/actionType';
import { getNotification } from '../../store/actions/Notification';
import getUserId from '../../commons';

// import { Row } from 'react-bootstrap';
// import { Button,Modal } from "react-bootstrap";
// import { Link } from 'react-router-dom';

function Notification(props) {
	const userId = getUserId();
	// const [open, setOpen] = useState(props.open);
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [collapsibleData, manageCollapsibleData] = useState({});
	const data = useSelector((state) => {
		return state?.notification?.[GET_NOTIFICATION]?.result || [];
	});

	useEffect(() => {
		if (data?.length <= 0) {
			dispatch(getNotification(userId));
		}
	}, [data?.length, dispatch]);
	return (
		<>
			<span className="nav-link  mt-2">
				<img
					onClick={handleShow}
					alt="livefield"
					src="/images/notification.svg"
					width="12px"
					height="12px"
				/>
			</span>
			<Modal centered show={show} onHide={handleClose} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>Notification</Modal.Title>
					<span>
						<Dropdown className="col-lg-3">
							<Dropdown.Toggle
								variant="tranceperant"
								id="dropdown-basic"
								className="lf-notification-toggle">
								<img
									src="/images/notification-menu.svg"
									className="image-sm"
									width="25px"
									height="25px"
								/>
							</Dropdown.Toggle>
							<Dropdown.Menu className="notification-dropdown-item">
								<Dropdown.Item href="#/action-1">
									Mark All As Read
								</Dropdown.Item>
								<Dropdown.Item href="#/action-2">Clear All</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</span>
				</Modal.Header>
				<Modal.Body>
					<div className="">
						{data?.map((r) => {
							return (
								<div
									key={r._id}
									className={
										collapsibleData?.[r._id] === true
											? 'container mt-4 pb-3 lf-notification-sampleproject-bgc'
											: 'container mt-4'
									}>
									<span
										className="text-dark lf-link-cursor"
										variant="transparent"
										onClick={() =>
											manageCollapsibleData({
												...collapsibleData,
												[r._id]: !collapsibleData?.[r._id],
											})
										}>
										<span className="lf-notification-collabe-main">
											<span className="col-lg-2 ">
												<i className="fa-regular fa-folder "></i>
											</span>
											{r?.data_message?.name}
										</span>
										<i
											className={
												collapsibleData?.[r._id] === true
													? 'fas fa-caret-down ms-2'
													: 'fas fa-caret-right ms-2'
											}></i>
									</span>
									<div
										className={`  mb-1 mt-1 me-3 ${
											collapsibleData?.[r._id] === true
												? 'lf-collapsible-table'
												: 'lf-collapsible-table-hidden'
										}`}>
										{
											<div>
												<div className=" lf-notification-content lf-notification-box  mt-1 me-5">
													<Row className="p-2 me-5 ">
														<span className="ms-4 ">
															<img
																src="/images/notification_image.jpg"
																className="lf-image-sm-notification me-2 lf-notification-main "
															/>
														</span>
														<span className="col-lg-7 ms-1 lf-notification-msg">
															<span className="lf-notification-data">
																{r.message}
															</span>
															<div className="lf-notification-action ">
																<Dropdown>
																	<Dropdown.Toggle
																		variant="tranceperant"
																		id="dropdown-basic"
																		className="lf-notification-toggle">
																		<span className="lf-stared-notification-icon lf-notification-box-setting-icon ">
																			<img
																				src="/images/notification-menu.svg"
																				width="17px"
																				className="ms-4 "
																			/>{' '}
																		</span>
																	</Dropdown.Toggle>
																	<Dropdown.Menu>
																		<Dropdown.Item href="#/action-1">
																			Mark As Read
																		</Dropdown.Item>
																		<Dropdown.Item href="#/action-2">
																			Clear All
																		</Dropdown.Item>
																	</Dropdown.Menu>
																</Dropdown>
															</div>
														</span>
														<span className=" lf-img-sm-book">
															<img
																alt="livefield"
																src="/images/book.svg"
																width="15px"
																className=""
															/>
														</span>
													</Row>
												</div>
												<div className=" lf-notification-content lf-notification-box    mt-3 me-5">
													<Row className="p-2 row ">
														<span className="ms-4 ">
															<img
																src="/images/notification_image.jpg"
																className="lf-image-sm-notification lf-notification-main me-2 "
															/>
														</span>
														<span className="col-lg-7 ms-1 lf-notification-msg">
															<span className="lf-notification-data">
																Rhea assigned you to 5 task{' '}
															</span>
														</span>
													</Row>
													<Row className="py-1 row">
														<div className="col-sm-11 mt-1 m-auto">
															<span className=" theme-btn  btn-sm py-1 float-end me-5 ">
																no
															</span>
															<span className=" theme-btn btn-sm py-1 float-end me-1">
																yes
															</span>
														</div>
													</Row>
												</div>
												<div className=" lf-notification-content lf-notification-box  mt-3 me-5">
													<Row className="p-2 me-5 ">
														<span className="ms-4 ">
															<img
																src="/images/notification_image.jpg"
																className="lf-image-sm-notification me-2 lf-notification-main "
															/>
														</span>
														<span className="col-lg-7 ms-1 lf-notification-msg">
															<span className="lf-notification-data">
																Rhea assigned you to 5 task{' '}
															</span>
															<div className="lf-notification-action ">
																<Dropdown>
																	<Dropdown.Toggle
																		variant="tranceperant"
																		id="dropdown-basic"
																		className="lf-notification-toggle">
																		<span className="lf-stared-notification-icon lf-notification-box-setting-icon ">
																			<img
																				src="/images/notification-menu.svg"
																				width="17px"
																				className="ms-4 "
																			/>{' '}
																		</span>
																	</Dropdown.Toggle>
																	<Dropdown.Menu>
																		<Dropdown.Item href="#/action-1">
																			Mark As Read
																		</Dropdown.Item>
																		<Dropdown.Item href="#/action-2">
																			Clear All
																		</Dropdown.Item>
																	</Dropdown.Menu>
																</Dropdown>
															</div>
														</span>
														<span className=" lf-img-sm-book">
															<img
																alt="livefield"
																src="/images/book.svg"
																width="15px"
																className=""
															/>
														</span>
													</Row>
												</div>
											</div>
										}
									</div>
								</div>
							);
						})}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default Notification;
