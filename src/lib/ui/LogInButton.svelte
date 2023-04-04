<script lang="ts">
	// import { logout, userPub, userEmail, t } from '$lib/stores/gun/store';
	import Button from '$lib/common/Button.svelte';
	import { goto } from '$app/navigation';

	const signIn = (e) => {
		console.log(e);
		goto('/login');
	};
</script>

<button on:click={(e) => signIn(e)}>Log in</button>
<Button on:buttonClick={signIn}>Log in</Button>
