<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { privateStore, publicStore, gunUser, gun } from '../stores/gun/gunStore';

	import { activeNodeStore, edgesStore, nodesStore } from '$lib/app-store';

	import MindMap from '$lib/MindMap/MindMap.svelte';
	import Panel from '$lib/Panel/Panel.svelte';
	import Tabs from '$lib/Tabs.svelte';

	let path = '';
	$: path;

	onMount(() => {
		let hostname = 'www';
		let sitename = 'creatureweb.org';
		let path = '';

		if ($page.url.hostname.indexOf('.') > -1) {
			path =
				($page.url.hostname.split('.')[1] === 'localhost'
					? sitename
					: $page.url.hostname.split('.')[1]) +
				'/' +
				$page.url.hostname.split('.')[0];
		} else {
			path = $page.url.hostname === 'localhost' ? sitename : $page.url.hostname;
		}

		if ($page.url.pathname !== '/') {
			path = path + $page.url.pathname;
		}

		console.log(path);

		const pathParts = path.split('/');

		path.split('/').forEach((data, i) => {
			if (data) {
				nodesStore.update((d) => {
					return [...d, ...[{ id: pathParts[i], label: decodeURI(pathParts[i]) }]];
				});

				if (i > 0) {
					edgesStore.update((d) => {
						return [...d, ...[{ source: pathParts[i - 1], target: pathParts[i] }]];
					});
				}

				if (i === pathParts.length - 1) {
					publicStore.read(path).on((d) => {
						console.log('WEEEE REEEADDDD');
						console.log(d);
					});
				}
			}
		});
		// activeNodeStore.set(pathParts[1]);
	});
</script>

<svelte:head>
	<title>Dream for Fi</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex grow text-white">
	<div class="flex-none w-2/3 h-full bg-slate-600">
		Path: {path}

		<MindMap {privateStore} {publicStore} {gunUser} currentPage={path} />
	</div>
	<div class="flex-initial w-1/3 h-full bg-slate-800 z-10">
		<Panel {privateStore} {publicStore} {gunUser} currentPage={path} />
	</div>
</div>

<Tabs currentPage={path} />
