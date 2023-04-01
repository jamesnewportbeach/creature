import * as THREE from 'three';

import ThreeMeshUI from 'three-mesh-ui';

export const Image = (source) => {
	const texture = new THREE.TextureLoader().load(source);
	/*
const material = new ThreeMeshBasicMaterial({
    map: texture,
    side: DoubleSide, depthWrite: true
});
*/

	const material = new THREE.SpriteMaterial({
		map: texture
	});

	const sprite = new THREE.Sprite(material);
	sprite.scale.set(12, 12);
	return sprite;
};

export const createIconMaterial = (iconPath, BufferGeometryUtils, SVGLoader) => {
	const _material = new THREE.MeshNormalMaterial();
	const _geometry = _createIconGeometryFromSVGPath(iconPath, BufferGeometryUtils, SVGLoader);
	const _icon = new THREE.Mesh(_geometry, _material);
	_icon.position.set(0, 0, 0);
	return _icon;
};

export const _createIconGeometryFromSVGPath = (iconPath, BufferGeometryUtils, SVGLoader) => {
	const ICON_SIZE = 10;

	// Grab the SVGLoader.
	const _loader = new SVGLoader();

	// Prepare and parse the path command string.
	const _iconPath = `<path d="${iconPath}">`;

	const _parsedSVG = _loader.parse(_iconPath);

	// Convert to shapes.
	const _shapes = _parsedSVG.paths[0].toShapes(false);

	// Extrude to an array of geometries.
	const _shapeBufferGeometry = [];
	_shapes.forEach((shape) =>
		_shapeBufferGeometry.push(
			new THREE.ExtrudeBufferGeometry(shape, {
				depth: 4,
				bevelEnabled: false
			})
		)
	);

	// Merge the geometries (for performance)
	const _iconGeometry = BufferGeometryUtils.mergeBufferGeometries(_shapeBufferGeometry, true);

	// _try_ to 'normalise' the icon size.
	_iconGeometry.computeBoundingSphere();
	_iconGeometry.scale(
		ICON_SIZE / _iconGeometry.boundingSphere.radius,
		ICON_SIZE / _iconGeometry.boundingSphere.radius,
		1
	);

	return _iconGeometry;
};

export const getIcon = (value, db) => {
	return new Promise((resolve) => {
		db.collection('IconsFontAwesome')
			.doc(value)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return resolve({ id: value, path: doc.data().path });
				} else {
					return resolve({ id: value });
				}
			})
			.catch((error) => {
				console.log('Error getting document:', error);
			});
	});
};

export const getIcons = () => {
	const promises = [];
	icons.forEach((o) => {
		promises.push(getIcon(o.id, db));
	});
};

export const uuidv4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export const iconMappings = {
	'http://dbpedia.org/property/name': 'User',
	'http://dbpedia.org/ontology/thumbnail': 'Image',
	'http://dbpedia.org/property/birthPlace': 'Globe',
	'http://dbpedia.org/ontology/wikiPageID': 'Fingerprint',
	'http://dbpedia.org/ontology/wikiPageRevisionID': 'Fingerprint',
	'http://dbpedia.org/ontology/wikiPageWikiLink': 'Link',
	'http://www.w3.org/2002/07/owl#sameAs': 'ExchangeAlt',
	'http://dbpedia.org/ontology/wikiPageExternalLink': 'Link',
	'http://dbpedia.org/property/otherwins': 'GlobeAfrica',
	'http://dbpedia.org/property/pgawins': 'GlobeAmericas',
	'http://dbpedia.org/property/prowins': 'Trophy',
	'http://dbpedia.org/property/asiawins': 'GlobeAsia',
	'http://dbpedia.org/property/auswins': 'GlobeAsia',
	'http://dbpedia.org/property/awardssection': 'Award',
	'http://dbpedia.org/property/eurowins': 'GlobeEurope',
	'http://dbpedia.org/property/usopen': 'GolfBall',
	'http://dbpedia.org/property/wghofid': 'Fingerprint',
	'http://dbpedia.org/property/wghofyear': 'Calendar',
	'http://dbpedia.org/property/yearpro': 'Calendar',
	'http://dbpedia.org/property/award': 'Award',
	'http://dbpedia.org/property/b': 'AirBnb',
	'http://dbpedia.org/property/birthDate': 'BirthdayCake',
	'http://dbpedia.org/property/caption': 'Comment',
	'http://dbpedia.org/property/children': 'Child',
	'http://dbpedia.org/property/college': 'University',
	'http://dbpedia.org/property/commons': 'QuestionCircle',
	'http://dbpedia.org/property/fullname': 'User',
	'http://dbpedia.org/property/height': 'ArrowsAltV',
	'http://dbpedia.org/property/n': 'QuestionCircle',
	'http://dbpedia.org/property/nickname': 'User',
	'http://dbpedia.org/property/open': 'GolfBall',
	'http://dbpedia.org/property/q': 'QuestionCircle',
	'http://dbpedia.org/property/residence': 'Home',
	'http://dbpedia.org/property/s': 'QuestionCircle',
	'http://dbpedia.org/property/spouse': 'HandHoldingHeart',
	'http://dbpedia.org/property/title': 'AirBnb',
	'http://dbpedia.org/property/v': 'QuestionCircle',
	'http://dbpedia.org/property/voy': 'QuestionCircle',
	'http://dbpedia.org/property/weight': 'BalanceScale',
	'http://dbpedia.org/property/wikt': 'WikipediaW',
	'http://dbpedia.org/property/year': 'Calendar',
	'http://dbpedia.org/property/pga': 'GolfBall',
	'http://dbpedia.org/property/tour': 'Globe',
	'http://dbpedia.org/ontology/abstract': 'FileAlt',
	'http://dbpedia.org/property/masters': 'GolfBall',
	'http://dbpedia.org/ontology/college': 'University',
	'http://dbpedia.org/property/japwins': 'GlobeAsia',
	'http://dbpedia.org/property/majorwins': 'Trophy',
	'http://dbpedia.org/ontology/award': 'Award',
	'http://dbpedia.org/ontology/nationality': 'Globe',
	'http://dbpedia.org/ontology/height': 'ArrowsAltV',
	'http://dbpedia.org/ontology/weight': 'BalanceScale',
	'http://dbpedia.org/ontology/Person/height': 'ArrowsAltV',
	'http://dbpedia.org/ontology/Person/weight': 'BalanceScale',
	'http://dbpedia.org/ontology/wikiPageLength': 'Copy',
	'http://dbpedia.org/ontology/winsAtAsia': 'GlobeAsia',
	'http://dbpedia.org/ontology/winsAtAus': 'GlobeAsia',
	'http://dbpedia.org/ontology/winsAtJapan': 'GlobeAsia',
	'http://dbpedia.org/ontology/winsAtOtherTournaments': 'GlobeAfrica',
	'http://dbpedia.org/ontology/winsAtPGA': 'GlobeAmericas',
	'http://dbpedia.org/ontology/winsInEurope': 'GlobeEurope'
};
