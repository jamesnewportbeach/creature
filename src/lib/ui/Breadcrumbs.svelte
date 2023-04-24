<script>
	import { page } from '$app/stores';

	export let path = '';

	let items = [];
	$: tenant = $page.url.hostname?.indexOf('.') > -1 ? $page.url.hostname.split('.')[0] : 'www';

	$: {
		const pathParts = path.split('/');
		const tenants = pathParts.shift();
		const tenant = pathParts.shift();
		const page = pathParts.pop();

		const p = [];
		items = [];

		pathParts.forEach((key, index) => {
			p.push(key);
			items.push({ path: '/' + p.join('/'), key });
		});
	}
</script>

<a href="/" class="mr-2">{tenant}</a> <span class="opacity-50 mr-2">&gt;</span>

{#each items as item}
	<a href={item.path} class="mr-2">{item.key}</a> <span class="opacity-50 mr-2">&gt;</span>
{/each}
