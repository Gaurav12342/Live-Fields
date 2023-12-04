import enLangData from './en.json';
import Swal from 'sweetalert2';

function getUserId() {
	let userId = window.localStorage.getItem('userId' || 'ruserId');
	return userId;
}

export function setAuthToken(token, id) {
	window.localStorage.setItem('token', token);
	window.localStorage.setItem('userId', id);
}
export function resetAuthToken() {
	window.localStorage.removeItem('token');
	window.localStorage.removeItem('userId');
}
const { are_you_sure, you_won_t_to_be, icon_delete,close } =
	getSiteLanguageData('commons');

export function sweetAlert(Sweet, name, action = icon_delete.text, clear) {
	Swal.fire({
		title: are_you_sure.text,
		text: you_won_t_to_be.text + ' ' + action + ' ' + 'this' + ' ' + name + '?',
		icon: 'warning',
		reverseButtons: true,
		showCancelButton: true,
		confirmButtonColor: '#dc3545',
		cancelButtonColor: '#28a745',
		confirmButtonText: `Yes, ${action} it!`,
	}).then((result) => {
		if (result.isConfirmed) {
			Sweet();
			if (typeof clear == 'function') clear([]);
		}
	});
}

export function getSiteLanguageData(moduleKey = null) {
	const lang = window.localStorage.getItem('lang');
	if (moduleKey) {
		if (moduleKey.includes('/')) {
			const keys = moduleKey.split('/');
			let data = enLangData;
			keys.forEach((subKey) => {
				data = data[subKey];
			});
			return data;
		}
		return enLangData[moduleKey];
	}
	return enLangData;
}

export function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

export function variableValidator(
	variable,
	typeCheck = 'string',
	checkEmpty = false,
) {
	let validated = variable !== undefined && variable !== null;
	if (typeCheck === 'string') {
		validated = validated && variable !== '';
	}
	if (typeCheck === 'object') {
		validated = validated && typeof variable === 'object';
		if (checkEmpty === true) {
			validated = validated && Object.keys(variable).length > 0;
		}
	}
	if (typeCheck === 'array') {
		validated = validated && Array.isArray(variable);
		if (checkEmpty === true) {
			validated = validated && variable.length > 0;
		}
	}
	if (typeCheck === 'bool') {
		if (checkEmpty === true) {
			validated = validated !== '';
		}
	}
	return validated;
}

export const imageExtensions = ['png', 'jpeg', 'jpg', 'gif', 'svg','webp'];

const FILE_TYPE_GROUP = {
	image: [
		'png',
		'jpeg',
		'jpg',
		'gif',
		'bmp',
		'tiff',
		'tif',
		'tn3',
		'tp3',
		'svg',
		'webp'
	],
	audio: ['avi', 'ogg', 'wav', 'mp3'],
	video: ['webm', 'mov', 'mp4', 'mpg', 'f4v', 'wmv', 'flv', 'mkv'],
	other: [
		'rvt',
		'dwg',
		'dxf',
		'kmz',
		'dgn',
		'kml',
		'dwf',
		'dwfx',
		'ifc',
		'nwd',
		'mpp',
		'pan',
		'rd3',
		'xer',
	],
	compress: ['7z', 'zip', 'zipx', 'rar'],
	presantation: ['ppt', 'pptx', 'pps', 'key', 'odp'],
	spreadsheet: ['xlsx', 'xls', 'xltx', 'xlt', 'xlsm', 'ods', 'numbers', 'csv'],
	doc: ['doc', 'docx', 'pages', 'odt', 'odf', 'txt', 'rtf'],
	pdf: ['pdf'],
};
const FILE_ICONS = {
	audio:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Audio.png',
	other:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Otherfiles.png',
	spreadsheet:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/Spreadsheet.png',
	compress:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/compress.png',
	doc: 'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/doc.png',
	image:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/image.png',
	pdf: 'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/pdf.png',
	presantation:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/presantation.png',
	video:
		'https://livefield.s3.ap-south-1.amazonaws.com/public/File-Icon/video.png',
};

export const issueStatusList = [
	{label:"Open", value:"Open"}, 
	{label:"Closed", value: "Closed"},
	{label:"Force closed", value:"Force closed"}
];

export const getIconByType = (type) => {
	let groupType = '';
	const groups = Object.entries(FILE_TYPE_GROUP);
	for (let i = 0; i < groups.length; i++) {
		const group = groups[i];
		if (group[1].includes(type)) {
			groupType = group[0];
			break;
		}
	}

	if (!groupType) groupType = 'other';

	return FILE_ICONS[groupType];
};

export const wallUnit = ['%','nos','ft','sq.ft','cu.ft','m','sq.m','cum','km','yd','gal'];


/* export const findSum = (val1, val2) => {
	let total = val1 + val2;
	return total;
}

// convert degree to radians
export const degToRad = (degrees) => {
	return degrees * (Math.PI / 180);
}

// convert radians to degrees
export const radToDeg = (rad) => {
	return rad / (Math.PI / 180);
}


// volume of rectangular plate
export const vol_rect = (l,b,t) => {
	return l * b * t;
}

// volume of circular plate
export const vol_circle_t = (r,t) => {
	return Math.PI * r * r * t;
}

// volume of polygonal plate
export const vol_polygon_t = (n,l) => {
	let vol_polygon_t = (1/4) * (n / Math.tan(180 / n * Math.PI / 180))* l * l;
	return vol_polygon_t;
}

// volume of ring plate
export const vol_ring_t = (rInner, rOuter, t) => {
	return Math.PI * ( Math.pow(rOuter,2) - Math.pow(rInner,2)) * t;
}

// volume of sphere
export const vol_sphere = (r) => {
	return 4 / 3 * Math.PI * Math.pow(r,3);
}

// volume of ring_torus
export const vol_ring_torus = (rInner, rOuter) => {
	return Math.PI * Math.pow(rInner,2) * (2 * Math.PI * rOuter );
}
 */














export default getUserId;
