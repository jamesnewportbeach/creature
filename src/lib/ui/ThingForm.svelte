<script lang="ts">
	import { gun, t, selectedNode, userLanguage } from '$lib/stores/gun/store';
	import { customStore } from '$lib/stores/gun/customStore';
	import Field from '$lib/common/Field.svelte';
	import Form from '$lib/common/Form.svelte';
	import PredicateInput from './PredicateInput.svelte';

	let thingRef, thingStore;

	selectedNode.subscribe((path) => {
		if (path) {
			thingRef = gun.get('things').path(path.split('/'));
			thingStore = customStore(thingRef.map(), {
				add: (data) => {
					thingRef.put(data);
				},
				delete: (id) => thingRef.get(id).put(null)
			});
		}
	});

	const add = ({ detail }) => {
			thingStore.add(detail.data);
		},
		addPredicate = ({ detail }) => {
			console.log(detail);
			thingStore.add(detail);
		};
</script>

{#if $selectedNode}
	<h2 class="mb-2 text-2xl">
		{$selectedNode.split('/')[$selectedNode.split('/').length - 1]}
		<!--
		{#if $userLanguage && 'label' in $thingStore && $userLanguage in $thingStore.label}{$thingStore
				.label[$userLanguage]}{:else}<i class="opacity-50"
				>{$selectedNode.split('/')[$selectedNode.split('/').length - 1]}</i
			>{/if}-->
	</h2>

	<PredicateInput path={$selectedNode} on:add={addPredicate} />

	<Form classNames="grid grid-cols-2 gap-2">
		{#if $thingStore}
			{#each Object.entries($thingStore) as [key, item] (key)}
				{#if typeof item === 'object'}
					<!-- svelte:self path={path + '/' + key} / -->
				{:else}
					<Field
						on:change={add}
						on:remove={(e) => thingStore.delete(key)}
						disabled={key === 'id'}
						id={key}
						label={key}
						type={typeof item}
						value={item}
						showRemove={true}
					/>
				{/if}
			{/each}
		{/if}
	</Form>
{/if}
