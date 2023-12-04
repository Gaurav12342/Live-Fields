import { Modal, ModalBody } from 'react-bootstrap';
import React, { useState } from 'react';
import Upload from '../../components/upload';
import {
	setLightBoxImageData,
	setLightBoxImageDefaultUrl,
	toggleLightBoxView,
} from '../../store/actions/imageLightBox';
import { useDispatch } from 'react-redux';
import { clearUploadFile } from '../../store/actions/Utility';
import { getSiteLanguageData } from '../../commons';

function OpenAttachement(props) {
	const [show, setShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const {
		attachment
	} = getSiteLanguageData('reports/toolbar');

	const handleChangeImage = (name, value) => {
		props.handleChangeAnswers(name, value, props?.k);
		dispatch(clearUploadFile());
	};

	const handleDelete = (link) => {
		const newArr = props?.file?.filter((item) => {
			return item !== link;
		});
		handleChangeImage('file', newArr);
	};
	const handleImageView = (val) => {
		const images = [];
		props?.file.forEach((d) => {
			images.push(d);
		});
		dispatch(setLightBoxImageData(images));
		dispatch(toggleLightBoxView(true));
		dispatch(setLightBoxImageDefaultUrl(val));
	};


	return (
		<>
			{React.cloneElement(props.children, { onClick: handleShow })}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>{attachment.text}</Modal.Title>
				</Modal.Header>
				<ModalBody>

					{props?.data ? (
						''
					) : (
						<Upload
							isLoading={isLoading}
							setIsLoading={setIsLoading}
							className="col-sm-2"
							fileType="report_image"
							fileKey={props?.data?._id}
							onFinish={(file) => {
								const filesList = props?.file;
								filesList.push(file);
								handleChangeImage('file', filesList);
							}}></Upload>
					)}

					{props?.file.length > 0 ? (
						<div className="lf-load-more-attechment">
							<span className="ms-2 my-2 d-inline-block">
								{props?.file?.map((f) => {
									return (
										<>
											<img
												alt="livefield"
												src={f}
												onClick={() => handleImageView(f)}
												style={{ width: '40px', height: '40px' }}
											/>
											{props?.data ? (
												''
											) : (
												<i
													className="fas fa-times fa-xs lf-icon text-primary"
													onClick={handleDelete.bind(this, f)}></i>
											)}
										</>
									);
								})}
							</span>
						</div>
					) : null}
				</ModalBody>
			</Modal>
		</>
	);
}
export default OpenAttachement;
