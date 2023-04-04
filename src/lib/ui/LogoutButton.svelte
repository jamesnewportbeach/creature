<script lang="ts">
	import { privateStore, userStore } from '$lib/stores/gun/store';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import Button from '$lib/common/Button.svelte';
	import Icon from '$lib/common/Icon.svelte';

	const logout = () => {
		privateStore.logout(() => {
			console.log('logged out!!!');
		});
	};
</script>

LOGG: {$userStore}

<Tooltip text="Log out">
	<Button ghost={true} on:click={logout}>
		<Icon classNames="fas fa-sign-out" />
	</Button>
</Tooltip>
