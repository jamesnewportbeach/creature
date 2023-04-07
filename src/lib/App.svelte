<script>
	import { page } from '$app/stores';
	import { activeNodeStore, edgesStore, nodesStore } from '$lib/stores/ui/app-store';
	import MindMap from '$lib/ui/MindMap/MindMap.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { userStore, usersStore, privateStore, publicStore } from '$lib/stores/gun/store';
	import { onMount, onDestroy } from 'svelte';

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	const beforeUnload = () => {
			if ($userStore) logout();
		},
		logout = () => {
			privateStore.logout($userStore.pub, tenant, () => {
				// console.log('logged out!!!');
			});
		};

	onMount(() => {
		if (tenant) {
			/*
			publicStore.read(tenant).on((d) => {
				let o = Object.fromEntries(Object.entries(d).filter(([_, v]) => v != null && _ !== '_'));
				console.log(o);
			});
			*/

			publicStore.read(tenant + '/users').on((d) => {
				if (d) {
					let o = Object.fromEntries(Object.entries(d).filter(([_, v]) => v != null && _ !== '_'));
					usersStore.set(o);
					if ($userStore && !($userStore.pub in $usersStore)) {
						logout();
					}
				}
				/*
				if (d.length === 1) {
					const u = d[0][1];
					delete u._;
					Object.keys(u).forEach((k) => {
						if (u[k] === null) {
							delete users[k];
						} else {
							if (u[k]['#']) {
								users[k] = u[k]['#'];
							}
						}
					});
					users = d[0][1];
					console.log(users);
				}
				*/
			});
		}
	});
</script>

<svelte:window on:beforeunload={beforeUnload} />

<svelte:head>
	<title>Dream for Fi</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex grow text-white h-full">
	<div class="flex-none w-2/3 h-full bg-slate-600">
		{#if $usersStore}
			{#each Object.entries($usersStore) as [key, item] (key)}
				{#if typeof item === 'object'}
					<div>
						<i class="fal fa-user mr-2" />
						{#if key === $userStore?.pub}
							{$userStore.alias}
						{:else}
							{item['#']}
						{/if}
					</div>
				{/if}
			{/each}
		{/if}

		<!-- MindMap / -->
	</div>
	<div class="flex-initial w-1/3 h-full bg-slate-800 z-10 overflow-y-auto">
		<Panel />
	</div>
</div>
