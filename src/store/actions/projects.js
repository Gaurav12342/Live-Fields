import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosGet, axiosPost, axiosPostFileUpload } from '../axiosHelper';
import { CHAT_URL } from '../../commons/constants';
import {
	ARCHIVE_PROJECT,
	CREATE_PROJECT,
	CREATE_TEMPLATE,
	DELETE_PROJECT,
	GET_ALL_FILE_DIRECTORIES,
	GET_ALL_FILE_LIST_DIRECTORIES_WISE,
	GET_ALL_PROJECT,
	GET_ALL_ROLE,
	GET_ALL_ROLE_WISE_PEOPLE,
	GET_ALL_SHEETS,
	GET_ALL_TEMPLATE,
	GET_ALL_TEMPLATE_CHECKLIST,
	GET_PROJECT_DETAILS,
	INVITE_USER,
	LEAVE_PROJECT,
	REMOVE_USER,
	UPDATE_PROJECT_SETTING,
	UPDATE_ROLE,
	CREATE_CHECKLIST,
	DELETE_TEMPLATE,
	DELETE_CHECKLIST,
	UPDATE_PROJECT_TEMPLATE,
	GET_ALL_PHOTOS,
	CREATE_DIRECTORY,
	UPDATE_DIRECTORY,
	DELETE_PLAN,
	CREATE_PLAN,
	UPDATE_PROJECT_TEMPLATE_CHECKLIST,
	DELETE_DIRECTORY,
	UPDATE_FILE_DIRECTORY,
	GET_ALL_TAGS,
	CREATE_TAGS,
	MOVE_PLAN_DIRECTORY,
	DELETE_FILE_DIRECTORY,
	DELETE_FILE,
	CREATE_USER_ROLE,
	GET_USER_ROLE_BY_ID,
	UPDATE_USER_ROLE_BY_ID,
	DELETE_USER_ROLE_BY_ID,
	CREATE_FILE,
	GET_ALL_MEETING_LIST,
	GET_ALL_SUBPOINT_LIST,
	CREATE_MEETING,
	DELETE_MEETING,
	UPDATE_MEETING,
	CREATE_POINT,
	ADD_PROJECT_PHOTOS,
	DELETE_PROJECT_PHOTOS,
	UPDATE_PROJECT_PHOTO,
	INVITE_MEETING_USER,
	GET_ALL_LABOUR_LIST,
	DELETE_LABOUR,
	UPDATE_LABOUR,
	GET_ALL_EQUIPMENT_LIST,
	CREATE_EQUIPMENT,
	UPDATE_EQUIPMENT,
	DELETE_EQUIPMENT,
	GET_ALL_TIMESHEET_LIST,
	CREATE_TIMESHEET,
	UPDATE_TIMESHEET,
	DELETE_TIMESHEET,
	GET_ALL_INSPECTION_LIST,
	CREATE_INSPECTION,
	UPDATE_INSPECTION,
	DELETE_INSPECTION,
	UPDATE_MEETING_POINT,
	DELETE_MEETING_POINT,
	CHANGE_FILE_DIRECTORY,
	GET_ALL_ACCESS_KEYS,
	ADD_RELATED_SHEET,
	GET_RELATED_SHEET,
	CREATE_PLAN_COMMENT,
	GET_ALL_SHEETS_COMMENT,
	GET_SHEET_DETAILS_BY_ID,
	GET_ALL_ROLE_ACCESS_KEYS,
	ADD_RELATED_FILES,
	GET_RELATED_FILES,
	ADD_PLAN_REVISION,
	GET_ALL_SHEETS_PHOTOS,
	ADD_SHEET_PHOTOS,
	GET_LABOUR_LOG_BY_PROJECT_ID,
	CREATE_LABOUR,
	CREATE_LABOUR_LOG,
	GET_ALL_EQUIPMENT_LOG_LIST_BY_ID_AND_DATE,
	CREATE_EQUIPMENT_LOG,
	UPDATE_EQUIPMENT_LOG,
	UPDATE_LABOUR_LOG,
	DELETE_LABOUR_LOG,
	SIGN_LABOUR_AND_EQUIPMENT_LOG,
	SHARE_PLANS,
	SHARE_FILES,
	GET_RECENT_SHEETS,
	DELETE_TAGS,
	UPDATE_TAGS,
	CREATE_SUB_POINT,
	UPDATE_MEETING_SUB_POINT,
	DELETE_MEETING_SUB_POINT,
	DELETE_SHEET_RELATED_PHOTOS,
	GET_COUNT,
	GET_REPORT_PERMISSION_LIST,
	REPORT_PERMISSION_STATUS,
	ADD_MULTIPLE_PROJECT_PHOTOS,
	GET_RFI_LIST,
	LOADING_DATA,
	GET_VENDOR_LIST,
	GET_WALL_LIST
} from './actionType';

