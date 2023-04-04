<script>
	import { onMount } from 'svelte';
	import { nanoid } from 'nanoid';
	import { page } from '$app/stores';

	import { activeNodeStore, edgesStore, nodesStore } from '$lib/app-store';

	export let currentPage = '';
	export let privateStore;
	export let publicStore;
	export let gunUser;

	let value = '',
		active,
		showBottomStatement = false,
		statementA,
		statementAId,
		statementB;

	$: statementAId;

	function init(el) {
		el.focus();
	}

	const addForm = (e) => {
			if (!statementA) showBottomStatement = false;
			if (e.key === 'Enter') {
				console.log(statementA);
				console.log(statementB);
				showBottomStatement = true;

				if (statementA) {
					submit();
				}
			}
		},
		submit = () => {
			if (statementA && !statementB) {
				const newId = nanoid(11);
				statementAId = newId;
				nodesStore.update((d) => {
					return [...d, ...[{ id: newId, label: statementA }]];
				});
				setTimeout(() => {
					edgesStore.update((d) => {
						return [...d, ...[{ source: $activeNodeStore, target: newId }]];
					});
					value = '';
				}, 100);
			}

			if (statementA && statementB) {
				const newId = nanoid(11);
				nodesStore.update((d) => {
					return [...d, ...[{ id: newId, label: statementB }]];
				});
				setTimeout(() => {
					edgesStore.update((d) => {
						return [...d, ...[{ source: statementAId, target: newId }]];
					});
					value = '';

					statementA = '';
					statementB = '';
					statementAId = '';
					showBottomStatement = false;
				}, 100);
			}
		},
		change = (key) => {
			/*
			nodesStore.update((d) => {
				return d.map((item) => {
					if (item.id !== active.id) {
						return { ...item, ...active };
					} else {
						return item;
					}
				});
			});
*/
			console.log(key);
			console.log(active[key]);
		};

	onMount(() => {});

	$: active = $nodesStore.find((d) => d.id === $activeNodeStore) || {};
	$: currentPage = $page.url.pathname ? $page.url.pathname.toLowerCase() : null;
	$: graph = decodeURI(currentPage.split('/')[1]);
</script>

<form class="p-3" on:submit|preventDefault>
	<div class="relative">
		<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
			<i class="fas fa-search opacity-50" />
		</div>
		<input
			type="text"
			bind:value={graph}
			id="search"
			class="block p-2 pl-10 w-full rounded bg-slate-600"
			required
		/>
		<!-- button type="button" on:click={(e) => submit()} class="absolute right-2.5 bottom-2.5"
			><i class="fas fa-search" /></button
		-->
	</div>
</form>

<h2 class="px-3 mt-3 mb-3 text-3xl">{active?.label}</h2>

<form class="p-3" on:submit|preventDefault>
	<div class="relative">
		<!--div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
			<i class="fas fa-search opacity-50" />
		</div-->
		<input
			type="text"
			bind:value={statementA}
			placeholder={'Say something about ' + active?.label + '...'}
			class="block p-2 w-full rounded bg-slate-600"
			required
			on:keyup={addForm}
		/>
	</div>

	{#if showBottomStatement}
		<div class="relative mt-2">
			<!--div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
			<i class="fas fa-search opacity-50" />
		</div-->
			<input
				type="text"
				use:init
				bind:value={statementB}
				placeholder={'Say something about ' + active?.label + '...'}
				class="block p-2 w-full rounded bg-slate-600"
				required
				on:keyup={addForm}
			/>
			<button type="button" on:click={(e) => submit()} class="absolute right-2.5 bottom-2.5"
				><i class="fas fa-plus" /></button
			>
		</div>
	{/if}
</form>

<h2 class="px-3 mt-3 mb-3 text-sm">Attributes</h2>

<div class="grid grid-cols-2 gap-2 px-3 text-sm">
	{#each Object.entries(active) as [key, value]}
		{#if key !== '__threeObj' && key !== 'index' && key !== 'x' && key !== 'y' && key !== 'z' && key !== 'vx' && key !== 'vy' && key !== 'vz'}
			<div class="grid mb-2">
				<label for="search" class="text-xs block mb-1 capitalize">{key}</label>
				<input
					type="text"
					bind:value={active[key]}
					id="search"
					class="block p-2 w-full rounded bg-slate-600"
					required
					on:keyup={(e) => {
						change(key);
					}}
				/>
			</div>
		{/if}
	{/each}

	{#each $edgesStore.filter((d) => d.source === $activeNodeStore) as item}
		<div class="grid mb-2">
			<label for="search" class="text-xs block mb-1 capitalize">{item.target}</label>
			<div class="block p-2 w-full rounded bg-slate-600">
				{#each $edgesStore.filter((d) => d.source === item.target) as subItem}
					<span class="bg-slate-800 py-1 px-2 rounded-lg"
						>{subItem.target} <i class="ml-1 fas fa-times opacity-50" /></span
					>
				{/each}
			</div>
		</div>
	{/each}
</div>
