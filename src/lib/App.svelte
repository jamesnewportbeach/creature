<script>
	import { page } from '$app/stores';
	import { activeNodeStore, edgesStore, nodesStore } from '$lib/stores/ui/app-store';
	import MindMap from '$lib/ui/MindMap/MindMap.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { userStore, usersStore, privateStore, publicStore } from '$lib/stores/gun/store';
	import { onMount, onDestroy } from 'svelte';
	import Users from './ui/Users.svelte';
	import Tree from './ui/Tree.svelte';
	import Breadcrumbs from './ui/Breadcrumbs.svelte';

	const logout = () => {
		if ($userStore) privateStore.logout($userStore.pub, tenant, () => {});
	};

	let activePath = '';

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';
	$: activePath = 'tenants/' + tenant + ($page.url.pathname === '/' ? '' : $page.url.pathname);

	onMount(() => {
		publicStore.read(tenant + '/users').on((d) => {
			if (d) {
				let o = Object.fromEntries(Object.entries(d).filter(([_, v]) => v != null && _ !== '_'));
				usersStore.set(o);
				if ($userStore && !($userStore.pub in $usersStore)) {
					logout();
				}
			}
		});
	});
</script>

<svelte:window on:beforeunload={logout} />

<svelte:head>
	<title>Dream for Fi</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex grow text-white h-full">
	<div class="flex-none w-1/2 h-full bg-slate-600 p-3">
		<Users />
		<!-- MindMap / -->

		<Breadcrumbs path={activePath} />
		<br />

		<Tree path={activePath} />
	</div>
	<div class="flex-initial w-1/2 h-full bg-slate-800 z-10 overflow-y-auto">
		<Panel />
	</div>
</div>
