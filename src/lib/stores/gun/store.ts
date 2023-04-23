import Gun from './initGun';
import { nanoid } from 'nanoid';
import { writable } from 'svelte/store';

// import { GUN_PEER_URL } from '$env/static/private'

export const userStore = writable(null);
export const usersStore = writable(null);
export const attributesStore = writable({});
export const nodesStore = writable({});

export const PUBLIC_AREA = 'tenants';

export const getPathName = (pathname) => {
	const pageParts = pathname.split('/');
	const p = pageParts.shift();
	/*
		const itemParts = item['#'].split('/');
		const tenant = itemParts.shift();
		const space = itemParts.shift();
		*/
	return pageParts.join('/');
};
export const getLocalPathName = (pathname) => {
	const pageParts = pathname.split('/');
	const p1 = pageParts.shift();
	const p2 = pageParts.shift();
	/*
		const itemParts = item['#'].split('/');
		const tenant = itemParts.shift();
		const space = itemParts.shift();
		*/
	return pageParts.join('/');
};

const now = () => {
	const now = new Date();
	return now.getTime();
};
// https://mogwai.herokuapp.com/gun
// http://localhost:8765/gun

const getPeers = () => {
	if (process.env.NODE_ENV === 'development') {
		return ['https://shrouded-shelf-34915.herokuapp.com/gun'];
	} else {
		return ['https://shrouded-shelf-34915.herokuapp.com/gun'];
	}
};

export const customStore = (ref, methods = {}) => {
	let store = {};
	const subscribers = [];

	ref.on(function (data, key) {
		if (ref._.get === key) {
			store = data;
		} else if (!data) {
			delete store[key];
		} else {
			store[key] = data;
		}
		for (let i = 0; i < subscribers.length; i += 1) {
			subscribers[i](store);
		}
	});

	function subscribe(subscriber) {
		subscribers.push(subscriber);
		subscriber(store);
		return () => {
			const index = subscribers.indexOf(subscriber);
			if (index !== -1) {
				subscribers.splice(index, 1);
			}
			if (!subscribers.length) {
				ref.off();
			}
		};
	}

	return { ...methods, subscribe };
};

export const gun = Gun({
	peers: getPeers(),
	uuid: () => {
		const newId = nanoid(11);
		return newId;
	}
});

export const gunUser = gun.user().recall({
	sessionStorage: true
});

const PUBLIC_USERS = 'users',
	publicSpace = gun.get(PUBLIC_AREA);

const handleLogin = (u, n, cb) => {
	if (n.err) {
		cb(n);
	} else {
		privateStore.update(null, u, () => {
			publicStore.update(u.tenant + '/' + PUBLIC_USERS + '/' + n.sea.pub, u, () => {
				u.pub = n.sea.pub;
				userStore.set(u);
				cb(n, u);
			});
		});
	}
};

export const findPath = (id, store) => {
	if (id) {
		const pathParts = id.split('/');
		//const root = pathParts.shift();
		const pathLength = pathParts.length;
		if (pathLength === 0) {
			return store;
		} else {
			return store.path(pathParts);
		}
	} else {
		return store;
	}
};

const authorize = (callback) => {
	gunUser.once((d) => {
		if (d._ && '#' in d._) {
			callback(d.alias);
		} else {
			console.error('UNAUTHORIZED ACCESS');
		}
	});
};

const getUser = (alias) => {
	return publicSpace.get('users').get(alias);
};

const recursiveCopy = (id, items, store, nStore) => {
	if (items) {
		items.forEach((item, i) => {
			//if (item.children) recursiveCopy(id, item.children, store, nStore);
			let newNodeObj = { ...item, order: i };
			delete newNodeObj.id;

			findPath(item.id, store).put(newNodeObj, (ack) => {
				if (ack.ok) {
					console.log('SAVED:::');
					console.log(newNodeObj);
					nStore.update(newNodeObj);
				}
			});
		});
	}
};