export function getAllProjects(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/' + id + '?archive=true' }, (response) => {
			dispatch({
				type: GET_ALL_PROJECT,
				[GET_ALL_PROJECT]: response.data,
			});
		});
	};
}

export function getAllPeopleRole(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/role/' + id }, (response) => {
			dispatch({
				type: GET_ALL_ROLE,
				[GET_ALL_ROLE]: response.data,
			});
		});
	};
}

export function getAllRoleWisePeople(id) {
	return (dispatch) => {
		if (!id) {
			return dispatch({
				type: 'noid',
				noid: '',
			});
		}
		return axiosGet({ url: '/project/users/role_wise/' + id }, (response) => {
			dispatch({
				type: GET_ALL_ROLE_WISE_PEOPLE,
				[GET_ALL_ROLE_WISE_PEOPLE]: response.data,
			});
		});
	};
}

export function getUserRoleById(id) {
	return (dispatch) => {
		return axiosGet({ url: '/role/by_id/' + id }, (response) => {
			dispatch({
				type: GET_USER_ROLE_BY_ID,
				[GET_USER_ROLE_BY_ID]: response.data,
			});
		});
	};
}

export function getAccessKey() {
	return (dispatch) => {
		return axiosGet({ url: '/role/keys' }, (response) => {
			dispatch({
				type: GET_ALL_ACCESS_KEYS,
				[GET_ALL_ACCESS_KEYS]: response.data,
			});
		});
	};
}

export function getAllRoleAccessKey(id) {
	return (dispatch) => {
		return axiosGet({ url: '/role/by_project_id/' + id }, (response) => {
			dispatch({
				type: GET_ALL_ROLE_ACCESS_KEYS,
				[GET_ALL_ROLE_ACCESS_KEYS]: response.data,
			});
		});
	};
}

export function creatUserRole(post) {
	return (dispatch) => {
		return axiosPost({ url: '/role/create', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				setTimeout(() => {
					window.location.href = '/people/' + post.project_id + '/roles';
				}, 1500);
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: CREATE_USER_ROLE,
				[CREATE_USER_ROLE]: response.data,
			});
		});
	};
}

export function deleteUserRoleById(post) {
	return (dispatch) => {
		return axiosPost({ url: '/role/delete', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllRoleAccessKey(post?.project_id));
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: DELETE_USER_ROLE_BY_ID,
				[DELETE_USER_ROLE_BY_ID]: response.data,
			});
		});
	};
}
export function updateUserRoleById(post) {
	return (dispatch) => {
		return axiosPost({ url: '/role/update', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				dispatch(getAllRoleAccessKey(post?.project_id));
				successNotification(response.data?.message);
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: UPDATE_USER_ROLE_BY_ID,
				[UPDATE_USER_ROLE_BY_ID]: response.data,
			});
		});
	};
}

export function inviteUserToProject(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/user_invite', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: INVITE_USER,
					[INVITE_USER]: response.data,
				});

				if(typeof cb == "function") cb(response.data);
			},
		);
	};
}

export function updateUserRole(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/change_user_role', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_ROLE,
					[UPDATE_ROLE]: response.data,
				});
				if(typeof cb == "function") cb(response.data);
			},
		);
	};
}

export function removeUserFromProject(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/remove_user', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: REMOVE_USER,
					[REMOVE_USER]: response.data,
				});
			},
		);
	};
}

export function getAllfileDirectories(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/file_directories/' + id }, (response) => {
			dispatch({
				type: GET_ALL_FILE_DIRECTORIES,
				[GET_ALL_FILE_DIRECTORIES]: response.data,
			});
		});
	};
}

export function createTag(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/tag/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					dispatch(getAllTags(post.project_id));
					if (cb) {
						cb(response.data);
					}
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_TAGS,
					[CREATE_TAGS]: response.data,
				});
			},
		);
	};
}

export function updateTags(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/tag/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					dispatch(getAllTags(post.project_id));
					if (cb) {
						cb(response.data);
					}
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_TAGS,
					[UPDATE_TAGS]: response.data,
				});
			},
		);
	};
}
export function getAllTags(project_id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/tag_list/' + project_id }, (response) => {
			dispatch({
				type: GET_ALL_TAGS,
				[GET_ALL_TAGS]: response.data,
			});
		});
	};
}

export function getAdminProjectTemplates(cb) {
	return (dispatch) => {
		return axiosGet({ url: '/admin_project_template/list' }, (response) => {
			cb(response.data)
		});
	};
}

