import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosPost } from '../axiosHelper';
import {
	DELETE_REVISION,
	GET_SHEET_DETAILS_BY_ID,
	PLAN_REVISION_INDEX_UPDATE,
	REVISION_RENAME,
	UPDATE_SHEET_PLAN,
} from './actionType';
import { getAllSheets, getSingleSheets } from './projects';

export function updateSheetPlan(post, fetchSingle = false) {
	// {
	//     "plan_id":"60b0fb2dd63e6af565454beb",
	//     "project_id":"60b0fabfd63e6af565454be7",
	//     "user_id":"60b0f9ced63e6af565454be6",
	//     "directory_id":"60b0fabfd63e6af565454be8",
	//     "sheet_no":"V2.1_Handbook_01_03_2021-1",
	//     "name":"Plan Name",
	//     "tags":[
	//         "60cdb0eeb9db5a3d78d933c4"
	//     ],
	//     "revision_no":"R1"
	// }
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/directory/plan_update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					if (fetchSingle === true) {
						dispatch(getSingleSheets(post?.plan_id));
					} else {
						dispatch(getAllSheets(post?.project_id));
					}
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_SHEET_PLAN,
					[UPDATE_SHEET_PLAN]: response.data,
				});
			},
		);
	};
}
export function deleteRevision(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plan_revision_delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch({
						type: GET_SHEET_DETAILS_BY_ID,
						[GET_SHEET_DETAILS_BY_ID]: [],
					});
					dispatch(getSingleSheets(post?.plan_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_REVISION,
					[DELETE_REVISION]: response.data,
				});
			},
		);
	};
}
export function palnRevisionIndexUpdate(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plan_revision/sort', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getSingleSheets(post?.plan_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: PLAN_REVISION_INDEX_UPDATE,
					[PLAN_REVISION_INDEX_UPDATE]: response.data,
				});
			},
		);
	};
}
export function revisionRename(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plan_revision/rename', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch({
						type: GET_SHEET_DETAILS_BY_ID,
						[GET_SHEET_DETAILS_BY_ID]: [],
					});
					dispatch(getSingleSheets(post?.plan_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: REVISION_RENAME,
					[REVISION_RENAME]: response.data,
				});
			},
		);
	};
}
