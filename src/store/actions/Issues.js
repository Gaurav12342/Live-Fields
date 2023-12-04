import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosPost, axiosGet } from '../axiosHelper';
import {
	GET_ISSUE_LIST,
	GET_ISSUE_DATA
} from './actionType';

export function createIssue( post, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/issue/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}

				if(typeof cb == "function") cb(response.data?.result);
				
			},
		);
	};
}

export function getIssueDetails(post, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/issue/details', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					dispatch({
						type: GET_ISSUE_DATA,
						[GET_ISSUE_DATA]: response.data.result ? response.data.result : {},
					});
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb === "function") cb(response.data);
			},
		);
	};
}


export function issueListFilter(post) {
	return (dispatch) => {
		return axiosPost({url: '/project/issue/list',reqBody: post},
			(response) => {
				dispatch({
					type: GET_ISSUE_LIST,
					[GET_ISSUE_LIST]: response.data.result ? response.data.result : [],
				});
			},
		);
	};
}


export function issueUpdate(post, cb) {
	return (dispatch) => {
		return axiosPost({url: '/project/issue/update',reqBody: post},
			(response) => {
				if(typeof cb === "function") cb(response.data);
			},
		);
	};
}

export function issueDelete(post, cb) {
	return (dispatch) => {
		return axiosPost({url: '/project/issue/delete',reqBody: post},
			(response) => {
				if(typeof cb === "function") cb(response.data);
			},
		);
	};
}

export function issueForTask(post, cb) {
	return (dispatch) => {
		return axiosPost({url: '/project/issue/list_for_task',reqBody: post},
			(response) => {
				if(typeof cb === "function") cb(response.data);
			},
		);
	};
}

export function issueLinkWithTask(post, cb) {
	return (dispatch) => {
		return axiosPost({url: '/project/issue/link_issue_task',reqBody: post},
			(response) => {
				if(typeof cb === "function") cb(response.data);
			},
		);
	};
}

export function removeRelatedIssue(post, cb) {
	return (dispatch) => {
		return axiosPost({url: '/project/issue/unlink_issue_task',reqBody: post},
			(response) => {
				if(typeof cb === "function") cb(response.data);
			},
		);
	};
}

export function issueLogs(post, cb) {
	return (dispatch) => {
		return axiosPost({url: '/project/issue/logs',reqBody: post},
			(response) => {
				if(typeof cb === "function") cb(response.data);
			},
		);
	};
}

export function issueSummeryReport(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/issue/summary_report', reqBody: post },
			(response) => {
				if(typeof cb == "function") cb(response.data);
				/* if (response.data?.success === true) {
					cb(response.data);
				} else {
					errorNotification(response.data?.message);
				} */
			},
		);
	};
}


export function issueDetailsReport(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/issue/daily_report', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					cb(response.data);
				} else {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}