export function deleteTags(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/tag/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					dispatch(getAllTags(post.project_id));
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_TAGS,
					[DELETE_TAGS]: response.data,
				});
			},
		);
	};
}
export function getAllFileDirectoriesWise(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/files/' + id }, (response) => {
			dispatch({
				type: GET_ALL_FILE_LIST_DIRECTORIES_WISE,
				[GET_ALL_FILE_LIST_DIRECTORIES_WISE]: response.data,
			});
		});
	};
}

export function creatProject(post) {
	return (dispatch) => {
		return axiosPost({ url: '/project/create', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllProjects(post?.user_id));
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: CREATE_PROJECT,
				[CREATE_PROJECT]: response.data,
			});
		});
	};
}

export function archiveUnarchiveProject(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/archive_unarchive', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllProjects(post?.user_id));
					if (typeof cb == 'function') {
						cb(response.data);
					}
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ARCHIVE_PROJECT,
					[ARCHIVE_PROJECT]: response.data,
				});
			},
		);
	};
}

export function deleteProject(post) {
	return (dispatch) => {
		return axiosPost({ url: '/project/delete', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllProjects(post?.user_id));
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: DELETE_PROJECT,
				[DELETE_PROJECT]: response.data,
			});
		});
	};
}
export function leaveProject(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/leave_project', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllProjects(post?.user_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: LEAVE_PROJECT,
					[LEAVE_PROJECT]: response.data,
				});
			},
		);
	};
}

export function getAllSheets(id) {
	return (dispatch) => {
		/* dispatch({
			type:LOADING_DATA,
			[LOADING_DATA]:true
		}) */
		return axiosGet({ url: '/project/plans/' + id }, (response) => {
			/* dispatch({
				type:LOADING_DATA,
				[LOADING_DATA]:false
			}) */
			dispatch({
				type: GET_ALL_SHEETS,
				[GET_ALL_SHEETS]: response.data,
			});
		});
	};
}

export function getRecentSheets(projectID, userId) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/plans/recent/' + projectID + '/' + userId },
			(response) => {
				dispatch({
					type: GET_RECENT_SHEETS,
					[GET_RECENT_SHEETS]: response.data,
				});
			},
		);
	};
}

export function attachTagsInPlan(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plans/attach_tags', reqBody: post },
			(response) => {
				if(typeof cb == "function") cb(response?.data);
			},
		);
	};
}

export function getSingleSheets(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/plans_details/' + id }, (response) => {
			dispatch({
				type: GET_SHEET_DETAILS_BY_ID,
				[GET_SHEET_DETAILS_BY_ID]: response.data,
			});
		});
	};
}

export function addRelatedSheet(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plan/link_related_plan', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getRelatedSheet(post?.plan_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ADD_RELATED_SHEET,
					[ADD_RELATED_SHEET]: response.data,
				});
			},
		);
	};
}
export function addRelatedFiles(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plan/link_files', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getRelatedFiles(post?.plan_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ADD_RELATED_FILES,
					[ADD_RELATED_FILES]: response.data,
				});
			},
		);
	};
}

export function getRelatedSheet(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/plan/get_linked_plan/' + id },
			(response) => {
				dispatch({
					type: GET_RELATED_SHEET,
					[GET_RELATED_SHEET]: response.data,
				});
			},
		);
	};
}
export function getRelatedFiles(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/get_ralated_file/' + id }, (response) => {
			dispatch({
				type: GET_RELATED_FILES,
				[GET_RELATED_FILES]: response.data,
			});
		});
	};
}
export function getAllSheetsPhotos(id) {
	return (dispatch) => {
		return axiosGet({ url: '/photos_plan/get_by_plan/' + id }, (response) => {
			dispatch({
				type: GET_ALL_SHEETS_PHOTOS,
				[GET_ALL_SHEETS_PHOTOS]: response.data,
			});
		});
	};
}
export function deleteSheetRelatedPhotos(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/photos_plan/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllSheetsPhotos(post?.plan_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_SHEET_RELATED_PHOTOS,
					[DELETE_SHEET_RELATED_PHOTOS]: response.data,
				});
			},
		);
	};
}

export function addSheetPhoto(post) {
	return (dispatch) => {
		return axiosPost({ url: '/photos_plan/add', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllSheetsPhotos(post?.plan_id));
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: ADD_SHEET_PHOTOS,
				[ADD_SHEET_PHOTOS]: response.data,
			});
		});
	};
}

export function getProjectDetails(project_id, user_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/details/' + project_id + '/' + user_id },
			(response) => {
				if (response.data?.success === true) {
					dispatch({
						type: GET_PROJECT_DETAILS,
						[GET_PROJECT_DETAILS]: response.data,
					});
				}else{
					window.location.href = "/projects";
				}
				
			},
		);
	};
}

