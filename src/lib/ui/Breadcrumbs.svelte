<script>
	export let path = '';

	let items = [];

	$: {
		if (path) {
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
	}
</script>

<a href="/">{path === '' ? 'public' : path}</a>

{#each items as item}
	<span class="opacity-50 mr-2">&gt;</span>
	<a href={item.path} class="mr-2">{item.key}</a>
{/each}
