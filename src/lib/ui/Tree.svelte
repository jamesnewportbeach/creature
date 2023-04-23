<script>
	import { attributesStore, userStore, gun } from '$lib/stores/gun/store';
	import User from './User.svelte';
	import { page } from '$app/stores';
	import Breadcrumbs from './Breadcrumbs.svelte';

	export let path = '';
	export let expanded = false;
	export let root = true;

	let key = '',
		data = {};

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';
	$: data;

	$: {
		key = path.split('/').pop();
		gun.path(path.split('/')).on((d) => {
			const o = { ...d };
			delete o._;
			data = o;
		});
	}

	const toggleExpanded = () => {
		expanded = !expanded;
	};
</script>

{#if (data && $attributesStore['tenants/links2/' + key]?.type === undefined) || $attributesStore['tenants/links2/' + key]?.type === 'object'}
	<div class="flex w-full py-1">
		{#if path.indexOf('tenants/' + tenant + '/users/') === 0 && path.split('/').length === 4}
			<User id={path} />
		{:else}
			<button on:click={() => toggleExpanded()}>
				<i class="fal mr-2" class:fa-chevron-right={!expanded} class:fa-chevron-down={expanded} />
			</button>

			{#if root}
				{#if path !== 'tenants/' + tenant}
					<Breadcrumbs {path} />
				{/if}
				{$attributesStore['tenants/links2/' + key]?.label ||
					(key === $userStore?.pub ? $userStore?.alias : key)}
			{:else}
				<a href={path.replace('tenants/' + tenant, '')}
					>{$attributesStore['tenants/links2/' + key]?.label ||
						(key === $userStore?.pub ? $userStore?.alias : key)}</a
				>
			{/if}
		{/if}

		<span class="flex-1" />

		<button on:click={(e) => gun.path(path.split('/')).put(null)} class="ml-3">
			<i class="fal fa-trash" />
		</button>
	</div>
	{#if expanded}
		<ul class="pl-3">
			{#each Object.entries(data).filter(([_, v]) => v != null) as [key, value], index (key)}
				<li class="flex w-full flex-col">
					<svelte:self root={false} path={path + '/' + key} />
				</li>
			{/each}
		</ul>
	{/if}
{/if}
