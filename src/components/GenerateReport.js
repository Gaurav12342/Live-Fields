import { useEffect, useState } from 'react';
import { InputGroup, FormControl, Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../commons';
import Loading from '../components/loadig';
import { tasksSummeryReport, tasksDetailsReport } from '../store/actions/Task';
import {issueSummeryReport} from "../store/actions/Issues";
import {
	errorNotification,
	successNotification,
} from '../commons/notification';
const userId = getUserId();

function GenerateReport({
	manageTaskFilter,
	filterData,
	clearTaskFilter,
	...props
}) {
	const dispatch = useDispatch();
	const [shareLink, setShareLink] = useState(null);
	const [loading, setLoading] = useState(false);
	const [reportType, setReportType] = useState('summary');

	const handleReportType = (e) => setReportType(e.target.value);
	const handleReportResponse = (data) => {
		if (data && data.result && data.result.file) {
			setShareLink(data.result.file);
		} else {
			setShareLink('');
		}
		setLoading(false);
	};
	const generateReport = () => {
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
	};

	const handleClose = () => {
		setLoading(false);
		setShareLink('');
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
		link_here,
		shared_file_heading,
		report_type,
		detailed_type,
		summary_report,
		generate_report
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
					{!loading && !shareLink && (
						<div className="row">
							<div className={`col-12`}>
								<div className="my-4 text-center">
									<img
										alt="Process Done"
										src="/images/question.svg"
										width="100px"
									/>
								</div>
								<div className="fw-bold text-center">
									<h4>{shared_file_heading?.text}</h4>
								</div>
								<div className="text-start white-box-label mb-0 mt-4 mb-2">
									{report_type.text}
								</div>
								{/* <div className="text-start text-secondary my-2">
										{copy_paste_link?.text}
									</div> */}

								<div className="form-check">
									<input
										className="form-check-input"
										value="detailed"
										id={`flexRadioDefault1`}
										type="radio"
										name="report_type"
										checked={reportType === 'detailed'}
										onChange={handleReportType}
									/>
									<label className="form-check-label" for="flexRadioDefault1">
										{detailed_type.text}
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										value={'summary'}
										id={`flexRadioDefault2`}
										type="radio"
										name="report_type"
										checked={reportType === 'summary'}
										onChange={handleReportType}
									/>
									<label className="form-check-label" for="flexRadioDefault2">
										{summary_report.text}
									</label>
								</div>

								<div className="form-group text-center mt-4">
									<span
										onClick={generateReport}
										download
										target="_blank"
										className="lf-main-button px-0 mx-0 pointer">
										{' '}
										<i className="fas fa-check-circle me-2"></i>
										{generate_report.text}
									</span>
								</div>
							</div>
						</div>
					)}

					{!loading && shareLink && (
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
											placeholder={link_here?.text}
											autoComplete="off"
											value={shareLink}
										/>
										<div className="input-group-append">
											<span
												sharelink={shareLink}
												tooltip={copy.tooltip}
												flow={copy.tooltip_flow}
												className="theme-btnbg theme-secondary lf-link-cursor input-group-text copy-button"
												onClick={() =>
													navigator.clipboard.writeText(shareLink).then(() => {
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
										href={shareLink}
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
					)}

					{loading && (
						<>
							<Loading />
						</>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
}

export default GenerateReport;
