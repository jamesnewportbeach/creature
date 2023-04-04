<script lang="ts">
	import { onMount } from 'svelte';
	import { locale, t } from '../../stores/translations/i18n';
	import { page } from '$app/stores';
	import Frame from '$lib/App/Frame.svelte';

	import Nav from '$lib/App/EditPane/Nav.svelte';
	import Layers from '$lib/App/EditPane/Layers.svelte';
	import Login from '$lib/App/EditPane/Login.svelte';
	import Settings from '$lib/App/EditPane/Settings.svelte';
	import DataObject from '$lib/App/EditPane/Data/DataObject.svelte';
	import Element from '$lib/App/Element.svelte';

	export let user = null;
	export let focused = null;
	export let nodes = {};
	export let pageData;
	export let API;

	$: currentPage = $page.url.pathname.toLowerCase();

	let panelContainerClass = 'text-xs p-2 border-t border-black-transDark',
		panelHeaderClass = 'uppercase select-none text-xs leading-normal mb-2 mt-1';

	onMount(() => {});
</script>

<Nav on:sendEvent {API} />

{#if user?.pub}
	<Element
		{API}
		on:sendEvent
		dragDisabled={true}
		dropFromOthersDisabled={true}
		tagName="div"
		className={panelContainerClass}
	>
		<Element
			{API}
			dragDisabled={true}
			dropFromOthersDisabled={true}
			tagName="h2"
			className={panelHeaderClass}
		>
			<Element
				{API}
				dragDisabled={true}
				dropFromOthersDisabled={true}
				tagName="i"
				className="fa-light fa-cubes mr-2 opacity-50"
			/>
			{$t('components.' + $locale)}
		</Element>

		<Frame {API} editorEnabled={false} templatePath="/components" on:sendEvent />
	</Element>

	<Element
		{API}
		dragDisabled={true}
		dropFromOthersDisabled={true}
		tagName="form"
		className={panelContainerClass}
	>
		<Element
			{API}
			dragDisabled={true}
			dropFromOthersDisabled={true}
			tagName="h2"
			className={panelHeaderClass}
		>
			<Element
				{API}
				dragDisabled={true}
				dropFromOthersDisabled={true}
				tagName="i"
				className="fa-light fa-database mr-2 opacity-50"
			/>
			{$t('data.' + $locale)}
		</Element>

		<DataObject
			root={true}
			data={pageData}
			id={currentPage}
			{API}
			showAddForm={true}
			on:sendEvent
		/>
	</Element>

	{#if focused}
		<Element
			{API}
			dragDisabled={true}
			dropFromOthersDisabled={true}
			tagName="form"
			className={panelContainerClass}
		>
			<Element
				{API}
				dragDisabled={true}
				dropFromOthersDisabled={true}
				tagName="h2"
				className={panelHeaderClass}
			>
				<Element
					{API}
					dragDisabled={true}
					dropFromOthersDisabled={true}
					tagName="i"
					className="fa-light fa-sliders mr-2 opacity-50"
				/>
				{$t('settings.' + $locale)}
			</Element>
			<Element
				{API}
				dragDisabled={true}
				dropFromOthersDisabled={true}
				tagName="fieldset"
				className="flex flex-col"
			>
				<Settings {API} bind:data={nodes[focused]} on:sendEvent />
			</Element>
		</Element>
	{/if}

	{#if currentPage in nodes}
		<Element
			{API}
			dragDisabled={true}
			dropFromOthersDisabled={true}
			tagName="div"
			className={panelContainerClass}
		>
			<Element
				{API}
				dragDisabled={true}
				dropFromOthersDisabled={true}
				tagName="h2"
				className={panelHeaderClass}
			>
				<Element
					{API}
					dragDisabled={true}
					dropFromOthersDisabled={true}
					tagName="i"
					className="fa-light fa-layer-group mr-2 opacity-50"
				/>
				{$t('layers.' + $locale)}
			</Element>

			<Layers id={currentPage} bind:nodes on:sendEvent />
		</Element>
	{/if}
{:else}
	<Login {API} on:sendEvent />
{/if}
