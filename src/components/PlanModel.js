import React, { useState, useEffect, useDis } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Card,
	Col,
	Form,
	Row,
	Button,
	Modal,
	InputGroup,
	FormControl,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import {
	GET_ALL_USER_BILLING_INFO,
	GET_LICENSE_PLANS,
	GET_USER_LICENSE,
} from '../store/actions/actionType';
import {
	getLicensePlans,
	getUserLicence,
	purchaseLicence,
} from '../store/actions/License';
import getUserId, { getSiteLanguageData } from '../commons';
import PlanBillingInfo from './planBillingInfo';
import { getAllUserBillingInfo } from '../store/actions/Profile';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';


export function Cart({
	data,
	planData,
	licence_period_id,
	setLPI,
	billinfo,
	selected_plan,
	setUser,
	userCount,
	...props
}) {
	const type = selected_plan?.type[0];
	const period = selected_plan?.period[0];
	let end_date = '';
	const date = new Date();
	const totalPrice = parseInt(userCount) * parseInt(selected_plan?.amount);
	if (period.type === 'month') {
		end_date = new Date(date.setMonth(date.getMonth() + period.duration));
	} else if (period.type === 'day') {
		end_date = new Date(date.setDate(date.getDate() + period.duration));
	} else if (period.type === 'year') {
		end_date = new Date(date.setFullYear(date.getFullYear() + period.duration));
	}
	const {
		users_can_subscribe,
		cart_details,
		subscription_term_start_date,
		time_Period,
		next_due_date,
		off,
		number_Of_license,
		recurring,
		do_you_want_to_align_bill_on_particular_day,
		select_your_billing_day_of_each_month,
		yes,
		no,
		total_payment,
		use_livefield_wallet,
		back,
		for_more_details_contact_us_at,
		or,
		number,
		gmail,
		minimum_n,
		payabel_price,
		pay_now,
	} = getSiteLanguageData('components/plans');
	return (
		<>
			<Modal.Header>
				<Modal.Title>
					{cart_details.text}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="row ">
					<div className="col-md-12 col-sm-12 cart-details">
						<Card>
							<Card.Body>
								<div className="row mb-1 mt-1  text-bold">
									<div className="col-sm-6 col-md-6 lf-plan-main-title">
										<h2 className="plan-title">
											{type?.licence_name}
										</h2>
									</div>
									<div className="form-group col-md-6">
										<div className="form-group">
											<InputGroup className='justify-content-end'>
												{Object.keys(planData).map((lpi, k) => (
													<label
														key={k}
														onClick={() => setLPI(lpi)}
														className="radio-orange text-capitalize">
														{
															data?.filter(
																(d) => d.licence_period_id === lpi,
															)[0]?.period?.[0]?.name
														}
														<input
															type="radio"
															name="licence_period"
															defaultChecked={
																licence_period_id === lpi ? true : false
															}
														/>
														<span className="radiokmark"></span>
													</label>
												))}
											</InputGroup>
										</div>
									</div>
								</div>

								
								<div className="row  text-bold mt-2">
									<div className="col-sm-6 col-md-6 ">
										{/* <h5 className="lf-card-details">
											{minimum_n.text} {type?.minimum_user}{' '}
											{users_can_subscribe.text}
										</h5> */}
										<h5 className="lf-card-start-date">
											{subscription_term_start_date.text}
											<span className="theme-color">
												{' '}
												{moment().format('DD-MM-YYYY')}
											</span>
										</h5>
										<h5 className="lf-card-start-date">
											{time_Period.text}
											<span className="theme-color">
												{' '}
												{period?.duration} {period?.type}
											</span>
										</h5>
										<h5 className="lf-card-start-date">
											{next_due_date.text}
											<span className="theme-color">
												{' '}
												{moment(end_date).format('DD-MM-YYYY')}
											</span>
										</h5>
									</div>
									<div className="col-sm-6 col-md-6 theme-color cart-details-Subscribe text-center">
										<h5 className="text-center text-bold lf-cart-offer-title ">
											{payabel_price.text}
										</h5>
										<span className="text-center col-sm-8  col-md-8 cart-price">
											{totalPrice}
											<sup className="offers">{off.text}</sup>{' '}
										</span>
										<span className="text-dark col-sm-4 col-md-4 card-rupee">
											&#8377;
										</span>
										<h6 className="theme-color text-bold lf-cart-price-info">
											{totalPrice / parseInt(period?.duration)} per{' '}
											{period?.type}
										</h6>
									</div>
								</div>
								

								<div className="row align-content-center">
									<div className="col-sm-6 col-md-6 text-end lf-cart-licence-wrapper mb-2 text-bold">
										<InputGroup className='justify-content-end'>
											<Form.Label htmlFor="users">{number_Of_license.text}{' '}</Form.Label>
											<FormControl
												style={{ width: '100px' }}
												className="lf-cart-count"
												aria-label="Recipient's users"
												type="number"
												name="user"
												autoComplete="off"
												// placeholder="20"
												value={userCount}
												onChange={(e) => setUser(e.target.value)}
											/>{` `}
											<span className="glyphicon glyphicon-plus-sign  theme-color licence-add">
												<i className="fas fa-plus-circle"></i>
											</span>
										</InputGroup>
									
									
									


										
										{/* <h5 className="lf-cart-licence-count mt-1">
											{' '}
											{number_Of_license.text}{' '}
										</h5> */}
									</div>
									
									{/* <span className="col-sm-5  col-sm-2 text-start text-cart ms-3 mb-2">
										{' '}
										<h5>
											{' '}
											<span className="glyphicon glyphicon-plus-sign  theme-color licence-add col-sm-3">
												<i className="fas fa-plus-circle"></i>
											</span>
										</h5>
									</span> */}
								</div>
							</Card.Body>
						</Card>
						{/* {
              true ? */}
						
					</div>

					<div className='col-12 mt-5'>
						<InputGroup>
							<label className="check  text-bold">
								<h5 className='mb-0'>{recurring.text}</h5>
								<input type="checkbox" id="blankCheckbox" value="option1" />
								<span className="checkmark"></span>
							</label>
						</InputGroup>
						
					</div>

					<div className='col-12 form-group'>
						<InputGroup>
							<Form.Label htmlFor="GSTIN" className='lf-cart-bill'>
								{do_you_want_to_align_bill_on_particular_day.text}
							</Form.Label>
							<label className="radio-orange lf-cart-bill-plan-select-radio">
								{yes.text}
								<input type="radio" name="radio2" />
								<span className="radiokmark"></span>
							</label>

							<label className="radio-orange lf-cart-bill-plan-select-radio ms-2">
								{no.text}
								<input type="radio" name="radio2" />
								<span className="radiokmark"></span>
							</label>
						</InputGroup>						
					</div>
					<div className='col-12'>
						<div className="form-group ">
							<InputGroup>
								<Form.Label htmlFor="GSTIN">
									<div className="lf-cart-bill-day">
										{select_your_billing_day_of_each_month.text}
									</div>
								</Form.Label>
								<label className="radio-orange lf-bill-cart-day">
									1
									<input type="radio" name="radio1" />
									<span className="radiokmark"></span>
								</label>
								<label className="radio-orange ms-2 lf-bill-cart-day-select">
									5
									<input type="radio" name="radio1" />
									<span className="radiokmark"></span>
								</label>
								<label className="radio-orange ms-2 lf-bill-cart-day-select">
									10
									<input type="radio" name="radio1" />
									<span className="radiokmark"></span>
								</label>
								<label className="radio-orange ms-2 lf-bill-cart-day-select">
									15
									<input type="radio" name="radio1" />
									<span className="radiokmark"></span>
								</label>

							</InputGroup>							
						</div>
					</div>
					
					<div className='col-12 mt-5'>
						<div className="payment-body m-auto ">
							<div className="payment">
								<div className="row mt-1 pt-1">
									<div className="col-md-6 lf-cart-payment-title">
										<h3 className="theme-color mt-2 ms-3 lf-cart-payment-details">
											{total_payment.text}
										</h3>
										<label className="check ms-4 mt-2 lf-cart-wallet-wrapper">
											<h5 className="lf-cart-wallet">
												{use_livefield_wallet.text}
											</h5>
											<input
												type="checkbox"
												id="blankCheckbox"
												value="option1"
												defaultChecked
											/>
											<span className="checkmark ms-0 mt-1"></span>
										</label>
									</div>
									<div className="mt-2 col-md-6 lf-cart-payment-wrapper">
										<span className="text-center ps-3 theme-color total-payment  payment-price">
											{totalPrice} <span className="text-dark">&#8377;</span>
										</span>
									</div>
								</div>
							</div>
							
						</div>

					</div>
					
					<div className="col-sm-12 col-md-12 mt-5 text-center mb-4">
						<Button
							className="btn theme-btn col-sm-2 col-md-2 "
							onClick={() => props.stepChange(2)}>
							{back.text}{' '}
						</Button>
						<Button
							className="btn theme-btn lf-billing-btn-next col-sm-2 lf-btn-cart ms-3"
							onClick={(e) => {
								e.preventDefault();
								props.purchaseLicence();
							}}>
							{pay_now.text}{' '}
						</Button>
						
						{/* <Link to="./billinginfo" className="btn  theme-btn  lf-billing-btn-next float-end col-sm-2 col-md-2">Back</Link> */}
					</div>
					
				</div>
			
			</Modal.Body>

			{/*	<Modal.Footer>
					<div className="m-auto text-bold lf-footer-cart-info">
						{for_more_details_contact_us_at.text}{' '}
						<a href="tel:+919033938373" className="theme-link">{number?.text}</a>{' '}{or?.text}{' '}
						<a href = "mailto: support@livefield.app" className="theme-link">{gmail?.text}</a>
						 <span className="theme-color">{number.text}</span> {or.text}{' '}
						<span className="theme-color">{gmail.text}</span> 
					</div>
				</Modal.Footer> */}
			{/* </Modal> */}
		</>
	);
}

