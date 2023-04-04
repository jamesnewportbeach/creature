<script lang="ts">
	import VanillaGuides, { PROPERTIES, EVENTS } from '@scena/guides';
	import type { GuidesOptions } from '@scena/guides';

	import { onMount, onDestroy, beforeUpdate, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let style = { width: '100%', height: '100%' };
	export let guides: VanillaGuides = null;
	export let scrollPos = 0;

	const changeScroll = (d) => {
		if (guides) {
			guides.scrollGuides(d);
			guides.scroll(d);
		}
	};

	$: scrollMe = changeScroll(scrollPos);

	let scrollX = 0,
		scrollY = 0,
		options: Partial<GuidesOptions> = {
			guidePosFormat: (d) => {
				return Math.round(d);
			}
		},
		guidesElement: HTMLElement;

	const onResize = (e) => {
			guides.resize();
		},
		onWheel = (e) => {
			scrollX += e.deltaX;
			scrollY += e.deltaY;
			guides.scrollGuides(scrollY);
			guides.scroll(scrollX);
		};

	function setStyle() {
		const elStyle = guidesElement.style;

		for (const name in style) {
			if (elStyle[name] === style[name]) {
				continue;
			}
			elStyle[name] = style[name];
		}
	}

	beforeUpdate(() => {
		const props = $$props;

		options = {};

		PROPERTIES.forEach((name) => {
			if (name === 'style') return;
			if (name in props) (options as any)[name] = props[name];
		});

		if (guides) setStyle();
	});

	onMount(() => {
		setStyle();
		guides = new VanillaGuides(guidesElement, options);

		EVENTS.forEach((name, i) => {
			guides.on(name as any, (e) => {
				dispatch(name, e);
			});
		});
	});

	onDestroy(() => {
		if (guides) guides.destroy();
	});
</script>

<svelte:window on:resize={onResize} on:wheel={onWheel} />
<!-- svelte:body on:touchstart|preventDefault / -->

<div class="guides" bind:this={guidesElement} />
