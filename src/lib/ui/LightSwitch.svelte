<script>
	import { darkMode } from '$lib/stores/gun/store';
	import Button from '$lib/common/Button.svelte';
	import Icon from '$lib/common/Icon.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';

	const toggleDarkMode = (e) => {
		console.log(e);
		darkMode.set(!$darkMode);
		console.log($darkMode);
	};
</script>

<Tooltip text="{$darkMode ? 'Light' : 'Dark'} Mode">
	<Button ghost={true} on:click={(e) => toggleDarkMode(e)}>
		<Icon classNames="fas fa-{$darkMode ? 'moon' : 'sun'}" />
	</Button>
</Tooltip>
