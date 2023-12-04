import { useState } from 'react';
import { Modal, Form, Button, FormControl, InputGroup } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from '../../commons';
import moment from 'moment';

const userId = getUserId();
function User({ info, ...props }) {
	const [show, setShow] = useState(false);
	const [updatePlan, setUpdatePlan] = useState({
		user_licence_id: info?._id,
		count: info?.count,
		licence_plan_id: info?.licence_plan_id,
	});
	const [selectedPlan, setSelectedPlan] = useState(
		info?.licence ? info?.licence : {},
	);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const maximum_user =
		parseInt(info?.licence?.type?.[0]?.maximum_user) - parseInt(info?.count);
	const minimum_user = Array.isArray(info.users)
		? info.users.length +
		  (info?.invition_hold_count &&
		  Number(info?.invition_hold_count) &&
		  !isNaN(info?.invition_hold_count)
				? Number(info?.invition_hold_count)
				: 0)
		: 1;
	const [user, setUser] = useState(info?.count);
	const [payableAmount, setPayableAmount] = useState(0);
	const [subtotalAmount, setSubtotalAmount] = useState(0);
	const [gstAmount, setGstAmount] = useState(0);
	const [newCount, setNewCount] = useState(0);
	const [endDate, setEndDate] = useState(0);
	const [startDate, setStartDate] = useState(0);

	const setUserCount = (userCount) => {
		userCount = parseInt(userCount);
		if (userCount >= minimum_user) {
			setUser(userCount);
			let plan = props.planData.find((pi, i) => {
				return (
					pi.type[0].minimum_user <= userCount &&
					pi.type[0].maximum_user >= userCount
				);
			});
			setSelectedPlan(plan);
			setUpdatePlan({
				...updatePlan,
				count: userCount,
				licence_plan_id: plan?._id,
			});
			if (info?.count && info?.count < userCount) {
				let monthlyPrice = info.licence.amount;
				let end_date = moment(new Date(info.end_date)).format('YYYY-MM-DD');
				let monthDays = moment(info.end_date).daysInMonth();
				let start_date = info.start_date
					? new Date(moment(info.start_date).format('YYYY-MM-DD'))
					: new Date(moment().format('YYYY-MM-DD'));

				start_date =
					start_date.getTime() <=
					new Date(moment().format('YYYY-MM-DD')).getTime()
						? new Date(moment().format('YYYY-MM-DD'))
						: new Date(start_date);

				let monthDiff = moment(new Date(end_date)).diff(start_date, 'days') + 1;
				let newUser = userCount - info?.count;
				setNewCount(newUser);
				let newUserPrice =
					monthDiff > 0 ? newUser * ((monthlyPrice * 12) / 365) * monthDiff : 1;
				let GST = 0;
				if (info?.billing_info_id) {
					let infoData = info?.billing_info?.find((inv, i) => {
						return inv?._id == info?.billing_info_id;
					});
					if (infoData && infoData?.country?.toLowerCase() == 'india') {
						GST = (newUserPrice * 18) / 100;
					}
				}
				setGstAmount(GST);
				setSubtotalAmount(newUserPrice);
				setPayableAmount(newUserPrice + GST);
				setEndDate(end_date);
				setStartDate(start_date);
			} else {
				setPayableAmount(0);
				setSubtotalAmount(0);
				setGstAmount(0);
				setNewCount(0);
				setStartDate(0);
				setEndDate(null);
			}
		}
	};

	const updatePlanHandler = () => {
		props.updatePlan({
			...updatePlan,
			payable_amount: payableAmount,
			sub_total: subtotalAmount,
			gst: gstAmount,
			new_count: newCount,
			selected_plan: selectedPlan,
			user_id: userId,
			align_to: endDate,
			align_from: startDate,
		});
	};
	const {
		btn_Users,
		change_license,
		current_license,
		assigned_license,
		un_assigned_license,
		change_license_to,
		revised_plan
	} = getSiteLanguageData('subscription');

	const { total, subtotal, gstin } = getSiteLanguageData('components/planbillinginfo');

	const { pay_now } = getSiteLanguageData('components/plans');


	return (
		<>
			<span
				href="/dashboard"
				className="btn theme-btn p-auto ms-3 float-end"
				onClick={handleShow}>
				<i className="fas fa-plus me-1" />{btn_Users?.text}
			</span>
			<Modal show={show} onHide={handleClose} size="">
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{change_license.text}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div class="d-flex justify-content-between my-1">
							<span class="">{current_license.text}:</span>
							<span class="">{info?.count}</span>
						</div>

						<div class="d-flex justify-content-between my-1">
							<span class="">{assigned_license.text}:</span>
							<span class="">
								{info?.users?.length + parseInt(info?.invition_hold_count)}
							</span>
						</div>

						<div class="d-flex justify-content-between mt-1">
							<span class="">{un_assigned_license.text}:</span>
							<span class="">
								{parseInt(info?.count) -
									info?.users?.length +
									parseInt(info?.invition_hold_count)}
							</span>
						</div>
					</div>

					<hr />

					<div className="row">
						{/* 	<h4>
							{info?.count}{' '}
							<span className="text-secondary">Current Licences </span>
						</h4>
						<span>
							{info?.users?.length + parseInt(info?.invition_hold_count)}{' '}
							<span className="text-secondary">License in Use:</span>
						</span>
						<span className="ms-2">
							{parseInt(info?.count) -
								info?.users?.length +
								parseInt(info?.invition_hold_count)}{' '}
							Unused Licenses:
						</span> */}

						<div class="d-flex justify-content-between align-items-center mt-1">
							<span class="">{change_license_to.text}:</span>
							<InputGroup className="w-auto">
								<button
									type="button"
									className="btn theme-btn group-btn-left"
									// disabled={props?.selected_plan?.type?.[0]?.minimum_user == props.userCount}
									onClick={() => {
										setUserCount(user - 1);
									}}>
									<i className="fa fa-minus"></i>
								</button>
								<FormControl
									type="number"
									value={user}
									onChange={(e) => setUserCount(e.target.value)}
									className="text-center"
									pattern="[0-9]"
									autoComplete="off"
								/>
								<button
									type="button"
									className="btn theme-btn group-btn-right"
									// disabled={props?.selected_plan?.type?.[0]?.maximum_user == props.userCount}
									onClick={() => {
										setUserCount(user + 1);
									}}>
									<i className="fa fa-plus"></i>
								</button>
							</InputGroup>
						</div>

						<div class="d-flex justify-content-between my-1">
							<span class="">{revised_plan.text}:</span>
							<span class="">{selectedPlan?.type?.[0]?.licence_name}</span>
						</div>

						{info?.count > user && (
							<div class="alert alert-warning mb-0" role="alert">
								If you reduce number of users, then your subscription will be
								lost and no refund will be given.
							</div>
						)}
					</div>

					<hr />

					<div className="row">
						<div class="d-flex justify-content-between my-1">
							<span class="">{subtotal?.text} :</span>
							<span class="">{subtotalAmount?.toFixed(2)}</span>
						</div>

						<div class="d-flex justify-content-between my-1">
							<span class="">{gstin?.text} :</span>
							<span class="">{gstAmount?.toFixed(2)}</span>
						</div>

						<h4 class="d-flex justify-content-between my-1">
							<span class="">{total?.text} :</span>
							<span class="text-primary">{payableAmount?.toFixed(2)}</span>
						</h4>

						{/* <h6>
							<span className="text-bold theme-color">
								New Estimated Bill :
							</span>
							<span className="ms-1">$322.00(Charged Monthly)</span>
						</h6>
						<h5 className="text-center mb-0">
							
							<Form.Group className="mb-0 mt-1" controlId="formBasicCheckbox">
								<label className="check mt-1 ">
									<h5 className="text-secondary">Use Livefield Wallet</h5>
									<input type="checkbox" id="blankCheckbox" value="option1" />
									<span className="checkmark user_check mt-1 "></span>
									<h6 className="text-center">Available Balance $ 100</h6>
								</label>
							</Form.Group>
						</h5> */}
					</div>
					<div className="text-center">
						<Button
							type="button"
							className="btn theme-btn mt-2 mb-3 btn-block ls"
							onClick={updatePlanHandler}>
							{pay_now?.text}
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default User;
