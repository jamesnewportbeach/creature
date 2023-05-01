<script>
	import { page } from '$app/stores';
	import Panel from '$lib/ui/Panel.svelte';
	import {
		userStore,
		usersStore,
		privateStore,
		publicStore,
		languageStore
	} from '$lib/stores/gun/store';
	import { onMount } from 'svelte';
	import Tree from './ui/Tree.svelte';
	import Breadcrumbs from './ui/Breadcrumbs.svelte';

	const logout = () => {
		if ($userStore) privateStore.logout($userStore.pub);
	};

	let activePath = '';

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : '';
	$: activePath =
		tenant === ''
			? $page.url.pathname === '/'
				? 'public'
				: 'public' + $page.url.pathname
			: $page.url.pathname === '/'
			? 'public/apps/' + tenant
			: 'public/apps/' + tenant + $page.url.pathname;

	onMount(() => {
		languageStore.set(navigator.language);

		publicStore.read('users').on((d) => {
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
		<!-- MindMap / -->

		<Breadcrumbs path={activePath} />

		<Tree path={activePath} expanded={true} />
	</div>
	<div class="flex-initial w-1/2 h-full bg-slate-800 z-10 overflow-y-auto">
		<Panel />
	</div>
</div>
