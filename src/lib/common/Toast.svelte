<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let type = 'info';
	export let show = false;

	function cancel(e) {
		console.log('clicking....');
		dispatch('cancel', {});
	}
</script>

{#if show}
	<div class="toast">
		<div class="alert alert-{type}">
			<div>
				<span>
					<slot />
					<button
						on:click={(e) => {
							show = false;
							cancel(e);
						}}>OK</button
					>
				</span>
			</div>
		</div>
	</div>
{/if}
