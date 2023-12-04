import {
	errorNotification,
	successNotification,
} from '../../commons/notification';
import { axiosPost } from '../axiosHelper';
import { LOGIN } from './actionType';

export function login(post) {
	return (dispatch) => {
		return axiosPost(
			{ url: '/login', reqBody: post, skipAuth: true },
			(response) => {
				if (response.data?.result?.token)
					window.localStorage.setItem('token', response.data?.result?.token);
				if (response.data?.result?._id)
					window.localStorage.setItem('userId', response.data?.result?._id);
				if (response.data.result) {
					if (post.mobile && post.country_code) {
						if (response.data.result.mobile_verify == false) {
							window.location.href = '/auth/verify-mobile';
							return;
						}
					}

					if (response.data?.success === true) {
						successNotification(response.data?.message);
					}
					if (response.data?.success === false) {
						errorNotification(response.data?.message);
					}

					dispatch({
						type: LOGIN,
						login_user_data: response.data,
					});
				} else {
					errorNotification('Something went wrong');
				}
			},
		);
	};
}
