<script>
	import { onMount } from 'svelte';
	import { activeNodeStore } from '$lib/stores/ui/app-store';
	import { publicStore, gun, gunUser, languageStore } from '$lib/stores/gun/store';
	import Select from 'svelte-select';
	import { nanoid } from 'nanoid';
	import Tree from './Tree.svelte';

	export let path = '';

	const newId = nanoid(11);

	let attributesLocation = 'properties',
		attributes = [],
		filterText = '',
		value = '',
		statementA,
		attributeType,
		statementB,
		statementBInput,
		statementBTextarea;

	const inputTypes = [
		{ value: 'text', label: 'Text' },
		{ value: 'object', label: 'Object' },
		{ value: 'number', label: 'Number' },
		{ value: 'color', label: 'Color' },
		{ value: 'email', label: 'Email' },
		{ value: 'tel', label: 'Phone' },
		{ value: 'date', label: 'Date' },
		{ value: 'datetime-local', label: 'Date & Time' },
		{ value: 'time', label: 'Time' },
		{ value: 'week', label: 'Week' },
		{ value: 'month', label: 'Month' },
		{ value: 'url', label: 'Url' },
		{ value: 'range', label: 'Range' },
		{ value: 'password', label: 'Password' },
		{ value: 'checkbox', label: 'Checkbox' }
	];

	function handleFilter(e) {
		if (e.detail.length === 0 && filterText.length > 0) {
			const prev = attributes.filter((i) => !i.created);
			attributes = [...prev, { value: filterText, label: filterText, created: true }];
		}
	}

	function handleChange(e) {
		if ('input-type' in e.detail) {
			attributeType = inputTypes.find((d) => d.value === e.detail['input-type']);
		}
		attributes = attributes.map((i) => {
			delete i.created;
			return i;
		});
	}

	const addForm = (e) => {
			statementB = e.target.value;
			if (e.key === 'Enter') {
				if (statementA && statementB) {
					submit();
				}
			}
		},
		reset = () => {
			value = '';
			statementA = null;
			statementB = null;
			if (statementBTextarea) statementBTextarea.value = '';
			if (statementBInput) statementBInput.value = '';
			attributeType = { ...inputTypes[0] };
		},
		submit = () => {
			if (statementA && statementB) {
				if (statementA.value === statementA.label) {
					// Create a new predicate...

					const predicate = statementA.value.replaceAll(' ', '-').toLowerCase();

					const now = new Date();

					const o = {
						'input-type': attributeType.value,
						'created-at': now.getTime()
					};
					o['label@' + $languageStore] = statementA.label;

					publicStore.create(attributesLocation + '/' + predicate, o, () => {
						publicStore.create($activeNodeStore + '/' + predicate, statementB, () => {
							reset();
						});
					});
				} else {
					const predicate = statementA.value.split('/').pop();

					console.log($activeNodeStore + '/' + predicate);

					gun.path(($activeNodeStore + '/' + predicate).split('/')).put(statementB, () => {
						reset();
					});
				}
			} else {
				alert('Nada');
			}
		};

	$: attributesObj = {};
	$: attributes = Object.entries(attributesObj).map((d) => d[1]);

	onMount(() => {
		attributeType = { ...inputTypes[0] };

		publicStore
			.read('properties')
			.map()
			.on((d) => {
				if (d && d._) {
					const p = d._['#'].split('/');
					attributesObj[d._['#']] = {
						value: d._['#'],
						'input-type': d['input-type'],
						label: d['label@' + $languageStore] || p[p.length - 1]
					};
				}
			});
	});
</script>

<form
	on:submit|preventDefault
	class="grid grid-cols-12 gap-3 mb-2 text-xs"
	autocomplete="chrome-off"
>
	<div class="col-span-4 styled">
		<Select
			on:change={handleChange}
			on:filter={handleFilter}
			bind:filterText
			inputAttributes={{
				autocomplete: 'chrome-off',
				'aria-autocomplete': 'chrome-off',
				name: newId + 'predicate'
			}}
			items={attributes}
			hideEmptyState={true}
			bind:value={statementA}
		>
			<div slot="item" let:item>
				{item.created ? 'Create ' + item.label + ' property' : item.label}
			</div></Select
		>
	</div>

	<div class="col-span-2 styled">
		<Select
			disabled={statementA?.value !== statementA?.label}
			items={inputTypes}
			inputAttributes={{ autocomplete: 'chrome-off', name: newId + 'attributeType' }}
			bind:value={attributeType}
			clearable={false}
		/>
	</div>

	<div class="col-span-5">
		{#if attributeType && attributeType?.value !== 'object'}
			{#if attributeType.value === 'text'}
				<textarea
					placeholder={'Value'}
					class="w-full py-1 px-2 outline-none rounded bg-slate-600"
					required
					on:input={addForm}
					bind:this={statementBTextarea}
				/>
			{:else}
				<input
					type={attributeType.value}
					autocomplete={attributeType.value === 'password' ? 'new-password' : 'off'}
					placeholder={'Value'}
					class="w-full py-1 px-2 outline-none rounded bg-slate-600"
					required
					bind:this={statementBInput}
					on:input={addForm}
				/>
			{/if}
		{/if}

		{#if attributeType && attributeType?.value === 'object'}
			Obj
			<!-- Tree / -->
		{/if}
	</div>

	<div class="col-span-1">
		<button
			disabled={!statementA || !statementB}
			type="button"
			on:click={(e) => submit()}
			class="uppercase text-sm"><i class="fas fa-plus mr-1" />Add</button
		>
	</div>
</form>

<style>
	button[disabled] {
		cursor: not-allowed;
	}
	.styled {
		--font-size: 11px;
		--item-padding: 0;
		--item-hover-bg: #333;
		--item-padding: 0 10px;
		--selected-item-padding: 0 0px;
		--border: solid 1px rgba(255, 255, 255, 0.1);
		--disabled-border-color: rgba(255, 255, 255, 0.1);
		--disabled-color: rgba(255, 255, 255, 0.5);
		--height: 32px;
		--padding: 0 8px;
		--background: transparent;
		--disabled-background: transparent;
		--input-color: inherit;
		--input-padding: inherit;
		--list-background: #000;
		--input-font-size: inherit;
	}
</style>
