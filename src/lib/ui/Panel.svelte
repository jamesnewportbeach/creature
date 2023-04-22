<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { activeNodeStore } from '$lib/stores/ui/app-store';
	import { userStore, privateStore, publicStore } from '$lib/stores/gun/store';
	import Form from '$lib/common/Form.svelte';
	import Login from '$lib/ui/Login.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import Button from '$lib/common/Button.svelte';
	import Icon from '$lib/common/Icon.svelte';
	import AddForm from './AddForm.svelte';

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	const signOut = () => {
			if ($userStore)
				privateStore.logout($userStore.pub, tenant, () => {
					//console.log('logged out!!!');
				});
		},
		attributeChanged = (e) => {
			publicStore.update($activeNodeStore, e.detail, (d) => {});
		},
		removeAttribute = (e) => {
			publicStore.delete($activeNodeStore + '/' + e.detail.key, (d) => {});
		};

	let active = {};
	$: active; // = $nodesStore.find((d) => d.id === $activeNodeStore) || {};
	$: endPath = '';
	$: parentPath = '';
	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	const setPage = (pathName) => {
		if (tenant) {
			const pathParts = pathName.split('/');
			if (pathParts.length > 1) {
				endPath = pathParts.pop();
				const start = pathParts.shift();
				parentPath = pathParts.join('/');
			}

			const f = tenant + '/' + pathName.replace('/', '');
			activeNodeStore.set(f);
		}
	};

	page.subscribe((p) => {
		setPage(p.url.pathname);
		/*
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
		*/
	});

	onMount(() => {
		setPage($page.url.pathname);
	});

	const toDateString = (date) => {
		return (
			date.getFullYear().toString() +
			'-' +
			('0' + (date.getMonth() + 1)).slice(-2) +
			'-' +
			('0' + date.getDate()).slice(-2) +
			'T' +
			date.toTimeString().slice(0, 5)
		);
	};

	activeNodeStore.subscribe((activeNode) => {
		if (activeNode) {
			console.log($activeNodeStore);

			publicStore.read($activeNodeStore).on((d) => {
				if (d) {
					//console.log('change');
					//console.log(d);
					const newActive = {};
					Object.keys(d).forEach((key) => {
						if (key !== '_') {
							if (d[key] === null) {
								// delete active[key];
							} else {
								let t = typeof d[key];
								if (t === 'string' || t === 'number' || t === 'boolean') {
									if (d[key] !== null) {
										let newItem = { label: key, value: d[key] };

										if (t === 'number') {
											const testDate = new Date(d[key]);
											if (testDate.getMonth()) {
												newItem.type = 'datetime-local';
												newItem.value = toDateString(testDate);
											} else {
												newItem.type = t;
											}
										} else if (t === 'boolean') {
											newItem.type = 'checkbox';
										} else if (t === 'string') {
											newItem.type = 'text';
										} else {
										}
										newActive[key] = newItem;
									}
								} else {
									//console.log(d[key]['#']);
									newActive[key] = { type: 'object', label: key, value: d[key]['#'] };
								}
							}
						}
					});

					active = newActive;
				}
			});
		}
	});
</script>

{#if $userStore}
	<div class="text-right">
		<Tooltip position="left" text="Log out {$userStore.alias}">
			<Button ghost={true} on:buttonClick={signOut}>
				<Icon classNames="fas fa-sign-out" />
			</Button>
		</Tooltip>
	</div>
{/if}

<div class="px-3 mt-3 text-sm">
	<div class="opacity-50 text-sm mb-1">
		<a href={'/' + parentPath}>{parentPath.split('/').join(' > ') || tenant}</a>
	</div>

	<h2 class="leading-0 break-all mb-3">
		{#if active.icon}<i class="fal fa-{active.icon.value} opacity-50 mr-2" />{/if}
		{active.label ? $page.url.pathname : endPath}
	</h2>

	<AddForm />

	<Form
		bind:data={active}
		disableDelete={false}
		on:valueChanged={attributeChanged}
		on:removeAttribute={removeAttribute}
	/>

	<Login />

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
