import { resetAuthToken } from '../commons';
import { API_URL } from '../commons/constants';
var axios = require('axios');
const baseUrl = API_URL;
/* 
{
	"url": "#rfi",
	"icon": "/images/rfi.svg",
	"name": "RFIs"
},

{
	"url": "/rfi/",
	"icon": "/images/rfi.svg",
	"name": "RFIs"
},

{
	"url": "/meeting/",
	"icon": "/images/meeting-room.svg",
	"name": "Meeting"
},
*/
function getResponse(response) {
	if (response && response.data) {
		if (response.status === 401 || response.status === 403) {
			resetAuthToken();
			if (
				['login', 'verify-email', 'register', 'verify-mobile']?.some((p) =>
					window.location.pathname.indexOf(p),
				) === -1
			) {
				window.location.href = '/auth/login';
			}
		}
		if (response && response.status === 500) {
			return {
				status: 500,
				data: { message: 'something went wrong ', error: {} },
			};
		}
		return {
			status: response.status,
			data: response.data,
		};
	} else {
		return {
			status: 500,
			data: {
				message: 'something went wrong ',
			},
		};
	}
}

export function getToken() {
	return window.localStorage.getItem('token' || 'rtoken');
}

export const axiosPost = (config, callback, progressCallback) => {
	const { url, reqBody, header } = config;
	const authorization = getToken();
	if (!authorization && !config.skipAuth) {
		// window.location.href = '/auth/login'
		return;
	}
	axios
	.post(url, reqBody, {
		headers: { ...header, authorization, platform: 'web' },
		onUploadProgress: (progressEvent) => {
			const progress = (progressEvent.loaded / progressEvent.total) * 100;
			if(typeof progressCallback === "function"){
				progressCallback(Math.ceil(progress))
			}
		},
		onDownloadProgress: (progressEvent) => {
			if(typeof progressCallback === "function"){
				progressCallback(Math.ceil(0))
			}
		},
		baseURL: baseUrl
	}).then((response) => {
		callback(getResponse(response));
	}).catch((err) => {
		callback(getResponse(err.response));
	});
};

export const axiosPostFileUpload = (config, callback) => {
	const { url, reqBody, header } = config;
	const authorization = getToken();
	if (!authorization && !config.skipAuth) {
		// window.location.href = '/auth/login'
		return;
	}
	axios
		.post(url, reqBody, {
			headers: { ...header, authorization, platform: 'web' },
			baseURL: baseUrl,
		})
		.then((response) => {
			callback(getResponse(response));
		})
		.catch((err) => {
			callback(getResponse(err.response));
		});
};

export const axiosPut = (config, callback) => {
	const { url, reqBody, header } = config;
	const authorization = getToken();
	if (!authorization && !config.skipAuth) {
		// window.location.href = '/auth/login'
		return;
	}
	axios
		.put(url, reqBody, {
			headers: { ...header, authorization, platform: 'web' },
			baseURL: baseUrl,
		})
		.then((response) => {
			callback(getResponse(response));
		})
		.catch((err) => {
			callback(getResponse(err.response));
		});
};

export const axiosDelete = (config, callback) => {
	const { url, header, reqBody } = config;
	const authorization = getToken();
	if (!authorization && !config.skipAuth) {
		// window.location.href = '/auth/login'
		return;
	}
	axios
		.delete(url, reqBody, {
			headers: { ...header, authorization, platform: 'web' },
			baseURL: baseUrl,
		})
		.then((response) => {
			callback(getResponse(response));
		})
		.catch((err) => {
			callback(getResponse(err.response));
		});
};

export const axiosGet = (config, callback) => {
	const { header } = config;
	const authorization = getToken();
	if (!authorization && !config.skipAuth) {
		// window.location.href = '/auth/login'
		return;
	}
	axios
		.get(config.url, {
			headers: { ...header, authorization, platform: 'web' },
			baseURL: baseUrl,
		})
		.then((response) => {
			callback(getResponse(response));
		})
		.catch((err) => {
			callback(getResponse(err.response));
		});
};
