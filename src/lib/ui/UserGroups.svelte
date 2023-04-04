<script>
	import Group from '$lib/ui/Group.svelte';
	import { publicStore } from '$lib/stores/gun/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let users = [];

	let nodes = {
		node1: {
			label: 'Groups',
			id: 'main',
			items: []
		}
	};

	onMount(() => {
		publicStore
			.read($page.params.slug)
			.map()
			.on((d) => {
				console.log('DDDDD');
				console.log(d);
			});

		// gun.get('home').get('lights').get('state').put('on');
	});
</script>

<Group node={nodes.node1} bind:nodes />
