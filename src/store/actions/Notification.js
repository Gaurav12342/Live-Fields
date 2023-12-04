import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosGet, axiosPost } from '../axiosHelper';
import {
	DELETE_NOTIFICATION,
	GET_NOTIFICATION_COUNT,
	GET_NOTIFICATION_BY_PROJECT,
	READ_NOTIFICATION,
	SEND_NOTIFICATION,
	GET_PROJECT_NOTIFICATION_COUNT
} from './actionType';

export function SendNotification(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: 'api/v1/notifications', reqBody: post },
			(response) => {
				dispatch({
					type: SEND_NOTIFICATION,
					send_notification: response.data,
				});
			},
		);
	};
}

export function getNotification(id) {
	return (dispatch) => {
		return axiosGet({ url: '/user/notification/' + id }, (response) => {
			dispatch({
				type: GET_NOTIFICATION_COUNT,
				[GET_NOTIFICATION_COUNT]: response.data,
			});
		});
	};
}

export function getNotificationProjectWiseCount(postData){
	return (dispatch) => {
		return axiosPost({ url: '/user/notification/count/project_wise', reqBody: postData}, (response) => {
			dispatch({
				type: GET_PROJECT_NOTIFICATION_COUNT,
				[GET_PROJECT_NOTIFICATION_COUNT]: response.data,
			});
		});
	};
}

export function getProjectNotification(postData, cb){
	return (dispatch) => {
		return axiosPost({ url: '/user/notification/list_by_project', reqBody: postData}, (response) => {
			if(typeof cb != "undefined"){
				if(response.data.result){
					cb(response.data.result)
				}else{
					cb([])
				}
			}
		});
	};
}

export function getNotificationByProject(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: `/user/notification/${id}/project_wise` },
			(response) => {
				dispatch({
					type: GET_NOTIFICATION_BY_PROJECT,
					[GET_NOTIFICATION_BY_PROJECT]: response.data,
				});
			},
		);
	};
}

export function readNotification(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user/notification/is_read', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					if(typeof cb == "function") cb(response.data);
					dispatch(getNotificationByProject(post?.user_id));
					dispatch(getNotification(post?.user_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: READ_NOTIFICATION,
					[READ_NOTIFICATION]: response.data,
				});
			},
		);
	};
}

export function deleteNotification(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user/notification/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getNotificationByProject(post?.user_id));
					dispatch(getNotification(post?.user_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_NOTIFICATION,
					[DELETE_NOTIFICATION]: response.data,
				});
				if(typeof cb == "function"){
					cb(response.data)
				}
			},
		);
	};
}
