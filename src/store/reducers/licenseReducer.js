import { CREATE_BILLING_INFO, EDIT_BILLING_INFO, GET_ALL_ROLE_TEAM, GET_ALL_ROLE_WISE_PEOPLE_TEAM, GET_LICENSE_PLANS, GET_USER_LICENSE } from "../actions/actionType"

const initialState = {
    [GET_LICENSE_PLANS]: [],
    [GET_ALL_ROLE_WISE_PEOPLE_TEAM] : []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LICENSE_PLANS:
            return Object.assign({}, state, {
                [GET_LICENSE_PLANS]: action[GET_LICENSE_PLANS]
            })
        case CREATE_BILLING_INFO:
            return Object.assign({}, state, {
                [CREATE_BILLING_INFO]: action[CREATE_BILLING_INFO]
            })
        case GET_USER_LICENSE:
            return Object.assign({}, state, {
                [GET_USER_LICENSE]: action[GET_USER_LICENSE]
            })
        case EDIT_BILLING_INFO:
            return Object.assign({}, state, {
                [EDIT_BILLING_INFO]: action[EDIT_BILLING_INFO]
            })
        case GET_ALL_ROLE_TEAM:
            return Object.assign({}, state, {
                [GET_ALL_ROLE_TEAM]: action[GET_ALL_ROLE_TEAM]
            })
        case GET_ALL_ROLE_WISE_PEOPLE_TEAM:
            return Object.assign({}, state, {
                [GET_ALL_ROLE_WISE_PEOPLE_TEAM]: action[GET_ALL_ROLE_WISE_PEOPLE_TEAM]
            })
        default:
            return state;
    }
}

export default reducer;