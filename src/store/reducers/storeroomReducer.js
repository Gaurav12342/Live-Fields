import { GET_ALL_MATERIAL_LIST, DELETE_MATERIAL, ADD_MATERIAL, UPDATE_MATERIAL, CREATE_STORE_ROOM, GET_STORE_ROOM, DELETE_STORE_ROOM, UPDATE_STORE_ROOM, GET_STORE_ROOM_FULL_DETAILS, GET_ORDER_DETAILS_BY_STORE_ROOM_ID, CREATE_UNIT, CREATE_STORE_ROOM_PO, GET_STORE_ROOM_LOG_ID_AND_DATE, GET_ALL_UNIT, GET_STORE_ROOM_REQUEST_LIST, ISSUE_MATERIAL_REQUEST, ADJUSTMENT_STORE_ROOM, GET_STORE_ROOM_ADJUSTMENT_REQUEST_LIST, CREATE_MATERIAL_INFO, GET_MATERIAL_LOG_LIST, GET_SINGLE_PO_DETAILS, UPDATE_STORE_ROOM_PO, GET_MATERIAL_LOG_BY_DATE, ADJUSTMENT_MATERIAL, CONSUMPTION_MATERIAL, REQUEST_MATERIAL, DELIVERD_STORE_ROOM_PO_ORDER, GET_MATERIAL_DETAILS_BY_ID, UPDATE_MATERIAL_INFO, SIGN_MATERIAL_LOG_REPORT, SIGN_STORE_ROOM_LOG, DELETE_MATERIAL_LOG, UPDATE_UNIT, GET_ALL_UNIT_BY_PROJECT_ID, DELETE_UNIT } from "../actions/actionType";