export function planComment(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plan/comment/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllSheetsComments(post?.plan_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_PLAN_COMMENT,
					[CREATE_PLAN_COMMENT]: response.data,
				});
			},
		);
	};
}

export function getAllSheetsComments(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/plan/comment/' + id }, (response) => {
			dispatch({
				type: GET_ALL_SHEETS_COMMENT,
				[GET_ALL_SHEETS_COMMENT]: response.data,
			});
		});
	};
}

export function updateProjectSetting(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/settings', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_PROJECT_SETTING,
					[UPDATE_PROJECT_SETTING]: response.data,
				});
			},
		);
	};
}

export function updateCompanyProjectSetting(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/company_settings', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_PROJECT_SETTING,
					[UPDATE_PROJECT_SETTING]: response.data,
				});
			},
		);
	};
}

export function getAllTemplate(project_id) {
	return (dispatch) => {
		return axiosGet({ url: '/template/list/' + project_id }, (response) => {
			dispatch({
				type: GET_ALL_TEMPLATE,
				[GET_ALL_TEMPLATE]: response.data,
			});
		});
	};
}

export function getAllTemplateWithFullDetails(project_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/template_full_details/list/' + project_id },
			(response) => {
				dispatch({
					type: GET_ALL_TEMPLATE,
					[GET_ALL_TEMPLATE]: response.data,
				});
			},
		);
	};
}

export function getAllTemplateChecklist(project_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/template/checklist/list/' + project_id },
			(response) => {
				dispatch({
					type: GET_ALL_TEMPLATE_CHECKLIST,
					[GET_ALL_TEMPLATE_CHECKLIST]: response.data,
				});
			},
		);
	};
}

export function createTemplate(post, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/template/create', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllTemplateWithFullDetails(post?.project_id));
				if (typeof cb == 'function') cb(response.data.result);
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: CREATE_TEMPLATE,
				[CREATE_TEMPLATE]: response.data,
			});
		});
	};
}

export function createChecklist(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/template/checklist/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllTemplateWithFullDetails(post?.project_id));
					if (typeof cb == 'function') cb();
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_CHECKLIST,
					[CREATE_CHECKLIST]: response.data,
				});
			},
		);
	};
}

export function deleteTemplate(post) {
	return (dispatch) => {
		return axiosPost({ url: '/template/delete', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllTemplateWithFullDetails(post?.project_id));
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: DELETE_TEMPLATE,
				[DELETE_TEMPLATE]: response.data,
			});
		});
	};
}

export function importAdminTemplate(post, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/template/import_admin_template', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllTemplateWithFullDetails(post?.project_id));
				cb(response.data)
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: DELETE_TEMPLATE,
				[DELETE_TEMPLATE]: response.data,
			});
		});
	};
}

export function deleteChecklist(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/template/checklist/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllTemplateWithFullDetails(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_CHECKLIST,
					[DELETE_CHECKLIST]: response.data,
				});
			},
		);
	};
}

export function createDirectory(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/directory', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_DIRECTORY,
					[CREATE_DIRECTORY]: response.data,
				});
			},
		);
	};
}

export function updateDirectories(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/file_directory/update/', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllFileDirectoriesWise(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_FILE_DIRECTORY,
					[UPDATE_FILE_DIRECTORY]: response.data,
				});
			},
		);
	};
}
export function changeFileDirectories(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/file/change_directory', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllFileDirectoriesWise(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CHANGE_FILE_DIRECTORY,
					[CHANGE_FILE_DIRECTORY]: response.data,
				});
			},
		);
	};
}
export function deleteDirectory(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/directory/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllSheets(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_DIRECTORY,
					[DELETE_DIRECTORY]: response.data,
				});
			},
		);
	};
}

export function deleteFileDirectory(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/file_directory/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllFileDirectoriesWise(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_FILE_DIRECTORY,
					[DELETE_FILE_DIRECTORY]: response.data,
				});
			},
		);
	};
}

export function createFile(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/file_directory/files', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllFileDirectoriesWise(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_FILE,
					[CREATE_FILE]: response.data,
				});
			},
		);
	};
}

export function deleteFile(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/file_directory/files/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllFileDirectoriesWise(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_FILE,
					[DELETE_FILE]: response.data,
				});
			},
		);
	};
}

export function MovePlanDirectories(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plans/change_directory', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllSheets(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: MOVE_PLAN_DIRECTORY,
					[MOVE_PLAN_DIRECTORY]: response.data,
				});
			},
		);
	};
}

export function updatePlanDirectories(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/directory/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllSheets(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_DIRECTORY,
					[UPDATE_DIRECTORY]: response.data,
				});
			},
		);
	};
}

export function updateProjectTemplate(post, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/template/update', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllTemplateWithFullDetails(post?.project_id));
				if (typeof cb == 'function') cb({});
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: UPDATE_PROJECT_TEMPLATE,
				[UPDATE_PROJECT_TEMPLATE]: response.data,
			});
		});
	};
}

