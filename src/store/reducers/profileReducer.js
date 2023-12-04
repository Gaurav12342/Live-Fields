import {
	CREATE_USER_CARDS,
	GET_ALL_USER_BILLING_INFO,
	GET_ALL_USER_CARDS,
	GET_USER_WALLET,
	UPDATE_PROFILE_IMAGE,
	USER_CHANGE_PASSWORD,
	USER_EMAIL_VERIFY_PROCESS,
	USER_EMAIL_VERIFY_SEND,
	USER_MOBILE_VERIFY_PROCESS,
	USER_PROFILE_DETAILS,
	USER_UPDATE_PROFILE,
} from '../actions/actionType';

const initialState = {
	user_email_verify_send: {},
	[USER_EMAIL_VERIFY_PROCESS]: {},
	user_profile_details: {},
	user_change_password: {},
	user_update_profile: {},
	update_profile_image: {},
	[CREATE_USER_CARDS]: [],
	[USER_MOBILE_VERIFY_PROCESS]: {},
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case USER_EMAIL_VERIFY_SEND:
			return Object.assign({}, state, {
				[USER_EMAIL_VERIFY_SEND]: action[USER_EMAIL_VERIFY_SEND],
			});

		case USER_EMAIL_VERIFY_PROCESS:
			return Object.assign({}, state, {
				[USER_EMAIL_VERIFY_PROCESS]: action[USER_EMAIL_VERIFY_PROCESS],
			});

		case USER_MOBILE_VERIFY_PROCESS:
			return Object.assign({}, state, {
				[USER_MOBILE_VERIFY_PROCESS]: action[USER_MOBILE_VERIFY_PROCESS],
			});

		case USER_PROFILE_DETAILS:
			return Object.assign({}, state, {
				user_profile_details: action.user_profile_details,
			});

		case USER_CHANGE_PASSWORD:
			return Object.assign({}, state, {
				user_change_password: action.user_change_password,
			});

		case USER_UPDATE_PROFILE:
			return Object.assign({}, state, {
				user_update_profile: action.user_update_profile,
			});

		case UPDATE_PROFILE_IMAGE:
			return Object.assign({}, state, {
				update_profile_image: action.update_profile_image,
			});

		case GET_ALL_USER_CARDS:
			return Object.assign({}, state, {
				[GET_ALL_USER_CARDS]: action[GET_ALL_USER_CARDS],
			});

		case CREATE_USER_CARDS:
			return Object.assign({}, state, {
				[CREATE_USER_CARDS]: action[CREATE_USER_CARDS],
			});

		case GET_ALL_USER_BILLING_INFO:
			return Object.assign({}, state, {
				[GET_ALL_USER_BILLING_INFO]: action[GET_ALL_USER_BILLING_INFO],
			});
		case GET_USER_WALLET:
			return Object.assign({}, state, {
				[GET_USER_WALLET]: action[GET_USER_WALLET],
			});

		default:
			return state;
	}
};

export default reducer;
