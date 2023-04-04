<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { locales, locale, t } from '$lib/stores/translations/i18n';
	import { userStore, focusedStore, nodeStore } from '../../stores/ui/uiStore';

	export let API;

	let canUndo = true,
		canRedo = false,
		navItemClass =
			'w-7 py-1 hover:bg-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-900 select-none cursor-pointer',
		screenSizes = [
			{ id: 'mobile', label: 'Mobile', icon: 'fa-light fa-mobile-screen' },
			{ id: 'tablet', label: 'Tablet', icon: 'fa-light fa-tablet-screen' },
			{ id: 'screen', label: 'Full', icon: 'fa-light fa-display' }
		];
</script>

<nav class="bg-zinc-300 dark:bg-zinc-800 w-full text-sm">
	<ul class="flex w-full pl-0">
		<li class="flex w-full">
			<button
				type="button"
				class={navItemClass}
				title="Close"
				on:click={API.toggle({ key: '_user/panelOpen' })}><i class="fa-light fa-times" /></button
			>
		</li>
		<li class="flex">
			<select bind:value={$locale} class="text-xs mr-3 outline-none bg-transparent">
				{#each locales as l}
					<option value={l}>{$t('language.' + l)}</option>
				{/each}
			</select>
		</li>
		<li class="flex">
			<button
				type="button"
				class={navItemClass}
				title="Close"
				on:click={API.toggle({ key: '_user/dark' })}
				><i class={$userStore?.dark ? 'fa-regular fa-sun' : 'fa-regular fa-moon'} /></button
			>
		</li>
		<li class="flex">
			<button
				type="button"
				class={navItemClass}
				title="Outlines"
				on:click={API.toggle({ key: '_user/outlines' })}
				><i
					class={$userStore?.outlines
						? 'fa-light fa-square-dashed'
						: 'fa-light fa-square-dashed opacity-50'}
				/>
			</button>
		</li>
		<li class="flex">
			<button
				type="button"
				class={navItemClass}
				title="Ruler"
				on:click={API.toggle({ key: '_user/ruler' })}
				><i class={$userStore?.ruler ? 'fa-light fa-ruler' : 'fa-light fa-ruler opacity-50'} />
			</button>
		</li>
		<li class="flex">
			<button type="button" class={navItemClass} title="Ruler" on:click={API.clearTemplate()}
				><i class={'fa-light fa-ban'} />
			</button>
		</li>

		<li class="flex">
			<button type="button" class={navItemClass} title="Undo" on:click={API.undo()}
				><i class={'fa-light fa-undo'} />
			</button>
		</li>

		<li class="flex">
			<button type="button" class={navItemClass} title="Redo" on:click={API.redo()}
				><i class={'fa-light fa-redo'} />
			</button>
		</li>

		<li class="flex">
			<button type="button" class={navItemClass} title="Save" on:click={API.saveTemplate()}
				><i class={'fa-light fa-floppy-disk'} />
			</button>
		</li>

		<li class="flex">
			<button type="button" class={navItemClass} title="Sign out" on:click={API.logout()}
				><i class={'fa-light fa-right-from-bracket'} />
			</button>
		</li>
	</ul>
</nav>
