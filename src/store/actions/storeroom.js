import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosGet, axiosPost } from '../axiosHelper';
import {
	LOADING_DATA,
	GET_ALL_MATERIAL_LIST,
	DELETE_MATERIAL,
	ADD_MATERIAL,
	UPDATE_MATERIAL,
	CREATE_STORE_ROOM,
	GET_STORE_ROOM,
	DELETE_STORE_ROOM,
	UPDATE_STORE_ROOM,
	GET_STORE_ROOM_FULL_DETAILS,
	GET_ORDER_DETAILS_BY_STORE_ROOM_ID,
	CREATE_UNIT,
	CREATE_STORE_ROOM_PO,
	GET_STORE_ROOM_LOG_ID_AND_DATE,
	GET_ALL_UNIT,
	GET_STORE_ROOM_REQUEST_LIST,
	ISSUE_MATERIAL_REQUEST,
	ADJUSTMENT_STORE_ROOM,
	GET_STORE_ROOM_ADJUSTMENT_REQUEST_LIST,
	CREATE_MATERIAL_INFO,
	GET_MATERIAL_LOG_LIST,
	GET_SINGLE_PO_DETAILS,
	UPDATE_STORE_ROOM_PO,
	GET_MATERIAL_LOG_BY_DATE,
	CONSUMPTION_MATERIAL,
	ADJUSTMENT_MATERIAL,
	REQUEST_MATERIAL,
	DELIVERD_STORE_ROOM_PO_ORDER,
	GET_MATERIAL_DETAILS_BY_ID,
	UPDATE_MATERIAL_INFO,
	SIGN_MATERIAL_LOG_REPORT,
	SIGN_STORE_ROOM_LOG,
	DELETE_MATERIAL_LOG,
	UPDATE_UNIT,
	GET_ALL_UNIT_BY_PROJECT_ID,
	DELETE_UNIT,
} from './actionType';

export function getAllMaterialList(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/material/' + id }, (response) => {
			dispatch({
				type: GET_ALL_MATERIAL_LIST,
				[GET_ALL_MATERIAL_LIST]: response.data,
			});
		});
	};
}
export function getMaterialDetailsById(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/material_log/' + id }, (response) => {
			dispatch({
				type: GET_MATERIAL_DETAILS_BY_ID,
				[GET_MATERIAL_DETAILS_BY_ID]: response.data,
			});
		});
	};
}


export function updateMaterialRequest(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/update_request', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					
					// dispatch(getMaterialDetailsById(post?.material_log_id));
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response.data)
			},
		);
	};
}

export function deleteMateriaRequest(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/delete_request', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					
					// dispatch(getMaterialDetailsById(post?.material_log_id));
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response.data)
			},
		);
	};
}

export function createMaterial(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMaterialList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ADD_MATERIAL,
					[ADD_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function downloadMateriaLog(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/log/report', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// window.location.href = response?.data?.result?.file;
					if(typeof cb == "function"){
						cb(response);
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
export function updateMaterial(post, store_room_id, date) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMaterialList(post?.project_id));
					dispatch(getStoreRoomListByStoreRoomId(store_room_id, date));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_MATERIAL,
					[UPDATE_MATERIAL]: response.data,
				});
			},
		);
	};
}
export function deleteMaterial(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMaterialList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_MATERIAL,
					[DELETE_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function getStoreRoomFullDetails(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/store_room/full_details/' + id },
			(response) => {
				dispatch({
					type: GET_STORE_ROOM_FULL_DETAILS,
					[GET_STORE_ROOM_FULL_DETAILS]: response.data,
				});
			},
		);
	};
}

export function getStoreRoom(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/store_room/' + id }, (response) => {
			dispatch({
				type: GET_STORE_ROOM,
				[GET_STORE_ROOM]: response.data,
			});
		});
	};
}

export function createStoreRoom(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getStoreRoom(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_STORE_ROOM,
					[CREATE_STORE_ROOM]: response.data,
				});
			},
		);
	};
}

export function updateStoreRoom(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getStoreRoom(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_STORE_ROOM,
					[UPDATE_STORE_ROOM]: response.data,
				});
			},
		);
	};
}

export function deleteStoreRoom(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getStoreRoom(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response);
				dispatch({
					type: DELETE_STORE_ROOM,
					[DELETE_STORE_ROOM]: response.data,
				});
			},
		);
	};
}
export function getOrderDetailsStoreRoomId(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/store_room/orderlist/' + id },
			(response) => {
				dispatch({
					type: GET_ORDER_DETAILS_BY_STORE_ROOM_ID,
					[GET_ORDER_DETAILS_BY_STORE_ROOM_ID]: response.data,
				});
			},
		);
	};
}

