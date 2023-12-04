import {
	FORGOT_PASS_DATA,
	FORGOT_PASS_OTP,
	FORGOT_PASS_REQUEST,
	FORGOT_PASS_RESET,
	USER_MOBILE_VERIFY_SEND,
} from '../actions/actionType';

// import * as actionTypes from '../actions/actionType';
const initialState = {
	[FORGOT_PASS_REQUEST]: [],
	[FORGOT_PASS_OTP]: [],
	forgot_pass_reset: {},
	forgot_pass_data: {},
	[USER_MOBILE_VERIFY_SEND]: {},
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		// case actionTypes.FORGOT_PASS_REQUEST:
		//     return Object.assign({},state,{
		//         [FORGOT_PASS_REQUEST] : action.[FORGOT_PASS_REQUEST]
		//     })

		case FORGOT_PASS_REQUEST:
			return Object.assign({}, state, {
				[FORGOT_PASS_REQUEST]: action[FORGOT_PASS_REQUEST],
			});
		case FORGOT_PASS_OTP:
			return Object.assign({}, state, {
				[FORGOT_PASS_OTP]: action[FORGOT_PASS_OTP],
			});

		case FORGOT_PASS_RESET:
			return Object.assign({}, state, {
				forgot_pass_reset: action.forgot_pass_reset,
			});

		case FORGOT_PASS_DATA:
			return Object.assign({}, state, {
				forgot_pass_data: action.forgot_pass_data,
			});
		case USER_MOBILE_VERIFY_SEND:
			return Object.assign({}, state, {
				[USER_MOBILE_VERIFY_SEND]: action[USER_MOBILE_VERIFY_SEND],
			});

		default:
			return state;
	}
};

export default reducer;
