// import { CREATE_TASK } from "../actions/actionType";
import * as actionTypes from '../actions/actionType';

const initialState = {
    task_comment: {},
    create_task: {},
    add_related_task: {},
    update_task: {},
    create_task_board: {},
    get_task_board_list: {},
    create_task_category: {},
    get_category_list: {},
    get_task_list_by_board: {},
    add_attachment: {},
    get_task_attachment: {},
    task_filter: {},
    create_task_checklist: {},
    delete_task_checklist: {},
    update_task_checklist: {},
    [actionTypes.GET_WALL_LIST]: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_TASK:
            return Object.assign({}, state, {
                create_task: action.create_task
            })
        case actionTypes.CREATE_TASK_CHECKLIST:
            return Object.assign({}, state, {
                create_task_checklist: action.create_task_checklist
            })
        case actionTypes.DELETE_TASK:
            return Object.assign({}, state, {
                delete_task: action.delete_task
            })
        case actionTypes.ADD_RELATED_TASK:
            return Object.assign({}, state, {
                add_related_task: action.add_related_task
            })
        case actionTypes.GET_TASK_CHECKLIST:
            return Object.assign({}, state, {
                [actionTypes.GET_TASK_CHECKLIST]: action[actionTypes.GET_TASK_CHECKLIST]
            })
        case actionTypes.DELETE_TASK_CHECKLIST:
            return Object.assign({}, state, {
                delete_task_checklist: action.delete_task_checklist
            })
        case actionTypes.UPDATE_TASK_CHECKLIST:
            return Object.assign({}, state, {
                update_task_checklist: action.update_task_checklist
            })
        case actionTypes.USE_TEMPLATE:
            return Object.assign({}, state, {
                use_template: action.use_template
            })
        case actionTypes.TASK_COMMENT:
            return Object.assign({}, state, {
                task_comment: action.task_comment
            })
        case actionTypes.GET_ALL_RELATED_TASK:
            return Object.assign({}, state, {
                [actionTypes.GET_ALL_RELATED_TASK]: action[actionTypes.GET_ALL_RELATED_TASK]
            })
        case actionTypes.GET_ALL_TASK_BOARD_LIST:
            return Object.assign({}, state, {
                [actionTypes.GET_ALL_TASK_BOARD_LIST]: action[actionTypes.GET_ALL_TASK_BOARD_LIST]
            })
        case actionTypes.UPDATE_TASK:
            return Object.assign({}, state, {
                update_task: action.update_task
            })

        case actionTypes.CREATE_TASK_BOARD:
            return Object.assign({}, state, {
                create_task_board: action.create_task_board
            })

        case actionTypes.GET_TASK_BOARD_LIST:
            return Object.assign({}, state, {
                get_task_board_list: action.get_task_board_list
            })

        case actionTypes.CREATE_TASK_CATEGORY:
            return Object.assign({}, state, {
                create_task_category: action.create_task_category
            })
        case actionTypes.UPDATE_TASK_CATEGORY:
            return Object.assign({}, state, {
                update_task_category: action.update_task_category
            })
        case actionTypes.GET_CATEGORY_LIST:
            return Object.assign({}, state, {
                [actionTypes.GET_CATEGORY_LIST]: action[actionTypes.GET_CATEGORY_LIST]
            })
        case actionTypes.DELETE_CATEGORY:
            return Object.assign({}, state, {
                [actionTypes.DELETE_CATEGORY]: action[actionTypes.DELETE_CATEGORY]
            })

        case actionTypes.GET_LOCATION_LIST:
            return Object.assign({}, state, {
                [actionTypes.GET_LOCATION_LIST]: action[actionTypes.GET_LOCATION_LIST]
            })
        case actionTypes.UPDATE_LOCATION:
            return Object.assign({}, state, {
                [actionTypes.UPDATE_LOCATION]: action[actionTypes.UPDATE_LOCATION]
            })
        case actionTypes.DELETE_LOCATION:
            return Object.assign({}, state, {
                [actionTypes.DELETE_LOCATION]: action[actionTypes.DELETE_LOCATION]
            })

        case actionTypes.GET_TASK_LIST_BY_BOARD:
            return Object.assign({}, state, {
                [actionTypes.GET_TASK_LIST_BY_BOARD]: action[actionTypes.GET_TASK_LIST_BY_BOARD]
            })

        case actionTypes.ADD_ATTACHMENT:
            return Object.assign({}, state, {
                add_attachment: action.add_attachment
            })

        case actionTypes.GET_TASK_ATTACHMENT:
            return Object.assign({}, state, {
                get_task_attachment: action.get_task_attachment
            })
        case actionTypes.GET_TASK_LIST_BY_PROJRCT_ID:
            return Object.assign({}, state, {
                [actionTypes.GET_TASK_LIST_BY_PROJRCT_ID]: action[actionTypes.GET_TASK_LIST_BY_PROJRCT_ID]
            })
        case actionTypes.GET_SINGLE_TASK:
            return Object.assign({}, state, {
                [actionTypes.GET_SINGLE_TASK]: action[actionTypes.GET_SINGLE_TASK]
            })
        case actionTypes.GET_ALL_TASK_KANBAN:
            return Object.assign({}, state, {
                [actionTypes.GET_ALL_TASK_KANBAN]: action[actionTypes.GET_ALL_TASK_KANBAN]
            })
        case actionTypes.TASK_FILTER:
            return Object.assign({}, state, {
                [actionTypes.TASK_FILTER]: action[actionTypes.TASK_FILTER]
            })
        case actionTypes.CREATE_LOCATION:
            return Object.assign({}, state, {
                [actionTypes.CREATE_LOCATION]: action[actionTypes.CREATE_LOCATION]
            })
        case actionTypes.COPY_TASK:
            return Object.assign({}, state, {
                [actionTypes.COPY_TASK]: action[actionTypes.COPY_TASK]
            });

        case actionTypes.GET_WALL_LIST: 
            return Object.assign({}, state, {
                [actionTypes.GET_WALL_LIST]: action[actionTypes.GET_WALL_LIST]
            });
        default:
            return state;
    }
}

export default reducer;