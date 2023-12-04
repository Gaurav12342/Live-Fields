import { useEffect, useState } from 'react';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { EDIT_BILLING_INFO } from '../../store/actions/actionType';
import { editBillingInfo } from '../../store/actions/License';
import { getAllUserBillingInfo } from '../../store/actions/Profile';
import Countries from '../../commons/countries.json';
import States from '../../commons/state.json';
// import { getPincodeDetails } from "../store/actions/Utility";
import Dropdown from 'react-bootstrap/Dropdown';
import CustomSelect from '../../components/SelectBox';

function Address(props) {
	const userId = getUserId();
	const dispatch = useDispatch();
	const [useAddress, handleUseAddress] = useState(false);
	const [show, setShow] = useState(false);

	const [info, setInfo] = useState({
		user_id: userId,
		billing_info_id: props?.billData?._id,
		billing_name: props?.billData?.billing_name,
		legal_name: props?.billData?.legal_name,
		address: props?.billData?.address,
		zipcode: props?.billData?.zipcode,
		city: props?.billData?.city,
		state: props?.billData?.state,
		email: props?.billData?.email,
		contact_no: props?.billData?.contact_no,
		country: props?.billData?.country,
		gsitn: props?.billData?.gsitn,
		pan_card: props?.billData?.pan_card,
		is_sez: props?.billData?.is_sez,
	});

	const [usePan, handleUsePan] = useState(
		props?.billData?.gsitn ? false : true,
	);
	const [validate, setValidate] = useState(false);

	const handleClose = () => {
		setShow(false);
		dispatch(getAllUserBillingInfo(userId));
	};
	const handleShow = () => setShow(true);

	const handleChange = (e) => {
		const name = e.target.name;
		let value = e.target.value;
		if (name == 'gsitn' || name == 'pan_card')
			value = value ? value.toUpperCase() : value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitBill = (e) => {
		e.preventDefault();
		dispatch(editBillingInfo(info));
	};
	const billData = useSelector((state) => {
		return state?.license?.[EDIT_BILLING_INFO] || [];
	}, shallowEqual);
	useEffect(() => {
		if (billData?.success && show) {
			handleClose();
			dispatch(getAllUserBillingInfo(userId));
		}
	}, [billData, dispatch]);
	useEffect(() => {
		if (billData?.success === true) {
			handleClose();
			/* setInfo({
				...info,
				user_id: userId,
				directory_id: '',
				billing_name: '',
				address: '',
				email: '',
				contact_no: '',
				gsitn: '',
				pan_card: '',
			}); */
		}
	}, [billData?.success, dispatch]);

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
	} = getSiteLanguageData('components/planbillinginfo');

	const { are_you_registerd_in_sez_special_economic_zone } =
		getSiteLanguageData('components/billingifo');

	const { edit, save } = getSiteLanguageData('commons');
	return (
		<>
			<span className="float-end mt-4 theme-btn btn" onClick={handleShow}>
				<i class="far fa-edit me-2"></i>
				{edit.text}
			</span>
			<Modal show={show} onHide={handleClose} size="lg" animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>
						<h3>{`${edit.text} ${billing_detail.text}`}</h3>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitBill}>
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
										type="text"
										name="zipcode"
										onChange={(e) => handleChange(e)}
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
												handleChange({
													target: {
														name: 'state',
														value: e.value,
													},
												});
											}}
											value={stateList?.filter((c) => c?.value === info.state)}
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
										<Form.Label htmlFor="GSTIN" className="lf-plan-billing">
											{do_you_have_gstin?.text}
										</Form.Label>
										<label className="radio-orange d-inline ">
											{yes?.text}
											<input
												type="radio"
												name="doyouhavegst"
												defaultChecked={!usePan ? true : false}
												onClick={() => {
													handleUsePan(false);
													handleChange({
														target: {
															name: 'pan_card',
															value: null,
														},
													});
												}}
											/>
											<span
												onClick={() => {
													handleUsePan(false);
													handleChange({
														target: {
															name: 'pan_card',
															value: null,
														},
													});
												}}
												className="radiokmark"></span>
										</label>

										<label className="radio-orange d-inline">
											{no?.text}
											<input
												type="radio"
												name="doyouhavegst"
												defaultChecked={usePan ? true : false}
												onClick={() => {
													handleUsePan(true);
													handleChange({
														target: {
															name: 'gsitn',
															value: null,
														},
													});
												}}
											/>
											<span
												onClick={() => {
													handleUsePan(true);
													handleChange({
														target: {
															name: 'gsitn',
															value: null,
														},
													});
												}}
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
												<Form.Label htmlFor="SEZ" className="lf-plan-billing">
													{are_you_registerd_in_sez_special_economic_zone.text}
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
						{/* <div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Company Name" className="ms-1">
									Company Name
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's Company Name"
										type="text"
										name="billing_name"
										autoComplete="organization"
										onChange={(e) => handleChange(e)}
										value={info.billing_name}
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Address" className="ms-1">
									Address
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's Address"
										type="text"
										name="address"
										autoComplete="street-address"
										onChange={(e) => handleChange(e)}
										value={info.address}
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group col-sm-6">
								<Form.Label htmlFor="First Name" className="ms-1">
									Email Address
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's email"
										type="email"
										name="email"
										autoComplete="email"
										onChange={(e) => handleChange(e)}
										value={info.email}
									/>
								</InputGroup>
							</div>
							<div className="form-group col-sm-6">
								<Form.Label htmlFor="Last Name" className="ms-1">
									Contact Number
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's Contact number"
										type="tel"
										name="contact_no"
										autoComplete="tel-national"
										onChange={(e) => handleChange(e)}
										value={info.contact_no}
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row">
							{!useAddress ? (
								<div className="col-sm-12 row text-bold ">
									<div className="form-group form-inline   mt-4  col-sm-5 ms-5 me-2 ">
										<Form.Label htmlFor="GSTIN" className="text-center ms-5">
											Do You Have GSTIN:
										</Form.Label>
										<label className="radio-orange">
											YES
											<input
												type="radio"
												name="radio"
												onClick={() => handleUseAddress(!useAddress)}
											/>
											<span className="radiokmark"></span>
										</label>
										<label className="radio-orange">
											NO
											<input type="radio" name="radio" checked />
											<span className="radiokmark"></span>
										</label>
									</div>
									<div className="form-group col-sm-6 ms-4 ">
										<Form.Label htmlFor="PAN" className="ms-1">
											PAN Card
										</Form.Label>
										<InputGroup className="ms-3">
											<FormControl
												type="text"
												name="pan_card"
												autoComplete="off"
												onChange={(e) => handleChange(e)}
												value={info.pan_card}
											/>
										</InputGroup>
									</div>
								</div>
							) : (
								<div className="col-sm-12 row text-bold ">
									<div className="form-group form-inline   mt-4  col-sm-5 me-2 ms-5  ">
										<Form.Label htmlFor="GSTIN" className="text-center ms-5">
											Do You Have GSTIN:
										</Form.Label>
										<label className="radio-orange">
											YES
											<input type="radio" name="radio" checked />
											<span className="radiokmark"></span>
										</label>
										<label className="radio-orange">
											NO
											<input
												type="radio"
												name="radio"
												onClick={() => handleUseAddress(!useAddress)}
											/>
											<span className="radiokmark"></span>
										</label>
									</div>
									<div className="form-group col-sm-6 ms-4">
										<Form.Label htmlFor="GSTIN" className="ms-1">
											GSTIN
										</Form.Label>
										<InputGroup className="ms-4 ">
											<FormControl
												type="text"
												name="gsitn"
												autoComplete="off"
												onChange={(e) => handleChange(e)}
												value={info.gsitn}
											/>
										</InputGroup>
									</div>
								</div>
							)}
						</div>
						<div className="row text-bold">
							<div className="col-sm-12 float-end">
								<Button
									className="btn  theme-btn  float-end ms-2 "
									type="submit">
									Save{' '}
								</Button>
							</div>
						</div> */}
						<div className="row text-bold">
							<div className="col-sm-12 float-end">
								<Button
									className="btn  theme-btn  float-end ms-2 "
									type="submit">
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
				{/* <Modal.Footer>
					<div className="m-auto text-bold">
						For More Details Contact US At{' '}
						<span className="theme-color">(+91) 9033938373</span> Or{' '}
						<span className="theme-color">support@livefield.app</span>
					</div>
				</Modal.Footer> */}
			</Modal>
		</>
	);
}
export default Address;