const PlanCard = ({ data, selectLicencePlan, licence_plan_id }) => {
	const { minimum_user_text } = getSiteLanguageData('components/plans');
	return (
		<Col className="lf-my-card">
			{/* <Col className="lf-plan-card lf-my-card" > */}
			<Card dialog>
				<Card.Body className="active">
					<Card.Title className="text-center theme-color mb-3">
						<h3>{data?.type?.[0]?.licence_name}</h3>
					</Card.Title>
					<Card.Text>
						<div className="theme-color text-center mt-5">
							<p style={{fontSize: '1.5rem'}}>&#8377; {data?.amount} </p>
							<p className="mt-3">
								{Math.round(data?.amount / data?.period?.[0]?.duration)} per{' '}
								{data?.period?.[0]?.type}
							</p>
						</div>
						<div className="mt-3 text-center mb-4">
							{data?.type?.[0]?.description}
						</div>
						<div className="mt-3 text-center mb-4">
							{minimum_user_text?.text} {data?.type?.[0]?.minimum_user}
						</div>
						{/* <div className="mt-3 text-center mb-4 text-black">
              Maximum user:{data?.type?.[0]?.maximum_user}
            </div> */}
					</Card.Text>
				</Card.Body>
			</Card>
			<Button
				onClick={() => selectLicencePlan(data, data._id)}
				className={`btn theme-btn theme-color position-relative col-lg-7 ${
					licence_plan_id === data._id
						? 'lf-select-plan-btn-selected'
						: 'lf-select-plan-btn'
				}`}>
				{licence_plan_id === data._id ? 'Selected' : 'Select plan'}
			</Button>
		</Col>
	);
};


