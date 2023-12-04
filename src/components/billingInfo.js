import { useEffect, useState } from 'react';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import Cart from './cart';
import getUserId, { getSiteLanguageData } from '../commons';
import { useDispatch, useSelector } from 'react-redux';
import { CREATE_BILLING_INFO } from '../store/actions/actionType';
import { createBillingInfo } from '../store/actions/License';
const userId = getUserId();

function BillingInfo(props) {
	const [show, setShow] = useState(false);
	const dispatch = useDispatch();
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [usePan, handleUsePan] = useState(false);
	const [info, setInfo] = useState({
		user_id: userId,
		billing_name: '',
		legal_name: '',
		address: '',
		city: '',
		state: '',
		country: '',
		zipcode: '',
		gsitn: '',
		pan_card: '',
		// is_sez: "",
	});
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setInfo({
			...info,
			[name]: value,
		});
	};
	const submitBillInfo = (e) => {
		e.preventDefault();
		dispatch(createBillingInfo(info));
	};
	const createBillInfo = useSelector((state) => {
		return state?.license?.[CREATE_BILLING_INFO] || [];
	});
	useEffect(() => {
		if (createBillInfo?.success && show) {
			handleClose();
		}
	}, [createBillInfo, dispatch]);
	const {
		billing_info,
		number_users,
		select_your_plan,
		monthly,
		yearly,
		quaterly,
		billing_name,
		legal_name_as_on_pan_card,
		address,
		city,
		state,
		country,
		zip_postal_code,
		email_address,
		contact_number,
		do_you_have_gstin,
		yes,
		no,
		gstin,
		pan_card,
		for_more_details_contact_us_at,
		or,
		number,
		gmail,
		are_you_registerd_in_sez_special_economic_zone,
	} = getSiteLanguageData('components/billingifo');
	return (
		<>
			<Modal.Header closeButton>
				<Modal.Title>
					<Modal.Title>{billing_info?.text}</Modal.Title>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="container">
					<Form onSubmit={submitBillInfo}>
						<div className="row mb-4 mt-1 form-inline text-bold">
							<div className="form-group col-lg-6">
								<Form.Label htmlFor="users">{number_users?.text}</Form.Label>
								<InputGroup className="ms-2 ">
									<FormControl
										aria-label="Recipient's users"
										type="text"
										name="user"
										autoComplete="off"
									/>
								</InputGroup>
							</div>
							<div className="form-group  col-lg-6">
								<div className="form-group float-end lf-billing-plan">
									<label className="float-start lf-billing-select-plan">
										{select_your_plan?.text}
									</label>
									<label className="radio-orange ">
										{monthly?.text}
										<input type="radio" name="licence_period" defaultChecked />
										<span className="radiokmark"></span>
									</label>
									<label className="radio-orange ">
										{yearly?.text}
										<input type="radio" name="licence_period" />
										<span className="radiokmark"></span>
									</label>
									<label className="radio-orange ">
										{quaterly?.text}
										<input type="radio" name="licence_period" />
										<span className="radiokmark"></span>
									</label>
								</div>
							</div>
						</div>
						<div className="row text-bold ">
							<div className="form-group  col-lg-6">
								<Form.Label htmlFor="First Name" className="ms-1">
									{billing_name?.text}
								</Form.Label>
								<InputGroup>
									<FormControl
										aria-label="Recipient's First Name"
										type="text"
										name="billing_name"
										autoComplete="organization"
										onChange={(e) => handleChange(e)}
										value={info.billing_name}
									/>
								</InputGroup>
							</div>
							<div className="form-group   col-lg-6">
								<Form.Label htmlFor="Last Name" className="ms-1 ">
									{legal_name_as_on_pan_card?.text}
								</Form.Label>
								<InputGroup>
									<FormControl
										aria-label="Recipient's LastName"
										type="text"
										name="legal_name"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={info.legal_name}
									/>
								</InputGroup>
							</div>
						</div>
						<div className="form-group text-bold">
							<Form.Label htmlFor="Address" className="ms-1">
								{address?.text}
							</Form.Label>
							<InputGroup>
								<FormControl
									type="text"
									name="address"
									autoComplete="address-line1"
									onChange={(e) => handleChange(e)}
									value={info.address}
								/>
							</InputGroup>
						</div>
						<div className="row text-bold">
							<div className="form-group  col-lg-3">
								<Form.Label htmlFor="City" className="ms-1">
									{city?.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="city"
										type="text"
										name="city"
										autoComplete="address-level2"
										onChange={(e) => handleChange(e)}
										value={info.city}
									/>
								</InputGroup>
							</div>
							<div className="form-group  col-lg-3">
								<Form.Label htmlFor="State" className="ms-1">
									{state?.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="state"
										type="text"
										name="state"
										autoComplete="address-level1"
										onChange={(e) => handleChange(e)}
										value={info.state}
									/>
								</InputGroup>
							</div>
							<div className="form-group  col-lg-3">
								<Form.Label htmlFor="Last Name" className="ms-1">
									{country?.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's country"
										type="text"
										name="country"
										autoComplete="country-name"
										onChange={(e) => handleChange(e)}
										value={info.country}
									/>
								</InputGroup>
							</div>
							<div className="form-group  col-lg-3 ">
								<Form.Label htmlFor="Last Name" className="ms-1 ">
									{zip_postal_code?.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's Zip"
										type="text"
										name="zipcode"
										autoComplete="postal-code"
										onChange={(e) => handleChange(e)}
										value={info.zipcode}
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group  col-lg-6">
								<Form.Label htmlFor="First Name" className="ms-1">
									{email_address?.text}
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
							<div className="form-group  col-lg-6">
								<Form.Label htmlFor="Last Name" className="ms-1">
									{contact_number?.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's Contact number"
										type="tel"
										name="contact_no"
										pattern="[0-9]{10}"
										autoComplete="tel-national"
										onChange={(e) => handleChange(e)}
										value={info.contact_no}
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="row form-group col-lg-6">
								<Form.Label htmlFor="GSTIN" className="ms-3 lf-plan-billing">
									{do_you_have_gstin?.text}
								</Form.Label>
								<div className=" col-lg-2">
									<span>
										<label className="radio-orange ">
											{yes?.text}
											<input type="radio" name="radio2" defaultChecked />
											<span
												onClick={() => handleUsePan(!usePan)}
												className="radiokmark"></span>
										</label>
									</span>
								</div>
								<div className=" col-lg-2 ">
									<span>
										<label className="radio-orange">
											{no?.text}
											<input type="radio" name="radio2" />
											<span
												onClick={() => handleUsePan(!usePan)}
												className="radiokmark"></span>
										</label>
									</span>
								</div>
							</div>
							{!usePan ? (
								<div className="form-group  ms-4 col-lg-6">
									<Form.Label htmlFor="GSTIN" className="ms-1">
										{gstin?.text}
									</Form.Label>
									<InputGroup className="">
										<FormControl
											type="text"
											name="gsitn"
											autoComplete="off"
											onChange={(e) => handleChange(e)}
											value={info.gsitn}
										/>
									</InputGroup>
								</div>
							) : (
								<div className="form-group  ms-4 col-lg-6">
									<Form.Label htmlFor="PAN" className="ms-1">
										{pan_card?.text}
									</Form.Label>
									<InputGroup className="">
										<FormControl
											type="text"
											name="pan_card"
											autoComplete="off"
											onChange={(e) => handleChange(e)}
											value={info.pan_card}
										/>
									</InputGroup>
								</div>
							)}
						</div>
						<div className="  col-lg-7 mt-1 text-bold ">
							<div className="row form-group">
								<Form.Label htmlFor="SEZ" className="ms-1 lf-plan-billing">
									{are_you_registerd_in_sez_special_economic_zone?.text}
								</Form.Label>
								<div className="  col-lg-2">
									<span>
										<label className="radio-orange">
											{yes > text}
											<input
												type="radio"
												name="is_sez"
												onChange={(e) => handleChange(e)}
												value={info.is_sez}
											/>
											<span className="radiokmark"></span>
										</label>
									</span>
								</div>
								<div className="  col-lg-2 ">
									<span>
										<label className="radio-orange">
											{no?.text}
											<input
												type="radio"
												name="is_sez"
												onChange={(e) => handleChange(e)}
												value={info.is_sez}
											/>
											<span className="radiokmark"></span>
										</label>
									</span>
								</div>
							</div>
						</div>
						<div className="row text-bold">
							<div className=" col-sm-12 col-md-12 col-lg-12 float-end">
								<span className="btn  theme-btn lf-billing-btn-next  float-end  col-md-1">
									{back?.text}
								</span>
							</div>
						</div>
					</Form>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<div className="m-auto text-bold lf-footer-contact-info">
					{for_more_details_contact_us_at?.text}{' '}
					<a href="tel:+919033938373" className="theme-link">{number?.text}</a>{' '}{or?.text}{' '}
					<a href = "mailto: support@livefield.app" className="theme-link">{gmail?.text}</a>

				{/* 	<span className="theme-color">{number?.text}</span> {or?.text}{' '}
					<span className="theme-color lf-footer-info-mail">{gmail?.text}</span> */}
				</div>
			</Modal.Footer>
		</>
	);
}

export default BillingInfo;
