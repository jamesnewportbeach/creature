<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let currentPage = '';

	onMount(() => {});
</script>

<div class="flex-none bg-slate-900 text-white text-sm z-10">
	<div class="bg-slate-600 inline-block px-4">
		<button class="py-2 mr-1 opacity-50 hover:opacity-100"><i class="fas fa-times" /></button>
		<button class="py-2 hover:opacity-100">{decodeURI(currentPage.replaceAll('/', ' '))}</button>
	</div>
</div>
