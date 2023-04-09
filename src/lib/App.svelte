<script>
	import { page } from '$app/stores';
	import { activeNodeStore, edgesStore, nodesStore } from '$lib/stores/ui/app-store';
	import MindMap from '$lib/ui/MindMap/MindMap.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { userStore, usersStore, privateStore, publicStore } from '$lib/stores/gun/store';
	import { onMount, onDestroy } from 'svelte';
	import Users from './ui/Users.svelte';

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	const logout = () => {
		if ($userStore) privateStore.logout($userStore.pub, tenant, () => {});
	};

	onMount(() => {
		if (tenant) {
			publicStore.read(tenant + '/users').on((d) => {
				if (d) {
					let o = Object.fromEntries(Object.entries(d).filter(([_, v]) => v != null && _ !== '_'));
					usersStore.set(o);
					if ($userStore && !($userStore.pub in $usersStore)) {
						logout();
					}
				}
			});
		}
	});
</script>

<svelte:window on:beforeunload={logout} />

<svelte:head>
	<title>Dream for Fi</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex grow text-white h-full">
	<div class="flex-none w-1/2 h-full bg-slate-600">
		<Users />
		<!-- MindMap / -->
	</div>
	<div class="flex-initial w-1/2 h-full bg-slate-800 z-10 overflow-y-auto">
		<Panel />
	</div>
</div>
