<script lang="ts">
	import { t, darkMode, selectedTab } from '$lib/stores/gun/store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Caret from '$lib/common/Caret.svelte';
	import LanguageSelect from './LanguageSelect.svelte';
	import LightSwitch from './LightSwitch.svelte';
	import LogoutButton from './LogoutButton.svelte';

	onMount(() => {
		darkMode.subscribe(() => {
			const elemHtmlClassList = document.documentElement.classList;
			$darkMode ? elemHtmlClassList.add('dark') : elemHtmlClassList.remove('dark');
		});
	});

	const navItems = [
		{
			id: 'a',
			label: 'Graduation',
			path: '/product',
			children: [
				{ label: 'Graduation Products', children: [] },
				{ label: 'Announcements & Accessiories', children: [] },
				{ label: 'Caps & Gowns', children: [] },
				{ label: 'Class Apparel', children: [] },
				{ label: 'College Frames', children: [] },
				{ label: 'Custom Photo Products', children: [] },
				{ label: 'Achievement Jackets', children: [] },
				{ label: 'HJ SmartShare', children: [] },
				{ label: 'StageClip', children: [] }
			]
		},
		{
			id: 'b',
			label: 'Class Rings & Jewelery',
			path: '/product',
			children: [
				{ label: 'High School Class Jewelery', children: [] },
				{ label: 'College Rings', children: [] },
				{ label: 'Cellestial Collection', children: [] },
				{ label: 'Greek Jewelery', children: [] },
				{ label: 'Champ Rings', children: [] },
				{ label: 'Cheer Rings', children: [] }
			]
		},
		{ id: 'c', label: 'Yearbooks', path: '/pages/2022/3', children: [] },
		{
			id: 'd',
			label: 'Resources',
			path: '/resources',
			children: [
				{ label: 'Class Rings & Jewelery', children: [] },
				{ label: 'College Partners', children: [] },
				{ label: 'Graduation', children: [] },
				{ label: 'Yearbook', children: [] }
			]
		},
		{
			id: 'e',
			label: 'About',
			path: '/about',
			children: [
				{ label: 'Careers', children: [] },
				{ label: 'Internship Program', children: [] },
				{ label: 'Diversity & Inclusion', children: [] },
				{ label: 'COVID-19 Response', children: [] },
				{ label: 'Newsroom', children: [] },
				{ label: 'Community Envolvement', children: [] },
				{ label: 'Sustainability', children: [] },
				{ label: 'Jewelery Warranty', children: [] }
			]
		},
		{ id: 'f', label: 'Contact', path: '/contact', children: [] }
	];
</script>

<!-- svelte:body on:click={() => selectedTab.set('')} / -->

