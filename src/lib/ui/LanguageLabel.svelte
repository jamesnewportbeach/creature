<script>
	import { gun, userLanguage } from '$lib/stores/gun/store';
	import { customStore } from '$lib/stores/gun/customStore';
	import { onMount } from 'svelte';

	export let path = '';
	export let property = 'label';

	const ref = gun.get('things').path(path.split('/')).get(property);
	const store = customStore(ref.map(), {});

	onMount(() => {});
</script>

{#if $userLanguage in $store}
	{$store[$userLanguage]}
{:else if 'en' in $store}
	{$store['en']}
{:else}
	{path.split('/')[path.split('/').length - 1]}
{/if}
