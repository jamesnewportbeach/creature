<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import lz from 'lzutf8';

	import {
		defaultLinks,
		defaultMetaNames,
		defaultMetaProperties
	} from './EditPane/common.interface';

	import { privateStore, publicStore, gunUser } from '../stores/gun/gunStore';

	import { userStore, focusedStore, nodeStore, templateStore } from '../stores/ui/uiStore';

	import { locale } from '../stores/translations/i18n';

	import Ruler from 'svelte-ruler/src/Ruler.svelte';
	import Element from '$lib/App/Element.svelte';
	import Frame from '$lib/App/Frame.svelte';
	import EditPane from '$lib/App/EditPane/EditPane.svelte';

	let links = defaultLinks,
		metaNames = defaultMetaNames,
		metaProperties = defaultMetaProperties,
		title = 'Mogwai Labs',
		metaCharset = 'utf-8',
		ruler,
		lastVersion,
		screen = 'web',
		barWidth = 500,
		timer;

	let nodes = {};

	$: currentPage = $page.url.pathname ? $page.url.pathname.toLowerCase() : null;

	const localStore = {
		update: (id, data, cb) => {
			let o = { ...$userStore };
			o[id.replace('_user/', '')] = data;
			console.log(o);
			userStore.set(o);
		},
		read: (id, cb) => {
			cb($userStore[id]);
		}
	};

	const API = {
		event: (e) => {
			const d = e.detail;
			if (d.name in API) {
				if ('key' in d && $userStore?.pub && d.key.indexOf('_user') === 0) {
					d.key = d.key.replace('_user', '~' + $userStore.pub);
				}

				console.info(d);
				API[d.name](d);
			} else {
				if ($userStore?.pub) console.error('No event named ' + d.name);
			}
		},
		goto: (d) => goto(d.href),
		assert: (d) => {
			console.log('asserting....');
			API.store(d.subject).assert(d, $locale, (m) => {
				console.log(m);
			});
		},
		watchTemplate: (t) => {
			console.log(t);
		},
		create: (d) => API.store(d.key).create(d.key, d.value),
		read: (key) => API.store(key).read(key),
		update: (d) => {
			if (d.key.indexOf('~' + $userStore.pub) === 0) {
				const kParts = d.key.split('/');
				if (kParts.length === 2) {
					const k = kParts[1];
					let o = { ...$userStore };
					o[k] = d.value;
					userStore.set(o);
				}
			}

			clearTimeout(timer);
			timer = setTimeout(() => {
				API.store(d.key).update(d.key, d.value, () => {
					console.log('UPDATED!!!');
				});
			}, 1000);
		},
		delete: (d) => API.store(d.from).delete(d),
		upload: (d) => API.store(d.key).upload(d.key, d.value),
		store: (id) => {
			if ($userStore?.pub) {
				return id && (id.indexOf('~' + $userStore?.pub) === 0 || id.indexOf('_user') === 0)
					? privateStore
					: publicStore;
			} else {
				if (id.indexOf('_user') === 0) {
					return localStore;
				} else {
					return publicStore;
				}
			}
		},
		authorize: (cb) =>
			privateStore.authorize((d) => {
				cb(d);
				// userStore.set(null);
			}),
		logout: (d) => {
			gunUser.leave();
			let o = {
				dark: $userStore.dark,
				panelOpen: $userStore.panelOpen,
				outlines: $userStore.outlines,
				ruler: false,
				theme: $userStore.theme,
				language: $userStore.language
			};
			userStore.set(o);
		},
		login: (d) => {
			gunUser.auth(d.alias, d.password, (n) => {
				if (n.put) {
					//console.log("authing...");
					//console.log(n.put);

					userStore.set(n.put);

					const o = { ...n.put };
					const m = {};
					m['_user'] = o;

					nodeStore.set(m);
				}
				/*
          const o = { pub: n.soul.substring(1) };
          const userObj = { ...u, ...o };
          console.log(userObj);
          userStore.set({
            alias: userObj.alias,
            pub: userObj.pub,
          });
          */
			});
		},
		register: (d) =>
			privateStore.createUser(d.alias, d.password, (n) =>
				n.err ? API.showError(n.err) : API.login(d)
			),
		removeUser: (d) =>
			privateStore.deleteUser(d.alias, d.password, (n) => (n.err ? API.showError(n.err) : {})),
		showError: (err) => {
			console.log(err);
		},

		setBlankTemplate: (path) => {
			let newNodes = {};
			newNodes[path] = {
				id: path,
				tagName: 'div',
				className: 'w-full flex flex-col',
				items: []
			};
			API.storeTemplate(path, newNodes);
		},
		storeTemplate: (path, data) => {
			templateStore.update((s) => {
				let o = {};
				o[path] = data;
				o[path].id = path;
				return { ...s, ...o };
			});

			console.log('TEMPLATE STORED');
			console.log($templateStore);
		},

		saveTemplate: (e) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				console.log(nodes);
				const string = JSON.stringify(nodes);
				const compressed = encodeURIComponent(lz.encodeBase64(lz.compress(string)));
				console.log('saving....');

				API.store(currentPage).update(currentPage, compressed, (d) => {
					console.log('HTML saved');
					console.log(d);
				});
			}, 1000);
		},
		clearTemplate: (e) => {
			nodes[currentPage] = {
				id: currentPage,
				tagName: 'div',
				className: 'w-full flex flex-col',
				items: []
			};
		},
		updateElement: (d) => {
			if ($focusedStore) {
				if (nodes && $focusedStore in nodes) {
					nodes[$focusedStore][d.key] = d.value;
					// API.saveTemplate({});
				}
			}
		},
		removeElement: (d) => {
			Object.keys(nodes).forEach((n) => {
				if (n in nodes && 'items' in nodes[n]) {
					const hasItem = nodes[n].items.find((item) => item.id === d.key);
					if (hasItem) {
						nodes[n].items = nodes[n].items.filter((item) => item.id !== d.key);
						delete nodes[d.key];
					}
				}
				if (currentPage === n && n === d.key) {
					API.clearTemplate({});
				}
			});
			API.saveTemplate({});
		},
		clickElement: (d) => {
			if (nodes && d.key in nodes) focusedStore.set(d.key);
		},
		hoverElement: (d) => {
			if (nodes && d.key in nodes) nodes[d.key].hovered = d.value;
		},
		toggleElementVisiblity: (d) => {
			if (nodes && d.key in nodes) nodes[d.key].layerHidden = !nodes[d.key].layerHidden;
		}
	};

	const load = () => {
		const themeClassPrefix = 'theme-';
		document.body.classList.forEach((className) => {
			if (className.indexOf(themeClassPrefix) === 0) {
				document.body.classList.remove(className);
			}
		});
		document.body.classList.add(themeClassPrefix + ($userStore?.dark ? 'dark' : 'light'));
	};

	$: pageData = {};

	onMount(() => {
		/*
    
    */
	});
