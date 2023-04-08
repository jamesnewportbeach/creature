<script>
	import { createEventDispatcher } from 'svelte';
	import Input from '$lib/common/Input.svelte';
	import Button from '$lib/common/Button.svelte';
	import Icon from './Icon.svelte';

	const dispatch = createEventDispatcher();

	export let label = '';
	export let value;
	export let list = '';
	export let placeholder = '';

	export let type = 'text';
	export let id = '';

	export let disabled = false;
	export let required = false;
	export let readonly = false;
	export let disableDelete = true;

	export let containerClasses = 'mb-2 flex text-xs';
	export let labelClasses = 'w-1/3 pt-1 opacity-50 break-all pr-2';
	export let inputClasses = 'w-2/3 py-1 px-2 outline-none rounded bg-slate-600 break-all';

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
		{readonly}
		{disabled}
		{required}
		{list}
		{labelClasses}
		classNames={inputClasses}
		on:change={change}
	/>
	{#if !disableDelete}
		<Button ghost={true} on:buttonClick={remove} classNames="text-sm p-2 ml-1">
			<i class="fal fa-times" />
		</Button>
	{/if}
</div>
