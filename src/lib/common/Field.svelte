<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { userStore, gun, publicStore, languageStore } from '$lib/stores/gun/store';
	import { goto } from '$app/navigation';
	import Input from '$lib/common/Input.svelte';
	import Button from '$lib/common/Button.svelte';
	import Icon from './Icon.svelte';
	import User from '$lib/ui/User.svelte';

	const dispatch = createEventDispatcher();

	export let value;
	export let list = '';
	export let placeholder = '';

	export let id = '';

	export let disabled = false;
	export let required = false;
	export let readonly = false;
	export let disableDelete = true;

	export let containerClasses = 'mb-2 flex text-xs';
	export let labelClasses = 'w-1/3 pt-1 opacity-50 break-all pr-2';
	export let inputClasses = 'w-2/3 py-1 px-2 outline-none rounded bg-slate-600 break-all';

	let canDelete = false,
		localValue,
		data = {},
		label = '',
		type = 'text';

	$: data;
	$: label;

	$: {
		if (value) {
			const dateTypes = ['datetime-local', 'date', 'time', 'week', 'month'];
			if (dateTypes.indexOf(type) > -1) {
				localValue = formatDate(value);
			} else {
				localValue = value;
			}
		}

		gun
			.get('public')
			.get('properties')
			.get(id)
			.once((d) => {
				data = d;
				label = (d && d['label@' + $languageStore]) || id;
				type = (d && d['input-type']) || 'text';
			});
	}

	const change = (e) => {
			let o = {};
			o[id] = e.detail.value;
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
		{#if value['#'].indexOf('users/') === 0 && value['#'].split('/').length === 4}
			<User id={value['#']} />
		{:else}
			<button
				on:click={() => linkTo(value['#'])}
				class="btn-ghost break-all text-left rounded-lg px-2 py-1">{id}</button
			>
		{/if}
	{:else}
		<Input
			{type}
			{id}
			value={localValue}
			{label}
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

	{#if !disableDelete}
		<div class="flex-grow" />
		<Button ghost={true} on:buttonClick={remove} classNames="text-sm p-2 ml-1">
			<i class="fal fa-times" />
		</Button>
	{/if}
</div>