export function getAllUnit() {
	return (dispatch) => {
		return axiosGet({ url: '/project/material/unit' }, (response) => {
			dispatch({
				type: GET_ALL_UNIT,
				[GET_ALL_UNIT]: response.data,
			});
		});
	};
}
export function getAllUnitByProjectId(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/material/unit/' + id }, (response) => {
			dispatch({
				type: GET_ALL_UNIT_BY_PROJECT_ID,
				[GET_ALL_UNIT_BY_PROJECT_ID]: response.data,
			});
		});
	};
}
export function createUnit(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/unit/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllUnitByProjectId(post?.project_id));
					if(typeof cb == "function") cb(response.data);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_UNIT,
					[CREATE_UNIT]: response.data,
				});
			},
		);
	};
}

export function updateUnit(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/unit/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllUnitByProjectId(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_UNIT,
					[UPDATE_UNIT]: response.data,
				});
			},
		);
	};
}
export function deleteUnit(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/unit/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllUnitByProjectId(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_UNIT,
					[DELETE_UNIT]: response.data,
				});
			},
		);
	};
}
export function createStoreRoomPO(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/order/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getOrderDetailsStoreRoomId(post?.store_room_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_STORE_ROOM_PO,
					[CREATE_STORE_ROOM_PO]: response.data,
				});
				if(typeof cb == "function") cb(response.data)
			},
		);
	};
}

export function deleteStoreRoomPO(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/order/delete', reqBody: post },
			(response) => {
				
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getOrderDetailsStoreRoomId(post?.store_room_id));
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response?.data)
			},
		);
	};
}

export function updateStoreRoomPO(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/order/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getOrderDetailsStoreRoomId(post?.store_room_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_STORE_ROOM_PO,
					[UPDATE_STORE_ROOM_PO]: response.data,
				});
			},
		);
	};
}

export function deliverdStoreRoomPoOrder(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/order/submit', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getOrderDetailsStoreRoomId(post?.store_room_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELIVERD_STORE_ROOM_PO_ORDER,
					[DELIVERD_STORE_ROOM_PO_ORDER]: response.data,
				});

				if(typeof cb == "function") cb(response.data)
			},
		);
	};
}

export function getStoreRoomListByStoreRoomId(id, date) {
	return (dispatch) => {
		/* dispatch({
			type:LOADING_DATA,
			[LOADING_DATA]:true
		}) */
		return axiosGet(
			{ url: '/project/store_room/log/' + id + '/' + date },
			(response) => {
				dispatch({
					type:LOADING_DATA,
					[LOADING_DATA]:false
				});
				dispatch({
					type: GET_STORE_ROOM_LOG_ID_AND_DATE,
					[GET_STORE_ROOM_LOG_ID_AND_DATE]: response.data,
				});
			},
		);
	};
}

export function getStoreRoomRequestList(id, date) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/store_room/requestlist/' + id + '/' + date },
			(response) => {
				dispatch({
					type: GET_STORE_ROOM_REQUEST_LIST,
					[GET_STORE_ROOM_REQUEST_LIST]: response.data,
				});
			},
		);
	};
}

export function issueMaterialRequest(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/request/issue', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					/* dispatch(
						getStoreRoomListByStoreRoomId(
							post?.store_room_id,
							post?.adjustment_date,
						),
					); */
				} else {
					errorNotification(response.data?.message);
				}
				/* dispatch({
					type: ISSUE_MATERIAL_REQUEST,
					[ISSUE_MATERIAL_REQUEST]: response.data,
				}); */
			},
		);
	};
}