</script>

<svelte:head>
	{#if metaCharset}
		<meta charset={metaCharset} />
	{/if}

	{#if title}
		<title>{title}</title>
	{/if}

	{#if metaNames}
		{#each metaNames as metaName}
			<meta name={metaName.name} content={metaName.content} />
		{/each}
	{/if}

	{#if metaProperties}
		{#each metaProperties as metaProperty}
			<meta property={metaProperty.property} content={metaProperty.content} />
		{/each}
	{/if}

	{#if links}
		{#each links as link}
			<link
				rel={link.rel}
				href={link.href}
				sizes={link.sizes}
				type={link.type}
				crossorigin={link['crossorigin'] || undefined}
			/>
		{/each}
	{/if}
</svelte:head>

<svelte:body on:load={load} on:click={() => focusedStore.set(null)} />

<Element
	{API}
	dragDisabled={true}
	dropFromOthersDisabled={true}
	tagName="div"
	className="flex h-full overflow-hidden flex-row w-full fixed bg-black/10 dark:bg-black/90"
>
	<Element
		{API}
		dragDisabled={true}
		dropFromOthersDisabled={true}
		tagName="div"
		className="flex h-full flex-col w-full"
	>
		<Element
			{API}
			dragDisabled={true}
			dropFromOthersDisabled={true}
			tagName="div"
			className="flex h-full flex-col w-full bg-zinc-200 dark:bg-zinc-800"
			style={'width:' + screen === 'mobile' ? '480px' : screen === 'tablet' ? '768px' : '100%'}
		>
			{#if $userStore.pub && $userStore.panelOpen && $userStore.ruler}
				<div class="w-full">
					<Ruler type="horizontal" height={32} bind:this={ruler} />
					<!-- Ruler
              height={32}
              backgroundColor={darkMode
                ? "rgba(0,0,0,.1)"
                : "rgba(255,255,255,.1)"}
              textColor={darkMode ? "rgba(0,0,0,.4)" : "rgba(255,255,255,.4)"}
              lineColor={darkMode ? "rgba(0,0,0,.3)" : "rgba(255,255,255,.3)"}
              type="horizontal"
              ref={rulerRef}
            / -->
				</div>
			{/if}

			<Element
				{API}
				tagName="div"
				className="flex flex-col h-full w-full overflow-auto bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ease-in-out transition-all duration-300"
			>
				<Frame
					{API}
					editorEnabled={'pub' in $userStore}
					templatePath={currentPage}
					on:sendEvent={API.event}
				/>
			</Element>
		</Element>
	</Element>

	<Element
		{API}
		dragDisabled={true}
		dropFromOthersDisabled={true}
		tagName="aside"
		events={{ click: { stopPropagation: {} } }}
		style={'width: ' +
			barWidth +
			'px; opacity: ' +
			($userStore?.panelOpen ? '1' : '0') +
			'; margin-right: ' +
			($userStore?.panelOpen ? 0 : -barWidth) +
			'px'}
		className="h-full flex overfloy-y-auto w-2 border-l border-zinc-300 dark:border-zinc-800 shadow-md flex-col overflow-y-auto bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-white/75 ease-in-out transition-all duration-300"
	>
		<EditPane
			on:sendEvent={API.event}
			bind:nodes
			{pageData}
			{API}
			user={$userStore}
			focused={$focusedStore}
		/>
	</Element>
</Element>

{#if !$userStore.panelOpen}
	<Element
		{API}
		on:sendEvent={API.event}
		dragDisabled={true}
		dropFromOthersDisabled={true}
		tagName="button"
		events={{
			click: { update: { key: '_user/panelOpen', value: true } }
		}}
	>
		<Element
			{API}
			dragDisabled={true}
			dropFromOthersDisabled={true}
			tagName="i"
			style="right: 0; top: 100px;"
			className="fa-light fa-edit bg-black text-white absolute p-2 rounded-l-lg"
		/>
	</Element>
{/if}
