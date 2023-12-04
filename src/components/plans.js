import React from 'react';
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
class Licence extends React.Component {
	constructor(props) {
		super(props);
		this.userId = getUserId();
		this.state = {
			show: false,
			selected_licence_period_id: '',
			step: '',
			licence_plan_id: '',
			selected_plan: {},
			billing_details: {},
			userCount: 0,
		};
	}

	componentDidMount() {
		const { data } = this.props;
		const { selected_licence_period_id } = this.state;
		if (!data || data?.length <= 0) {
			this.props.dispatch(getLicensePlans());
		} else if (selected_licence_period_id === '') {
			this.setState({
				selected_licence_period_id: data?.[0]?.licence_period_id,
			});
		}
		this.props.dispatch(getAllUserBillingInfo(this.userId));
		this.props.dispatch(getUserLicence(this.userId));
	}
	setLPI = (lpi) => {
		this.setState({
			selected_licence_period_id: lpi,
		});
	};
	changePeriodForSelectedPlan = (lpi) => {
		const { data } = this.props;
		let { selected_plan } = this.state;
		if (selected_plan?._id) {
			selected_plan = data?.filter(
				(d) =>
					d.licence_period_id === lpi &&
					d.licence_type_id === selected_plan?.licence_type_id,
			)[0];
			this.setState({
				selected_licence_period_id: lpi,
				selected_plan,
				licence_plan_id: selected_plan?._id,
			});
		} else {
			this.setState({
				selected_licence_period_id: lpi,
			});
		}
	};

