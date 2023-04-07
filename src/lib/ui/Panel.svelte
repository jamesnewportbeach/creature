<script>
	import { onMount } from 'svelte';
	import { nanoid } from 'nanoid';
	import { page } from '$app/stores';
	import { activeNodeStore, edgesStore, nodesStore } from '$lib/stores/ui/app-store';
	import { userStore, privateStore, publicStore } from '$lib/stores/gun/store';
	import Form from '$lib/common/Form.svelte';
	import Login from '$lib/ui/Login.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import Button from '$lib/common/Button.svelte';
	import Icon from '$lib/common/Icon.svelte';

	import { formatPath } from '$lib/ui/utils';

	let value = '',
		statementA,
		statementAId,
		statementB;

	$: statementAId;

	function init(el) {
		el.focus();
	}

	const signOut = () => {
			if ($userStore)
				privateStore.logout($userStore.pub, tenant, () => {
					//console.log('logged out!!!');
				});
		},
		addForm = (e) => {
			// if (!statementA) showBottomStatement = false;
			if (e.key === 'Enter') {
				console.log(statementA);
				console.log(statementB);
				// showBottomStatement = true;

				if (statementA) {
					submit();
				}
			}
		},
		submit = () => {
			//console.log(statementA);
			console.log(statementB);
			console.log(path + '/' + statementA);

			if (statementA && !statementB) {
				const newId = nanoid(11);
				statementAId = newId;

				/*
				nodesStore.update((d) => {
					return [...d, ...[{ id: newId, label: statementA }]];
				});
				setTimeout(() => {
					edgesStore.update((d) => {
						return [...d, ...[{ source: $activeNodeStore, target: newId }]];
					});
					value = '';
				}, 100);
				*/
			}

			if (statementA && statementB) {
				/*
				const newId = nanoid(11);
				nodesStore.update((d) => {
					return [...d, ...[{ id: newId, label: statementB }]];
				});
				*/
				publicStore.create(path + '/' + statementA, statementB, (d) => {
					console.log(d);
					value = '';
					statementA = '';
					statementB = '';
					statementAId = '';
				});

				/*
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
				*/
			}
		},
		attributeChanged = (e) => {
			publicStore.update($activeNodeStore, e.detail, (d) => {});
		},
		removeAttribute = (e) => {
			console.log($activeNodeStore + '/' + e.detail.key);
			publicStore.delete({ from: $activeNodeStore, key: e.detail.key }, (d) => {});
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

	let active = {};
	$: active; // = $nodesStore.find((d) => d.id === $activeNodeStore) || {};
	$: path = formatPath($page.url);
	$: graph = decodeURI(path.split('/')[1]);

	$: isRoot = $page.url.pathname === '/';
	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	onMount(() => {
		//console.log(isRoot);
		//console.log(tenant);
		// activeNodeStore.set(path);

		const pathParts = path.split('/');

		let parentPath = '';

		path.split('/').forEach((data, i) => {
			if (data) {
				nodesStore.update((d) => {
					return [...d, ...[{ id: parentPath + pathParts[i], label: decodeURI(pathParts[i]) }]];
				});

				if (i > 0) {
					edgesStore.update((d) => {
						return [
							...d,
							...[
								{
									source: parentPath.substring(0, parentPath.length - 1),
									target: parentPath + pathParts[i]
								}
							]
						];
					});
				}

				parentPath = parentPath + data + '/';

				if (i === pathParts.length - 1) {
					activeNodeStore.set(path);
				}
			}
		});
	});

	activeNodeStore.subscribe((activeNode) => {
		active = {};
		if (activeNode) {
			// console.log(activeNode);

			publicStore.read(activeNode).on((d) => {
				if (d) {
					//console.log('change');
					//console.log(d);
					Object.keys(d).forEach((key) => {
						if (key !== '_') {
							if (d[key] === null) {
								delete active[key];
							} else {
								if (
									typeof d[key] === 'string' ||
									typeof d[key] === 'number' ||
									typeof d[key] === 'boolean'
								) {
									if (d[key]) active[key] = { type: 'text', label: key, value: d[key] };
								} else {
									//console.log(d[key]['#']);
									active[key] = { type: 'object', label: key, value: d[key]['#'] };
								}
							}
						}
					});
				}
			});
		}
	});
</script>

<div class="px-3 mt-3 text-sm">
	{#if $userStore}
		<div class="float-right">
			<Tooltip position="left" text="Log out {$userStore.alias}">
				<Button ghost={true} on:buttonClick={signOut}>
					<Icon classNames="fas fa-sign-out" />
				</Button>
			</Tooltip>
		</div>
	{/if}

	<h2 class="text-3xl">
		{#if active.icon}<i class="fal fa-{active.icon.value} opacity-50 mr-2" />{/if}
		{active.label ? active.label.value : $activeNodeStore}
	</h2>

	<div class="opacity-50 text-xs mb-3">{$activeNodeStore}</div>

	<!-- form class="mb-3" on:submit|preventDefault>
		<div class="relative">
			<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
				<i class="fas fa-search opacity-50" />
			</div>
			<input
				type="text"
				id="search"
				placeholder="Search"
				class="block p-2 pl-10 w-full rounded bg-slate-600"
				required
			/>
		</div>
	</form -->

	<Login />

	<h2 class="my-3 uppercase opacity-50">Attributes</h2>

	<form on:submit|preventDefault>
		<div class="grid grid-cols-12 gap-3 mb-2">
			<div class="col-span-4">
				<div class="relative">
					<!--div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
			<i class="fas fa-search opacity-50" />
		</div-->
					<input
						type="text"
						bind:value={statementA}
						placeholder={'Name'}
						class="py-1 px-2 w-full outline-none rounded bg-slate-600"
						required
						on:keyup={addForm}
					/>
				</div>
			</div>
			<div class="col-span-8 relative">
				<input
					type="text"
					use:init
					bind:value={statementB}
					placeholder={'Value'}
					class="w-full py-1 px-2 outline-none rounded bg-slate-600"
					required
					on:keyup={addForm}
				/>
				<button
					type="button"
					on:click={(e) => submit()}
					class="absolute uppercase right-2.5 top-1 text-sm"
					><i class="fas fa-plus mr-1" />Add</button
				>
			</div>
		</div>
	</form>

	<Form
		bind:data={active}
		disableDelete={false}
		on:valueChanged={attributeChanged}
		on:removeAttribute={removeAttribute}
	/>
	<!--
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
	-->
</div>
