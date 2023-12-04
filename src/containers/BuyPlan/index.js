import React, { useState, useEffect } from 'react';
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
	ButtonGroup,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import Layout from '../../components/layout';
import {
	GET_ALL_USER_BILLING_INFO,
	GET_LICENSE_PLANS,
	GET_USER_LICENSE,
	CREATE_BILLING_INFO
} from '../../store/actions/actionType';
import Loading from './../../components/loadig';
import {
	getLicensePlans,
	getUserLicence,
	purchaseLicence,
	createRazorPayOrder
} from '../../store/actions/License';
import getUserId, { getSiteLanguageData } from '../../commons';
import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { RAZORPAY_KEY_ID } from '../../commons/constants';
import PlanBillingInfo from '../../components/planBillingInfo';
import { getAllUserBillingInfo } from '../../store/actions/Profile';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

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
	per_user_per_month,
	enter_address
} = getSiteLanguageData('components/plans');


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

const PlanCard = (props) => {
    const data = props.data;
    const selectLicencePlan = props.selectLicencePlan;
    const licence_plan_id = props.licence_plan_id;
	const { minimum_user_text } = getSiteLanguageData('components/plans');
	
	return (
		<Col className="plan-card mx-2 my-2">
			{/* <Col className="lf-plan-card lf-my-card" > */}
			<Card dialog>
				<Card.Body className="active">
					<Card.Title className="text-center my-3">
						<h3>{data?.type?.[0]?.licence_name}</h3>
					</Card.Title>
					<Card.Text>
						<div className="text-center">
							<div className="d-flex justify-content-center">
								<div className="display-6 me-2 theme-color">&#8377; </div>
								<div className="display-4 theme-color">{data?.amount}</div>
							</div>	
							<div className="mb-3">{per_user_per_month?.text}</div>
{/* 
							<p style={{fontSize: '1.5rem'}}>&#8377; {data?.amount} </p>
							<p className="mt-3">
								{Math.round(data?.amount / data?.period?.[0]?.duration)} per{' '}
								{data?.period?.[0]?.type}
							</p> */}
						</div>
						<div className="text-center m-4 px-4" dangerouslySetInnerHTML={{__html: data?.type?.[0]?.description}} ></div>
						{/* <div className="mt-3 text-center mb-4">
							{minimum_user_text?.text} {data?.type?.[0]?.minimum_user}
						</div>
						{/* <div className="mt-3 text-center mb-4 text-black">
              Maximum user:{data?.type?.[0]?.maximum_user}
            </div> */}
						<div className="text-center">
							<Button
								onClick={() => selectLicencePlan(data, data._id)}
								className={`col-12 btn theme-btn mt-2 mb-3 ${
									licence_plan_id === data._id
										? 'lf-select-plan-btn-selected'
										: 'lf-select-plan-btn'
								}`}>
								{licence_plan_id === data._id ? 'Selected' : 'Select plan'}
							</Button>
						</div>
					</Card.Text>
				</Card.Body>
			</Card>
			
		</Col>
	);
};


