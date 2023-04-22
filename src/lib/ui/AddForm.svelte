<script>
	import { onMount } from 'svelte';
	import { activeNodeStore } from '$lib/stores/ui/app-store';
	import { publicStore, attributesStore } from '$lib/stores/gun/store';
	import Select from 'svelte-select';

	let attributesLocation = 'links2',
		filterText = '',
		value = '',
		language = 'en',
		statementA,
		attributeType,
		statementB,
		statementBInput,
		statementBTextarea;

	const attributeTypes = [
		{ value: 'text', label: 'Text' },
		{ value: 'number', label: 'Number' },
		{ value: 'color', label: 'Color' },
		{ value: 'range', label: 'Range' },
		{ value: 'date', label: 'Date' },
		{ value: 'time', label: 'Time' },
		{ value: 'datetime-local', label: 'Date & Time' },
		{ value: 'week', label: 'Week' },
		{ value: 'email', label: 'Email' },
		{ value: 'tel', label: 'Phone' },
		{ value: 'url', label: 'Url' },
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
		if ('type' in e.detail) {
			attributeType = attributeTypes.find((d) => d.value === e.detail.type);
		} else {
			// attributeType =
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
		},
		submit = () => {
			if (statementA && statementB) {
				if (statementA.value === statementA.label) {
					// Create a new predicate...

					const predicate = statementA.value.replaceAll(' ', '-').toLowerCase();

					const o = {
						type: attributeType.value
					};
					o['label@' + language] = statementA.label;

					publicStore.create(attributesLocation + '/' + predicate, o, () => {
						publicStore.create($activeNodeStore + '/' + predicate, statementB, () => {
							reset();
						});
					});
				} else {
					const predicate = statementA.value.split('/').pop();

					publicStore.create($activeNodeStore + '/' + predicate, statementB, () => {
						reset();
					});
				}
			} else {
				alert('Nada');
			}
		};

	$: attributes = Object.entries($attributesStore).map((d) => {
		d[1].value = d[0];
		return d[1];
	});

	onMount(() => {
		publicStore
			.read(attributesLocation)
			.map()
			.once((d) => {
				if (d) {
					attributesStore.update((orig) => {
						orig[d._['#']] = {
							label: d['label@' + language],
							type: d.type
						};
						return orig;
					});
				}
			});

		attributeType = { ...attributeTypes[0] };
	});
</script>

<form on:submit|preventDefault class="grid grid-cols-12 gap-3 mb-2 text-xs" autocomplete="off">
	<div class="col-span-4 styled">
		<Select
			on:change={handleChange}
			on:filter={handleFilter}
			bind:filterText
			inputAttributes={{ autocomplete: 'off' }}
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
		<Select items={attributeTypes} bind:value={attributeType} clearable={false} />
	</div>

	<div class="col-span-5">
		{#if attributeType}
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
	</div>

	<div class="col-span-1">
		<button type="button" on:click={(e) => submit()} class="uppercase text-sm"
			><i class="fas fa-plus mr-1" />Add</button
		>
	</div>
</form>

<style>
	.styled {
		--font-size: 11px;
		--item-padding: 0;
		--item-hover-bg: #333;
		--item-padding: 0 8px;
		--border: solid 1px rgba(255, 255, 255, 0.1);
		--height: 32px;
		--padding: 0 8px;
		--background: transparent;
		--input-color: inherit;
		--input-padding: inherit;
		--list-background: #000;
		--input-font-size: inherit;
	}
</style>
