<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { activeNodeStore } from '$lib/stores/ui/app-store';
	import { userStore, privateStore, publicStore, gun } from '$lib/stores/gun/store';
	import Form from '$lib/common/Form.svelte';
	import Login from '$lib/ui/Login.svelte';
	import Tooltip from '$lib/common/Tooltip.svelte';
	import Button from '$lib/common/Button.svelte';
	import Icon from '$lib/common/Icon.svelte';
	import AddForm from './AddForm.svelte';
	import Breadcrumbs from './Breadcrumbs.svelte';

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	const datetimeLocal = (datetime) => {
		const dt = new Date(datetime);
		dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
		return dt.toISOString().slice(0, 16);
	};

	const signOut = () => {
			if ($userStore) privateStore.logout($userStore.pub, tenant);
		},
		attributeChanged = (e) => {
			publicStore.update($activeNodeStore, e.detail, (d) => {});
		},
		removeAttribute = (e) => {
			gun
				.path($activeNodeStore.split('/'))
				.get(e.detail.key)
				.put(null, (d) => {});
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
	});

	onMount(() => {
		setPage($page.url.pathname);
	});

	activeNodeStore.subscribe((activeNode) => {
		if (activeNode) {
			gun.path($activeNodeStore.split('/')).on((d) => {
				if (d) {
					const newActive = {};
					Object.keys(d).forEach((key) => {
						if (key !== '_') {
							if (d[key] !== null) {
								let t = 'text';
								if (t === 'object') {
									newActive[key] = { type: 'object', label: key, value: d[key]['#'] };
								} else {
									let newItem = { label: key, value: d[key], type: t };

									if (
										t === 'datetime-local' ||
										t === 'date' ||
										t === 'time' ||
										t === 'month' ||
										t === 'week'
									) {
										newActive[key] = datetimeLocal(newItem);
									} else {
										newActive[key] = newItem;
									}
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
	<div class="float-right mt-1 mr-3">
		<Tooltip position="left" text="Log out {$userStore.alias}">
			<Button ghost={true} on:buttonClick={signOut}>
				<Icon classNames="fas fa-sign-out" />
			</Button>
		</Tooltip>
	</div>
{/if}

<div class="px-3 mt-3 text-sm">
	<div class="text-sm mb-1">
		<Breadcrumbs path={$activeNodeStore} />
	</div>

	<h2 class="break-all mb-3 mt-3">
		{#if active.icon}<i class="fal fa-{active.icon.value} opacity-50 mr-2" />{/if}
		{active.label ? $page.url.pathname : endPath}
	</h2>

	<AddForm path={$activeNodeStore} />

	<Form
		bind:data={active}
		disableDelete={false}
		on:valueChanged={attributeChanged}
		on:removeAttribute={removeAttribute}
	/>

	<Login />
</div>
