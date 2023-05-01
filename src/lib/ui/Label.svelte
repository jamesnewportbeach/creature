<script>
	import { userStore, gun, languageStore } from '$lib/stores/gun/store';
	import { onMount } from 'svelte';
	import User from './User.svelte';

	export let path = '';

	let data = '',
		isEditMode = false;

	$: data;

	$: pathArr = path.split('/');

	$: {
	}

	onMount(() => {
		data = pathArr[pathArr.length - 2];
		gun.path(pathArr + '@' + $languageStore).on((d) => {
			data = d;
		});
	});
</script>

<span>{data}</span>
