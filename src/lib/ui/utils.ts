export const formatPath = (p) => {
	let sitename = 'creatureweb.org';
	let newPath = '';

	if (p.hostname.indexOf('.') > -1) {
		newPath = p.hostname.split('.')[0];
		//(p.hostname.split('.')[1] === 'localhost' ? sitename : p.hostname.split('.')[1]) +
		//'/' +
	} else {
		newPath = p.hostname === 'localhost' ? sitename : p.hostname;
	}

	if (p.pathname !== '/') {
		newPath = newPath + p.pathname;
	}
	return newPath;
};
