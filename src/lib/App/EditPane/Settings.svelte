<script lang="ts">
	import { locale, t } from '../../stores/translations/i18n';
	import Element from '$lib/App/Element.svelte';
	import { InputTypes, ContainerTypes, ButtonTypes } from './common.interface';
	import { Input } from 'svelte-materialify';

	export let data;
	export let API;

	const formatLanguage = (o) => {
		Object.keys(o).forEach((d) => {
			o[d] = { label: $t(d + '.' + $locale) || d };
		});
		return o;
	};
</script>

{#if data}
	{#if data.tagName in InputTypes || data.tagName === 'button'}
		<Element
			{API}
			bind:value={data.type}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="select"
			id="type"
			label={$t('element.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
			buttonIcon="fa-light fa-caret-down"
			dataList={data.tagName in InputTypes
				? formatLanguage(InputTypes)
				: formatLanguage(ButtonTypes)}
		/>
	{/if}

	<Element
		{API}
		bind:value={data.className}
		on:sendEvent
		dragDisabled={true}
		dropFromOthersDisabled={true}
		updateEvent="updateElement"
		tagName="textarea"
		rows={2}
		id="className"
		label={$t('classNames.' + $locale)}
		className="flex"
		labelClassName="opacity-50 w-1/3"
	/>

	<Element
		{API}
		bind:value={data.style}
		on:sendEvent
		dragDisabled={true}
		dropFromOthersDisabled={true}
		updateEvent="updateElement"
		tagName="textarea"
		rows={2}
		id="style"
		label={$t('style.' + $locale)}
		className="flex"
		labelClassName="opacity-50 w-1/3"
	/>

	{#if data.type in InputTypes}
		<Element
			{API}
			bind:value={data.value}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="textarea"
			rows={2}
			id="value"
			label={$t('value.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>
	{/if}

	{#if data.tagName === 'button'}
		<Element
			{API}
			bind:value={data.buttonType}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="select"
			id="buttonType"
			label={$t('type.' + $locale)}
			buttonIcon="fa-light fa-caret-down"
			dataList={formatLanguage(ButtonTypes)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>
	{/if}

	{#if data.tagName === 'a'}
		<Element
			{API}
			bind:value={data.href}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="input"
			type="text"
			id="href"
			label={$t('href.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
			buttonIcon="fa-light fa-link"
		/>
	{/if}

	{#if data.tagName === 'a' || data.tagName === 'button'}
		<Element
			{API}
			bind:value={data.title}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="input"
			type="text"
			id="title"
			label={$t('title.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>
	{/if}

	{#if data.type === 'text' || data.type === 'email'}
		<Element
			{API}
			bind:value={data.placeholder}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="input"
			type="text"
			id="placeholder"
			label={$t('placeholder.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>
	{/if}

	{#if data.type in InputTypes}
		<Element
			{API}
			bind:value={data.label}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="input"
			type="text"
			id="label"
			label={$t('label.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>

		<Element
			{API}
			bind:value={data.hint}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="input"
			type="text"
			id="hint"
			label={$t('hint.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>

		<Element
			{API}
			bind:value={data.disabled}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="input"
			type="checkbox"
			id="disabled"
			label={$t('disabled.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>
		<Element
			{API}
			bind:value={data.readonly}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="input"
			type="checkbox"
			id="readonly"
			label={$t('readonly.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>
		<Element
			{API}
			bind:value={data.required}
			on:sendEvent
			dragDisabled={true}
			dropFromOthersDisabled={true}
			updateEvent="updateElement"
			tagName="input"
			type="checkbox"
			id="required"
			label={$t('required.' + $locale)}
			className="flex"
			labelClassName="opacity-50 w-1/3"
		/>
	{/if}
{/if}
