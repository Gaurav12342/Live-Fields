import { useState } from 'react';
import { Card } from 'react-bootstrap';

import { Modal, FormControl, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getSiteLanguageData } from '../commons';

function Cart(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const {
		cart_details,
		basic,
		monthly,
		yearly,
		quaterly,
		minimum_5_users_can_subscribe,
		subscription_term_start_date,
		date,
		time_Period,
		months,
		next_due_date,
		payabel_price,
		price,
		off,
		per_month,
		recurring,
		do_you_want_to_align_bill_on_particular_day,
		select_your_billing_day_of_each_month,
		yes,
		no,
		number_Of_license,
		back,
		for_more_details_contact_us_at,
		number,
		gmail,
		or,
	} = getSiteLanguageData('components/cart');
	return (
		<>
			{/* <span className="btn  theme-btn ms-2 lf-billing-btn-next float-end col-sm-1" onClick={handleShow}> */}
			{/* <Button className=" theme-btn float-end col-sm-1 ms-2" type="submit" onClick={handleShow}>Next</Button> */}
			{/* </span> */}
			{/* <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      animation={false}
      dialogclassName="my-modal"
    > */}
			<Modal.Header closeButton>
				<Modal.Title>
					<h3 className="">{cart_details?.text}</h3>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="row ">
					<div className="col-md-12 col-sm-12 cart-details">
						<Card>
							<Card.Body>
								<div className="row mb-1 mt-1 form-inline text-bold">
									<div className="form-group   col-sm-7 col-md-7 lf-plan-main-title">
										<h1 className="plan-title theme-color ms-4">
											{basic?.text}
										</h1>
									</div>
									<div className="form-group ms-3 ">
										<div className="form-group  ms-5 ">
											<label className="radio-orange lf-cart-plan">
												{monthly?.text}
												<input
													type="radio"
													name="radio1"
													className="lf-cart-plan"
												/>
												<span className="radiokmark"></span>
											</label>
											<label className="radio-orange lf-cart-plan">
												{yearly?.text}
												<input
													type="radio"
													name="radio1"
													className="lf-cart-plan"
												/>
												<span className="radiokmark"></span>
											</label>
											<label className="radio-orange lf-cart-plan">
												{quaterly?.text}
												<input
													type="radio"
													name="radio1"
													className="lf-cart-plan"
												/>
												<span className="radiokmark"></span>
											</label>
										</div>
									</div>
								</div>

								<Card.Text>
									<div className="row  text-bold mt-2">
										<div className="col-sm-7 col-md-7 ms-4 ">
											<h4 className="lf-card-details">
												{minimum_5_users_can_subscribe?.text}
											</h4>
											<h4 className="lf-card-start-date">
												{subscription_term_start_date?.text}
												<span className="theme-color">{date?.text}</span>
											</h4>
											<h4 className="lf-card-start-date">
												{time_Period?.text}
												<span className="theme-color">{months?.text}</span>
											</h4>
											<h4 className="lf-card-start-date">
												{next_due_date?.text}
												<span className="theme-color">{date?.text}</span>
											</h4>
										</div>
										<div className="col-sm-4 col-md-4 theme-color cart-details-Subscribe text-center">
											<h4 className="text-center text-bold lf-cart-offer-title ">
												{payabel_price?.text}
											</h4>
											<span className="text-center col-sm-8  col-md-8 cart-price">
												{price?.text}
												<sup className="offers">{off?.text}</sup>{' '}
											</span>
											<span className="text-dark col-sm-4  col-md-4 card-rupee">
												&#8377;
											</span>
											<h5 className="theme-color text-bold lf-cart-price-info">
												{per_month?.text}
											</h5>
										</div>
									</div>
								</Card.Text>

								<div className="row  text-bold form-inline ">
									<span className="col-sm-3 col-md-3 text-end lf-cart-licence-wrapper ">
										<h4 className="lf-cart-licence-count">
											{number_Of_license?.text}
										</h4>
									</span>
									<FormControl
										className="col-sm-1 lf-cart-count"
										aria-label="Recipient's users"
										type="number"
										name="user"
										placeholder="20"
									/>
									<span className="col-sm-2  col-sm-2 text-start text-cart ">
										{' '}
										<h4>
											{' '}
											<span className="glyphicon glyphicon-plus-sign  theme-color licence-add col-sm-3">
												<i className="fas fa-plus-circle"></i>
											</span>
										</h4>
									</span>
								</div>
							</Card.Body>
						</Card>
						{/* {
              true ? */}
						<label className="check ms-5 mt-3 col-1 col-md-1 col-sm-1 text-bold mb-2">
							<h5>{recurring?.text}</h5>
							<input type="checkbox" id="blankCheckbox" value="option1" />
							<span className="checkmark mt-1"></span>
						</label>
						<div className="row text-bold ms-5 ">
							<div className="row form-group col-sm-9 col-md-9 mt-3 text-center ">
								<Form.Label htmlFor="GSTIN" className="ms-3 ">
									<h4 className="lf-cart-bill">
										{do_you_want_to_align_bill_on_particular_day?.text}
									</h4>
								</Form.Label>
								<div className="row ms-5 mt-1">
									<label className="radio-orange lf-cart-bill-plan-select-radio">
										<h4 className="lf-cart-bill-plan-select">{yes?.text}</h4>
										<input type="radio" name="radio2" />
										<span className="radiokmark mt-2"></span>
									</label>
									<label className="radio-orange lf-cart-bill-plan-select-radio ms-2">
										<h4 className="lf-cart-bill-plan-select">{no?.text}</h4>
										<input type="radio" name="radio2" />
										<span className="radiokmark  mt-2"></span>
									</label>
								</div>
							</div>

							<div className="row form-group col-sm-9 col-md-9 ms-1 text-center">
								<Form.Label htmlFor="GSTIN">
									<h4 className="lf-cart-bill-day">
										{select_your_billing_day_of_each_month?.text}
									</h4>
								</Form.Label>
								<div className="row ms-5 mt-1">
									<label className="radio-orange lf-bill-cart-day">
										<h4 className="lf-cart-bill-plan-select-period">1</h4>
										<input type="radio" name="radio1" />
										<span className="radiokmark mt-2"></span>
									</label>
									<label className="radio-orange ms-2 lf-bill-cart-day-select">
										<h4 className="lf-cart-bill-plan-select-period">5</h4>
										<input type="radio" name="radio1" />
										<span className="radiokmark mt-2"></span>
									</label>
									<label className="radio-orange ms-2 lf-bill-cart-day-select">
										<h4 className="lf-cart-bill-plan-select-period">10</h4>
										<input type="radio" name="radio1" />
										<span className="radiokmark mt-2"></span>
									</label>
									<label className="radio-orange ms-2 lf-bill-cart-day-select">
										<h4 className="lf-cart-bill-plan-select-period">15</h4>
										<input type="radio" name="radio1" />
										<span className="radiokmark mt-2"></span>
									</label>
								</div>
							</div>
						</div>

						{/* } */}
						<div className="payment-body m-auto  ">
							<div className="payment ">
								<div className="row mt-5">
									<div className="col-sm-8 col-md-8 ms-5 lf-cart-payment-title">
										<h1 className="theme-color mt-2 ms-3 lf-cart-payment-details">
											{total_payment?.text}
										</h1>
										<label className="check ms-4 mt-2 lf-cart-wallet-wrapper">
											<h4 className="lf-cart-wallet">
												{use_livefield_wallet?.text}
											</h4>
											<input
												type="checkbox"
												id="blankCheckbox"
												value="option1"
												defaultChecked
											/>
											<span className="checkmark ms-0 mt-1"></span>
										</label>
									</div>
									<div className="mt-3  lf-cart-payment-wrapper">
										<span className="text-center col-sm-1  col-md-1 theme-color ms-3 total-payment  payment-price">
											{price?.text}{' '}
										</span>
										<span className="text-dark col-sm-4 col-md-4 payment-rupee">
											&#8377;
										</span>
									</div>
								</div>
							</div>
							<div className="row text-bold  my-3 ">
								<div className="col-sm-12 col-md-12 float-end ms-5">
									{/* <Button className="btn  theme-btn lf-billing-btn-next lf-btn-cart float-end ms-2 col-sm-2 col-md-2">
                    Next{" "}
                  </Button> */}
									{/* <Button className="btn  theme-btn  float-end col-sm-2 col-md-2">
                    Back{" "}
                  </Button> */}
									<Link
										to="./billinginfo"
										className="btn  theme-btn  lf-billing-btn-next float-end col-sm-2 col-md-2">
										{back}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Modal.Footer>
					<div className="m-auto text-bold lf-footer-cart-info">
						{for_more_details_contact_us_at?.text}{' '}
						<a href="tel:+919033938373" className="theme-link">{number?.text}</a>{' '}{or?.text}{' '}
						<a href = "mailto: support@livefield.app" className="theme-link">{gmail?.text}</a>
						{/* <span className="theme-color">{number?.text}</span> {or?.text}{' '}
						<span className="theme-color">{gmail?.text}</span> */}
					</div>
				</Modal.Footer>
			</Modal.Body>
			{/* </Modal> */}
		</>
	);
}

export default Cart;
