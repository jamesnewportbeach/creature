<script lang="ts">
	import PageTitle from '$lib/ui/PageTitle.svelte';
	import { t } from '$lib/stores/gun/store';

	export let title = '';
	export let hideAppBar = false;
	export let noPadding = false;
	export let metaDescription = '';
</script>

<svelte:head>
	{#if title}
		<title>Herff Jones | {$t(title)}</title>
	{/if}
	{#if metaDescription}
		<meta name="description" content={metaDescription} />
	{/if}
</svelte:head>

<div class="flex grow">
	<div class:p-4={!hideAppBar && !noPadding} class="flex flex-col w-full h-full">
		{#if title}
			<PageTitle>{$t(title)}</PageTitle>
		{/if}
		<slot default />
	</div>

	{#if $$slots.rightPanel}
		<div class="p-4 flex-initial w-1/3 h-full z-10">
			<slot name="rightPanel" />
		</div>
	{/if}
</div>
