<script>
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import Input from '$lib/common/Input.svelte';
	import Button from '$lib/common/Button.svelte';
	import Icon from './Icon.svelte';
	import { page } from '$app/stores';
	import User from '$lib/ui/User.svelte';

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

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	let canDelete = false,
		localValue;

	$: {
		if (value) {
			const dateTypes = ['datetime-local', 'date', 'time', 'week', 'month'];
			if (dateTypes.indexOf(type) > -1) {
				localValue = formatDate(value);
			} else {
				localValue = value;
			}
		}
	}

	const change = (e) => {
			let o = {};
			o[id] = value;
			dispatch('change', o);
		},
		remove = (e) => {
			dispatch('remove', {});
		},
		linkTo = (p) => {
			const pathParts = p.split('/');
			const tenant = pathParts.shift();
			const tenants = pathParts.shift();
			goto(pathParts.join('/'));
		},
		formatDate = (d) => {
			const now = new Date(d);
			if (now.getMonth()) {
				now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
				return now.toISOString().slice(0, 16);
			} else {
				return '';
			}
		};
</script>

<div
	class={containerClasses}
	on:pointerover={() => (canDelete = true)}
	on:pointerout={() => (canDelete = false)}
>
	{#if typeof value === 'object'}
		{#if value['#'].indexOf('tenants/' + tenant + '/users/') === 0 && value['#'].split('/').length === 4}
			<User id={value['#']} />
		{:else}
			<button
				on:click={() => linkTo(value['#'])}
				class="btn-ghost break-all text-left rounded-lg px-2 py-1">{value['#']}</button
			>
		{/if}
	{:else}
		<Input
			{type}
			{label}
			{id}
			value={localValue}
			{placeholder}
			{readonly}
			{disabled}
			{required}
			{list}
			{labelClasses}
			classNames={inputClasses}
			on:change={change}
		/>
	{/if}

	<div class="flex-grow" />

	{#if !disableDelete}
		<Button ghost={true} on:buttonClick={remove} classNames="text-sm p-2 ml-1">
			<i class="fal fa-times" />
		</Button>
	{/if}
</div>
