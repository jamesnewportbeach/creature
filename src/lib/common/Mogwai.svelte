<script lang="ts">
	import { page } from '$app/stores';
	import { gun, selectedNode, userPub, userLanguage } from '$lib/stores/gun/store';
	import { customStore } from '$lib/stores/gun/customStore';
	import { nanoid } from 'nanoid';
	import LanguageLabel from '$lib/ui/LanguageLabel.svelte';

	export let path;

	const thingRef = gun.get('things').path(path.split('/'));

	const thingStore = customStore(thingRef.map(), {
		add: () => {
			const newId = nanoid(11);
			thingRef.get(newId).put({ id: newId });
		},
		delete: () => {
			if ($selectedNode === path) selectedNode.set(null);
			thingRef.put(null);
		}
	});

	const selectNode = () => {
		selectedNode.set(path);
	};

	thingStore.subscribe((d) => {
		//console.log(path);

		if (typeof d !== 'object') console.log(typeof d);
	});
</script>

<div class="pl-4">
	<div
		class="flex text-sm px-3 py-1 rounded-full"
		class:hover:bg-slate-700={$selectedNode !== path}
		class:shadow-lg={$selectedNode === path}
		class:bg-slate-800={$selectedNode === path}
	>
		<h2 class="w-full cursor-pointer" on:click|stopPropagation={selectNode}>
			<LanguageLabel {path} />
			<!--
			{#if $userLanguage? && 'label' in $thingStore && $userLanguage in $thingStore.label}{$thingStore
					.label[$userLanguage]}{:else}<i class="opacity-50"
					>{path.split('/')[path.split('/').length - 1]}</i
				>{/if}-->
		</h2>

		{#if $userPub}
			{#if $page.params.slug !== path}
				<button type="button" on:click|stopPropagation={() => thingStore.delete()}
					><i class="fas fa-trash" /></button
				>
			{/if}

			<button type="button" on:click|stopPropagation={() => thingStore.add()} class="ml-4"
				><i class="fas fa-plus" /></button
			>
		{/if}
	</div>

	{#each Object.entries($thingStore) as [key, item] (key)}
		{#if typeof item === 'object'}
			<svelte:self path={path + '/' + key} />
		{/if}
	{/each}
</div>
