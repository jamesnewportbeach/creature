<script>
	export let text = 'Tool tip';
	export let position = 'bottom';
</script>

<div
	class="tooltip"
	class:tooltip-bottom={position === 'bottom'}
	class:tooltip-top={position === 'top'}
	class:tooltip-left={position === 'left'}
	class:tooltip-right={position === 'right'}
	data-tip={text}
>
	<slot />
</div>
