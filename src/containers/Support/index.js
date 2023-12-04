import { useState } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { getSiteLanguageData } from '../../commons';
// import '../../App.css';

function Support() {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const { support, FAQ, call } = getSiteLanguageData('commons');
	const { email } = getSiteLanguageData('profile');
	return (
		<>
			{/*call commponent*/}
			{/* <span data-toggle="tooltip" data-placement="left" title="Tag"><i className="fas fa-tag me-2" onClick={() => handleShow()}  ></i> Support</span><br /> */}
			<Dropdown.Item
				className="lf-layout-profile-menu"
				onClick={() => handleShow()}>
				<i className="fas fa-headset"></i>
				<span className="ps-2">{support.text}</span>
			</Dropdown.Item>

			<Modal size="xl" show={show} onHide={handleClose} dialogclassName=" ">
				<Modal.Header closeButton>
					<div className="row">
						<div className="col mt-3">
							<span>
								<h3>{support.text}</h3>
							</span>
						</div>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col font-weight-bold">{FAQ.text}</div>
					</div>
					<div className="row">
						<div className="col">
							<div className="mt-2 text-warning">
								<span>1. The standard Lorem lpsum passage?</span>
							</div>
							<div className="mt-2">
								<p className="text-justify">
									Lorem Ipsum is simply dummy text of the printing and
									typesetting industry. Lorem Ipsum has been the industry's
									standard dummy text ever since the 1500s, when an unknown
									printer took a galley of type and scrambled it to make a type
									specimen book. It has survived not only five centuries, but
									also the leap into electronic typesetting, remaining
									essentially unchanged. It was popularised in the 1960s with
									the release of Letraset sheets containing Lorem Ipsum
									passages, and more recently with desktop publishing software
									like Aldus PageMaker including versions of Lorem Ipsum
								</p>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<div className="mt-2 text-warning">
								<span>2. Contrary to popular belief,Lorem Ipsum? </span>
							</div>
							<div className="mt-2">
								<p className="text-justify">
									Lorem Ipsum is simply dummy text of the printing and
									typesetting industry. Lorem Ipsum has been the industry's
									standard dummy text ever since the 1500s, when an unknown
									printer took a galley of type and scrambled it to make a type
									specimen book. It has survived not only five centuries, but
									also the leap into electronic typesetting, remaining
									essentially unchanged. It was popularised in the 1960s with
									the release of Letraset sheets containing Lorem Ipsum
									passages, and more recently with desktop publishing software
									like Aldus PageMaker including versions of Lorem Ipsum
								</p>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<div className="mt-2 text-warning">
								<span>3. Where can I get some?</span>
							</div>
							<div className="mt-2">
								<p className="text-justify">
									Lorem Ipsum is simply dummy text of the printing and
									typesetting industry. Lorem Ipsum has been the industry's
									standard dummy text ever since the 1500s, when an unknown
									printer took a galley of type and scrambled it to make a type
									specimen book. It has survived not only five centuries, but
									also the leap into electronic typesetting, remaining
									essentially unchanged. It was popularised in the 1960s with
									the release of Letraset sheets containing Lorem Ipsum
									passages, and more recently with desktop publishing software
									like Aldus PageMaker including versions of Lorem Ipsum
								</p>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<div className="mt-2 text-warning">
								<span>4. Why do we use it?</span>
							</div>
							<div className="mt-2">
								<p className="text-justify">
									Lorem Ipsum is simply dummy text of the printing and
									typesetting industry. Lorem Ipsum has been the industry's
									standard dummy text ever since the 1500s, when an unknown
									printer took a galley of type and scrambled it to make a type
									specimen book. It has survived not only five centuries, but
									also the leap into electronic typesetting, remaining
									essentially unchanged. It was popularised in the 1960s with
									the release of Letraset sheets containing Lorem Ipsum
									passages, and more recently with desktop publishing software
									like Aldus PageMaker including versions of Lorem Ipsum
								</p>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer className="d-flex flex-wrap justify-content-center px-0">
					<div className="row text-center">
						<div className="col-6 pe-0">
							<a href="tel:(+91)">
								<button
									type="button"
									className="float-end lf_support_btn_call btn btn-outline-secondary  show-verify">
									<i className="fa fa-phone pe-2"></i>
									{call.text}
								</button>
							</a>
						</div>
						<div className="col-6 px-0">
							<a href="mailto:admin@gmail.com">
								{' '}
								<button
									type="button"
									className="ms-md-1 lf_support_btn_email btn btn-outline-secondary btn-block  show-verify">
									<i className="fas fa-envelope pe-2"></i>
									{email?.text}
								</button>
							</a>
						</div>
					</div>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default Support;
