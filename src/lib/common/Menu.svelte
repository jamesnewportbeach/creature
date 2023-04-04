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

<span>Level 1</span>

<ul
	class="menu menu-horizontal bg-base-100 rounded-box p-2"
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
		<li animate:flip={{ duration: flipDurationMs }}>
			<svelte:component this={itemComponent} {item} />
		</li>
	{/each}
</ul>