export function updateProjectChecklist(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/template/checklist/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllTemplateWithFullDetails(post?.project_id));
					if (typeof cb == 'function') cb({});
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_PROJECT_TEMPLATE_CHECKLIST,
					[UPDATE_PROJECT_TEMPLATE_CHECKLIST]: response.data,
				});
			},
		);
	};
}

export function getAllPhotos(project_id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/photos/get_by_project/' + project_id },
			(response) => {
				dispatch({
					type: GET_ALL_PHOTOS,
					[GET_ALL_PHOTOS]: response.data,
				});
			},
		);
	};
}

export function getAllFilterPhotos(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/photos/get_by_filter', reqBody: post },
			(response) => {
				dispatch({
					type: GET_ALL_PHOTOS,
					[GET_ALL_PHOTOS]: response.data,
				});
			},
		);
	};
}

export function attachTagsInPhotos(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/photos/attach/tags', reqBody: post },
			(response) => {
				if(typeof cb == "function") cb(response?.data)
				/* dispatch({
					type: GET_ALL_PHOTOS,
					[GET_ALL_PHOTOS]: response.data,
				}); */
			},
		);
	};
}

export function createFileDirectory(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/file_directory', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllFileDirectoriesWise(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_DIRECTORY,
					[CREATE_DIRECTORY]: response.data,
				});
			},
		);
	};
}

export function deletePlan(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/plan_delete/', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllSheets(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_PLAN,
					[DELETE_PLAN]: response.data,
				});
			},
		);
	};
}

export function createPlan(post) {
	return (dispatch) => {
		dispatch({
			type: LOADING_DATA,
			[LOADING_DATA]: true,
		});
		return axiosPost(
			{ url: '/project/directory/plans', reqBody: post },
			(response) => {
				dispatch({
					type: LOADING_DATA,
					[LOADING_DATA]: false,
				});
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllSheets(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_PLAN,
					[CREATE_PLAN]: response.data,
				});
			},
		);
	};
}

export function createProjectMeeting(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meeting/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_MEETING,
					[CREATE_MEETING]: response.data,
				});
			},
		);
	};
}
export function editMeeting(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meeting/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_MEETING,
					[UPDATE_MEETING]: response.data,
				});
			},
		);
	};
}
export function createPoint(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meetingponit/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_POINT,
					[CREATE_POINT]: response.data,
				});
			},
		);
	};
}
export function editMeetingPoint(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meetingponit/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_MEETING_POINT,
					[UPDATE_MEETING_POINT]: response.data,
				});
			},
		);
	};
}
export function deleteMeeting(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meeting/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_MEETING,
					[DELETE_MEETING]: response.data,
				});
			},
		);
	};
}

export function getAllMeetingList(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/meeting/' + id }, (response) => {
			dispatch({
				type: GET_ALL_MEETING_LIST,
				[GET_ALL_MEETING_LIST]: response.data,
			});
		});
	};
}
export function inviteUserToMeeting(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meeting/invite', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: INVITE_MEETING_USER,
					[INVITE_MEETING_USER]: response.data,
				});
			},
		);
	};
}

export function getAllSubPointsList(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/meetingsubponit/' + id }, (response) => {
			dispatch({
				type: GET_ALL_SUBPOINT_LIST,
				[GET_ALL_SUBPOINT_LIST]: response.data,
			});
		});
	};
}

export function createSubPoint(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meetingsubponit/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_SUB_POINT,
					[CREATE_SUB_POINT]: response.data,
				});
			},
		);
	};
}

export function editMeetingSubPoint(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meetingsubponit/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_MEETING_SUB_POINT,
					[UPDATE_MEETING_SUB_POINT]: response.data,
				});
			},
		);
	};
}

export function deleteMeetingSubPoint(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meetingsubponit/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_MEETING_SUB_POINT,
					[DELETE_MEETING_SUB_POINT]: response.data,
				});
			},
		);
	};
}

export function deleteMeetingPoint(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/meetingponit/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllMeetingList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_MEETING_POINT,
					[DELETE_MEETING_POINT]: response.data,
				});
			},
		);
	};
}

export function addProjectPhoto(post) {
	return (dispatch) => {
		return axiosPost({ url: '/photos/add', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllPhotos(post?.project_id));
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: ADD_PROJECT_PHOTOS,
				[ADD_PROJECT_PHOTOS]: response.data,
			});
		});
	};
}
export function addMultipleProjectPhoto(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/photos/add_multiple', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllPhotos(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ADD_MULTIPLE_PROJECT_PHOTOS,
					[ADD_MULTIPLE_PROJECT_PHOTOS]: response.data,
				});
			},
		);
	};
}
export function updateProjectPhoto(post) {
	return (dispatch) => {
		return axiosPost({ url: '/photos/update', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllPhotos(post?.project_id));
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: UPDATE_PROJECT_PHOTO,
				[UPDATE_PROJECT_PHOTO]: response.data,
			});
		});
	};
}

