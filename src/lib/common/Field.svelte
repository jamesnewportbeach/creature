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

	export let containerClasses = 'mb-2';
	export let labelClasses = 'col-span-2 pt-1 capitalize opacity-50';
	export let inputClasses = '';

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
		on:change={change}
	/>
</div>
