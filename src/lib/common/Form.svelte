<script>
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/stores/translations/i18n';
	import Field from '$lib/common/Field.svelte';

	export let data = {};
	export let disableDelete = true;
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

	const updateValue = (e, key, item) => {
			// values[key] = item.value;
			dispatch('valueChanged', e.detail);
			dispatch('valuesChanged', values);
		},
		removeValue = (e, key) => {
			dispatch('removeAttribute', { key });
		};
</script>

<form on:submit|preventDefault={submit} class={classNames}>
	{#each Object.entries(data) as [key, value], index (key)}
		<Field
			id={key}
			{disableDelete}
			disabled={value.disabled}
			required={value.required}
			readonly={value.readonly}
			bind:value={value.value}
			on:change={(e) => updateValue(e, key, value)}
			on:remove={(e) => removeValue(e, key)}
		/>
	{/each}

	<slot />
</form>
