<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	import Element from '$lib/App/Element.svelte';
	import AddData from '$lib/App/EditPane/Data/AddData.svelte';
	import { locale, t } from '../../../stores/translations/i18n';

	const dispatch = createEventDispatcher();

	export let id;
	export let data;
	export let root = false;
	export let API;
	export let showAddForm = false;

	$: expanded = false;
	$: label = '';
	$: items = {};

	const remove = (e) => {
		e.stopPropagation();
		dispatch('sendEvent', {
			name: 'delete',
			key: id
		});
	};

	onMount(() => {
		API.read(id + '/label/' + $locale).on((d) => {
			if (d) {
				label = d;
			} else {
				label = id;
			}
		});

		if (!data) {
			API.read(id).on((d) => {
				const o = { ...d };
				delete o._;
				items = { ...items, ...o };
				console.log(items);
			});
		} else {
			items = data;
		}
	});
</script>

<div class="mb-1">
	{#if !root}
		<div class="flex items-center">
			<button on:click={() => (expanded = !expanded)} class="p-2"
				><i class="fa-solid fa-chevron-{expanded ? 'down' : 'right'} mr-2" /></button
			>
			<span class="w-full">{label ? label : id} : {id}</span>
			<button on:click={(e) => remove(e)} class="p-2"><i class="fa-solid fa-times mr-2" /> </button>
		</div>
	{/if}

	{#if showAddForm}
		<AddData {API} {id} on:sendEvent />
	{/if}

	{#each Object.keys(items).filter((d) => d !== 'html' && typeof items[d] !== 'object' && items[d] !== null) as key}
		<Element
			bind:value={items[key]}
			on:sendEvent
			{API}
			dragDisabled={true}
			dropFromOthersDisabled={true}
			tagName="input"
			type="text"
			parentId={id}
			id={key}
			labelPath={key.replace(/:/g, '/')}
			className="flex"
			labelClassName="opacity-50 w-1/3"
			removeButton={true}
		/>
	{/each}

	{#if (expanded || root) && Object.keys(items).filter((d) => d !== 'html' && typeof items[d] === 'object' && items[d] !== null)}
		<div class={root ? '' : 'ml-3'}>
			{#each Object.keys(items).filter((d) => d !== 'html' && typeof items[d] === 'object' && items[d] !== null) as key}
				<svelte:self id={items[key]['#']} {API} on:sendEvent />
			{/each}
		</div>
	{/if}
</div>
