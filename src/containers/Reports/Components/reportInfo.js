import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import React from 'react';
import {
	getMaterialDetailsById,
	getStoreRoomFullDetails,
} from '../../../store/actions/storeroom';
import {
	GET_LABOUR_AND_EQUIPMENT_DETAILS,
	GET_MATERIAL_DETAILS_BY_ID,
	GET_STORE_ROOM_FULL_DETAILS,
	GET_SURVEY_REQUEST_DETAILS_BY_ID,
	GET_PROJECT_DETAILS,
} from '../../../store/actions/actionType';
import { useDispatch, useSelector } from 'react-redux';
import {
	getlabourAndequipmentDetails,
	getSurveyRequestDetails,
} from '../../../store/actions/report';
import moment from 'moment';
import { getSiteLanguageData } from '../../../commons';

function ReportInfo(props) {
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);

	const {
		info,
		description,
		project_name,
		assigee,
		created_by,
		created_at,
		material_log,
		survey_report,
		Labour_Equipment,
	} = getSiteLanguageData('reports/toolbar');
	const { location, start_date, end_date } = getSiteLanguageData('commons');
	const { store_room } = getSiteLanguageData('components');
	

	const reportInfo = useSelector((state) => {
		if (props?.type === store_room.text) {
			return state?.storeroom?.[GET_STORE_ROOM_FULL_DETAILS]?.result || [];
		} else if (props?.type === material_log.text) {
			return state?.storeroom?.[GET_MATERIAL_DETAILS_BY_ID]?.result || [];
		} else if (props?.type === survey_report.text) {
			return state?.report?.[GET_SURVEY_REQUEST_DETAILS_BY_ID]?.result || [];
		} else if (props?.type === Labour_Equipment.text) {
			return state?.report?.[GET_LABOUR_AND_EQUIPMENT_DETAILS]?.result || [];
		}
	});
	const projectDetails = useSelector(
		({ project }) => project[GET_PROJECT_DETAILS]?.result || {},
	);
	useEffect(() => {
		if (reportInfo?.length <= 0) {
			if (props?.type === store_room.text) {
				dispatch(getStoreRoomFullDetails(props?.data));
			} else if (props?.type === material_log.text) {
				dispatch(getMaterialDetailsById(props?.data));
			} else if (props?.type === survey_report.text) {
				dispatch(getSurveyRequestDetails(props?.data));
			} else if (props?.type === Labour_Equipment.text) {
				dispatch(getlabourAndequipmentDetails(props?.data));
			}
		}
	}, [reportInfo?.length, dispatch]);
	
	return (
		<>
			<span type="submit" className="lf-common-btn" onClick={handleShow}>
				<i class="fa-solid fa-circle-info" aria-hidden="true"></i> {info?.text}
			</span>
			<Modal
				className="lf-modal"
				show={show}
				onHide={handleClose}
				animation={true}>
				<Modal.Header className="py-2 bg-light" closeButton>
					<Modal.Title>
						{`${props.type}`} {info?.text}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-sm-4">
							<label className="mb-0 fw-bold">{description?.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0">
								{props?.type === store_room.text
									? reportInfo?.description
									: props?.type === material_log.text ||
									  props?.type === survey_report.text ||
									  props?.type === Labour_Equipment.text
									? reportInfo[0]?.description
									: ''}
							</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0 fw-bold">{project_name?.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0">
								{props?.type === store_room.text
									? reportInfo?.project?.name
									: props?.type === material_log.text ||
									  props?.type === survey_report.text ||
									  props?.type === Labour_Equipment.text
									? reportInfo[0]?.project?.name
									: ''}
							</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0 fw-bold">{assigee?.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0 ">
								{props?.type === store_room.text
									? reportInfo?.assigee
											?.map((as) => {
												return ` ${as?.first_name} ${as?.last_name}`;
											})
											.join(',')
									: props?.type === material_log.text ||
									  props?.type === survey_report.text
									? reportInfo[0]?.assigee
											?.map((as) => {
												return ` ${as?.first_name} ${as?.last_name}`;
											})
											.join(',')
									: props?.type === Labour_Equipment.text
									? reportInfo[0]?.assigee?.first_name +
									  ' ' +
									  reportInfo[0]?.assigee?.last_name
									: ''}
							</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0 fw-bold">{location?.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0 text-break">
								{props?.type === store_room.text
									? reportInfo?.location
											?.map((l) => {
												return ` ${l?.name}`;
											})
											.join(',')
									: props?.type === material_log.text ||
									  props?.type === survey_report.text
									? reportInfo[0]?.location
											?.map((l) => {
												return ` ${l?.name}`;
											})
											.join(',')
									: props?.type === Labour_Equipment.text
									? reportInfo[0]?.location?.name
									: ''}
							</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0 fw-bold">{created_by?.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0 text-break">
								{props?.type === store_room.text
									? reportInfo?.createdBy?.first_name +
									  ' ' +
									  reportInfo?.createdBy?.last_name
									: props?.type === material_log.text ||
									  props?.type === survey_report.text ||
									  props?.type === Labour_Equipment.text
									? reportInfo[0]?.createdBy?.first_name +
									  ' ' +
									  reportInfo[0]?.createdBy?.last_name
									: ''}
							</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0 fw-bold">{created_at?.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0 text-break">
								{props?.type === store_room.text
									? moment(reportInfo?.createdAt).format(
											projectDetails && projectDetails.date_formate
												? projectDetails.date_formate
												: 'DD-MM-YYYY',
									  )
									: props?.type === material_log.text ||
									  props?.type === survey_report.text ||
									  props?.type === Labour_Equipment.text
									? moment(reportInfo[0]?.createdAt).format(
											projectDetails && projectDetails.date_formate
												? projectDetails.date_formate
												: 'DD-MM-YYYY',
									  )
									: ''}
							</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0 fw-bold">{start_date?.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0 text-break">
								{props?.type === store_room.text
									? moment(reportInfo?.start_date).format(
											projectDetails && projectDetails.date_formate
												? projectDetails.date_formate
												: 'DD-MM-YYYY',
									  )
									: props?.type === material_log.text ||
									  props?.type === survey_report.text ||
									  props?.type === Labour_Equipment.text
									? moment(reportInfo[0]?.start_date).format(
											projectDetails && projectDetails.date_formate
												? projectDetails.date_formate
												: 'DD-MM-YYYY',
									  )
									: ''}
							</label>
						</div>
						<div className="col-sm-4">
							<label className="mb-0 fw-bold">{end_date?.text}</label>
						</div>
						<div className="col-sm-8">
							<label className="mb-0 text-break">
								{props?.type === store_room.text
									? moment(reportInfo?.end_date).format(
											projectDetails && projectDetails.date_formate
												? projectDetails.date_formate
												: 'DD-MM-YYYY',
									  )
									: props?.type === material_log.text ||
									  props?.type === survey_report.text ||
									  props?.type === Labour_Equipment.text
									? moment(reportInfo[0]?.end_date).format(
											projectDetails && projectDetails.date_formate
												? projectDetails.date_formate
												: 'DD-MM-YYYY',
									  )
									: ''}
							</label>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
export default ReportInfo;
