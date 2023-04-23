<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { userLanguage, thingsStore, gun } from '$lib/stores/gun/store';
	import { customStore } from '$lib/stores/gun/customStore';
	import Input from '$lib/common/Input.svelte';
	import Button from '$lib/common/Button.svelte';
	import { RadioGroup, RadioItem } from '@brainandbones/skeleton';
	import { writable } from 'svelte/store';
	import { nanoid } from 'nanoid';
	import Select from '$lib/common/Select.svelte';
	import Svelecte from 'svelecte/src/Svelecte.svelte';

	import { api, data } from '@serverless/cloud';

	api.get('/users', async (req, res) => {
		let users = await data.get('user:*');
		res.send({ users });
	});

	const dispatch = createEventDispatcher();
	const typeStore = writable('text-i18n');

	export let path;

	let newValue,
		newPredicate,
		items = [],
		valueItems = [];

	$: newValue;
	$: newPredicate;

	let ref, store;

	ref = gun.get('things').get('predicates114');
	store = customStore(ref.map(), {
		add: (data) => {
			ref.put(data);
		},
		delete: (id) => ref.get(id).put(null)
	});

	const changePredicate = ({ detail }) => {
			let newId = '';

			if (detail.value === detail.label) {
				let l = {
					label: detail.value
				};
				console.log(l);
				// store.new(l);
			}

			console.log(detail);
			//newPredicate = detail;
		},
		changeValue = ({ detail }) => {
			// newValue = detail;
		},
		addPredicate = () => {
			let o = {};

			if (typeof newValue === 'object') {
				if (newValue.value === newValue.label) {
					o[newPredicate.value] = newValue.value;
				}
			} else {
				o[newPredicate.value] = newValue;
			}

			console.log(o);
			dispatch('add', o);

			newValue = null;
			newPredicate = null;
		};

	let selection = null;
	let value = 'cz';
</script>

{JSON.stringify($store)}

<!-- Svelecte
	options={items}
	inputId="country"
	bind:readSelection={selection}
	bind:value
	on:change={changePredicate}
	placeholder="Select country"
/ -->

<div>Current <code>readSelection</code> value: <b>{JSON.stringify(selection)}</b></div>
<div>Current <code>value</code> value: <b>{value}</b></div>

<div class="flex">
	<div class="grid grid-cols-2 mb-2 gap-5 w-full">
		<Select
			placeholder="Add new attribute..."
			{items}
			on:select={changePredicate}
			bind:value={newPredicate}
		/>
		<!--Input
			id="predicate"
			bind:value={newPredicate}
			on:change={changePredicate}
			type="text"
			placeholder="Add new attribute..."
			list="predicates"
		/ -->
		{#if $typeStore === 'text-i18n'}
			<Select
				placeholder="Enter value..."
				items={valueItems}
				on:select={changeValue}
				bind:value={newValue}
			/>
		{:else}
			<Input
				id="value"
				bind:value={newValue}
				on:change={changeValue}
				type={$typeStore}
				placeholder="Enter value..."
			/>
		{/if}
	</div>

	<Button
		classNames="ml-5 text-xl opacity-50 hover:opacity-100"
		disabled={!newPredicate || !newValue}
		on:click={addPredicate}><i class="fas fa-save" /></Button
	>
</div>

<div class="flex pb-5 border-b border-dotted border-white/20 mb-5 overflow-x-scroll">
	<RadioGroup size="xl" selected={typeStore}>
		<RadioItem value="text-i18n"><i class="fas fa-globe opacity-50 hover:opacity-100" /></RadioItem>
		<RadioItem value="text"><i class="fas fa-text opacity-50 hover:opacity-100" /></RadioItem>
		<RadioItem value="number"><i class="fas fa-hashtag opacity-50 hover:opacity-100" /></RadioItem>
		<RadioItem value="datetime-local"
			><i class="fas fa-calendar-clock opacity-50 hover:opacity-100" /></RadioItem
		>
		<RadioItem value="date"><i class="fas fa-calendar opacity-50 hover:opacity-100" /></RadioItem>
		<RadioItem value="time"><i class="fas fa-clock opacity-50 hover:opacity-100" /></RadioItem>
		<RadioItem value="email"><i class="fas fa-envelope opacity-50 hover:opacity-100" /></RadioItem>
		<RadioItem value="color"><i class="fas fa-palette opacity-50 hover:opacity-100" /></RadioItem>
		<RadioItem value="range"><i class="fas fa-slider opacity-50 hover:opacity-100" /></RadioItem>
		<RadioItem value="checkbox"
			><i class="fas fa-square-check opacity-50 hover:opacity-100" /></RadioItem
		>
	</RadioGroup>
</div>
