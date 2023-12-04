import { useState } from 'react';
import { Modal, Form, Button, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getUserId, { getSiteLanguageData } from '../../../commons';
import {
	downloadMateriaLog,
	downloadStoreRoomReport,
} from '../../../store/actions/storeroom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { downloadLabourAndEquipmentLog } from '../../../store/actions/projects';

import {
	downloadSurveyReport,
	getSurveyReportListBySurveyId,
} from '../../../store/actions/report';
import { GET_SURVEY_REPORT_LIST_BY_SURVEY_ID } from '../../../store/actions/actionType';
import { errorNotification } from '../../../commons/notification';
import GenerateSurveyReport from './GenerateSurveyReport';

function DownloadReport(props) {
	const userId = getUserId();
	const { project_id } = useParams();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const [dateRange, setDateRange] = useState([null, null]);
	const [date, setDate] = useState(null);
	const [showShareModel, setShowShareModel] = useState(false);
	const [shareLink, setShareLink] = useState(null);
	const [startDate, endDate] = dateRange;

	const report = useSelector((state) => {
		return state?.report?.[GET_SURVEY_REPORT_LIST_BY_SURVEY_ID]?.result || [];
	});

	const dawnloadRepoer = (e) => {
		e.preventDefault();
		if (props?.type === 'material log') {
			setShareLink(null)
			hendleShowShereModel()
			dispatch(
				downloadMateriaLog({
					project_id: project_id,
					user_id: userId,
					from_date: moment(startDate).format('YYYY-MM-DD'),
					to_date: moment(endDate).format('YYYY-MM-DD'),
					material_log_id: props?.material_log_id,
				},(repData)=>{
						
					if(repData?.data?.result?.file){
						setShareLink(repData?.data?.result?.file)
					}else{
						setShareLink(null)
					}
				})
			);
			handleClose();
		} else if (props?.type === 'store room log') {
			setShareLink(null)
			hendleShowShereModel()
			const post = {
				store_room_id: props?.store_room_id,
				project_id: project_id,
				user_id: userId,
				from_date: moment(startDate).format('YYYY-MM-DD'),
				to_date: moment(endDate).format('YYYY-MM-DD'),
			};
			dispatch(downloadStoreRoomReport(post,(repData)=>{
						
				if(repData?.data?.result?.file){
					setShareLink(repData?.data?.result?.file)
				}else{
					setShareLink(null)
				}
			}));
			handleClose();
		} else if (props?.type === 'laborur and equipment log') {
			setShareLink(null);
			hendleShowShereModel();
			dispatch(
				downloadLabourAndEquipmentLog({
					project_id: project_id,
					user_id: userId,
					report_date: date,
					from_date: moment(startDate).format('YYYY-MM-DD'),
					to_date: moment(endDate).format('YYYY-MM-DD'),
					labour_equipment_log_id: props?.labour_equipment_log_id,
				},(repData)=>{
						
					if(repData?.data?.result?.file){
						setShareLink(repData?.data?.result?.file)
					}else{
						setShareLink(null)
					}
				}),
			);
			handleClose();
		} else if (props?.type === 'survey report') {
			if (report?.is_locked === true) {
				setShareLink(null);
				hendleShowShereModel();
				dispatch(
					downloadSurveyReport({
						project_id: project_id,
						user_id: userId,
						survey_report_id: report?._id,
					},(repData)=>{
						
						if(repData?.data?.result?.file){
							setShareLink(repData?.data?.result?.file)
						}else{
							setShareLink(null)
						}
					}),
				);
				handleClose();
			} else {
				errorNotification('please lock Report');
			}
		}
	};

	const hendleShowShereModel = () => {
		setShowShareModel(!showShareModel);
	};

	const handleChange = (value) => {
		dispatch(getSurveyReportListBySurveyId(props?.survey_id, value?.value));
	};
	const final = [];
	props?.final_date?.forEach((u) => {
		if(new Date() >= new Date(u)){
			final.push({
				label: moment(u).format('YYYY-MM-DD'),
				value: moment(u).format('YYYY-MM-DD'),
			});
		}
		
	});
	const { download, submit } = getSiteLanguageData('reports/toolbar');
	const { select_date } = getSiteLanguageData(
		'reports/components/downlodreport',
	);
	return (
		<>
			<span
				tooltip={download.tooltip}
				flow={download.tooltip_flow}
				className="p-1 theme-btnbg theme-secondary rounded lf-link-cursor me-1"
				onClick={handleShow}>
				<i className="fas fa-download"></i>
			</span>
			
			<Modal
				className="lf-modal"
				size={'md'}
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title className="text-capitalize">
						{download?.text} {props?.type}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={dawnloadRepoer}>
						<div className="row p-3 ">
							<Form.Label className="mb-0">{select_date?.text}</Form.Label>
							{props?.type === 'laborur & equipment log' ? (
								<DatePicker
									customInput={
										<FormControl
											className="lf-formcontrol-height"
											autoComplete="off"
										/>
									}
									selected={date ? moment(date).toDate() : null}
									dateFormat="dd-MM-yyyy"
									placeholderText="Select Date"
									onChange={(e) => setDate(moment(e).format('YYYY-MM-DD'))}
									required
								/>
							) : props?.type === 'survey report' ? (
								<>
								{/* <CustomSelect
									placeholder="Choose Date..."
									onChange={(e) => handleChange(e)}
									options={final}
									// value={projectUsers.filter(c => info?.assigee_id?.includes(c.value))}
								/> */}
								<DatePicker
									customInput={
										<FormControl
											className="lf-formcontrol-height"
											autoComplete="off"
										/>
									}
									selected={date ? moment(date).toDate() : null}
									dateFormat="dd-MM-yyyy"
									placeholderText="Select Date"
									onChange={(e) => {
											setDate(moment(e).format('YYYY-MM-DD'));
											handleChange({value:moment(e).format('YYYY-MM-DD')})
										}
									}
									includeDates={final?.map((v=>new Date(v.value)))}
									required
								/>
								</>
							) : (
								<DatePicker
									customInput={
										<FormControl
											className="lf-formcontrol-height"
											autoComplete="off"
										/>
									}
									placeholderText="From Date - To Date"
									selectsRange={true}
									startDate={startDate}
									endDate={endDate}
									onChange={(update) => {
										setDateRange(update);
									}}
									isClearable={true}
								/>
							)}
							<div className="col-12 mt-3">
								<Button
									type="submit"
									className="btn btn-primary theme-btn btn-block my-1 show-verify float-end">
									<i className='fas fa-download pe-2'></i>
									{download?.text}
								</Button>
							</div>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
			<GenerateSurveyReport open={showShareModel} project_id={project_id} shareLink={shareLink} handleClose={hendleShowShereModel} />
		</>
	);
}
export default DownloadReport;
