import { useEffect, useState } from 'react';
import { InputGroup, FormControl, Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import Loading from '../../../components/loadig';

const userId = getUserId();

function GenerateSurveyReport({
	manageTaskFilter,
	filterData,
	clearTaskFilter,
	...props
}) {
	const dispatch = useDispatch();
	
	

	
	
	/* const generateReport = () => {
		const post = {
			tasks: props.multiSelect,
			task_id: props.multiSelect,
			project_id: props.project_id,
			user_id: userId,
		};
		if (reportType === 'summary') {
			setLoading(true);
			dispatch(tasksSummeryReport(post, handleReportResponse));
		} else {
			setLoading(true);
			dispatch(tasksDetailsReport(post, handleReportResponse));
		}
	}; */

	const handleClose = () => {
		props.handleClose();
	};

	const {
		share_file,
		share_file_heading,
		share_file_description,
		shareable_link,
		copy_paste_link,
		download_file,
		copy,
	} = getSiteLanguageData('shareFile');
	
	return (
		<>
			<Modal
				show={props.open}
				onHide={handleClose}
				className="lf-right-sidebar bg"
				animation={false}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<h4>{share_file?.text}</h4>
				</Modal.Header>
				<Modal.Body className="">
					
					{props.shareLink ? (
						<div className="row">
							<div className={`col-12 text-center`}>
								<div className="my-4 text-center">
									<img
										alt="Process Done"
										src="/images/correct.svg"
										width="100px"
									/>
								</div>
								<div className="fw-bold text-center">
									<h4>{share_file_heading?.text}</h4>
								</div>
								<div className="text-secondary my-2 text-center">
									{share_file_description?.text}
								</div>

								<div className="text-start white-box-label mb-0 mt-5">
									{shareable_link?.text}
								</div>
								<div className="text-start text-secondary my-2">
									{copy_paste_link?.text}
								</div>

								<div className="form-group">
									<InputGroup className="mb-3">
										<FormControl
											type="text"
											readOnly
											name="Share Link"
											placeholder="Link Here"
											autoComplete="off"
											value={props.shareLink}
										/>
										<div className="input-group-append">
											<span
												sharelink={props.shareLink}
												tooltip={copy.tooltip}
												flow={copy.tooltip_flow}
												className="theme-btnbg theme-secondary lf-link-cursor input-group-text copy-button"
												onClick={() =>
													navigator.clipboard.writeText(props.shareLink).then(() => {
														/* successNotification('Copied to clipboard!'); */
													})
												}>
												<i className="far fa-copy"></i>
											</span>
										</div>
									</InputGroup>
								</div>
								<div className="form-group mt-4">
									<a
										href={props.shareLink}
										download
										target="_blank"
										className="lf-main-button  ps-md-2 px-0 px-md-2 pointer"
										style={{ color: '#fff' }}>
										{' '}
										<i className="fas fa-download me-2"></i>
										{download_file?.text}
									</a>
								</div>
							</div>
						</div>
					) : (<Loading />)}					
				</Modal.Body>
			</Modal>
		</>
	);
}

export default GenerateSurveyReport;
