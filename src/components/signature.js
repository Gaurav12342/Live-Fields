import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import SignatureCanvas from 'react-signature-canvas';
import getUserId, { getSiteLanguageData, variableValidator } from '../commons';
import { saveSignatureApi, getSignature } from '../store/actions/storeroom';
import { UploadSignature } from '../store/actions/Utility';
import { errorNotification } from '../commons/notification';

function Signature(props) {
	const [show, setShow] = useState(false);
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [activeSignature, setActiveSignature] = useState('');
	const handleClose = () => setShow(false);
	const sigCanvas = useRef({});
	const handleShow = () => {
		setShow(true);
	};
	
	useEffect(() => {
		dispatch(
			getSignature({
					user_id: getUserId(),
				}, (res) => {
					if (res.result && res.result.signature) {
						props.setUrl(res.result.signature);
						setActiveSignature(res.result.signature);
					}
				},
			),
		);
	}, []);
	
	const clear = () => {
		props.setUrl("");
		setActiveSignature("");
		if(typeof sigCanvas?.current?.clear == "function") sigCanvas.current.clear();
	};
	const save = () => {
		let isEmpty = sigCanvas?.current?.isEmpty();
		if(typeof isEmpty === "boolean" && isEmpty === false){
			const sigImg = sigCanvas.current.getSignaturePad().toDataURL('image/png');
			dispatch(
				UploadSignature({
					module_type: 'signatureUrl',
					module_key: project_id,
					file: sigImg,
					name: 'signature-' + (new Date().getTime()) + '.jpg',
				}, (sigData) => {
					if (sigData && sigData.result) {
						setActiveSignature(sigData.result);
						props.setUrl(sigData.result);
						dispatch(
							saveSignatureApi({
								signature_url: sigData.result,
								user_id: getUserId(),
							}, (res) => {
								// console.log(res, 'res');
							}),
						);
					}
				},
			));
		}else{
			errorNotification('Please fill the signature box to save');
		}
	};
	const { submit, report_signature, sign_report, clear_sign, sign } =
		getSiteLanguageData('reports/toolbar');
	return (
		<>
			<span
				type="submit"
				className="lf-main-button"
				onClick={() => handleShow()}>
				<i className="fa fa-paper-plane" aria-hidden="true"></i>{' '}
				{submit?.text}
			</span>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<div className="row">
						<div className="col mt-3">
							<span>
								<h4>{report_signature?.text}</h4>
							</span>
						</div>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className="container">
						<Form>	
							<span className="d-inline-block my-3 border border-2 lf-link-cursor">
								{props.url || activeSignature ? (
									<img
										src={props.url || activeSignature}
										alt="Sign"
										style={{
											display: 'block',
											width: '450px',
											height: '200px',
											maxWidth: '100%',
											// border: "1px solid #000"
										}}
									/>
								) : (
									<SignatureCanvas
										penColor="black"
										ref={sigCanvas}
										canvasProps={{
											width: 450,
											height: 200,
											className: 'sigCanvas',
										}}
									/>
								)}
							</span>
							<div className="">
								<Button className="btn-danger m-1" onClick={clear}>
									<i className="fa-solid fa-eraser pe-2"></i>
									{clear_sign?.text}
								</Button>
								<Button className="btn-success" onClick={save}>
									<i className="fa-solid fa-pen-nib pe-2"></i>
									{sign?.text}
								</Button>
							</div>
							{props.url || activeSignature ? (
								<Button
									className="theme-btn float-end"
									onClick={props?.signReport}>
									<i className="fa fa-paper-plane pe-2"></i>
									{submit?.text}
								</Button>
							) : (null)}									
						</Form>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default Signature;