const PlanModel = (props) => {
	const dispatch = useDispatch();

	const data = useSelector((state)=>{
		return state?.license?.[GET_LICENSE_PLANS]?.result;
	});

	const billinfo = useSelector((state)=>{
		return state?.profile?.[GET_ALL_USER_BILLING_INFO]?.result;
	});

	const userLicenseData = useSelector((state)=>{
		return state?.license?.[GET_USER_LICENSE].result;
	});
	
	// 
	const [show, setShow] = useState(false);
	const [selected_licence_period_id, setSelectedLicencePeriodId] = useState(false);
	const [licence_plan_id, setLicencePlanId] = useState('')
	const [selected_plan, setSelectedPlan] = useState({});
	const [step, setStep] = useState('');
	const [billing_details, setBillingDetails] = useState({});
	const [userCount, setUseCount] = useState(0);
	
	
	const userId = getUserId();
	const planData = {};


	data?.forEach((d) => {
		if (!d?.is_trial) {
			planData[d.licence_period_id] = planData[d.licence_period_id] || [];
			planData[d.licence_period_id].push(d);
		}
	});
	

	useEffect(() => {
		
		dispatch(getLicensePlans((res)=>{
			if(typeof res.result != "undefined" && Array.isArray(res.result) && res.result.length > 0){
				setSelectedLicencePeriodId(res.result[0]?.licence_period_id);
			}
		}));
		getAllUserBillingInfo(userId);
		getUserLicence(userId);
	}, []);

	const changePeriodForSelectedPlan = (lpi) => {
		
		
		if (selected_plan?._id) {
			const sPlan = data?.filter(
				(d) =>
					d.licence_period_id === lpi &&
					d.licence_type_id === selected_plan?.licence_type_id,
			)[0];

			setSelectedLicencePeriodId(lpi);
			setSelectedPlan(sPlan);
			setLicencePlanId(sPlan?._id);		
			
		} else {
			setSelectedLicencePeriodId(lpi)
		}
	};

	const setUser = (planUserCount) => {
		planUserCount = parseInt(planUserCount);
		const minimum_user = parseInt(selected_plan?.type?.[0]?.minimum_user);
		const maximum_user = parseInt(selected_plan?.type?.[0]?.maximum_user);
		if (planUserCount >= minimum_user && planUserCount <= maximum_user) {
			setUseCount(planUserCount)
		}
	};
	const selectPlan = (plan, lpi) => {
		setSelectedPlan(plan);
		setLicencePlanId(lpi);
		setUseCount(plan?.type?.[0]?.minimum_user);
	};

	const purchaseLicence = () => {
		
		
		const type = selected_plan?.type[0];
		
		const totalPrice = parseInt(userCount) * parseInt(selected_plan?.amount);
		var options = {
			key: `rzp_test_fPNZrF9y7h8J5a`, // Enter the Key ID generated from the Dashboard
			amount: totalPrice * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
			currency: 'INR',
			name: 'Livefield',
			description: `${type?.licence_name} licence for ${userCount} users`,
			image: '/images/logo-sm.png',
			// "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
			handler: function (response) {
				const post = {
					user_id: userId,
					licence_plan_id: selected_plan?._id,
					count: userCount,
					is_recurring: false,
					user_specify_recurring_date: '',
					billing_info_id: billinfo[0]?._id,
					gateway_type: 'Razorpay',
					payment_id: response.razorpay_payment_id,
					amount: totalPrice,
					gateway_amount: totalPrice,
					wallet_amount: 0,
					status: 'created',
				};
				dispatch(purchaseLicence(post));
				// this.setState({
				//   show : false
				// })
				// alert(response.razorpay_payment_id);
				// alert(response.razorpay_order_id);
				// alert(response.razorpay_signature)
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
			alert(response.error.code);
			// alert(response.error.description);
			// alert(response.error.source);
			// alert(response.error.step);
			// alert(response.error.reason);
			// alert(response.error.metadata.order_id);
			// alert(response.error.metadata.payment_id);
		});
		rzp1.open();
	};


	const {
		users_can_subscribe,
		cart_details,
		subscription_term_start_date,
		time_Period,
		next_due_date,
		off,
		number_Of_license,
		recurring,
		do_you_want_to_align_bill_on_particular_day,
		select_your_billing_day_of_each_month,
		yes,
		no,
		total_payment,
		use_livefield_wallet,
		back,		
		minimum_n,
		payabel_price,
		pay_now,
		choose_your_plan,
		next,
		for_more_details_contact_us_at,
		or,
		number,
		gmail,
	} = getSiteLanguageData('components/plans');
	
	return (
		<>
			{React.cloneElement(props.children, {onClick: () => setShow(true)})}
			<Modal
				size="xl"
				show={show}
				onHide={() => setShow(false)}
				className={`subscription-model`}
				>
				{step === 2 ? (
					<PlanBillingInfo
						userCount={userCount}
						billinfo={billinfo}
						licence_plan_id={licence_plan_id}
						data={data}
						planData={planData}
						licence_period_id={selected_licence_period_id}
						setUser={setUser}
						setLPI={changePeriodForSelectedPlan}
						stepChange={(st) => setStep(st)}
					/>
				) : step === 3 ? (
					<Cart
						stepChange={(st) => setStep(st)}
						purchaseLicence={() => purchaseLicence()}
						userCount={userCount}
						billinfo={billinfo}
						licence_plan_id={licence_plan_id}
						data={data}
						planData={planData}
						licence_period_id={selected_licence_period_id}
						setUser={setUser}
						setLPI={changePeriodForSelectedPlan}
						selected_plan={selected_plan}
						// onSubmit={submitBillInfo}
					/>
				) : (
					<>
						<Modal.Header
							className="lf-plan-modal-img m-auto w-100"
							closeButton>
							<div className="container text-center m-auto lf-plan-modal-inner">
								<div className="row ">
									<div className="col-md-12">
										<h2 className="theme-color text-bold ms-3">
											{choose_your_plan.Text}
										</h2>
										<div className="mt-3">
											{Object.keys(planData).map((lpi, k) => (
												<Button
													key={k}
													onClick={() =>
														changePeriodForSelectedPlan(lpi)
													}
													className={`btn  text-capitalize theme-btn  me-2 ${
														selected_licence_period_id === lpi
															? 'lf-btn-plan-choose-selected'
															: 'lf-btn-plan-choose'
													}`}>
													{' '}
													{
														data?.filter(
															(d) => d.licence_period_id === lpi,
														)[0]?.period?.[0]?.name
													}{' '}
												</Button>
											))}
										</div>
									</div>
								</div>
							</div>
						</Modal.Header>
						<div className="container">
							<Row className="plan-licence px-5">
								{planData[selected_licence_period_id]?.map((plan) => {
									return (
										<PlanCard
											data={plan}
											key={plan?._id}
											licence_plan_id={licence_plan_id}
											selectLicencePlan={(plan, lpi) =>
												selectPlan(plan, lpi)
											}
										/>
									);
								})}
							</Row>
						</div>

						<div className="row container m-auto">
							<div className="col-lg-12 mb-1">
								{licence_plan_id && licence_plan_id !== '' ? (
									<Button
										className="btn  theme-btn lf-billing-btn-next lf-btn-cart float-end ms-2 col-sm-2 col-md-2"
										onClick={() => setStep(2)}>
										{next.text}{' '}
									</Button>
								) : (
									true
								)}
							</div>
						</div>
						<Modal.Footer>
							<div className="m-auto text-bold lf-footer-contact-info">
								{for_more_details_contact_us_at.text}{' '}
								<a href="tel:+919033938373" className="theme-link">{number?.text}</a>{' '}{or?.text}{' '}
								<a href = "mailto: support@livefield.app" className="theme-link">{gmail?.text}</a>
								{/* <span className="theme-color">{number.text}</span> {or.text}{' '}
								<span className="theme-color lf-footer-info-mail">
									{gmail.text}
								</span> */}
							</div>
						</Modal.Footer>
					</>
				)}
			</Modal>
		</>
	);
}

export default PlanModel;