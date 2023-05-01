<script>
	import { nanoid } from 'nanoid';
	import { userStore, gun, publicStore } from '$lib/stores/gun/store';
	import User from './User.svelte';
	import Breadcrumbs from './Breadcrumbs.svelte';
	import { activeNodeStore } from '$lib/stores/ui/app-store';
	import Label from './Label.svelte';

	export let path = '';
	export let expanded = false;
	export let root = true;

	let key = '',
		data = {},
		isEditMode = false;

	$: data;
	$: children = Object.entries(data).filter(
		([_, v]) => v !== null && typeof v === 'object' && _ !== '_'
	);

	$: pathArr = path.split('/');

	$: {
		key = pathArr[pathArr.length - 1];

		gun.path(pathArr).on((d) => {
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
			activeNodeStore.set(path);
		},
		remove = () => {
			gun.path(pathArr).put(null);
		},
		addNew = () => {
			const newId = nanoid(11);
			const now = new Date();
			if (!expanded) expanded = true;
			gun
				.path(pathArr)
				.get(newId)
				.get('date-created')
				.put(now.getTime(), () => {});
		};
</script>

<div class="flex w-full py-1 rounded-lg px-2 hover:bg-black/50">
	<button on:click={() => toggleExpanded()} class:invisible={children.length === 0}>
		<i class="fal mr-2" class:fa-chevron-right={!expanded} class:fa-chevron-down={expanded} />
	</button>

	{#if path.indexOf('users/') === 0 && pathArr.length === 4}
		<User id={path} />
	{:else}
		<span contenteditable="true" class="outline-none break-all">
			<Label path={path + '/label'} />
		</span>
	{/if}

	{#if children.length > 0}
		<span class="ml-2 opacity-50">{children.length}</span>
	{/if}

	<span class="flex-1 mr-3" />

	{#if !root}
		<button on:click={(e) => remove()} class="ml-3">
			<i class="fal fa-trash" />
		</button>
	{/if}

	<button on:click={(e) => edit()} class="ml-3">
		<i class="fal fa-edit" />
	</button>
	<button on:click={(e) => addNew()} class="ml-3">
		<i class="fal fa-plus" />
	</button>
	<a href={path} class="ml-2"><i class="fal fa-link" /></a>
</div>

{#if expanded}
	<ul class="pl-3">
		{#each children as [k, value], index (k)}
			<li class="flex w-full flex-col">
				<svelte:self root={false} path={value['#']} />
			</li>
		{/each}
	</ul>
{/if}
