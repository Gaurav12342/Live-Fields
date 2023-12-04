import { useState } from 'react';
import { InputGroup, Modal, FormControl, Form, Button } from 'react-bootstrap';
import { getSiteLanguageData } from '../../commons';

function Bank() {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const {
		add_bank,
		bank_name,
		account_holder_name,
		account_number,
		save_bank,
	} = getSiteLanguageData('subscription');
	return (
		<>
			<span
				href="/dashboard"
				className="btn theme-btn m-auto float-end "
				onClick={handleShow}>
				{`+ ${add_bank.text}`}
			</span>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						<h3>{add_bank.text}</h3>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="First Name" className="ms-1">
									{bank_name.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label={bank_name.text}
										type="text"
										name="bankName"
										autoComplete="off"
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Last Name" className="ms-1">
									{account_holder_name.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's account number"
										type="text"
										name="accountNumber"
										pattern="[0-9]{16}"
										autoComplete="off"
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="form-group col-sm-12">
								<Form.Label htmlFor="Last Name" className="ms-1">
									{account_number.text}
								</Form.Label>
								<InputGroup className="">
									<FormControl
										aria-label="Recipient's account number"
										type="text"
										name="accountNumber"
										pattern="[0-9]{16}"
										autoComplete="off"
									/>
								</InputGroup>
							</div>
						</div>
						<div className="row text-bold">
							<div className="col-sm-12 float-end">
								<Button className="btn  theme-btn  btn-block float-end ms-2 ">
									<i class="fa-solid fa-floppy-disk pe-2"></i>
									{save_bank.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default Bank;
