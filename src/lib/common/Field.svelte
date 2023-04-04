<script>
	import { createEventDispatcher } from 'svelte';
	import Input from '$lib/common/Input.svelte';
	import Button from '$lib/common/Button.svelte';

	const dispatch = createEventDispatcher();

	export let label = '';
	export let value;
	export let list = '';
	export let placeholder = '';

	export let type = 'text';
	export let id = '';
	export let disabled = false;
	export let required = false;
	export let showRemove = false;

	export let containerClasses = 'mb-2 grid grid-cols-12 gap-3 text-sm';
	export let labelClasses = 'col-span-4 pt-1 opacity-50';
	export let inputClasses = 'col-span-8 w-full py-1 px-2 outline-none rounded';

	let canDelete = false;

	const change = (e) => {
			let o = {};
			o[id] = value;
			dispatch('change', o);
		},
		remove = (e) => {
			dispatch('remove', {});
		};
</script>

<div
	class={containerClasses}
	on:pointerover={() => (canDelete = true)}
	on:pointerout={() => (canDelete = false)}
>
	<Input
		{type}
		{label}
		{id}
		bind:value
		{placeholder}
		{disabled}
		{required}
		{list}
		{labelClasses}
		classNames={inputClasses}
		on:change={change}
	/>
</div>
