import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosGet, axiosPost } from '../axiosHelper';
import {
	CREATE_LABOUR_AND_EQUIPMENT_LOG,
	CREATE_SURVEY_REPORT,
	DELETE_LABOUR_AND_EQUIPMENT_LOG,
	DELETE_SURVEY_REPORT,
	GET_LABOUR_AND_EQUIPMENT_DETAILS,
	GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID,
	GET_QUESTIONS_LIST_BY_REQUEST_ID,
	GET_SURVEY_REPORT,
	GET_SURVEY_REPORT_BY_ID,
	GET_SURVEY_REPORT_BY_SURVEY_ID,
	GET_SURVEY_REPORT_LIST_BY_SURVEY_ID,
	GET_SURVEY_REQUEST_DETAILS_BY_ID,
	SIGN_SURVEY_REPORT,
	UNLOCK_REPORT,
	UPDATE_LABOUR_AND_EQUIPMENT_LOG,
	UPDATE_SURVEY_REPORT,
} from './actionType';
import {
	getAllEquipmentLogByIdAndDate,
	getLabourLogByLabourIdByDate,
	getReportPermissionList,
} from './projects';
import {
	getMaterialLogListById,
	getOrderDetailsStoreRoomId,
	getStoreRoomListByStoreRoomId,
} from './storeroom';

export function getSurveyReport(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/survey/report/request/' + id },
			(response) => {
				dispatch({
					type: GET_SURVEY_REPORT,
					[GET_SURVEY_REPORT]: response.data,
				});
			},
		);
	};
}

export function getSurveyRequestDetails(id, cb) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/survey/report/request/details/' + id },
			(response) => {
				if(typeof cb == "function") {
					let emptyObj = {};
					Object.assign(emptyObj, response.data);
					cb(emptyObj)
				};
				dispatch({
					type: GET_SURVEY_REQUEST_DETAILS_BY_ID,
					[GET_SURVEY_REQUEST_DETAILS_BY_ID]: response.data,
				});
			},
		);
	};
}

export function getlabourAndequipmentDetails(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/labourAndequipment/details/' + id },
			(response) => {
				dispatch({
					type: GET_LABOUR_AND_EQUIPMENT_DETAILS,
					[GET_LABOUR_AND_EQUIPMENT_DETAILS]: response.data,
				});
			},
		);
	};
}
export function deleteSurveyReport(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/survey/report/request/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getSurveyReport(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function"){
					cb(response)
				}
				dispatch({
					type: DELETE_SURVEY_REPORT,
					[DELETE_SURVEY_REPORT]: response.data,
				});
			},
		);
	};
}

export function getSurveyReportListBySurveyId(id, date) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/survey/report/list/' + id + '/' + date },
			(response) => {
				dispatch({
					type: GET_SURVEY_REPORT_LIST_BY_SURVEY_ID,
					[GET_SURVEY_REPORT_LIST_BY_SURVEY_ID]: response.data,
				});
			},
		);
	};
}

export function getSurveyReportBySurveyId(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/survey/question/list/' + id },
			(response) => {
				dispatch({
					type: GET_SURVEY_REPORT_BY_SURVEY_ID,
					[GET_SURVEY_REPORT_BY_SURVEY_ID]: response.data,
				});
			},
		);
	};
}

export function signSurveyReport(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/survey/report/signed', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// dispatch(getSurveyReport(post?.project_id))
					dispatch(
						getSurveyReportListBySurveyId(
							post?.survey_report_request_id,
							post?.date,
						),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: SIGN_SURVEY_REPORT,
					[SIGN_SURVEY_REPORT]: response.data,
				});
			},
		);
	};
}

export function saveQuestionSurveyReport(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/survey/report/save_question', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// dispatch(getSurveyReport(post?.project_id))
					dispatch(
						getSurveyReportListBySurveyId(
							post?.survey_report_request_id,
							post?.date,
						),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: SIGN_SURVEY_REPORT,
					[SIGN_SURVEY_REPORT]: response.data,
				});
			},
		);
	};
}

export function createSurveyReport(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/survey/report/request/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getSurveyReport(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_SURVEY_REPORT,
					[CREATE_SURVEY_REPORT]: response.data,
				});
			},
		);
	};
}