export function deletePhoto(post) {
	return (dispatch) => {
		return axiosPost({ url: '/photos/delete', reqBody: post }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				dispatch(getAllPhotos(post?.project_id));
			} else {
				errorNotification(response.data?.message);
			}
			dispatch({
				type: DELETE_PROJECT_PHOTOS,
				[DELETE_PROJECT_PHOTOS]: response.data,
			});
		});
	};
}

export function createLabour(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labour/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllLabourList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_LABOUR,
					[CREATE_LABOUR]: response.data,
				});
			},
		);
	};
}

export function createLabourLog(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labour/log/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getLabourLogByLabourIdByDate(
							post?.labour_equipment_log_id,
							post?.log_date,
						),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_LABOUR_LOG,
					[CREATE_LABOUR_LOG]: response.data,
				});
			},
		);
	};
}

export function getAllLabourList(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/labour/' + id }, (response) => {
			dispatch({
				type: GET_ALL_LABOUR_LIST,
				[GET_ALL_LABOUR_LIST]: response.data,
			});
		});
	};
}

export function getLabourLogByLabourIdByDate(id, date) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/labour/log/' + id + '/' + date },
			(response) => {
				dispatch({
					type: GET_LABOUR_LOG_BY_PROJECT_ID,
					[GET_LABOUR_LOG_BY_PROJECT_ID]: response.data,
				});
			},
		);
	};
}

export function updateLabour(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labour/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllLabourList(post?.project_id));
					// dispatch(getLabourLogByLabourIdByDate(post?.log_id, post?.date))
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_LABOUR,
					[UPDATE_LABOUR]: response.data,
				});
			},
		);
	};
}
export function updateLabourLog(post, options) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labour/log/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					if (options?.showMessage === true) {
						successNotification(response.data?.message);
					}
					if (options?.dispatchOthers === true) {
						dispatch(
							getLabourLogByLabourIdByDate(
								options?.labour_equipment_log_id,
								options?.date,
							),
						);
					}
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_LABOUR_LOG,
					[UPDATE_LABOUR_LOG]: response.data,
				});
			},
		);
	};
}

export function deleteLabour(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labour/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllLabourList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_LABOUR,
					[DELETE_LABOUR]: response.data,
				});
			},
		);
	};
}

export function deleteLabourLog(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labour/log/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getLabourLogByLabourIdByDate(post?.labour_id, post?.date));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_LABOUR_LOG,
					[DELETE_LABOUR_LOG]: response.data,
				});
			},
		);
	};
}

export function getAllEquipmentLogByIdAndDate(id, date) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/equipment/log/' + id + '/' + date },
			(response) => {
				dispatch({
					type: GET_ALL_EQUIPMENT_LOG_LIST_BY_ID_AND_DATE,
					[GET_ALL_EQUIPMENT_LOG_LIST_BY_ID_AND_DATE]: response.data,
				});
			},
		);
	};
}
export function getAllEquipmentList(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/equipment/' + id }, (response) => {
			dispatch({
				type: GET_ALL_EQUIPMENT_LIST,
				[GET_ALL_EQUIPMENT_LIST]: response.data,
			});
		});
	};
}
export function createEquipment(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/equipment/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllEquipmentList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_EQUIPMENT,
					[CREATE_EQUIPMENT]: response.data,
				});
			},
		);
	};
}

export function createEquipmentLog(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/equipment/log/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getAllEquipmentLogByIdAndDate(
							post?.labour_equipment_log_id,
							post?.log_date,
						),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_EQUIPMENT_LOG,
					[CREATE_EQUIPMENT_LOG]: response.data,
				});
			},
		);
	};
}

export function updateEquipmentLog(post, options) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/equipment/log/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					if (options?.showMessage === true) {
						successNotification(response.data?.message);
					}
					if (options?.dispatchOthers === true) {
						dispatch(
							getAllEquipmentLogByIdAndDate(
								options?.labour_equipment_log_id,
								options?.date,
							),
						);
					}
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_EQUIPMENT_LOG,
					[UPDATE_EQUIPMENT_LOG]: response.data,
				});
			},
		);
	};
}

