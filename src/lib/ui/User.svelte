<script>
	import { publicStore, getLocalPathName, getPathName, userStore } from '$lib/stores/gun/store';
	import { onMount } from 'svelte';

	export let id = '';

	let user = {};

	$: user;
	$: userId = getPathName(id);
	$: url = getLocalPathName(id);

	onMount(() => {
		if (userId && id) {
			publicStore.read(userId).on((d) => {
				if (d) {
					delete d._;
					d.id = userId;
					const idParts = userId.split('/');
					const pub = idParts.pop();

					d.pub = pub;
					user = d;
				} else {
					user = {};
				}
			});
		}
	});
</script>

<i
	class="fal fa-user mr-2"
	class:text-green-500={user['logged-in']}
	class:opacity-50={!user['logged-in']}
/><span class:opacity-50={!user['logged-in']}>{user.label ? user.label : user.alias}</span>
{#if user.pub === $userStore?.pub}
	<span class="ml-2 opacity-50">(Me)</span>
{/if}
