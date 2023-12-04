import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import getUserId, { getSiteLanguageData } from '../../../commons';
import ImageCropper from './ImageCropper';
import { UploadProfileImage } from '../../../store/actions/Profile';

function CropProfile(props) {
	const userId = getUserId();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setImageToCrop(undefined);
		setCroppedImage(undefined);
	};
	const handleShow = () => setShow(true);
	const [imageToCrop, setImageToCrop] = useState(undefined);
	const [croppedImage, setCroppedImage] = useState(undefined);
	const [pImage, setPImage] = useState();

	const onUploadFile = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				const image = reader.result;
				setImageToCrop(image);
			});
			reader.readAsDataURL(event.target.files[0]);
		}
	};
	const saveChanges = (e) => {
		dispatch(
			UploadProfileImage({
				user_id: userId,
				file: pImage,
			}),
		);
		handleClose();
		setImageToCrop(undefined);
	};
	const { crop_profile, upload, new_profile } = getSiteLanguageData(
		'profile/components/cropprofile',
	);
	return (
		<>
			<span
				className="theme-btnbg theme-secondary rounded lf-link-cursor ms-5"
				onClick={() => handleShow()}>
				<i className="fas fa-edit lf-sheet-icon m-2"></i>
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				size={imageToCrop ? `lg` : `md`}
				animation={true}>
				<Modal.Header className="bg-light py-2" closeButton>
					<Modal.Title className="mt-0 mb-0 fs-4">
						{crop_profile?.text}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<input type="file" accept="image/*" onChange={onUploadFile} />
						<div className={imageToCrop ? `col-10 mt-1` : `mt-1`}>
							<ImageCropper
								imageToCrop={imageToCrop}
								setPImage={setPImage}
								onImageCropped={(croppedImage) => setCroppedImage(croppedImage)}
							/>
						</div>
						<div className={imageToCrop ? `col-2 text-center` : `col-12`}>
							<h5>{new_profile.text}</h5>
							<img
								alt="Cropped Img"
								className="lf-h-100 lf-w-100 lf-br-50"
								src={croppedImage || props?.src}
							/>
						</div>
						<div className="text-center">
							{imageToCrop ? (
								<span className="btn theme-btn mt-2" onClick={saveChanges}>
									{upload?.text}
								</span>
							) : (
								''
							)}
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default CropProfile;
