<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let type = 'button';
	export let classNames = '';
	export let ghost = false;
	export let disabled = false;
	export let selected = false;

	function click(e) {
		console.log('clicking....');
		dispatch('buttonClick', {});
	}
</script>

<button
	class:btn={true}
	class:btn-ghost={ghost}
	type="button"
	{disabled}
	class={classNames}
	on:click={(e) => click(e)}
>
	<slot />
</button>
