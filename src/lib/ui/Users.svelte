<script>
	import { userStore, usersStore, getLocalPathName, getPathName } from '$lib/stores/gun/store';
	import { page } from '$app/stores';
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
					<User id={item['#']} />
				</div>
			{/if}
		{/each}
	</div>
{/if}
