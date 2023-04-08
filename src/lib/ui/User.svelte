<script>
	import { publicStore } from '$lib/stores/gun/store';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let id = '';

	let o = {};

	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';
	$: userId = tenant && id ? id.replace('public/', '') : null;
	$: url = tenant && id ? id.replace('public/' + tenant, '') : null;

	onMount(() => {
		if (userId && id) {
			publicStore.read(userId).once((d) => {
				delete d._;
				d.id = userId;
				o = d;
			});
		}

		// gun.get('home').get('lights').get('state').put('on');
	});
</script>

<a href={url}>{o.alias}</a>