// import * as actionTypes from '../actions/actionType';
const initialState = {

}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case ADD_MATERIAL:
            return Object.assign({}, state, {
                [ADD_MATERIAL]: action[ADD_MATERIAL]
            })
        case UPDATE_MATERIAL:
            return Object.assign({}, state, {
                [UPDATE_MATERIAL]: action[UPDATE_MATERIAL]
            })
        case GET_ALL_MATERIAL_LIST:
            return Object.assign({}, state, {
                [GET_ALL_MATERIAL_LIST]: action[GET_ALL_MATERIAL_LIST]
            })
        case DELETE_MATERIAL:
            return Object.assign({}, state, {
                [DELETE_MATERIAL]: action[DELETE_MATERIAL]
            })
        case CREATE_STORE_ROOM:
            return Object.assign({}, state, {
                [CREATE_STORE_ROOM]: action[CREATE_STORE_ROOM]
            })
        case CREATE_STORE_ROOM_PO:
            return Object.assign({}, state, {
                [CREATE_STORE_ROOM_PO]: action[CREATE_STORE_ROOM_PO]
            })
        case UPDATE_STORE_ROOM_PO:
            return Object.assign({}, state, {
                [UPDATE_STORE_ROOM_PO]: action[UPDATE_STORE_ROOM_PO]
            })
        case GET_STORE_ROOM:
            return Object.assign({}, state, {
                [GET_STORE_ROOM]: action[GET_STORE_ROOM]
            })
        case UPDATE_STORE_ROOM:
            return Object.assign({}, state, {
                [UPDATE_STORE_ROOM]: action[UPDATE_STORE_ROOM]
            })
        case DELETE_STORE_ROOM:
            return Object.assign({}, state, {
                [DELETE_STORE_ROOM]: action[DELETE_STORE_ROOM]
            })
        case GET_STORE_ROOM_FULL_DETAILS:
            return Object.assign({}, state, {
                [GET_STORE_ROOM_FULL_DETAILS]: action[GET_STORE_ROOM_FULL_DETAILS]
            })
        case GET_ORDER_DETAILS_BY_STORE_ROOM_ID:
            return Object.assign({}, state, {
                [GET_ORDER_DETAILS_BY_STORE_ROOM_ID]: action[GET_ORDER_DETAILS_BY_STORE_ROOM_ID]
            })
        case GET_STORE_ROOM_LOG_ID_AND_DATE:
            return Object.assign({}, state, {
                [GET_STORE_ROOM_LOG_ID_AND_DATE]: action[GET_STORE_ROOM_LOG_ID_AND_DATE]
            })
        case CREATE_UNIT:
            return Object.assign({}, state, {
                [CREATE_UNIT]: action[CREATE_UNIT]
            })
        case UPDATE_UNIT:
            return Object.assign({}, state, {
                [UPDATE_UNIT]: action[UPDATE_UNIT]
            })
        case DELETE_UNIT:
            return Object.assign({}, state, {
                [DELETE_UNIT]: action[DELETE_UNIT]
            })
        case GET_ALL_UNIT:
            return Object.assign({}, state, {
                [GET_ALL_UNIT]: action[GET_ALL_UNIT]
            })
        case GET_ALL_UNIT_BY_PROJECT_ID:
            return Object.assign({}, state, {
                [GET_ALL_UNIT_BY_PROJECT_ID]: action[GET_ALL_UNIT_BY_PROJECT_ID]
            })
        case GET_STORE_ROOM_REQUEST_LIST:
            return Object.assign({}, state, {
                [GET_STORE_ROOM_REQUEST_LIST]: action[GET_STORE_ROOM_REQUEST_LIST]
            })
        case ISSUE_MATERIAL_REQUEST:
            return Object.assign({}, state, {
                [ISSUE_MATERIAL_REQUEST]: action[ISSUE_MATERIAL_REQUEST]
            })
        case ADJUSTMENT_STORE_ROOM:
            return Object.assign({}, state, {
                [ADJUSTMENT_STORE_ROOM]: action[ADJUSTMENT_STORE_ROOM]
            })
        case GET_STORE_ROOM_ADJUSTMENT_REQUEST_LIST:
            return Object.assign({}, state, {
                [GET_STORE_ROOM_ADJUSTMENT_REQUEST_LIST]: action[GET_STORE_ROOM_ADJUSTMENT_REQUEST_LIST]
            })
        case CREATE_MATERIAL_INFO:
            return Object.assign({}, state, {
                [CREATE_MATERIAL_INFO]: action[CREATE_MATERIAL_INFO]
            })
        case UPDATE_MATERIAL_INFO:
            return Object.assign({}, state, {
                [UPDATE_MATERIAL_INFO]: action[UPDATE_MATERIAL_INFO]
            })
        case GET_MATERIAL_LOG_LIST:
            return Object.assign({}, state, {
                [GET_MATERIAL_LOG_LIST]: action[GET_MATERIAL_LOG_LIST]
            })
        case DELETE_MATERIAL_LOG:
            return Object.assign({}, state, {
                [DELETE_MATERIAL_LOG]: action[DELETE_MATERIAL_LOG]
            })
        case GET_MATERIAL_DETAILS_BY_ID:
            return Object.assign({}, state, {
                [GET_MATERIAL_DETAILS_BY_ID]: action[GET_MATERIAL_DETAILS_BY_ID]
            })
        case GET_SINGLE_PO_DETAILS:
            return Object.assign({}, state, {
                [GET_SINGLE_PO_DETAILS]: action[GET_SINGLE_PO_DETAILS]
            })
        case DELIVERD_STORE_ROOM_PO_ORDER:
            return Object.assign({}, state, {
                [DELIVERD_STORE_ROOM_PO_ORDER]: action[DELIVERD_STORE_ROOM_PO_ORDER]
            })
        case GET_MATERIAL_LOG_BY_DATE:
            return Object.assign({}, state, {
                [GET_MATERIAL_LOG_BY_DATE]: action[GET_MATERIAL_LOG_BY_DATE]
            })
        case SIGN_MATERIAL_LOG_REPORT:
            return Object.assign({}, state, {
                [SIGN_MATERIAL_LOG_REPORT]: action[SIGN_MATERIAL_LOG_REPORT]
            })
        case SIGN_STORE_ROOM_LOG:
            return Object.assign({}, state, {
                [SIGN_STORE_ROOM_LOG]: action[SIGN_STORE_ROOM_LOG]
            })
        case CONSUMPTION_MATERIAL:
            return Object.assign({}, state, {
                [CONSUMPTION_MATERIAL]: action[CONSUMPTION_MATERIAL]
            })
        case REQUEST_MATERIAL:
            return Object.assign({}, state, {
                [REQUEST_MATERIAL]: action[REQUEST_MATERIAL]
            })
        case ADJUSTMENT_MATERIAL:
            return Object.assign({}, state, {
                [ADJUSTMENT_MATERIAL]: action[ADJUSTMENT_MATERIAL]
            })

        default:
            return state;
    }
}

export default reducer;