<script>
	import { flip } from 'svelte/animate';
	import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID } from 'svelte-dnd-action';
	import Caret from '$lib/common/Caret.svelte';
	import { selectedNodes } from '$lib/stores/ui-store';

	export let nodes;
	export let node;

	let showGroup = true;

	const flipDurationMs = 300;

	function handleDndConsider(e) {
		node.items = e.detail.items;
	}

	function handleDndFinalize(e) {
		const d = e.detail;
		const index = d.items.findIndex((item) => 'userId' in item);

		if (index > -1) {
			console.log(d.items[index]);
			nodes[d.items[index].id] = { ...d.items[index] };
			d.items[index] = { id: d.items[index].id };
		}

		node.items = d.items;
		nodes = { ...nodes };
	}
</script>

<svelte:body
	on:click={() => {
		selectedNodes.set([]);
	}} />

{#if node}
	<div
		class="rounded-lg focus:outline-none text-left dark:text-slate-300"
		class:dark:bg-slate-900={$selectedNodes.includes(node.id)}
	>
		<button
			on:click|stopPropagation={() => {
				showGroup = !showGroup;
			}}
		>
			<svg
				fill="currentColor"
				viewBox="0 0 20 20"
				class:-rotate-90={!showGroup}
				class:rotate-0={showGroup}
				class:invisible={!node.hasOwnProperty('items') || node.items.length === 0}
				class="inline w-4 h-4 transition-transform duration-200 transform rotate dark:text-slate-500"
				><path
					fill-rule="evenodd"
					d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/></svg
			>
		</button>

		<button
			on:click|stopPropagation={() => {
				selectedNodes.set([node.id]);
			}}
			>{#if 'label' in node}
				{node.label}
			{:else}
				{node.lastName}, {node.firstName}
			{/if}</button
		>
	</div>

	{#if node.hasOwnProperty('items')}
		<section
			class:hidden={!showGroup}
			style="min-height: 10px;"
			class="h-auto overflow-y-auto border-t border-transparent ml-3"
			use:dndzone={{
				items: node.items,
				flipDurationMs,
				morphDisabled: true,
				centreDraggedOnCursor: false,
				dropTargetStyle: {},
				dropTargetClasses: ['dark:border-blue-500', 'border-slate-200']
			}}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
		>
			{#each node.items.filter((item) => item.id !== SHADOW_PLACEHOLDER_ITEM_ID) as item (item.id)}
				<div animate:flip={{ duration: flipDurationMs }}>
					<svelte:self bind:nodes node={nodes[item.id]} />
				</div>
			{/each}
		</section>
	{/if}
{:else}
	No node
{/if}