export function updateSurveyReport(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/survey/report/request/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getSurveyReport(post?.project_id));
					dispatch(getSurveyRequestDetails(post?.survey_report_request_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_SURVEY_REPORT,
					[UPDATE_SURVEY_REPORT]: response.data,
				});
			},
		);
	};
}

export function getQuestionsListByRequestId(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/survey/report/question/list/' + id },
			(response) => {
				dispatch({
					type: GET_QUESTIONS_LIST_BY_REQUEST_ID,
					[GET_QUESTIONS_LIST_BY_REQUEST_ID]: response.data,
				});
			},
		);
	};
}

export function getSurveyReportById(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/survey/report/' + id }, (response) => {
			dispatch({
				type: GET_SURVEY_REPORT_BY_ID,
				[GET_SURVEY_REPORT_BY_ID]: response.data,
			});
		});
	};
}

export function getlabourAndequipmentByProjectId(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/labourAndequipment/log/' + id },
			(response) => {
				dispatch({
					type: GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID,
					[GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID]: response.data,
				});
			},
		);
	};
}

export function createLabourAndEquipmentLog(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labourAndequipment/log/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getlabourAndequipmentByProjectId(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_LABOUR_AND_EQUIPMENT_LOG,
					[CREATE_LABOUR_AND_EQUIPMENT_LOG]: response.data,
				});
			},
		);
	};
}

export function updateLabourAndEquipmentLog(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labourAndequipment/log/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getlabourAndequipmentByProjectId(post?.project_id));
					dispatch(getlabourAndequipmentDetails(post?.labour_equipment_log_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_LABOUR_AND_EQUIPMENT_LOG,
					[UPDATE_LABOUR_AND_EQUIPMENT_LOG]: response.data,
				});
			},
		);
	};
}
export function deleteLabourAndEquipmentLog(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labourAndequipment/log/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getlabourAndequipmentByProjectId(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response);
				dispatch({
					type: DELETE_LABOUR_AND_EQUIPMENT_LOG,
					[DELETE_LABOUR_AND_EQUIPMENT_LOG]: response.data,
				});
			},
		);
	};
}

export function unlockReport(post, permission, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/report/unlock', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					if (permission === true) {
						dispatch(getReportPermissionList(post?.project_id, post?.user_id));
					} else if (post?.report_type === 'SurveyReport') {
						dispatch(
							getSurveyReportListBySurveyId(
								post?.survey_report_request_id,
								post?.report_date,
							),
						);
					} else if (post?.report_type === 'StoreRoomPoOrder') {
						dispatch(getOrderDetailsStoreRoomId(post?.store_room_id));
					} else if (post?.report_type === 'LabourEquipmentLog') {
						dispatch(
							getLabourLogByLabourIdByDate(
								post?.labour_equipment_log_id,
								post?.report_date,
							),
						);
						dispatch(
							getAllEquipmentLogByIdAndDate(
								post?.labour_equipment_log_id,
								post?.report_date,
							),
						);
					} else if (post?.report_type === 'MaterialLog') {
						dispatch(
							getMaterialLogListById(post?.material_id, post?.report_date),
						);
					} else if (post?.report_type === 'StoreRoomLog') {
						dispatch(
							getStoreRoomListByStoreRoomId(
								post?.store_room_id,
								post?.report_date,
							),
						);
					}

					if(typeof cb == "function") cb(response.data)
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UNLOCK_REPORT,
					[UNLOCK_REPORT]: response.data,
				});
			},
		);
	};
}
export function downloadSurveyReport(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/survey/report', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// window.location.href = response?.data?.result?.file;
					if(typeof cb == "function"){
						cb(response)
					}else{
						window.open(response?.data?.result?.file, '_blank');
					}
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: response.data,
				});
			},
		);
	};
}

export function downloadPurcheseReport(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: 'project/store_room/purchese_download/report', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// window.location.href = response?.data?.result?.file;
					if(typeof cb == "function"){
						cb(response?.data?.result?.file)
					}else{
						window.open(response?.data?.result?.file, '_blank');
					}
				} else {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}
