<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let classNames = '';
	export let ghost = false;
	export let disabled = false;

	function click() {
		dispatch('buttonClick', {});
	}
</script>

<button
	class:btn-ghost={ghost}
	type="button"
	{disabled}
	class={classNames}
	on:click={(e) => click(e)}
>
	<slot />
</button>

<style>
	button {
		border-radius: 10px;
		padding: 5px;
	}
</style>
