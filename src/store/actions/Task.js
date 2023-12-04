import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosPost, axiosGet } from '../axiosHelper';
import {
	CREATE_TASK,
	UPDATE_TASK,
	CREATE_TASK_BOARD,
	GET_TASK_BOARD_LIST,
	CREATE_TASK_CATEGORY,
	GET_CATEGORY_LIST,
	GET_TASK_LIST_BY_BOARD,
	ADD_ATTACHMENT,
	GET_TASK_ATTACHMENT,
	GET_TASK_LIST_BY_PROJRCT_ID,
	GET_LOCATION_LIST,
	GET_SINGLE_TASK,
	GET_ALL_TASK_KANBAN,
	DELETE_TASK,
	GET_ALL_RELATED_TASK,
	GET_ALL_TASK_BOARD_LIST,
	ADD_RELATED_TASK,
	TASK_COMMENT,
	CREATE_LOCATION,
	CREATE_TASK_CHECKLIST,
	GET_TASK_CHECKLIST,
	DELETE_TASK_CHECKLIST,
	UPDATE_TASK_CHECKLIST,
	COPY_TASK,
	USE_TEMPLATE,
	UPDATE_LOCATION,
	UPDATE_TASK_CATEGORY,
	DELETE_LOCATION,
	DELETE_CATEGORY,
} from './actionType';
import { sendPostMessage } from './postMessage';
import { getSingleSheets } from './projects';

export function deleteTask(post, view = 'list', filterData) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					if (view === 'kanban') {
						dispatch(
							taskKanbanFilter({
								project_id: post?.project_id,
								user_id: post?.user_id,
								...filterData,
							}),
						);
					} else if (view === 'board') {
						dispatch(
							taskBoardFilter({
								project_id: post?.project_id,
								user_id: post?.user_id,
								...filterData,
							}),
						);
					} else {
						dispatch(
							taskListFilter({
								project_id: post?.project_id,
								user_id: post?.user_id,
								...filterData,
							}),
						);
					}
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_TASK,
					[DELETE_TASK]: response.data,
				});
			},
		);
	};
}
export function createTask(
	post,
	fetchSheet,
	view = 'list',
	filterData,
	Navigate,
	{ i, cb } = { i: null, cb: () => {} },
) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					if (fetchSheet === false) {
						if (view === 'kanban') {
							dispatch(
								taskKanbanFilter({
									project_id: post?.project_id,
									user_id: post?.user_id,
									...filterData,
								}),
							);
						} else if (view === 'board') {
							dispatch(
								taskBoardFilter({
									project_id: post?.project_id,
									user_id: post?.user_id,
									...filterData,
								}),
							);
						} else {
							dispatch(
								taskListFilter({
									project_id: post?.project_id,
									user_id: post?.user_id,
									...filterData,
								}),
							);
						}
						const taskUrl = `/tasks/${post?.project_id}/${response.data?.result?._id}?v=${view}`;
						Navigate(taskUrl);
					} else if (fetchSheet !== 'unset') {
						if (fetchSheet === true) {
							dispatch(getSingleSheets(post?.plan_id));
						} else {
							dispatch(getSingleSheets(fetchSheet));
						}
					}
					if (i !== undefined) {
						cb(i);
					}
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_TASK,
					[CREATE_TASK]: response.data,
				});
			},
		);
	};
}
export function addRelatedTask(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/link_related_task', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// dispatch(getSingleSheets(post?.plan_id))
					dispatch(getSingleTask(post?.task_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ADD_RELATED_TASK,
					[ADD_RELATED_TASK]: response.data,
				});
			},
		);
	};
}
export function getAllRelatedTask(task_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/task/get_linked_task/' + task_id },
			(response) => {
				dispatch({
					type: GET_ALL_RELATED_TASK,
					[GET_ALL_RELATED_TASK]: response.data,
				});
			},
		);
	};
}

export function taskComment(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/comment/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getSingleTask(post?.task_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: TASK_COMMENT,
					[TASK_COMMENT]: response.data,
				});
			},
		);
	};
}

export function getAllTaskByProjectId(project_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/task/getbyproject/' + project_id },
			(response) => {
				dispatch({
					type: GET_TASK_LIST_BY_PROJRCT_ID,
					[GET_TASK_LIST_BY_PROJRCT_ID]: response.data,
				});
			},
		);
	};
}