export function adjustmentStoreRoom(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/adjustment', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getStoreRoomListByStoreRoomId(
							post?.store_room_id,
							post?.adjustment_date,
						),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ADJUSTMENT_STORE_ROOM,
					[ADJUSTMENT_STORE_ROOM]: response.data,
				});
			},
		);
	};
}
export function getStoreRoomAdjustmemtRequestList(id, date) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/store_room_adjustment/list/' + id + '/' + date },
			(response) => {
				dispatch({
					type: GET_STORE_ROOM_ADJUSTMENT_REQUEST_LIST,
					[GET_STORE_ROOM_ADJUSTMENT_REQUEST_LIST]: response.data,
				});
			},
		);
	};
}
export function consumptionMaterial(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/consumption/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getMaterialLogListById(post?.material_log_id, post?.material_date),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CONSUMPTION_MATERIAL,
					[CONSUMPTION_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function requestMaterial(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/request/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getMaterialLogListById(post?.material_log_id, post?.date_of_order),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: REQUEST_MATERIAL,
					[REQUEST_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function adjustmentMaterial(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/log/adjustment', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getMaterialLogListById(post?.material_log_id, post?.material_date),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ADJUSTMENT_MATERIAL,
					[ADJUSTMENT_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function adjustmentUpdateMaterial(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/log/adjustment_update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getMaterialLogListById(post?.material_log_id, post?.adjustment_date),
					);
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response.data);
				
				dispatch({
					type: ADJUSTMENT_MATERIAL,
					[ADJUSTMENT_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function adjustmentDeleteMaterial(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/log/adjustment_delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getMaterialLogListById(post?.material_log_id, post?.adjustment_date),
					);
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response.data);
				
				dispatch({
					type: ADJUSTMENT_MATERIAL,
					[ADJUSTMENT_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function consumptionUpdateMaterial(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/consumption/consumption_update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getMaterialLogListById(post?.material_log_id, post?.consumption_date),
					);
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response.data);
				
				dispatch({
					type: ADJUSTMENT_MATERIAL,
					[ADJUSTMENT_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function consumptionDeleteMaterial(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/consumption/consumption_delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getMaterialLogListById(post?.material_log_id, post?.adjustment_date),
					);
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response.data);
				
				dispatch({
					type: ADJUSTMENT_MATERIAL,
					[ADJUSTMENT_MATERIAL]: response.data,
				});
			},
		);
	};
}

export function createMaterialInfo(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/log/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getMaterialsLogList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_MATERIAL_INFO,
					[CREATE_MATERIAL_INFO]: response.data,
				});
			},
		);
	};
}

export function updateMaterialInfo(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/log/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getMaterialsLogList(post?.project_id));
					dispatch(getMaterialDetailsById(post?.material_log_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_MATERIAL_INFO,
					[UPDATE_MATERIAL_INFO]: response.data,
				});
			},
		);
	};
}

export function deleteMaterialsLog(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/log/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getMaterialsLogList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response);
				dispatch({
					type: DELETE_MATERIAL_LOG,
					[DELETE_MATERIAL_LOG]: response.data,
				});
			},
		);
	};
}

export function getMaterialsLogList(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/material/log/' + id }, (response) => {
			dispatch({
				type: GET_MATERIAL_LOG_LIST,
				[GET_MATERIAL_LOG_LIST]: response.data,
			});
		});
	};
}

export function getSinglePoDDetails(id, cb) {
	return (dispatch) => {
		return axiosGet({ url: '/project/store_room/order/' + id }, (response) => {
			dispatch({
				type: GET_SINGLE_PO_DETAILS,
				[GET_SINGLE_PO_DETAILS]: response.data,
			});

			if(typeof cb == 'function' && response.data.result) cb(response.data.result)
		});
	};
}
export function getMaterialLogListById(id, date) {
	console.log(date, "date")
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/material_log/' + id + '/' + date },
			(response) => {
				dispatch({
					type: GET_MATERIAL_LOG_BY_DATE,
					[GET_MATERIAL_LOG_BY_DATE]: response.data,
				});
			},
		);
	};
}
export function signMaterialLogReport(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/material/log/report/sign', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getMaterialLogListById(post?.material_log_id, post?.report_date),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: SIGN_MATERIAL_LOG_REPORT,
					[SIGN_MATERIAL_LOG_REPORT]: response.data,
				});
			},
		);
	};
}
export function signStoreRoomLog(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/log/report/sign', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getStoreRoomListByStoreRoomId(
							post?.store_room_id,
							post?.report_date,
						),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: SIGN_STORE_ROOM_LOG,
					[SIGN_STORE_ROOM_LOG]: response.data,
				});
			},
		);
	};
}

export function updateAdjustment(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/log/update_adjustment', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);					
				} else {
					errorNotification(response.data?.message);
				}

				if(typeof cb == "function") cb(response.data);
			},
		);
	};
}

export function updateIssue(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/log/update_issue', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);					
				} else {
					errorNotification(response.data?.message);
				}

				if(typeof cb == "function") cb(response.data);
			},
		);
	};
}

export function deleteStoreRoomAdjustment(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/log/delete_adjustment', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);					
				} else {
					errorNotification(response.data?.message);
				}

				if(typeof cb == "function") cb(response.data);
			},
		);
	};
}

export function downloadStoreRoomReport(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/store_room/log/report', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// window.location.href = response?.data?.result?.file;
					if(typeof cb == "function"){
						cb(response);
					} else {
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

export function saveSignatureApi(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/signature/create', reqBody: post },
			(response) => {
				if (typeof cb == 'function') {
					cb(response?.data);
				}
			},
		);
	};
}

export function getSignature(data, cb) {
	return (dispatch) => {
		return axiosGet({ url: '/signature/' + data.user_id }, (response) => {
			if (typeof cb == 'function') cb(response.data);
		});
	};
}

export function getVendorAndMaterialReport(post, cb){
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/po_report/material_vendor_wise', reqBody: post },
			(response) => {
				if (typeof cb == 'function') {
					cb(response?.data);
				}
			},
		);
	};
}