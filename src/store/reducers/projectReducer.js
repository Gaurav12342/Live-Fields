import { ARCHIVE_PROJECT, CREATE_PROJECT, CREATE_TEMPLATE, CREATE_CHECKLIST, DELETE_PROJECT, GET_ALL_FILE_DIRECTORIES, GET_ALL_FILE_LIST_DIRECTORIES_WISE, GET_ALL_PROJECT, GET_ALL_ROLE, GET_ALL_ROLE_WISE_PEOPLE, GET_ALL_SHEETS, GET_ALL_TEMPLATE, GET_ALL_TEMPLATE_CHECKLIST, GET_PROJECT_DETAILS, INVITE_USER, LEAVE_PROJECT, REMOVE_USER, UPDATE_PROJECT_SETTING, UPDATE_ROLE, DELETE_TEMPLATE, DELETE_CHECKLIST, UPDATE_PROJECT_TEMPLATE, GET_ALL_PHOTOS, CREATE_DIRECTORY, UPDATE_DIRECTORY, DELETE_PLAN, CREATE_PLAN, UPDATE_PROJECT_TEMPLATE_CHECKLIST, GET_ALL_TAGS, CREATE_TAGS, MOVE_PLAN_DIRECTORY, DELETE_DIRECTORY, DELETE_FILE, CREATE_USER_ROLE, GET_USER_ROLE_BY_ID, UPDATE_USER_ROLE_BY_ID, DELETE_USER_ROLE_BY_ID, CREATE_FILE, GET_ALL_MEETING_LIST, GET_ALL_SUBPOINT_LIST, DELETE_MEETING, CREATE_MEETING, UPDATE_MEETING, CREATE_POINT, ADD_PROJECT_PHOTOS, DELETE_PROJECT_PHOTOS, UPDATE_PROJECT_PHOTO, INVITE_MEETING_USER, GET_ALL_LABOUR_LIST, CREATE_LABOUR, DELETE_LABOUR, UPDATE_LABOUR, GET_ALL_EQUIPMENT_LIST, CREATE_EQUIPMENT, UPDATE_EQUIPMENT, DELETE_EQUIPMENT, GET_ALL_TIMESHEET_LIST, CREATE_TIMESHEET, UPDATE_TIMESHEET, DELETE_TIMESHEET, GET_ALL_INSPECTION_LIST, CREATE_INSPECTION, UPDATE_INSPECTION, DELETE_INSPECTION, DELETE_MEETING_POINT, UPDATE_MEETING_POINT, CHANGE_FILE_DIRECTORY, GET_ALL_ACCESS_KEYS, GET_RELATED_SHEET, ADD_RELATED_SHEET, CREATE_PLAN_COMMENT, GET_ALL_SHEETS_COMMENT, GET_SHEET_DETAILS_BY_ID, GET_ALL_ROLE_ACCESS_KEYS, ADD_RELATED_FILES, GET_RELATED_FILES, ADD_PLAN_REVISION, GET_ALL_SHEETS_PHOTOS, ADD_SHEET_PHOTOS, UPDATE_FILE_NAME, GET_LABOUR_LOG_BY_PROJECT_ID, CREATE_LABOUR_LOG, GET_ALL_EQUIPMENT_LOG_LIST_BY_ID_AND_DATE, CREATE_EQUIPMENT_LOG, UPDATE_EQUIPMENT_LOG, UPDATE_LABOUR_LOG, DELETE_LABOUR_LOG, SIGN_LABOUR_AND_EQUIPMENT_LOG, SHARE_PLANS, SHARE_FILES, GET_RECENT_SHEETS, UPDATE_TAGS, DELETE_TAGS, CREATE_SUB_POINT, UPDATE_MEETING_SUB_POINT, DELETE_MEETING_SUB_POINT, DELETE_SHEET_RELATED_PHOTOS, GET_COUNT, GET_REPORT_PERMISSION_LIST, REPORT_PERMISSION_STATUS, ADD_MULTIPLE_PROJECT_PHOTOS, GET_VENDOR_LIST } from "../actions/actionType";

