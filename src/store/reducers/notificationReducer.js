import * as actionTypes from '../actions/actionType';
const initialState = {
	send_notification: {},
	[actionTypes.GET_PROJECT_NOTIFICATION_COUNT]:[]
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SEND_NOTIFICATION:
			return Object.assign({}, state, {
				send_notification: action.send_notification,
			});
		case actionTypes.GET_NOTIFICATION_COUNT:
			return Object.assign({}, state, {
				[actionTypes.GET_NOTIFICATION_COUNT]: action[actionTypes.GET_NOTIFICATION_COUNT],
			});
		case actionTypes.GET_PROJECT_NOTIFICATION_COUNT:
			return Object.assign({}, state, {
				[actionTypes.GET_PROJECT_NOTIFICATION_COUNT]: action[actionTypes.GET_PROJECT_NOTIFICATION_COUNT],
			});
		case actionTypes.GET_NOTIFICATION_BY_PROJECT:
			return Object.assign({}, state, {
				[actionTypes.GET_NOTIFICATION_BY_PROJECT]:
					action[actionTypes.GET_NOTIFICATION_BY_PROJECT],
			});
		case actionTypes.READ_NOTIFICATION:
			return Object.assign({}, state, {
				[actionTypes.READ_NOTIFICATION]: action[actionTypes.READ_NOTIFICATION],
			});
		case actionTypes.DELETE_NOTIFICATION:
			return Object.assign({}, state, {
				[actionTypes.DELETE_NOTIFICATION]:
					action[actionTypes.DELETE_NOTIFICATION],
			});

		default:
			return state;
	}
};

export default reducer;
