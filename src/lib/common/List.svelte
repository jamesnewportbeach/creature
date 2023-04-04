<script>
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	export let itemsData;
	export let itemComponent;
	export let onDrop;
	export let idPropertyName = 'id';
	export let flipDurationMs = 300;

	function handleConsider(e) {
		itemsData = e.detail.items;
	}
	function handleFinalize(e) {
		onDrop(e.detail.items);
	}
</script>

<section
	use:dndzone={{
		items: itemsData,
		flipDurationMs,
		dropTargetStyle: {},
		dropTargetClasses: ['dark:border-blue-500', 'border-slate-200']
	}}
	on:consider={handleConsider}
	on:finalize={handleFinalize}
>
	{#each itemsData as item (item[idPropertyName])}
		<div animate:flip={{ duration: flipDurationMs }}>
			<svelte:component this={itemComponent} {item} />
		</div>
	{/each}
</section>

<style>
	section {
		border: 1px solid blue;
		padding: 0.4em;
		width: 5.2em;
		height: 9em;
	}
</style>
