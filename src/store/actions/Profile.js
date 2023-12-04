import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosPost, axiosGet } from '../axiosHelper';
import {
	USER_EMAIL_VERIFY_SEND,
	USER_EMAIL_VERIFY_PROCESS,
	USER_PROFILE_DETAILS,
	USER_MOBILE_VERIFY_SEND,
	USER_MOBILE_VERIFY_PROCESS,
	GET_ALL_USER_CARDS,
	GET_ALL_USER_BILLING_INFO,
	CREATE_USER_CARDS,
	UPDATE_USER_CARDS,
	DELETE_USER_CARDS,
	AUTH_LOADING,
	GET_USER_WALLET,
} from './actionType';
import { stopLoading } from './loading';

export function UserRegistrationEmailVerify(
	post,
	handleDisable,
	handleHoursMinSecs,
) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user/registration_email_verify', reqBody: post, skipAuth: true },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					handleDisable(true);
					setTimeout(function () {
						handleDisable(false);
					}, 121000);
					handleHoursMinSecs(1);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: USER_EMAIL_VERIFY_SEND,
					[USER_EMAIL_VERIFY_SEND]: response.data,
				});
			},
		);
	};
}

export function getAllUserCards(userId) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/userpaymentinfo/getcarddetails/' + userId },
			(response) => {
				dispatch({
					type: GET_ALL_USER_CARDS,
					[GET_ALL_USER_CARDS]: response.data,
				});
			},
		);
	};
}

export function createUsercards(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/userpaymentinfo/card/create', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: CREATE_USER_CARDS,
					[CREATE_USER_CARDS]: response.data,
				});
			},
		);
	};
}

export function updateUserCard(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/userpaymentinfo/card/update', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllUserCards(post?.userId));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: UPDATE_USER_CARDS,
					[UPDATE_USER_CARDS]: response.data,
				});
			},
		);
	};
}

export function deleteCard(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/userpaymentinfo/card/delete', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					dispatch(getAllUserCards(post?.userId));
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: DELETE_USER_CARDS,
					[DELETE_USER_CARDS]: response.data,
				});
			},
		);
	};
}

export function getAllUserBillingInfo(userId, cb) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/userbillinginfo/getBellinginfo/' + userId },
			(response) => {
				dispatch({
					type: GET_ALL_USER_BILLING_INFO,
					[GET_ALL_USER_BILLING_INFO]: response.data,
				});
				if(typeof cb == "function") cb(response?.data);
			},
		);
	};
}

export function UserEmailVerifyProcess(post, redirectToWelcome = false) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user/email_verify_process', reqBody: post, skipAuth: true },
			(response) => {
				if (response.data?.success === true) {
					if (window.localStorage.getItem('ruserId')) {
						localStorage.setItem(
							'userId',
							window.localStorage.getItem('ruserId'),
						);
					}
					if (window.localStorage.getItem('rtoken')) {
						localStorage.setItem(
							'token',
							window.localStorage.getItem('rtoken'),
						);
					}
					setTimeout(function () {
						localStorage.setItem(
							'userId',
							window.localStorage.getItem('ruserId'),
						);
						localStorage.setItem(
							'token',
							window.localStorage.getItem('rtoken'),
						);

						dispatch({
							type: USER_EMAIL_VERIFY_PROCESS,
							[USER_EMAIL_VERIFY_PROCESS]: response.data,
						});
						if (redirectToWelcome && localStorage.getItem('userId')) {
							window.location.href = '/projects';
						} else {
							window.location.href = '/auth/login';
						}
					}, 1100);
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: USER_EMAIL_VERIFY_PROCESS,
					[USER_EMAIL_VERIFY_PROCESS]: response.data,
				});
			},
		);
	};
}

export function UserRegistrationMobileVerify(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: 'user/registration_email_verify', reqBody: post },
			(response) => {
				dispatch({
					type: USER_MOBILE_VERIFY_SEND,
					[USER_MOBILE_VERIFY_SEND]: response.data,
				});
			},
		);
	};
}
export function UserMobileVerifyProcess(post, navigate) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user/email_verify_process', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					navigate('/projects');
				} else {
					errorNotification(response.data?.message);
				}
				dispatch({
					type: USER_MOBILE_VERIFY_PROCESS,
					[USER_MOBILE_VERIFY_PROCESS]: response.data,
				});
			},
		);
	};
}

export function GetUserProfileDetails(id) {
	return (dispatch) => {
		return axiosGet({ url: '/user/profile/' + id }, (response) => {
			if (response.status === 403) {
				dispatch(stopLoading(AUTH_LOADING));
			}
			dispatch({
				type: USER_PROFILE_DETAILS,
				user_profile_details: response.data,
			});
		});
	};
}

export function ChangePassword(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: 'user/change_password', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}

export function UpdateProfile(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: 'user/profile/update', reqBody: post },
			(response) => {
				// dispatch({
				//     type: USER_UPDATE_PROFILE,
				//     user_update_profile: response.data
				// });

				if (
					typeof response.data != 'undefined' &&
					typeof response.data.result != 'undefined' &&
					typeof response.data.result.token != 'undefined' &&
					typeof response.data.result.token.web
				) {
					localStorage.setItem('token', response.data.result.token.web);
				}
				dispatch(GetUserProfileDetails(post?.user_id));
				if (response.data?.success === true) {
					successNotification(response?.data?.message);
				}
				if (response.data?.success === false) {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}

export function UploadProfileImage(post) {
	return (dispatch) => {
		// dispatch({
		//     type: USER_PROFILE_DETAILS,
		//     user_profile_details: {}
		// });
		return axiosPost(
			{ url: 'user/profile/image', reqBody: post },
			(response) => {
				// dispatch({
				//     type: UPDATE_PROFILE_IMAGE,
				//     update_profile_image: response.data
				// });
				// const  user_profile_details = {
				//     ...response.data,
				//     result : {
				//     ...response.data.result,
				//     profile : undefined
				//     }
				// }
				dispatch({
					type: USER_PROFILE_DETAILS,
					user_profile_details: response.data,
				});
				// dispatch(GetUserProfileDetails(post.user_id))
				if (response.data?.success === true) {
					successNotification(response?.data?.message);
				}
				if (response.data?.success === false) {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}

export function GetUserWalletDetails(userId) {
	return (dispatch) => {
		return axiosGet({ url: '/referral/transaction/' + userId }, (response) => {
			dispatch({
				type: GET_USER_WALLET,
				[GET_USER_WALLET]: response.data,
			});
		});
	};
}


export function updateSettings(postData, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user/profile/update_settings', reqBody: postData },
			(response) => {
				
				dispatch(GetUserProfileDetails(postData?.user_id));
				if (response.data?.success === true) {
					successNotification(response?.data?.message);
				}
				if (response.data?.success === false) {
					errorNotification(response.data?.message);
				}
			},
		);
	};
}