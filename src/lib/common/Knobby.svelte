<script>
	import { derived, writable } from 'svelte/store';

	import { onMount } from 'svelte';
	import * as knobby from 'svelte-knobby';

	let controls = writable({});

	onMount(() => {
		controls = knobby.panel({
			$label: 'Main options',
			a: 1,
			b: 2,
			message: 'Hello World!',
			color: '#ff3e00',
			clicks: 0,
			checked: false,

			// functions become buttons. if state is returned, it will
			// update the store
			increment: (value) => ({
				...value,
				clicks: value.clicks + 1
			}),

			constrained: {
				$label: 'labelled input',
				value: 50,
				min: 0,
				max: 100,
				step: 1
			},

			folder: {
				$label: 'labelled folder',
				a: 1, // accessed as $controls.folder.a
				b: 2,
				nested: {
					c: 3, // accessed as $controls.folder.nested.c
					d: 4
				}
			}
		});
	});
</script>

<p>{$controls.a} + {$controls.b} = {$controls.a + $controls.b}</p>

<style>
	:global(body > details.knobby) {
		display: 'block !important';
		position: 'static !important';
		--knobby-internal-hue: 'red';
	}
</style>
