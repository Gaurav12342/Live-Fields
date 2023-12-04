import { useEffect, useState } from 'react';
import { InputGroup, FormControl, Form, Button, Modal } from 'react-bootstrap';
import Loading from '../components/loadig';
import getUserId, { getSiteLanguageData } from '../commons';
import {
	errorNotification,
	successNotification,
} from '../commons/notification';
const userId = getUserId();

function ShareFile({
	manageTaskFilter,
	filterData,
	clearTaskFilter,
	...props
}) {
	const {
		share_file,
		share_file_heading,
		share_file_description,
		shareable_link,
		copy_paste_link,
		download_file,
		copy,
		link_here
	} = getSiteLanguageData('shareFile');
	return (
		<>
			<Modal
				show={props.open}
				onHide={props.handleClose}
				className="lf-right-sidebar bg"
				animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<h4>{share_file?.text}</h4>
				</Modal.Header>
				<Modal.Body className="bg">

					{
						props?.shareLink ? (
							<div className="text-center">
								<div className="my-4">
									<img alt="Process Done" src="/images/correct.svg" width="100px" />
								</div>
								<span className="fw-bold">
									<h4>{share_file_heading?.text}</h4>
								</span>
								<span className="text-secondary my-2">
									{share_file_description?.text}
								</span>

								<div className="text-start white-box-label my-4">
									{shareable_link?.text}
								</div>
								<div className="text-start text-secondary my-2">
									{copy_paste_link?.text}
								</div>

								<div className="form-group">
									<InputGroup className="mb-3">
										<FormControl
											type="text"
											name="Share Link"
											placeholder={link_here?.text}
											autoComplete="off"
											value={props?.shareLink}
										/>
										<div className="input-group-append">
											<span
												sharelink={props?.shareLink}
												tooltip={copy.tooltip}
												flow={copy.tooltip_flow}
												className="theme-btnbg theme-secondary lf-link-cursor input-group-text copy-button"
												onClick={() =>
													navigator.clipboard
														.writeText(props?.shareLink)
														.then(() => {
															/* successNotification('Copied to clipboard!'); */
														})
												}>
												<i className="far fa-copy"></i>
											</span>
										</div>
									</InputGroup>
								</div>
								<div className="form-group mt-4">
									<div>
										<a
											href={props?.shareLink}
											download
											target="_blank"
											className="lf-main-button btn-block ps-md-2 px-0 px-md-2 pointer"
											style={{ color: '#fff' }}
											//className="lf-main-button mr-3 btn-block  lf-link-cursor "
										>
											{' '}
											<i className="fas fa-download me-2"></i>
											{download_file?.text}
										</a>
									</div>
								</div>
							</div>
						) : <Loading />
					}

					
				</Modal.Body>
				{/* </div> */}
			</Modal>
		</>
	);
}

export default ShareFile;