const PlanModel = (props) => {
	const [licenceLoader, setLicenceLoader] = useState(false);
	const dispatch = useDispatch();

	const data = useSelector((state)=>{
		return state?.license?.[GET_LICENSE_PLANS]?.result;
	});

	const billinfo = useSelector((state)=>{
		return state?.profile?.[GET_ALL_USER_BILLING_INFO]?.result;
	});
	
	/* const userLicenseData = useSelector((state)=>{
		return state?.license?.[GET_USER_LICENSE]?.result;
	}); */
	
	// 
	// const [show, setShow] = useState(false);
	const [selected_licence_period_id, setSelectedLicencePeriodId] = useState(false);
	const [licence_plan_id, setLicencePlanId] = useState('')
	const [selected_plan, setSelectedPlan] = useState({});
	const [step, setStep] = useState('');
	const [billing_details, setBillingDetails] = useState({});
	const [userCount, setUseCount] = useState(0);
	const [alignDays, setAlignDays] = useState(0);
	const [billingStart, setBillingStart] = useState(null);
	const [billingStartDate, setBillingStartDate] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const [alignPrice, setAlignPrice] = useState(0);
	const [isAlign, setIsAlign] = useState(false);
	const [gstAmount, setGstAmount] = useState(0);
	const [perDayPrice, setPerDayPrice] = useState(0);
	const [country, setCountry] = useState("");
	const [isSez, setIsSez] = useState(false)
	
	
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
		dispatch(getAllUserBillingInfo(userId,(bData)=>{
			setCountry(bData?.result?.[0]?.country);
			setIsSez(bData?.result?.[0]?.is_sez ? true : false)
		}));
		getUserLicence(userId);
	}, []);

	const changePeriodForSelectedPlan = (lpi) => {
		if (selected_plan?._id) {
			const sPlan = data?.filter((d) =>d.licence_period_id === lpi && d.licence_type_id === selected_plan?.licence_type_id,)[0];
			setSelectedLicencePeriodId(lpi);
			setSelectedPlan(sPlan);
			setLicencePlanId(sPlan?._id);
			if(sPlan && sPlan?._id){
				let price = userCount * sPlan.amount * sPlan.period?.[0].duration;
				price += alignPrice;
				let gst = country == "India" ? (price * 18) / 100 : 0;
				setTotalPrice(price)
				setGstAmount(gst);
			}			
		} else {
			setSelectedLicencePeriodId(lpi)
		}
	};

	const setUser = (planUserCount) => {
		planUserCount = parseInt(planUserCount);
		if(planUserCount < 1) return;
		/* const minimum_user = parseInt(selected_plan?.type?.[0]?.minimum_user);
		const maximum_user = parseInt(selected_plan?.type?.[0]?.maximum_user);
		if (planUserCount >= minimum_user && planUserCount <= maximum_user) {
			
		} */
		if(planData?.[selected_licence_period_id] && Array.isArray(planData[selected_licence_period_id])){
			setUseCount(planUserCount);
			let pi = planData?.[selected_licence_period_id].find((p,i)=> {
				return p.type[0].minimum_user <= planUserCount && p.type[0].maximum_user >= planUserCount;
			});
			if(pi && pi._id){
				selectPlan(pi, pi._id);
				let price = planUserCount * pi.amount * pi.period?.[0].duration;
				let alignPrice = perDayPrice * alignDays * planUserCount;
				price += alignPrice;
				let gst = country == "India" ? (price * 18) / 100 : 0;
				setGstAmount(gst);
				setTotalPrice(price);				
				setAlignPrice(alignPrice)
			}
		}
		// console.log(planData[selected_licence_period_id], " data data data")
	};
	const selectPlan = (plan, lpi) => {
		setSelectedPlan(plan);
		setLicencePlanId(lpi);
		/* if(userCount){
			setUseCount(plan?.type?.[0]?.minimum_user);
		}else{
			setUseCount(plan?.type?.[0]?.minimum_user);
		} */		
		// console.log(plan,"plan",lpi,"lpi" )
	};

	const changeCountry = (cnt) => {
		setCountry(cnt);
		if(cnt?.toLowerCase() != "india") setGstAmount(0);		
		else setGstAmount((totalPrice * 18) / 100);
	}

	const changeIsSez = (cnt) => {
		setIsSez(cnt);
	}

	const changeBillingStart = (day) => {
		if(day){
			setBillingStart(day);
			let strDay = day > 9 ? ""+day : "0"+day;
			// setAlignPrice
			
			let todayDate = new Date();
			let billingStart = new Date();
			billingStart.setDate(day);			
			let billingMonth = todayDate.getDate() > 1 && todayDate.getDate() <= day ? todayDate.getMonth()+1 : todayDate.getMonth() +2;
			if(billingMonth > 12){
				billingStart.setFullYear(todayDate.getFullYear()+1);
				billingMonth = billingMonth - 12;
			}
			billingStart.setMonth(billingMonth-1);			
			let billingStartDate = new Date(billingStart);
			let monthDays = moment().daysInMonth();
			let alignDay = moment(billingStart).diff(todayDate, 'days');
			setAlignDays(alignDay);
			let perDayPrice = selected_plan.amount * 12 / 365;
			setPerDayPrice(perDayPrice)
			let alignDaysPrice = perDayPrice * alignDay * userCount;
			
			setBillingStartDate(moment(billingStart).format("YYYY-MM-DD"));

			let price = userCount * selected_plan.amount * selected_plan?.period?.[0].duration;
			price += alignDaysPrice;
			let gst = country == "India" ? (price * 18) / 100 : 0;
			setGstAmount(gst)
			
			setTotalPrice(price);
			setAlignPrice(alignDaysPrice);
		}else{
			setBillingStart(day);
			setAlignPrice(0);
			setAlignDays(0);
			setBillingStartDate(null);
			let price = userCount * selected_plan.amount * selected_plan?.period?.[0].duration;
			let gst = country == "India" ? (price * 18) / 100 : 0;
			setGstAmount(gst);			
			setTotalPrice(price);
			setPerDayPrice(0);
		}
		
	}

	const purchaseLicenceHandler = () => {
		dispatch(getAllUserBillingInfo(userId, (bData)=>{
			if(bData?.result?.[0]?._id){
				let totalPayabaleAmount = (totalPrice + (gstAmount ? gstAmount : 0)).toFixed(2);
				let createOrderParams = {
					"user_id":userId,
					"amount":parseInt(totalPayabaleAmount * 100),
					"currency":"INR"
				}
				dispatch(createRazorPayOrder(createOrderParams,(orderRes)=>{
					const type = selected_plan?.type[0];
					// const totalPrice = parseInt(userCount) * parseInt(selected_plan?.amount);
					var options = {
						key: RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
						amount: parseInt(totalPayabaleAmount * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
						currency: 'INR',
						name: 'Livefield',
						description: `${type?.licence_name} licence for ${userCount} users`,
						image: '/images/logo-sm.png',
						"order_id": orderRes?.result?.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
						handler: function (response) {
							console.log(response, "Razorpar Response")
							const post = {
								user_id: userId,
								licence_plan_id: selected_plan?._id,
								count: userCount,
								is_recurring: false,
								user_specify_recurring_date: '',
								billing_info_id: bData?.result?.[0]?._id,
								gateway_type: 'Razorpay',
								payment_id: response.razorpay_payment_id,
								order_id: response.razorpay_order_id,
								payment_signature:response.razorpay_signature,
								amount: totalPayabaleAmount,
								gateway_amount: totalPayabaleAmount,
								wallet_amount: 0,
								status: 'created',
								align_days: alignDays && Number(alignDays) > 0 ? alignDays : null,
								start_date:billingStartDate ? moment(billingStartDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD"),
								total_gst:gstAmount
							};
							setLicenceLoader(true);
							dispatch(purchaseLicence(post, (liRes)=>setLicenceLoader(false)));							
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
						console.log(response, "response response on payment faild")
						alert(response.error.code);
						// alert(response.error.description);
						// alert(response.error.source);
						// alert(response.error.step);
						// alert(response.error.reason);
						// alert(response.error.metadata.order_id);
						// alert(response.error.metadata.payment_id);
					});
					rzp1.open();
				}));
			}else{
				errorNotification(enter_address?.text);
			}
		}));

		
	};


	const {
		choose_your_plan,
		next,
		for_more_details_contact_us_at,
		or,
		number,
		gmail,
	} = getSiteLanguageData('components/plans');
	
	return (
        <Layout nosidebar={true}>
			<section className="grey-bg">
				<div id="page-content-wrapper">
					<div className="container">
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
								selected_plan={selected_plan}
								purchaseLicence={() => purchaseLicenceHandler()}
								setTotalPrice={setTotalPrice}
								setAlignDays={setAlignDays}
								alignDays={alignDays}
								setBillingStart={setBillingStart}
								billingStart={billingStart}
								changeBillingStart={changeBillingStart}
								alignPrice={alignPrice}
								totalPrice={totalPrice}
								billingStartDate={billingStartDate}
								setIsAlign={setIsAlign}
								isAlign={isAlign}
								gstAmount={gstAmount}
								setGstAmount={setGstAmount}
								changeCountry={changeCountry}
								changeIsSez={changeIsSez}
							/>
						) : step === 3 ? (
							<Cart
								stepChange={(st) => setStep(st)}
								purchaseLicence={() => purchaseLicenceHandler()}
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
								<div className="row ">
									<div className="col-12">
										<div className="mt-5 mb-3 d-flex align-items-center">
											<div className="float-start d-inline-block">
												<h2 className="text-bold ms-3">
													{choose_your_plan.text}
												</h2>
											</div>
											<div className="ms-auto float-end d-inline-block">
												<ButtonGroup className="me-2">
													{Object.keys(planData).map((lpi, k) => (
														<Button
															key={k}
															onClick={() =>
																changePeriodForSelectedPlan(lpi)
															}
															className={`text-capitalize ${
																selected_licence_period_id === lpi
																	? 'lf-btn-plan-choose-selected theme-btn d-inline-block'
																	: 'lf-btn-plan-choose btn-outline-theme d-inline-block'
															}`}>
															{' '}
															{
																data?.filter(
																	(d) => d.licence_period_id === lpi,
																)[0]?.period?.[0]?.name
															}{' '}
														</Button>
													))}
												</ButtonGroup>
											</div>
										</div>
									</div>
								</div>

								<div>
									<Row className="">
										{planData[selected_licence_period_id]?.map((plan) => {
											return (
												<PlanCard
													data={plan}
													key={plan?._id}
													licence_plan_id={licence_plan_id}
													selectLicencePlan={(plan, lpi) => {
															console.log(plan, "plan plan");
															let planDuration = plan?.period?.[0]?.duration;
															planDuration = planDuration ? planDuration : 1;
															let totalPrice = plan.amount * planDuration * plan?.type?.[0]?.minimum_user;
															totalPrice += alignPrice;
															let gst = (totalPrice * 18) / 100
															selectPlan(plan, lpi);
															setStep(2);
															setUseCount(plan?.type?.[0]?.minimum_user);
															setTotalPrice(totalPrice);
															setGstAmount(gst);
														}
													}
												/>
											);
										})}
									</Row>

									

									{/*<div className="row">
										<div className="col-lg-12 mb-4">
											<div className="m-auto text-bold lf-footer-contact-info text-center">
												{for_more_details_contact_us_at.text}{' '}
												<a href="tel:+919033938373" className="theme-link">{number?.text}</a>{' '}{or?.text}{' '}
												<a href = "mailto: support@livefield.app" className="theme-link">{gmail?.text}</a>
												 <span className="theme-color">{number.text}</span> {or.text}{' '}
												<span className="theme-color lf-footer-info-mail">
													{gmail.text}
												</span>
											</div>
										</div>
										
									</div>
									 <div className="row">
										<div className="col-lg-12 mb-1 text-center mb-5">
											{licence_plan_id && licence_plan_id !== '' ? (
												<Button
													className="btn  theme-btn lf-billing-btn-next lf-btn-cart ms-2 col-sm-2 col-md-2"
													onClick={() => setStep(2)}>
													{next.text}{' '}
												</Button>
											) : (
												true
											)}
										</div>
									</div> */}
								</div>
							</>
						)}
					</div>
                </div>
            </section>
			{
				licenceLoader && (<Loading />)
			}
        </Layout>
		
	);
}

export default PlanModel;