export function downloadLabourAndEquipmentLog(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labourAndequipment/log/report', reqBody: post },
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

export function signLabourAndEquipmentLog(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/labourAndequipment/log/report/sign', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(
						getAllEquipmentLogByIdAndDate(
							post?.labour_equipment_log_id,
							post?.report_date,
						),
					);
					dispatch(
						getLabourLogByLabourIdByDate(
							post?.labour_equipment_log_id,
							post?.report_date,
						),
					);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: SIGN_LABOUR_AND_EQUIPMENT_LOG,
					[SIGN_LABOUR_AND_EQUIPMENT_LOG]: response.data,
				});
			},
		);
	};
}

export function updateEquipment(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/equipment/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllEquipmentList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_EQUIPMENT,
					[UPDATE_EQUIPMENT]: response.data,
				});
			},
		);
	};
}
export function deleteEquipment(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/equipment/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllEquipmentList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_EQUIPMENT,
					[DELETE_EQUIPMENT]: response.data,
				});
			},
		);
	};
}
export function deleteEquipmentLog(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/equipment/log/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllEquipmentLogByIdAndDate(post?.labour_and_equipment_log_id, post?.date));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_EQUIPMENT,
					[DELETE_EQUIPMENT]: response.data,
				});
			},
		);
	};
}
export function getAllTimeSheetList(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/timesheet/' + id }, (response) => {
			dispatch({
				type: GET_ALL_TIMESHEET_LIST,
				[GET_ALL_TIMESHEET_LIST]: response.data,
			});
		});
	};
}
export function createTimeSheet(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/timesheet/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllTimeSheetList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_TIMESHEET,
					[CREATE_TIMESHEET]: response.data,
				});
			},
		);
	};
}
export function updateTimeSheet(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/timesheet/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllTimeSheetList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_TIMESHEET,
					[UPDATE_TIMESHEET]: response.data,
				});
			},
		);
	};
}
export function deleteTimeSheet(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/timesheet/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllTimeSheetList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_TIMESHEET,
					[DELETE_TIMESHEET]: response.data,
				});
			},
		);
	};
}
export function getAllInspectionList(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/inspection_request/' + id },
			(response) => {
				dispatch({
					type: GET_ALL_INSPECTION_LIST,
					[GET_ALL_INSPECTION_LIST]: response.data,
				});
			},
		);
	};
}
export function createInspection(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/inspection_request/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllInspectionList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_INSPECTION,
					[CREATE_INSPECTION]: response.data,
				});
			},
		);
	};
}
export function updateInspection(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/inspection_request/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllInspectionList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_INSPECTION,
					[UPDATE_INSPECTION]: response.data,
				});
			},
		);
	};
}
export function deleteInspection(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/inspection_request/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllInspectionList(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_INSPECTION,
					[DELETE_INSPECTION]: response.data,
				});
			},
		);
	};
}

export function addPlanRevision(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/directory/plan_revision_update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getSingleSheets(post?.plan_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: ADD_PLAN_REVISION,
					[ADD_PLAN_REVISION]: response.data,
				});
			},
		);
	};
}

export function updateFileName(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/file/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllFileDirectoriesWise(post?.project_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_EQUIPMENT,
					[UPDATE_EQUIPMENT]: response.data,
				});
			},
		);
	};
}

export function sharePlans(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/share/plans', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					if(typeof cb == "function"){
						cb(response?.data?.result?.file)
					}else{
						navigator.share({
							title: `Share`,
							text: `Share Plan`,
							url: response?.data?.result?.file,
						});
					}
					
					// dispatch(getAllProjects(post?.user_id))
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: SHARE_PLANS,
					[SHARE_PLANS]: response.data,
				});
			},
		);
	};
}
export function shareFiles(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/share/files', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					if(typeof cb == "function"){
						cb(response?.data?.result?.file)
					}else{
						navigator.share({
							title: `Files`,
							text: `Share Files`,
							url: response?.data?.result?.file,
						});
					}
					
					// dispatch(getAllProjects(post?.user_id))
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: SHARE_FILES,
					[SHARE_FILES]: response.data,
				});
			},
		);
	};
}

export function sharePhotos(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/share/photos', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					/* navigator.share({
						title: `Photos`,
						text: `Share Photos`,
						url: response?.data?.result?.file,
					}); */
					if(typeof cb == "function") cb(response?.data?.result?.file)
					// dispatch(getAllProjects(post?.user_id))
				} else {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}
export function getCount(id) {
	return (dispatch) => {
		return axiosGet({ url: '/project/dashboard/count/' + id }, (response) => {
			dispatch({
				type: GET_COUNT,
				[GET_COUNT]: response.data,
			});
		});
	};
}
export function getReportPermissionList(projectId, userId) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/report/permision/' + projectId + '/' + userId },
			(response) => {
				dispatch({
					type: GET_REPORT_PERMISSION_LIST,
					[GET_REPORT_PERMISSION_LIST]: response.data,
				});
			},
		);
	};
}
export function reportAction(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/project/report/permission/action', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getReportPermissionList(post?.project_id, post?.user_id));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: REPORT_PERMISSION_STATUS,
					[REPORT_PERMISSION_STATUS]: response.data,
				});
			},
		);
	};
}

