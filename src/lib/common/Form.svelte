<script>
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/stores/translations/i18n';
	import Field from '$lib/common/Field.svelte';

	export let data = {};
	export let classNames = '';

	let values = {};

	const dispatch = createEventDispatcher();

	const submit = (e) => {
		e.preventDefault();
		values = {};
		Object.keys(data).forEach((d) => {
			const val = data[d].value;
			values[d] = val;
		});
		dispatch('submit', values);
	};

	const updateValue = (e, item) => {
		values[item.id] = e.detail.value;
		dispatch('valuesChanged', values);
	};
</script>

<form on:submit|preventDefault={submit} class={classNames}>
	{#each Object.entries(data) as [key, value], index (key)}
		<Field
			id={key}
			label={value.label}
			type={value.type}
			disabled={value.disabled}
			required={value.required}
			bind:value={value.value}
			on:change={(e) => updateValue(e, value)}
		/>
	{/each}

	<slot />
</form>
