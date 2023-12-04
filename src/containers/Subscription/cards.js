import { useEffect, useState } from 'react';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../commons';
import { CREATE_USER_CARDS } from '../../store/actions/actionType';
import { createUsercards, getAllUserCards } from '../../store/actions/Profile';
const userId = getUserId();

function Card() {
	const dispatch = useDispatch();
	const { add_cards, card_holder_name, card_name, card_number,valid_upto,save_card } =
		getSiteLanguageData('subscription');

	const {month,year} = getSiteLanguageData('commons');

	const [profile, setCard] = useState({
		user_id: userId,
		cutomer_name: '',
		card_number: '',
		card_expiry_month: '',
		card_expiry_year: '',
	});
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setCard({
			...profile,
			[name]: value,
		});
	};
	const createUsercardsResult = useSelector((state) => {
		return state?.profile?.[CREATE_USER_CARDS] || [];
	});
	useEffect(() => {
		if (createUsercardsResult?.success === true) {
			handleClose();
			setCard({
				...profile,
				user_id: userId,
				cutomer_name: '',
				card_number: '',
				card_expiry_month: '',
				card_expiry_year: '',
			});
			dispatch(getAllUserCards(userId));
		}
	}, [createUsercardsResult?.success, dispatch]);

	const submitCard = (e) => {
		e.preventDefault();
		dispatch(createUsercards(profile));
	};

	return (
		<>
			<span
				href="/dashboard"
				className="btn theme-btn m-auto float-end "
				onClick={handleShow}>
				+ {add_cards.text}
			</span>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						<h3>{add_cards}</h3>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitCard}>
						<div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Card Name" className="ms-1">
									{card_holder_name.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										placeholder={card_name.text}
										aria-label="Card Name"
										type="text"
										name="cutomer_name"
										autoComplete="off"
										onChange={(e) => handleChange(e)}
										value={profile.cutomer_name}
										required
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Card Number" className="ms-1">
									{card_number.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										placeholder={card_number.text}
										type="text"
										name="card_number"
										pattern="[0-9]{16}"
										autoComplete="off"
										aria-label="Recipient's card number"
										onChange={(e) => handleChange(e)}
										value={profile.card_number}
										required
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group col-sm-9">
								<Form.Label htmlFor="Valid upto" className="ms-1">
									{valid_upto.text}
								</Form.Label>
								<InputGroup className="">
									<Form.Label htmlFor="month" className="ms-1">
										{month.text}
									</Form.Label>
									<select
										name="card_expiry_month"
										className="form-control"
										onChange={(e) => handleChange(e)}
										value={profile.card_expiry_month}>
										<option name="card_expiry_month">Select</option>
										{new Array(12).fill(1).map((x, k) => (
											<option name="card_expiry_month" value={k + 1}>
												{k + 1}
											</option>
										))}
									</select>
									<Form.Label htmlFor="year" className="ms-1">
										{year.text}
									</Form.Label>
									<select
										className="form-control"
										name="card_expiry_year"
										onChange={(e) => handleChange(e)}
										value={profile.card_expiry_year}>
										<option name="card_expiry_year">Select</option>
										{new Array(10).fill(1).map((x, k) => (
											<option
												name="card_expiry_year"
												value={k + new Date().getUTCFullYear()}>
												{k + new Date().getUTCFullYear()}
											</option>
										))}
									</select>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="col-sm-12 float-end">
								<Button
									type="submit"
									className="btn  theme-btn  btn-block float-end ms-2 ">
									{save_card.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default Card;
