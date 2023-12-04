import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosPost, axiosGet } from '../axiosHelper';
import {
	CREATE_BILLING_INFO,
	EDIT_BILLING_INFO,
	GET_ALL_ROLE_WISE_PEOPLE_TEAM,
	GET_LICENSE_PLANS,
	GET_USER_LICENSE,
	LICENCE_PURCHASED,
} from './actionType';
import { getAllUserBillingInfo } from './Profile';

export function getLicensePlans(cb=null) {
	return (dispatch) => {
		return axiosGet({ url: '/licence/plans/' }, (response) => {
			if(typeof cb == "function") cb(response.data);
			dispatch({
				type: GET_LICENSE_PLANS,
				[GET_LICENSE_PLANS]: response.data,
			});
		});
	};
}

export function getPaymentLink(hash,cb=null){	
	return (dispatch) => {
		return axiosGet({ url: '/payment_link/'+hash, skipAuth:true }, (response) => {
			if(typeof cb == "function") cb(response.data);
		});
	};
}

export function getUserLicence(userId) {
	return (dispatch) => {
		return axiosGet({ url: '/user_licence/' + userId }, (response) => {
			if (response?.data?.result?._id) {
				dispatch(getAllRoleWiseTeam(response?.data?.result?._id));
				dispatch({
					type: LICENCE_PURCHASED,
					[LICENCE_PURCHASED]: true,
				});
			} else if(!userId){
				window.location.href = '/auth/login';
			} else {
				if(window.location.pathname != '/subscription' && window.location.pathname != '/cart'){
					setTimeout(() => {
						let userLid = localStorage.getItem("userId");
						if(userLid){
							window.location.href = '/cart';
						}else{
							window.location.href = '/auth/login';
						}
						
					}, 1500);
				}
				
				/* 
				Create Trial Plan Stop from frontend

				const post = {
					user_id: userId,
					licence_plan_id: '61a65ff7392a063255f095e9',
					count: 5,
					is_recurring: false,
					user_specify_recurring_date: '',
					billing_info_id: 'trial',
					gateway_type: 'Razorpay',
					payment_id: '',
					amount: 0,
					gateway_amount: 0,
					wallet_amount: 0,
					status: 'created',
				};
				dispatch(purchaseLicence(post)); */
			}
			dispatch({
				type: GET_USER_LICENSE,
				[GET_USER_LICENSE]: response.data,
			});
		});
	};
}



export function getUserLicenceInvoice(transaction_id, cb) {
	return (dispatch) => {
		return axiosGet({ url: '/user_licence/invoice/'+transaction_id }, (response) => {
			if(typeof cb == "function") cb(response?.data);
		});
	};
}

export function createBillingInfo(post, notify = true, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/userbillinginfo/create', reqBody: post },
			(response) => {
				if (notify === true) {
					if (response.data?.success === true) {
						successNotification(response.data?.message);
					} else {
						errorNotification(response.data?.message);
					}
				}
				if(typeof cb == "function") cb(response.data);
				dispatch(getAllUserBillingInfo(post?.user_id));
				dispatch({
					type: CREATE_BILLING_INFO,
					[CREATE_BILLING_INFO]: response.data,
				});
			},
		);
	};
}

export function editBillingInfo(post, notify = true, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/userbillinginfo/update', reqBody: post },
			(response) => {
				if (notify === true) {
					if (response.data?.success === true) {
						successNotification(response.data?.message);
					} else {
						errorNotification(response.data?.message);
					}
				}
				if(typeof cb == "function") cb(response.data);
				dispatch(getAllUserBillingInfo(post?.user_id));
				dispatch({
					type: EDIT_BILLING_INFO,
					[EDIT_BILLING_INFO]: response.data,
				});
			},
		);
	};
}

export function purchaseLicence(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user_licence/purchase', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					setTimeout(() => {
						window.location.href = '/projects';
					}, 1500);
				} else {
					errorNotification(response.data?.message);
				}
				if(typeof cb == "function") cb(response?.data)
				// dispatch(getAllUserBillingInfo(post?.user_id))
				// dispatch({
				//     type: CREATE_BILLING_INFO,
				//     [CREATE_BILLING_INFO]: response.data
				// });
			},
		);
	};
}

export function createRazorPayOrder(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/razorpay/order/create', reqBody: post },
			(response) => {
				if(typeof cb == "function") cb(response?.data);
			},
		);
	};
}

export function updateExistingLicence(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user_licence/update', reqBody: post },
			(response) => {
				if(typeof cb == "function") cb(response?.data);
			},
		);
	};
}

export function renewalLicense(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user_licence/renewal', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					setTimeout(() => {
						window.location.href = '/team';
					}, 1500);
				} else {
					errorNotification(response.data?.message);
				}
				// dispatch(getAllUserBillingInfo(post?.user_id))
				// dispatch({
				//     type: CREATE_BILLING_INFO,
				//     [CREATE_BILLING_INFO]: response.data
				// });
			},
		);
	};
}

export function getAllRoleWiseTeam(id) {
	return (dispatch) => {
		return axiosGet(
			{ url: '/user_licence/users/role_wise/' + id },
			(response) => {
				dispatch({
					type: GET_ALL_ROLE_WISE_PEOPLE_TEAM,
					[GET_ALL_ROLE_WISE_PEOPLE_TEAM]: response.data,
				});
			},
		);
	};
}

export function inviteUserToLicence(post, cb) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user_licence/invite', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				if (post?.user_licences_id) {
					dispatch(getAllRoleWiseTeam(post?.user_licences_id));
				}

				if(typeof cb == "function") cb(response.data);
				// dispatch(getAllUserBillingInfo(post?.user_id))
				// dispatch({
				//     type: CREATE_BILLING_INFO,
				//     [CREATE_BILLING_INFO]: response.data
				// });
			},
		);
	};
}

export function changeUserLicenceRole(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user_licence/change_user_role', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				if (post?.user_licences_id) {
					dispatch(getAllRoleWiseTeam(post?.user_licences_id));
				}
				// dispatch(getAllUserBillingInfo(post?.user_id))
				// dispatch({
				//     type: CREATE_BILLING_INFO,
				//     [CREATE_BILLING_INFO]: response.data
				// });
			},
		);
	};
}

export function removeFromLicence(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user_licence/remove', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				if (post?.user_licences_id) {
					dispatch(getAllRoleWiseTeam(post?.user_licences_id));
				}
				// dispatch(getAllUserBillingInfo(post?.user_id))
				// dispatch({
				//     type: CREATE_BILLING_INFO,
				//     [CREATE_BILLING_INFO]: response.data
				// });
			},
		);
	};
}

export function cencelInviteRequestLicence(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user_licence/cencel_invite', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
				} else {
					errorNotification(response.data?.message);
				}
				if (post?.user_licences_id) {
					dispatch(getAllRoleWiseTeam(post?.user_licences_id));
				}
				// dispatch(getAllUserBillingInfo(post?.user_id))
				// dispatch({
				//     type: CREATE_BILLING_INFO,
				//     [CREATE_BILLING_INFO]: response.data
				// });
			},
		);
	};
}

export function exitFromLicence(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/user_licence/exit', reqBody: post },
			(response) => {
				if (response.data?.success === true) {
					successNotification(response.data?.message);
					window.location.href = "/cart";
				} else {
					errorNotification(response.data?.message);
				}				
				// dispatch(getAllUserBillingInfo(post?.user_id))
				// dispatch({
				//     type: CREATE_BILLING_INFO,
				//     [CREATE_BILLING_INFO]: response.data
				// });
			},
		);
	};
}
