<script>
	import { flip } from 'svelte/animate';
	import { dndzone, TRIGGERS, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	export let items;
	const flipDurationMs = 300;
	let shouldIgnoreDndEvents = false;
	function handleDndConsider(e) {
		// console.warn(`got consider ${JSON.stringify(e.detail, null, 2)}`);
		const { trigger, id } = e.detail.info;
		if (trigger === TRIGGERS.DRAG_STARTED) {
			console.warn(`copying ${id}`);
			const idx = items.findIndex((item) => item.id === id);
			const newId = `${Math.round(Math.random() * 100000)}`;
			//const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`;
			// the line below was added in order to be compatible with version svelte-dnd-action 0.7.4 and above
			e.detail.items = e.detail.items.filter((item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]);
			e.detail.items.splice(idx, 0, { ...items[idx], id: newId });
			items = e.detail.items;
			shouldIgnoreDndEvents = true;
		} else if (!shouldIgnoreDndEvents) {
			items = e.detail.items;
		} else {
			items = [...items];
		}
	}
	function handleDndFinalize(e) {
		// console.warn(`got finalize ${JSON.stringify(e.detail, null, 2)}`);
		if (!shouldIgnoreDndEvents) {
			items = e.detail.items;
		} else {
			items = [...items];
			shouldIgnoreDndEvents = false;
		}
	}
</script>

<section
	use:dndzone={{
		items,
		flipDurationMs,
		dropTargetStyle: {},
		dropTargetClasses: ['dark:border-blue-500', 'border-slate-200']
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each items as item (item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			{item.lastName},
			{item.firstName}
		</div>
	{/each}
</section>
