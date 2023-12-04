import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getSiteLanguageData } from '../../commons';

function Subscription_notification() {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const { subscription, contact_us } = getSiteLanguageData('subscription');
	return (
		<>
			<span
				className="text-bold  theme-color cancel-subscription"
				onClick={handleShow}>
				<h5>{`Cancel ${subscription.text}`}</h5>
			</span>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{`Cancel ${subscription.text}`}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h5>We are sorry to see you go.</h5>
					<div className="mt-1">Thank you for being with us.</div>
					<div className="mt-1">
						To cancel the subscription before the Renewal date, Contact our
						support team.
					</div>
				</Modal.Body>
				<Modal.Footer>
					<a
						href="https://livefield.app/contact-us"
						target={`_blank`}
						className="btn theme-btn btn-block"
						onClick={handleClose}>
						{contact_us.text}
					</a>
				</Modal.Footer>
			</Modal>
		</>
	);
}
export default Subscription_notification;
