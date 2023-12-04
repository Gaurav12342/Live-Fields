import { GET_SURVEY_REPORT, DELETE_SURVEY_REPORT, GET_SURVEY_REPORT_BY_SURVEY_ID, GET_SURVEY_REPORT_LIST_BY_SURVEY_ID, SIGN_SURVEY_REPORT, CREATE_SURVEY_REPORT, GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID, CREATE_LABOUR_AND_EQUIPMENT_LOG, UNLOCK_REPORT, UPDATE_SURVEY_REPORT, GET_QUESTIONS_LIST_BY_REQUEST_ID, UPDATE_LABOUR_AND_EQUIPMENT_LOG, GET_SURVEY_REPORT_BY_ID, GET_SURVEY_REQUEST_DETAILS_BY_ID, GET_LABOUR_AND_EQUIPMENT_DETAILS, DELETE_LABOUR_AND_EQUIPMENT_LOG } from "../actions/actionType";

// import * as actionTypes from '../actions/actionType';
const initialState = {

}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_SURVEY_REPORT:
            return Object.assign({}, state, {
                [GET_SURVEY_REPORT]: action[GET_SURVEY_REPORT]
            })
        case GET_SURVEY_REQUEST_DETAILS_BY_ID:
            return Object.assign({}, state, {
                [GET_SURVEY_REQUEST_DETAILS_BY_ID]: action[GET_SURVEY_REQUEST_DETAILS_BY_ID]
            })
        case GET_LABOUR_AND_EQUIPMENT_DETAILS:
            return Object.assign({}, state, {
                [GET_LABOUR_AND_EQUIPMENT_DETAILS]: action[GET_LABOUR_AND_EQUIPMENT_DETAILS]
            })
        case DELETE_SURVEY_REPORT:
            return Object.assign({}, state, {
                [DELETE_SURVEY_REPORT]: action[DELETE_SURVEY_REPORT]
            })
        case GET_SURVEY_REPORT_BY_SURVEY_ID:
            return Object.assign({}, state, {
                [GET_SURVEY_REPORT_BY_SURVEY_ID]: action[GET_SURVEY_REPORT_BY_SURVEY_ID]
            })
        case GET_SURVEY_REPORT_LIST_BY_SURVEY_ID:
            return Object.assign({}, state, {
                [GET_SURVEY_REPORT_LIST_BY_SURVEY_ID]: action[GET_SURVEY_REPORT_LIST_BY_SURVEY_ID]
            })
        case SIGN_SURVEY_REPORT:
            return Object.assign({}, state, {
                [SIGN_SURVEY_REPORT]: action[SIGN_SURVEY_REPORT]
            })
        case CREATE_SURVEY_REPORT:
            return Object.assign({}, state, {
                [CREATE_SURVEY_REPORT]: action[CREATE_SURVEY_REPORT]
            })
        case UPDATE_SURVEY_REPORT:
            return Object.assign({}, state, {
                [UPDATE_SURVEY_REPORT]: action[UPDATE_SURVEY_REPORT]
            })
        case GET_QUESTIONS_LIST_BY_REQUEST_ID:
            return Object.assign({}, state, {
                [GET_QUESTIONS_LIST_BY_REQUEST_ID]: action[GET_QUESTIONS_LIST_BY_REQUEST_ID]
            })
        case GET_SURVEY_REPORT_BY_ID:
            return Object.assign({}, state, {
                [GET_SURVEY_REPORT_BY_ID]: action[GET_SURVEY_REPORT_BY_ID]
            })

        case GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID:
            return Object.assign({}, state, {
                [GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID]: action[GET_LABOUR_AND_EQUIPMENT_LOG_BY_PROJECT_ID]
            })
        case CREATE_LABOUR_AND_EQUIPMENT_LOG:
            return Object.assign({}, state, {
                [CREATE_LABOUR_AND_EQUIPMENT_LOG]: action[CREATE_LABOUR_AND_EQUIPMENT_LOG]
            })
        case UPDATE_LABOUR_AND_EQUIPMENT_LOG:
            return Object.assign({}, state, {
                [UPDATE_LABOUR_AND_EQUIPMENT_LOG]: action[UPDATE_LABOUR_AND_EQUIPMENT_LOG]
            })
        case DELETE_LABOUR_AND_EQUIPMENT_LOG:
            return Object.assign({}, state, {
                [DELETE_LABOUR_AND_EQUIPMENT_LOG]: action[DELETE_LABOUR_AND_EQUIPMENT_LOG]
            })

        case UNLOCK_REPORT:
            return Object.assign({}, state, {
                [UNLOCK_REPORT]: action[UNLOCK_REPORT]
            })


        default:
            return state;
    }
}

export default reducer;