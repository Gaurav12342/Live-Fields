import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Form,
	FormControl,
	InputGroup,
	Modal,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../commons';
import { gstValidation, pancardValidation } from '../helper';
import { CREATE_BILLING_INFO } from '../store/actions/actionType';
import { createBillingInfo, editBillingInfo } from '../store/actions/License';
import { getAllUserBillingInfo } from '../store/actions/Profile';
import Countries from '../commons/countries.json';
import States from '../commons/state.json';
// import { getPincodeDetails } from "../store/actions/Utility";
import Dropdown from 'react-bootstrap/Dropdown';
import CustomSelect from './SelectBox';

const PlanBillingInfo = ({
	data,
	planData,
	licence_period_id,
	setLPI,
	billinfo,
	...props
}) => {
	const userId = getUserId();
	// const [show, setShow] = useState(false);
	const dispatch = useDispatch();
	// const handleClose = () => setShow(false);
	const [validate, setValidate] = useState(false);

	const [editBillingDetails, setEditBillingDetails] = useState(false);
	const [info, setInfo] = useState({
		user_id: userId,
		userId: userId,
		address: billinfo?.[0]?.address || '',
		billing_name: billinfo?.[0]?.billing_name || '',
		city: billinfo?.[0]?.city || '',
		contact_no: billinfo?.[0]?.contact_no || '',
		country: billinfo?.[0]?.country || '',
		createdAt: billinfo?.[0]?.createdAt || '',
		email: billinfo?.[0]?.email || '',
		gsitn: billinfo?.[0]?.gsitn || '',
		is_default: billinfo?.[0]?.is_default || '',
		is_deleted: billinfo?.[0]?.is_deleted || '',
		is_sez: billinfo?.[0]?.is_sez || false,
		legal_name: billinfo?.[0]?.legal_name || '',
		pan_card: billinfo?.[0]?.pan_card || '',
		state: billinfo?.[0]?.state || '',
		updatedAt: billinfo?.[0]?.updatedAt || '',
		zipcode: billinfo?.[0]?.zipcode || '',
		_id: billinfo?.[0]?._id || null,
		billing_info_id: billinfo?.[0]?._id || null,
		subtotal: 0,
		gstvalue: 0,
	});
	const [usePan, handleUsePan] = useState(info?.gsitn ? false : true);
	const handleChange = (e) => {
		const name = e.target.name;
		let value = e.target.value;
		if (name == 'gsitn' || name == 'pan_card')
			value = value ? value.toUpperCase() : value;
		setInfo({
			...info,
			[name]: value,
		});

		if (name == 'country') props.changeCountry(value);
		if (name == 'is_sez') props.changeIsSez(value);
	};

	const submitBillInfo = (e) => {
		e.preventDefault();
		const post = {
			userId: info?.userId,
			billing_info_id: info._id,
			user_id: info?.userId,
			billing_name: info?.billing_name,
			legal_name: info?.legal_name,
			address: info?.address,
			city: info?.city,
			state: info?.state,
			country: info?.country,
			zipcode: info?.zipcode,
			contact_no: info?.contact_no,
			email: info?.email,
			is_sez: info?.is_sez,
		};
		if (
			info?.country?.toLowerCase() == 'india' &&
			info?.gsitn &&
			info?.gsitn !== ''
		) {
			post['gsitn'] = info?.gsitn;
		}
		if (
			info?.country?.toLowerCase() == 'india' &&
			info?.pan_card &&
			info?.pan_card !== ''
		) {
			post['pan_card'] = info?.pan_card;
		}
		if (info._id && info._id !== '') {
			dispatch(
				editBillingInfo(post, false, (resData) => {
					dispatch(
						getAllUserBillingInfo(userId, (bData) => {
							props.purchaseLicence();
						}),
					);

					// props.stepChange(3);
				}),
			);
		} else {
			delete post['billing_info_id'];
			dispatch(
				createBillingInfo(post, false, (resData) => {
					dispatch(
						getAllUserBillingInfo(userId, (bData) => {
							props.purchaseLicence();
						}),
					);
					// props.stepChange(3);
				}),
			);
		}
	};
	const createBillInfo = useSelector((state) => {
		return state?.license?.[CREATE_BILLING_INFO] || [];
	});
	/* useEffect(() => {
		if (createBillInfo?.success && show) {
			handleClose();
		}
	}, [createBillInfo, dispatch]);
 */
	// const onPincodeBlur = () => {
	//     getPincodeDetails(info.zipcod, function (res) {
	//         if (res?.[0]) {
	//             setInfo({
	//                 ...info,
	//                 country: 'India',
	//                 city: res[0].districtname?.toLowerCase(),
	//                 state: res[0].statename?.toLowerCase(),
	//                 show: true
	//             })
	//             // if (res[0].taluk == 'NA' || res[0].taluk == 'na') {
	//             //     getTalukaList(res[0].districtname)
	//             // }
	//         }
	//         // else {
	//         //     setData({
	//         //         ...data,
	//         //         taluka: '',
	//         //         distrcit: '',
	//         //         state: '',
	//         //         show: true
	//         //     })
	//         // }
	//     })
	// }
	const {
		billing_info,
		number_users,
		billing_name,
		legal_name_as_on_pan_card,
		address,
		city,
		zip_postal_code,
		state,
		country,
		email_address,
		contact_number,
		do_you_have_gstin,
		yes,
		no,
		gstin,
		pan_card,
		back,
		for_more_details_contact_us_at,
		or,
		number,
		gmail,
		next,
		select_your_plan,
		billing_detail,
		order_summary,
		number_of_license,
		number_of_month,
		price_per_month,
		bill_on_perticular_day,
		billing_day_each_month,
		total,
		complate_purchase,
	} = getSiteLanguageData('components/planbillinginfo');

	const {
		are_you_registerd_in_sez_special_economic_zone,
		registerd_in_sez_special_economic_zone,
	} = getSiteLanguageData('components/billingifo');
	const countryList = Countries.map((c, i) => {
		return {
			value: c.name,
			label: c.name,
		};
	});

	const stateList = States.map((s, i) => {
		return {
			value: s.state,
			label: s.state,
		};
	});
	return (
		<>
			<Form onSubmit={submitBillInfo}>
				<div className="row my-5">
					<div className="col-lg-8">
						<Card className="white-box me-4">
							<Card.Body>
								<Card.Title className="white-box-label">
									{billing_detail.text}
								</Card.Title>
								<Card.Text>
									<div className="form-group mb-3">
										<InputGroup>
											<Form.Label htmlFor="users">
												{number_users?.text}
											</Form.Label>
											<button
												type="button"
												className="btn theme-btn group-btn-left"
												// disabled={props?.selected_plan?.type?.[0]?.minimum_user == props.userCount}
												onClick={() => {
													props.setUser(props.userCount - 1);
												}}>
												<i className="fa fa-minus"></i>
											</button>
											<FormControl
												className="w-10"
												aria-label="Recipient's users"
												type="number"
												name="user"
												value={props.userCount}
												onChange={(e) => props.setUser(e.target.value)}
											/>
											<button
												type="button"
												className="btn theme-btn group-btn-right"
												// disabled={props?.selected_plan?.type?.[0]?.maximum_user == props.userCount}
												onClick={() => {
													props.setUser(props.userCount + 1);
												}}>
												<i className="fa fa-plus"></i>
											</button>
										</InputGroup>
									</div>

									<div className="form-group lf-billing-plan">
										<InputGroup>
											<Form.Label className="float-start lf-billing-select-plan">
												{select_your_plan?.text}
											</Form.Label>
											{Object.keys(planData).map((lpi, k) => (
												<label
													key={k}
													onClick={() => setLPI(lpi)}
													className="radio-orange text-capitalize">
													{
														data?.filter((d) => d.licence_period_id === lpi)[0]
															?.period?.[0]?.name
													}
													<input
														type="radio"
														name="licence_period"
														defaultChecked={
															licence_period_id === lpi ? true : false
														}
													/>
													<span className="radiokmark mt-1"></span>
												</label>
											))}
										</InputGroup>
									</div>
								</Card.Text>
							</Card.Body>
						</Card>

						<Card className="white-box mt-5 me-4">
							<Card.Body>
								<Card.Title>
									<div className="row">
										<div className="col-6">
											<div className="white-box-label">
												{billing_detail.text}
											</div>
										</div>
										<div className="col-6 text-end">
											<button
												type="button"
												className="btn theme-btn"
												onClick={() =>
													setEditBillingDetails(!editBillingDetails)
												}>
												<i className="fa fa-pencil"></i>
											</button>
										</div>
									</div>
								</Card.Title>

								<Card.Text>
									{editBillingDetails ? (
										<>
											<div className="row">
												<div className="form-group mb-3">
													<Form.Label htmlFor="Last Name" className="mb-0">
														{country?.text}
													</Form.Label>
													<InputGroup className="">
														<CustomSelect
															className="col-sm-5 bg-white"
															name="country"
															onChange={(e) => {
																console.log(e);
																handleChange({
																	target: {
																		name: 'country',
																		value: e.value,
																	},
																});
																if (e.value != 'India') {
																	setValidate(true);
																} else {
																}
															}}
															value={countryList?.filter(
																(c) => c?.value === info.country,
															)}
															options={countryList}></CustomSelect>
														{/* <FormControl
														aria-label="Recipient's country"
														type="text"
														name="country"
														onChange={(e) => handleChange(e)}
														value={info.country}
														required
													/> */}
													</InputGroup>
												</div>
											</div>

											<div className="row ">
												<div className="form-group col-lg-6 mb-3">
													<Form.Label htmlFor="First Name" className="mb-0">
														{billing_name?.text}
													</Form.Label>
													<InputGroup className="">
														<FormControl
															aria-label="Recipient's First Name"
															type="text"
															name="billing_name"
															onChange={(e) => handleChange(e)}
															value={info.billing_name}
															required
														/>
													</InputGroup>
												</div>
												<div className="form-group col-lg-6 mb-3">
													<Form.Label htmlFor="Last Name" className="mb-0">
														{legal_name_as_on_pan_card?.text}
													</Form.Label>
													<InputGroup className="">
														<FormControl
															aria-label="Recipient's LastName"
															type="text"
															name="legal_name"
															onChange={(e) => handleChange(e)}
															value={info.legal_name}
															required
														/>
													</InputGroup>
												</div>
												<div className="form-group mb-3">
													<Form.Label htmlFor="Address" className="mb-0">
														{address?.text}
													</Form.Label>
													<InputGroup className="">
														<FormControl
															type="text"
															name="address"
															onChange={(e) => handleChange(e)}
															value={info.address}
															required
														/>
													</InputGroup>
												</div>
											</div>

											<div className="row">
												<div className="form-group col-lg-4 mb-3">
													<Form.Label htmlFor="Last Name" className="mb-0">
														{zip_postal_code?.text}
													</Form.Label>
													<InputGroup className="">
														<FormControl
															aria-label="Recipient's Zip"
															type="number"
															name="zipcode"
															onChange={(e) => {
																e = e ? e : window.event;
																let charCode = e.which ? e.which : e.keyCode;
																if (
																	charCode > 31 &&
																	(charCode < 48 || charCode > 57)
																) {
																	return false;
																} else {
																	handleChange(e);
																}
															}}
															value={info.zipcode}
															// onBlur={() => onPincodeBlur()}
															required
														/>
													</InputGroup>
												</div>
												<div className="form-group col-lg-4 mb-3">
													<Form.Label htmlFor="City" className="mb-0">
														{city?.text}
													</Form.Label>
													<InputGroup className="">
														<FormControl
															aria-label="Recipient's First Name"
															type="text"
															name="city"
															onChange={(e) => handleChange(e)}
															value={info.city}
															required
														/>
													</InputGroup>
												</div>
												<div className="form-group col-lg-4 mb-3">
													<Form.Label htmlFor="State" className="mb-0">
														{state?.text}
													</Form.Label>
													<InputGroup className="">
														{info.country?.toLowerCase() == 'india' ? (
															<CustomSelect
																className="w-100 bg-white"
																name="state"
																onChange={(e) => {
																	console.log(e);
																	handleChange({
																		target: {
																			name: 'state',
																			value: e.value,
																		},
																	});
																}}
																value={stateList?.filter(
																	(c) => c?.value === info.state,
																)}
																options={stateList}></CustomSelect>
														) : (
															<FormControl
																aria-label="state"
																type="text"
																name="state"
																onChange={(e) => handleChange(e)}
																value={info.state}
																required
															/>
														)}
													</InputGroup>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-lg-6 mb-3">
													<Form.Label htmlFor="First Name" className="mb-0">
														{email_address?.text}
													</Form.Label>
													<InputGroup className="">
														<FormControl
															aria-label="Recipient's email"
															type="email"
															name="email"
															onChange={(e) => handleChange(e)}
															value={info.email}
															required
														/>
													</InputGroup>
												</div>
												<div className="form-group col-lg-6 mb-3">
													<Form.Label htmlFor="Last Name" className="mb-0">
														{contact_number?.text}
													</Form.Label>
													<InputGroup className="">
														<FormControl
															aria-label="Recipient's Contact number"
															type="tel"
															name="contact_no"
															onChange={(e) => handleChange(e)}
															value={info.contact_no}
															required
														/>
													</InputGroup>
												</div>
											</div>
											{info.country?.toLowerCase() == 'india' ? (
												<>
													<div className="row">
														<div className="form-group col-6 mt-4 d-flex">
															<Form.Label
																htmlFor="GSTIN"
																className="lf-plan-billing">
																{do_you_have_gstin?.text}
															</Form.Label>
															<label className="radio-orange d-inline ">
																{yes?.text}
																<input
																	type="radio"
																	name="doyouhavegst"
																	defaultChecked={!usePan ? true : false}
																	onClick={() => handleUsePan(false)}
																/>
																<span
																	onClick={() => handleUsePan(false)}
																	className="radiokmark"></span>
															</label>

															<label className="radio-orange d-inline">
																{no?.text}
																<input
																	type="radio"
																	name="doyouhavegst"
																	defaultChecked={usePan ? true : false}
																	onClick={() => handleUsePan(true)}
																/>
																<span
																	onClick={() => handleUsePan(true)}
																	className="radiokmark mt-1"></span>
															</label>
														</div>
														{!usePan ? (
															<div className="form-group col-6 mb-3">
																<Form.Label htmlFor="GSTIN" className="mb-0">
																	{gstin?.text}
																</Form.Label>
																<FormControl
																	type="text"
																	name="gsitn"
																	onChange={(e) => handleChange(e)}
																	onBlur={(e) => {
																		let regex =
																			/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
																		if (regex.test(e.target.value)) {
																			setValidate(true);
																		} else {
																			setValidate(false);
																			alert('Please Fill Valid GST NO !');
																		}
																	}}
																	value={info.gsitn}
																	required
																/>
															</div>
														) : (
															<div className="form-group col-lg-6 mb-3">
																<Form.Label htmlFor="PAN" className="mb-0">
																	{pan_card?.text}
																</Form.Label>
																<InputGroup className="">
																	<FormControl
																		type="text"
																		name="pan_card"
																		onChange={(e) => handleChange(e)}
																		onBlur={(e) => {
																			let regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
																			if (regex.test(e.target.value)) {
																				setValidate(true);
																			} else {
																				setValidate(false);
																				alert('Please Fill Valid PAN NO !');
																			}
																		}}
																		value={info?.pan_card}
																		required
																	/>
																</InputGroup>
															</div>
														)}
													</div>
													<div className="row">
														<div className="col-lg-12 mt-1 ">
															<div className="row form-group">
																<div className="form-group d-flex">
																	<Form.Label
																		htmlFor="SEZ"
																		className="lf-plan-billing">
																		{
																			are_you_registerd_in_sez_special_economic_zone.text
																		}
																	</Form.Label>
																	<span className="d-inline">
																		<label className="radio-orange">
																			{yes?.text}
																			<input
																				type="radio"
																				name="is_sez"
																				onChange={(e) => handleChange(e)}
																				value={true}
																				defaultChecked={info?.is_sez}
																			/>
																			<span className="radiokmark mt-1"></span>
																		</label>
																	</span>
																	<span className="d-inline">
																		<label className="radio-orange">
																			{no?.text}
																			<input
																				type="radio"
																				name="is_sez"
																				onChange={(e) => handleChange(e)}
																				value={false}
																				defaultChecked={!info?.is_sez}
																			/>
																			<span className="radiokmark mt-1"></span>
																		</label>
																	</span>
																</div>
															</div>
														</div>
													</div>
												</>
											) : (
												''
											)}
										</>
									) : (
										<>
											<div className="mb-3">
												<h6 className="me-2">
													<span className="">{billing_name?.text} :</span>
													<span className="text-capitalize text-secondary ms-2">
														{info.billing_name}
													</span>
												</h6>
											</div>

											<div className="mb-3">
												<h6 className="me-2">
													<span className="">
														{legal_name_as_on_pan_card?.text} :
													</span>
													<span className="text-capitalize text-secondary ms-2">
														{info.legal_name}
													</span>
												</h6>
											</div>

											<div className="mb-3">
												<h6 className="me-2">
													<span className="">{address?.text} :</span>
													<span className="text-capitalize text-secondary ms-2">
														{info.address}, {info.city}, {info.state},{' '}
														{info.country} - {info.zipcode}
													</span>
												</h6>
											</div>

											<div className="mb-3">
												<h6 className="me-2">
													<span className="">{email_address?.text} :</span>
													<span className="text-secondary ms-2">
														{info.email}
													</span>
												</h6>
											</div>

											<div className="mb-3">
												<h6 className="me-2">
													<span className="">{contact_number?.text} :</span>
													<span className="text-secondary ms-2">
														{info.contact_no}
													</span>
												</h6>
											</div>
											{info.country?.toLowerCase() == 'india' ? (
												<>
													{info.gsitn && (
														<div className="mb-3">
															<h6 className="me-2">
																<span className="">{gstin?.text} :</span>
																<span className="text-capitalize text-secondary ms-2">
																	{info.gsitn}
																</span>
															</h6>
														</div>
													)}

													{info.gsitn ? (
														''
													) : (
														<div className="mb-3">
															<h6 className="me-2">
																<span className="">{pan_card?.text} :</span>
																<span className="text-capitalize text-secondary ms-2">
																	{info?.pan_card}
																</span>
															</h6>
														</div>
													)}

													<div className="">
														<h6 className="me-2">
															<span className="">
																{registerd_in_sez_special_economic_zone.text}
															</span>
															<span className="text-capitalize text-secondary ms-2">
																{info?.is_sez ? 'Yes' : 'No'}
															</span>
														</h6>
													</div>
												</>
											) : (
												''
											)}
										</>
									)}
								</Card.Text>
							</Card.Body>
						</Card>
					</div>

					<div className="col-lg-4">
						<Card className="white-box">
							<Card.Body>
								<Card.Title className="white-box-label">
									{order_summary.text}
								</Card.Title>

								<Card.Text>
									<div className="d-flex justify-content-between my-1">
										<span className="">Plan Name:</span>
										<span className="">
											{props?.selected_plan?.type?.[0]?.licence_name}
										</span>
									</div>
									<div className="d-flex justify-content-between my-1">
										<span className="">{number_of_license.text}</span>
										<span className="">{props.userCount}</span>
									</div>
									<div className="d-flex justify-content-between my-1">
										<span className="">{number_of_month.text}</span>
										<span className="">
											{props?.selected_plan?.period?.[0]?.duration}
										</span>
									</div>
									<div className="d-flex justify-content-between my-1">
										<span className="">{price_per_month.text}</span>
										<span className="">
											(&#8377;){props?.selected_plan?.amount}
										</span>
									</div>
									<hr />
									<div className="d-flex justify-content-between my-1">
										<span className="">{bill_on_perticular_day.text}</span>
										<span className="d-flex">
											<label
												className="radio-orange d-inline"
												style={{ fontSize: '12px', marginBottom: '0px' }}>
												{yes?.text}
												<input
													type="radio"
													name="align_bill"
													defaultChecked={props.isAlign}
													onClick={() => {
														props.changeBillingStart(props.billingStart);
														props.setIsAlign(true);
													}}
												/>
												<span
													onClick={() => {
														props.changeBillingStart(props.billingStart);
														props.setIsAlign(true);
													}}
													className="radiokmark mt-1"></span>
											</label>

											<label
												className="radio-orange d-inline"
												style={{ fontSize: '12px', marginBottom: '0px' }}>
												{no?.text}
												<input
													type="radio"
													name="align_bill"
													defaultChecked={!props.isAlign}
													onClick={() => {
														props.changeBillingStart(null);
														props.setIsAlign(false);
													}}
												/>
												<span
													onClick={() => {
														props.changeBillingStart(null);
														props.setIsAlign(false);
													}}
													className="radiokmark mt-1"></span>
											</label>
										</span>
									</div>

									{props.isAlign ? (
										<>
											<div className="d-flex justify-content-between my-1">
												<span className="">{billing_day_each_month.text}</span>
												<Dropdown>
													<Dropdown.Toggle
														id="dropdown-basic"
														variant="transparent"
														className="py-0">
														{props.billingStart && props.billingStart < 10
															? '0' + props.billingStart
															: props.billingStart}
													</Dropdown.Toggle>

													<Dropdown.Menu>
														<Dropdown.Item
															onClick={() => props.changeBillingStart(1)}>
															01
														</Dropdown.Item>
														<Dropdown.Item
															selec
															onClick={() => props.changeBillingStart(5)}>
															05
														</Dropdown.Item>
														<Dropdown.Item
															onClick={() => props.changeBillingStart(10)}>
															10
														</Dropdown.Item>
														<Dropdown.Item
															onClick={() => props.changeBillingStart(15)}>
															15
														</Dropdown.Item>
													</Dropdown.Menu>
												</Dropdown>
											</div>
											<div className="d-flex justify-content-between my-1">
												<span className="">Align Price</span>
												<span className="">
													(&#8377;) {props?.alignPrice?.toFixed(2)}
												</span>
											</div>
											{/* <div className="d-flex justify-content-between my-1">
													<span className="">
														Align Price (Included in sub total)
													</span>
													<span className="">
														(&#8377;) {
															(props?.alignPrice?.toFixed(2))
														}
													</span>
												</div> */}
										</>
									) : (
										''
									)}

									<hr />
									<div className="d-flex justify-content-between my-1">
										<span className="">Subtotal</span>
										<span className="">
											(&#8377;){props?.totalPrice?.toFixed(2)}
										</span>
									</div>
									{info.country?.toLowerCase() == 'india' ? (
										<div className="d-flex justify-content-between my-1">
											<span className="">GST (18%)</span>
											<span className="">
												(&#8377;) {props?.gstAmount?.toFixed(2)}
											</span>
										</div>
									) : (
										''
									)}

									<hr />

									{/* <div className="d-flex justify-content-between my-1">
										<span className="">
										<Form.Group controlId="formBasicCheckbox">
												<Form.Check
													type={'checkbox'}
													id={`default-checkbox`}
													label={`Use Livefield Wallet`}
												/>
										</Form.Group>
											
										</span>
										<span className="">
											(&#8377;) 300.00
										</span>
									</div>
									<hr/> */}
									<h4 className="d-flex justify-content-between my-1">
										<span className="">{total.text}</span>
										<span className="text-primary">
											(&#8377;){' '}
											{/* {
												((((props?.selected_plan?.amount * props?.selected_plan?.period?.[0]?.duration * props.userCount) * 18) / 100) + props?.selected_plan?.amount * props?.selected_plan?.period?.[0]?.duration * props.userCount) + props.alignPrice
											} */}
											{(props.totalPrice + props.gstAmount)?.toFixed(2)}
										</span>
									</h4>
									<div className="pt-4">
										<Button
											type="submit"
											disabled={!info?.pan_card && !info?.gsitn && !validate}
											className="btn theme-btn lf-billing-btn-next lf-btn-cart col-12 ms-2"
											// onSubmit={submitBillInfo()}
											// onClick={() => props.stepChange(3)}
										>
											{complate_purchase?.text}
										</Button>
									</div>
								</Card.Text>
							</Card.Body>
						</Card>
					</div>
				</div>

				{/* <div className="row">
					<div className=" col-sm-12 col-md-12 col-lg-12 text-center">
						<Button
							className="btn theme-btn col-sm-2 col-md-2 "
							onClick={() => props.stepChange(1)}>
							{back?.text}
						</Button>
						<Button
							type="submit"
							disabled={!info?.pan_card && !info?.gsitn && !validate}
							className="btn theme-btn lf-billing-btn-next lf-btn-cart col-sm-2 col-md-2 ms-2"
							// onSubmit={submitBillInfo()}
							// onClick={() => props.stepChange(3)}
						>
							{next?.text}
						</Button>
						
					</div>
				</div> */}
			</Form>

			{/*  <Modal.Footer>
				<div className="m-auto text-bold lf-footer-contact-info">
					{for_more_details_contact_us_at?.text}{' '}
					<a href="tel:+919033938373" className="theme-link">{number?.text}</a>{' '}{or?.text}{' '}
					<a href = "mailto: support@livefield.app" className="theme-link">{gmail?.text}</a>
					<span className="theme-color">{number?.text}</span> {or?.text}{' '}
					<span className="theme-color lf-footer-info-mail">{gmail?.text}</span> 
				</div>
			</Modal.Footer> */}
		</>
	);
};

export default PlanBillingInfo;