export function projectLogoUpload(post, cb) {
	return (dispatch) => {
		return axiosPostFileUpload(
			{
				url: '/upload',
				reqBody: post,
				header: { 'Content-Type': 'multipart/form-data' },
			},
			(response) => {
				if (response.data?.success === true) {
					// successNotification(response.data?.message);
					cb(response.data?.result);
				} else {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}

export function getArchiveTaskTimeList(cb) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/static/archive_task_time_list' },
			(response) => {
				if (response.data && response.data.success) cb(response.data.result);
			},
		);
	};
}

export function getRFIList(project_id, cb) {
	return (dispatch) => {
		return axiosGet({ url: '/project/rfi/' + project_id }, (response) => {
			if(typeof cb == "function") cb(response?.data?.result);
			dispatch({
				type: GET_RFI_LIST,
				[GET_RFI_LIST]: response.data.result ? response.data.result : [],
			});
		});
	};
}

export function createRFIs(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/rfi/create', reqBody:postData}, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				if(typeof cb == "function") cb(response?.data);
			} else {
				errorNotification(response.data?.message);
				if(typeof cb == "function") cb(response?.data);
			}
		});
	};
}

export function updateRFIs(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/rfi/update', reqBody:postData}, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
				if(typeof cb == "function") cb(response?.data);
			} else {
				errorNotification(response.data?.message);
				if(typeof cb == "function") cb(response?.data);
			}
		});
	};
}

export function getRFIById(rfi_id, cb) {
	return (dispatch) => {
		return axiosGet({ url: '/project/rfi_by_id/' + rfi_id }, (response) => {
			if(typeof cb == "function") cb(response?.data);			
		});
	};
}

export function deleteRFI(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/rfi/delete', reqBody:postData }, (response) => {
			if(typeof cb == "function") cb(response?.data);			
		});
	};
}

export function getVendorsList(projectID, cb) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/project/vendor/list/' + projectID },
			(response) => {
				dispatch({
					type: GET_VENDOR_LIST,
					[GET_VENDOR_LIST]: response.data,
				});
				if(typeof cb == "function") cb(response?.data);
			},
		);
	};
}

export function addVendor(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/vendor/create', reqBody:postData }, (response) => {
			if(typeof cb == "function") cb(response?.data);			
		});
	};
}

export function updateVendor(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/vendor/update', reqBody:postData }, (response) => {
			if(typeof cb == "function") cb(response?.data);			
		});
	};
}

export function deleteVendor(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/vendor/delete', reqBody:postData }, (response) => {
			if (response.data?.success === true) {
				successNotification(response.data?.message);
			} else {
				errorNotification(response.data?.message);
			}
			if(typeof cb == "function") cb(response?.data);			
		});
	};
}

export function createWall(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/task/add_wall', reqBody:postData }, (response) => {
			if(typeof cb == "function") cb(response?.data);			
		});
	};
}

export function getWall(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/task/get_wall', reqBody:postData }, (response) => {
			dispatch({
				type: GET_WALL_LIST,
				[GET_WALL_LIST]: (response.data?.result) ? response.data?.result : [],
			});
			if(typeof cb == "function") cb(response?.data);			
		});
	};
}

export function deleteWall(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/task/delete_wall', reqBody:postData }, (response) => {
			if(typeof cb == "function") cb(response?.data);			
		});
	};
}

export function getStoreRoomList(projectId,cb) {
	return (dispatch) => {
		return axiosGet({ url: '/project/store_room/'+projectId }, (response) => {
			if(typeof cb == "function") cb(response?.data?.result);			
		});
	};
}

export function getMaterialsLogList(id, cb) {
	return (dispatch) => {
		return axiosGet({ url: '/project/material/log/' + id }, (response) => {
			if(typeof cb == "function") cb(response?.data?.result);			
		});
	};
}

export function labourAndEquipmentLogList(id, cb) {
	return (dispatch) => {
		return axiosGet({ url: '/project/labourAndequipment/log/' + id }, (response) => {
			if(typeof cb == "function") cb(response?.data?.result);			
		});
	};
}

export function generateDPR(postData, cb) {
	return (dispatch) => {
		return axiosPost({ url: '/project/task/download/dpr', reqBody:postData }, (response) => {
			if(typeof cb == "function") cb(response?.data?.result?.file)
		});
	};
}

export function loadChat(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/chat/load', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					if(typeof cb === "function"){
						cb(response.data.result);
					}
				} else {
					errorNotification(response.data?.message);
				}
				
			},
		);
	};
}