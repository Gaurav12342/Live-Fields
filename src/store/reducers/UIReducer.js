import { FOOTER, LICENCE_PURCHASED, LOGINPAGE, TOPBAR, LOADING_DATA } from "../actions/actionType";

const initialState = {
    topbar: true,
    footer: true,
    loginpage: false,
    login_user_data: {},
    loading_data:false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case TOPBAR:
            return {
                ...state,
                top_bar: !state.topbar
            };
        case FOOTER:
            return {
                ...state,
                footer: !state.footer
            };
        case LOGINPAGE:
            return {
                ...state,
                loginpage: !state.loginpage
            };

        case LICENCE_PURCHASED:
            return {
                ...state,
                [LICENCE_PURCHASED]: action.LICENCE_PURCHASED
            };
        case LOADING_DATA:
            return {
                ...state,
                loading_data: action.LOADING_DATA
            };

        default:
            return state;
    }
}

export default reducer;