export function updateTask(post, fetchSheet, view = 'list', filterData) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					// successNotification(response.data?.message)
					if (fetchSheet === false) {
						dispatch(clearTasksData());
						if (view === 'kanban') {
							dispatch(
								taskKanbanFilter({
									project_id: post?.project_id,
									user_id: post?.user_id,
									...filterData,
								}),
							);
						} else if (view === 'board') {
							dispatch(
								taskBoardFilter({
									project_id: post?.project_id,
									user_id: post?.user_id,
									...filterData,
								}),
							);
						} else {
							dispatch(
								taskListFilter({
									project_id: post?.project_id,
									user_id: post?.user_id,
									...filterData,
								}),
							);
						}
						dispatch(getSingleTask(post?.task_id));
					} else {
						dispatch(
							getSingleSheets(
								post?.plan_id === 'unlink' ? fetchSheet : post?.plan_id,
							),
						);
					}
				} else {
					errorNotification(response.data?.message);
				}
				sendPostMessage('task_updated');
				dispatch({
					type: UPDATE_TASK,
					[UPDATE_TASK]: response.data,
				});
			},
		);
	};
}

export function CreateTakBoard(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: 'project/task_board/create', reqBody: post },
			(response) => {
				dispatch({
					type: CREATE_TASK_BOARD,
					create_task_board: response.data,
				});
			},
		);
	};
}

export function GetTaskBoardList() {
	return (dispatch) => {
		return axiosGet(
			{ url: 'project/task_board/list/:user_id/:task_id' },
			(response) => {
				dispatch({
					type: GET_TASK_BOARD_LIST,
					get_task_board_list: response.data,
				});
			},
		);
	};
}

export function CreateTaskCategory(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task_category/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(GetCategoryList(post?.project_id, post?.user_id));
					if (cb) {
						cb(response?.data);
					}
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_TASK_CATEGORY,
					[CREATE_TASK_CATEGORY]: response.data,
				});
			},
		);
	};
}
export function updateTaskCategory(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task_category/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(GetCategoryList(post?.project_id, post?.user_id));
					// cb(response?.data)
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_TASK_CATEGORY,
					[UPDATE_TASK_CATEGORY]: response.data,
				});
			},
		);
	};
}
export function deleteCategory(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task_category/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(GetCategoryList(post?.project_id, post?.user_id));
					// cb(response?.data)
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_CATEGORY,
					[DELETE_CATEGORY]: response.data,
				});
			},
		);
	};
}
export function GetCategoryList(project_id, user_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: 'project/task_category/list/' + user_id + '/' + project_id },
			(response) => {
				dispatch({
					type: GET_CATEGORY_LIST,
					[GET_CATEGORY_LIST]: response.data,
				});
			},
		);
	};
}
export function getLocationList(project_id, user_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/task_location/list/' + user_id + '/' + project_id },
			(response) => {
				dispatch({
					type: GET_LOCATION_LIST,
					[GET_LOCATION_LIST]: response.data,
				});
			},
		);
	};
}

export function createlocation(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task_location/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getLocationList(post?.project_id, post?.user_id));
					if(typeof cb == "function") cb(response.data.result)
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_LOCATION,
					[CREATE_LOCATION]: response.data,
				});
			},
		);
	};
}

export function updatelocation(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task_location/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getLocationList(post?.project_id, post?.user_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_LOCATION,
					[UPDATE_LOCATION]: response.data,
				});
			},
		);
	};
}
export function deleteLocation(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task_location/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getLocationList(post?.project_id, post?.user_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_LOCATION,
					[DELETE_LOCATION]: response.data,
				});
			},
		);
	};
}

export function getTaskListKanban(project_id, user_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/task/list_kanban_view/' + user_id + '/' + project_id },
			(response) => {
				dispatch({
					type: GET_ALL_TASK_KANBAN,
					[GET_ALL_TASK_KANBAN]: response.data,
				});
			},
		);
	};
}

export function getSingleTask(task_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/task/get_single/' + task_id },
			(response) => {
				dispatch({
					type: GET_SINGLE_TASK,
					[GET_SINGLE_TASK]: response.data,
				});
			},
		);
	};
}

export function GetTaskListByBoard(project_id, user_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/task/list_board_wise/' + user_id + '/' + project_id },
			(response) => {
				dispatch({
					type: GET_TASK_LIST_BY_BOARD,
					[GET_TASK_LIST_BY_BOARD]: response.data,
				});
			},
		);
	};
}

export function AddAttachment(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: 'project/task/attachment', reqBody: post },
			(response) => {
				dispatch({
					type: ADD_ATTACHMENT,
					add_attachment: response.data,
				});
			},
		);
	};
}

