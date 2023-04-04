<script>
	export let type = 'p';
	export let className = '';
</script>

<svelte:element this={type} class={className}><slot /></svelte:element>
