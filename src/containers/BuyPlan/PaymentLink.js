import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { connect } from 'react-redux';
import NobarLayout from '../../components/NobarLayout';
import {
	GET_ALL_USER_BILLING_INFO,
	GET_LICENSE_PLANS,
	GET_USER_LICENSE,
	CREATE_BILLING_INFO
} from '../../store/actions/actionType';
import {
	getLicensePlans,
	getUserLicence,
	purchaseLicence,
	createRazorPayOrder,
	getPaymentLink
} from '../../store/actions/License';
import getUserId, { getSiteLanguageData } from '../../commons';
import { RAZORPAY_KEY_ID } from '../../commons/constants';
import PaymentLinkBilling from '../../components/PaymentLinkBilling';
import { getAllUserBillingInfo } from '../../store/actions/Profile';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const {
	link_expired,
} = getSiteLanguageData('components/plans');

const PlanModel = (props) => {
	const dispatch = useDispatch();
	const { link_id } = useParams();
	const [selected_licence_period_id, setSelectedLicencePeriodId] = useState(false);
	const [billinfo,setBillingInfo] = useState([]);
	const [licence_plan_id, setLicencePlanId] = useState('')
	const [linkData, setLinkData] = useState({});
	const [selected_plan, setSelectedPlan] = useState({});
	const [step, setStep] = useState('');
	// const [billing_details, setBillingDetails] = useState({});
	const [coupen, setCoupen] = useState({});
	const [userCount, setUseCount] = useState(0);
	const [alignDays, setAlignDays] = useState(0);
	const [billingStart, setBillingStart] = useState(null);
	const [billingStartDate, setBillingStartDate] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	// const [alignPrice, setAlignPrice] = useState(0);
	// const [isAlign, setIsAlign] = useState(false);
	const [gstAmount, setGstAmount] = useState(0);
	// const [perDayPrice, setPerDayPrice] = useState(0);
	const [country, setCountry] = useState("");
	const [isSez, setIsSez] = useState(false)
	const [userId, setUserId] = useState("");
	const [planData, setPlandata] = useState({});
	const [discountAmount, setDiscountAmount] = useState(0);
	
	useEffect(() => {
		dispatch(getPaymentLink(link_id, (resData)=>{
			if(resData.result){
				setLinkData(resData.result);
				setSelectedLicencePeriodId(resData.result.periods_id);
				setLicencePlanId(resData.result.plan_id);
				setSelectedPlan(resData.result.plan[0]);
				setCountry(resData.result.billinginfoRs?.[0]?.country);
				setIsSez(resData.result.billinginfoRs?.[0]?.is_sez ? true : false);
				setUseCount(resData.result.number_of_user);
				setPlandata({[resData.result.periods_id]:resData.result.plan});
				setCoupen(resData.result.coupen);
				setUserId(resData.result.user_id);
				setBillingInfo(resData.result.billinginfoRs);
				if(resData.result.user){
					localStorage.setItem("token",resData.result.user.token);
					localStorage.setItem("userId",resData.result.user._id);
				}
				
				
				setStep(2);
			}else{
				setLinkData({});
			}			
		}));


		
		/* dispatch(getLicensePlans((res)=>{
			if(typeof res.result != "undefined" && Array.isArray(res.result) && res.result.length > 0){
				setSelectedLicencePeriodId(res.result[0]?.licence_period_id);
			}
		}));
		dispatch(getAllUserBillingInfo(userId,(bData)=>{
			setCountry(bData?.result?.[0]?.country);
			setIsSez(bData?.result?.[0]?.is_sez ? true : false)
		}));
		getUserLicence(userId); */
	}, []);

	useEffect(()=>{
		setUser(userCount);
	},[userCount])

	const setUser = (planUserCount) => {
		planUserCount = parseInt(planUserCount);
		if(planUserCount < 1) return;
		
		if(planData?.[selected_licence_period_id] && Array.isArray(planData[selected_licence_period_id])){
			setUseCount(planUserCount);
			let pi = planData?.[selected_licence_period_id].find((p,i)=> {
				return p.type[0].minimum_user <= planUserCount && p.type[0].maximum_user >= planUserCount;
			});
			if(pi && pi._id){
				selectPlan(pi, pi._id);
				let price = planUserCount * pi.amount * pi.period?.[0].duration;
				/* let alignPrice = perDayPrice * alignDays * planUserCount;
				price += alignPrice; */
				let discountVal = 0;

				if(coupen && coupen.discount){
					if(coupen.discount_type === "per"){
						discountVal = (price * coupen.discount) / 100;
					}
				}

				let gst = country?.toLowerCase() == "india" ? ((price - discountVal) * 18) / 100 : 0;
				
				setDiscountAmount(discountVal);
				setGstAmount(gst);
				setTotalPrice(price);
			}
		}
	};
	const selectPlan = (plan, lpi) => {
		setSelectedPlan(plan);
		setLicencePlanId(lpi);
	};

	const changeCountry = (cnt) => {
		setCountry(cnt);
		if(cnt?.toLowerCase() != "india") setGstAmount(0);		
		else setGstAmount(((totalPrice - discountAmount) * 18) / 100);
	}

	const changeIsSez = (cnt) => {
		setIsSez(cnt);
		setUser(userCount)
	}

	const purchaseLicenceHandler = () => {
		dispatch(getAllUserBillingInfo(userId, (bData)=>{
			if(bData?.result?.[0]?._id){
				let totalPayabaleAmount = ((totalPrice - discountAmount) + (gstAmount ? gstAmount : 0)).toFixed(2);
				let createOrderParams = {
					"user_id":userId,
					"amount":parseInt(totalPayabaleAmount * 100),
					"currency":"INR"
				}
				
				dispatch(createRazorPayOrder(createOrderParams,(orderRes)=>{
					const type = selected_plan?.type[0];
					console.log(`${type?.licence_name} licence for ${userCount} users ${billingStartDate}`);
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
								start_date:billingStartDate ? moment(billingStartDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD"),
								total_gst:gstAmount,
								coupon_id:coupen?._id,
								discountAmount:discountAmount,
								coupon_data:{
									code:coupen.code,
									discount:coupen.discount,
									discount_type:coupen.discount_type
								}

							};
							dispatch(purchaseLicence(post));							
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

			}
			


		}));

		
	};
	
	return (
        <NobarLayout>
			<section className="grey-bg">
				<div id="page-content-wrapper">
					{linkData && linkData._id ? (
						<div className="container">						
							<PaymentLinkBilling
								userCount={userCount}
								billinfo={billinfo}
								licence_plan_id={licence_plan_id}
								planData={planData}
								licence_period_id={selected_licence_period_id}
								setUser={setUser}
								stepChange={(st) => setStep(st)}
								selected_plan={selected_plan}
								purchaseLicence={() => purchaseLicenceHandler()}
								setTotalPrice={setTotalPrice}
								setAlignDays={setAlignDays}
								alignDays={alignDays}
								setBillingStart={setBillingStart}
								billingStart={billingStart}
								totalPrice={totalPrice}
								billingStartDate={billingStartDate}
								gstAmount={gstAmount}
								userId={userId}
								setGstAmount={setGstAmount}
								changeCountry={changeCountry}
								changeIsSez={changeIsSez}
								coupen={coupen}
								discountAmount={discountAmount}
							/>
						</div>
					) : ('Link has been expired')}
					
                </div>
            </section>
        </NobarLayout>		
	);
}

export default PlanModel;