const common = {
	create: (id, data, callback, store) => {
		findPath(id, publicSpace).put(data, callback);
		/*
        .get("createdBy")
        .put(userRef, callback)*/
		/*        
    authorize((alias) => {
      const userRef = getUser(alias);
      s
    });
    */
	},
	read: (id, store) => findPath(id, store),
	save: (id, data, store, nStore) => {
		findPath(id, store).put(null, () => {
			recursiveCopy(id, data, store, nStore);
		});
		// nStore.delete(id);
		// findPath(id, store).put(null);
	},
	delete: (id, callback, store) => {
		//authorize((alias) => {
		findPath(id, store).put(null, callback);
		//});
	},
	update: (id, data, callback, store) => {
		//authorize((alias) => {
		findPath(id, store).put(data, callback);
		//});
	},
	upload: (id, data, callback, store) => {
		authorize((alias) => {
			console.log('implement upload!!!');
			// findPath(id, store).put(data, callback);
		});
	},
	assert: (statement, lang, callback) => {
		authorize((alias) => {
			console.log(statement);
			//const userRef = getUser(alias);
			let predicateId, predicateObj, objectId, objectObj;

			if ('id' in statement.predicate) {
				predicateId = statement.predicate.id;
				predicateObj = findPath(predicateId, publicSpace);
			} else {
				predicateId = PUBLIC_AREA + '/predicates2/' + nanoid(11);
				predicateObj = findPath(predicateId, publicSpace)
					.get('label')
					.get(lang)
					.put(statement.predicate.value)
					.back()
					.back();
			}

			if ('id' in statement.object) {
				objectId = statement.object.id;
				// objectObj = findPath(objectId, publicSpace);
				objectObj = statement.object.value;
			} else {
				objectObj = statement.object.value;
				/*
        objectId = statement.subject + "/" + nanoid(11);
        objectObj = findPath(objectId, publicSpace)
          .get("label")
          .get(lang)
          .put(statement.object.value)
          .back()
          .back();
          */
			}

			//const pred = predicateId.replaceAll(predicateId, "/", ":");
			const pred = predicateId.replace(/\//g, ':');
			console.log('PREDDDDDDDDDD');
			console.log(statement);
			console.log(predicateId);
			console.log(pred);
			findPath(statement.subject, publicSpace)
				.get(pred)
				.put(objectObj, (dd) => {
					callback(dd);
				});

			/*
      const pObj = findPath(statement.subject.id, publicSpace).get(
        predicateId.replaceAll(predicateId, "/", ":")
      );


      */
		});
	}
};

export const publicStore = customStore(publicSpace.map(), {
	createWithLabel: (id, lang, label, cb) => {
		authorize((alias) => {
			const userRef = getUser(alias);
			findPath(id, publicSpace)
				.get('label')
				.get(lang)
				.put(label)
				.back()
				.get('createdBy')
				.set(userRef, cb);
		});
	},
	assert: (data, lang, cb) => common.assert(data, lang, cb),
	create: (id, data, cb) => common.create(id, data, cb, publicSpace),
	read: (id) => common.read(id, publicSpace),
	save: (id, data, nStore) => common.save(id, data, publicSpace, nStore),
	update: (id, data, cb) => common.update(id, data, cb, publicSpace),
	upload: (id, data, cb) => common.upload(id, data, cb, publicSpace),
	delete: (id, cb) => common.delete(id, cb, publicSpace)
});

export const privateStore = customStore(gunUser.map(), {
	assert: (data, lang, cb) => common.assert(data, lang, cb),
	create: (id, data, cb) => common.create(id, data, cb, gunUser),
	read: (id) => common.read(id, gunUser),
	save: (id, data, nStore) => common.save(id, data, gunUser, nStore),
	update: (id, data, cb) => common.update(id, data, cb, gunUser),
	upload: (id, data, cb) => common.upload(id, data, cb, gunUser),
	delete: (id, cb) => common.delete(id, cb, gunUser),
	deleteUser: (alias, password, cb) => {
		gunUser.delete(alias, password, (n) => {
			if (n.err) {
				cb(n);
			} else {
				cb(n);
			}
		});
	},
	register: (formData, cb) => {
		console.log(formData);
		gunUser.create(formData.alias, formData.password, (n) => {
			const newData = { ...formData };
			delete newData.password;

			newData.lastLoginAt = now();
			newData.isLoggedIn = true;

			handleLogin(newData, n, cb);
		});
	},
	login: (alias, password, tenant, cb) => {
		gunUser.auth(alias, password, (n) => {
			handleLogin(
				{
					lastLoginAt: now(),
					isLoggedIn: true,
					alias,
					tenant
				},
				n,
				cb
			);
		});
	},
	logout: (pub, tenant, cb) => {
		publicStore.update(tenant + '/' + PUBLIC_USERS + '/' + pub, { isLoggedIn: false }, (d) => {
			gunUser.leave().once(() => {
				userStore.set(null);
				cb();
			});
		});
	},
	authorize: (cb) => {
		gunUser.once((d) => {
			if (d._ && '#' in d._) {
				cb(d);
			} else {
				cb({ error: 'UNAUTHORIZED' });
				console.error('UNAUTHORIZED ACCESS');
			}
		});
	}
});