	setUser = (userCount) => {
		userCount = parseInt(userCount);
		let { selected_plan } = this.state;
		const minimum_user = parseInt(selected_plan?.type?.[0]?.minimum_user);
		const maximum_user = parseInt(selected_plan?.type?.[0]?.maximum_user);
		if (userCount >= minimum_user && userCount <= maximum_user) {
			this.setState({ userCount });
		}
	};
	selectPlan = (plan, lpi) => {
		this.setState({
			selected_plan: plan,
			licence_plan_id: lpi,
			userCount: parseInt(plan?.type?.[0]?.minimum_user),
		});
	};
	setStep = (step) => {
		this.setState({ step });
	};
	purchaseLicence = () => {
		const { selected_plan, userCount } = this.state;
		const { billinfo, dispatch } = this.props;
		const type = selected_plan?.type[0];
		const userId = this.userId;
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

	render() {
		const planData = {};
		const { data, billinfo } = this.props;
		const {
			show,
			step,
			licence_plan_id,
			selected_licence_period_id,
			userCount,
			selected_plan,
		} = this.state;
		let licence_period_id = selected_licence_period_id;
		if (selected_licence_period_id === '') {
			licence_period_id = data?.[0]?.licence_period_id;
		}
		data?.forEach((d) => {
			if (!d?.is_trial) {
				planData[d.licence_period_id] = planData[d.licence_period_id] || [];
				planData[d.licence_period_id].push(d);
			}
		});
		const {
			choose_your_plan,
			next,
			for_more_details_contact_us_at,
			or,
			number,
			gmail,
		} = getSiteLanguageData('components/plans');
		return (
			<>
				{React.cloneElement(this.props.children, {
					onClick: () =>
						this.setState({
							show: true,
						}),
				})}
				<Modal
					size="xl"
					show={show}
					onHide={() =>
						this.setState({
							show: false,
						})
					}>
					{step === 2 ? (
						<PlanBillingInfo
							userCount={userCount}
							billinfo={billinfo}
							licence_plan_id={licence_plan_id}
							data={data}
							planData={planData}
							licence_period_id={licence_period_id}
							setUser={this.setUser}
							setLPI={this.changePeriodForSelectedPlan}
							stepChange={(st) => this.setStep(st)}
						/>
					) : step === 3 ? (
						<Cart
							stepChange={(st) => this.setStep(st)}
							purchaseLicence={() => this.purchaseLicence()}
							userCount={userCount}
							billinfo={billinfo}
							licence_plan_id={licence_plan_id}
							data={data}
							planData={planData}
							licence_period_id={licence_period_id}
							setUser={this.setUser}
							setLPI={this.changePeriodForSelectedPlan}
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
															this.changePeriodForSelectedPlan(lpi)
														}
														className={`btn  text-capitalize theme-btn  me-2 ${
															licence_period_id === lpi
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
									{planData[licence_period_id]?.map((plan) => {
										return (
											<PlanCard
												data={plan}
												key={plan?._id}
												licence_plan_id={licence_plan_id}
												selectLicencePlan={(plan, lpi) =>
													this.selectPlan(plan, lpi)
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
											onClick={() => this.setStep(2)}>
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
}

export default connect((state) => {
	return {
		data: state?.license?.[GET_LICENSE_PLANS]?.result,
		billinfo: state?.profile?.[GET_ALL_USER_BILLING_INFO]?.result,
		userLicenseData: state?.license?.[GET_USER_LICENSE]?.result,
	};
})(Licence);

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
							<h4>&#8377; {data?.amount} </h4>
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
									<div className="form-group   col-sm-6 col-md-6 lf-plan-main-title">
										<h2 className="plan-title ms-4">
											{type?.licence_name}
										</h2>
									</div>
									<div className="form-group col-md-6">
										<div className="form-group float-end me-5">
											<InputGroup>
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

								<Card.Text>
									<div className="row  text-bold mt-2">
										<div className="col-sm-7 col-md-7 ms-4 ">
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
										<div className="col-sm-4 col-md-4 theme-color cart-details-Subscribe text-center">
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
								</Card.Text>

								<div className="row  text-bold">
									<span className="col-sm-3 col-md-3 text-end lf-cart-licence-wrapper mb-2">
										<h5 className="lf-cart-licence-count mt-1">
											{' '}
											{number_Of_license.text}{' '}
										</h5>
									</span>
									<FormControl
										style={{ width: '100px' }}
										className="lf-cart-count mb-2 col-2"
										aria-label="Recipient's users"
										type="number"
										name="user"
										autoComplete="off"
										// placeholder="20"
										value={userCount}
										onChange={(e) => setUser(e.target.value)}
									/>
									<span className="col-sm-5  col-sm-2 text-start text-cart ms-3 mb-2">
										{' '}
										<h5>
											{' '}
											<span className="glyphicon glyphicon-plus-sign  theme-color licence-add col-sm-3">
												<i className="fas fa-plus-circle"></i>
											</span>
										</h5>
									</span>
								</div>
							</Card.Body>
						</Card>
						{/* {
              true ? */}
						<label className="check ms-5 mt-3 col-1 col-md-1 col-sm-1 text-bold mb-2">
							<h5>{recurring.text}</h5>
							<input type="checkbox" id="blankCheckbox" value="option1" />
							<span className="checkmark mt-1"></span>
						</label>
						<div className="row text-bold ms-5 ">
							<div className="form-group col-sm-9 col-md-9 mt-3 text-center ">
								<div className="row">
									<div className="col-12">
										<table>
											<tr>
												<td>
													<Form.Label htmlFor="GSTIN">
														<div className="lf-cart-bill">
															{do_you_want_to_align_bill_on_particular_day.text}
														</div>
													</Form.Label>
												</td>
												<td>
													<label className="radio-orange lf-cart-bill-plan-select-radio">
														<div className="lf-cart-bill-plan-select mt-1">
															<b>{yes.text}</b>
														</div>
														<input type="radio" name="radio2" />
														<span className="radiokmark mt-2"></span>
													</label>
												</td>
												<td>
													<label className="radio-orange lf-cart-bill-plan-select-radio ms-2">
														<h6 className="lf-cart-bill-plan-select mt-1">
															<b>{no.text}</b>
														</h6>
														<input type="radio" name="radio2" />
														<span className="radiokmark  mt-2"></span>
													</label>
												</td>
											</tr>
										</table>
									</div>
								</div>
							</div>

							<div className="row form-group ">
								<div className="col-sm-12 col-md-12">
									<table>
										<tr>
											<td>
												<Form.Label htmlFor="GSTIN">
													<div className="lf-cart-bill-day">
														{select_your_billing_day_of_each_month.text}
													</div>
												</Form.Label>
											</td>
											<td>
												<label className="radio-orange lf-bill-cart-day">
													<h5 className="lf-cart-bill-plan-select-period">1</h5>
													<input type="radio" name="radio1" />
													<span className="radiokmark mt-2"></span>
												</label>
											</td>
											<td>
												<label className="radio-orange ms-2 lf-bill-cart-day-select">
													<h5 className="lf-cart-bill-plan-select-period">5</h5>
													<input type="radio" name="radio1" />
													<span className="radiokmark mt-2"></span>
												</label>
											</td>
											<td>
												<label className="radio-orange ms-2 lf-bill-cart-day-select">
													<h5 className="lf-cart-bill-plan-select-period">
														10
													</h5>
													<input type="radio" name="radio1" />
													<span className="radiokmark mt-2"></span>
												</label>
											</td>
											<td>
												<label className="radio-orange ms-2 lf-bill-cart-day-select">
													<h5 className="lf-cart-bill-plan-select-period">
														15
													</h5>
													<input type="radio" name="radio1" />
													<span className="radiokmark mt-2"></span>
												</label>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>

						{/* } */}
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
							<div className="row text-bold  my-3  ">
								<div className="col-sm-12 col-md-12 float-end ms-5">
									<Button
										className="btn theme-btn lf-billing-btn-next lf-btn-cart float-end ms-2 col-sm-2 col-md-2"
										onClick={(e) => {
											e.preventDefault();
											props.purchaseLicence();
										}}>
										{pay_now.text}{' '}
									</Button>
									<Button
										className="btn theme-btn float-end col-sm-2 col-md-2"
										onClick={() => props.stepChange(2)}>
										{back.text}{' '}
									</Button>
									{/* <Link to="./billinginfo" className="btn  theme-btn  lf-billing-btn-next float-end col-sm-2 col-md-2">Back</Link> */}
								</div>
							</div>
						</div>
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