<div class="w-full shadow-md z-40 bg-primary">
	<div
		class="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8"
	>
		<div class="p-4 flex flex-row items-center justify-between">
			<button
				class:text-white={$darkMode}
				style="width: 200px; height: 52px; overflow: hidden;"
				on:click={() => {
					goto('/');
				}}
				><svg
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0"
					y="0"
					viewBox="0 0 652 652"
					fill="currentColor"
					style="margin-top: -73px"
				>
					<g>
						<path
							d="M263.8,387.5c3.1-10.9-3.3-22.3-14.4-25.5c-11.1-3.2-22.6,3.1-25.7,13.9c-3.1,10.9,3.3,22.3,14.4,25.5
	C249.2,404.6,260.7,398.4,263.8,387.5"
						/>
						<path
							d="M357.3,238.8l-24.1,45.7h-15.7c14.5-27.3,19.8-37.3,24.2-45.7h-45c-6.8,13-25.8,49.3-56.6,107.6h44.5
	c8.3-15.6,17.9-33.5,24.5-45.9h15.8l-21.4,40.8c-2.1,3.9-4,7.6-5.7,10.7c-5,9.5-10.3,19.5-15.7,28.4c-2.8,4.6-5.9,8.7-9.7,12.2
	c-3.8,3.5-10.1,7.6-15.7,9.7c23.4,0.4,42.6-8.6,57.5-19c15.2-10.6,22.8-22.5,34.1-42l53.9-102.5H357.3z"
						/>
						<path
							d="M195.9,300.8v45.6h3.9v-21.4h9.2v-3.6h-9.2v-16.9h9.5v-3.6H195.9z M154.8,300.8v45.6h3.9v-21.4h9.2v-3.6h-9.2v-16.9h9.5
	v-3.6H154.8z M122.6,308.6v9.6c0,3.2-1.6,4.7-4.8,4.7h-4.5v-18.4h5C121.2,304.5,122.6,305.8,122.6,308.6 M122.2,324.7
	c2.7-1,4.3-2.9,4.3-7.2v-8.7c0-5.3-2.7-7.9-8-7.9h-9v45.6h3.9v-19.9h4.4c3.3,0,4.9,1.5,4.9,4.7v15.2h3.9v-15.3
	C126.5,327.3,125,325.5,122.2,324.7 M67.7,300.8v45.6h13.9v-3.7h-10V325h9.5v-3.6h-9.5v-16.9h9.8v-3.6H67.7z M25.4,321.4v-20.5
	h-3.9v45.6h3.9V325h10v21.4h3.9v-45.6h-3.9v20.5H25.4z"
						/>
						<path
							d="M594.6,324.3l-6.7-4.9c-1.8-1.4-2.6-2.5-2.6-5v-5.8c0-2.7,1.4-4,4.2-4h1c2.9,0,4.2,1.3,4.2,4v8.1h3.8v-8
	c0-5.1-2.7-7.8-7.9-7.8h-1.2c-5.4,0-8,2.7-8,7.9v5.7c0,3.6,1,5.9,4.1,8.1l6.7,5c1.8,1.4,2.6,2.5,2.6,5v7c0,2.7-1.4,4-4.2,4h-1.2
	c-2.8,0-4.2-1.3-4.2-4V330h-3.8v9.4c0,5.1,2.7,7.8,7.9,7.8h1.4c5.3,0,8-2.7,8-7.9v-6.9C598.7,328.6,597.7,326.6,594.6,324.3
	 M539.9,301.2v45.6h13.9v-3.7h-10v-17.8h9.5v-3.7h-9.5v-16.9h9.8v-3.6H539.9z M511.6,346.8v-45.6h-3.7v19.2l0.1,17.3l-9.9-36.5
	h-4.9v45.6h3.7v-19.6l-0.1-18l10.3,37.6H511.6z M461,308.7v30.7c0,2.8-1.4,4.2-4.2,4.2h-1.8c-2.9,0-4.2-1.4-4.2-4.2v-30.7
	c0-2.8,1.4-4.2,4.2-4.2h1.8C459.6,304.5,461,305.9,461,308.7 M464.9,339.2v-30.4c0-5.2-2.7-7.9-8-7.9h-2.1c-5.3,0-8,2.7-8,7.9v30.4
	c0,5.3,2.7,8,8,8h2.1C462.2,347.2,464.9,344.5,464.9,339.2 M418.7,301.2h-4v37.4c0,3.2-1.2,4.6-4.4,4.6h-2.1v3.7h2.3
	c5.6,0,8.1-2.7,8.1-8.2V301.2z"
						/>
						<path
							d="M616.9,347.2c2.5,0,4.5-2,4.5-4.5c0-2.5-2-4.5-4.5-4.5c-2.5,0-4.5,2-4.5,4.5C612.4,345.2,614.4,347.2,616.9,347.2
	 M616.9,346.6c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4C620.9,344.9,619.1,346.6,616.9,346.6 M617.7,342.9
	c0.9,0,1.6-0.4,1.6-1.4c0-0.4-0.2-0.9-0.6-1.1c-0.4-0.2-0.8-0.3-1.2-0.3h-2.2v5h0.6v-2.3h1.1l1.4,2.3h0.7L617.7,342.9z
	 M615.9,342.4v-1.8h1.4c0.6,0,1.3,0.1,1.3,0.9c0,1-1.1,0.9-1.8,0.9H615.9z"
						/>
					</g>
				</svg></button
			>
		</div>
		<nav class="flex pb-4 items-center justify-center text-sm">
			<ul class="menu menu-compact menu-horizontal p-2">
				{#each navItems as item}
					<li>
						{#if item.children && item.children.length > 0}
							<span>
								<button class:bg-primary={$selectedTab === item.id}>
									<span>{$t(item.label)}</span>
									<Caret isOpen={$selectedTab === item.id} />
								</button>
							</span>

							<ul class="rounded-box p-2 bg-base-300">
								{#each item.children as child}
									<li class:bg-secondary={$selectedTab === child.id}>
										<button on:click|stopPropagation={() => goto(child.path)}>{child.label}</button>
									</li>
								{/each}
							</ul>
						{:else}
							<button
								class:bg-secondary={$selectedTab === item.id}
								on:click|stopPropagation={() => selectedTab.set(item.id)}>{$t(item.label)}</button
							>
						{/if}
					</li>
				{/each}
			</ul>

			<LanguageSelect />
			<LightSwitch />
			<LogoutButton />
		</nav>
	</div>
</div>
