<script>
	import {
		userStore,
		usersStore,
		privateStore,
		publicStore,
		getLocalPathName,
		getPathName
	} from '$lib/stores/gun/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import User from './User.svelte';

	$: path = getPathName($page.url.pathname);
	$: users = $userStore ? Object.entries($usersStore) : [];
</script>

{#if $userStore}
	<div class="p-3">
		<h2>{users.length} Users</h2>
		{#each users as [key, item] (key)}
			{#if typeof item === 'object'}
				<div class="px-2 py-1 rounded-lg" class:bg-slate-500={getLocalPathName(item['#']) === path}>
					{#if key === $userStore?.pub}
						<i class="fal fa-user mr-2 text-green-500" /><a href={'/users/' + $userStore.pub}
							>{$userStore.alias}</a
						> (Me)
					{:else}
						<User id={item['#']} />
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{/if}
