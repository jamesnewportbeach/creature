<script>
	import { publicStore, getLocalPathName, getPathName } from '$lib/stores/gun/store';
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
	class:text-green-500={user.isLoggedIn}
	class:opacity-50={!user.isLoggedIn}
/><a href={'/' + url} class:opacity-50={!user.isLoggedIn}>{user.label ? user.label : user.alias}</a>
