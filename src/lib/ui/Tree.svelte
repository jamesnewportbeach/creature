<script>
	import { nanoid } from 'nanoid';
	import { attributesStore, userStore, gun } from '$lib/stores/gun/store';
	import User from './User.svelte';
	import { page } from '$app/stores';
	import Breadcrumbs from './Breadcrumbs.svelte';

	export let path = '';
	export let expanded = false;
	export let root = true;

	let key = '',
		data = {},
		isEditMode = false;

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';
	$: data;
	$: children = Object.entries(data).filter(
		([_, v]) => v !== null && typeof v === 'object' && _ !== '_'
	);

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
		},
		edit = () => {
			isEditMode = true;
		},
		addNew = () => {
			const newId = nanoid(11);
			const now = new Date();
			if (!expanded) expanded = true;
			gun
				.path(path.split('/'))
				.get(newId)
				.get('date-created')
				.put(now.getTime(), () => {});
		};
</script>

{#if (data && $attributesStore['tenants/links2/' + key]?.type === undefined) || $attributesStore['tenants/links2/' + key]?.type === 'object'}
	<div class="flex w-full py-1 rounded-lg px-2 hover:bg-black/50">
		<button on:click={() => toggleExpanded()} class:invisible={children.length === 0}>
			<i class="fal mr-2" class:fa-chevron-right={!expanded} class:fa-chevron-down={expanded} />
		</button>

		{#if root}
			{#if path !== 'tenants/' + tenant}
				<Breadcrumbs {path} />
			{/if}
			<span contenteditable="true" class="outline-none"
				>{$attributesStore['tenants/links2/' + key]?.label ||
					(key === $userStore?.pub ? $userStore?.alias : key)}</span
			>
		{:else}
			{#if path.indexOf('tenants/' + tenant + '/users/') === 0 && path.split('/').length === 4}
				<User id={path} />
			{:else}
				<span contenteditable="true" class="outline-none">
					{$attributesStore['tenants/links2/' + key]?.label ||
						(key === $userStore?.pub ? $userStore?.alias : key)}
				</span>
			{/if}
			<a href={path.replace('tenants/' + tenant, '')} class="ml-2"><i class="fal fa-link" /></a>
		{/if}

		{#if children.length > 0}
			<span class="ml-2">({children.length})</span>
		{/if}

		<span class="flex-1" />

		{#if !root}
			<button on:click={(e) => gun.path(path.split('/')).put(null)} class="ml-3">
				<i class="fal fa-trash" />
			</button>
		{/if}

		<button on:click={(e) => edit()} class="ml-3">
			<i class="fal fa-edit" />
		</button>
		<button on:click={(e) => addNew()} class="ml-3">
			<i class="fal fa-plus" />
		</button>
	</div>
	{#if expanded}
		<ul class="pl-3">
			{#each children as [key, value], index (key)}
				<li class="flex w-full flex-col">
					<svelte:self root={false} path={path + '/' + key} />
				</li>
			{/each}
		</ul>
	{/if}
{/if}
