<script>
	import { createEventDispatcher, onMount } from 'svelte';
	// import { userStore } from '$lib/stores/ui/uiStore';
	// import { customStore } from '$lib/stores/gun/customStore';

	const dispatch = createEventDispatcher();

	export let value;
	export let list = '';
	export let label = 'Label';
	export let placeholder = '';

	export let type = 'text';
	export let id = '';
	export let disabled = false;
	export let readonly = false;
	export let required = false;
	export let classNames = '';
	export let labelClasses = '';

	const change = (e) => {
		dispatch('change', { value });
	};

	let ref, store;

	onMount(() => {
		if (list) {
			/*
			ref = gun.get(list);
			store = customStore(ref.map(), {
				add: (data) => {
					ref.put(data);
				},
				delete: (id) => ref.get(id).put(null)
			});
			*/
		}
	});
</script>

{#if label}
	<label for={id} class={labelClasses}>
		{label}
	</label>
{/if}

{#if type === 'text' || type === 'string' || type === 'text-i18n'}
	{#if value?.length > 50}
		<textarea
			list={id + '-list'}
			{id}
			bind:value
			rows={3}
			{placeholder}
			readonly={readonly ? true : undefined}
			disabled={disabled ? true : undefined}
			{required}
			class={classNames}
			on:keyup={change}
		/>
	{:else}
		<input
			list={id + '-list'}
			type="text"
			{id}
			bind:value
			{placeholder}
			readonly={readonly ? true : undefined}
			disabled={disabled ? true : undefined}
			{required}
			class={classNames}
			on:keyup={change}
		/>
	{/if}
{/if}

{#if type === 'date'}
	<input
		type="date"
		{id}
		bind:value
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		class={classNames}
		on:keyup={change}
	/>
{/if}

{#if type === 'datetime-local'}
	<input
		type="datetime-local"
		{id}
		bind:value
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		class={classNames}
		on:keyup={change}
	/>
{/if}

{#if type === 'time'}
	<input
		type="time"
		{id}
		bind:value
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		class={classNames}
		on:keyup={change}
	/>
{/if}

{#if type === 'color'}
	<input
		type="color"
		{id}
		bind:value
		{placeholder}
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		class={classNames}
		on:keyup={change}
		on:change={change}
	/>
{/if}
{#if type === 'number'}
	<input
		type="number"
		{id}
		bind:value
		{placeholder}
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		class={classNames}
		on:keyup={change}
	/>
{/if}
{#if type === 'email'}
	<input
		type="email"
		{id}
		bind:value
		{placeholder}
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		class={classNames}
		on:keyup={change}
	/>
{/if}
{#if type === 'range'}
	<input
		type="range"
		{id}
		bind:value
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		on:change={change}
	/>
{/if}
{#if type === 'password'}
	<input
		type="password"
		{id}
		bind:value
		{placeholder}
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		class={classNames}
		on:keyup={change}
	/>
{/if}

{#if type === 'checkbox'}
	<input
		type="checkbox"
		{id}
		bind:checked={value}
		readonly={readonly ? true : undefined}
		disabled={disabled ? true : undefined}
		{required}
		class:mt-1={true}
		on:change={change}
	/>
	<div class="flex-grow" />
{/if}

{#if type === 'object'}
	<div class={classNames}>{value}</div>
{/if}

{#if list}
	<!-- datalist id={id + '-list'}>
		{#if $store}
			{#each Object.entries($store) as [key, item] (key)}
				<option value={item[$userLanguage]} />
			{/each}
		{/if}
	</datalist -->
{/if}
