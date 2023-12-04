import moment from 'moment';
import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from '../../commons';
import Dropdown from 'react-bootstrap/Dropdown';
const userId = getUserId();
function Bill(props) {
	const [useChecked, handleUseChecked] = useState(true);
	const [updatePlan, setUpdatePlan] = useState({
		user_licence_id: props?.info?._id,
		licence_plan_id: props?.info?.licence_plan_id,
	});
	const [selectedPlan, setSelectedPlan] = useState(
		props?.info?.licence ? props?.info?.licence : {},
	);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [startDay, setStartDay] = useState(0);
	const [endDate, setEndDate] = useState(0);
	const [startDate, setStartDate] = useState(0);
	const [isRecusrring, setIsRecurring] = useState(true);
	const [perDayPrice, setPerDayPrice] = useState(0);
	const [gstAmount, setGstAmount] = useState(0);
	const [payableAmount, setPayableAmount] = useState(0);
	const [alignDays, setAlignDays] = useState(0);

	const {
		align_bill,
		auto_renew,
		align_bill_on_particular_day,
		billing_day_of_next_renewal,
		next_renewal_date,
		days_to_be_paid,
	} = getSiteLanguageData('subscription');

	const { yes, no } = getSiteLanguageData('components/billingifo');

	const { total, subtotal, gstin } = getSiteLanguageData('components/planbillinginfo');

	const { pay_now } = getSiteLanguageData('components/plans');

	const changeBillingStart = (day) => {
		if (day && props?.info?.end_date) {
			let monthDays = moment(new Date(props?.info?.end_date)).daysInMonth();
			let todayDate = new Date();
			setStartDay(day);
			let endDate = new Date(props?.info?.end_date);
			let newDate = new Date(props?.info?.end_date);
			let alignDay = 0;
			if (parseInt(day) > endDate.getDate()) {
				newDate.setDate(day);
				newDate = new Date(newDate);
				newDate = moment(newDate).subtract(1, 'days').toDate();
				alignDay = moment(newDate).diff(endDate, 'days');
			} else {
				newDate = moment(newDate).add(1, 'M').toDate();
				newDate = newDate.setDate(day);
				newDate = new Date(newDate);
				newDate = moment(newDate).subtract(1, 'days').toDate();
				alignDay = moment(newDate).diff(endDate, 'days');
			}

			if (alignDay > 0) {
				let perDayPrice = (props?.info?.licence?.amount * 12) / 365;
				setPerDayPrice(perDayPrice);
				let alignDaysPrice = perDayPrice * alignDay * props?.info?.count;
				let gst = 0;
				if (props?.info?.billing_info_id) {
					let infoData = props?.info?.billing_info?.find((inv, i) => {
						return inv?._id == props?.info?.billing_info_id;
					});
					if (infoData && infoData?.country?.toLowerCase() == 'india') {
						gst = (alignDaysPrice * 18) / 100;
					} else {
						gst = 0;
					}
				} else {
					gst = 0;
				}
				setGstAmount(gst);
				setPayableAmount(alignDaysPrice + gst);
			} else {
				setGstAmount(0);
				setPayableAmount(0);
			}
			setEndDate(newDate);
			setStartDate(
				newDate
					? moment(newDate)
							.subtract(alignDay ? alignDay - 1 : alignDay, 'days')
							.toDate()
					: 0,
			);
			setAlignDays(alignDay);
		} else {
			setStartDay(0);
			setEndDate(props?.info?.end_date);
			setGstAmount(0);
			setPayableAmount(0);
			setAlignDays(0);
		}
	};

	const updatePlanHandler = () => {
		props.updatePlan({
			...updatePlan,
			payable_amount: payableAmount,
			sub_total: payableAmount - gstAmount,
			gst: gstAmount,
			selected_plan: selectedPlan,
			user_id: userId,
			end_date: endDate,
			align_to: endDate,
			align_from: startDate,
			is_recurring: isRecusrring,
			align_days: alignDays,
		});
		setTimeout(() => {
			handleClose();
		}, 2000);
	};

	return (
		<>
			<span
				href="/dashboard"
				className="btn theme-color p-auto float-end btn-style"
				onClick={handleShow}>
				<i class="fa-regular fa-calendar pe-2"></i>
				{align_bill.text}
			</span>
			<Modal show={show} onHide={handleClose} size="">
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{align_bill.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						{/* <div className="row  text-bold form-inline theme-secondary ">
							<span className="col-4 text-md-end px-0">
								<h4> Non Recurring</h4>
							</span>
							<span className="col-4 text-center">
								<label className="switch">
									<input
										type="checkbox"
										onChange={(e)=>{
											setIsRecurring(e.target.checked)
										}}
										className="text-center collapsible"
										data-toggle="collapse"
										data-target="#demo"
										checked={isRecusrring}
									/>
									<span className="slider round collapsible "></span>
								</label>
							</span>
							<span className="col-4">
								{' '}
								<h4 className=""> Recurring</h4>
							</span>
						</div> */}
						<div className="row">
							<div className="d-flex justify-content-between my-1 mt-2 d-none">
								<span className="px-0">{auto_renew.text}</span>
								<div className="d-flex">
									<label
										className="radio-orange d-inline-block"
										style={{ fontSize: '12px', marginBottom: '0px' }}>
										{yes.text}
										<input
											type="radio"
											name="is_recurring"
											checked={isRecusrring}
											onClick={() => setIsRecurring(true)}
										/>
										<span className="radiokmark mt-1"></span>
									</label>
									<label
										className="radio-orange d-inline-block"
										style={{ fontSize: '12px', marginBottom: '0px' }}>
										{no.text}
										<input
											type="radio"
											checked={!isRecusrring}
											onClick={() => {
												setIsRecurring(false);
												changeBillingStart(null);
											}}
											name="is_recurring"
										/>
										<span className="radiokmark mt-1"></span>
									</label>
								</div>
							</div>

							{isRecusrring && (
								<div className="">
									<div className="d-flex justify-content-between my-1 mt-1 d-none">
										<span className="px-0" htmlFor="GSTIN" id="demo">
											{align_bill_on_particular_day.text}
										</span>

										<div className="d-flex mt-1">
											<label
												className="radio-orange d-inline-block"
												style={{ fontSize: '12px', marginBottom: '0px' }}>
												{yes.text}
												<input
													onClick={() => handleUseChecked(true)}
													type="radio"
													checked={useChecked}
													name="radio"
												/>
												<span className="radiokmark mt-1"></span>
											</label>
											<label
												className="radio-orange d-inline-block"
												style={{ fontSize: '12px', marginBottom: '0px' }}>
												{no.text}
												<input
													type="radio"
													checked={!useChecked}
													onClick={() => {
														handleUseChecked(false);
														changeBillingStart(null);
													}}
													name="radio"
												/>
												<span className="radiokmark mt-1"></span>
											</label>
										</div>
									</div>
									{useChecked && (
										<>
											<div className="d-flex justify-content-between my-1 mt-1">
												<span className="">
													{billing_day_of_next_renewal.text}
												</span>
												<Dropdown>
													<Dropdown.Toggle
														id="dropdown-basic"
														variant="transparent"
														className="py-0 pe-0">
														{startDay && startDay < 10
															? '0' + startDay
															: startDay}
													</Dropdown.Toggle>

													<Dropdown.Menu>
														<Dropdown.Item
															onClick={() => changeBillingStart(1)}>
															01
														</Dropdown.Item>
														<Dropdown.Item
															selec
															onClick={() => changeBillingStart(5)}>
															05
														</Dropdown.Item>
														<Dropdown.Item
															onClick={() => changeBillingStart(10)}>
															10
														</Dropdown.Item>
														<Dropdown.Item
															onClick={() => changeBillingStart(15)}>
															15
														</Dropdown.Item>
													</Dropdown.Menu>
												</Dropdown>
											</div>
											<div className="d-flex justify-content-between my-1 mt-1">
												<span className="">{next_renewal_date.text}</span>
												<span className="">
													{endDate
														? moment(endDate)
																.add(1, 'days')
																.format('YYYY-MM-DD')
														: ''}
												</span>
											</div>
											<div className="d-flex justify-content-between my-1 mt-1">
												<span className="">{days_to_be_paid.text}</span>
												<span className="">{alignDays}</span>
											</div>
										</>
									)}
								</div>
							)}
						</div>
					</Form>
					<hr />
					<div className="row">
						<div class="d-flex justify-content-between my-1">
							<span class="">{subtotal.text} :</span>
							<span class="">
								(&#8377;) {(payableAmount - gstAmount)?.toFixed(2)}
							</span>
						</div>

						<div class="d-flex justify-content-between my-1">
							<span class="">{gstin.text} :</span>
							<span class="">(&#8377;) {gstAmount?.toFixed(2)}</span>
						</div>

						<h4 class="d-flex justify-content-between my-1">
							<span class="">{total?.text} :</span>
							<span class="text-primary">
								(&#8377;) {payableAmount?.toFixed(2)}
							</span>
						</h4>

						{/*<div className="col-12">
							<h3 className="text-center mt-1">
								<span className="text-bold theme-color ">
								Total :
								</span>
								<span className="ms-1">(&#8377;) {gstAmount?.toFixed(2)}</span>
							</h3>
						</div>
						<div className="col-12">
							<h3 className="text-center mt-1">
								<span className="text-bold theme-color ">
									Subtotal :
								</span>
								<span className="ms-1">(&#8377;) {(payableAmount- gstAmount)?.toFixed(2)}</span>
							</h3>
						</div>
						<div className="col-12">
							<h3 className="text-center mt-1">
								<span className="text-bold theme-color ">
									Total :
								</span>
								<span className="ms-1">(&#8377;) {(payableAmount)?.toFixed(2)}</span>
							</h3>
						</div>
						 <div className="col">
							<div className="row">
								<div className="col-md-5 col-3">
									<label className="check float-end mt-2 ps-3 ">
										<input type="checkbox" id="blankCheckbox" value="option1" />
										<span className="checkmark mt-1"></span>
									</label>
								</div>
								<div className="col-md-7 col-9 ps-0">
									<h5>Use Livefield Wallet</h5>
									<h6>Available Balance $ 100</h6>
								</div>
							</div>
						</div> */}
					</div>
					<hr />
					<div className="text-center">
						{/* 	<Button onClick={updatePlanHandler} type={"button"} className="btn theme-btn mb-3 btn-block ls">
							Payable Amount (&#8377;) {(payableAmount).toFixed(2)}
						</Button> */}

						<Button
							onClick={updatePlanHandler}
							type={'button'}
							className="btn theme-btn mb-3 btn-block ls">
							<i class="fa-solid fa-coins pe-2"></i>
							{pay_now.text}
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default Bill;