// import * as actionTypes from '../actions/actionType';
const initialState = {
    create_project: {},
    update_project: {},
    create_project_board: {},
    [GET_ALL_PROJECT]: [],
    [GET_ALL_ROLE]: [],
    [GET_ALL_ROLE_WISE_PEOPLE]: [],
    [GET_ALL_FILE_DIRECTORIES]: [],
    [GET_ALL_FILE_LIST_DIRECTORIES_WISE]: [],
    [CREATE_PROJECT]: [],
    [GET_PROJECT_DETAILS]: [],
    [UPDATE_PROJECT_SETTING]: [],
    [DELETE_PROJECT]: [],
    [LEAVE_PROJECT]: [],
    [UPDATE_PROJECT_SETTING]: [],
    [ARCHIVE_PROJECT]: [],
    [UPDATE_ROLE]: [],
    [INVITE_USER]: [],
    [REMOVE_USER]: [],
    [GET_ALL_TEMPLATE]: [],
    [GET_ALL_TEMPLATE_CHECKLIST]: [],
    [CREATE_TEMPLATE]: [],
    [CREATE_CHECKLIST]: [],
    [DELETE_TEMPLATE]: [],
    [DELETE_CHECKLIST]: [],
    [UPDATE_PROJECT_TEMPLATE]: [],
    [GET_ALL_PHOTOS]: [],
    [CREATE_DIRECTORY]: [],
    [UPDATE_DIRECTORY]: [],
    [DELETE_PLAN]: [],
    [CREATE_PLAN]: [],
    [UPDATE_PROJECT_TEMPLATE_CHECKLIST]: [],
    [MOVE_PLAN_DIRECTORY]: [],
    [GET_ALL_ROLE_ACCESS_KEYS]: [],
    [GET_RECENT_SHEETS]: [],
    create_project_category: {},
    get_category_list: {},
    get_project_list_by_board: {},
    add_attachment: {},
    get_project_attachment: {},
    [GET_VENDOR_LIST]: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_ALL_PROJECT:
            return Object.assign({}, state, {
                [GET_ALL_PROJECT]: action[GET_ALL_PROJECT]
            })
        case GET_ALL_ROLE:
            return Object.assign({}, state, {
                [GET_ALL_ROLE]: action[GET_ALL_ROLE]
            })
        case GET_ALL_ROLE_WISE_PEOPLE:
            return Object.assign({}, state, {
                [GET_ALL_ROLE_WISE_PEOPLE]: action[GET_ALL_ROLE_WISE_PEOPLE]
            })
        case GET_ALL_FILE_DIRECTORIES:
            return Object.assign({}, state, {
                [GET_ALL_FILE_DIRECTORIES]: action[GET_ALL_FILE_DIRECTORIES]
            })
        case GET_ALL_FILE_LIST_DIRECTORIES_WISE:
            return Object.assign({}, state, {
                [GET_ALL_FILE_LIST_DIRECTORIES_WISE]: action[GET_ALL_FILE_LIST_DIRECTORIES_WISE]
            })
        case CREATE_PROJECT:
            return Object.assign({}, state, {
                [CREATE_PROJECT]: action[CREATE_PROJECT]
            })
        case GET_PROJECT_DETAILS:
            return Object.assign({}, state, {
                [GET_PROJECT_DETAILS]: action[GET_PROJECT_DETAILS]
            })
        case UPDATE_PROJECT_SETTING:
            return Object.assign({}, state, {
                [UPDATE_PROJECT_SETTING]: action[UPDATE_PROJECT_SETTING]
            })
        case DELETE_PROJECT:
            return Object.assign({}, state, {
                [DELETE_PROJECT]: action[DELETE_PROJECT]
            })
        case LEAVE_PROJECT:
            return Object.assign({}, state, {
                [LEAVE_PROJECT]: action[LEAVE_PROJECT]
            })
        case ARCHIVE_PROJECT:
            return Object.assign({}, state, {
                [ARCHIVE_PROJECT]: action[ARCHIVE_PROJECT]
            })
        case GET_ALL_SHEETS:
            return Object.assign({}, state, {
                [GET_ALL_SHEETS]: action[GET_ALL_SHEETS]
            })
        case GET_RECENT_SHEETS:
            return Object.assign({}, state, {
                [GET_RECENT_SHEETS]: action[GET_RECENT_SHEETS]
            })
        case GET_SHEET_DETAILS_BY_ID:
            return Object.assign({}, state, {
                [GET_SHEET_DETAILS_BY_ID]: action[GET_SHEET_DETAILS_BY_ID]
            })
        case CREATE_PLAN_COMMENT:
            return Object.assign({}, state, {
                [CREATE_PLAN_COMMENT]: action[CREATE_PLAN_COMMENT]
            })
        case GET_ALL_SHEETS_COMMENT:
            return Object.assign({}, state, {
                [GET_ALL_SHEETS_COMMENT]: action[GET_ALL_SHEETS_COMMENT]
            })
        case ADD_RELATED_SHEET:
            return Object.assign({}, state, {
                [ADD_RELATED_SHEET]: action[ADD_RELATED_SHEET]
            })
        case ADD_RELATED_FILES:
            return Object.assign({}, state, {
                [ADD_RELATED_FILES]: action[ADD_RELATED_FILES]
            })
        case GET_RELATED_SHEET:
            return Object.assign({}, state, {
                [GET_RELATED_SHEET]: action[GET_RELATED_SHEET]
            })
        case ADD_PLAN_REVISION:
            return Object.assign({}, state, {
                [ADD_PLAN_REVISION]: action[ADD_PLAN_REVISION]
            })
        case GET_RELATED_FILES:
            return Object.assign({}, state, {
                [GET_RELATED_FILES]: action[GET_RELATED_FILES]
            })
        case UPDATE_ROLE:
            return Object.assign({}, state, {
                [UPDATE_ROLE]: action[UPDATE_ROLE]
            })
        case INVITE_USER:
            return Object.assign({}, state, {
                [INVITE_USER]: action[INVITE_USER]
            })
        case REMOVE_USER:
            return Object.assign({}, state, {
                [REMOVE_USER]: action[REMOVE_USER]
            })
        case GET_ALL_TEMPLATE:
            return Object.assign({}, state, {
                [GET_ALL_TEMPLATE]: action[GET_ALL_TEMPLATE]
            })
        case GET_ALL_TEMPLATE_CHECKLIST:
            return Object.assign({}, state, {
                [GET_ALL_TEMPLATE_CHECKLIST]: action[GET_ALL_TEMPLATE_CHECKLIST]
            })
        case CREATE_TEMPLATE:
            return Object.assign({}, state, {
                [CREATE_TEMPLATE]: action[CREATE_TEMPLATE]
            })
        case CREATE_CHECKLIST:
            return Object.assign({}, state, {
                [CREATE_CHECKLIST]: action[CREATE_CHECKLIST]
            })
        case DELETE_TEMPLATE:
            return Object.assign({}, state, {
                [DELETE_TEMPLATE]: action[DELETE_TEMPLATE]
            })
        case DELETE_CHECKLIST:
            return Object.assign({}, state, {
                [DELETE_CHECKLIST]: action[DELETE_CHECKLIST]
            })
        case UPDATE_PROJECT_TEMPLATE:
            return Object.assign({}, state, {
                [UPDATE_PROJECT_TEMPLATE]: action[UPDATE_PROJECT_TEMPLATE]
            })
        case ADD_PROJECT_PHOTOS:
            return Object.assign({}, state, {
                [ADD_PROJECT_PHOTOS]: action[ADD_PROJECT_PHOTOS]
            })
        case ADD_MULTIPLE_PROJECT_PHOTOS:
            return Object.assign({}, state, {
                [ADD_MULTIPLE_PROJECT_PHOTOS]: action[ADD_MULTIPLE_PROJECT_PHOTOS]
            })
        case UPDATE_PROJECT_PHOTO:
            return Object.assign({}, state, {
                [UPDATE_PROJECT_PHOTO]: action[UPDATE_PROJECT_PHOTO]
            })
        case GET_ALL_PHOTOS:
            return Object.assign({}, state, {
                [GET_ALL_PHOTOS]: action[GET_ALL_PHOTOS]
            })
        case DELETE_PROJECT_PHOTOS:
            return Object.assign({}, state, {
                [DELETE_PROJECT_PHOTOS]: action[DELETE_PROJECT_PHOTOS]
            })
        case CREATE_DIRECTORY:
            return Object.assign({}, state, {
                [CREATE_DIRECTORY]: action[CREATE_DIRECTORY]
            })
        case CREATE_FILE:
            return Object.assign({}, state, {
                [CREATE_FILE]: action[CREATE_FILE]
            })
        case DELETE_FILE:
            return Object.assign({}, state, {
                [DELETE_FILE]: action[DELETE_FILE]
            })
        case UPDATE_DIRECTORY:
            return Object.assign({}, state, {
                [UPDATE_DIRECTORY]: action[UPDATE_DIRECTORY]
            })
        case DELETE_DIRECTORY:
            return Object.assign({}, state, {
                [DELETE_DIRECTORY]: action[DELETE_DIRECTORY]
            })
        case DELETE_PLAN:
            return Object.assign({}, state, {
                [DELETE_PLAN]: action[DELETE_PLAN]
            })
        case CREATE_PLAN:
            return Object.assign({}, state, {
                [CREATE_PLAN]: action[CREATE_PLAN]
            })
        case GET_ALL_ACCESS_KEYS:
            return Object.assign({}, state, {
                [GET_ALL_ACCESS_KEYS]: action[GET_ALL_ACCESS_KEYS]
            })
        case GET_ALL_ROLE_ACCESS_KEYS:
            return Object.assign({}, state, {
                [GET_ALL_ROLE_ACCESS_KEYS]: action[GET_ALL_ROLE_ACCESS_KEYS]
            })
        case ADD_SHEET_PHOTOS:
            return Object.assign({}, state, {
                [ADD_SHEET_PHOTOS]: action[ADD_SHEET_PHOTOS]
            })
        case GET_ALL_SHEETS_PHOTOS:
            return Object.assign({}, state, {
                [GET_ALL_SHEETS_PHOTOS]: action[GET_ALL_SHEETS_PHOTOS]
            })
        case CREATE_USER_ROLE:
            return Object.assign({}, state, {
                [CREATE_USER_ROLE]: action[CREATE_USER_ROLE]
            })
        case GET_USER_ROLE_BY_ID:
            return Object.assign({}, state, {
                [GET_USER_ROLE_BY_ID]: action[GET_USER_ROLE_BY_ID]
            })
        case UPDATE_USER_ROLE_BY_ID:
            return Object.assign({}, state, {
                [UPDATE_USER_ROLE_BY_ID]: action[UPDATE_USER_ROLE_BY_ID]
            })
        case DELETE_USER_ROLE_BY_ID:
            return Object.assign({}, state, {
                [DELETE_USER_ROLE_BY_ID]: action[DELETE_USER_ROLE_BY_ID]
            })
        case UPDATE_PROJECT_TEMPLATE_CHECKLIST:
            return Object.assign({}, state, {
                [UPDATE_PROJECT_TEMPLATE_CHECKLIST]: action[UPDATE_PROJECT_TEMPLATE_CHECKLIST]
            })
        case MOVE_PLAN_DIRECTORY:
            return Object.assign({}, state, {
                [MOVE_PLAN_DIRECTORY]: action[MOVE_PLAN_DIRECTORY]
            })
        case CHANGE_FILE_DIRECTORY:
            return Object.assign({}, state, {
                [CHANGE_FILE_DIRECTORY]: action[CHANGE_FILE_DIRECTORY]
            })
        case CREATE_TAGS:
            return Object.assign({}, state, {
                [CREATE_TAGS]: action[CREATE_TAGS]
            })
        case UPDATE_TAGS:
            return Object.assign({}, state, {
                [UPDATE_TAGS]: action[UPDATE_TAGS]
            })
        case GET_ALL_TAGS:
            return Object.assign({}, state, {
                [GET_ALL_TAGS]: action[GET_ALL_TAGS]
            })
        case DELETE_TAGS:
            return Object.assign({}, state, {
                [DELETE_TAGS]: action[DELETE_TAGS]
            })
        case CREATE_MEETING:
            return Object.assign({}, state, {
                [CREATE_MEETING]: action[CREATE_MEETING]
            })
        case CREATE_POINT:
            return Object.assign({}, state, {
                [CREATE_POINT]: action[CREATE_POINT]
            })
        case UPDATE_MEETING:
            return Object.assign({}, state, {
                [UPDATE_MEETING]: action[UPDATE_MEETING]
            })
        case DELETE_MEETING:
            return Object.assign({}, state, {
                [DELETE_MEETING]: action[DELETE_MEETING]
            })
        case GET_ALL_MEETING_LIST:
            return Object.assign({}, state, {
                [GET_ALL_MEETING_LIST]: action[GET_ALL_MEETING_LIST]
            })
        case GET_ALL_SUBPOINT_LIST:
            return Object.assign({}, state, {
                [GET_ALL_SUBPOINT_LIST]: action[GET_ALL_SUBPOINT_LIST]
            })
        case CREATE_SUB_POINT:
            return Object.assign({}, state, {
                [CREATE_SUB_POINT]: action[CREATE_SUB_POINT]
            })
        case UPDATE_MEETING_SUB_POINT:
            return Object.assign({}, state, {
                [UPDATE_MEETING_SUB_POINT]: action[UPDATE_MEETING_SUB_POINT]
            })
        case DELETE_MEETING_SUB_POINT:
            return Object.assign({}, state, {
                [DELETE_MEETING_SUB_POINT]: action[DELETE_MEETING_SUB_POINT]
            })
        case DELETE_MEETING_POINT:
            return Object.assign({}, state, {
                [DELETE_MEETING_POINT]: action[DELETE_MEETING_POINT]
            })
        case UPDATE_MEETING_POINT:
            return Object.assign({}, state, {
                [UPDATE_MEETING_POINT]: action[UPDATE_MEETING_POINT]
            })
        case CREATE_LABOUR:
            return Object.assign({}, state, {
                [CREATE_LABOUR]: action[CREATE_LABOUR]
            })
        case DELETE_SHEET_RELATED_PHOTOS:
            return Object.assign({}, state, {
                [DELETE_SHEET_RELATED_PHOTOS]: action[DELETE_SHEET_RELATED_PHOTOS]
            })
        case CREATE_LABOUR_LOG:
            return Object.assign({}, state, {
                [CREATE_LABOUR_LOG]: action[CREATE_LABOUR_LOG]
            })
        case GET_ALL_EQUIPMENT_LOG_LIST_BY_ID_AND_DATE:
            return Object.assign({}, state, {
                [GET_ALL_EQUIPMENT_LOG_LIST_BY_ID_AND_DATE]: action[GET_ALL_EQUIPMENT_LOG_LIST_BY_ID_AND_DATE]
            })
        case GET_ALL_LABOUR_LIST:
            return Object.assign({}, state, {
                [GET_ALL_LABOUR_LIST]: action[GET_ALL_LABOUR_LIST]
            })
        case GET_LABOUR_LOG_BY_PROJECT_ID:
            return Object.assign({}, state, {
                [GET_LABOUR_LOG_BY_PROJECT_ID]: action[GET_LABOUR_LOG_BY_PROJECT_ID]
            })
        case SIGN_LABOUR_AND_EQUIPMENT_LOG:
            return Object.assign({}, state, {
                [SIGN_LABOUR_AND_EQUIPMENT_LOG]: action[SIGN_LABOUR_AND_EQUIPMENT_LOG]
            })

        case GET_ALL_EQUIPMENT_LIST:
            return Object.assign({}, state, {
                [GET_ALL_EQUIPMENT_LIST]: action[GET_ALL_EQUIPMENT_LIST]
            })
        case CREATE_EQUIPMENT:
            return Object.assign({}, state, {
                [CREATE_EQUIPMENT]: action[CREATE_EQUIPMENT]
            })
        case CREATE_EQUIPMENT_LOG:
            return Object.assign({}, state, {
                [CREATE_EQUIPMENT_LOG]: action[CREATE_EQUIPMENT_LOG]
            })
        case UPDATE_EQUIPMENT_LOG:
            return Object.assign({}, state, {
                [UPDATE_EQUIPMENT_LOG]: action[UPDATE_EQUIPMENT_LOG]
            })
        case UPDATE_EQUIPMENT:
            return Object.assign({}, state, {
                [UPDATE_EQUIPMENT]: action[UPDATE_EQUIPMENT]
            })
        case DELETE_EQUIPMENT:
            return Object.assign({}, state, {
                [DELETE_EQUIPMENT]: action[DELETE_EQUIPMENT]
            })
        case DELETE_LABOUR:
            return Object.assign({}, state, {
                [DELETE_LABOUR]: action[DELETE_LABOUR]
            })
        case DELETE_LABOUR_LOG:
            return Object.assign({}, state, {
                [DELETE_LABOUR_LOG]: action[DELETE_LABOUR_LOG]
            })
        case UPDATE_LABOUR:
            return Object.assign({}, state, {
                [UPDATE_LABOUR]: action[UPDATE_LABOUR]
            })
        case INVITE_MEETING_USER:
            return Object.assign({}, state, {
                [INVITE_MEETING_USER]: action[INVITE_MEETING_USER]
            })
        case GET_ALL_TIMESHEET_LIST:
            return Object.assign({}, state, {
                [GET_ALL_TIMESHEET_LIST]: action[GET_ALL_TIMESHEET_LIST]
            })
        case CREATE_TIMESHEET:
            return Object.assign({}, state, {
                [CREATE_TIMESHEET]: action[CREATE_TIMESHEET]
            })
        case UPDATE_TIMESHEET:
            return Object.assign({}, state, {
                [UPDATE_TIMESHEET]: action[UPDATE_TIMESHEET]
            })
        case DELETE_TIMESHEET:
            return Object.assign({}, state, {
                [DELETE_TIMESHEET]: action[DELETE_TIMESHEET]
            })
        case GET_ALL_INSPECTION_LIST:
            return Object.assign({}, state, {
                [GET_ALL_INSPECTION_LIST]: action[GET_ALL_INSPECTION_LIST]
            })
        case CREATE_INSPECTION:
            return Object.assign({}, state, {
                [CREATE_INSPECTION]: action[CREATE_INSPECTION]
            })
        case UPDATE_LABOUR_LOG:
            return Object.assign({}, state, {
                [UPDATE_LABOUR_LOG]: action[UPDATE_LABOUR_LOG]
            })
        case UPDATE_INSPECTION:
            return Object.assign({}, state, {
                [UPDATE_INSPECTION]: action[UPDATE_INSPECTION]
            })
        case DELETE_INSPECTION:
            return Object.assign({}, state, {
                [DELETE_INSPECTION]: action[DELETE_INSPECTION]
            })
        case UPDATE_FILE_NAME:
            return Object.assign({}, state, {
                [UPDATE_FILE_NAME]: action[UPDATE_FILE_NAME]
            })
        case SHARE_PLANS:
            return Object.assign({}, state, {
                [SHARE_PLANS]: action[SHARE_PLANS]
            })
        case SHARE_FILES:
            return Object.assign({}, state, {
                [SHARE_FILES]: action[SHARE_FILES]
            })
        case GET_COUNT:
            return Object.assign({}, state, {
                [GET_COUNT]: action[GET_COUNT]
            })
            
        case GET_REPORT_PERMISSION_LIST:
            return Object.assign({}, state, {
                [GET_REPORT_PERMISSION_LIST]: action[GET_REPORT_PERMISSION_LIST]
            })

        case REPORT_PERMISSION_STATUS:
            return Object.assign({}, state, {
                [REPORT_PERMISSION_STATUS]: action[REPORT_PERMISSION_STATUS]
            })

        case GET_VENDOR_LIST:
            return Object.assign({}, state, {
                [GET_VENDOR_LIST]: action[GET_VENDOR_LIST]
            })

        // case actionTypes.CREATE_PROJECT_CATEGORY:
        // return Object.assign({},state,{
        //     create_project_category : action.create_project_category
        // })

        // case actionTypes.GET_CATEGORY_LIST:
        // return Object.assign({},state,{
        //     get_category_list : action.get_category_list
        // })

        // case actionTypes.GET_PROJECT_LIST_BY_BOARD:
        // return Object.assign({},state,{
        //     get_project_list_by_board : action.get_project_list_by_board
        // })

        // case actionTypes.ADD_ATTACHMENT:
        // return Object.assign({},state,{
        //     add_attachment : action.add_attachment
        // })

        // case actionTypes.GET_PROJECT_ATTACHMENT:
        // return Object.assign({},state,{
        //     get_project_attachment : action.get_project_attachment
        // })

        default:
            return state;
    }
}

export default reducer;