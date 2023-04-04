<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { privateStore, publicStore, gunUser } from '$lib/stores/gun/gunStore';
	import { activeNodeStore, edgesStore, nodesStore } from '$lib/app-store';

	import MindMap from '$lib/MindMap/MindMap.svelte';
	import Panel from '$lib/Panel/Panel.svelte';
	import Tabs from '$lib/Tabs.svelte';
	import Login from '$lib/ui/Login.svelte';
	import Register from '$lib/ui/Register.svelte';

	let path = '';
	$: path = formatPath($page.url);

	function formatPath(p) {
		let sitename = 'creatureweb.org';
		let path = '';

		if (p.hostname.indexOf('.') > -1) {
			path =
				(p.hostname.split('.')[1] === 'localhost' ? sitename : $page.url.hostname.split('.')[1]) +
				'/' +
				p.hostname.split('.')[0];
		} else {
			path = p.hostname === 'localhost' ? sitename : p.hostname;
		}

		if (p.pathname !== '/') {
			path = path + p.pathname;
		}
		return path;
	}

	onMount(() => {
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
					publicStore.read(path).once((d) => {
						if (d) {
							console.log(d);
						} else {
							console.log('Doesnt exist');
						}
					});
				}
			}
		});
		activeNodeStore.set(pathParts[pathParts.length - 1]);
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
		<Login />
		<Register />
		<Panel {privateStore} {publicStore} {gunUser} currentPage={path} />
	</div>
</div>

<Tabs currentPage={path} />
