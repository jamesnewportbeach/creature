<script>
	import {
		attributesStore,
		userStore,
		gun,
		customStore,
		findPath,
		publicStore
	} from '$lib/stores/gun/store';
	import { onDestroy, onMount } from 'svelte';
	import User from './User.svelte';
	import { page } from '$app/stores';

	export let path = '';

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	let expanded = false,
		key;

	const storeRef = gun.path(path.split('/'));

	const currentNodeStore = customStore(storeRef.map(), {
		remove: () => {
			storeRef.put(null, () => {
				console.log('Removed');
			});
		}
	});

	const toggleExpanded = () => {
		expanded = !expanded;
	};

	onDestroy(() => {
		storeRef.off();
	});

	onMount(() => {
		key = path.split('/').pop();
	});
</script>

{#if ($currentNodeStore && $attributesStore['tenants/links2/' + key]?.type === undefined) || $attributesStore['tenants/links2/' + key]?.type === 'object'}
	<div class="flex w-full py-1">
		{#if path.indexOf('tenants/' + tenant + '/users/') === 0 && path.split('/').length === 4}
			<User id={path} />
		{:else}
			<button on:click={() => toggleExpanded()}>
				<i class="fal mr-2" class:fa-chevron-right={!expanded} class:fa-chevron-down={expanded} />
				{$attributesStore['tenants/links2/' + key]?.label ||
					(key === $userStore?.pub ? $userStore?.alias : key)}
			</button>
		{/if}

		<span class="flex-1" />

		<button on:click={(e) => currentNodeStore.remove(path)} class="ml-3">
			<i class="fal fa-trash" />
		</button>
	</div>
	{#if expanded}
		<ul class="pl-3">
			{#each Object.entries($currentNodeStore).filter(([_, v]) => v != null) as [key, value], index (key)}
				<li class="flex w-full flex-col">
					<svelte:self path={path + '/' + key} />
				</li>
			{/each}
		</ul>
	{/if}
{/if}