export function GetTaskAttachment() {
	return (dispatch) => {
		return axiosGet(
			{ url: 'project/task/attachment/:user_id/:task_id' },
			(response) => {
				dispatch({
					type: GET_TASK_ATTACHMENT,
					get_task_attachment: response.data,
				});
			},
		);
	};
}
export function getBoardList(project_id, user_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/task_board/list/' + user_id + '/' + project_id },
			(response) => {
				dispatch({
					type: GET_ALL_TASK_BOARD_LIST,
					[GET_ALL_TASK_BOARD_LIST]: response.data,
				});
			},
		);
	};
}

export function clearTaskListBoradData() {
	return (dispatch) => {
		dispatch({
			type: GET_TASK_LIST_BY_BOARD,
			[GET_TASK_LIST_BY_BOARD]: {},
		});
	};
}

export function taskKanbanFilter(post) {
	return (dispatch) => {
		return axiosPost(
			{
				url:
					'/project/task/list_kanban_view_filter/' +
					post.user_id +
					'/' +
					post.project_id,
				reqBody: post,
			},
			(response) => {
				dispatch({
					type: GET_TASK_LIST_BY_BOARD,
					[GET_TASK_LIST_BY_BOARD]: response.data,
				});
			},
		);
	};
}

const clearTasksData = () => {
	return (dispatch) =>
		dispatch({
			type: GET_TASK_LIST_BY_BOARD,
			[GET_TASK_LIST_BY_BOARD]: {},
		});
};

export function taskBoardFilter(post) {
	return (dispatch) => {
		return axiosPost(
			{
				url:
					'/project/task/list_board_wise_filter/' +
					post.user_id +
					'/' +
					post.project_id,
				reqBody: post,
			},
			(response) => {
				dispatch({
					type: GET_TASK_LIST_BY_BOARD,
					[GET_TASK_LIST_BY_BOARD]: response.data,
				});
			},
		);
	};
}

export function taskListFilter(post) {
	return (dispatch) => {
		return axiosPost(
			{
				url: '/project/task/list_view/' + post.user_id + '/' + post.project_id,
				reqBody: post,
			},
			(response) => {
				dispatch({
					type: GET_TASK_LIST_BY_BOARD,
					[GET_TASK_LIST_BY_BOARD]: response.data,
				});
			},
		);
	};
}

export function updateKanbanStatus(post, filterData) {
	return (dispatch) => {
		return axiosPost(
			{ url: 'project/task/update_kanban_view', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// dispatch(getTaskListKanban(post?.project_id, post?.user_id));
					dispatch(
						taskKanbanFilter({
							project_id: post?.project_id,
							user_id: post?.user_id,
							...filterData,
						}),
					);
				} else {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}
export function createTaskChecklist(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/checklist/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					// dispatch(GetTaskListByBoard(post?.project_id, post?.userId))
					dispatch(getTaskChecklist(post?.task_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_TASK_CHECKLIST,
					[CREATE_TASK_CHECKLIST]: response.data,
				});
			},
		);
	};
}

export function getTaskChecklist(task_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/task_checklist/list/' + task_id },
			(response) => {
				dispatch({
					type: GET_TASK_CHECKLIST,
					[GET_TASK_CHECKLIST]: response.data,
				});
			},
		);
	};
}

export function updateTaskChecklist(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/checklist/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message)
					dispatch(getTaskChecklist(post?.task_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_TASK_CHECKLIST,
					[UPDATE_TASK_CHECKLIST]: response.data,
				});
			},
		);
	};
}

export function deleteTaskChecklist(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/checklist/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getTaskChecklist(post?.task_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_TASK_CHECKLIST,
					[DELETE_TASK_CHECKLIST]: response.data,
				});
			},
		);
	};
}

export function copyTask(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/clone', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						taskListFilter({
							project_id: post?.project_id,
							user_id: post?.user_id,
						}),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: COPY_TASK,
					[COPY_TASK]: response.data,
				});
			},
		);
	};
}
export function useTemplate(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/use_template', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getTaskChecklist(post?.task_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: USE_TEMPLATE,
					[USE_TEMPLATE]: response.data,
				});
			},
		);
	};
}

export function manageTemplate(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/use_template', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getTaskChecklist(post?.task_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: USE_TEMPLATE,
					[USE_TEMPLATE]: response.data,
				});
			},
		);
	};
}

export function validateImportTasks(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/import/validate', reqBody: post },
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

export function tasksSummeryReport(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/summary_report', reqBody: post },
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

export function tasksDetailsReport(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/task/daily_report', reqBody: post },
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
