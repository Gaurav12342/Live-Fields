// import { CREATE_TASK } from "../actions/actionType";
import {GET_ISSUE_LIST, GET_ISSUE_DATA} from '../actions/actionType';

const initialState = {
    GET_ISSUE_LIST: [],
    GET_ISSUE_DATA:{}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ISSUE_LIST:
            return Object.assign({}, state, {
                GET_ISSUE_LIST: action.GET_ISSUE_LIST
            })
        case GET_ISSUE_DATA:
            return Object.assign({}, state, {
                GET_ISSUE_DATA: action.GET_ISSUE_DATA
            })
        default:
            return state;
    }
}

export default reducer;