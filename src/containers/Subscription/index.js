import { useCallback, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import {
	Button,
	Card,
	Form,
	FormControl,
	InputGroup,
	Modal,
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useParams } from 'react-router';
import Layout from '../../components/layout';
// import Subscription_notification from '../../components/subscription';
import Subscription_notification from './subscription';
import Address from './address';
import User from './user';
import Bill from './bill';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import {
	GET_ALL_USER_CARDS,
	UPDATE_USER_CARDS,
	GET_ALL_USER_BILLING_INFO,
	DELETE_USER_CARDS,
	GET_USER_LICENSE,
	GET_LICENSE_PLANS,
	EDIT_BILLING_INFO
} from '../../store/actions/actionType';

import {
	getUserLicenceInvoice,
	updateExistingLicence,
	createRazorPayOrder,
	exitFromLicence
} from '../../store/actions/License';

import {
	getAllUserCards,
	getAllUserBillingInfo,
	updateUserCard,
} from '../../store/actions/Profile';
import getUserId, { getSiteLanguageData } from '../../commons';
import { RAZORPAY_KEY_ID } from '../../commons/constants';
import Loading from './../../components/loadig';
import { useDispatch, useSelector } from 'react-redux';
// import Licence from '../../components/plans';
// import { getUserLicence } from '../../store/actions/License';
const userId = getUserId();

function Subscription() {
	const dispatch = useDispatch();
	const { card_id } = useParams();
	const navigate = useNavigate();
	const [showEditCard, setshowEditCard] = useState(false);
	const handleCloseEditCard = () => setshowEditCard(false);
	const [setShow] = useState(false);
	const handleClose = () => setShow(false);
	const [licenceLoader, setLicenceLoader] = useState(false);

	const data = useSelector((state) => {
		return state?.profile?.[GET_ALL_USER_CARDS]?.result || [];
	});

	const info = useSelector((state) => {
		return state?.license?.[GET_USER_LICENSE]?.result;
	});

	const all_plans = useSelector((state)=>{
		return state?.license?.[GET_LICENSE_PLANS]?.result;
	});

	const planData = [];
	all_plans?.forEach((d) => {
		if (!d?.is_trial && info?.licence?.licence_period_id == d.licence_period_id) {
			planData.push(d);
		}
	});

	// useEffect(() => {
	//   if (!info || info?.length <= 0) {
	//     dispatch(getUserLicence(userId));
	//   }
	// }, []);

	const billinfo = useSelector((state) => {
		return state?.profile?.[GET_ALL_USER_BILLING_INFO]?.result || [];
	});
	
	const editCardResult = useSelector((state) => {
		return state?.project?.[UPDATE_USER_CARDS] || {};
	});
	const [infoCard, setinfoCard] = useState({
		card_id: card_id,
		user_id: userId,
		cutomer_name: '',
		card_number: '',
		card_expiry_month: '',
		card_expiry_year: '',
	});
	const handleChangeEditCard = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.value;

			setinfoCard({
				...infoCard,
				[name]: value,
			});
		},
		[infoCard],
	);

	const deleteCardResult = useSelector((state) => {
		return state?.project?.[DELETE_USER_CARDS] || {};
	});
	const updateCardData = useCallback(
		(e) => {
			e.preventDefault();
			handleCloseEditCard();
			const post = {
				user_id: infoCard?.user_id,
				card_id: infoCard?.card_id,
				cutomer_name: infoCard?.cutomer_name,
				card_number: infoCard?.card_number,
				card_expiry_month: infoCard?.card_expiry_month,
				card_expiry_year: infoCard?.card_expiry_year,
			};
			dispatch(updateUserCard(post));
		},
		[infoCard],
	);
	useEffect(() => {
		if (editCardResult?.success === true) {
			handleCloseEditCard();
			[
				'cutomer_name',
				'card_number',
				'card_expiry_month',
				'card_expiry_year',
			].every((p) => infoCard[p] === '' && data?.card_id);
			{
				setinfoCard({
					// ...infoCard,
					user_id: userId,
					card_id: card_id,
					cutomer_name: data?.cutomer_name,
					card_number: data?.card_number,
					card_expiry_month: data?.card_expiry_month,
					card_expiry_year: data?.card_expiry_year,
				});
			}
			dispatch(getAllUserCards(userId));
		}
	}, [editCardResult?.success, dispatch]);

	useEffect(() => {
		if (deleteCardResult?.success === true) {
			handleClose();
			dispatch(getAllUserCards(userId));
		}
	}, [deleteCardResult?.success, dispatch]);

	useEffect(() => {
		if (!data || data?.length <= 0) {
			dispatch(getAllUserCards(userId));
		}
	}, []);

	const updatePlan = (data) => {
		let createOrderParams = {
			"user_id":userId,
			"amount": parseInt((Number(data.payable_amount).toFixed(2)) * 100),
			"currency":"INR"
		}
		if(data.payable_amount > 0){
			dispatch(createRazorPayOrder(createOrderParams,(orderRes)=>{
				const type = data?.selected_plan?.type[0];
				var options = {
					key: RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
					amount: parseInt((Number(data.payable_amount).toFixed(2)) * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
					currency: 'INR',	
					name: 'Livefield',
					description: `${type?.licence_name} licence for add new ${data.new_count} users`,
					image: '/images/logo-sm.png',
					"order_id": orderRes?.result?.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
					handler: function (response) {
						const post = {
							...data,
							razorpay_order_id:response.razorpay_order_id,
							razorpay_payment_id:response.razorpay_payment_id,
							razorpay_signature:response.razorpay_signature
						};
						setLicenceLoader(true);
						dispatch(updateExistingLicence(post,(dd)=>{
							setLicenceLoader(false);
							window.location.href = "/subscription";
						}));							
					},
					// "prefill": {
					//   "name": "Gaurav Kumar",
					//   "email": "gaurav.kumar@example.com",
					//   "contact": "9999999999"
					// },
					notes: {
						address: 'Razorpay Corporate Office',
					},
					theme: {
						color: '#f97316',
					},
				};
				var rzp1 = new window.Razorpay(options);
				rzp1.on('payment.failed', function (response) {
					console.log(response, "response response on payment faild");
					alert(response.error.code);
				});
				rzp1.open();
			}));
		}else{
			const post = data;
			dispatch(updateExistingLicence(post,(dd)=>{
				window.location.href = "/subscription";
			}));
		}
		

	}

	useEffect(() => {
		if (!billinfo || billinfo?.length <= 0) {
			dispatch(getAllUserBillingInfo(userId));
		}
	}, []);

	/* useEffect(()=>{
		dispatch(getAllUserBillingInfo(userId));
	},[billEditData]) */

	const handleExitUser = (userLicence) => {
		dispatch(exitFromLicence({
			user_id:userId,
			user_licences_id:userLicence._id
		}))
	}

	const downloadInvoice = (transaction_id)=>{
		dispatch(getUserLicenceInvoice(transaction_id, (rsData)=>{
			if(rsData && rsData.result && rsData.result.file) window.open(rsData.result.file, "_blank");
		}));
	}

	const csvData = info?.payment?.map((tr) => {
		return ({
			"Payment Date":moment(tr.createdAt).format('DD-MM-YYYY'),
			"Invoice id":tr.invoice_id,
			"Transaction Type":"Charge",
			"Transaction ID":tr?.payment_id,
			"Transaction Amount":tr.amount?.toFixed(2)+" INR"
		});
	})

	const {
		btn_download_CSV,
		licence,
		subscription,
		Purchase_Plan,
		current_plan,
		user,
		users,
		estimated_bill,
		renewal_date,
		billing_settings,
		home_or_business,
		transaction_history,
		address_name,
		address,
		gstin,
		pan_card,
		payment_date,
		invoice_id,
		transction_type,
		payment_mathod,
		transaction_id,
		transction_amount,
		exit_from_licence,
		update_card,
		card_holder_name,
		card_number,valid_upto,save_card,
		card_name,
	} = getSiteLanguageData('subscription');
	const { dashboard, email,month,year } = getSiteLanguageData('commons');

	const {
		purchased
	} = getSiteLanguageData('storeroom');
	return (
		<Layout nosidebar={true}>
			<section className="grey-bg">
				<div id="page-content-wrapper">
					{/* 					<section className="lf-dashboard-toolbar">
						<div className="container">
							<div className="row">
								<div className="col-sm-6 p-2">
									<div className="col-sm-12">
										<h3>{licence?.text}</h3>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="col-sm-12">
										<nav aria-label="breadcrumb text-end">
											<ol className="breadcrumb mt-1">
												<li className="breadcrumb-item">
													<a href="/dashboard">{dashboard?.text}</a>
												</li>
												<li
													className="breadcrumb-item active"
													aria-current="page">
													{licence?.text}
												</li>
											</ol>
										</nav>
									</div>
								</div>
							</div>
						</div>
					</section> */}
					<div className="container">
						<div className="col-sm-12 pt-4">
							<div className="row"></div>
						</div>
						<div className="container ">
							<div className="row">
								<div className="col-sm-12 ">
									<div className="row"></div>
								</div>
								<div className="col-sm-12 subscription-detail mb-1 mt-3 payment-mathod">
									<div className="white-box">
										<Card.Body>
											<div className="row ">
												<div className="col-12">
													<div className="d-flex align-items-center">
														<div className="float-start d-inline-block">
															<h3 className="title-text-color mb-0">
																{subscription?.text}
															</h3>
														</div>
														<div className="ms-auto float-end d-md-inline-block">
															{userId == info?.owned_by ? (
															<>
																{info?.is_trial === true ? (
																	<>
																	{/* <button onClick={()=>navigate("/cart")} type="button" className="btn theme-btn">
																			{Purchase_Plan?.text}
																		</button> */}
																	</>
																) : (
																	<>
																	<div className="d-flex align-items-center">
																		<div className="float-start me-3 d-inline-block">
																			<User 
																				planData={planData} 
																				info={info} 
																				updatePlan={updatePlan}
																			/>
																		</div>

																		<div className="float-start d-inline-block">
																			<Bill 
																				screen="subscription"
																				is_recurring={true}
																				planData={planData} 
																				info={info}
																				updatePlan={updatePlan}
																			/>
																			
																		</div>

																	</div>
																		
																		
																	</>
																)}
															</>
															) : (
																<span
																	className="btn theme-color p-auto float-end btn-style"
																	onClick={()=>{
																		Swal.fire({
																			title: `Exit License?`,
																			text: `Are you sure to exit from the licence `,
																			icon: 'question',
																			reverseButtons: true,
																			showCancelButton: true,
																			confirmButtonColor: '#dc3545',
																			cancelButtonColor: '#28a745',
																			confirmButtonText:
																				'Yes, exit!',
																		}).then((result) => {
																			if(result.isConfirmed){
																				handleExitUser(info);
																			}
																		});
																	}}>
																	{exit_from_licence.text}
																</span>
															)}
														</div>
													</div>
												</div>
											</div>
											<hr style={{marginLeft:'-20px', marginRight:'-20px'}} />
											<Card.Text>
												<div className="mb-2">
													<h6>
														<span className="text-bold me-2 subscription-text-label">
															{current_plan?.text}
														</span>
														<span>
															{info?.licence?.type?.[0]?.licence_name}
														</span>
													</h6>
												</div>
												<div className="mb-2">
													<h6>
														<span className="text-bold me-2 subscription-text-label">
															{users?.text}
														</span>
														<span>
															{info?.count} {purchased.text},
															{info?.users?.length +
																parseInt(info?.invition_hold_count)}{' '}
															in use,{' '}
														</span>
														<span className="text-success">
															{parseInt(info?.count) -
																(info?.users?.length +
																parseInt(info?.invition_hold_count))}{' '}
															Remaining
														</span>
													</h6>
												</div>
												{!info?.is_trial === true ? (
													<div className="mb-2 ">
														<h6>
															<span className="text-bold me-2 subscription-text-label">
																{estimated_bill?.text}
															</span>
															<span className="text-capitalize">
																(&#8377;) {info?.licence?.amount} / {' '}
																{info?.licence?.period?.[0]?.type}{' '} / {user?.text} {' '}
															</span>
														</h6>
													</div>
												) : (
													''
												)}
												<div className="mb-2">
													<h6>
														<span className="text-bold me-2 subscription-text-label">
															{renewal_date?.text}
														</span>
														<span>
															{' '}
															{moment(info?.end_date).add(1,"days").format('YYYY-MM-DD')}{' '}
														</span>
													</h6>
												</div>
												{!info?.is_trial === true ? (
													<div className="mt-3 ms-3 col-sm-3">
														<Subscription_notification />
													</div>
												) : (
													''
												)}
											</Card.Text>
										</Card.Body>
									</div>
								</div>
								{/* <div className="col-sm-12 subscription-detail mt-1 mb-1 payment-mathod">
                <Card className="bg-white">
                  <Card.Body>
                    <div className="row">
                      <div className="col-sm-8">
                        <h3 className="title-text-color">Payment Methods</h3>
                        <h6>Please enter your preferred payment method below.you can use a credit/debit card or NetBanking</h6>
                      </div>
                      <div className="col-sm-4 float-end">
                        <span href="/dashboard" className="btn theme-btn m-auto float-end" >Make payment</span>
                      </div>
                    </div>
                    <Card.Text>
                      <Card.Header className="card-payment-mathod">
                        <Nav variant="tabs" defaultActiveKey="#first">
                          <Nav.Item c="active"> 
                            <Nav.Link onClick={() => handleUseNetbanking(!useNetbankig)} className="payment-btn text-dark  bg-active-btn "><h5 className="lf-banking-navlink">Credit/Debit Card</h5></Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link onClick={() => handleUseNetbanking(!useNetbankig)} className="text-dark"><h5>NetBanking</h5></Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </Card.Header>
                      {
                        !useNetbankig ?
                          <Card className="payment-card">
                            <Card.Body>
                              <div className="row">
                                <div className="col-sm-10">
                                  <span className=" me-2 ">Cards will be charged either at the end month or whenever your balance exceeds the usage theshold.All major credit / debit cards accepted.</span></div>
                                <div className="col-sm-2">
                                  <Cards />
                                </div>
                              </div>
                              {
                                data?.map((c) => {
                                  return (
                                    <table className="table  mt-2 ">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <div className="row">
                                              <div className="col-sm-1 text-start">
                                                <h6><span><img alt="livefield" src="/images/card.png" width="65px" className="img-cards p-1" /></span>

                                                </h6>
                                              </div>
                                              <div className="col-sm-9">
                                                <h6><span className="text-bold ">{c.cutomer_name} -{c.card_number} </span>
                                                  {/* <span className="budge default-payment-mathod">Default</span> * /}
                                                  <p className="">
                                                    Valid UpTo <b> {c.card_expiry_month}/{c.card_expiry_year}</b>
                                                  </p>
                                                </h6>

                                              </div>
                                              <div className="col-sm-2 ">
                                                <Dropdown className="me-4">
                                                  <Dropdown.Toggle variant="transparent" className="card-add float-end theme-color btn-style py-0 px-2 mt-2" >
                                                    More
                                                  </Dropdown.Toggle>
                                                  <Dropdown.Menu className="pull-left col-sm-1">
                                                    <Dropdown.Item className="card-add me-5" onClick={() => handleShowEditCard({ cardData : c })}>Edit</Dropdown.Item>
                                                    <Dropdown.Item className="card-add me-5"
                                                      onClick={() => {
                                                        const isConfirmDelete = window.confirm(`are you sure to Delete card`)
                                                        if (isConfirmDelete) {
                                                          dispatch(
                                                            deleteCard({
                                                              "card_id": [c?._id]
                                                            })
                                                          )
                                                        }
                                                      }
                                                      }
                                                    >Delete</Dropdown.Item>
                                                  </Dropdown.Menu>
                                                </Dropdown>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>

                                      </tbody>
                                    </table>
                                  );
                                })
                              }
                            </Card.Body>
                          </Card>
                          :
                          <Card className="payment-card">
                            <Card.Body>
                              <div className="row">
                                <div className="col-sm-10">
                                  <span className=" me-2 ">Cards will be charged either at the end month or whenever your balance exceeds the usage theshold.All major credit / debit cards accepted.</span></div>
                                <div className="col-sm-2">
                                  <Bank />
                                </div>
                              </div>
                              <table className="table  mt-2 ">
                                <tbody>
                                  <tr>
                                    <td>
                                      <div className="row">
                                        <div className="col-sm-1 text-start">
                                          <h6><span><img alt="livefield" src="/images/bank.png" width="65px" className="img-cards p-1" /></span>

                                          </h6>
                                        </div>
                                        <div className="col-sm-9">
                                          <h6><span className="text-bold ">State Bank Of India - xxxx xxxx xxxx 2548</span> <span className="budge default-payment-mathod">Default</span><p className="">
                                            Account Holder Name
                                          </p>
                                          </h6>
                                        </div>
                                        <div className="col-sm-2">
                                          <Dropdown className="">
                                            <Dropdown.Toggle variant="transparent" className="card-add float-end theme-color btn-style py-0 px-2 mt-3" >
                                              more
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                              <Dropdown.Item className="card-add" href="#/action-1">Edit</Dropdown.Item>
                                              <Dropdown.Item className="card-add" href="#/action-2">Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="row">
                                        <div className="col-sm-1 text-start">
                                          <h6><span><img alt="livefield" src="/images/bank.png" width="65px" className="img-cards p-1" /></span>

                                          </h6>
                                        </div>
                                        <div className="col-sm-9">
                                          <h6><span className="text-bold ">State Bank Of India - xxxx xxxx xxxx 2548</span><p className="">
                                            Account Holder Name
                                          </p></h6>
                                        </div>
                                        <div className="col-sm-2">
                                          <Dropdown>
                                            <Dropdown.Toggle variant="transparent" className="card-add float-end theme-color btn-style py-0 px-2 mt-3" >
                                              more
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                              <Dropdown.Item className="card-add" href="#/action-1">Edit</Dropdown.Item>
                                              <Dropdown.Item className="card-add" href="#/action-2">Delete</Dropdown.Item>
                                              <Dropdown.Item className="card-add" href="#/action-3">Default</Dropdown.Item>
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div className="row">
                                        <div className="col-sm-1 text-start">
                                          <h6><span><img alt="livefield" src="/images/bank.png" width="65px" className="img-cards p-1" /></span>
                                          </h6>
                                        </div>
                                        <div className="col-sm-9">
                                          <h6><span className="text-bold ">State Bank Of India - xxxx xxxx xxxx 2548</span><p className="">
                                            Account Holder Name
                                          </p></h6>
                                        </div>
                                        <div className="col-sm-2">
                                          <Dropdown>
                                            <Dropdown.Toggle variant="transparent" className="card-add float-end theme-color btn-style py-0 px-2 mt-3" >
                                              more
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                              <Dropdown.Item className="card-add" href="#/action-1">Edit</Dropdown.Item>
                                              <Dropdown.Item className="card-add" href="#/action-2">Delete</Dropdown.Item>
                                              <Dropdown.Item className="card-add" href="#/action-3">Default</Dropdown.Item>
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </Card.Body>
                          </Card>
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div> */}
			  					
								{!info?.is_trial && userId == info?.owned_by ? (
									<div className="col-sm-12 subscription-detail my-2 payment-mathod">
										<div className="white-box">
											<Card.Body>
												<div className="row ">
													<div className="col-sm-10">
														<h3 className="title-text-color">
															{billing_settings?.text}
														</h3>
														<h6>{home_or_business?.text}</h6>
													</div>
													<div className="col-sm-2 float-end">
														<div>
														{billinfo?.map((b) => {
															return (
															<Address  billData={b}/>
															);
														})}
														</div>
													</div>
												</div>
												{billinfo?.map((b) => {
													return (
														<Card.Text>
														{/* 	<Address billData={b} /> */}
															<hr />
															<div className="mb-3">
																<h6 className=" me-2 text-secondary">
																	<span className="">{address_name?.text}</span>
																	<span className="ms-2">
																		{b.billing_name}
																	</span>{' '}
																</h6>
															</div>
															<div className="mb-3">
																<h6 className=" me-2 text-secondary">
																	<span>{address?.text}</span>
																	<span className="ms-2">
																		{b.address}, {b.city}, {b.state},{' '}
																		{b.country}-{b.zipcode}
																	</span>{' '}
																</h6>
															</div>
															<div className="mb-3">
																<h6 className=" me-2 text-secondary">
																	<span> {email?.text}: </span>
																	<span className="ms-2">{b.email}</span>{' '}
																</h6>
															</div>
															
															{
																b.gsitn ? (
																	<div className="mb-3">
																		<h6 className=" me-2 text-secondary">
																			<span>{gstin?.text}</span>
																			<span className="ms-2">{b.gsitn}</span>{' '}
																		</h6>
																	</div>
																) : (
																	<div className="mb-3">
																		<h6 className=" me-2 text-secondary">
																			<span> {pan_card?.text}</span>
																			<span className="ms-2">
																				{b.pan_card}
																			</span>{' '}
																		</h6>
																	</div>
																)
															}
															
														</Card.Text>
													);
												})}
											</Card.Body>
										</div>
									</div>
								) : (
									''
								)}
								{!info?.is_trial && userId == info?.owned_by ? (
									<div className="col-sm-12 subscription-detail mb-2 payment-mathod ">
										<div className="white-box">
											<Card.Body>
												<div className="row">
													<div className="col-sm-8">
														<h3 className="title-text-color">
															{transaction_history?.text}
														</h3>
													</div>
													<div className="col-sm-4 text-end">
														
														{/* <span
															onClick={(e)=>downloadInvoice(info?._id)}
															className="btn theme-color p-auto btn-style card-add">
															{' '}
															Print
														</span> */}
														<CSVLink
															
															data={csvData}
															filename={'transaction'}
															target="_blank">
															<span
															href="/dashboard"
															className="btn theme-btn p-auto ms-2">
															{' '}
															{btn_download_CSV?.text}
														</span>
														</CSVLink>
														
													</div>
												</div>
												<hr />
												<Card.Text>
													<div className="table-responsive">
														<table className="table table-hover mb-1 white-table mt-2">
															<thead>
																<tr className="bg-light text-nowrap">
																	<th>{payment_date?.text} </th>
																	<th>{invoice_id?.text}</th>
																	<th>{transction_type?.text} </th>
																	<th>{transaction_id?.text}</th>
																	<th className='text-end'>{transction_amount?.text}</th>
																</tr>
															</thead>
															<tbody>
																{info?.payment?.map((tr) => {
																	return (
																		<tr>
																			<td>
																				{moment(tr.createdAt).format(
																					'YYYY-MM-DD',
																				)}
																			</td>
																			<td>
																				{tr.invoice_url ? (
																					<a className="pointer" href={tr.invoice_url} target={`_blank`}>{tr.invoice_id}</a>
																				) : (
																					<a className="pointer" onClick={()=>downloadInvoice(tr._id)}>{tr.invoice_id}</a>
																				)}
																				
																			</td>
																			<td className=" text-capitalize">Charge</td>
																			<td>
																				{tr.payment_id}
																			</td>
																			<td className="text-end">
																				{tr.amount?.toFixed(2)}
																			</td>
																		</tr>
																	);
																})}
																{/* <tr>
                            <td>06-09-2021</td>
                            <td><a href="#">1</a></td>
                            <td>Refund</td>
                            <td> Bank Redirect</td>
                            <td className="text-center">100 INR</td>
                          </tr> */}
															</tbody>
														</table>
													</div>
												</Card.Text>
											</Card.Body>
										</div>
									</div>
								) : (
									''
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
			<Modal show={showEditCard} onHide={handleCloseEditCard} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>
						<h3>{update_card.text}</h3>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={updateCardData}>
						<div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Card Name" className="ms-1">
									{card_holder_name.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										placeholder={card_name.text}
										aria-label="Card Name"
										type="text"
										name="cutomer_name"
										autoComplete="off"
										onChange={(e) => handleChangeEditCard(e)}
										value={infoCard.cutomer_name}
										required
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Card Number" className="ms-1">
									{card_number.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										placeholder={card_number.text}
										type="text"
										name="card_number"
										pattern="[0-9]{16}"
										autoComplete="off"
										aria-label="Recipient's card number"
										onChange={(e) => handleChangeEditCard(e)}
										value={infoCard.card_number}
										required
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group col-sm-9">
								<Form.Label htmlFor="Valid upto" className="ms-1">
									{valid_upto.text}
								</Form.Label>
								<InputGroup className="">
									<Form.Label htmlFor="month" className="ms-1">
										{month?.text}
									</Form.Label>
									<select
										name="card_expiry_month"
										className="form-control"
										onChange={(e) => handleChangeEditCard(e)}
										value={infoCard.card_expiry_month}>
										<option name="card_expiry_month">Select</option>
										{new Array(12).fill(1).map((x, k) => (
											<option name="card_expiry_month" value={k + 1}>
												{k + 1}
											</option>
										))}
									</select>
									<Form.Label htmlFor="year" className="ms-1">
										{year.text}
									</Form.Label>
									<select
										className="form-control"
										name="card_expiry_year"
										onChange={(e) => handleChangeEditCard(e)}
										value={infoCard.card_expiry_year}>
										<option name="card_expiry_year">Select</option>
										{new Array(10).fill(1).map((x, k) => (
											<option
												name="card_expiry_year"
												value={k + new Date().getUTCFullYear()}>
												{k + new Date().getUTCFullYear()}
											</option>
										))}
									</select>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="col-sm-12 float-end">
								<Button
									type="submit"
									className="btn  theme-btn  btn-block float-end ms-2 ">
									{update_card.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
			{
				licenceLoader && (<Loading />)
			}
		</Layout>
	);
}
export default Subscription;
