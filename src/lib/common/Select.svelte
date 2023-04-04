<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Select from 'svelte-select';

	export let value;
	export let items;
	export let isMulti = false;
	export let placeholder = 'Choose one...';

	const dispatch = createEventDispatcher();

	const handleSelect = ({ detail }) => {
		dispatch('select', detail);
	};
</script>

<div class="themed">
	<Select
		bind:items
		bind:value
		isCreatable={true}
		{isMulti}
		{placeholder}
		isClearable={true}
		hideEmptyState={true}
		on:select={handleSelect}
	/>
</div>

<style>
	.themed {
		--clearSelectFocusColor: #fff;
		--inputFontSize: small;
		--itemHoverBG: #222;
		--borderRadius: 0;
		--placeholderColor: rgba(255, 255, 255, 0.5);
		--listBackground: black;
		--background: transparent;
		--borderFocusColor: transparent;
		--tw-ring-color: transparent;
		--inputColor: #fff;
		--inputPadding: 0;
		--internalPadding: 0;
		--padding: 0;
		--tw-ring-color: transparent;
	}
</style>
