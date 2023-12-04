export function getParameterByName(name, url = window.location.href) {
	name = name.replace(/[[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return name === 'email'
		? results[2]
		: name === 'code'
		? decodeURIComponent(results[2])
		: decodeURIComponent(results[2].replace(/\+/g, ' '));
}
